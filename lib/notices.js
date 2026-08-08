/**
 * Single source of truth for notices and announcements.
 *
 * The notice board panel on the home page lists NOTICES. The ticker under the
 * stat strip runs the shorter TICKER_NOTICES list instead.
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

export const NOTICES = [
  {
    id: 1,
    title: 'Admission 2026-27 is now open — apply through JEECUP counselling',
    date: 'Aug 01, 2026',
    icon: 'bi-mortarboard-fill',
    isNew: true,
    link: '/admission/process',
  },
  {
    id: 2,
    title: 'Even Semester examination schedule released',
    date: 'Jul 15, 2026',
    icon: 'bi-calendar-check-fill',
    isNew: true,
    link: '/academic/calendar',
  },
  {
    id: 3,
    title: 'Campus placement drive by Tech Mahindra',
    date: 'Jul 10, 2026',
    icon: 'bi-briefcase-fill',
    isNew: false,
    link: '/placements/records',
  },
  {
    id: 4,
    title: 'National level hackathon — registrations open',
    date: 'Jun 25, 2026',
    icon: 'bi-trophy-fill',
    isNew: false,
    link: '/department/cse/achievements',
  },
  {
    id: 5,
    title: 'Post-matric scholarship forms — last date reminder',
    date: 'Jun 12, 2026',
    icon: 'bi-cash-coin',
    isNew: false,
    link: '/scholarship',
  },
];
