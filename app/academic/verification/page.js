"use client";
import React from 'react';
import { Container, Card } from 'react-bootstrap';

export default function EducationalVerification() {
  return (
    <div className="py-5 bg-white">
      <Container>
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-primary-blue text-white fw-bold">
            Educational Verification
          </Card.Header>
          <Card.Body>
            <p>For educational verification of passed out students, companies and organizations are requested to send the necessary documents and a formal request to the institute's official email id.</p>
            <p><strong>Email:</strong> verification@kmggp.ac.in</p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

