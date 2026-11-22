import 'server-only';

/**
 * A minimal Supabase client over plain `fetch` — the site only needs one table
 * and one storage bucket, which does not justify pulling in the full SDK.
 *
 * Supabase is used when SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are both set.
 * Without them the store falls back to JSON files on disk (see store.js), which
 * keeps local development working with no setup.
 *
 * The service-role key bypasses row-level security, so it must only ever be
 * read on the server. It is never prefixed NEXT_PUBLIC_ and this module is
 * marked server-only.
 */

const URL_BASE = (process.env.SUPABASE_URL || '').replace(/\/+$/, '');
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export const SUPABASE_TABLE = 'kmggp_collections';
export const SUPABASE_BUCKET = process.env.SUPABASE_BUCKET || 'uploads';

export function supabaseEnabled() {
  return Boolean(URL_BASE && KEY);
}

function headers(extra = {}) {
  return { apikey: KEY, Authorization: `Bearer ${KEY}`, ...extra };
}

async function check(response, what) {
  if (response.ok) return response;
  const body = await response.text().catch(() => '');
  throw new Error(`[supabase] ${what} failed (${response.status}): ${body.slice(0, 300)}`);
}

/* ------------------------------ Collections ------------------------------- */

/** The stored items for a collection, or `null` when it has never been saved. */
export async function sbReadCollection(name) {
  const url = `${URL_BASE}/rest/v1/${SUPABASE_TABLE}?name=eq.${encodeURIComponent(name)}&select=items`;
  const response = await check(
    await fetch(url, { headers: headers(), cache: 'no-store' }),
    `read "${name}"`,
  );
  const rows = await response.json();
  return rows.length && Array.isArray(rows[0].items) ? rows[0].items : null;
}

export async function sbWriteCollection(name, items) {
  await check(
    await fetch(`${URL_BASE}/rest/v1/${SUPABASE_TABLE}?on_conflict=name`, {
      method: 'POST',
      headers: headers({
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      }),
      body: JSON.stringify({ name, items, updated_at: new Date().toISOString() }),
      cache: 'no-store',
    }),
    `write "${name}"`,
  );
}

export async function sbDeleteCollection(name) {
  await check(
    await fetch(`${URL_BASE}/rest/v1/${SUPABASE_TABLE}?name=eq.${encodeURIComponent(name)}`, {
      method: 'DELETE',
      headers: headers({ Prefer: 'return=minimal' }),
      cache: 'no-store',
    }),
    `reset "${name}"`,
  );
}

/* -------------------------------- Storage --------------------------------- */

export async function sbUpload(fileName, buffer, contentType) {
  await check(
    await fetch(`${URL_BASE}/storage/v1/object/${SUPABASE_BUCKET}/${fileName}`, {
      method: 'POST',
      headers: headers({ 'Content-Type': contentType, 'Cache-Control': 'max-age=31536000' }),
      body: buffer,
      cache: 'no-store',
    }),
    `upload "${fileName}"`,
  );
}

export async function sbDeleteFile(fileName) {
  const response = await fetch(`${URL_BASE}/storage/v1/object/${SUPABASE_BUCKET}/${fileName}`, {
    method: 'DELETE',
    headers: headers(),
    cache: 'no-store',
  });
  if (!response.ok && response.status !== 404) await check(response, `delete "${fileName}"`);
}

/* ------------------------- Private buckets (IGRS) -------------------------- */

const readyBuckets = new Set();

/** Create a private bucket on first use (a 409 means it already exists). */
export async function sbEnsurePrivateBucket(bucket, { maxBytes, mimeTypes } = {}) {
  if (readyBuckets.has(bucket)) return;
  const response = await fetch(`${URL_BASE}/storage/v1/bucket`, {
    method: 'POST',
    headers: headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({
      id: bucket,
      name: bucket,
      public: false,
      ...(maxBytes ? { file_size_limit: maxBytes } : {}),
      ...(mimeTypes ? { allowed_mime_types: mimeTypes } : {}),
    }),
    cache: 'no-store',
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    // Storage answers 400 with "Duplicate" (older) or 409 for an existing bucket.
    if (!(response.status === 409 || /duplicate|already exists/i.test(text))) {
      throw new Error(`[supabase] create bucket "${bucket}" failed (${response.status}): ${text.slice(0, 200)}`);
    }
  }
  readyBuckets.add(bucket);
}

export async function sbUploadPrivate(bucket, fileName, buffer, contentType) {
  await check(
    await fetch(`${URL_BASE}/storage/v1/object/${bucket}/${fileName}`, {
      method: 'POST',
      headers: headers({ 'Content-Type': contentType }),
      body: buffer,
      cache: 'no-store',
    }),
    `upload "${bucket}/${fileName}"`,
  );
}

/** A private file's bytes, or null when it does not exist. */
export async function sbDownloadPrivate(bucket, fileName) {
  const response = await fetch(`${URL_BASE}/storage/v1/object/authenticated/${bucket}/${fileName}`, {
    headers: headers(),
    cache: 'no-store',
  });
  if (response.status === 404 || response.status === 400) return null;
  await check(response, `download "${bucket}/${fileName}"`);
  return Buffer.from(await response.arrayBuffer());
}

/** The bucket is public, so files are served straight from Supabase's CDN. */
export function sbPublicUrl(fileName) {
  return `${URL_BASE}/storage/v1/object/public/${SUPABASE_BUCKET}/${fileName}`;
}

/* --------------------------- Generic table access -------------------------- */

/** A PostgREST request against `/rest/v1/<pathAndQuery>`; returns parsed JSON or null. */
export async function sbRest(pathAndQuery, { method = 'GET', body, prefer } = {}) {
  const response = await fetch(`${URL_BASE}/rest/v1/${pathAndQuery}`, {
    method,
    headers: headers({
      ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
      ...(prefer ? { Prefer: prefer } : {}),
    }),
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  });
  if (!response.ok) {
    const text = await response.text().catch(() => '');
    const error = new Error(
      `[supabase] ${method} ${pathAndQuery.split('?')[0]} failed (${response.status}): ${text.slice(0, 300)}`,
    );
    error.status = response.status;
    throw error;
  }
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
