'use server';

import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

import { checkCredentials, endSession, isAdminConfigured, startSession } from '@/lib/server/auth';
import { checkAttempts, clearAttempts, recordFailure } from '@/lib/server/throttle';

/** Best-effort client identity for throttling, behind Railway's proxy. */
async function clientKey() {
  const headerList = await headers();
  const forwarded = headerList.get('x-forwarded-for');
  return forwarded?.split(',')[0]?.trim() || headerList.get('x-real-ip') || 'unknown';
}

export async function signIn(_previousState, formData) {
  const username = String(formData.get('username') || '').trim();
  const password = String(formData.get('password') || '');

  if (!username || !password) {
    return { error: 'Enter both your admin ID and password.' };
  }

  if (!(await isAdminConfigured())) {
    return {
      error:
        'No admin password has been set up yet. Generate one with `node scripts/admin-password.mjs` and add ADMIN_PASSWORD_HASH to the hosting environment.',
    };
  }

  const key = await clientKey();
  const gate = checkAttempts(key);
  if (!gate.allowed) {
    return {
      error: `Too many failed attempts. Try again in about ${gate.retryAfterMinutes} minute${
        gate.retryAfterMinutes === 1 ? '' : 's'
      }.`,
    };
  }

  if (!(await checkCredentials(username, password))) {
    recordFailure(key);
    // The same message for a wrong ID and a wrong password, so the form cannot
    // be used to find out which admin IDs exist.
    return { error: 'Incorrect admin ID or password.' };
  }

  clearAttempts(key);
  await startSession(username);

  // redirect() signals by throwing, so it must sit outside any try/catch.
  redirect('/admin');
}

export async function signOut() {
  await endSession();
  redirect('/login');
}
