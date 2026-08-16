import 'server-only';

import { SECTIONS } from '@/lib/sections/schema';
import { newId } from './store';
import * as s from './sanitise';

/**
 * Validation driven by the same field definitions the forms are built from.
 *
 * Every section shares this, so a new editable area gets full server-side
 * checking the moment it is described in the schema — there is no per-section
 * sanitiser to forget to write, and no way for a section to quietly skip the
 * link and icon rules that keep unsafe values out of the rendered page.
 *
 * Fields the schema does not mention are dropped rather than stored, so a
 * crafted request cannot smuggle extra keys into a record.
 */

const LIMITS = {
  text: 300,
  textarea: 3000,
  select: 120,
};

function cleanValue(field, value) {
  switch (field.type) {
    case 'textarea':
      return s.multiline(value, LIMITS.textarea);
    case 'check':
      return s.flag(value);
    case 'icon':
      return s.icon(value, field.fallback || 'bi-dot');
    case 'link':
    case 'media':
      return s.link(value);
    case 'number': {
      const parsed = Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    case 'select':
      return s.text(value, LIMITS.select);
    case 'items':
      return cleanList(field.fields, value);
    default:
      return s.text(value, field.max || LIMITS.text);
  }
}

function cleanRecord(fields, input) {
  const record = {};
  const source = input && typeof input === 'object' ? input : {};

  // An id is carried through when present so React keys and any future
  // cross-references stay stable across saves; otherwise one is minted.
  record.id = s.text(source.id, 40) || newId();

  for (const field of fields) {
    record[field.name] = cleanValue(field, source[field.name]);
  }
  return record;
}

function cleanList(fields, input) {
  return s.list(input, (item) => cleanRecord(fields, item));
}

/**
 * Clean one section's payload.
 *
 * Returns an array for a list section and a single object for a `single`
 * section. Throws on an unknown key rather than writing a file the site will
 * never read.
 */
export function sanitiseSection(key, payload) {
  const section = SECTIONS[key];
  if (!section) throw new Error(`Unknown section: ${key}`);

  if (section.type === 'single') {
    return cleanRecord(section.fields, payload);
  }

  const cleaned = cleanList(section.fields, payload);

  // A record with nothing in its first field is an empty row the admin added
  // and then left — dropping it keeps blank entries off the site.
  const [first] = section.fields;
  return first ? cleaned.filter((item) => String(item[first.name] || '').trim() !== '') : cleaned;
}
