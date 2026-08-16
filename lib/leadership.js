/**
 * The dignitaries shown in the leadership grid on the home page.
 *
 * These change with every government reshuffle and every transfer, so they are
 * kept here as the starting set and are editable from the admin panel. A leader
 * without a `photo` falls back to a gold monogram, so the grid stays presentable
 * while a portrait is being arranged.
 */
export const LEADERS = [
  {
    id: 'chief-minister',
    name: 'Shri Yogi Adityanath',
    role: "Hon'ble Chief Minister",
    org: 'Government of Uttar Pradesh',
    photo: '/images/leadership/yogi-adityanath.webp',
  },
  {
    id: 'minister',
    name: 'Shri Ashish Patel',
    role: "Hon'ble Minister",
    org: 'Technical Education, Uttar Pradesh',
    photo: '/images/leadership/ashish-patel.png',
  },
  {
    id: 'principal-secretary',
    name: 'Dr. M. K. Shanmuga Sundaram (IAS)',
    role: 'Principal Secretary',
    org: 'Technical Education, Uttar Pradesh',
    photo: '/images/leadership/shanmuga-sundaram.png',
  },
  {
    id: 'director-general',
    name: 'Smt. Selva Kumari J. (IAS)',
    role: 'Director General',
    org: 'Technical Education, Uttar Pradesh',
    photo: '/images/leadership/selva-kumari.png',
  },
  {
    id: 'director',
    name: 'Shri Prabhakar Chandra Mishra',
    role: 'Director',
    org: 'Technical Education, Uttar Pradesh',
    photo: '/images/leadership/prabhakar-mishra.png',
  },
];

/** The heading above the leadership grid. */
export const LEADERSHIP_HEADING = {
  eyebrow: 'Under Their Guidance',
  title: 'Leadership That Lights Our Way',
  subtitle:
    'The dignitaries whose vision and stewardship guide technical education across Uttar Pradesh.',
};

/**
 * The Principal's Message teaser under the notice board.
 *
 * When a new Principal takes charge this is the one place that needs changing —
 * name, post and portrait all live here.
 */
export const PRINCIPAL = {
  name: 'Principal',
  role: 'Km. Mayawati Government Girls Polytechnic, Badalpur',
  photo: '',
  quote:
    'Education is the most powerful instrument a young woman can hold. Our purpose here is to place that instrument firmly in her hands.',
  linkLabel: 'Read Full Message',
};

/** First letters of the first two meaningful words, e.g. "Yogi Adityanath" → YA */
export function monogram(name) {
  return String(name || '')
    .replace(/\(.*?\)/g, '')
    .split(' ')
    .filter((word) => !['Shri', 'Smt.', 'Dr.', 'Km.', 'Mrs.', 'Ms.'].includes(word))
    .slice(0, 2)
    .map((word) => word[0] || '')
    .join('')
    .toUpperCase();
}
