/**
 * The main navigation, as data.
 *
 * The bar used to be written out as JSX, one `<HoverDropdown>` per menu, which
 * meant adding a menu item was a code change. It is a list now so the admin
 * panel can add, rename, reorder and remove both menus and their items.
 *
 * A menu with `items` opens as a dropdown. A menu with only an `href` is a
 * plain link in the bar — that is how Placements, Gallery and Contact behave,
 * because each of those sections carries its own sidebar of sub-pages.
 */
export const MENUS = [
  {
    id: 'about',
    label: 'About',
    items: [
      { href: '/about', label: 'About the Institute', icon: 'bi-buildings-fill' },
      { href: '/about/vision-mission', label: 'Vision & Mission', icon: 'bi-bullseye' },
      { href: '/about/principal-message', label: "Principal's Message", icon: 'bi-person-video2' },
      { href: '/about/approvals', label: 'Approvals by Statutory Bodies', icon: 'bi-patch-check-fill' },
      {
        href: '/about/aicte-approvals',
        label: 'AICTE Approval Letters',
        icon: 'bi-file-earmark-pdf-fill',
      },
    ],
  },
  {
    id: 'departments',
    label: 'Departments',
    items: [
      { href: '/department/electronics', label: 'Electronics Engineering', icon: 'bi-cpu-fill' },
      { href: '/department/cse', label: 'Computer Science & Engineering', icon: 'bi-pc-display' },
      { href: '/department/it', label: 'Information Technology', icon: 'bi-hdd-network-fill' },
      {
        href: '/department/retail-management',
        label: 'P. G. Diploma in Retail Management',
        icon: 'bi-shop',
      },
      {
        href: '/department/applied-sciences',
        label: 'Applied Sciences & Humanities',
        icon: 'bi-rulers',
      },
      { href: '/department/non-technical-staff', label: 'Non-Technical Staff', icon: 'bi-people-fill' },
    ],
  },
  {
    id: 'academics',
    label: 'Academics',
    items: [
      { href: '/academic/calendar', label: 'Academic Calendar', icon: 'bi-calendar3' },
      { href: '/academic/holidays', label: 'List of Holidays', icon: 'bi-calendar-event' },
      { href: '/academic/syllabus', label: 'Syllabus', icon: 'bi-journal-bookmark' },
      { href: '/academic/time-table', label: 'Time-Table', icon: 'bi-clock-history' },
      { href: '/academic/verification', label: 'Educational Verification', icon: 'bi-patch-check' },
      {
        href: '/academic/caution-money-refund',
        label: 'Policy & Process for Refund of Caution Money',
        icon: 'bi-piggy-bank-fill',
      },
      {
        href: '/academic/certificate-issuance',
        label: 'Issuance of Certificate for Passout Students',
        icon: 'bi-award-fill',
      },
    ],
  },
  {
    id: 'admissions',
    label: 'Admissions',
    items: [
      { href: '/admission/courses', label: 'Courses Offered', icon: 'bi-collection' },
      { href: '/admission/process', label: 'Admission Process', icon: 'bi-signpost-split' },
      { href: '/admission/fee', label: 'Fee Structure', icon: 'bi-cash-coin' },
      { href: '/admission/booklet', label: 'Information Booklet 26-27', icon: 'bi-file-earmark-pdf' },
    ],
  },
  {
    id: 'student',
    label: 'Student Section',
    items: [
      { href: '/student/urise-portal', label: 'Urise Portal', icon: 'bi-globe2' },
      { href: '/scholarship', label: 'Scholarship', icon: 'bi-cash-stack' },
    ],
  },
  { id: 'placements', label: 'Placements', href: '/placements/tnp-department', match: '/placements' },
  {
    id: 'life',
    label: 'Life@KMGGP',
    items: [
      { href: '/life', label: 'Life @ KMGGP', icon: 'bi-stars' },
      { href: '/life/events', label: 'Events', icon: 'bi-balloon-fill' },
      { href: '/life/hostels', label: 'Hostels', icon: 'bi-house-heart-fill' },
      { href: '/life/library', label: 'Library', icon: 'bi-book-half' },
      { href: '/life/result', label: 'Result', icon: 'bi-file-earmark-text' },
    ],
  },
  { id: 'gallery', label: 'Gallery', href: '/gallery' },
  { id: 'contact', label: 'Contact', href: '/contact' },
];

/**
 * The buttons at the right of the bar.
 *
 * `style` picks the treatment: `ghost` for the small icon buttons, `cta` for
 * the gold enquiry button, `highlight` for the counselling button. `shortLabel`
 * is what the button says once the bar runs out of room.
 */
export const NAV_ACTIONS = [
  {
    id: 'admin',
    href: '/login',
    label: 'Admin Login',
    shortLabel: 'Admin Login',
    icon: 'bi-person-lock',
    style: 'ghost',
  },
  {
    id: 'igrs',
    href: '/igrs/student',
    label: 'IGRS Grievance Portal',
    shortLabel: 'IGRS',
    icon: 'bi-shield-check',
    style: 'ghost',
  },
  {
    id: 'enquiry',
    href: '/admission/enquiry',
    label: 'Admission Enquiry',
    shortLabel: 'Enquiry',
    icon: 'bi-send-fill',
    style: 'cta',
  },
  {
    id: 'counselling',
    href: '/counselling',
    label: 'Counselling & Admission 2026',
    shortLabel: 'Counselling 2026',
    icon: 'bi-clipboard2-check-fill',
    style: 'highlight',
    match: '/counselling',
  },
];

/** The utility strip above the navbar. */
export const TOPBAR = {
  address: 'Badalpur, Gautam Buddha Nagar, Uttar Pradesh',
  phone: '+91 XXXXX XXXXX',
  phoneHref: 'tel:+910000000000',
  email: 'info@kmggp.ac.in',
  accreditation: 'Govt. of Uttar Pradesh | Approved by AICTE | Affiliated to BTEUP',
  staffLabel: 'Employee Section',
  staffHref: '/employee',
};

/** Social profiles in the utility strip. An empty `href` hides the icon. */
export const SOCIAL_LINKS = [
  { id: 'facebook', label: 'Facebook', icon: 'bi-facebook', href: '' },
  { id: 'instagram', label: 'Instagram', icon: 'bi-instagram', href: '' },
  { id: 'youtube', label: 'YouTube', icon: 'bi-youtube', href: '' },
  { id: 'x', label: 'X', icon: 'bi-twitter-x', href: '' },
];

/** The crest and wordmark at the left of the bar. */
export const BRAND = {
  logo: '/images/logo.png',
  line1: 'Km. Mayawati Government Girls',
  line2: 'Polytechnic, Badalpur',
};
