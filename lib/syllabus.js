import { DEPARTMENTS } from './departments';

/**
 * Downloadable syllabus documents, keyed by the same slugs as DEPARTMENTS.
 *
 * The three diploma branches share a first year paper and split from the second
 * year on; Computer Science and Information Technology have their own final
 * year papers, while Electronics follows the common NEP scheme. The PG diploma
 * runs to its own two semester scheme instead — a different shape, so it is
 * described separately rather than bent into the year-wise one.
 *
 * `file: null` means the document has not been published yet. The paper is
 * still listed, so a reader can see what the scheme contains, but it is not
 * offered as a download until there is one.
 */
const FIRST_YEAR = '/documents/syllabus/first-year-common.pdf';
const FINAL_YEAR_COMMON = '/documents/syllabus/final-year-nep-330.pdf';

const SECOND_YEAR = {
  electronics: '/documents/syllabus/electronics-second-year.pdf',
  cse: '/documents/syllabus/cse-second-year.pdf',
  it: '/documents/syllabus/it-second-year.pdf',
};

const FINAL_YEAR = {
  electronics: FINAL_YEAR_COMMON,
  cse: '/documents/syllabus/cse-third-year.pdf',
  it: '/documents/syllabus/it-third-year.pdf',
};

const RETAIL_SLUG = 'retail-management';

function diplomaYears(department, slug) {
  return [
    {
      key: 'first',
      title: `First Year ${department.name} Syllabus`,
      note: 'Common curriculum prescribed for all engineering and technology branches.',
      file: FIRST_YEAR,
    },
    {
      key: 'second',
      title: `Second Year ${department.name} Syllabus`,
      note: 'Branch specialisation begins — core theory papers and laboratory work.',
      file: SECOND_YEAR[slug],
    },
    {
      key: 'final',
      title: `Final Year ${department.name} Syllabus`,
      note: 'Fifth and sixth semester scheme, including the major project and industrial training.',
      file: FINAL_YEAR[slug],
    },
  ];
}

function retailSemesters() {
  return [
    {
      key: 'first',
      title: 'First Semester Syllabus',
      note: 'Retail environment and operations, merchandising, business communication and retail accounting.',
      file: null,
    },
    {
      key: 'second',
      title: 'Second Semester Syllabus',
      note: 'Supply chain and category management, customer relationship management, retail marketing and the industry project.',
      file: null,
    },
  ];
}

export const SYLLABUS_SLUGS = [...Object.keys(SECOND_YEAR), RETAIL_SLUG];

export function getSyllabus(slug) {
  const department = DEPARTMENTS[slug];
  if (!department || !SYLLABUS_SLUGS.includes(slug)) return null;

  const isRetail = slug === RETAIL_SLUG;

  return {
    ...department,
    // Both the heading over the download list and the paragraph describing the
    // scheme change with the programme — a one year PG diploma has no "years"
    // to list and no first year common to anything.
    downloadsTitle: isRetail ? 'Semester-wise Syllabus' : 'Year-wise Syllabus',
    downloadsNote: isRetail
      ? 'Download the official syllabus document for each semester of the programme.'
      : 'Download the official BTEUP syllabus document for each year of the diploma.',
    structure: isRetail
      ? 'The post graduate diploma runs for one year across two semesters. The first semester establishes retail operations and merchandising, and the second moves to supply chain, customer relationship management and an industry project.'
      : 'The three-year diploma is delivered under the curriculum prescribed by the Board of Technical Education, Uttar Pradesh. The first year is common to all engineering and technology branches; specialisation begins in the second year and concludes with a major project and industrial training in the final year.',
    years: isRetail ? retailSemesters() : diplomaYears(department, slug),
  };
}
