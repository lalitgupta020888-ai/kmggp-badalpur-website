import 'server-only';

import { headers } from 'next/headers';

import { checkAttempts, recordFailure } from './throttle';

/** Per-form submissions allowed per IP per 15 minutes (default: the throttle's). */
const FORM_LIMITS = { igrs: 40 };

/**
 * Shared spam guard for the public forms that send email.
 *
 * - `website` is a hidden "honeypot" input: people never see it, bots fill it.
 * - Each visitor gets a handful of submissions per 15 minutes per form, reusing
 *   the login throttle (every submission counts as one "attempt").
 *
 * Returns `{ ok: true }`, `{ ok: false, error }`, or `{ ok: false, silent: true }`
 * for a bot — which should be shown the normal success screen and nothing sent.
 */
export async function guardForm(formName, data) {
  if (String(data?.website || '').trim()) return { ok: false, silent: true };

  const headerList = await headers();
  const ip =
    headerList.get('x-forwarded-for')?.split(',')[0]?.trim() || headerList.get('x-real-ip') || 'unknown';
  const key = `form:${formName}:${ip}`;

  // Grievances are filed from the campus lab/Wi-Fi, where many students share
  // one public IP, so that form gets a roomier allowance.
  const gate = checkAttempts(key, FORM_LIMITS[formName]);
  if (!gate.allowed) {
    return {
      ok: false,
      error: `Too many submissions from your connection. Please try again in about ${gate.retryAfterMinutes} minutes.`,
    };
  }
  recordFailure(key);
  return { ok: true };
}

/** Trim and cap a visitor-typed value. */
export function clean(value, max = 300) {
  return String(value ?? '').trim().slice(0, max);
}
