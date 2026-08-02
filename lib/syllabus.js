import { DEPARTMENTS } from './departments';

/**
 * Downloadable BTEUP syllabus documents, keyed by the same slugs as DEPARTMENTS.
 * The first year paper is common to all branches; the second year is always
 * branch specific. Computer Science and Information Technology have their own
 * final year papers, while Electronics follows the common NEP scheme.
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

export const SYLLABUS_SLUGS = Object.keys(SECOND_YEAR);

export function getSyllabus(slug) {
  const department = DEPARTMENTS[slug];
  if (!department) return null;

  return {
    ...department,
    years: [
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
    ],
  };
}
