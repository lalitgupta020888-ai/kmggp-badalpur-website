"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';

const BODIES = [
  {
    icon: 'bi-bank',
    name: 'Government of Uttar Pradesh',
    role: 'Establishing Authority',
    detail:
      'The institute is established, funded and administered by the Government of Uttar Pradesh through the Directorate of Training & Technical Education.',
  },
  {
    icon: 'bi-patch-check-fill',
    name: 'AICTE, New Delhi',
    role: 'Statutory Approval',
    detail:
      'All diploma programmes are conducted with approval of the All India Council for Technical Education, renewed annually through the Extension of Approval process.',
  },
  {
    icon: 'bi-journal-bookmark-fill',
    name: 'BTEUP, Lucknow',
    role: 'Affiliating Board',
    detail:
      'The Board of Technical Education, Uttar Pradesh prescribes the curriculum, conducts examinations and awards the diploma.',
  },
  {
    icon: 'bi-mortarboard-fill',
    name: 'JEECUP',
    role: 'Admission Authority',
    detail:
      'Admissions are conducted exclusively through the Joint Entrance Examination Council, Uttar Pradesh counselling process.',
  },
];

const SUMMARY = [
  {
    body: 'Government of Uttar Pradesh',
    nature: 'Establishment & Administration',
    scope: 'Institute',
    status: 'Active',
  },
  {
    body: 'All India Council for Technical Education (AICTE)',
    nature: 'Approval / Extension of Approval',
    scope: 'All diploma programmes',
    status: 'Approved',
  },
  {
    body: 'Board of Technical Education, Uttar Pradesh (BTEUP)',
    nature: 'Affiliation',
    scope: 'Curriculum & Examinations',
    status: 'Affiliated',
  },
  {
    body: 'Directorate of Training & Technical Education, UP',
    nature: 'Administrative Control',
    scope: 'Staff & Finance',
    status: 'Active',
  },
];

const DIRECTORY = [
  { icon: 'bi-globe2', label: 'AICTE — aicte-india.org' },
  { icon: 'bi-globe2', label: 'BTEUP — bteup.ac.in' },
  { icon: 'bi-globe2', label: 'JEECUP — jeecup.admissions.nic.in' },
  { icon: 'bi-globe2', label: 'Directorate of Technical Education, UP' },
];

export default function ApprovalsPage() {
  return (
    <>
      <PageHeader
        icon="bi-patch-check-fill"
        eyebrow="About the Institute"
        title="Approvals by Statutory Bodies"
        subtitle="The authorities that establish, approve, affiliate and regulate this institute."
        crumbs={[{ label: 'About', href: '/about' }, { label: 'Approvals by Statutory Bodies' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <SectionHead
            eyebrow="Regulatory Framework"
            icon="bi-shield-check"
            title="Recognised, Approved and Affiliated"
            subtitle="Km. Mayawati Government Girls Polytechnic, Badalpur operates under the following statutory authorities."
          />

          <Row className="g-4">
            {BODIES.map((body) => (
              <Col lg={6} key={body.name}>
                <div className="premium-card h-100 p-4 d-flex gap-4">
                  <span className="icon-tile flex-shrink-0">
                    <i className={`bi ${body.icon}`} />
                  </span>
                  <div>
                    <span className="eyebrow">{body.role}</span>
                    <h5 className="fw-bold mb-2">{body.name}</h5>
                    <p className="small mb-0">{body.detail}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section" style={{ background: 'var(--paper)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={8}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-table" />
                  Approval Summary
                </div>
                <div className="panel-body p-0">
                  <div className="table-wrap">
                    <table className="premium-table">
                      <thead>
                        <tr>
                          <th>Statutory Body</th>
                          <th>Nature of Approval</th>
                          <th>Scope</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {SUMMARY.map((row) => (
                          <tr key={row.body}>
                            <td>
                              <i className="bi bi-patch-check-fill text-gold me-2" />
                              {row.body}
                            </td>
                            <td>{row.nature}</td>
                            <td>{row.scope}</td>
                            <td>
                              <span className="fw-bold text-primary-blue">{row.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={4}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-link-45deg" />
                  Official Portals
                </div>
                <div className="panel-body">
                  {DIRECTORY.map((item) => (
                    <a href="#" className="doc-link" key={item.label}>
                      <i className={`bi ${item.icon}`} />
                      {item.label}
                      <i className="bi bi-arrow-right-short" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="side-cta mt-4">
                <i className="bi bi-file-earmark-pdf-fill side-cta-icon" />
                <h6>Looking for AICTE Letters?</h6>
                <p>Year-wise Extension of Approval letters are published separately.</p>
                <Link href="/about/aicte-approvals" className="btn-gold btn-sm">
                  View Approval Letters
                  <i className="bi bi-arrow-right" />
                </Link>
              </div>
            </Col>
          </Row>

          <div className="callout mt-4">
            <i className="bi bi-info-circle-fill" />
            <p>
              Approval and affiliation status is renewed periodically as per the norms of the
              respective statutory bodies. Official letters and notifications are published on this
              website as and when they are received.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
