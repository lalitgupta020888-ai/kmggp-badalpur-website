/**
 * Single source of truth for notices and announcements.
 *
 * The notice board panel on the home page lists the first few NOTICES, the
 * ticker under the stat strip runs the shorter TICKER_NOTICES list, and
 * `/notices` carries every one of them alongside the published orders.
 */
/**
 * The running ticker under the stat strip carries its own short list — the four
 * things a visitor most often arrives looking for. Three of them live on
 * government portals, so they carry `external: true` and open in a new tab.
 */
export const TICKER_NOTICES = [
  {
    id: 'bteup-result',
    title: 'BTEUP — Result',
    icon: 'bi-file-earmark-text-fill',
    isNew: true,
    link: 'https://result.bteexam.com/',
    external: true,
  },
  {
    id: 'jeecup-counselling',
    title: 'JEECUP Counselling',
    icon: 'bi-list-check',
    isNew: true,
    link: 'https://jeecup.admissions.nic.in/',
    external: true,
  },
  {
    id: 'admission-2026-27',
    title: 'Admission 2026-27',
    icon: 'bi-mortarboard-fill',
    isNew: true,
    link: '/admission/process',
  },
  {
    id: 'post-matric-scholarship',
    title: 'Post-matric Scholarship',
    icon: 'bi-cash-coin',
    isNew: false,
    link: 'https://scholarship.up.gov.in/',
    external: true,
  },
];

/**
 * `category` groups a notice for the filter on `/notices`. Keep it to one of
 * CATEGORIES below — anything else simply never matches a filter.
 */
export const NOTICES = [
  {
    id: 1,
    title: 'Admission 2026-27 is now open — apply through JEECUP counselling',
    date: 'Aug 01, 2026',
    icon: 'bi-mortarboard-fill',
    category: 'Admissions',
    isNew: true,
    link: '/admission/process',
  },
  {
    id: 2,
    title: 'Even Semester examination schedule released',
    date: 'Jul 15, 2026',
    icon: 'bi-calendar-check-fill',
    category: 'Academics',
    isNew: true,
    link: '/academic/calendar',
  },
  {
    id: 3,
    title: 'Campus placement drive by Tech Mahindra',
    date: 'Jul 10, 2026',
    icon: 'bi-briefcase-fill',
    category: 'Placements',
    isNew: false,
    link: '/placements/records',
  },
  {
    id: 4,
    title: 'National level hackathon — registrations open',
    date: 'Jun 25, 2026',
    icon: 'bi-trophy-fill',
    category: 'Events',
    isNew: false,
    link: '/department/cse/achievements',
  },
  {
    id: 5,
    title: 'Post-matric scholarship forms — last date reminder',
    date: 'Jun 12, 2026',
    icon: 'bi-cash-coin',
    category: 'Scholarships',
    isNew: false,
    link: '/scholarship',
  },
];

/** Filter buttons on `/notices`, in the order they are shown after "All". */
export const CATEGORIES = ['Admissions', 'Academics', 'Placements', 'Events', 'Scholarships'];

/**
 * Orders, circulars and official documents published by the institute — the
 * downloadable counterpart to the notices above. Every entry points at a file
 * that is actually in `public/documents`; add a row only once its PDF is
 * there, so nothing here can lead to a missing page.
 */
export const ORDERS = [
  {
    id: 'fee-structure-go',
    title: 'Fee Structure — Government Order',
    note: 'The sanctioned fee for every diploma programme, as notified by the Government of Uttar Pradesh.',
    icon: 'bi-cash-coin',
    file: '/documents/FeeStructureGO.pdf',
  },
  {
    id: 'academic-calendar',
    title: 'Academic Calendar 2026-27',
    note: 'Session dates, examination windows, and the teaching and vacation schedule for the year.',
    icon: 'bi-calendar3',
    file: '/documents/academic-calendar-2026-27.pdf',
  },
  {
    id: 'holiday-list',
    title: 'List of Holidays 2026-27',
    note: 'Gazetted and restricted holidays observed by the institute this session.',
    icon: 'bi-calendar-event',
    file: '/documents/holiday-list-2026-27.pdf',
  },
  {
    id: 'jeecup-booklet',
    title: 'JEECUP Information Booklet 2026-27',
    note: 'Entrance examination and counselling details for admission to all diploma programmes.',
    icon: 'bi-journal-richtext',
    file: '/documents/jeecup-information-booklet.pdf',
  },
];
