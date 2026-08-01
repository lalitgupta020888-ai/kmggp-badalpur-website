"use client";
import React from 'react';
import { Container, Card } from 'react-bootstrap';

export default function AdmissionProcess() {
  return (
    <div className="py-5 bg-white">
      <Container>
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-primary-blue text-white fw-bold">
            Admission Process
          </Card.Header>
          <Card.Body>
            <p>Admissions to the diploma courses are done through the Joint Entrance Examination Council, Uttar Pradesh (JEECUP).</p>
            <h5>Eligibility:</h5>
            <ul>
              <li>Candidate must have passed 10th standard with a minimum of 35% marks.</li>
              <li>Must appear and qualify in the JEECUP examination.</li>
            </ul>
            <h5>Steps:</h5>
            <ol>
              <li>Register and appear for JEECUP.</li>
              <li>Participate in online counseling based on JEECUP rank.</li>
              <li>Select Km. Mayawati Government Girls Polytechnic during choice filling.</li>
              <li>Report to the institute for document verification after seat allotment.</li>
            </ol>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

