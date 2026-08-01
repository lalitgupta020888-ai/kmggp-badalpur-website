"use client";
import React from 'react';
import { Container, Card } from 'react-bootstrap';

export default function Syllabus() {
  return (
    <div className="py-5 bg-white">
      <Container>
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-primary-blue text-white fw-bold">
            Syllabus
          </Card.Header>
          <Card.Body>
            <p>Download the latest syllabus for all branches as prescribed by BTEUP.</p>
            <ul>
              <li><a href="#">Electronics Engineering Syllabus (PDF)</a></li>
              <li><a href="#">Computer Science & Engineering Syllabus (PDF)</a></li>
              <li><a href="#">Information Technology Syllabus (PDF)</a></li>
            </ul>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

