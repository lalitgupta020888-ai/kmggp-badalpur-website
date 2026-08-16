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
  // Defaults to the gallery film, which is what the site did before the popup
  // became editable — so nothing changes until the admin chooses otherwise.
  'welcome-popup': () => ({
    enabled: true,
    kind: 'Gallery film',
    title: '',
    message: '',
    image: '',
    video: '',
    poster: '',
    icon: 'bi-megaphone-fill',
    buttonLabel: '',
    buttonHref: '',
    buttonIcon: 'bi-arrow-right',
    frequency: 'Every visit',
  }),

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

  'academic-calendar': () => ({
    file: '/documents/academic-calendar-2026-27.pdf',
    oddSemester: [
      { id: 'odd-1', icon: 'bi-play-circle-fill', event: 'Odd Semester Classes Begin', date: 'July 2026' },
      { id: 'odd-2', icon: 'bi-pencil-square', event: 'Mid Semester Examinations', date: 'October 2026' },
      { id: 'odd-3', icon: 'bi-journal-check', event: 'Practical Examinations', date: 'November 2026' },
      { id: 'odd-4', icon: 'bi-mortarboard-fill', event: 'Odd Semester Theory Examinations', date: 'November 2026' },
    ],
    evenSemester: [
      { id: 'even-1', icon: 'bi-play-circle-fill', event: 'Even Semester Classes Begin', date: 'January 2027' },
      { id: 'even-2', icon: 'bi-pencil-square', event: 'Mid Semester Examinations', date: 'March 2027' },
      { id: 'even-3', icon: 'bi-journal-check', event: 'Practical Examinations', date: 'April 2027' },
      { id: 'even-4', icon: 'bi-mortarboard-fill', event: 'Even Semester Theory Examinations', date: 'May 2027' },
    ],
  }),

  holidays: () => [
    { id: 'h1', date: 'August 15, 2026', occasion: 'Independence Day', day: 'Saturday', icon: 'bi-flag-fill' },
    { id: 'h2', date: 'October 2, 2026', occasion: 'Gandhi Jayanti', day: 'Friday', icon: 'bi-flower1' },
    { id: 'h3', date: 'October 24, 2026', occasion: 'Diwali', day: 'Saturday', icon: 'bi-lamp-fill' },
    { id: 'h4', date: 'November 5, 2026', occasion: 'Guru Nanak Jayanti', day: 'Thursday', icon: 'bi-brightness-high-fill' },
    { id: 'h5', date: 'December 25, 2026', occasion: 'Christmas Day', day: 'Friday', icon: 'bi-snow' },
    { id: 'h6', date: 'January 26, 2027', occasion: 'Republic Day', day: 'Tuesday', icon: 'bi-flag-fill' },
    { id: 'h7', date: 'March 4, 2027', occasion: 'Holi', day: 'Thursday', icon: 'bi-palette-fill' },
  ],

  'fee-structure': () => ({
    goFile: '/documents/FeeStructureGO.pdf',
    fees: [
      { id: 'tuition', head: 'Tuition Fee', amount: '₹ 10,370', period: 'Per Annum', icon: 'bi-mortarboard-fill' },
      { id: 'admission', head: 'Admission & Registration', amount: 'As per norms', period: 'One Time', icon: 'bi-file-earmark-text-fill' },
      { id: 'exam', head: 'Examination Fee', amount: 'As per BTEUP', period: 'Per Semester', icon: 'bi-pencil-square' },
      { id: 'hostel', head: 'Hostel Fee', amount: 'As per govt. norms', period: 'Per Annum', icon: 'bi-house-heart-fill' },
      { id: 'caution', head: 'Caution Money (Refundable)', amount: 'As per norms', period: 'One Time', icon: 'bi-piggy-bank-fill' },
    ],
    concessions: [
      'SC / ST category students are eligible for fee reimbursement under state government schemes.',
      'Students from economically weaker sections may apply for a full or partial fee waiver.',
      'The AICTE Pragati Scholarship provides additional financial support for girl students.',
      'Post-matric scholarship covers tuition fees for eligible candidates through direct benefit transfer.',
    ].map((text, index) => ({ id: `concession-${index + 1}`, text })),
    paymentModes: [
      { id: 'pm1', icon: 'bi-bank', label: 'Online transfer to the institute account' },
      { id: 'pm2', icon: 'bi-credit-card-fill', label: 'Debit card, credit card or net banking' },
      { id: 'pm3', icon: 'bi-upc-scan', label: 'UPI payment at the institute counter' },
      { id: 'pm4', icon: 'bi-receipt', label: 'Demand draft in favour of the Principal' },
    ],
  }),

  'aicte-letters': () =>
    ['2026-27', '2025-26', '2024-25', '2023-24', '2022-23'].map((session) => ({
      id: session,
      session,
      type: 'Extension of Approval (EOA)',
      status: 'Approved',
      file: '',
    })),

  booklet: () => ({
    title: 'Information Booklet 2026-27',
    file: '/documents/jeecup-information-booklet.pdf',
    contents: [
      'Introduction to the institute, its vision and mission',
      'Details of all diploma programmes and sanctioned intake',
      'Eligibility criteria and the complete JEECUP admission process',
      'Fee structure, scholarship schemes and fee concessions',
      'Faculty profiles and departmental laboratory facilities',
      'Hostel, library, transport and campus amenities',
      'Academic calendar, examination scheme and rules of discipline',
      'Training & placement activities and recruiter list',
    ].map((text, index) => ({ id: `content-${index + 1}`, text })),
    downloads: [
      { id: 'd1', icon: 'bi-file-earmark-pdf-fill', label: 'Information Booklet 2026-27 (PDF)', file: '/documents/jeecup-information-booklet.pdf' },
      { id: 'd2', icon: 'bi-file-earmark-text-fill', label: 'Admission Application Form (PDF)', file: '' },
      { id: 'd3', icon: 'bi-file-earmark-ruled-fill', label: 'Fee Structure Notification (PDF)', file: '' },
      { id: 'd4', icon: 'bi-file-earmark-check-fill', label: 'Document Checklist (PDF)', file: '' },
    ],
  }),

  'department-pages': () => ({
    homeIntroHeading: 'Welcome to',
    facultyIntro:
      'Our faculty combine strong academic credentials with industry awareness, mentoring every student individually through the three-year diploma programme.',
    facultyNote:
      'Faculty details are updated at the start of every academic session. For departmental enquiries, please contact the institute office.',
    labsIntro:
      'Practical work sits at the heart of every diploma programme. Our laboratories are equipped to give each student direct, hands-on experience with the tools and instruments used in industry.',
    achievementsIntro:
      'Our students and faculty consistently distinguish themselves in academics, competitions and campus recruitment. A few highlights from recent years are listed below.',
  }),

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
