"use client";
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Link from 'next/link';

// Helper to format department name
function formatDeptName(dept) {
  const map = {
    'electronics': 'Electronics Engineering',
    'cse': 'Computer Science & Engineering',
    'it': 'Information Technology'
  };
  return map[dept] || 'Department';
}

export default function DepartmentLayout({ children, params }) {
  const dept = params.dept;
  const deptName = formatDeptName(dept);

  return (
    <div className="py-5 bg-white">
      <Container>
        <Row>
          <Col lg={3} className="mb-4">
            <Card className="shadow-sm border-0">
              <Card.Header className="bg-primary-blue text-white fw-bold">
                {deptName}
              </Card.Header>
              <Card.Body className="p-0">
                <div className="list-group list-group-flush">
                  <Link href={`/department/${dept}`} className="list-group-item list-group-item-action text-primary-blue">
                    Department Home
                  </Link>
                  <Link href={`/department/${dept}/faculty`} className="list-group-item list-group-item-action text-primary-blue">
                    Faculty
                  </Link>
                  <Link href={`/department/${dept}/labs`} className="list-group-item list-group-item-action text-primary-blue">
                    Labs
                  </Link>
                  <Link href={`/department/${dept}/achievements`} className="list-group-item list-group-item-action text-primary-blue">
                    Achievements
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
