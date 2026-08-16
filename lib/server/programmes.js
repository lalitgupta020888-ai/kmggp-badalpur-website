import 'server-only';

import { getSection } from './sections';

/**
 * Courses, and the totals every page quotes from them.
 *
 * The counts are derived rather than stored so they cannot drift: adding a
 * course in the panel updates the programme count on the About page, the seat
 * totals on the AICTE page and the figures on the home page at the same time.
 */
export async function getProgrammes() {
  const programmes = await getSection('programmes');
  return programmes.map((programme) => ({
    ...programme,
    intake: Number(programme.intake) || 0,
    lateral: Number(programme.lateral) || 0,
  }));
}

export async function getProgrammeTotals() {
  const programmes = await getProgrammes();
  const lateralProgrammes = programmes.filter((programme) => programme.lateral > 0);

  const totalIntake = programmes.reduce((sum, programme) => sum + programme.intake, 0);
  const totalLateral = lateralProgrammes.reduce((sum, programme) => sum + programme.lateral, 0);

  return {
    programmes,
    lateralProgrammes,
    programmeCount: programmes.length,
    totalIntake,
    totalLateral,
    totalSeats: totalIntake + totalLateral,
    // Every branch is granted the same lateral allowance, so the first one that
    // has any is representative — which is what the pages quote in prose.
    lateralIntake: lateralProgrammes[0]?.lateral || 0,
  };
}
