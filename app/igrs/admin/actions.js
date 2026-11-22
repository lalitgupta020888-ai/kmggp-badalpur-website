'use server';

import { headers } from 'next/headers';

import { checkCredentials, endSession, getSession, startSession } from '@/lib/server/auth';
import { checkAttempts, clearAttempts, recordFailure } from '@/lib/server/throttle';
import { listAllGrievances, updateGrievanceStatus } from '@/lib/server/igrs';
import { notifyGrievanceUpdate } from '@/lib/server/igrs-mail';

/**
 * Grievance-committee login. Checks the same server-side accounts as /admin and
 * issues the same signed session cookie, which the actions below require.
 */
export async function verifyIgrsLogin(username, password) {
  const headerList = await headers();
  const key =
    'igrs:' +
    (headerList.get('x-forwarded-for')?.split(',')[0]?.trim() || headerList.get('x-real-ip') || 'unknown');

  const gate = checkAttempts(key);
  if (!gate.allowed) {
    return { ok: false, error: `Too many failed attempts. Try again in about ${gate.retryAfterMinutes} minutes.` };
  }

  // Counted before the slow check so parallel requests can't outrun the limit.
  recordFailure(key);

  const user = String(username || '').trim();
  let valid;
  try {
    valid = await checkCredentials(user, String(password || ''));
  } catch (error) {
    console.error('[igrs] credential check failed:', error);
    return { ok: false, error: 'Sign-in is unavailable right now. Please try again in a minute.' };
  }
  if (!valid) {
    return { ok: false, error: 'Invalid username or password. Please try again.' };
  }

  clearAttempts(key);
  await startSession(user);
  return { ok: true };
}

export async function igrsSignOut() {
  await endSession();
}

/** Committee only: all grievances. `signedOut` when the session has lapsed. */
export async function fetchGrievances() {
  if (!(await getSession())) return { signedOut: true, list: [] };
  try {
    return { list: await listAllGrievances() };
  } catch (error) {
    console.error('[igrs] list failed:', error);
    return { error: 'Could not load grievances.', list: [] };
  }
}

/** Committee only: update one grievance's status and remarks. */
export async function saveGrievanceUpdate(type, refNumber, status, remarks) {
  if (!(await getSession())) return { signedOut: true };
  try {
    const grievance = await updateGrievanceStatus(type, refNumber, status, remarks);
    await notifyGrievanceUpdate(grievance).catch((error) => console.error('[igrs] mail failed:', error));
    return { grievance };
  } catch (error) {
    console.error('[igrs] update failed:', error);
    const message = String(error?.message || '');
    return { error: message.startsWith('[supabase]') ? 'Could not save the update.' : message };
  }
}
