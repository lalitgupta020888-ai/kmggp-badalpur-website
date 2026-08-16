import 'server-only';

import { getSection } from './sections';
import { getDepartment } from './departments';

/**
 * A programme's syllabus page, merged from two sections.
 *
 * The documents themselves belong to the syllabus section, while the
 * introduction and the focus areas belong to the department — the page shows
 * both, and keeping them in one place would mean the same prose had to be
 * maintained twice.
 */
export async function getSyllabusFor(slug) {
  const programmes = await getSection('syllabus');
  const programme = programmes.find((entry) => entry.slug === slug);
  if (!programme) return null;

  const department = await getDepartment(slug);

  return {
    ...programme,
    intro: department.intro,
    focus: department.focus,
    tagline: department.text || programme.text,
    short: department.short || programme.name,
    downloadsTitle: 'Year-wise Syllabus',
    downloadsNote:
      programme.papers?.length === 1
        ? 'Download the official syllabus document for the programme.'
        : 'Download the official BTEUP syllabus document for each year of the diploma.',
    years: programme.papers || [],
  };
}
