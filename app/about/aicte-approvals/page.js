"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';

const LETTERS = [
  { session: '2026-27', type: 'Extension of Approval (EOA)', status: 'Approved' },
  { session: '2025-26', type: 'Extension of Approval (EOA)', status: 'Approved' },
  { session: '2024-25', type: 'Extension of Approval (EOA)', status: 'Approved' },
  { session: '2023-24', type: 'Extension of Approval (EOA)', status: 'Approved' },
  { session: '2022-23', type: 'Extension of Approval (EOA)', status: 'Approved' },
];

const PROGRAMMES = [
  { name: 'Diploma in Electronics Engineering', intake: 60, icon: 'bi-cpu-fill' },
  { name: 'Diploma in Computer Science & Engineering', intake: 60, icon: 'bi-pc-display' },
  { name: 'Diploma in Information Technology', intake: 60, icon: 'bi-hdd-network-fill' },
];

export default function AicteApprovalsPage() {
  return (
    <>
      <PageHeader
        icon="bi-file-earmark-pdf-fill"
        eyebrow="About the Institute"
        title="AICTE Approval Letters"
        subtitle="Year-wise Extension of Approval letters issued by the All India Council for Technical Education."
        crumbs={[{ label: 'About', href: '/about' }, { label: 'AICTE Approval Letters' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <SectionHead
            eyebrow="Download Centre"
            icon="bi-download"
            title="Extension of Approval — Session-wise"
            subtitle="AICTE issues an Extension of Approval (EOA) letter for each academic session, confirming the approved programmes and sanctioned intake."
          />

          <Row className="g-4">
            <Col lg={7}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-folder2-open" />
                  Approval Letters
                </div>
                <div className="panel-body">
                  {LETTERS.map((letter) => (
                    <a href="#" className="doc-link" key={letter.session}>
                      <i className="bi bi-file-earmark-pdf-fill" />
                      <span>
                        EOA {letter.session}
                        <span className="d-block small fw-normal" style={{ color: 'var(--ink-faint)' }}>
                          {letter.type}
                        </span>
                      </span>
                      <i className="bi bi-arrow-right-short" />
                    </a>
                  ))}

                  <div className="callout mt-4">
                    <i className="bi bi-info-circle-fill" />
                    <p>
                      PDF copies will be uploaded here as each letter is received from AICTE. The
                      current session&apos;s letter can also be verified directly on the AICTE web
                      portal.
                    </p>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={5}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-info-circle-fill" />
                  Institute Details
                </div>
                <div className="panel-body">
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-bank" />
                    </span>
                    <div>
                      <div className="label">Institute Name</div>
                      <p className="value">Km. Mayawati Government Girls Polytechnic, Badalpur</p>
                    </div>
                  </div>
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-geo-alt-fill" />
                    </span>
                    <div>
                      <div className="label">Location</div>
                      <p className="value">Badalpur, Gautam Buddha Nagar, Uttar Pradesh</p>
                    </div>
                  </div>
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-diagram-3-fill" />
                    </span>
                    <div>
                      <div className="label">Institute Type</div>
                      <p className="value">Government · Women only</p>
                    </div>
                  </div>
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-people-fill" />
                    </span>
                    <div>
                      <div className="label">Total Sanctioned Intake</div>
                      <p className="value">180 seats across 3 programmes</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="side-cta mt-4">
                <i className="bi bi-patch-check-fill side-cta-icon" />
                <h6>Other Statutory Approvals</h6>
                <p>See the full list of bodies that approve, affiliate and regulate the institute.</p>
                <Link href="/about/approvals" className="btn-gold btn-sm">
                  View Approvals
                  <i className="bi bi-arrow-right" />
                </Link>
              </div>
            </Col>
          </Row>

          <div className="panel mt-4">
            <div className="panel-header">
              <i className="bi bi-table" />
              Approved Programmes &amp; Sanctioned Intake
            </div>
            <div className="panel-body p-0">
              <div className="table-wrap">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Programme</th>
                      <th>Level</th>
                      <th>Duration</th>
                      <th>Approved Intake</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PROGRAMMES.map((programme) => (
                      <tr key={programme.name}>
                        <td>
                          <i className={`bi ${programme.icon} text-gold me-2`} />
                          {programme.name}
                        </td>
                        <td>Diploma</td>
                        <td>3 Years</td>
                        <td>{programme.intake}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
