"use client";
import React from 'react';
import { Container, Card } from 'react-bootstrap';

export default function FeeStructure() {
  return (
    <div className="py-5 bg-white">
      <Container>
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-primary-blue text-white fw-bold">
            Fee Structure
          </Card.Header>
          <Card.Body>
            <p>The fee structure is as per the norms of the Government of Uttar Pradesh for government polytechnics.</p>
            <ul>
              <li><strong>Tuition Fee:</strong> Approx ₹12,670 per annum.</li>
              <li><strong>Hostel Fee:</strong> (If applicable, as per govt. norms).</li>
            </ul>
            <p className="text-muted small">* Note: Fees are subject to change based on government orders. SC/ST and economically weaker section students may be eligible for fee waivers/scholarships.</p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

