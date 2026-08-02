"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

const CONTENTS = [
  'Introduction to the institute, its vision and mission',
  'Details of all diploma programmes and sanctioned intake',
  'Eligibility criteria and the complete JEECUP admission process',
  'Fee structure, scholarship schemes and fee concessions',
  'Faculty profiles and departmental laboratory facilities',
  'Hostel, library, transport and campus amenities',
  'Academic calendar, examination scheme and rules of discipline',
  'Training & placement activities and recruiter list',
];

const DOWNLOADS = [
  { icon: 'bi-file-earmark-pdf-fill', label: 'Information Booklet 2026-27 (PDF)' },
  { icon: 'bi-file-earmark-text-fill', label: 'Admission Application Form (PDF)' },
  { icon: 'bi-file-earmark-ruled-fill', label: 'Fee Structure Notification (PDF)' },
  { icon: 'bi-file-earmark-check-fill', label: 'Document Checklist (PDF)' },
];

export default function InformationBooklet() {
  return (
    <>
      <PageHeader
        icon="bi-file-earmark-pdf"
        eyebrow="Admissions"
        title="Information Booklet 2026-27"
        subtitle="The complete official handbook covering courses, admission, fees and campus facilities."
        crumbs={[{ label: 'Admissions' }, { label: 'Information Booklet' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={7}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-journal-richtext" />
                  What the Booklet Contains
                </div>
                <div className="panel-body">
                  <p>
                    The information booklet for the academic session 2026-27 brings together everything
                    a prospective student and her family need to know about Km. Mayawati Government
                    Girls Polytechnic, Badalpur.
                  </p>
                  <ul className="gold-list mt-4">
                    {CONTENTS.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>

            <Col lg={5}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-download" />
                  Download Centre
                </div>
                <div className="panel-body">
                  {DOWNLOADS.map((item) => (
                    <a href="#" className="doc-link" key={item.label}>
                      <i className={`bi ${item.icon}`} />
                      {item.label}
                      <i className="bi bi-arrow-right-short" />
                    </a>
                  ))}

                  <div className="callout mt-4">
                    <i className="bi bi-info-circle-fill" />
                    <p>
                      Documents will be published here as soon as they are released by the institute
                      administration for the 2026-27 session.
                    </p>
                  </div>
                </div>
              </div>

              <div className="side-cta mt-4">
                <i className="bi bi-envelope-paper-fill side-cta-icon" />
                <h6>Prefer a Printed Copy?</h6>
                <p>Printed booklets are available at the institute admission counter during office hours.</p>
                <Link href="/contact" className="btn-gold btn-sm">
                  Contact the Office
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
