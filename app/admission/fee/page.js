"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

const FEES = [
  { head: 'Tuition Fee', amount: '₹ 10,370', period: 'Per Annum', icon: 'bi-mortarboard-fill' },
  { head: 'Admission & Registration', amount: 'As per norms', period: 'One Time', icon: 'bi-file-earmark-text-fill' },
  { head: 'Examination Fee', amount: 'As per BTEUP', period: 'Per Semester', icon: 'bi-pencil-square' },
  { head: 'Hostel Fee', amount: 'As per govt. norms', period: 'Per Annum', icon: 'bi-house-heart-fill' },
  { head: 'Caution Money (Refundable)', amount: 'As per norms', period: 'One Time', icon: 'bi-piggy-bank-fill' },
];

const FEE_GO_FILE = '/documents/FeeStructureGO.pdf';

const CONCESSIONS = [
  'SC / ST category students are eligible for fee reimbursement under state government schemes.',
  'Students from economically weaker sections may apply for a full or partial fee waiver.',
  'The AICTE Pragati Scholarship provides additional financial support for girl students.',
  'Post-matric scholarship covers tuition fees for eligible candidates through direct benefit transfer.',
];

const PAYMENT_MODES = [
  { icon: 'bi-bank', label: 'Online transfer to the institute account' },
  { icon: 'bi-credit-card-fill', label: 'Debit card, credit card or net banking' },
  { icon: 'bi-upc-scan', label: 'UPI payment at the institute counter' },
  { icon: 'bi-receipt', label: 'Demand draft in favour of the Principal' },
];

export default function FeeStructure() {
  return (
    <>
      <PageHeader
        icon="bi-cash-coin"
        eyebrow="Admissions"
        title="Fee Structure"
        subtitle="Transparent, government-regulated fees with extensive scholarship and waiver support."
        crumbs={[{ label: 'Admissions' }, { label: 'Fee Structure' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={7}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-table" />
                  Fee Details — Session 2026-27
                </div>
                <div className="panel-body p-0">
                  <div className="table-wrap">
                    <table className="premium-table">
                      <thead>
                        <tr>
                          <th>Fee Head</th>
                          <th>Amount</th>
                          <th>Frequency</th>
                        </tr>
                      </thead>
                      <tbody>
                        {FEES.map((fee) => (
                          <tr key={fee.head}>
                            <td>
                              <i className={`bi ${fee.icon} text-gold me-2`} />
                              {fee.head}
                            </td>
                            <td>{fee.amount}</td>
                            <td>{fee.period}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="go-note">
                    <div className="go-note-meta">
                      <h6>
                        Government Order No.-1371/सोलह-प्रा0शि0-3-2010-246(बी)/91
                      </h6>
                      <p>
                        <span>Dated:</span> 30 April 2010
                      </p>
                      <p>
                        <span>Subject:</span> Regarding fee rates in Government Polytechnic
                        Institutions.
                      </p>
                    </div>
                    <a
                      className="btn-gold"
                      href={FEE_GO_FILE}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-file-earmark-pdf-fill" />
                      View GO
                    </a>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={5}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-gift-fill" />
                  Concessions &amp; Waivers
                </div>
                <div className="panel-body">
                  <ul className="gold-list">
                    {CONCESSIONS.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <Link href="/scholarship" className="btn-gold mt-3">
                    <i className="bi bi-cash-stack" />
                    Explore Scholarships
                  </Link>
                </div>
              </div>

              <div className="panel mt-4">
                <div className="panel-header">
                  <i className="bi bi-wallet2" />
                  Modes of Payment
                </div>
                <div className="panel-body">
                  {PAYMENT_MODES.map((mode) => (
                    <div className="feature-row align-items-center mb-3" key={mode.label}>
                      <span className="icon-tile icon-tile-sm">
                        <i className={`bi ${mode.icon}`} />
                      </span>
                      <h5 className="mb-0">{mode.label}</h5>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>

          <div className="callout mt-4">
            <i className="bi bi-exclamation-triangle-fill" />
            <p>
              Fees are as per the norms of the Government of Uttar Pradesh for government polytechnics
              and are subject to change by government order. The figures shown above are indicative;
              please confirm the current amounts with the institute office at the time of admission.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
