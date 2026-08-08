"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

const JEECUP_PORTAL = 'https://jeecup.admissions.nic.in/';

const STEPS = [
  {
    title: 'Register for JEECUP',
    text: (
      <>
        Complete the online application on the official{' '}
        <a href={JEECUP_PORTAL} target="_blank" rel="noopener noreferrer">
          JEECUP
        </a>{' '}
        portal within the notified window and pay the examination fee.
      </>
    ),
  },
  {
    title: 'Appear for the Entrance Examination',
    text: 'Sit the JEECUP examination at your allotted centre — Group A for first-year admission, or Group K if you are applying for lateral entry into the second year.',
  },
  {
    title: 'Participate in Online Counselling',
    text: 'Register for counselling on the basis of your JEECUP rank and complete the choice-filling process.',
  },
  {
    title: 'Select Km. Mayawati Government Girls Polytechnic, Badalpur',
    text: 'Choose Km. Mayawati Government Girls Polytechnic, Badalpur among your preferences during choice filling.',
  },
  {
    title: 'Seat Allotment & Fee Payment',
    text: 'On allotment, pay the seat acceptance fee online within the stipulated period to confirm your seat.',
  },
  {
    title: 'Report for Document Verification',
    text: 'Visit the institute with all original documents for verification and complete your admission formalities.',
  },
];

const ELIGIBILITY = [
  'Passed Class 10th (High School) from a recognised board with a minimum of 35% marks.',
  'Appeared and qualified in the JEECUP entrance examination for Group A.',
  'Admission is open to female candidates only, as this is a Government Girls Polytechnic.',
  'Candidates awaiting Class 10th results may apply provisionally, subject to result submission.',
];

/**
 * Lateral entry runs through the same counselling, one group and one year apart —
 * Group K instead of A, third semester instead of first.
 */
const LATERAL_ELIGIBILITY = [
  'Passed Class 12th (Intermediate) with Science and Mathematics, minimum 35% marks.',
  'Or passed Class 12th with a vocational or technical subject relevant to the branch.',
  'Or passed a two-year ITI course, after Class 10th, in a trade related to the branch.',
  'Appeared and qualified in the JEECUP entrance examination for Group K.',
];

const LATERAL_DOCUMENTS = [
  'Class 12th marksheet and passing certificate, or the two-year ITI certificate with marksheets',
  'Class 10th marksheet, as proof of age and of the qualification preceding ITI',
  'JEECUP Group K rank card and seat allotment letter',
];

const DOCUMENTS = [
  'JEECUP rank card and seat allotment letter',
  'Class 10th marksheet and passing certificate',
  'Transfer certificate and character certificate',
  'Domicile certificate of Uttar Pradesh',
  'Caste / category certificate, if applicable',
  'Income certificate for fee concession or scholarship',
  'Aadhaar card and recent passport-size photographs',
  'Medical fitness certificate',
];

export default function AdmissionProcess() {
  return (
    <>
      <PageHeader
        icon="bi-signpost-split"
        eyebrow="Admissions 2026-27"
        title="Admission Process"
        subtitle="Everything you need to know about eligibility, counselling and reporting to the institute."
        crumbs={[{ label: 'Admissions' }, { label: 'Admission Process' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={7}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-list-ol" />
                  Step-by-Step Admission Journey
                </div>
                <div className="panel-body">
                  <p>
                    Admission to all diploma courses is conducted through the Joint Entrance Examination
                    Council, Uttar Pradesh (JEECUP). Follow the steps below carefully.
                  </p>
                  <ul className="timeline mt-4">
                    {STEPS.map((step) => (
                      <li key={step.title}>
                        <h6>{step.title}</h6>
                        <p>{step.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>

            <Col lg={5}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-patch-check-fill" />
                  Eligibility Criteria
                </div>
                <div className="panel-body">
                  <ul className="gold-list">
                    {ELIGIBILITY.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="panel mt-4">
                <div className="panel-header">
                  <i className="bi bi-folder-fill" />
                  Documents Required
                </div>
                <div className="panel-body">
                  <ul className="gold-list">
                    {DOCUMENTS.map((doc) => (
                      <li key={doc}>{doc}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="side-cta mt-4">
                <i className="bi bi-question-circle-fill side-cta-icon" />
                <h6>Still Have Questions?</h6>
                <p>Our admission team will guide you through eligibility, counselling and fees.</p>
                <Link href="/admission/enquiry" className="btn-gold btn-sm">
                  Submit an Enquiry
                  <i className="bi bi-arrow-right" />
                </Link>
              </div>
            </Col>
          </Row>

          <div className="panel mt-4">
            <div className="panel-header">
              <i className="bi bi-box-arrow-in-right" />
              Lateral Entry (Group K) — Admission to the Second Year
            </div>
            <div className="panel-body">
              <p className="lead">
                All three branches also admit lateral entry candidates directly into the third
                semester. The process is the same as above — only the JEECUP group differs.
              </p>

              <Row className="g-4 mt-1">
                <Col lg={6}>
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-patch-check-fill text-gold me-2" />
                    Eligibility for Lateral Entry
                  </h5>
                  <ul className="gold-list">
                    {LATERAL_ELIGIBILITY.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </Col>

                <Col lg={6}>
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-folder-plus text-gold me-2" />
                    Additional Documents
                  </h5>
                  <ul className="gold-list">
                    {LATERAL_DOCUMENTS.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <p className="small mb-0">
                    These are required in addition to the common documents listed above.
                  </p>
                </Col>
              </Row>

              <div className="callout mt-4">
                <i className="bi bi-exclamation-triangle-fill" />
                <p>
                  Register under <strong>Group K</strong> to be considered for lateral entry.
                  Qualifying in Group A only makes you eligible for first-year admission. Full group
                  details are on the <Link href="/counselling/eligibility">Groupwise Eligibility</Link>{' '}
                  page.
                </p>
              </div>
            </div>
          </div>

          <div className="callout mt-4">
            <i className="bi bi-calendar-check-fill" />
            <p>
              Counselling dates are announced by JEECUP each year. Keep checking the official JEECUP
              portal and this page for the current schedule.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
