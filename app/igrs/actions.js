'use server';

import { guardForm } from '@/lib/server/form-guard';
import { createGrievance, findGrievancePublic } from '@/lib/server/igrs';
import { notifyNewGrievance } from '@/lib/server/igrs-mail';

/** Hide raw database errors from visitors; keep validation messages. */
function friendly(error, fallback) {
  return String(error?.message || '').startsWith('[supabase]') || !error?.message ? fallback : error.message;
}

/** Public: submit a grievance. Returns `{ grievance }` or `{ error }`. */
export async function submitGrievance(type, data) {
  const guard = await guardForm('igrs', data);
  // A bot that filled the hidden field gets a believable receipt and nothing is stored.
  if (guard.silent) {
    return { grievance: { type, refNumber: 'GR' + Date.now().toString(36).toUpperCase(), status: 'Pending' } };
  }
  if (!guard.ok) return { error: guard.error || 'Could not save your grievance. Please try again.' };

  try {
    const grievance = await createGrievance(type, data);
    // Saved first; emails are best-effort and never fail the submission.
    await notifyNewGrievance(grievance).catch((error) => console.error('[igrs] mail failed:', error));
    return { grievance };
  } catch (error) {
    // Validation messages are the visitor's to fix; only real failures are logged.
    if (friendly(error, '') === '') console.error('[igrs] submit failed:', error);
    return { error: friendly(error, 'Could not save your grievance. Please try again.') };
  }
}

/** Public: look up a grievance's status by reference number. */
export async function lookupGrievance(refNumber) {
  try {
    return { grievance: await findGrievancePublic(refNumber) };
  } catch (error) {
    console.error('[igrs] lookup failed:', error);
    return { error: 'Could not check the status right now. Please try again.' };
  }
}
