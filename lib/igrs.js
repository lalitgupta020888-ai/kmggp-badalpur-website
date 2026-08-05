/**
 * Grievance Redressal System — client-side data layer.
 *
 * Ported from the standalone PolytechnicCollege IGRS page. Grievances are
 * held in localStorage, so this is a working prototype rather than a
 * server-backed system: data lives only in the visitor's own browser.
 */

const STORAGE_KEY = 'kmggp-grievances';

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

/** GR + last 8 digits of the timestamp + 5 random digits. */
export function generateRefNumber() {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(Math.random() * 100000)
    .toString()
    .padStart(5, '0');
  return `GR${timestamp}${random}`;
}

/**
 * Reference numbers must be unique: two grievances sharing one would let a
 * visitor look up somebody else's case. The timestamp alone is not enough
 * (several submissions can land in the same millisecond), so the candidate
 * is checked against what is already stored and regenerated on collision.
 */
function generateUniqueRefNumber(existing) {
  const taken = new Set(existing.map((g) => g.refNumber));
  for (let attempt = 0; attempt < 25; attempt += 1) {
    const candidate = generateRefNumber();
    if (!taken.has(candidate)) return candidate;
  }
  // Practically unreachable — fall back to a guaranteed-unique suffix.
  let counter = 0;
  let candidate = `${generateRefNumber()}X${counter}`;
  while (taken.has(candidate)) {
    counter += 1;
    candidate = `${generateRefNumber()}X${counter}`;
  }
  return candidate;
}

export function loadGrievances() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(list) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  } catch {
    /* storage unavailable (private mode / quota) — keep the UI working */
  }
  notifyGrievances();
}

/* --- Grievance store (useSyncExternalStore) -----------------------------
 * localStorage is an external store, so components read it through
 * useSyncExternalStore rather than an effect. The snapshot is cached because
 * the hook compares snapshots by identity, and it carries a `ready` flag so a
 * page can tell "still hydrating" apart from "genuinely not found".
 * -------------------------------------------------------------------- */

const SERVER_SNAPSHOT = { ready: false, list: [] };
let cachedSnapshot = null;
const grievanceListeners = new Set();

function notifyGrievances() {
  cachedSnapshot = null;
  grievanceListeners.forEach((listener) => listener());
}

function handleStorageEvent(event) {
  // key is null when storage is cleared wholesale
  if (!event.key || event.key === STORAGE_KEY) notifyGrievances();
}

export function subscribeGrievances(listener) {
  grievanceListeners.add(listener);
  if (grievanceListeners.size === 1 && typeof window !== 'undefined') {
    window.addEventListener('storage', handleStorageEvent);
  }
  return () => {
    grievanceListeners.delete(listener);
    if (grievanceListeners.size === 0 && typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorageEvent);
    }
  };
}

export function getGrievancesSnapshot() {
  if (!cachedSnapshot) cachedSnapshot = { ready: true, list: loadGrievances() };
  return cachedSnapshot;
}

export function getGrievancesServerSnapshot() {
  return SERVER_SNAPSHOT;
}

export function saveGrievance(data, type) {
  const now = new Date().toISOString();
  const list = loadGrievances();
  const grievance = {
    refNumber: generateUniqueRefNumber(list),
    type,
    ...data,
    status: 'Pending',
    submittedOn: now,
    lastUpdated: now,
    remarks: 'Your grievance has been received and is under review.',
  };
  list.push(grievance);
  persist(list);
  return grievance;
}

export function findGrievance(refNumber) {
  const target = String(refNumber || '').trim().toUpperCase();
  if (!target) return null;
  return loadGrievances().find((g) => g.refNumber === target) || null;
}

export function updateGrievance(refNumber, status, remarks) {
  const list = loadGrievances();
  const index = list.findIndex((g) => g.refNumber === refNumber);
  if (index === -1) return null;
  list[index] = {
    ...list[index],
    status,
    remarks,
    lastUpdated: new Date().toISOString(),
  };
  persist(list);
  return list[index];
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
 * NOTE: this check runs entirely in the browser, so it controls what the
 * UI shows and nothing more. It is not access control. Move authentication
 * to a server before this handles real grievance data.
 * -------------------------------------------------------------------- */

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin@kmggp2026';
const SESSION_KEY = 'kmggp-igrs-admin';

export function checkAdminCredentials(username, password) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

const sessionListeners = new Set();

function notifyAdminSession() {
  sessionListeners.forEach((listener) => listener());
}

export function setAdminSession(remember) {
  if (typeof window === 'undefined') return;
  // Only a flag is stored — never the password.
  const store = remember ? window.localStorage : window.sessionStorage;
  store.setItem(SESSION_KEY, 'true');
  notifyAdminSession();
}

export function hasAdminSession() {
  if (typeof window === 'undefined') return false;
  return (
    window.sessionStorage.getItem(SESSION_KEY) === 'true' ||
    window.localStorage.getItem(SESSION_KEY) === 'true'
  );
}

export function clearAdminSession() {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(SESSION_KEY);
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
