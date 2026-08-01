"use client";
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

export default function LabsPage({ params }) {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h2 className="text-primary-blue mb-4">Laboratory Facilities</h2>
        <Row className="g-4">
          <Col md={6}>
            <Card className="h-100 border-0 bg-light p-3">
              <h5 className="text-primary-blue">Advanced Computing Lab</h5>
              <p className="text-muted small">Equipped with latest i7 systems, high-speed internet, and software development tools.</p>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100 border-0 bg-light p-3">
              <h5 className="text-primary-blue">Electronics & Microprocessor Lab</h5>
              <p className="text-muted small">Contains CROs, Function Generators, microcontrollers and simulation software.</p>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100 border-0 bg-light p-3">
              <h5 className="text-primary-blue">Networking Lab</h5>
              <p className="text-muted small">Features Cisco routers, switches and network simulation environments.</p>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="h-100 border-0 bg-light p-3">
              <h5 className="text-primary-blue">Hardware Lab</h5>
              <p className="text-muted small">For practical hands-on experience in PC assembling, troubleshooting, and hardware design.</p>
            </Card>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}
