/**
 * Grievance Redressal System — shared constants and helpers for the browser.
 *
 * Grievances themselves are stored in Supabase, one table per user type
 * (see lib/server/igrs.js); pages reach them only through server actions.
 */

export const STATUSES = ['Pending', 'In Progress', 'Resolved', 'Rejected'];

export const STATUS_META = {
  Pending: { icon: 'bi-hourglass-split', tone: 'is-pending' },
  'In Progress': { icon: 'bi-arrow-repeat', tone: 'is-progress' },
  Resolved: { icon: 'bi-check-circle-fill', tone: 'is-resolved' },
  Rejected: { icon: 'bi-x-circle-fill', tone: 'is-rejected' },
};

export const COURSES = [
  { value: 'ece', label: 'Electronics Engineering' },
  { value: 'cse', label: 'Computer Science & Engineering' },
  { value: 'it', label: 'Information Technology' },
];

export const YEARS = [
  { value: '1', label: 'First Year' },
  { value: '2', label: 'Second Year' },
  { value: '3', label: 'Third Year' },
];

/**
 * Semesters run two to a year (Year 1 → Sem 1–2, Year 2 → Sem 3–4 …). If the
 * year options are edited to something that is not a number, every semester
 * is offered.
 */
export const ALL_SEMESTERS = ['1', '2', '3', '4', '5', '6'];

export function semestersFor(year) {
  const n = Number.parseInt(year, 10);
  if (!Number.isInteger(n) || n < 1 || n > 3) return ALL_SEMESTERS;
  return [String(2 * n - 1), String(2 * n)];
}

const ORDINAL = { 1: '1st', 2: '2nd', 3: '3rd', 4: '4th', 5: '5th', 6: '6th' };
export const semesterLabel = (value) => `${ORDINAL[value] || value} Semester`;

/** Employees quote their pension account: NPS (PRAN) or GPF number. */
export const PENSION_SCHEMES = [
  { value: 'NPS', label: 'NPS' },
  { value: 'GPF', label: 'GPF' },
];

export const RELATIONS = [
  { value: 'father', label: 'Father' },
  { value: 'mother', label: 'Mother' },
  { value: 'guardian', label: 'Guardian' },
  { value: 'other', label: 'Other' },
];

export const DEPARTMENTS = [
  { value: 'ece', label: 'Electronics Engineering' },
  { value: 'cse', label: 'Computer Science & Engineering' },
  { value: 'it', label: 'Information Technology' },
  { value: 'admin', label: 'Administration' },
  { value: 'library', label: 'Library' },
  { value: 'other', label: 'Other' },
];

export const CATEGORIES = {
  student: [
    { value: 'academic', label: 'Academic' },
    { value: 'examination', label: 'Examination' },
    { value: 'hostel', label: 'Hostel' },
    { value: 'library', label: 'Library' },
    { value: 'canteen', label: 'Canteen' },
    { value: 'other', label: 'Other' },
  ],
  parent: [
    { value: 'academic', label: 'Academic' },
    { value: 'fee', label: 'Fee Related' },
    { value: 'hostel', label: 'Hostel' },
    { value: 'discipline', label: 'Discipline' },
    { value: 'other', label: 'Other' },
  ],
  employee: [
    { value: 'salary', label: 'Salary' },
    { value: 'leave', label: 'Leave' },
    { value: 'work', label: 'Work Environment' },
    { value: 'facilities', label: 'Facilities' },
    { value: 'other', label: 'Other' },
  ],
};

export const TYPE_META = {
  student: { label: 'Student', icon: 'bi-mortarboard-fill', letter: 'S' },
  parent: { label: 'Parent / Guardian', icon: 'bi-people-fill', letter: 'P' },
  employee: { label: 'Faculty / Staff', icon: 'bi-person-badge-fill', letter: 'E' },
};

/** Look a stored option value up in a `{ value, label }` list. */
export function optionLabel(list, value) {
  return (list || []).find((o) => o.value === value)?.label || value || '';
}

/**
 * The complainant's identity, as label/value rows — one definition shared by
 * the committee dashboard, the CSV export and the committee email, so the
 * three always agree. `options` is the IGRS dropdown section.
 */
export function identityRows(g, options = {}) {
  if (g.type === 'student') {
    return [
      ['Student name', g.name],
      ['Enrollment no.', g.enrollmentNumber],
      ['Course', optionLabel(options.courses || COURSES, g.course)],
      ['Year / Semester', [optionLabel(options.years || YEARS, g.year), g.semester && semesterLabel(g.semester)].filter(Boolean).join(' · ')],
      ['Mobile', g.phone],
      ['Email', g.email],
    ];
  }
  if (g.type === 'parent') {
    return [
      ['Parent / guardian', g.parentName],
      ['Relation', optionLabel(options.relations || RELATIONS, g.relation)],
      ['Student name', g.name],
      ['Student enrollment no.', g.enrollmentNumber],
      ['Mobile', g.phone],
      ['Email', g.email],
    ];
  }
  return [
    ['Name', g.name],
    [g.pensionScheme ? `${g.pensionScheme} no.` : 'NPS / GPF no.', g.employeeId],
    ['Department', optionLabel(options.departments || DEPARTMENTS, g.department)],
    ['Designation', g.designation],
    ['Mobile', g.phone],
    ['Email', g.email],
  ];
}

/** The person who filed it — the parent on a parent grievance. */
export function complainantName(g) {
  return (g.type === 'parent' ? g.parentName : g.name) || '';
}

/** Category label for a grievance of a given type. */
export function categoryLabel(type, value) {
  return optionLabel(CATEGORIES[type], value);
}

export function formatDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

/* --- Admin session -----------------------------------------------------
 * The committee signs in with its own account (lib/server/igrs-auth.js),
 * which sets an httpOnly session cookie that every committee action checks.
 * Only a "signed in" flag is kept here, which decides what the UI shows.
 * -------------------------------------------------------------------- */

const SESSION_KEY = 'kmggp-igrs-admin';

const sessionListeners = new Set();

// Used when the browser refuses storage, so signing in still works for the page.
let memoryFlag = false;

function notifyAdminSession() {
  sessionListeners.forEach((listener) => listener());
}

/** Run a storage call; blocked site data makes even reading it throw. */
function tryStorage(work, fallback) {
  try {
    return work();
  } catch {
    return fallback;
  }
}

export function setAdminSession(remember) {
  if (typeof window === 'undefined') return;
  memoryFlag = true;
  // Only a flag is stored — never the password.
  tryStorage(() => (remember ? window.localStorage : window.sessionStorage).setItem(SESSION_KEY, 'true'));
  notifyAdminSession();
}

export function hasAdminSession() {
  if (typeof window === 'undefined') return false;
  return (
    memoryFlag ||
    tryStorage(() => window.sessionStorage.getItem(SESSION_KEY) === 'true', false) ||
    tryStorage(() => window.localStorage.getItem(SESSION_KEY) === 'true', false)
  );
}

export function clearAdminSession() {
  if (typeof window === 'undefined') return;
  memoryFlag = false;
  tryStorage(() => window.sessionStorage.removeItem(SESSION_KEY));
  tryStorage(() => window.localStorage.removeItem(SESSION_KEY));
  notifyAdminSession();
}

/** Session flag as an external store, so pages need no mount effect. */
export function subscribeAdminSession(listener) {
  sessionListeners.add(listener);
  return () => sessionListeners.delete(listener);
}

export function getAdminSessionSnapshot() {
  return hasAdminSession();
}

export function getAdminSessionServerSnapshot() {
  return false;
}
