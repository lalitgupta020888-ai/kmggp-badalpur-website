'use server';

import { headers } from 'next/headers';

import {
  changeIgrsPassword,
  checkIgrsLogin,
  endIgrsSession,
  getIgrsSession,
  issueOtp,
  maskedRecoveryEmail,
  passwordProblem,
  recoveryEmail,
  resetWithOtp,
  startIgrsSession,
  withdrawOtp,
} from '@/lib/server/igrs-auth';
import { checkAttempts, clearAttempts, recordFailure } from '@/lib/server/throttle';
import { listAllGrievances, updateGrievanceStatus } from '@/lib/server/igrs';
import { notifyGrievanceUpdate, sendResetCode } from '@/lib/server/igrs-mail';
import { mailEnabled } from '@/lib/server/mail';

async function clientIp() {
  const headerList = await headers();
  return (
    headerList.get('x-real-ip') ||
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  );
}

const tooMany = (minutes) => `Too many attempts. Please try again in about ${minutes} minute${minutes === 1 ? '' : 's'}.`;

/** Committee sign-in. User ID `admin`; see lib/server/igrs-auth.js. */
export async function verifyIgrsLogin(username, password, remember = false) {
  const key = `igrs-login:${await clientIp()}`;
  const gate = checkAttempts(key);
  if (!gate.allowed) return { ok: false, error: tooMany(gate.retryAfterMinutes) };
  // Counted before the slow check so parallel requests can't outrun the limit.
  recordFailure(key);

  try {
    const result = await checkIgrsLogin(username, password);
    if (!result.configured && !result.ok) {
      return { ok: false, error: 'The committee login has not been set up yet. Please contact the website administrator.' };
    }
    if (!result.ok) return { ok: false, error: 'Incorrect user ID or password. Please try again.' };
    clearAttempts(key);
    await startIgrsSession(result.version, Boolean(remember));
    return { ok: true };
  } catch (error) {
    console.error('[igrs] sign-in failed:', error);
    return { ok: false, error: 'Sign-in is unavailable right now. Please try again in a minute.' };
  }
}

export async function igrsSignOut() {
  await endIgrsSession();
}

/** Whether the browser still holds a valid committee session. */
export async function igrsSessionStatus() {
  return { signedIn: Boolean(await getIgrsSession()) };
}

/** Where the reset code goes — shown masked on the forgot-password screen. */
export async function igrsRecoveryHint() {
  return { email: maskedRecoveryEmail() };
}

/** Forgot password, step 1: mail a one-time code to the college inbox. */
export async function requestIgrsOtp() {
  const key = `igrs-otp:${await clientIp()}`;
  const gate = checkAttempts(key);
  if (!gate.allowed) return { ok: false, error: tooMany(gate.retryAfterMinutes) };
  recordFailure(key);

  if (!mailEnabled()) {
    return { ok: false, error: 'Email is not configured on the server, so a code cannot be sent.' };
  }

  try {
    const result = await issueOtp();
    if (result.waitSeconds) {
      return { ok: false, waitSeconds: result.waitSeconds, error: `Please wait ${result.waitSeconds} seconds before asking for another code.` };
    }
    const sent = await sendResetCode(recoveryEmail(), result.code);
    if (!sent) {
      await withdrawOtp().catch(() => {});
      return { ok: false, error: 'The code could not be emailed right now. Please try again.' };
    }
    return { ok: true, email: maskedRecoveryEmail(), resendIn: 60 };
  } catch (error) {
    console.error('[igrs] otp failed:', error);
    return { ok: false, error: 'Could not start the reset right now. Please try again.' };
  }
}

/** Forgot password, step 2: code + new password. */
export async function resetIgrsPassword(code, nextPassword, confirm) {
  const key = `igrs-reset:${await clientIp()}`;
  const gate = checkAttempts(key);
  if (!gate.allowed) return { ok: false, error: tooMany(gate.retryAfterMinutes) };

  const problem = passwordProblem(nextPassword, confirm);
  if (problem) return { ok: false, error: problem };

  recordFailure(key);
  try {
    await resetWithOtp(code, nextPassword);
    clearAttempts(key);
    await endIgrsSession();
    return { ok: true };
  } catch (error) {
    const message = String(error?.message || '');
    if (message.startsWith('[supabase]') || !message) {
      console.error('[igrs] reset failed:', error);
      return { ok: false, error: 'Could not reset the password right now. Please try again.' };
    }
    return { ok: false, error: message };
  }
}

/** Signed in: change the password (needs the current one). */
export async function changeIgrsPasswordAction(currentPassword, nextPassword, confirm) {
  if (!(await getIgrsSession())) return { signedOut: true };
  const problem = passwordProblem(nextPassword, confirm);
  if (problem) return { ok: false, error: problem };
  try {
    const version = await changeIgrsPassword(currentPassword, nextPassword);
    // Keep this device signed in; every other device is signed out.
    await startIgrsSession(version);
    return { ok: true };
  } catch (error) {
    const message = String(error?.message || '');
    return { ok: false, error: message.startsWith('[supabase]') || !message ? 'Could not change the password.' : message };
  }
}

/** Committee only: all grievances. `signedOut` when the session has lapsed. */
export async function fetchGrievances() {
  if (!(await getIgrsSession())) return { signedOut: true, list: [] };
  try {
    return { list: await listAllGrievances() };
  } catch (error) {
    console.error('[igrs] list failed:', error);
    return { error: 'Could not load grievances. Please refresh in a moment.', list: [] };
  }
}

/** Committee only: update one grievance's status and remarks. */
export async function saveGrievanceUpdate(type, refNumber, status, remarks, notify = true) {
  if (!(await getIgrsSession())) return { signedOut: true };
  try {
    const { grievance, changed } = await updateGrievanceStatus(type, refNumber, status, remarks);
    if (changed && notify) {
      await notifyGrievanceUpdate(grievance).catch((error) => console.error('[igrs] mail failed:', error));
    }
    return { grievance, changed };
  } catch (error) {
    console.error('[igrs] update failed:', error);
    const message = String(error?.message || '');
    return { error: message.startsWith('[supabase]') ? 'Could not save the update.' : message };
  }
}
