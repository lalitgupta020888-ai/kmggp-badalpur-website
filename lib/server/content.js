import 'server-only';

import { cache } from 'react';

import { readCollection } from './store';
import { COLLECTIONS } from '@/lib/admin-collections';
import { GALLERY_ALBUMS as DEFAULT_ALBUMS } from '@/lib/gallery';
import {
  NOTICES as DEFAULT_NOTICES,
  TICKER_NOTICES as DEFAULT_TICKER,
  ORDERS as DEFAULT_ORDERS,
} from '@/lib/notices';

/**
 * The site's content, read through one place.
 *
 * Each collection falls back to the hardcoded list in `lib/` until the admin
 * saves it for the first time. That keeps the site fully populated on a fresh
 * deploy with an empty disk, and means the built-in lists stay useful as the
 * starting point the admin edits rather than dead code.
 *
 * `cache()` dedupes the disk read within a single request, so a page that shows
 * the ticker, the notice board and the gallery band reads each file once.
 */

export { COLLECTIONS };

async function withDefault(collection, fallback) {
  const stored = await readCollection(collection);
  return stored ?? fallback;
}

/* ------------------------------- Gallery -------------------------------- */

export const getAlbums = cache(() => withDefault(COLLECTIONS.albums, DEFAULT_ALBUMS));

export async function getAlbum(slug) {
  const albums = await getAlbums();
  return albums.find((album) => album.slug === slug) || null;
}

/** The album whose film the welcome popup plays, or null when none carries one. */
export async function getFeaturedVideoAlbum() {
  const albums = await getAlbums();
  return albums.find((album) => album.video?.src) || null;
}

/** Every photograph, flattened, each carrying its album title as its tag. */
export async function getGalleryImages() {
  const albums = await getAlbums();
  return albums.flatMap((album) =>
    (album.photos || []).map((photo) => ({ ...photo, tag: album.title, album: album.slug })),
  );
}

/* -------------------------------- Notices ------------------------------- */

export const getNotices = cache(() => withDefault(COLLECTIONS.notices, DEFAULT_NOTICES));

export const getTickerNotices = cache(() => withDefault(COLLECTIONS.ticker, DEFAULT_TICKER));

export const getOrders = cache(() => withDefault(COLLECTIONS.orders, DEFAULT_ORDERS));

/**
 * Categories offered by the filter on `/notices`.
 *
 * Derived from the notices themselves rather than kept as its own list, so a
 * category can never sit in the filter bar with nothing behind it, and a notice
 * filed under a new category shows up without a second edit.
 */
export async function getNoticeCategories() {
  const notices = await getNotices();
  const seen = [];
  for (const notice of notices) {
    if (notice.category && !seen.includes(notice.category)) seen.push(notice.category);
  }
  return seen;
}

/** Everything the home page needs, in one round of reads. */
export async function getHomeContent() {
  const [ticker, notices, images, video] = await Promise.all([
    getTickerNotices(),
    getNotices(),
    getGalleryImages(),
    getFeaturedVideoAlbum(),
  ]);
  return { ticker, notices, images, video };
}
