import React from 'react';
import IgrsShell from '@/components/igrs/IgrsShell';
import GrievanceForm from '@/components/igrs/GrievanceForm';
import { getSection } from '@/lib/server/sections';

export default async function StudentGrievancePage() {
  const options = await getSection('igrs-options');

  return (
    <IgrsShell
      icon="bi-mortarboard-fill"
      title="Student Grievance"
      crumb="Student Grievance"
      subtitle="Raise an academic, examination, hostel, library or canteen concern. Every submission is recorded with a unique reference number."
    >
      <GrievanceForm options={options} type="student" heading="Student Grievance Form" icon="bi-mortarboard-fill" />
    </IgrsShell>
  );
}
