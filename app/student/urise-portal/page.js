"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';

const FEATURES = [
  {
    icon: 'bi-person-vcard-fill',
    title: 'Digital Student Profile',
    text: 'A single verified profile carrying your enrolment, branch, institute and academic details.',
  },
  {
    icon: 'bi-cash-stack',
    title: 'Scholarship Linkage',
    text: 'Your registration links with government scholarship schemes and fee reimbursement records.',
  },
  {
    icon: 'bi-mortarboard-fill',
    title: 'Examination & Results',
    text: 'Access examination notifications, admit card information and published results in one place.',
  },
  {
    icon: 'bi-file-earmark-check-fill',
    title: 'Digital Certificates',
    text: 'Download and share verified digital copies of your academic documents.',
  },
  {
    icon: 'bi-briefcase-fill',
    title: 'Training & Placement',
    text: 'Discover skill development programmes, internships and job opportunities notified by the state.',
  },
  {
    icon: 'bi-easel2-fill',
    title: 'E-Learning Resources',
    text: 'Curated study material, lectures and career guidance content for technical students.',
  },
];

const STEPS = [
  {
    title: 'Visit the Official Portal',
    text: 'Open urise.up.gov.in in your browser. Always use the official address — do not register through third-party links.',
  },
  {
    title: 'Choose Student Registration',
    text: 'Select the student registration option and pick your category as a diploma / polytechnic student.',
  },
  {
    title: 'Enter Your Details',
    text: 'Fill in your name, date of birth, mobile number and email exactly as recorded in your institute file.',
  },
  {
    title: 'Verify with OTP',
    text: 'Confirm your mobile number and email through the one-time password sent by the portal.',
  },
  {
    title: 'Complete Your Academic Profile',
    text: 'Add your institute, branch, enrolment number and current semester, then upload the documents requested.',
  },
  {
    title: 'Save Your URISE ID',
    text: 'Note down the URISE ID generated for you — it is required for scholarships, results and certificate services.',
  },
];

const DOCUMENTS = [
  'Aadhaar number linked with your active mobile number',
  'Enrolment number allotted by the institute',
  'Class 10th marksheet and, where applicable, Class 12th marksheet',
  'Domicile certificate of Uttar Pradesh',
  'Caste / category certificate, if applicable',
  'Income certificate for scholarship linkage',
  'Bank account details linked with Aadhaar',
  'Recent passport-size photograph and signature in digital form',
];

const TIPS = [
  { icon: 'bi-shield-lock-fill', label: 'Never share your password or OTP with anyone' },
  { icon: 'bi-phone-fill', label: 'Keep your registered mobile number active' },
  { icon: 'bi-pencil-square', label: 'Ensure your name matches your Aadhaar exactly' },
  { icon: 'bi-bell-fill', label: 'Check the portal regularly for deadlines' },
];

export default function UrisePortalPage() {
  return (
    <>
      <PageHeader
        icon="bi-globe2"
        eyebrow="Student Corner"
        title="URISE Portal"
        subtitle="The Government of Uttar Pradesh unified portal for technical and vocational education students."
        crumbs={[{ label: 'Student' }, { label: 'URISE Portal' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-5 align-items-start">
            <Col lg={7}>
              <SectionHead
                align="start"
                eyebrow="What is URISE"
                icon="bi-info-circle-fill"
                title="One Portal for Every Student Service"
              />
              <p className="lead">
                URISE — the Unified Registration Information System for Education — is the Government
                of Uttar Pradesh platform that brings student registration, scholarships,
                examinations, certificates and skill development together in one place.
              </p>
              <p>
                Every student of a government polytechnic in Uttar Pradesh is expected to register on
                the portal. Your URISE profile follows you through the diploma programme and remains
                useful afterwards for verification, digital certificates and career services.
              </p>

              <div className="callout mt-4">
                <i className="bi bi-shield-check" />
                <p>
                  Always register through the official address <strong>urise.up.gov.in</strong>. The
                  institute never asks for your portal password, and no fee is charged for
                  registration.
                </p>
              </div>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <a
                  href="https://urise.up.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold"
                >
                  <i className="bi bi-box-arrow-up-right" />
                  Visit URISE Portal
                </a>
                <Link href="/scholarship" className="btn-outline-navy">
                  <i className="bi bi-cash-stack" />
                  Scholarship Information
                </Link>
              </div>
            </Col>

            <Col lg={5}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-list-check" />
                  Keep These Ready
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
                <i className="bi bi-headset side-cta-icon" />
                <h6>Trouble Registering?</h6>
                <p>The institute office can help verify your enrolment details for the portal.</p>
                <Link href="/contact" className="btn-gold btn-sm">
                  Contact the Office
                  <i className="bi bi-arrow-right" />
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section" style={{ background: 'var(--paper)' }}>
        <Container>
          <SectionHead
            eyebrow="Portal Services"
            icon="bi-grid-3x3-gap-fill"
            title="What You Can Do on URISE"
          />
          <Row className="g-4">
            {FEATURES.map((feature) => (
              <Col lg={4} md={6} key={feature.title}>
                <div className="premium-card h-100 p-4">
                  <span className="icon-tile mb-4">
                    <i className={`bi ${feature.icon}`} />
                  </span>
                  <h5 className="fw-bold mb-3">{feature.title}</h5>
                  <p className="small mb-0">{feature.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={7}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-list-ol" />
                  How to Register
                </div>
                <div className="panel-body">
                  <ul className="timeline">
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
                  <i className="bi bi-lightbulb-fill" />
                  Good Practice
                </div>
                <div className="panel-body">
                  {TIPS.map((tip) => (
                    <div className="feature-row align-items-center mb-3" key={tip.label}>
                      <span className="icon-tile icon-tile-sm">
                        <i className={`bi ${tip.icon}`} />
                      </span>
                      <h5 className="mb-0">{tip.label}</h5>
                    </div>
                  ))}
                </div>
              </div>

              <div className="panel mt-4">
                <div className="panel-header">
                  <i className="bi bi-link-45deg" />
                  Related Links
                </div>
                <div className="panel-body">
                  <Link href="/scholarship" className="doc-link">
                    <i className="bi bi-cash-stack" />
                    Scholarship Schemes
                    <i className="bi bi-arrow-right-short" />
                  </Link>
                  <Link href="/academic/certificate-issuance" className="doc-link">
                    <i className="bi bi-award-fill" />
                    Certificate Issuance
                    <i className="bi bi-arrow-right-short" />
                  </Link>
                  <Link href="/academic/calendar" className="doc-link mb-0">
                    <i className="bi bi-calendar3" />
                    Academic Calendar
                    <i className="bi bi-arrow-right-short" />
                  </Link>
                </div>
              </div>
            </Col>
          </Row>

          <div className="callout mt-4">
            <i className="bi bi-info-circle-fill" />
            <p>
              Portal features and registration requirements are governed by the Government of Uttar
              Pradesh and may change. Refer to the official URISE portal for the current process and
              notifications.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
