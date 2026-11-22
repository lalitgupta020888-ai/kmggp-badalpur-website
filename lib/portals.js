/**
 * Updates pulled automatically from the government portals the institute
 * depends on — shared constants and helpers, safe for the browser.
 *
 * The fetching lives in lib/server/portals/; this file only describes the
 * sources and how an update is labelled, so the notice board, the ticker and
 * the notices page all present them the same way.
 */

export const PORTALS = {
  bteup: {
    label: 'BTEUP',
    name: 'Board of Technical Education, U.P.',
    icon: 'bi-building-fill-check',
    home: 'https://bteup.ac.in/',
    all: 'https://bteup.ac.in/webapp/AllNews.aspx',
    tone: 'tone-bteup',
  },
  jeecup: {
    label: 'JEECUP',
    name: 'Joint Entrance Examination Council (Polytechnic), U.P.',
    icon: 'bi-clipboard2-check-fill',
    home: 'https://jeecup.admissions.nic.in/',
    all: 'https://jeecup.admissions.nic.in/notices/',
    tone: 'tone-jeecup',
  },
  upscholarship: {
    label: 'UP Scholarship',
    name: 'Scholarship & Fee Reimbursement, U.P.',
    icon: 'bi-cash-coin',
    home: 'https://scholarship.up.gov.in/',
    all: 'https://scholarship.up.gov.in/',
    tone: 'tone-scholarship',
  },
  aicte: {
    label: 'AICTE',
    name: 'All India Council for Technical Education',
    icon: 'bi-bank2',
    home: 'https://www.aicte.gov.in/',
    all: 'https://www.aicte.gov.in/bulletins/annoucement',
    tone: 'tone-aicte',
  },
  nsp: {
    label: 'NSP',
    name: 'National Scholarship Portal',
    icon: 'bi-award-fill',
    home: 'https://scholarships.gov.in/',
    all: 'https://scholarships.gov.in/student-announcements',
    tone: 'tone-nsp',
  },
};

export const PORTAL_KEYS = Object.keys(PORTALS);

/**
 * Topic tags, detected from the title (Hindi and English), so a visitor can
 * pick out exams, results or last dates across every portal at once.
 */
export const TOPICS = [
  { key: 'deadline', label: 'Last Date', icon: 'bi-alarm-fill', test: /अंतिम\s*तिथि|last\s*date|तिथि\s*(?:विस्तार|बढ़|बढा)|विस्तारित|date\s*extend|extended|extension|अवसर\s*प्रदान/i },
  { key: 'exam', label: 'Examination', icon: 'bi-journal-check', test: /परीक्षा|exam|admit\s*card|प्रवेश\s*पत्र|एडमिट/i },
  { key: 'practical', label: 'Practical', icon: 'bi-tools', test: /प्रयोगात्मक|प्रायोगिक|practical|viva/i },
  { key: 'result', label: 'Result', icon: 'bi-trophy-fill', test: /परिणाम|परीक्षाफल|result|rank\s*card|merit/i },
  { key: 'enrollment', label: 'Enrollment', icon: 'bi-person-vcard-fill', test: /नामांकन|इनरोलमेंट|enrol+ment|registration|पंजीकरण/i },
  { key: 'admission', label: 'Admission', icon: 'bi-door-open-fill', test: /प्रवेश|admission|counsel+ing|काउंस|seat\s*allot/i },
  { key: 'scholarship', label: 'Scholarship', icon: 'bi-cash-stack', test: /छात्रवृत्ति|scholarship|शुल्क\s*प्रतिपूर्ति|fee\s*reimburse|fellowship/i },
  { key: 'go', label: 'Govt. Order', icon: 'bi-file-earmark-ruled-fill', test: /शासनादेश|government\s*order|\bG\.?\s?O\.?\b|notification|अधिसूचना|circular|परिपत्र|नियमावली/i },
];

export function topicsFor(title) {
  return TOPICS.filter((t) => t.test.test(String(title || ''))).map((t) => t.key);
}

/** Days from today (local) to an ISO date; negative once it has passed. */
export function daysUntil(iso, now = new Date()) {
  if (!iso) return null;
  const end = new Date(iso);
  if (Number.isNaN(end.getTime())) return null;
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  return Math.round((target - start) / 86400000);
}

/** "Closes today" / "3 days left" / "Closed". */
export function deadlineLabel(iso, now = new Date()) {
  const days = daysUntil(iso, now);
  if (days === null) return '';
  if (days < 0) return 'Closed';
  if (days === 0) return 'Closes today';
  if (days === 1) return '1 day left';
  return `${days} days left`;
}

/** 18 Nov 2026 — dates on the board are days, not timestamps. */
export function formatDay(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' });
}

/**
 * When the item is from: its own date, or else when the site first saw it —
 * except for items that were already on the portal at the first import, whose
 * real date is unknown.
 */
export function itemDate(item) {
  return item.date || (item.seeded ? null : item.firstSeen) || null;
}

/** New for a week after it was published (or first appeared). */
export function isFresh(item, now = Date.now()) {
  const when = new Date(itemDate(item) || 0).getTime();
  return when > 0 && now - when < 7 * 86400000;
}

/**
 * A scheduled step whose window has not opened yet (e.g. a later phase of the
 * scholarship timetable). It is neither news nor a running deadline today.
 */
export function notStarted(item, now = new Date()) {
  const start = item.deadline?.start;
  return Boolean(start) && daysUntil(start, now) > 0;
}

/** Deadlines open now (or closed within `graceDays`), soonest first. */
export function upcomingDeadlines(items, { graceDays = 0, now = new Date() } = {}) {
  return items
    .filter((item) => item.deadline?.end && daysUntil(item.deadline.end, now) >= -graceDays && !notStarted(item, now))
    .sort((a, b) => new Date(a.deadline.end) - new Date(b.deadline.end));
}

/** The ticker/board shape the rest of the site already understands. */
export function asNotice(item) {
  const portal = PORTALS[item.source] || {};
  const days = item.deadline?.end ? daysUntil(item.deadline.end) : null;
  return {
    id: `portal-${item.id}`,
    title: item.title,
    source: item.source,
    sourceLabel: portal.label,
    icon: portal.icon || 'bi-globe2',
    tone: portal.tone,
    link: item.link,
    external: true,
    isNew: isFresh(item),
    date: formatDay(itemDate(item)),
    sortDate: itemDate(item),
    deadline: item.deadline?.end ? { end: item.deadline.end, label: formatDay(item.deadline.end), left: deadlineLabel(item.deadline.end), days } : null,
    topics: item.topics || [],
    section: item.section || '',
  };
}
