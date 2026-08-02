"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';

const CERTIFICATES = [
  {
    icon: 'bi-award-fill',
    title: 'Diploma Certificate',
    text: 'The original diploma awarded by BTEUP on successful completion of the programme.',
    issuer: 'BTEUP, through the institute',
  },
  {
    icon: 'bi-file-earmark-text-fill',
    title: 'Character Certificate',
    text: 'Certifies the conduct and character of the student during her time at the institute.',
    issuer: 'Office of the Principal',
  },
  {
    icon: 'bi-arrow-left-right',
    title: 'Transfer Certificate (TC)',
    text: 'Required for admission to any further course or institution after leaving.',
    issuer: 'Office of the Principal',
  },
  {
    icon: 'bi-journal-check',
    title: 'Migration Certificate',
    text: 'Needed when joining a university or board other than BTEUP for higher studies.',
    issuer: 'BTEUP, through the institute',
  },
  {
    icon: 'bi-file-earmark-ruled-fill',
    title: 'Bonafide / Study Certificate',
    text: 'Confirms the period of study and enrolment details for employers or authorities.',
    issuer: 'Institute Office',
  },
  {
    icon: 'bi-files',
    title: 'Duplicate Marksheet',
    text: 'Issued when the original marksheet is lost, damaged or destroyed.',
    issuer: 'BTEUP, on application',
  },
];

const STEPS = [
  {
    title: 'Submit the Application Form',
    text: 'Apply in writing to the Principal on the prescribed form, clearly stating which certificate is required and why.',
  },
  {
    title: 'Attach Supporting Documents',
    text: 'Enclose self-attested copies of your marksheets, identity proof and enrolment details along with the form.',
  },
  {
    title: 'Pay the Prescribed Fee',
    text: 'Deposit the applicable issuance fee at the accounts section and attach the receipt with your application.',
  },
  {
    title: 'Verification of Records',
    text: 'The institute office verifies your academic record, year of passing and no-dues position.',
  },
  {
    title: 'Collection or Dispatch',
    text: 'Collect the certificate in person with photo identity, or request dispatch by registered post to your address.',
  },
];

const REQUIREMENTS = [
  'Application addressed to the Principal on the prescribed form',
  'Self-attested copies of all semester marksheets',
  'Copy of the diploma certificate, where already issued',
  'Enrolment number, branch and year of passing',
  'Copy of Aadhaar card or other photo identity proof',
  'Fee receipt for the prescribed issuance charge',
  'Affidavit and FIR copy, in case of a lost original document',
  'Authorisation letter, if collected by a representative',
];

export default function CertificateIssuancePage() {
  return (
    <>
      <PageHeader
        icon="bi-award-fill"
        eyebrow="Academics"
        title="Issuance of Certificate for Passout Students"
        subtitle="How former students apply for diploma, character, transfer, migration and duplicate certificates."
        crumbs={[{ label: 'Academics' }, { label: 'Certificate Issuance' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <SectionHead
            eyebrow="Available Certificates"
            icon="bi-patch-check-fill"
            title="Documents Issued to Passout Students"
            subtitle="The institute issues the following certificates to students who have completed or left the programme."
          />

          <Row className="g-4">
            {CERTIFICATES.map((certificate) => (
              <Col lg={4} md={6} key={certificate.title}>
                <div className="premium-card h-100 p-4 d-flex flex-column">
                  <span className="icon-tile mb-4">
                    <i className={`bi ${certificate.icon}`} />
                  </span>
                  <h5 className="fw-bold mb-3">{certificate.title}</h5>
                  <p className="small flex-grow-1">{certificate.text}</p>
                  <div className="gold-rule-thin my-3" />
                  <p className="small mb-0">
                    <i className="bi bi-building text-gold me-2" />
                    Issued by: {certificate.issuer}
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section" style={{ background: 'var(--paper)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={7}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-list-ol" />
                  Application Process
                </div>
                <div className="panel-body">
                  <p>
                    Passout students may apply for any of the above certificates by following the
                    process below. Applications are processed in the order they are received.
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
                  <i className="bi bi-list-check" />
                  Requirements Checklist
                </div>
                <div className="panel-body">
                  <ul className="gold-list">
                    {REQUIREMENTS.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="panel mt-4">
                <div className="panel-header">
                  <i className="bi bi-download" />
                  Download Forms
                </div>
                <div className="panel-body">
                  <a href="#" className="doc-link">
                    <i className="bi bi-file-earmark-pdf-fill" />
                    Certificate Application Form (PDF)
                    <i className="bi bi-arrow-right-short" />
                  </a>
                  <a href="#" className="doc-link mb-0">
                    <i className="bi bi-file-earmark-text-fill" />
                    Duplicate Document Affidavit Format (PDF)
                    <i className="bi bi-arrow-right-short" />
                  </a>
                </div>
              </div>

              <div className="side-cta mt-4">
                <i className="bi bi-headset side-cta-icon" />
                <h6>Need Help With Your Application?</h6>
                <p>The institute office assists passout students during working hours.</p>
                <Link href="/contact" className="btn-gold btn-sm">
                  Contact the Office
                  <i className="bi bi-arrow-right" />
                </Link>
              </div>
            </Col>
          </Row>

          <div className="panel mt-4">
            <div className="panel-header">
              <i className="bi bi-clock-history" />
              Indicative Processing Time
            </div>
            <div className="panel-body p-0">
              <div className="table-wrap">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Certificate</th>
                      <th>Issuing Authority</th>
                      <th>Processing Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <i className="bi bi-file-earmark-text-fill text-gold me-2" />
                        Character / Bonafide Certificate
                      </td>
                      <td>Office of the Principal</td>
                      <td>3 – 5 working days</td>
                    </tr>
                    <tr>
                      <td>
                        <i className="bi bi-arrow-left-right text-gold me-2" />
                        Transfer Certificate
                      </td>
                      <td>Office of the Principal</td>
                      <td>5 – 7 working days</td>
                    </tr>
                    <tr>
                      <td>
                        <i className="bi bi-journal-check text-gold me-2" />
                        Migration Certificate
                      </td>
                      <td>BTEUP, via the institute</td>
                      <td>15 – 30 working days</td>
                    </tr>
                    <tr>
                      <td>
                        <i className="bi bi-files text-gold me-2" />
                        Duplicate Marksheet / Diploma
                      </td>
                      <td>BTEUP, via the institute</td>
                      <td>30 – 45 working days</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="callout mt-4">
            <i className="bi bi-info-circle-fill" />
            <p>
              Certificates issued by BTEUP are processed through the institute but depend on board
              timelines. Applicants are advised to apply well in advance of any submission deadline
              for employment or higher studies.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
