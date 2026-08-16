import 'server-only';

import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

import { RECORDS_DIR } from './paths';

/**
 * A small JSON-file store — one file per collection under `RECORDS_DIR`.
 *
 * The site holds a few hundred records at most (albums, notices, faculty), so a
 * database would be more moving parts than the content justifies. What this does
 * need is safety against a half-written file: a crash mid-write must not leave
 * the site with unreadable content. So every write goes to a temporary file and
 * is then renamed over the target, which is atomic on both Linux and Windows.
 *
 * Writes are also serialised per collection. Two admins saving at the same
 * moment would otherwise both read, both modify, and the second write would
 * silently discard the first one's change.
 */

/** Per-collection promise chain — the tail is the last queued write. */
const writeQueues = new Map();

function queue(collection, job) {
  const previous = writeQueues.get(collection) || Promise.resolve();
  // Swallow the previous job's rejection here so one failed write does not
  // poison every write that follows it on the same collection.
  const next = previous.catch(() => {}).then(job);
  writeQueues.set(collection, next);
  return next;
}

function fileFor(collection) {
  if (!/^[a-z0-9-]+$/.test(collection)) {
    throw new Error(`Invalid collection name: ${collection}`);
  }
  return path.join(RECORDS_DIR, `${collection}.json`);
}

async function ensureDir() {
  await fs.mkdir(RECORDS_DIR, { recursive: true });
}

/**
 * Read a collection. Returns `null` — not an empty array — when the admin has
 * never saved this collection, so callers can tell "no edits yet, use the
 * built-in defaults" apart from "the admin deliberately emptied this list".
 */
export async function readCollection(collection) {
  // Resolved outside the catch: an invalid name means a caller passed something
  // that is not one of our collections, which is a bug worth surfacing. Only
  // the disk read and parse below are tolerated and fall back to defaults.
  const file = fileFor(collection);

  try {
    const raw = await fs.readFile(file, 'utf8');
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    if (error.code === 'ENOENT') return null;
    // A corrupt file should not take the whole site down — fall back to
    // defaults and leave the bad file in place for inspection.
    console.error(`[store] Could not read collection "${collection}":`, error);
    return null;
  }
}

/** Overwrite a collection with `items`. */
export async function writeCollection(collection, items) {
  if (!Array.isArray(items)) throw new Error('A collection must be an array');

  return queue(collection, async () => {
    await ensureDir();
    const target = fileFor(collection);
    const temp = `${target}.${randomUUID()}.tmp`;
    await fs.writeFile(temp, JSON.stringify(items, null, 2), 'utf8');
    await fs.rename(temp, target);
    return items;
  });
}

/**
 * Read, transform and write a collection as one serialised step, so a
 * concurrent save cannot land between the read and the write.
 *
 * `mutate` receives the current items (an empty array if the collection has
 * never been written) and returns the new list.
 */
export function updateCollection(collection, mutate) {
  return queue(collection, async () => {
    await ensureDir();
    const current = (await readCollection(collection)) || [];
    const next = await mutate(current);
    if (!Array.isArray(next)) throw new Error('A collection must be an array');

    const target = fileFor(collection);
    const temp = `${target}.${randomUUID()}.tmp`;
    await fs.writeFile(temp, JSON.stringify(next, null, 2), 'utf8');
    await fs.rename(temp, target);
    return next;
  });
}

/** Remove a collection entirely, so it falls back to its built-in defaults. */
export async function resetCollection(collection) {
  return queue(collection, async () => {
    try {
      await fs.unlink(fileFor(collection));
    } catch (error) {
      if (error.code !== 'ENOENT') throw error;
    }
  });
}

/** A short, URL-safe, sortable id for new records. */
export function newId() {
  return randomUUID().slice(0, 8);
}
