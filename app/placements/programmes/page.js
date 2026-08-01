"use client";
import React from 'react';
import { Card } from 'react-bootstrap';

export default function TNPProgrammes() {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h2 className="text-primary-blue mb-4">Training & Placement Programmes</h2>
        <p>We organize various training programmes throughout the academic year to enhance the employability of our students.</p>
        <ul>
          <li><strong>Soft Skills Training:</strong> Communication skills, resume building, and interview preparation workshops.</li>
          <li><strong>Technical Workshops:</strong> Seminars on latest technologies like AI, IoT, and Cloud Computing by industry experts.</li>
          <li><strong>Mock Interviews:</strong> Regular mock interviews conducted by alumni and HR professionals.</li>
          <li><strong>Aptitude Training:</strong> Classes for quantitative aptitude and logical reasoning to crack screening tests.</li>
        </ul>
      </Card.Body>
    </Card>
  );
}

