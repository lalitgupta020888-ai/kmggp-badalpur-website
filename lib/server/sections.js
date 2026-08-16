import 'server-only';

import { cache } from 'react';

import { SECTIONS } from '@/lib/sections/schema';
import { defaultsFor } from './section-defaults';
import { readCollection } from './store';

/**
 * Reading a schema-described section.
 *
 * Same rule as the hand-built sections: whatever the admin saved wins, and
 * until they save anything the site shows the content it shipped with.
 */
export const getSection = cache(async (key) => {
  const section = SECTIONS[key];
  if (!section) return null;

  const stored = await readCollection(section.collection);

  if (section.type === 'single') {
    // Singles are stored as a one-item array so the store stays uniform. Fields
    // added to the schema after a save would be missing from the stored record,
    // so the defaults are merged underneath rather than replaced outright.
    const defaults = defaultsFor(key) || {};
    return stored?.[0] ? { ...defaults, ...stored[0] } : defaults;
  }

  return stored ?? defaultsFor(key) ?? [];
});

/** Read several sections at once. */
export async function getSections(keys) {
  const values = await Promise.all(keys.map((key) => getSection(key)));
  return Object.fromEntries(keys.map((key, index) => [key, values[index]]));
}
