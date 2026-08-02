"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';

const SCHEMES = [
  {
    icon: 'bi-award-fill',
    title: 'UP Post Matric Scholarship',
    text: 'Available to SC/ST, OBC, Minority and General category students as per Uttar Pradesh Government norms.',
    tag: 'State Government',
  },
  {
    icon: 'bi-gender-female',
    title: 'AICTE Pragati Scholarship for Girls',
    text: 'A central scheme dedicated to the advancement of girls pursuing technical education.',
    tag: 'AICTE · Central',
  },
  {
    icon: 'bi-globe2',
    title: 'National Scholarship Portal (NSP)',
    text: 'A range of central sector schemes for meritorious and economically weaker students.',
    tag: 'Central Government',
  },
  {
    icon: 'bi-cash-coin',
    title: 'Fee Reimbursement Schemes',
    text: 'Tuition fee waivers and reimbursement for eligible students from reserved and EWS categories.',
    tag: 'Fee Support',
  },
];

const STEPS = [
  {
    title: 'Register on the Official Portal',
    text: 'Create your account on scholarship.up.gov.in or the National Scholarship Portal, as applicable to your scheme.',
  },
  {
    title: 'Complete the Application Form',
    text: 'Fill in your personal, academic and bank details exactly as they appear on your official documents.',
  },
  {
    title: 'Upload Supporting Documents',
    text: 'Attach income, caste and domicile certificates, marksheets, the fee receipt and your Aadhaar-linked bank passbook.',
  },
  {
    title: 'Submit the Hard Copy to the Institute',
    text: 'Deposit a printed copy of the submitted form with the scholarship cell before the notified deadline.',
  },
  {
    title: 'Track Your Application',
    text: 'Monitor the status online until the amount is credited directly to your bank account.',
  },
];

const DOCUMENTS = [
  'Income certificate (issued in the current financial year)',
  'Caste / category certificate, where applicable',
  'Domicile certificate of Uttar Pradesh',
  'Previous qualifying examination marksheet',
  'Institute fee receipt for the current session',
  'Aadhaar card and Aadhaar-linked bank account details',
  'Recent passport-size photograph',
];

export default function ScholarshipPage() {
  return (
    <>
      <PageHeader
        icon="bi-cash-stack"
        eyebrow="Financial Assistance"
        title="Scholarships"
        subtitle="State and central government schemes that make quality technical education affordable for every student."
        crumbs={[{ label: 'Scholarship' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <SectionHead
            eyebrow="Available Schemes"
            icon="bi-patch-check-fill"
            title="Support for Meritorious and Deserving Students"
            subtitle="Our scholarship cell assists students at every stage, from application to disbursement."
          />

          <Row className="g-4">
            {SCHEMES.map((scheme) => (
              <Col lg={6} key={scheme.title}>
                <div className="premium-card h-100 p-4 d-flex gap-4">
                  <span className="icon-tile flex-shrink-0">
                    <i className={`bi ${scheme.icon}`} />
                  </span>
                  <div>
                    <span className="eyebrow">{scheme.tag}</span>
                    <h5 className="fw-bold mb-2">{scheme.title}</h5>
                    <p className="small mb-0">{scheme.text}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section" style={{ background: 'var(--paper)' }}>
        <Container>
          <Row className="g-5">
            <Col lg={7}>
              <SectionHead
                align="start"
                eyebrow="How to Apply"
                icon="bi-signpost-split-fill"
                title="The Application Process"
              />
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
                  Applications submitted after the portal deadline cannot be processed. Students are
                  advised to apply well in advance and keep a copy of every submitted document.
                </p>
              </div>
            </Col>

            <Col lg={5}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-file-earmark-text-fill" />
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
                <i className="bi bi-headset side-cta-icon" />
                <h6>Need Help With Your Application?</h6>
                <p>Our scholarship cell is available during office hours to guide you through the process.</p>
                <Link href="/contact" className="btn-gold btn-sm">
                  Contact the Cell
                  <i className="bi bi-arrow-right" />
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
