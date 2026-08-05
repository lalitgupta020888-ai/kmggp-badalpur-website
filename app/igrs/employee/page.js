"use client";

import React from 'react';
import IgrsShell from '@/components/igrs/IgrsShell';
import GrievanceForm from '@/components/igrs/GrievanceForm';

export default function EmployeeGrievancePage() {
  return (
    <IgrsShell
      icon="bi-person-badge-fill"
      title="Employee Grievance"
      crumb="Employee Grievance"
      subtitle="Faculty and staff may raise service, salary, leave, workplace or facility matters with the grievance committee."
    >
      <GrievanceForm type="employee" heading="Employee Grievance Form" icon="bi-person-badge-fill" />
    </IgrsShell>
  );
}
