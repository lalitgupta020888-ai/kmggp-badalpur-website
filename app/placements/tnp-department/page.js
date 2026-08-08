"use client";

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { OFFICE_HOURS } from '@/lib/institute';

const OBJECTIVES = [
  'Invite reputed companies for on-campus and off-campus recruitment drives.',
  'Arrange industrial visits and expert guest lectures throughout the year.',
  'Deliver soft skills, aptitude and interview preparation training.',
  'Maintain an active alumni network to open new career pathways.',
  'Counsel students on career planning, higher studies and entrepreneurship.',
];

const SERVICES = [
  {
    icon: 'bi-people-fill',
    title: 'For Students',
    text: 'Career counselling, resume workshops, mock interviews and continuous placement support.',
  },
  {
    icon: 'bi-building-fill',
    title: 'For Recruiters',
    text: 'Campus infrastructure for tests and interviews, plus coordinated scheduling and logistics.',
  },
  {
    icon: 'bi-mortarboard-fill',
    title: 'For Alumnae',
    text: 'A network to mentor juniors, share openings and return to campus as guest speakers.',
  },
];

export default function TNPDepartment() {
  return (
    <>
      <div className="panel">
        <div className="panel-header">
          <i className="bi bi-building-gear" />
          Training &amp; Placement Department
        </div>
        <div className="panel-body">
          <p className="lead">
            The Training and Placement cell at Km. Mayawati Government Girls Polytechnic, Badalpur acts as a
            vital bridge between our students and the corporate world.
          </p>
          <p>
            We invite reputed companies for campus recruitment and arrange industrial visits, guest
            lectures and soft skills training to ensure our students step into the workplace fully
            prepared.
          </p>

          <div className="gold-rule-thin my-4" />

          <h5 className="fw-bold mb-3">
            <i className="bi bi-bullseye text-gold me-2" />
            Our Objectives
          </h5>
          <ul className="gold-list">
            {OBJECTIVES.map((objective) => (
              <li key={objective}>{objective}</li>
            ))}
          </ul>
        </div>
      </div>

      <Row className="g-4 mt-1">
        {SERVICES.map((service) => (
          <Col md={4} key={service.title}>
            <div className="premium-card h-100 p-4">
              <span className="icon-tile mb-3">
                <i className={`bi ${service.icon}`} />
              </span>
              <h5 className="fw-bold mb-2">{service.title}</h5>
              <p className="small mb-0">{service.text}</p>
            </div>
          </Col>
        ))}
      </Row>

      <div className="panel mt-4">
        <div className="panel-header">
          <i className="bi bi-telephone-inbound-fill" />
          Contact the T&amp;P Cell
        </div>
        <div className="panel-body">
          <Row className="g-3">
            <Col md={6}>
              <div className="contact-line">
                <span className="icon-tile icon-tile-sm">
                  <i className="bi bi-envelope-fill" />
                </span>
                <div>
                  <div className="label">Email</div>
                  <p className="value">tnp@kmggp.ac.in</p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="contact-line">
                <span className="icon-tile icon-tile-sm">
                  <i className="bi bi-telephone-fill" />
                </span>
                <div>
                  <div className="label">Phone</div>
                  <p className="value">+91 XXXXX XXXXX</p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="contact-line">
                <span className="icon-tile icon-tile-sm">
                  <i className="bi bi-person-badge-fill" />
                </span>
                <div>
                  <div className="label">Placement Officer</div>
                  <p className="value">Training &amp; Placement Cell, Km. Mayawati Government Girls Polytechnic, Badalpur</p>
                </div>
              </div>
            </Col>
            <Col md={6}>
              <div className="contact-line">
                <span className="icon-tile icon-tile-sm">
                  <i className="bi bi-clock-fill" />
                </span>
                <div>
                  <div className="label">Office Hours</div>
                  <p className="value">{OFFICE_HOURS}</p>
                </div>
              </div>
            </Col>
          </Row>
        </div>
      </div>
    </>
  );
}
