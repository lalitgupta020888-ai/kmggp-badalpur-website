'use server';

import { headers } from 'next/headers';

import { checkCredentials } from '@/lib/server/auth';
import { checkAttempts, clearAttempts, recordFailure } from '@/lib/server/throttle';

/**
 * Checks a grievance-committee login against the same server-side accounts as
 * the /admin panel, so no password ships in the browser bundle.
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

  if (!(await checkCredentials(String(username || '').trim(), String(password || '')))) {
    recordFailure(key);
    return { ok: false, error: 'Invalid username or password. Please try again.' };
  }

  clearAttempts(key);
  return { ok: true };
}
