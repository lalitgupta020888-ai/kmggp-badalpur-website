"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';

const POLICY = [
  'Caution money is a refundable security deposit collected once at the time of admission.',
  'It is refunded in full after the student completes or formally leaves the diploma programme.',
  'No interest is payable on the caution money deposit.',
  'The refund is made only after all institute dues are cleared and no-dues clearance is obtained.',
  'Any outstanding library, laboratory or hostel dues are adjusted against the deposit before refund.',
  'Claims must be made within one year of leaving the institute, after which the amount may lapse to the institute fund.',
];

const STEPS = [
  {
    title: 'Obtain the Refund Application Form',
    text: 'Collect the caution money refund form from the institute accounts section, or download it from this page.',
  },
  {
    title: 'Complete the No-Dues Clearance',
    text: 'Get the no-dues certificate signed by the library, your department, the laboratory in-charge, the hostel warden (if applicable) and the accounts section.',
  },
  {
    title: 'Attach the Required Documents',
    text: 'Enclose the original fee receipt showing the caution money deposit, along with your bank and identity documents.',
  },
  {
    title: 'Submit to the Accounts Section',
    text: 'Deposit the completed form with all attachments at the institute accounts section and collect the acknowledgement.',
  },
  {
    title: 'Verification & Approval',
    text: 'The accounts section verifies the deposit record and dues position, and forwards the case for sanction by the Principal.',
  },
  {
    title: 'Refund Credited to Your Account',
    text: 'The approved amount is transferred directly to the registered bank account, normally within 30 working days.',
  },
];

const DOCUMENTS = [
  'Duly filled and signed caution money refund application form',
  'Original fee receipt showing the caution money deposit',
  'No-dues certificate from all departments and sections',
  'Copy of the final marksheet or transfer certificate',
  'Cancelled cheque or bank passbook copy (account in the student’s name)',
  'Copy of Aadhaar card or other photo identity proof',
];

export default function CautionMoneyRefundPage() {
  return (
    <>
      <PageHeader
        icon="bi-piggy-bank-fill"
        eyebrow="Academics"
        title="Policy &amp; Process for Refund of Caution Money"
        subtitle="How the refundable security deposit is claimed, verified and returned to students."
        crumbs={[{ label: 'Academics' }, { label: 'Refund of Caution Money' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={7}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-file-earmark-ruled-fill" />
                  Refund Policy
                </div>
                <div className="panel-body">
                  <p>
                    Caution money is collected once at the time of admission as a refundable security
                    deposit against institute property and outstanding dues. The following policy
                    governs its refund.
                  </p>
                  <ul className="gold-list mt-4">
                    {POLICY.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <div className="callout mt-4">
                    <i className="bi bi-exclamation-triangle-fill" />
                    <p>
                      Refund claims submitted more than one year after leaving the institute may not
                      be entertained. Students are advised to apply immediately after completing the
                      programme.
                    </p>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={5}>
              <div className="panel">
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

              <div className="panel mt-4">
                <div className="panel-header">
                  <i className="bi bi-download" />
                  Download Forms
                </div>
                <div className="panel-body">
                  <a href="#" className="doc-link">
                    <i className="bi bi-file-earmark-pdf-fill" />
                    Caution Money Refund Form (PDF)
                    <i className="bi bi-arrow-right-short" />
                  </a>
                  <a href="#" className="doc-link mb-0">
                    <i className="bi bi-file-earmark-check-fill" />
                    No-Dues Clearance Form (PDF)
                    <i className="bi bi-arrow-right-short" />
                  </a>
                </div>
              </div>

              <div className="side-cta mt-4">
                <i className="bi bi-cash-coin side-cta-icon" />
                <h6>Questions About Your Refund?</h6>
                <p>The accounts section can confirm your deposit record and dues position.</p>
                <Link href="/contact" className="btn-gold btn-sm">
                  Contact Accounts
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
            eyebrow="Step by Step"
            icon="bi-signpost-split-fill"
            title="The Refund Process"
            subtitle="Follow these steps in order to ensure your claim is processed without delay."
          />
          <Row className="g-4">
            <Col lg={8} className="mx-auto">
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-list-ol" />
                  Process Flow
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

              <div className="panel mt-4">
                <div className="panel-header">
                  <i className="bi bi-clock-history" />
                  Processing Timeline
                </div>
                <div className="panel-body p-0">
                  <div className="table-wrap">
                    <table className="premium-table">
                      <thead>
                        <tr>
                          <th>Stage</th>
                          <th>Responsible Section</th>
                          <th>Indicative Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            <i className="bi bi-file-earmark-check-fill text-gold me-2" />
                            No-dues clearance
                          </td>
                          <td>Departments, Library, Hostel</td>
                          <td>3 – 7 working days</td>
                        </tr>
                        <tr>
                          <td>
                            <i className="bi bi-search text-gold me-2" />
                            Verification of deposit
                          </td>
                          <td>Accounts Section</td>
                          <td>5 – 10 working days</td>
                        </tr>
                        <tr>
                          <td>
                            <i className="bi bi-patch-check-fill text-gold me-2" />
                            Sanction of refund
                          </td>
                          <td>Office of the Principal</td>
                          <td>5 – 7 working days</td>
                        </tr>
                        <tr>
                          <td>
                            <i className="bi bi-bank text-gold me-2" />
                            Credit to bank account
                          </td>
                          <td>Accounts Section</td>
                          <td>Within 30 working days</td>
                        </tr>
                      </tbody>
                    </table>
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
