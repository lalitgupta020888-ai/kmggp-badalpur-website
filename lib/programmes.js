/**
 * Single source of truth for what the institute admits to, and on what seats.
 *
 * Courses Offered, the AICTE approval page, the About page and the home page
 * figure strip all quote the same programme count and the same intake — before
 * this file they each carried their own copy, and a change to one left the
 * others quietly wrong. Add a programme here and every one of them follows.
 *
 * Departments (`lib/departments.js`) are a different list: Applied Sciences and
 * the non-technical staff appear there because they exist, not because anyone
 * is admitted to them.
 */

/**
 * Lateral entry seats per branch, admitted into the third semester through
 * JEECUP Group K. Supernumerary — over and above the sanctioned first-year
 * intake, at the AICTE-permitted 10% of it.
 */
export const LATERAL_INTAKE = 7;

export const PROGRAMMES = [
  {
    slug: 'electronics',
    icon: 'bi-cpu-fill',
    name: 'Diploma in Electronics Engineering',
    short: 'Electronics Engineering',
    level: 'Diploma',
    duration: '3 Years (6 Semesters)',
    years: '3 Years',
    intake: 75,
    lateral: LATERAL_INTAKE,
    href: '/department/electronics',
    eligibility: 'Class 10th passed (min. 35%)',
    text: 'Analog and digital circuits, microprocessors, communication systems and embedded design.',
  },
  {
    slug: 'cse',
    icon: 'bi-pc-display',
    name: 'Diploma in Computer Science & Engineering',
    short: 'Computer Science & Engineering',
    level: 'Diploma',
    duration: '3 Years (6 Semesters)',
    years: '3 Years',
    intake: 75,
    lateral: LATERAL_INTAKE,
    href: '/department/cse',
    eligibility: 'Class 10th passed (min. 35%)',
    text: 'Programming, data structures, databases, operating systems and software development.',
  },
  {
    slug: 'it',
    icon: 'bi-hdd-network-fill',
    name: 'Diploma in Information Technology',
    short: 'Information Technology',
    level: 'Diploma',
    duration: '3 Years (6 Semesters)',
    years: '3 Years',
    intake: 75,
    lateral: LATERAL_INTAKE,
    href: '/department/it',
    eligibility: 'Class 10th passed (min. 35%)',
    text: 'Computer networks, web technologies, cloud fundamentals and IT infrastructure.',
  },
  {
    // `lateral: null` — a one year post graduate programme has no second year
    // to enter laterally into, so it is left out of every Group K listing.
    slug: 'retail-management',
    icon: 'bi-shop',
    name: 'P. G. Diploma in Retail Management',
    short: 'Retail Management',
    level: 'P. G. Diploma',
    duration: '1 Year (2 Semesters)',
    years: '1 Year',
    intake: 75,
    lateral: null,
    href: '/department/retail-management',
    eligibility: 'Graduation in any discipline',
    text: 'Store operations, merchandising, supply chain, retail marketing and customer relationship management.',
  },
];

/** Programmes that admit lateral entry candidates under JEECUP Group K. */
export const LATERAL_PROGRAMMES = PROGRAMMES.filter((programme) => programme.lateral);

export const PROGRAMME_COUNT = PROGRAMMES.length;

export const TOTAL_INTAKE = PROGRAMMES.reduce((sum, p) => sum + p.intake, 0);

export const TOTAL_LATERAL = LATERAL_PROGRAMMES.reduce((sum, p) => sum + p.lateral, 0);

export const TOTAL_SEATS = TOTAL_INTAKE + TOTAL_LATERAL;
