"use client";
import React from 'react';
import { Container, Card } from 'react-bootstrap';

export default function AcademicCalendar() {
  return (
    <div className="py-5 bg-white">
      <Container>
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-primary-blue text-white fw-bold">
            Academic Calendar
          </Card.Header>
          <Card.Body>
            <p>The academic calendar for the session 2026-27 will be updated here shortly.</p>
            <ul>
              <li><strong>Odd Semester Classes Begin:</strong> August 16, 2026</li>
              <li><strong>Mid Semester Exams:</strong> October 2026</li>
              <li><strong>Odd Semester Exams:</strong> December 2026</li>
              <li><strong>Even Semester Classes Begin:</strong> January 2027</li>
            </ul>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

