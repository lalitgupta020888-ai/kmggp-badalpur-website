"use client";

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Link from 'next/link';

const SUBMIT = [
  { doc: 'Seat allotment letter', form: 'Original + 1 copy', note: 'Downloaded from the counselling portal' },
  { doc: 'Document verification slip', form: 'Original', note: 'Issued at the verification centre' },
  { doc: 'High School marksheet & certificate', form: 'Original + 2 copies', note: 'Proof of age and qualification' },
  { doc: 'Intermediate marksheet & certificate', form: 'Original + 2 copies', note: 'Where required by the group; compulsory for Group K lateral entry' },
  { doc: 'ITI certificate & marksheets', form: 'Original + 2 copies', note: 'Group K lateral entry, ITI route only' },
  { doc: 'Transfer Certificate (TC)', form: 'Original', note: 'Retained by the institute' },
  { doc: 'Character Certificate', form: 'Original', note: 'Issued within the last six months' },
  { doc: 'Domicile certificate', form: 'Original + 1 copy', note: 'Uttar Pradesh domicile' },
  { doc: 'Category / sub-category certificate', form: 'Original + 1 copy', note: 'Where claimed during counselling' },
  { doc: 'Income certificate', form: 'Original + 1 copy', note: 'For fee concession and scholarship' },
  { doc: 'Aadhaar card', form: '2 copies', note: 'Must match the name on the marksheets' },
  { doc: 'Bank passbook (Aadhaar-linked)', form: '1 copy', note: 'For scholarship disbursal' },
  { doc: 'Passport-size photographs', form: '8 copies', note: 'Same photograph as the application form' },
  { doc: 'Admission fee receipt', form: 'Original + 1 copy', note: 'Portal receipt or institute challan' },
  { doc: 'Medical fitness certificate', form: 'Original', note: 'Required for hostel allotment' },
];

const STEPS = [
  'Report at the institute on or before the last reporting date on your allotment letter.',
  'Submit the file of documents at the admission counter and collect the checklist receipt.',
  'Deposit the institute fee and obtain the fee receipt.',
  'Complete the anti-ragging undertaking, signed by the candidate and a parent or guardian.',
  'Apply for hostel accommodation at the same counter, if required.',
  'Collect your enrolment slip and the branch-wise reporting schedule for classes.',
];

export default function DocumentListForAdmission() {
  return (
    <>
      <div className="panel">
        <div className="panel-header">
          <i className="bi bi-folder-check" />
          Document List for Admission
        </div>
        <div className="panel-body">
          <p className="lead">
            Once your documents are verified and the seat is confirmed, report to the institute with
            the following set to complete admission.
          </p>
          <p>
            Arrange the papers in the order given below in a single file. Documents marked as
            retained by the institute are not returned during the course of study.
          </p>

          <div className="gold-rule-thin my-4" />

          <div className="table-wrap">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Form Required</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                {SUBMIT.map((row) => (
                  <tr key={row.doc}>
                    <td>
                      <i className="bi bi-file-earmark-text text-gold me-2" />
                      {row.doc}
                    </td>
                    <td>{row.form}</td>
                    <td className="small">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <Row className="g-4 mt-0">
        <Col lg={7}>
          <div className="panel h-100">
            <div className="panel-header">
              <i className="bi bi-list-ol" />
              Reporting at the Institute
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
              <i className="bi bi-exclamation-circle-fill" />
              Important
            </div>
            <div className="panel-body">
              <div className="callout">
                <i className="bi bi-clock-fill" />
                <p>
                  A candidate who does not report within the notified window forfeits the allotted
                  seat, and it is released to the next round.
                </p>
              </div>

              <div className="callout mt-3">
                <i className="bi bi-cash-coin" />
                <p>
                  The fee heads payable at admission are listed on the{' '}
                  <Link href="/admission/fee">Fee Structure</Link> page.
                </p>
              </div>

              <div className="callout mt-3">
                <i className="bi bi-person-hearts" />
                <p>
                  A parent or guardian should accompany the candidate — the anti-ragging undertaking
                  requires a guardian&rsquo;s signature.
                </p>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </>
  );
}
