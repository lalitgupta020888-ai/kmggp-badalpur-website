import { DEPARTMENTS } from './departments';

/**
 * Year-wise class time-tables, keyed by the same slugs as DEPARTMENTS. Built to
 * mirror `lib/syllabus.js` — the two pages read the same way and a reader who
 * has downloaded one knows exactly where to find the other.
 *
 * `file: null` means the document has not been published for this session. The
 * year is still listed, so a reader can see the scheme, but it is not offered
 * as a download until there is one. To publish, drop the PDF at the path named
 * below and set `file` to it — nothing else needs to change.
 */
const RETAIL_SLUG = 'retail-management';

/** Every programme whose time-table this page publishes. */
export const TIMETABLE_SLUGS = ['electronics', 'cse', 'it', RETAIL_SLUG];

/**
 * Suggested filenames, so the set stays predictable as documents arrive:
 *   /documents/time-table/<slug>-first-year.pdf
 *   /documents/time-table/<slug>-second-year.pdf
 *   /documents/time-table/<slug>-final-year.pdf
 */
const FILES = {
  electronics: { first: null, second: null, final: null },
  cse: { first: null, second: null, final: null },
  it: { first: null, second: null, final: null },
  [RETAIL_SLUG]: { first: null },
};

const DIPLOMA_YEARS = [
  {
    key: 'first',
    title: 'First Year',
    semesters: 'Semesters I & II',
    note: 'The common first year scheme — lectures, tutorials and the shared science and workshop laboratories.',
  },
  {
    key: 'second',
    title: 'Second Year',
    semesters: 'Semesters III & IV',
    note: 'Branch specialisation begins; the week fills with core theory papers and departmental laboratory batches.',
  },
  {
    key: 'final',
    title: 'Final Year',
    semesters: 'Semesters V & VI',
    note: 'Advanced electives alongside major project slots and industrial training.',
  },
];

const RETAIL_YEARS = [
  {
    key: 'first',
    title: 'First Year',
    semesters: 'Semesters I & II',
    note: 'Both semesters of the post graduate diploma — retail operations and merchandising, then supply chain, customer relationship management and the industry project.',
  },
];

/**
 * Six one-hour periods with a lunch break in the middle, filling the institute
 * day of 10:00 AM to 5:00 PM. `isBreak` marks the recess row so it reads as a
 * divider rather than another period.
 */
export const PERIODS = [
  { period: 'I', time: '10:00 AM – 11:00 AM', kind: 'Theory' },
  { period: 'II', time: '11:00 AM – 12:00 Noon', kind: 'Theory' },
  { period: 'III', time: '12:00 Noon – 01:00 PM', kind: 'Theory' },
  { period: 'Lunch / Break', time: '01:00 PM – 02:00 PM', kind: 'Recess', isBreak: true },
  { period: 'IV', time: '02:00 PM – 03:00 PM', kind: 'Practical' },
  { period: 'V', time: '03:00 PM – 04:00 PM', kind: 'Practical' },
  { period: 'VI', time: '04:00 PM – 05:00 PM', kind: 'Practical / Remedial' },
];

export const NOTES = [
  'Classes run Monday to Saturday, 10:00 AM to 5:00 PM, with a lunch break from 1:00 PM to 2:00 PM.',
  'Saturday is reserved for remedial and project work.',
  'Laboratory batches are split as notified on the department notice board.',
  'Any change in the schedule is announced by the department a day in advance.',
];

export function getTimetable(slug) {
  const department = DEPARTMENTS[slug];
  if (!department || !TIMETABLE_SLUGS.includes(slug)) return null;

  const isRetail = slug === RETAIL_SLUG;
  const scheme = isRetail ? RETAIL_YEARS : DIPLOMA_YEARS;

  return {
    ...department,
    structure: isRetail
      ? 'The post graduate diploma runs for one year across two semesters, on the same six-period day as the diploma branches.'
      : 'The diploma runs for three years across six semesters. Each year has its own weekly scheme, with theory in the morning and laboratory batches after the lunch break.',
    years: scheme.map((year) => ({
      ...year,
      title: `${year.title} Time-Table`,
      file: FILES[slug][year.key] ?? null,
    })),
  };
}
