import 'server-only';

import { getJson, getText } from './http';

/**
 * One reader per portal. Each returns a list of raw updates:
 *   { title, link, date?, deadline?: { start?, end }, section?, ref? }
 * and throws if the portal could not be read, so the sync keeps the last good
 * copy rather than wiping that portal's updates.
 *
 * The portals publish no feeds, so these read the same JSON or HTML their own
 * pages use. That markup can change without notice; each reader therefore
 * refuses to report "nothing" (an empty result is treated as a failure), and
 * the admin status page shows when a portal last read successfully.
 */

/* ------------------------------- Text helpers ----------------------------- */

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“', hellip: '…' };

export function decode(text) {
  return String(text || '')
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(Number.parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+);/gi, (m, name) => ENTITIES[name.toLowerCase()] ?? m);
}

/** Tag-free, single-spaced, trimmed text. */
export function clean(html, max = 400) {
  return decode(String(html || '').replace(/<[^>]*>/g, ' '))
    .replace(/\s+/g, ' ')
    .replace(/\s*[|।]\s*$/u, '')
    .trim()
    .slice(0, max);
}

/** An absolute http(s) URL, or '' for anything else (javascript:, #, …). */
export function absolute(href, base) {
  const raw = decode(String(href || '').trim());
  if (!raw || raw.startsWith('#') || /^javascript:/i.test(raw)) return '';
  try {
    const url = new URL(raw.replace(/;jsessionid=[^?#]*/i, ''), base);
    return url.protocol === 'http:' || url.protocol === 'https:' ? url.toString() : '';
  } catch {
    return '';
  }
}

const MONTHS = { jan: 0, feb: 1, mar: 2, apr: 3, may: 4, jun: 5, jul: 6, aug: 7, sep: 8, oct: 9, nov: 10, dec: 11 };

/** yyyy-mm-dd → ISO at noon IST, which reads as that day anywhere in India. */
function isoDay(y, m, d) {
  if (!(y > 2000 && y < 2100 && m >= 0 && m < 12 && d >= 1 && d <= 31)) return null;
  const date = new Date(Date.UTC(y, m, d, 6, 30));
  return date.getUTCMonth() === m ? date.toISOString() : null;
}

/** Reads "22-07-2026", "31/10/2026", "July 22, 2026", "2 November, 2026", ISO. */
export function parseDate(text) {
  const s = String(text || '').trim();
  let m = s.match(/(\d{4})-(\d{2})-(\d{2})T/);
  if (m) return isoDay(+m[1], +m[2] - 1, +m[3]);
  m = s.match(/\b(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})\b/);
  if (m) return isoDay(+m[3], +m[2] - 1, +m[1]);
  m = s.match(/\b([A-Za-z]{3,9})\.?\s+(\d{1,2}),?\s+(\d{4})\b/);
  if (m && MONTHS[m[1].slice(0, 3).toLowerCase()] !== undefined) return isoDay(+m[3], MONTHS[m[1].slice(0, 3).toLowerCase()], +m[2]);
  m = s.match(/\b(\d{1,2})(?:st|nd|rd|th)?\s+([A-Za-z]{3,9}),?\s+(\d{4})\b/);
  if (m && MONTHS[m[2].slice(0, 3).toLowerCase()] !== undefined) return isoDay(+m[3], MONTHS[m[2].slice(0, 3).toLowerCase()], +m[1]);
  return null;
}

/** A last date written into the title itself ("…extended UPTO 31/10/2026"). */
function deadlineFromTitle(title) {
  const text = String(title || '');
  // "अंतिम तिथि" / "last date" / "upto" — but not "अंतिम संशोधन तिथि" (a revision date).
  if (!/अंतिम\s*तिथि|last\s*date|\bup\s*to\b|\bupto\b|\btill\b|तक/i.test(text)) return null;
  const dates = [...text.matchAll(/\b\d{1,2}[-/.]\d{1,2}[-/.]\d{4}\b/g)].map((m) => parseDate(m[0])).filter(Boolean);
  return dates.length ? { end: dates[dates.length - 1] } : null;
}

/** A date no earlier than 2015 and not in the future (allowing a day's skew). */
function plausible(iso) {
  if (!iso) return null;
  const t = new Date(iso).getTime();
  return t > Date.UTC(2015, 0, 1) && t < Date.now() + 86400000 ? iso : null;
}

/** Each anchor in an HTML fragment: { text, href }. */
function anchors(html) {
  return [...String(html || '').matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)].map((m) => ({
    text: clean(m[2]),
    href: (m[1].match(/href\s*=\s*"([^"]*)"/i) || m[1].match(/href\s*=\s*'([^']*)'/i) || [])[1] || '',
  }));
}

function between(html, start, end) {
  const i = html.indexOf(start);
  if (i < 0) return '';
  const j = end ? html.indexOf(end, i + start.length) : -1;
  return html.slice(i, j < 0 ? i + 20000 : j);
}

function needItems(list, portal) {
  if (!list.length) throw new Error(`${portal}: no updates found — the page layout may have changed`);
  return list;
}

/* ---------------------------------- BTEUP --------------------------------- */

/** .NET ticks in BTEUP's file names (NEWS_639306254843567950.pdf) are IST. */
function ticksToIso(ticks) {
  try {
    const ms = Number((BigInt(ticks) - 621355968000000000n) / 10000n) - 5.5 * 3600 * 1000;
    return plausible(new Date(ms).toISOString());
  } catch {
    return null;
  }
}

export async function readBteup() {
  const base = 'https://bteup.ac.in/';
  const list = await getJson(`${base}InstituteContent/999/Content/LatestNewsContent.json`);
  if (!Array.isArray(list)) throw new Error('BTEUP: unexpected news format');
  return needItems(
    list
      .slice(0, 40)
      .map((n) => {
        const title = clean(n.HindiNodeName || n.NodeName);
        const ticks = /NEWS_(\d{15,})/.exec(n.NodeLink || '')?.[1];
        return {
          ref: `bteup:${n.NodeId}`,
          title,
          link: absolute(n.NodeLink, base),
          date: ticks ? ticksToIso(ticks) : null,
          section: 'Latest News',
          deadline: deadlineFromTitle(title),
        };
      })
      .filter((n) => n.title),
    'BTEUP',
  );
}

/* ------------------------------ UP Scholarship ---------------------------- */

export async function readUpScholarship() {
  const base = 'https://scholarship.up.gov.in/';
  const [home, alerts] = await Promise.all([
    getText(base),
    getJson(`${base}index.aspx/GetAlertBoxData`, {
      method: 'POST',
      body: JSON.stringify({ scheme: 'Post' }),
      headers: { 'Content-Type': 'application/json' },
    }).catch(() => null),
  ]);

  const items = [];

  // "Timetables" — the scholarship schedule GOs, newest first.
  const timetable = between(home, '>Timetables<', '</table>');
  for (const row of timetable.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((c) => c[1]);
    if (cells.length < 4) continue;
    const scheme = clean(cells[1]);
    const category = clean(cells[2]);
    const link = absolute(anchors(cells[4] || cells[3])[0]?.href, base);
    if (!scheme) continue;
    items.push({
      title: `छात्रवृत्ति समय-सारिणी (शासनादेश): ${scheme} — ${category}`,
      link: link || base,
      date: plausible(parseDate(cells[3])),
      section: 'Timetable / GO',
    });
  }

  // "महत्वपूर्ण तिथियाँ" — each step of the post-matric schedule with its window.
  const rows = alerts?.d ? [...String(alerts.d).matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)] : [];
  for (const row of rows) {
    const cells = [...row[1].matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map((c) => clean(c[1]));
    if (cells.length < 3 || !cells[0]) continue;
    const start = parseDate(cells[1]);
    const end = parseDate(cells[2]);
    if (!end) continue;
    items.push({
      // The same step can recur in another phase with other dates.
      ref: `ups-date:${cells[0]}|${cells[1]}|${cells[2]}`,
      title: `दशमोत्तर छात्रवृत्ति: ${cells[0]}`,
      link: base,
      // A step that has not started yet is not "news" dated in the future.
      date: plausible(start),
      deadline: { start, end },
      section: 'Important Dates',
    });
  }

  // "महत्वपूर्ण जानकारी" — the instructions running across the top.
  const ticker = between(home, 'newsticker', '</ul>');
  for (const a of anchors(ticker).slice(0, 8)) {
    if (a.text.length < 12) continue;
    items.push({ title: a.text, link: absolute(a.href, base) || base, section: 'Important Information' });
  }

  return needItems(items, 'UP Scholarship');
}

/* ---------------------------------- AICTE --------------------------------- */

export async function readAicte() {
  const base = 'https://www.aicte.gov.in/';
  const home = await getText(base);
  const items = [];
  for (const chunk of home.split('class="marqueeItem"').slice(1, 30)) {
    const block = chunk.slice(0, 2500);
    const a = anchors(block)[0];
    if (!a?.text) continue;
    const when = block.match(/<time[^>]*datetime="([^"]+)"/i)?.[1];
    items.push({
      title: a.text,
      link: absolute(a.href, base) || base,
      date: plausible(parseDate(when)),
      section: 'Notifications',
      deadline: deadlineFromTitle(a.text),
    });
  }
  return needItems(items, 'AICTE');
}

