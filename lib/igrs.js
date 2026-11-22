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
  student: { label: 'Student', icon: 'bi-mortarboard-fill' },
  parent: { label: 'Parent', icon: 'bi-people-fill' },
  employee: { label: 'Employee', icon: 'bi-person-badge-fill' },
};

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
 * Credentials are checked on the server (app/igrs/admin/actions.js) against
 * the same accounts as /admin, which issues the signed session cookie the
 * committee actions require. Only a "signed in" flag is kept here, which
 * controls what the UI shows; grievances themselves live in Supabase.
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
