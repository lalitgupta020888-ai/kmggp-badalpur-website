"use client";
import React from 'react';
import { Container, Card } from 'react-bootstrap';

export default function InformationBooklet() {
  return (
    <div className="py-5 bg-white">
      <Container>
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-primary-blue text-white fw-bold">
            Information Booklet - 2026-27
          </Card.Header>
          <Card.Body>
            <p>The information booklet for the academic session 2026-27 contains all the details regarding the institute, courses, faculty, and facilities.</p>
            <a href="#" className="btn btn-primary-custom">Download Information Booklet (PDF)</a>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

