import 'server-only';

import { cookies } from 'next/headers';
import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';
import { promisify } from 'node:util';

import { readCollection, updateCollection } from './store';

const scrypt = promisify(scryptCallback);

export const SESSION_COOKIE = 'kmggp_admin_session';

/** How long a signed-in session stays valid, in seconds. */
const SESSION_TTL = 60 * 60 * 8;

/** Where a password changed from inside the panel is kept. */
const CREDENTIALS_COLLECTION = 'admin-credentials';

/**
 * The signing key for session cookies.
 *
 * In production this must come from the environment. Falling back to a fixed
 * string there would let anyone who has read the source mint their own admin
 * session, so we refuse to sign anything instead. In development a stable
 * throwaway key keeps you logged in across restarts.
 */
function sessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;

  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'SESSION_SECRET is missing or shorter than 32 characters. Generate one with ' +
        '`node scripts/admin-password.mjs --secret` and set it in the hosting environment.',
    );
  }
  return 'development-only-session-secret-not-for-production';
}

/* -------------------------------------------------------------------------- */
/* Passwords                                                                  */
/* -------------------------------------------------------------------------- */

/** Hash a plaintext password into the `scrypt:<salt>:<hash>` form we store. */
export async function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const derived = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${derived.toString('hex')}`;
}

async function verifyPassword(password, stored) {
  if (typeof stored !== 'string') return false;

  const [scheme, salt, expected] = stored.split(':');
  if (scheme !== 'scrypt' || !salt || !expected) return false;

  const derived = await scrypt(password, salt, 64);
  const expectedBuffer = Buffer.from(expected, 'hex');
  // timingSafeEqual throws on a length mismatch, so guard it first.
  if (expectedBuffer.length !== derived.length) return false;
  return timingSafeEqual(derived, expectedBuffer);
}

/**
 * Every account the login form accepts.
 *
 * The main admin ("admin" record) can rotate its password from inside the panel;
 * until it does, the value seeded through `ADMIN_USERNAME`/`ADMIN_PASSWORD_HASH`
 * is used. Any further records in the collection (for example a test account)
 * are extra logins with the same rights.
 */
async function allAccounts() {
  const saved = (await readCollection(CREDENTIALS_COLLECTION)) || [];
  // Older stores held a single record without an id — that one is the main admin.
  const mainSaved = saved.find((record) => record.id === 'admin' || !record.id);
  const main = mainSaved?.passwordHash
    ? { username: mainSaved.username || 'admin', passwordHash: mainSaved.passwordHash }
    : {
        username: process.env.ADMIN_USERNAME || 'admin',
        passwordHash: process.env.ADMIN_PASSWORD_HASH || '',
      };

  const extras = saved
    .filter((record) => record !== mainSaved && record.username && record.passwordHash)
    .map((record) => ({ username: record.username, passwordHash: record.passwordHash }));

  return [main, ...extras].filter((account) => account.passwordHash);
}

/** Whether an admin password has been configured at all. */
export async function isAdminConfigured() {
  return (await allAccounts()).length > 0;
}

/** Replace the main admin's username and password, keeping any extra accounts. */
export async function setCredentials(username, password) {
  const passwordHash = await hashPassword(password);
  await updateCollection(CREDENTIALS_COLLECTION, (items) => [
    { id: 'admin', username, passwordHash, updatedAt: new Date().toISOString() },
    ...items.filter((record) => record.id && record.id !== 'admin'),
  ]);
}

/** Check a username and password against every configured account. */
export async function checkCredentials(username, password) {
  const accounts = await allAccounts();
  const given = String(username || '').toLowerCase();

  let ok = false;
  // Check every account every time, so timing does not reveal which usernames exist.
  for (const account of accounts) {
    const passwordOk = await verifyPassword(password, account.passwordHash);
    const usernameOk = safeEqual(given, account.username.toLowerCase());
    if (passwordOk && usernameOk) ok = true;
  }
  return ok;
}

function safeEqual(a, b) {
  const bufferA = Buffer.from(a);
  const bufferB = Buffer.from(b);
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

/* -------------------------------------------------------------------------- */
/* Sessions                                                                   */
/* -------------------------------------------------------------------------- */

function sign(value) {
  return createHmac('sha256', sessionSecret()).update(value).digest('base64url');
}

function createToken(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${body}.${sign(body)}`;
}

function readToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;

  const [body, signature] = token.split('.');
  if (!body || !signature) return null;
  if (!safeEqual(signature, sign(body))) return null;

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload?.expiresAt || Date.now() > payload.expiresAt) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Issue a session cookie for `username`. */
export async function startSession(username) {
  const token = createToken({
    username,
    issuedAt: Date.now(),
    expiresAt: Date.now() + SESSION_TTL * 1000,
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_TTL,
  });
}

/** Clear the session cookie. */
export async function endSession() {
  const jar = await cookies();
  jar.delete(SESSION_COOKIE);
}

/** The signed-in admin, or `null`. Safe to call from anywhere on the server. */
export async function getSession() {
  const jar = await cookies();
  return readToken(jar.get(SESSION_COOKIE)?.value);
}

/**
 * Assert that the caller is signed in.
 *
 * Every server action and route handler that reads or changes admin data must
 * call this itself. The admin layout also checks, but a layout guard only
 * covers page rendering — it does nothing for a request posted straight at an
 * action, so relying on it alone would leave every action open to the public.
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session) throw new Error('Not authorised');
  return session;
}
