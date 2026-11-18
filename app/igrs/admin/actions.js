'use server';

import { headers } from 'next/headers';

import { checkCredentials, endSession, getSession, startSession } from '@/lib/server/auth';
import { checkAttempts, clearAttempts, recordFailure } from '@/lib/server/throttle';
import { listAllGrievances, updateGrievanceStatus } from '@/lib/server/igrs';

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

  const user = String(username || '').trim();
  if (!(await checkCredentials(user, String(password || '')))) {
    recordFailure(key);
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
    return { grievance: await updateGrievanceStatus(type, refNumber, status, remarks) };
  } catch (error) {
    console.error('[igrs] update failed:', error);
    const message = String(error?.message || '');
    return { error: message.startsWith('[supabase]') ? 'Could not save the update.' : message };
  }
}
