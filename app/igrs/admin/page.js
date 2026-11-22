import React from 'react';
import IgrsAdmin from '@/components/igrs/admin/IgrsAdmin';
import { getSection } from '@/lib/server/sections';

export const metadata = {
  title: 'IGRS Committee Login',
  robots: { index: false, follow: false },
};

export default async function IgrsAdminPage() {
  // Dropdown labels, so the dashboard shows "Computer Science & Engineering"
  // rather than the stored value "cse".
  const options = (await getSection('igrs-options').catch(() => null)) || {};
  return <IgrsAdmin options={options} />;
}
