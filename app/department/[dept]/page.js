"use client";
import React from 'react';
import { Card } from 'react-bootstrap';

export default function DepartmentHome({ params }) {
  const dept = params.dept;
  
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h2 className="text-primary-blue mb-4">Welcome to the Department</h2>
        <p className="lead">
          Our department is committed to excellence in technical education and holistic development of students.
        </p>
        <p>
          We offer comprehensive coursework, state-of-the-art laboratory facilities, and experienced faculty to ensure that students acquire both theoretical knowledge and practical skills required in the industry today.
        </p>
        <h4 className="mt-4 text-primary-blue">Vision</h4>
        <p>To be recognized globally for excellence in education, research, and innovation in the field.</p>
        <h4 className="mt-4 text-primary-blue">Mission</h4>
        <ul>
          <li>To provide a rigorous academic environment that fosters innovation and continuous learning.</li>
          <li>To establish industry collaborations for hands-on exposure and better placements.</li>
          <li>To empower women through technical prowess and leadership skills.</li>
        </ul>
      </Card.Body>
    </Card>
  );
}
