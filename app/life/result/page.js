"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';

const BTEUP_RESULT_PORTAL = 'https://result.bteexam.com/EVEN/main/';
const BTEUP_SITE = 'https://bteup.ac.in/';

/**
 * Results are declared by BTEUP, not by the institute, so this page is a signpost
 * rather than a data store — it points at the board's own portals and explains
 * what to do once the result is out.
 */
const PORTALS = [
  {
    icon: 'bi-file-earmark-text-fill',
    name: 'BTEUP Result Portal',
    text: 'Semester and back-paper results for all diploma programmes, declared by the Board of Technical Education, Uttar Pradesh.',
    href: BTEUP_RESULT_PORTAL,
    cta: 'Check Result',
  },
  {
    icon: 'bi-globe2',
    name: 'BTEUP Official Website',
    text: 'Result notifications, examination schedules and board circulars as they are published.',
    href: BTEUP_SITE,
    cta: 'Visit Website',
  },
];

const STEPS = [
  'Open the BTEUP result portal and select the diploma examination and session.',
  'Enter your enrolment number exactly as printed on your admit card.',
  'Submit the form and download the result sheet that appears.',
  'Save a PDF copy and take a printout for your records.',
  'Report any discrepancy to the examination cell of the institute within seven days.',
];

const AFTER = [
  {
    icon: 'bi-arrow-repeat',
    title: 'Scrutiny & Re-evaluation',
    text: 'If you are not satisfied with a subject result, apply for scrutiny through the institute within the window notified by the board.',
  },
  {
    icon: 'bi-journal-arrow-up',
    title: 'Back Paper Examination',
    text: 'Students carrying a back paper must fill the examination form for the next available attempt as announced by BTEUP.',
  },
  {
    icon: 'bi-award-fill',
    title: 'Marksheet & Diploma',
    text: 'Original marksheets and the diploma are issued by BTEUP through the institute after final semester results.',
  },
];

export default function ResultPage() {
  return (
    <>
      <PageHeader
        icon="bi-file-earmark-text"
        eyebrow="Life @ KMGGP"
        title="Result"
        subtitle="Check your semester result on the official BTEUP portal and know what follows once it is declared."
        crumbs={[{ label: 'Life @ KMGGP', href: '/life' }, { label: 'Result' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <SectionHead
            eyebrow="Official Portals"
            icon="bi-box-arrow-up-right"
            title="Where Results Are Declared"
            subtitle="Results are declared by the Board of Technical Education, Uttar Pradesh. Use the official portals below."
          />

          <Row className="g-4">
            {PORTALS.map((portal) => (
              <Col lg={6} key={portal.name}>
                <div className="premium-card h-100 p-4 d-flex flex-column">
                  <span className="icon-tile mb-4">
                    <i className={`bi ${portal.icon}`} />
                  </span>
                  <h5 className="fw-bold mb-3">{portal.name}</h5>
                  <p className="small flex-grow-1">{portal.text}</p>
                  <div className="gold-rule-thin my-3" />
                  <a
                    href={portal.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="doc-link mb-0"
                  >
                    <i className="bi bi-box-arrow-up-right" />
                    {portal.cta}
                    <i className="bi bi-arrow-right-short" />
                  </a>
                </div>
              </Col>
            ))}
          </Row>

          <Row className="g-4 mt-2">
            <Col lg={7}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-list-ol" />
                  How to Check Your Result
                </div>
                <div className="panel-body">
                  <ul className="gold-list is-numbered">
                    {STEPS.map((step) => (
                      <li key={step}>{step}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>

            <Col lg={5}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-signpost-split-fill" />
                  After the Result
                </div>
                <div className="panel-body">
                  {AFTER.map((item) => (
                    <div className="d-flex gap-3 mb-4" key={item.title}>
                      <span className="icon-tile icon-tile-sm">
                        <i className={`bi ${item.icon}`} />
                      </span>
                      <div>
                        <h6 className="fw-bold mb-1">{item.title}</h6>
                        <p className="small mb-0">{item.text}</p>
                      </div>
                    </div>
                  ))}

                  <div className="callout">
                    <i className="bi bi-info-circle-fill" />
                    <p>
                      The institute does not declare or revise results. For any correction, the
                      examination cell forwards your application to BTEUP.
                    </p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