/* ------------------------- National Scholarship Portal --------------------- */

export async function readNsp() {
  const page = 'https://scholarships.gov.in/student-announcements';
  const html = await getText(page);
  const heading = html.search(/<h4[^>]*>\s*Announcements\s*<\/h4>/i);
  const end = heading < 0 ? -1 : html.indexOf('</section>', heading);
  const list = heading < 0 ? '' : html.slice(heading, end < 0 ? heading + 20000 : end);
  const items = [];
  for (const li of list.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)) {
    const title = clean(li[1], 500);
    if (title.length < 20) continue;
    const lastDate = title.match(/last\s*date[^.]*?(\d{1,2}[-/.]\d{1,2}[-/.]\d{4})/i)?.[1];
    items.push({
      title,
      link: page,
      section: 'Student Announcements',
      deadline: lastDate ? { end: parseDate(lastDate) } : null,
    });
  }
  return needItems(items, 'NSP');
}

/* --------------------------------- JEECUP --------------------------------- */

/** S3WaaS uploads carry their date: …/uploads/2026/08/20260818….pdf */
function s3waasDate(link) {
  const m = /\/uploads\/\d{4}\/\d{2}\/(\d{4})(\d{2})(\d{2})/.exec(link || '');
  return m ? plausible(isoDay(+m[1], +m[2] - 1, +m[3])) : null;
}

