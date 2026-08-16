import 'server-only';

import { cookies } from 'next/headers';
import {
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from 'node:crypto';
import { promisify } from 'node:util';

import { readCollection, writeCollection } from './store';

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
 * The credential the login form is checked against.
 *
 * A password set from inside the admin panel wins, so the admin can rotate it
 * without touching the hosting dashboard. Until that happens, the value seeded
 * through `ADMIN_PASSWORD_HASH` is used.
 */
async function currentCredentials() {
  const saved = await readCollection(CREDENTIALS_COLLECTION);
  const record = saved?.[0];
  if (record?.passwordHash) {
    return { username: record.username || 'admin', passwordHash: record.passwordHash };
  }
  return {
    username: process.env.ADMIN_USERNAME || 'admin',
    passwordHash: process.env.ADMIN_PASSWORD_HASH || '',
  };
}

/** Whether an admin password has been configured at all. */
export async function isAdminConfigured() {
  const { passwordHash } = await currentCredentials();
  return Boolean(passwordHash);
}

/** Replace the stored admin username and password. */
export async function setCredentials(username, password) {
  const passwordHash = await hashPassword(password);
  await writeCollection(CREDENTIALS_COLLECTION, [
    { id: 'admin', username, passwordHash, updatedAt: new Date().toISOString() },
  ]);
}

/** Check a username and password against the configured credential. */
export async function checkCredentials(username, password) {
  const expected = await currentCredentials();
  if (!expected.passwordHash) return false;

  // Compare both fields every time, so a wrong username and a wrong password
  // take the same amount of work and neither can be probed separately.
  const passwordOk = await verifyPassword(password, expected.passwordHash);
  const usernameOk = safeEqual(String(username || '').toLowerCase(), expected.username.toLowerCase());
  return passwordOk && usernameOk;
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
