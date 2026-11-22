import 'server-only';

import { cookies } from 'next/headers';
import { randomInt, timingSafeEqual } from 'node:crypto';

import {
  createToken,
  hashPassword,
  mainAdminPasswordHash,
  readToken,
  sign,
  verifyPassword,
} from './auth';
import { readCollectionStrict, resetCollection, updateCollection, writeCollection } from './store';

/**
 * Sign-in for the IGRS grievance committee — separate from the CMS admin.
 *
 * - One account, user ID `admin`. It starts with the main CMS admin's current
 *   password; the first successful sign-in copies that hash into its own
 *   record, so from then on the two passwords are independent.
 * - Its own session cookie, so a committee login grants no CMS rights and a
 *   CMS login grants no access to grievances.
 * - The session carries the credential version, so resetting the password
 *   signs out every other device straight away.
 * - "Forgot password" mails a one-time code to the college inbox only — never
 *   to an address typed into the form.
 */

export const IGRS_USERNAME = 'admin';
const IGRS_COOKIE = 'kmggp_igrs_session';
const CREDENTIALS = 'igrs-credentials';
const OTP_COLLECTION = 'igrs-otp';

const SESSION_TTL = 60 * 60 * 8; // 8 hours
const REMEMBER_TTL = 60 * 60 * 24 * 7; // 7 days

const OTP_TTL_MS = 10 * 60 * 1000;
const OTP_RESEND_MS = 60 * 1000;
const OTP_MAX_SENDS_PER_HOUR = 5;
const OTP_MAX_TRIES = 5;

export const MIN_PASSWORD = 8;

/** The inbox that receives password-reset codes. */
export function recoveryEmail() {
  return process.env.IGRS_RECOVERY_EMAIL || 'ggpbad@gmail.com';
}

/** `gg****@gmail.com` — enough to recognise the inbox without publishing it. */
export function maskedRecoveryEmail() {
  const [user, domain] = recoveryEmail().split('@');
  const visible = user.slice(0, 2);
  return `${visible}${'•'.repeat(Math.max(3, user.length - 2))}@${domain}`;
}

/* -------------------------------- Account -------------------------------- */

/** `{ passwordHash, version, stored }` — strict, so an outage never falls back. */
async function account() {
  const saved = (await readCollectionStrict(CREDENTIALS)) || [];
  const record = saved.find((r) => r.id === 'igrs' && r.passwordHash);
  if (record) return { passwordHash: record.passwordHash, version: record.updatedAt || 'v1', stored: true };
  return { passwordHash: await mainAdminPasswordHash(), version: 'inherited', stored: false };
}

async function storePassword(passwordHash) {
  const updatedAt = new Date().toISOString();
  await writeCollection(CREDENTIALS, [{ id: 'igrs', username: IGRS_USERNAME, passwordHash, updatedAt }]);
  return updatedAt;
}

function sameText(a, b) {
  const bufferA = Buffer.from(String(a));
  const bufferB = Buffer.from(String(b));
  return bufferA.length === bufferB.length && timingSafeEqual(bufferA, bufferB);
}

/** Whether these credentials open the committee dashboard. */
export async function checkIgrsLogin(username, password) {
  const current = await account();
  if (!current.passwordHash) return { ok: false, configured: false };

  // Always run the password check, so timing does not reveal a wrong user ID.
  const passwordOk = await verifyPassword(String(password || ''), current.passwordHash);
  const userOk = sameText(String(username || '').trim().toLowerCase(), IGRS_USERNAME);
  if (!passwordOk || !userOk) return { ok: false, configured: true };

  // First sign-in: freeze the inherited password as the committee's own.
  let version = current.version;
  if (!current.stored) version = await storePassword(current.passwordHash);
  return { ok: true, version };
}

/* -------------------------------- Session -------------------------------- */

export async function startIgrsSession(version, remember = false) {
  const ttl = remember ? REMEMBER_TTL : SESSION_TTL;
  const token = createToken({
    role: 'igrs',
    username: IGRS_USERNAME,
    version,
    issuedAt: Date.now(),
    expiresAt: Date.now() + ttl * 1000,
  });
  const jar = await cookies();
  jar.set(IGRS_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: ttl,
  });
}

