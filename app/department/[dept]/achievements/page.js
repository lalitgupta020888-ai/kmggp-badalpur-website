"use client";
import React from 'react';
import { Card } from 'react-bootstrap';

export default function AchievementsPage({ params }) {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h2 className="text-primary-blue mb-4">Departmental Achievements</h2>
        <div className="mb-4">
          <h5 className="text-primary-blue">Student Excellence</h5>
          <p>Many of our students have secured top ranks in the Board of Technical Education (BTEUP) examinations consistently over the last 5 years.</p>
        </div>
        <div className="mb-4">
          <h5 className="text-primary-blue">Placements</h5>
          <p>Over 85% of eligible students were placed in top multinational companies like Tech Mahindra, Wipro, and Infosys during the recent placement drive.</p>
        </div>
        <div className="mb-4">
          <h5 className="text-primary-blue">Projects & Hackathons</h5>
          <p>Our final year students recently won the first prize at the State Level Technical Project Exhibition for their innovative Smart Campus project.</p>
        </div>
      </Card.Body>
    </Card>
  );
}
