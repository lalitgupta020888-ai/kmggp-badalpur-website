"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';

const STEPS = [
  {
    title: 'Send a Formal Request',
    text: 'Email a verification request on your organisation letterhead to the institute verification desk.',
  },
  {
    title: 'Attach the Candidate Documents',
    text: 'Enclose scanned copies of the marksheet, diploma certificate and enrolment number to be verified.',
  },
  {
    title: 'Include a Candidate Consent Letter',
    text: 'A signed authorisation from the candidate permitting the release of her academic records.',
  },
  {
    title: 'Receive the Verification Response',
    text: 'The institute responds by email, typically within 7 to 10 working days of receiving a complete request.',
  },
];

const CHECKLIST = [
  'Full name of the candidate as printed on the certificate',
  'Enrolment / roll number and branch',
  'Year of passing and semester details',
  'Scanned copy of the marksheet or diploma certificate',
  'Signed consent letter from the candidate',
  'Contact details of the requesting organisation',
];

export default function EducationalVerification() {
  return (
    <>
      <PageHeader
        icon="bi-patch-check"
        eyebrow="Academics"
        title="Educational Verification"
        subtitle="Verification of academic records for employers, agencies and higher education institutions."
        crumbs={[{ label: 'Academics' }, { label: 'Educational Verification' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={7}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-shield-check" />
                  Verification Procedure
                </div>
                <div className="panel-body">
                  <p>
                    Companies, background verification agencies and academic institutions may request
                    verification of the academic records of students who have passed out of Km. Mayawati
                    Government Girls Polytechnic, Badalpur.
                  </p>

                  <ul className="timeline mt-4">
                    {STEPS.map((step) => (
                      <li key={step.title}>
                        <h6>{step.title}</h6>
                        <p>{step.text}</p>
                      </li>
                    ))}
                  </ul>

                  <div className="callout mt-4">
                    <i className="bi bi-exclamation-triangle-fill" />
                    <p>
                      Requests that are incomplete or lack the candidate&apos;s written consent cannot
                      be processed. Please ensure every item in the checklist is enclosed.
                    </p>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={5}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-envelope-paper-fill" />
                  Verification Desk
                </div>
                <div className="panel-body">
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-envelope-fill" />
                    </span>
                    <div>
                      <div className="label">Email</div>
                      <p className="value">verification@kmggp.ac.in</p>
                    </div>
                  </div>
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-telephone-fill" />
                    </span>
                    <div>
                      <div className="label">Phone</div>
                      <p className="value">+91 XXXXX XXXXX</p>
                    </div>
                  </div>
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-clock-fill" />
                    </span>
                    <div>
                      <div className="label">Turnaround Time</div>
                      <p className="value">7 – 10 working days</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel mt-4">
                <div className="panel-header">
                  <i className="bi bi-list-check" />
                  Request Checklist
                </div>
                <div className="panel-body">
                  <ul className="gold-list">
                    {CHECKLIST.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
