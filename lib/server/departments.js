import 'server-only';

import { getSection } from './sections';

/**
 * Departments, read from the admin panel and shaped the way the pages expect.
 *
 * The editor stores `focus` as a list of records so it can be reordered in the
 * panel, but the pages render it as plain strings — that flattening happens here
 * rather than in each of the four department pages.
 */
export async function getDepartments() {
  const departments = await getSection('departments');
  return departments.map((department) => ({
    ...department,
    focus: (department.focus || []).map((item) => item.text).filter(Boolean),
    // Only a department that actually lists staff should switch into the
    // directory-only mode, so an empty list reads the same as none at all.
    staff: department.staff?.length ? department.staff : null,
  }));
}

/**
 * One department by slug.
 *
 * An unknown slug returns a neutral placeholder rather than null, matching what
 * the pages did before: a department page typed by hand should read as an empty
 * department, not crash.
 */
export async function getDepartment(slug) {
  const departments = await getDepartments();
  return (
    departments.find((department) => department.slug === slug) || {
      slug,
      name: 'Department',
      short: 'Department',
      icon: 'bi-diagram-3-fill',
      tagline: 'Technical education at Km. Mayawati Government Girls Polytechnic, Badalpur',
      intro:
        'This department is committed to excellence in technical education and the holistic development of every student.',
      focus: [],
      labs: [],
      faculty: [],
      achievements: [],
      awards: [],
      staff: null,
    }
  );
}

/** The sidebar for a department — a staff listing has only its directory. */
export function deptNav(department) {
  return department.staff
    ? [{ path: '', label: 'Staff Directory', icon: 'bi-people-fill' }]
    : [
        { path: '', label: 'Department Home', icon: 'bi-house-door' },
        { path: '/faculty', label: 'Faculty', icon: 'bi-person-badge' },
        { path: '/labs', label: 'Laboratories', icon: 'bi-beaker' },
        { path: '/achievements', label: 'Achievements', icon: 'bi-trophy' },
      ];
}
