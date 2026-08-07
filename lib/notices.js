/**
 * Single source of truth for notices and announcements.
 *
 * The home page reads this twice — the notice board panel lists them, and the
 * ticker under the stat strip runs the same items past. Adding one here shows
 * up in both.
 */
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
