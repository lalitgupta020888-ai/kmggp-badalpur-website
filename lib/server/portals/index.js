import 'server-only';

import { createHash } from 'node:crypto';
import { after } from 'next/server';

import { PORTAL_KEYS, asNotice, notStarted, topicsFor, upcomingDeadlines } from '@/lib/portals';
import { readCollection, writeCollection } from '../store';
import { READERS } from './sources';

/**
 * Updates from the government portals, kept fresh automatically.
 *
 * - A sync reads every portal in parallel and stores the merged list in the
 *   content store (Supabase in production), so pages never wait on a portal.
 * - A portal that fails keeps its last good updates; one bad site never
 *   empties the board.
 * - Freshness: a daily Vercel Cron calls /api/cron/portal-updates, and any
 *   page that finds the list older than STALE_AFTER schedules a sync to run
 *   after its response has been sent — so the board refreshes through the day
 *   without a visitor ever waiting for it.
 * - Each update remembers when the site first saw it, which drives the NEW
 *   badge for portals that publish no dates.
 */

const ITEMS = 'portal-updates';
const STATUS = 'portal-sync';

const STALE_AFTER = 2 * 3600 * 1000; // refresh at most every 2 hours from page views
const MIN_GAP = 10 * 60 * 1000; // never start two syncs within 10 minutes
const PER_PORTAL = { bteup: 40, jeecup: 30, upscholarship: 40, aicte: 20, nsp: 12 };

function idFor(source, raw) {
  return createHash('sha1')
    .update(`${source}|${raw.ref || `${raw.link}|${raw.title}`}`)
    .digest('hex')
    .slice(0, 16);
}

/** Government servers drop connections now and then; retry twice with a pause. */
async function readOnce(source) {
  let lastError;
  for (const pause of [0, 2000, 4000]) {
    if (pause) await new Promise((r) => setTimeout(r, pause));
    try {
      return await READERS[source]();
    } catch (error) {
      lastError = error;
    }
  }
  throw lastError;
}

let running = null;

/**
 * Read every portal and store the result. Returns the new status. Concurrent
 * calls in one process share a single run; `force` skips the 10-minute gap.
 */
export function syncPortals({ force = false } = {}) {
  if (!running) {
    running = runSync(force).finally(() => {
      running = null;
    });
  }
  return running;
}

async function runSync(force) {
  const [previousItems, statusList] = await Promise.all([readCollection(ITEMS), readCollection(STATUS)]);
  const status = statusList?.[0] || { sources: {} };
  const now = new Date();

  if (!force && status.lastAttempt && now - new Date(status.lastAttempt) < MIN_GAP) return status;

  // Claim the run first, so other instances seeing a stale list hold off.
  await writeCollection(STATUS, [{ ...status, lastAttempt: now.toISOString() }]);

  const old = previousItems || [];
  const oldById = new Map(old.map((item) => [item.id, item]));
  const results = await Promise.allSettled(PORTAL_KEYS.map((key) => readOnce(key)));

  const sources = { ...status.sources };
  const merged = [];

  results.forEach((result, index) => {
    const key = PORTAL_KEYS[index];
    const kept = old.filter((item) => item.source === key);

    if (result.status === 'rejected') {
      sources[key] = { ...sources[key], ok: false, error: String(result.reason?.message || result.reason).slice(0, 200), checkedAt: now.toISOString() };
      merged.push(...kept);
      return;
    }

    // First import of a portal: undated items are not "new", they were already there.
    const seeding = kept.length === 0;
    const seen = new Set();
    for (const raw of result.value.slice(0, PER_PORTAL[key] || 30)) {
      const id = idFor(key, raw);
      if (seen.has(id)) continue;
      seen.add(id);
      const before = oldById.get(id);
      merged.push({
        id,
        source: key,
        title: raw.title,
        link: raw.link,
        date: raw.date || null,
        deadline: raw.deadline?.end ? { start: raw.deadline.start || null, end: raw.deadline.end } : null,
        section: raw.section || '',
        topics: topicsFor(raw.title),
        firstSeen: before?.firstSeen || now.toISOString(),
        seeded: before ? Boolean(before.seeded) : seeding,
      });
    }
    sources[key] = { ok: true, count: seen.size, checkedAt: now.toISOString(), updatedAt: now.toISOString(), error: '' };
  });

  const next = {
    lastAttempt: now.toISOString(),
    lastSuccess: results.some((r) => r.status === 'fulfilled') ? now.toISOString() : status.lastSuccess || null,
    sources,
  };
  await writeCollection(ITEMS, merged);
  await writeCollection(STATUS, [next]);
  return next;
}

/** Sort key: the update's own date, else when we first saw it. */
function when(item) {
  return new Date(item.date || (item.seeded ? 0 : item.firstSeen) || 0).getTime();
}

/**
 * Everything the pages need: `{ items, status }`, newest first. Schedules a
 * background refresh when the stored list is stale (never blocks on it).
 */
export async function getPortalUpdates() {
  const [items, statusList] = await Promise.all([readCollection(ITEMS), readCollection(STATUS)]);
  const status = statusList?.[0] || null;

  const last = status?.lastAttempt ? new Date(status.lastAttempt).getTime() : 0;
  if (Date.now() - last > STALE_AFTER) {
    try {
      after(() => syncPortals().catch((error) => console.error('[portals] sync failed:', error)));
    } catch {
      // Outside a request (e.g. a script) there is no "after"; skip quietly.
    }
  }

  const list = (items || []).slice().sort((a, b) => when(b) - when(a));
  return { items: list, status };
}

/**
 * The portal updates ready for display, shaped on the server (dates and
 * "days left" included) so client components render them as-is:
 *   notices   — every update, newest first
 *   deadlines — last dates still open, soonest first
 *   ticker    — what deserves the running line: last dates within three
 *               weeks and this week's news, else each portal's latest
 */
export async function getPortalFeed() {
  const { items, status } = await getPortalUpdates();
  // Later phases of a timetable wait until their window opens.
  const notices = items.filter((item) => !notStarted(item)).map(asNotice);
  const deadlines = upcomingDeadlines(items).map(asNotice);

  const soon = deadlines.filter((d) => d.deadline.days <= 21).slice(0, 4);
  let fresh = notices.filter((n) => n.isNew && !soon.some((s) => s.id === n.id)).slice(0, 8);
  if (fresh.length < 3) {
    const latest = new Map();
    for (const n of notices) if (!latest.has(n.source)) latest.set(n.source, n);
    fresh = [...fresh, ...[...latest.values()].filter((n) => !fresh.includes(n) && !soon.includes(n))].slice(0, 6);
  }
  const ticker = [...soon, ...fresh].map((n) => ({
    ...n,
    tickerTitle: n.title.length > 110 ? `${n.title.slice(0, 107).trim()}…` : n.title,
  }));

  return { notices, deadlines, ticker, status };
}
