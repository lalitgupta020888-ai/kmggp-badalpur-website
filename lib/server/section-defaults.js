import 'server-only';

import { SLIDES } from '@/lib/hero';
import { STATS, HIGHLIGHTS, PILLARS, DEPARTMENTS as HOME_DEPARTMENTS, TESTIMONIALS } from '@/lib/home';
import { LEADERS, LEADERSHIP_HEADING, PRINCIPAL } from '@/lib/leadership';
import { MENUS, NAV_ACTIONS, TOPBAR, SOCIAL_LINKS, BRAND } from '@/lib/navigation';
import { OFFICE_DAYS, OFFICE_TIME } from '@/lib/institute';
import { RECRUITERS } from '@/lib/recruiters';
import { PERIODS, NOTES, TIMETABLE_SLUGS, getTimetable } from '@/lib/timetable';

/**
 * What each section shows before the admin has ever saved it.
 *
 * These come from the same `lib/` modules the site was originally built on, so
 * a fresh deployment with an empty disk is fully populated, and "Restore
 * original content" has something to restore to.
 *
 * A few shapes are flattened on the way through. The editor renders a flat list
 * of fields, so a hero slide's nested `primary: { href, label, icon }` becomes
 * `primaryHref` / `primaryLabel` / `primaryIcon` here and is folded back into
 * the nested shape when the site reads it.
 */

const heroDefaults = () =>
  SLIDES.map((slide, index) => ({
    id: `slide-${index + 1}`,
    src: slide.src || '',
    alt: slide.alt || '',
    position: slide.position || 'center center',
    eyebrow: slide.eyebrow || '',
    icon: slide.icon || 'bi-award-fill',
    title: slide.title || '',
    text: slide.text || '',
    primaryLabel: slide.primary?.label || '',
    primaryHref: slide.primary?.href || '',
    primaryIcon: slide.primary?.icon || 'bi-arrow-right',
    secondaryLabel: slide.secondary?.label || '',
    secondaryHref: slide.secondary?.href || '',
    secondaryIcon: slide.secondary?.icon || 'bi-arrow-right',
  }));

/** The line each programme card carries on the time-table listing page. */
const TIMETABLE_CARD_TEXT = {
  electronics:
    'Lecture, tutorial and laboratory slots for all six semesters of the Electronics diploma.',
  cse: 'Weekly class schedule with programming and project laboratory allocations.',
  it: 'Weekly class schedule covering networking, web technology and security laboratories.',
  'retail-management':
    'Weekly schedule for the retail operations, merchandising and business computing sessions.',
};

const timetableDefaults = () =>
  TIMETABLE_SLUGS.map((slug) => {
    const programme = getTimetable(slug);
    return {
      id: slug,
      slug,
      name: programme?.name || slug,
      icon: programme?.icon || 'bi-clock-history',
      text: TIMETABLE_CARD_TEXT[slug] || '',
      structure: programme?.structure || '',
      semesters: (programme?.semesters || []).map((semester) => ({
        id: semester.key,
        title: semester.title,
        year: semester.year,
        note: semester.note,
        file: semester.file || '',
      })),
    };
  });

const withIds = (items, prefix) =>
  items.map((item, index) => ({ id: item.id || `${prefix}-${index + 1}`, ...item }));

export const SECTION_DEFAULTS = {
  /* Navigation */
  'nav-menus': () =>
    MENUS.map((menu) => ({
      id: menu.id,
      label: menu.label,
      href: menu.href || '',
      items: withIds(menu.items || [], `${menu.id}-item`),
    })),
  'nav-actions': () => withIds(NAV_ACTIONS, 'action'),
  topbar: () => TOPBAR,
  'social-links': () => withIds(SOCIAL_LINKS, 'social'),
  brand: () => BRAND,

  /* Home page */
  'hero-slides': heroDefaults,
  'home-stats': () => withIds(STATS, 'stat'),
  'home-highlights': () => withIds(HIGHLIGHTS, 'highlight'),
  'home-pillars': () => withIds(PILLARS, 'pillar'),
  'home-departments': () => withIds(HOME_DEPARTMENTS, 'dept-card'),
  leadership: () => withIds(LEADERS, 'leader'),
  'leadership-heading': () => LEADERSHIP_HEADING,
  'principal-card': () => PRINCIPAL,
  testimonials: () => withIds(TESTIMONIALS, 'voice'),

  /* Institute */
  institute: () => ({
    officeDays: OFFICE_DAYS,
    officeTime: OFFICE_TIME,
    mapLat: '28.593145',
    mapLng: '77.51895',
    mapName:
      'Km. Mayawati Government Girls Polytechnic, Badalpur, Gautambuddh Nagar, Uttar Pradesh - 203207',
  }),

  /* Academics */
  timetable: timetableDefaults,
  periods: () => withIds(PERIODS, 'period'),
  'timetable-notes': () => NOTES.map((text, index) => ({ id: `note-${index + 1}`, text })),

  /* Placements */
  recruiters: () => withIds(RECRUITERS, 'recruiter'),
};

/** The built-in content for a section, or null when the key is unknown. */
export function defaultsFor(key) {
  const build = SECTION_DEFAULTS[key];
  return build ? build() : null;
}
