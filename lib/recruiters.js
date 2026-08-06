/**
 * Single source of truth for the organisations that recruit from campus.
 *
 * Read by the placements recruiters page and by the home page's recruiters
 * band. `sector` groups a company for the chip styling; it is not displayed
 * on its own.
 */
export const RECRUITERS = [
  { name: 'Tata Consultancy Services', short: 'TCS', sector: 'IT Services' },
  { name: 'Infosys', short: 'Infosys', sector: 'IT Services' },
  { name: 'Wipro Technologies', short: 'Wipro', sector: 'IT Services' },
  { name: 'HCL Technologies', short: 'HCL', sector: 'IT Services' },
  { name: 'Tech Mahindra', short: 'Tech Mahindra', sector: 'IT Services' },
  { name: 'L&T Technology Services', short: 'L&T', sector: 'Engineering' },
  { name: 'Samsung India Electronics', short: 'Samsung', sector: 'Electronics' },
  { name: 'Havells India', short: 'Havells', sector: 'Electronics' },
  { name: 'Genpact', short: 'Genpact', sector: 'Business Services' },
  { name: 'Concentrix', short: 'Concentrix', sector: 'Business Services' },
];

/**
 * The home page band scrolls this list continuously. The marquee is rendered
 * twice back to back so the loop has no visible seam, so keep the list long
 * enough to fill a wide viewport on its own.
 */
export const RECRUITER_MARQUEE = RECRUITERS;
