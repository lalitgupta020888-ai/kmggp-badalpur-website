"use client";

import React from 'react';
import IgrsShell from '@/components/igrs/IgrsShell';
import GrievanceForm from '@/components/igrs/GrievanceForm';

export default function StudentGrievancePage() {
  return (
    <IgrsShell
      icon="bi-mortarboard-fill"
      title="Student Grievance"
      crumb="Student Grievance"
      subtitle="Raise an academic, examination, hostel, library or canteen concern. Every submission is recorded with a unique reference number."
    >
      <GrievanceForm type="student" heading="Student Grievance Form" icon="bi-mortarboard-fill" />
    </IgrsShell>
  );
}
