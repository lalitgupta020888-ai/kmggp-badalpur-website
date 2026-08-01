"use client";
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Link from 'next/link';

export default function PlacementsLayout({ children }) {
  return (
    <div className="py-5 bg-white">
      <Container>
        <Row>
          <Col lg={3} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-primary-blue text-white fw-bold">
                Placements
              </Card.Header>
              <Card.Body className="p-0">
                <div className="list-group list-group-flush">
                  <Link href="/placements/tnp-department" className="list-group-item list-group-item-action text-primary-blue">
                    T&P Department
                  </Link>
                  <Link href="/placements/recruiters" className="list-group-item list-group-item-action text-primary-blue">
                    Our Recruiters
                  </Link>
                  <Link href="/placements/records" className="list-group-item list-group-item-action text-primary-blue">
                    Placement Records
                  </Link>
                  <Link href="/placements/programmes" className="list-group-item list-group-item-action text-primary-blue">
                    T&P Programmes
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={9}>
            {children}
          </Col>
        </Row>
      </Container>
    </div>
  );
}
