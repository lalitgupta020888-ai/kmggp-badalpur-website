'use server';

import { createGrievance, findGrievancePublic } from '@/lib/server/igrs';

/** Hide raw database errors from visitors; keep validation messages. */
function friendly(error, fallback) {
  return String(error?.message || '').startsWith('[supabase]') || !error?.message ? fallback : error.message;
}

/** Public: submit a grievance. Returns `{ grievance }` or `{ error }`. */
export async function submitGrievance(type, data) {
  try {
    return { grievance: await createGrievance(type, data) };
  } catch (error) {
    console.error('[igrs] submit failed:', error);
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
