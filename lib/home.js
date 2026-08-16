/**
 * Content blocks on the home page.
 *
 * Lifted out of the page component so the admin panel can edit them. DEPARTMENTS
 * here is the set of cards on the home page, which is deliberately separate from
 * the department pages in lib/departments.js — the cards are a shortlist with
 * their own artwork, not a mirror of every department.
 */

export const STATS = [
  { icon: 'bi-people-fill', value: '500+', label: 'Students Enrolled' },
  { icon: 'bi-diagram-3-fill', value: '04', label: 'Courses Offered' },
  { icon: 'bi-graph-up-arrow', value: '88%', label: 'Placement Rate' },
  { icon: 'bi-calendar2-check-fill', value: '2002', label: 'Established In' },
];

export const HIGHLIGHTS = [
  {
    icon: 'bi-collection-fill',
    title: 'Courses Offered',
    text: 'Four AICTE-approved programmes — diplomas in Electronics, Computer Science and Information Technology, and a PG diploma in Retail Management.',
    href: '/admission/courses',
  },
  {
    icon: 'bi-mortarboard-fill',
    title: 'Admissions 2026-27',
    text: 'Eligibility, the JEECUP counselling process, fee structure and the official information booklet.',
    href: '/admission/process',
  },
  {
    icon: 'bi-briefcase-fill',
    title: 'Training & Placements',
    text: 'A dedicated T&P cell, leading recruiters and a consistently strong campus placement record.',
    href: '/placements/records',
  },
  {
    icon: 'bi-stars',
    title: 'Life @ KMGGP',
    text: 'Clubs, cultural festivals, technical symposiums, sports and a secure on-campus hostel.',
    href: '/life',
  },
];

export const PILLARS = [
  {
    icon: 'bi-buildings-fill',
    title: 'Modern Infrastructure',
    text: 'Well-equipped laboratories, smart classrooms and a rich library on a green, secure 7.3-acre campus.',
  },
  {
    icon: 'bi-person-video3',
    title: 'Experienced Faculty',
    text: 'Highly qualified teaching staff committed to mentoring every student individually.',
  },
  {
    icon: 'bi-shield-lock-fill',
    title: 'Safe Girls Campus',
    text: 'A protected, women-only environment with hostel facilities and round-the-clock security.',
  },
  {
    icon: 'bi-cash-stack',
    title: 'Scholarship Support',
    text: 'State and central government schemes including the AICTE Pragati scheme for girls.',
  },
];

export const DEPARTMENTS = [
  {
    icon: 'bi-cpu-fill',
    name: 'Electronics Engineering',
    text: 'Circuits, microprocessors, communication systems and embedded design.',
    href: '/department/electronics',
    image: '/images/departments/electronics.png',
  },
  {
    icon: 'bi-pc-display',
    name: 'Computer Science & Engineering',
    text: 'Programming, data structures, databases and modern software development.',
    href: '/department/cse',
    image: '/images/departments/cse.png',
  },
  {
    icon: 'bi-hdd-network-fill',
    name: 'Information Technology',
    text: 'Networking, web technologies, cloud fundamentals and IT infrastructure.',
    href: '/department/it',
    image: '/images/departments/it.jpg',
  },
  {
    icon: 'bi-shop',
    name: 'P. G. Diploma in Retail Management',
    text: 'Store operations, merchandising, supply chain and customer relationship management.',
    href: '/department/retail-management',
    image: '/images/departments/retail-management.png',
  },
];

export const TESTIMONIALS = [
  {
    quote:
      'The Computer Science department here is phenomenal. The faculty are extremely supportive and the labs are well equipped. I secured a job at a top MNC directly through campus placements.',
    name: 'Anjali Sharma',
    meta: 'CSE, Batch of 2025',
    initial: 'A',
  },
  {
    quote:
      'Km. Mayawati Government Girls Polytechnic, Badalpur completely transformed my career. The practical approach in Electronics Engineering helped me understand core concepts effortlessly and gave me real confidence.',
    name: 'Priya Verma',
    meta: 'Electronics, Batch of 2024',
    initial: 'P',
  },
];
