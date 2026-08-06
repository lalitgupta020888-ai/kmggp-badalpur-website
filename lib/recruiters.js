/**
 * Single source of truth for the organisations that recruit from campus.
 *
 * Read by the placements recruiters page and by the home page's recruiters
 * band. `sector` groups a company for the chip styling; it is not displayed
 * on its own.
 *
 * `logo` is optional. A company with one is shown as a logo card on the home
 * page — greyscale at rest, full colour on hover; a company without one falls
 * back to a wordmark card in the same frame, so the grid stays even either
 * way. To add a logo, drop the file into `public/images/recruiters/` and point
 * `logo` at it. Prefer a file with a white or transparent background: the card
 * sits on white and the greyscale treatment assumes no coloured backdrop.
 */
export const RECRUITERS = [
  {
    name: 'Tata Consultancy Services',
    short: 'TCS',
    sector: 'IT Services',
    logo: '/images/recruiters/tcs.jpg',
  },
  {
    name: 'Infosys',
    short: 'Infosys',
    sector: 'IT Services',
    logo: '/images/recruiters/infosys.jpg',
  },
  {
    name: 'Wipro Technologies',
    short: 'Wipro',
    sector: 'IT Services',
    logo: '/images/recruiters/wipro.jpg',
  },
  {
    name: 'HCL Technologies',
    short: 'HCL',
    sector: 'IT Services',
    logo: '/images/recruiters/hcltech.jpg',
  },
  {
    name: 'Tech Mahindra',
    short: 'Tech Mahindra',
    sector: 'IT Services',
    logo: '/images/recruiters/tech-mahindra.jpg',
  },
  { name: 'L&T Technology Services', short: 'L&T', sector: 'Engineering' },
  { name: 'Samsung India Electronics', short: 'Samsung', sector: 'Electronics' },
  { name: 'Havells India', short: 'Havells', sector: 'Electronics' },
  { name: 'Genpact', short: 'Genpact', sector: 'Business Services' },
  { name: 'Concentrix', short: 'Concentrix', sector: 'Business Services' },
];
