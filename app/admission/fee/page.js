import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { getSection } from '@/lib/server/sections';




export default async function FeeStructure() {
  const fee = await getSection('fee-structure');
  const FEES = fee.fees || [];
  const FEE_GO_FILE = fee.goFile;
  const CONCESSIONS = (fee.concessions || []).map((item) => item.text);
  const PAYMENT_MODES = fee.paymentModes || [];

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
                  <i className="bi bi-table" aria-hidden="true" />
                  Fee Details — Session 2026-27
                </div>
                <div className="panel-body p-0">
                  <div className="table-wrap">
                    <table className="premium-table">
                      <thead>
                        <tr>
                          <th scope="col">Fee Head</th>
                          <th scope="col">Amount</th>
                          <th scope="col">Frequency</th>
                        </tr>
                      </thead>
                      <tbody>
                        {FEES.map((fee) => (
                          <tr key={fee.head}>
                            <td>
                              <i className={`bi ${fee.icon} text-gold me-2`} aria-hidden="true" />
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
                      <h4 className="h6">
                        Government Order No.-1371/सोलह-प्रा0शि0-3-2010-246(बी)/91
                      </h4>
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
                      <i className="bi bi-file-earmark-pdf-fill" aria-hidden="true" />
                      View GO
                    </a>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={5}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-gift-fill" aria-hidden="true" />
                  Concessions &amp; Waivers
                </div>
                <div className="panel-body">
                  <ul className="gold-list">
                    {CONCESSIONS.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                  <Link href="/scholarship" className="btn-gold mt-3">
                    <i className="bi bi-cash-stack" aria-hidden="true" />
                    Explore Scholarships
                  </Link>
                </div>
              </div>

              <div className="panel mt-4">
                <div className="panel-header">
                  <i className="bi bi-wallet2" aria-hidden="true" />
                  Modes of Payment
                </div>
                <div className="panel-body">
                  {PAYMENT_MODES.map((mode) => (
                    <div className="feature-row align-items-center mb-3" key={mode.label}>
                      <span className="icon-tile icon-tile-sm">
                        <i className={`bi ${mode.icon}`} aria-hidden="true" />
                      </span>
                      <h3 className="h5 mb-0">{mode.label}</h3>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>

          <div className="callout mt-4">
            <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
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
