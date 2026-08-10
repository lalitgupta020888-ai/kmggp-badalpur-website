/**
 * Single source of truth for the institute's departments — the three diploma
 * branches, the post graduate diploma in Retail Management and the Applied
 * Sciences department that teaches the common first year papers.
 * Used by the department layout, its pages and the main navigation.
 */
export const DEPARTMENTS = {
  electronics: {
    slug: 'electronics',
    name: 'Electronics Engineering',
    short: 'Electronics',
    icon: 'bi-cpu-fill',
    tagline: 'Circuits, microprocessors and communication systems',
    intro:
      'The Department of Electronics Engineering trains students in analog and digital circuit design, microprocessors, communication systems and embedded technology, blending strong fundamentals with extensive laboratory practice.',
    focus: [
      'Analog and digital circuit design',
      'Microprocessors and microcontrollers',
      'Communication and signal systems',
      'Embedded systems and IoT fundamentals',
    ],
    labs: [
      {
        icon: 'bi-cpu-fill',
        name: 'Electronics & Microprocessor Lab',
        text: 'CROs, function generators, microcontroller kits and simulation software for circuit design.',
      },
      {
        icon: 'bi-broadcast-pin',
        name: 'Communication Systems Lab',
        text: 'Modulation and demodulation trainers, antenna kits and signal analysis equipment.',
      },
      {
        icon: 'bi-lightning-charge-fill',
        name: 'Basic Electrical Lab',
        text: 'Measurement instruments, transformers and machine setups for foundational experiments.',
      },
      {
        icon: 'bi-diagram-2-fill',
        name: 'Digital Electronics Lab',
        text: 'Logic gate trainers, sequential circuit boards and digital design workstations.',
      },
    ],
  },
  cse: {
    slug: 'cse',
    name: 'Computer Science & Engineering',
    short: 'Computer Science',
    icon: 'bi-pc-display',
    tagline: 'Programming, data structures and modern software development',
    intro:
      'The Department of Computer Science & Engineering builds strong programming foundations and practical software engineering skills, preparing students for careers in development, data and IT services.',
    focus: [
      'Programming in C, Python and Java',
      'Data structures and algorithms',
      'Database management systems',
      'Web and software development practices',
    ],
    labs: [
      {
        icon: 'bi-pc-display-horizontal',
        name: 'Advanced Computing Lab',
        text: 'Modern i7 workstations with high-speed internet and a complete development toolchain.',
      },
      {
        icon: 'bi-database-fill',
        name: 'Database & Systems Lab',
        text: 'Relational database servers and tools for query design, modelling and administration.',
      },
      {
        icon: 'bi-code-slash',
        name: 'Software Development Lab',
        text: 'IDEs, version control and project workstations for full-stack application development.',
      },
      {
        icon: 'bi-tools',
        name: 'Hardware & Assembly Lab',
        text: 'Hands-on PC assembling, troubleshooting and peripheral configuration.',
      },
    ],
  },
  it: {
    slug: 'it',
    name: 'Information Technology',
    short: 'Information Technology',
    icon: 'bi-hdd-network-fill',
    tagline: 'Networking, web technologies and IT infrastructure',
    intro:
      'The Department of Information Technology focuses on computer networks, web technologies, cloud fundamentals and cyber security, equipping students to build and maintain modern IT infrastructure.',
    focus: [
      'Computer networks and administration',
      'Web technologies and cloud fundamentals',
      'Cyber security essentials',
      'IT infrastructure and support systems',
    ],
    labs: [
      {
        icon: 'bi-router-fill',
        name: 'Networking Lab',
        text: 'Routers, switches, structured cabling setups and network simulation environments.',
      },
      {
        icon: 'bi-globe2',
        name: 'Web Technology Lab',
        text: 'Workstations for front-end and back-end development, hosting and deployment practice.',
      },
      {
        icon: 'bi-cloud-fill',
        name: 'Cloud & Virtualisation Lab',
        text: 'Virtual machine environments for exploring cloud service models and deployment.',
      },
      {
        icon: 'bi-shield-lock-fill',
        name: 'Cyber Security Lab',
        text: 'Practical exercises in system hardening, safe networking and security auditing.',
      },
    ],
  },
  'retail-management': {
    slug: 'retail-management',
    name: 'P. G. Diploma in Retail Management',
    short: 'Retail Management',
    icon: 'bi-shop',
    tagline: 'Store operations, merchandising and customer relationship management',
    intro:
      'The Post Graduate Diploma in Retail Management prepares graduates for supervisory roles across organised retail, covering store operations, merchandising, supply chain and customer service, with a strong emphasis on communication and field exposure.',
    focus: [
      'Retail store operations and visual merchandising',
      'Supply chain, inventory and category management',
      'Customer relationship management and selling skills',
      'Retail accounting, marketing and business communication',
    ],
    labs: [
      {
        icon: 'bi-cart-check-fill',
        name: 'Retail Operations Lab',
        text: 'A simulated store floor with billing counters, POS terminals and shelf layouts for hands-on practice.',
      },
      {
        icon: 'bi-graph-up',
        name: 'Business Computing Lab',
        text: 'Workstations with spreadsheet, inventory and retail management software for analysis and reporting.',
      },
      {
        icon: 'bi-mic-fill',
        name: 'Communication & Soft Skills Lab',
        text: 'Group discussion, role-play and interview practice sessions for customer-facing roles.',
      },
    ],
  },
  'applied-sciences': {
    slug: 'applied-sciences',
    name: 'Applied Sciences & Humanities',
    short: 'Applied Sciences',
    icon: 'bi-rulers',
    tagline: 'Physics, chemistry, mathematics and communication skills',
    intro:
      'The Department of Applied Sciences & Humanities teaches the common first year curriculum for every diploma branch, building the foundation in applied physics, applied chemistry, applied mathematics and professional communication on which the specialisations are raised.',
    focus: [
      'Applied physics and applied chemistry',
      'Applied mathematics for engineering',
      'Professional communication and English',
      'Environmental studies and disaster management',
    ],
    labs: [
      {
        icon: 'bi-thermometer-half',
        name: 'Applied Physics Lab',
        text: 'Optical benches, measurement instruments and experiment setups for mechanics, optics and electricity.',
      },
      {
        icon: 'bi-eyedropper',
        name: 'Applied Chemistry Lab',
        text: 'Titration, water testing and material analysis apparatus with a fully stocked reagent store.',
      },
      {
        icon: 'bi-translate',
        name: 'Language & Communication Lab',
        text: 'Audio-visual stations for pronunciation, listening practice and presentation skills.',
      },
    ],
  },
};

export const DEPT_NAV = [
  { path: '', label: 'Department Home', icon: 'bi-house-door' },
  { path: '/faculty', label: 'Faculty', icon: 'bi-person-badge' },
  { path: '/labs', label: 'Laboratories', icon: 'bi-beaker' },
  { path: '/achievements', label: 'Achievements', icon: 'bi-trophy' },
];

export function getDepartment(slug) {
  return (
    DEPARTMENTS[slug] || {
      slug,
      name: 'Department',
      short: 'Department',
      icon: 'bi-diagram-3-fill',
      tagline: 'Technical education at Km. Mayawati Government Girls Polytechnic, Badalpur',
      intro:
        'This department is committed to excellence in technical education and the holistic development of every student.',
      focus: [],
      labs: [],
    }
  );
}
