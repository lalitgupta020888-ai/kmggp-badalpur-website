"use client";
import React from 'react';
import { Container, Card } from 'react-bootstrap';

export default function ScholarshipPage() {
  return (
    <div className="py-5 bg-white">
      <Container>
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-primary-blue text-white fw-bold">
            Scholarship Information
          </Card.Header>
          <Card.Body>
            <p>Our institute facilitates various scholarship schemes provided by the State and Central Government to support meritorious and economically weaker students.</p>
            <ul>
              <li><strong>UP Post Matric Scholarship:</strong> Available for SC/ST, OBC, Minority, and General Category students as per UP Govt norms.</li>
              <li><strong>Pragati Scholarship Scheme for Girls:</strong> AICTE scheme for the advancement of girls in technical education.</li>
              <li><strong>National Scholarship Portal (NSP):</strong> Various central sector schemes.</li>
            </ul>
            <p>Students must apply online through the respective portals and submit a hard copy to the institute's scholarship cell before the deadlines.</p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

