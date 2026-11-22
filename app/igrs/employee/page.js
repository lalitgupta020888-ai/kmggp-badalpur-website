import React from 'react';
import IgrsShell from '@/components/igrs/IgrsShell';
import GrievanceForm from '@/components/igrs/GrievanceForm';
import { getSection } from '@/lib/server/sections';

export default async function EmployeeGrievancePage() {
  const options = await getSection('igrs-options');

  return (
    <IgrsShell
      icon="bi-person-badge-fill"
      title="Faculty / Staff Grievance"
      crumb="Faculty / Staff Grievance"
      subtitle="Faculty and staff may raise service, salary, leave, workplace or facility matters with the grievance committee."
    >
      <GrievanceForm options={options} type="employee" heading="Faculty / Staff Grievance Form" icon="bi-person-badge-fill" />
    </IgrsShell>
  );
}