export async function readJeecup() {
  const base = 'https://jeecup.admissions.nic.in/';
  const [home, notices] = await Promise.all([getText(base), getText(`${base}notices/`).catch(() => '')]);
  const items = [];
  const add = (title, href, section) => {
    const text = clean(title).replace(/\s*\bNew$/i, '').trim();
    // Skip tab headings ("NEWS & EVENTS") and in-page anchors.
    if (text.length < 8 || String(href || '').startsWith('#')) return;
    if (/^(news\s*&\s*events|public\s*notices|latest\s*news|candidate\s*activity\s*board)$/i.test(text)) return;
    const link = absolute(href, base) || base;
    items.push({ title: text, link, date: s3waasDate(link), section, deadline: deadlineFromTitle(text) });
  };

  // Latest news ticker — often plain text without a link.
  const ticker = between(home, 'LATEST NEWS', '</ul>');
  for (const li of ticker.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)) {
    const a = anchors(li[1])[0];
    add(li[1].replace(/<span class="latest-news">[\s\S]*?<\/span>/i, ''), a?.href, 'Latest News');
  }

  // News & Events and Public Notices tabs.
  const news = between(home, 'id="whats-new" data-vc-content', 'id="forms" data-vc-content');
  for (const a of anchors(news)) add(a.text, a.href, 'News & Events');
  const forms = between(home, 'id="forms" data-vc-content', 'vc_tta-panels-container"></div>') || between(home, 'id="forms" data-vc-content', 'CANDIDATE ACTIVITY BOARD');
  for (const a of anchors(forms)) add(a.text, a.href, 'Public Notices');

  // Candidate activity board — results and allotments.
  const board = between(home, 'CANDIDATE ACTIVITY BOARD', '</ul>');
  for (const a of anchors(board)) add(a.text, a.href, 'Candidate Activity');

  // The full public-notice archive, which dates every file.
  for (const row of notices.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)) {
    const a = anchors(row[1])[0];
    if (a) add(a.text, a.href, 'Public Notices');
  }

  // The same notice appears in several blocks; keep the dated copy.
  const byTitle = new Map();
  for (const item of items) {
    const key = item.title.toLowerCase().replace(/[^a-z0-9ऀ-ॿ]+/g, '');
    const seen = byTitle.get(key);
    if (!seen || (!seen.date && item.date)) byTitle.set(key, { ...seen, ...item, section: seen?.section || item.section });
  }
  return needItems([...byTitle.values()], 'JEECUP');
}

export const READERS = {
  bteup: readBteup,
  jeecup: readJeecup,
  upscholarship: readUpScholarship,
  aicte: readAicte,
  nsp: readNsp,
};
