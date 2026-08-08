/**
 * Single source of truth for the Counselling & Admission 2026 section.
 *
 * The section sidebar and its landing page both read COUNSELLING_LINKS, so the
 * two never drift apart. The two login entries are hosted by JEECUP, not by the
 * institute — they carry `external` and open the government portal directly
 * rather than asking for credentials on our own site.
 */
export const JEECUP_PORTAL = 'https://jeecup.admissions.nic.in/';

/** Both sign-in pages sit on the NIC admissions host, not on jeecup.admissions.nic.in. */
export const JEECUP_COUNSELLOR_LOGIN =
  'https://admissions.nic.in/jeecup/AppMgmt/root/loginpage.aspx?enc=89xw0ctRCXfaXHy3CACizCFfMCcz5OWJrkZw7pFmob8=';

export const JEECUP_STUDENT_LOGIN =
  'https://admissions.nic.in/JEECUP/Applicant/root/Home.aspx?enc=89xw0ctRCXfaXHy3CACizC/iTtGlQ2gr3PqkYz7lYP3WNix3RnTHPpSWAVqmrvvIBdko3G7a8E156H8okrXF3g==';

export const COUNSELLING_LINKS = [
  {
    href: JEECUP_COUNSELLOR_LOGIN,
    label: 'Counsellor Login',
    icon: 'bi-person-badge-fill',
    external: true,
  },
  {
    href: '/counselling/document-verification',
    label: 'Document List for Verification',
    icon: 'bi-file-earmark-check-fill',
  },
  {
    href: '/counselling/document-admission',
    label: 'Document List for Admission',
    icon: 'bi-folder-check',
  },
  {
    href: '/counselling/instructions',
    label: 'Instruction for Candidates',
    icon: 'bi-info-square-fill',
  },
  {
    href: '/counselling/eligibility',
    label: 'Groupwise Eligibility Table',
    icon: 'bi-table',
  },
  {
    href: JEECUP_STUDENT_LOGIN,
    label: 'Student Login 4 Counselling',
    icon: 'bi-person-check-fill',
    external: true,
  },
  {
    href: '/counselling/schedule',
    label: 'Counselling Schedule for Engineering and Pharmacy Courses',
    icon: 'bi-calendar2-week-fill',
  },
];
