"use client";

import React from 'react';
import IgrsShell from '@/components/igrs/IgrsShell';
import GrievanceForm from '@/components/igrs/GrievanceForm';

export default function ParentGrievancePage() {
  return (
    <IgrsShell
      icon="bi-people-fill"
      title="Parent Grievance"
      crumb="Parent Grievance"
      subtitle="Parents and guardians may report a concern on behalf of a student — academic, fee related, hostel or discipline matters."
    >
      <GrievanceForm type="parent" heading="Parent Grievance Form" icon="bi-people-fill" />
    </IgrsShell>
  );
}
