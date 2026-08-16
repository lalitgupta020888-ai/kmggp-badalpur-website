import React from 'react';
import IgrsShell from '@/components/igrs/IgrsShell';
import GrievanceForm from '@/components/igrs/GrievanceForm';
import { getSection } from '@/lib/server/sections';

export default async function ParentGrievancePage() {
  const options = await getSection('igrs-options');

  return (
    <IgrsShell
      icon="bi-people-fill"
      title="Parent Grievance"
      crumb="Parent Grievance"
      subtitle="Parents and guardians may report a concern on behalf of a student — academic, fee related, hostel or discipline matters."
    >
      <GrievanceForm options={options} type="parent" heading="Parent Grievance Form" icon="bi-people-fill" />
    </IgrsShell>
  );
}
