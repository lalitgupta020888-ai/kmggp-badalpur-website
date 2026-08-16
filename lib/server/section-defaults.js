import 'server-only';

import { SLIDES } from '@/lib/hero';
import { STATS, HIGHLIGHTS, PILLARS, DEPARTMENTS as HOME_DEPARTMENTS, TESTIMONIALS } from '@/lib/home';
import { LEADERS, LEADERSHIP_HEADING, PRINCIPAL } from '@/lib/leadership';
import { MENUS, NAV_ACTIONS, TOPBAR, SOCIAL_LINKS, BRAND } from '@/lib/navigation';
import { OFFICE_DAYS, OFFICE_TIME } from '@/lib/institute';
import { RECRUITERS } from '@/lib/recruiters';
import { PERIODS, NOTES, TIMETABLE_SLUGS, getTimetable } from '@/lib/timetable';
import { DEPARTMENTS as DEPT_MAP } from '@/lib/departments';
import { PROGRAMMES } from '@/lib/programmes';
import { SYLLABUS_SLUGS, getSyllabus } from '@/lib/syllabus';
import { COUNSELLING_LINKS } from '@/lib/counselling';
import { COURSES, YEARS, RELATIONS, DEPARTMENTS as IGRS_DEPARTMENTS } from '@/lib/igrs';
import { ABOUT_PAGE, VISION_PAGE, PRINCIPAL_PAGE } from '@/lib/pages';

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

/** Faculty and achievement copy shipped as placeholders on every department. */
const SAMPLE_FACULTY = [
  { id: 'f1', name: 'Dr. Example Name', designation: 'Head of Department', qualification: 'Ph.D., M.Tech.', experience: '15 Years', photo: '' },
  { id: 'f2', name: 'Mrs. Faculty Two', designation: 'Lecturer', qualification: 'M.Tech.', experience: '8 Years', photo: '' },
  { id: 'f3', name: 'Ms. Faculty Three', designation: 'Lecturer', qualification: 'B.Tech.', experience: '3 Years', photo: '' },
];

const SAMPLE_ACHIEVEMENTS = [
  { id: 'a1', icon: 'bi-mortarboard-fill', title: 'Student Excellence', text: 'Many of our students have secured top ranks in the Board of Technical Education (BTEUP) examinations consistently over the last five years.' },
  { id: 'a2', icon: 'bi-briefcase-fill', title: 'Placements', text: 'Over 85% of eligible students were placed in leading multinational companies including Tech Mahindra, Wipro and Infosys during the recent placement drive.' },
  { id: 'a3', icon: 'bi-trophy-fill', title: 'Projects & Hackathons', text: 'Final year students recently won first prize at the State Level Technical Project Exhibition for their innovative Smart Campus project.' },
  { id: 'a4', icon: 'bi-people-fill', title: 'Workshops & Seminars', text: 'The department regularly hosts industry experts for technical seminars on emerging technologies and career pathways.' },
];

const SAMPLE_AWARDS = [
  { id: 'w1', year: '2026', title: 'First Prize — State Level Technical Project Exhibition', icon: 'bi-award-fill' },
  { id: 'w2', year: '2025', title: 'Best Performing Department — Institute Annual Awards', icon: 'bi-trophy-fill' },
  { id: 'w3', year: '2025', title: 'Top Ranks in BTEUP Diploma Examinations', icon: 'bi-star-fill' },
  { id: 'w4', year: '2024', title: 'Winners — Inter-Polytechnic Technical Quiz', icon: 'bi-patch-check-fill' },
];

/**
 * Departments, flattened from the keyed map into the list the editor works in.
 *
 * Faculty, achievements and awards were previously written into the page
 * components as one shared placeholder set, so every department showed the same
 * three lecturers. Each department now carries its own copy, seeded from that
 * placeholder — which is what makes them separately editable.
 */
const departmentDefaults = () =>
  Object.values(DEPT_MAP).map((department) => ({
    id: department.slug,
    slug: department.slug,
    name: department.name,
    short: department.short || '',
    icon: department.icon || 'bi-diagram-3-fill',
    seats: department.seats || '',
    duration: department.duration || '',
    tagline: department.tagline || '',
    intro: department.intro || '',
    focus: (department.focus || []).map((text, index) => ({ id: `focus-${index + 1}`, text })),
    labs: withIds(department.labs || [], 'lab'),
    // A staff listing has no faculty, laboratories or achievements at all.
    faculty: department.staff ? [] : SAMPLE_FACULTY,
    achievements: department.staff ? [] : SAMPLE_ACHIEVEMENTS,
    awards: department.staff ? [] : SAMPLE_AWARDS,
    staff: withIds(
      (department.staff || []).map((person) => ({ ...person, photo: person.photo || '' })),
      'staff',
    ),
  }));

/** The line each programme card carries on the syllabus listing page. */
const SYLLABUS_CARD_TEXT = {
  electronics:
    'Circuit theory, digital electronics, microprocessors, communication systems and embedded design.',
  cse: 'Programming fundamentals, data structures, databases, operating systems and software engineering.',
  it: 'Computer networks, web technologies, cloud fundamentals, cyber security and IT infrastructure.',
  'retail-management':
    'Retail operations, visual merchandising, supply chain, retail marketing and customer relationship management.',
};

const syllabusDefaults = () =>
  SYLLABUS_SLUGS.map((slug) => {
    const programme = getSyllabus(slug);
    return {
      id: slug,
      slug,
      name: programme?.name || slug,
      icon: programme?.icon || 'bi-journal-bookmark-fill',
      text: SYLLABUS_CARD_TEXT[slug] || '',
      structure: programme?.structure || '',
      papers: (programme?.years || []).map((year) => ({
        id: year.key,
        title: year.title,
        note: year.note,
        file: year.file || '',
      })),
    };
  });

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

  syllabus: syllabusDefaults,

  /* Departments */
  departments: departmentDefaults,

  /* Admissions */
  programmes: () => withIds(PROGRAMMES, 'programme'),
  'counselling-links': () => withIds(COUNSELLING_LINKS, 'counselling'),

  /* IGRS */
  'igrs-options': () => ({
    courses: withIds(COURSES, 'course'),
    years: withIds(YEARS, 'year'),
    relations: withIds(RELATIONS, 'relation'),
    departments: withIds(IGRS_DEPARTMENTS, 'igrs-dept'),
  }),

  /* Prose pages */
  'page-about': () => ABOUT_PAGE,
  'page-vision-mission': () => VISION_PAGE,
  'page-principal-message': () => PRINCIPAL_PAGE,

  /* Placements */
  recruiters: () => withIds(RECRUITERS, 'recruiter'),
};

/** The built-in content for a section, or null when the key is unknown. */
export function defaultsFor(key) {
  const build = SECTION_DEFAULTS[key];
  return build ? build() : null;
}