export async function endIgrsSession() {
  const jar = await cookies();
  jar.delete(IGRS_COOKIE);
}

/** The committee session, or null if absent, expired or outdated by a reset. */
export async function getIgrsSession() {
  const jar = await cookies();
  const payload = readToken(jar.get(IGRS_COOKIE)?.value);
  if (payload?.role !== 'igrs') return null;
  try {
    const current = await account();
    return current.version === payload.version ? payload : null;
  } catch {
    return null;
  }
}

/** Change the password while signed in (needs the current one). */
export async function changeIgrsPassword(currentPassword, nextPassword) {
  const current = await account();
  if (!(await verifyPassword(String(currentPassword || ''), current.passwordHash))) {
    throw new Error('Your current password is not correct.');
  }
  return storePassword(await hashPassword(nextPassword));
}

/* ---------------------------------- OTP ---------------------------------- */

function otpHash(code) {
  return sign(`igrs-otp:${code}`);
}

/**
 * Create and record a fresh code. Returns `{ code }`, or `{ waitSeconds }`
 * when asked again too soon. The caller mails the code.
 */
export async function issueOtp() {
  const now = Date.now();
  let result;

  await updateCollection(OTP_COLLECTION, ([previous]) => {
    const windowStart = previous && now - previous.windowStart < 3600000 ? previous.windowStart : now;
    const sends = previous && windowStart === previous.windowStart ? previous.sends : 0;

    if (previous && now - previous.sentAt < OTP_RESEND_MS) {
      result = { waitSeconds: Math.ceil((OTP_RESEND_MS - (now - previous.sentAt)) / 1000) };
      return [previous];
    }
    if (sends >= OTP_MAX_SENDS_PER_HOUR) {
      result = { waitSeconds: Math.ceil((3600000 - (now - windowStart)) / 1000) };
      return [previous];
    }

    const code = String(randomInt(0, 1000000)).padStart(6, '0');
    result = { code };
    return [{ hash: otpHash(code), sentAt: now, expiresAt: now + OTP_TTL_MS, tries: 0, windowStart, sends: sends + 1 }];
  });

  return result;
}

/** Undo a code whose email could not be sent, so the cooldown does not apply. */
export async function withdrawOtp() {
  await updateCollection(OTP_COLLECTION, ([previous]) =>
    previous ? [{ ...previous, hash: '', sentAt: 0, expiresAt: 0 }] : [],
  );
}

/** Check a code and, if right, set the new password. Throws a friendly error. */
export async function resetWithOtp(code, nextPassword) {
  const given = String(code || '').trim();
  if (!/^\d{6}$/.test(given)) throw new Error('Enter the 6-digit code from the email.');

  let outcome = 'missing';
  await updateCollection(OTP_COLLECTION, ([entry]) => {
    if (!entry?.hash) return entry ? [entry] : [];
    if (Date.now() > entry.expiresAt) {
      outcome = 'expired';
      return [{ ...entry, hash: '' }];
    }
    if (entry.tries >= OTP_MAX_TRIES) {
      outcome = 'locked';
      return [{ ...entry, hash: '' }];
    }
    if (!sameText(otpHash(given), entry.hash)) {
      const tries = entry.tries + 1;
      outcome = tries >= OTP_MAX_TRIES ? 'locked' : 'wrong';
      return [{ ...entry, tries, hash: tries >= OTP_MAX_TRIES ? '' : entry.hash }];
    }
    outcome = 'ok';
    return [];
  });

  const messages = {
    missing: 'No active code. Please request a new one.',
    expired: 'This code has expired. Please request a new one.',
    locked: 'Too many wrong attempts. Please request a new code.',
    wrong: 'That code is not correct. Please check the email and try again.',
  };
  if (outcome !== 'ok') throw new Error(messages[outcome]);

  await storePassword(await hashPassword(nextPassword));
  await resetCollection(OTP_COLLECTION).catch(() => {});
}

/** Shared password rule for reset and change. Returns an error or ''. */
export function passwordProblem(next, confirm) {
  const value = String(next || '');
  if (value.length < MIN_PASSWORD) return `Choose a password of at least ${MIN_PASSWORD} characters.`;
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return 'Use both letters and numbers in the password.';
  if (value !== String(confirm || '')) return 'The two passwords do not match.';
  return '';
}
