"use client";
import React from 'react';
import { Card } from 'react-bootstrap';

export default function TNPDepartment() {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h2 className="text-primary-blue mb-4">Training & Placement Department</h2>
        <p>The Training and Placement (T&P) cell at Km. Mayawati Government Girls Polytechnic acts as a vital bridge between the students and the corporate world.</p>
        <p>We invite reputed companies for campus recruitment and also arrange industrial visits, guest lectures, and soft skills training to ensure our students are industry-ready.</p>
        <h4 className="mt-4 text-primary-blue">Contact T&P Cell</h4>
        <p><strong>Email:</strong> tnp@kmggp.ac.in</p>
        <p><strong>Phone:</strong> +91 XXXXXXXXXX</p>
      </Card.Body>
    </Card>
  );
}

