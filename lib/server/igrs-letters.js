import 'server-only';

import { sbDownloadPrivate, sbEnsurePrivateBucket, sbUploadPrivate, supabaseEnabled } from './supabase';

/**
 * Letters the grievance committee attaches when it updates a case — usually
 * the resolution letter.
 *
 * They are kept in a PRIVATE storage bucket: a letter can name the student
 * and the action taken, so it must not sit at a guessable public URL. The
 * site serves a letter only through /igrs/letter/<file>, and only when that
 * file is recorded in the history of the grievance whose reference number it
 * carries — the same "knowing the reference number" rule as the status page.
 */

export const LETTER_BUCKET = 'igrs-letters';
// Vercel caps a request body at ~4.5 MB, so the letter must stay under that.
export const LETTER_MAX_BYTES = 4 * 1024 * 1024;

const FILE_NAME = /^(GR[0-9A-Z]{6,30})-(\d{10,16})\.pdf$/;

/** The reference number a stored letter belongs to, or null if malformed. */
export function letterRef(file) {
  return FILE_NAME.exec(String(file || ''))?.[1] || null;
}

/** Validate and store an uploaded PDF. Returns `{ file, name, size }`. */
export async function saveLetter(refNumber, upload) {
  if (!supabaseEnabled()) throw new Error('Letter storage is not configured.');
  if (!upload || typeof upload.arrayBuffer !== 'function' || !upload.size) {
    throw new Error('Choose the PDF letter to upload.');
  }
  if (upload.size > LETTER_MAX_BYTES) throw new Error('The letter must be a PDF under 4 MB.');

  const buffer = Buffer.from(await upload.arrayBuffer());
  // Check the bytes, not the file name: every PDF starts with "%PDF-".
  if (buffer.subarray(0, 5).toString('latin1') !== '%PDF-') {
    throw new Error('Only PDF files can be attached as the letter.');
  }

  const file = `${refNumber}-${Date.now()}.pdf`;
  if (!letterRef(file)) throw new Error('Invalid grievance reference.');

  await sbEnsurePrivateBucket(LETTER_BUCKET, { maxBytes: LETTER_MAX_BYTES, mimeTypes: ['application/pdf'] });
  await sbUploadPrivate(LETTER_BUCKET, file, buffer, 'application/pdf');

  const name =
    String(upload.name || 'letter.pdf')
      .replace(/[^\w\s.()\-ऀ-ॿ]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 120) || 'letter.pdf';
  return { file, name: /\.pdf$/i.test(name) ? name : `${name}.pdf`, size: buffer.length, buffer };
}

export async function readLetter(file) {
  if (!letterRef(file) || !supabaseEnabled()) return null;
  return sbDownloadPrivate(LETTER_BUCKET, file);
}
