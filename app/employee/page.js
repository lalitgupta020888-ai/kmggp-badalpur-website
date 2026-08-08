"use client";

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { EMPLOYEE_LINKS } from '@/lib/employee';

export default function EmployeeHome() {
  return (
    <div className="panel">
      <div className="panel-header">
        <i className="bi bi-person-vcard-fill" />
        Employee Section
      </div>
      <div className="panel-body">
        <p className="lead">
          Tools for the staff of Km. Mayawati Government Girls Polytechnic, Badalpur. Everything is
          worked out in your browser — no figure you enter is stored or sent anywhere.
        </p>

        <div className="gold-rule-thin my-4" />

        <Row className="g-4">
          {EMPLOYEE_LINKS.map((tool) => (
            <Col md={6} key={tool.href}>
              <Link href={tool.href} className="premium-card h-100 p-4 d-flex flex-column text-decoration-none">
                <span className="icon-tile mb-4">
                  <i className={`bi ${tool.icon}`} />
                </span>
                <h5 className="fw-bold mb-3">{tool.label}</h5>
                <p className="small flex-grow-1">{tool.blurb}</p>
                <div className="gold-rule-thin my-3" />
                <span className="doc-link mb-0 border-0 p-0 bg-transparent">
                  Open Calculator
                  <i className="bi bi-arrow-right-short" />
                </span>
              </Link>
            </Col>
          ))}
        </Row>

        <div className="callout mt-4">
          <i className="bi bi-info-circle-fill" />
          <p>
            These calculators are provided for guidance only. The figures drawn on your salary slip
            or assessed by the Income Tax Department shall prevail over any result shown here.
          </p>
        </div>
      </div>
    </div>
  );
}
