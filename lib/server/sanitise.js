import 'server-only';

/**
 * Shaping and bounds-checking for everything the admin panel saves.
 *
 * The browser sends whole arrays of records, so nothing arriving from it can be
 * trusted to have the right fields, the right types, or a sane size. Each
 * function here rebuilds a record field by field — an unknown key sent by a
 * caller is dropped rather than stored, and every string is length-capped so a
 * single save cannot bloat the data file.
 */

const MAX_ITEMS = 200;

export function text(value, max = 200) {
  return String(value ?? '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, max);
}

export function multiline(value, max = 2000) {
  return String(value ?? '')
    .replace(/\r\n/g, '\n')
    .trim()
    .slice(0, max);
}

export function flag(value) {
  return value === true || value === 'true' || value === 'on';
}

/** A bootstrap-icons class name, e.g. `bi-images`. */
export function icon(value, fallback = 'bi-dot') {
  const cleaned = String(value ?? '').trim();
  return /^bi-[a-z0-9-]+$/.test(cleaned) ? cleaned : fallback;
}

/**
 * A link the site will render.
 *
 * Only same-site paths and http(s) URLs are allowed. This is what stops a
 * `javascript:` or `data:` URL being saved into a notice and then rendered into
 * an anchor on the public site, which would be stored cross-site scripting.
 */
export function link(value) {
  const raw = String(value ?? '').trim().slice(0, 500);
  if (!raw) return '';
  if (raw.startsWith('/') && !raw.startsWith('//')) return raw;

  try {
    const url = new URL(raw);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : '';
  } catch {
    return '';
  }
}

/** Whether a link leaves the site, which decides if it opens in a new tab. */
export function isExternal(value) {
  return /^https?:\/\//i.test(String(value ?? ''));
}

/** A URL-safe slug, used for album addresses. */
export function slug(value, fallback = 'item') {
  const cleaned = String(value ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
  return cleaned || fallback;
}

/** Keep a list within bounds and drop anything that is not an object. */
export function list(value, map) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item) => item && typeof item === 'object')
    .slice(0, MAX_ITEMS)
    .map(map)
    .filter(Boolean);
}

/** Make slugs unique within one save, so two albums cannot share an address. */
export function uniqueSlugs(items) {
  const seen = new Set();
  return items.map((item) => {
    let candidate = item.slug;
    let suffix = 2;
    while (seen.has(candidate)) candidate = `${item.slug}-${suffix++}`;
    seen.add(candidate);
    return candidate === item.slug ? item : { ...item, slug: candidate };
  });
}
