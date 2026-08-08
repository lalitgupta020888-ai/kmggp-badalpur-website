"use client";

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { JEECUP_PORTAL } from '@/lib/counselling';

const ORIGINALS = [
  'JEECUP rank card / score card',
  'JEECUP admit card of the entrance examination',
  'Seat allotment letter downloaded from the counselling portal',
  'High School (Class 10) marksheet and certificate',
  'Intermediate (Class 12) marksheet and certificate, where the group requires it',
  'Transfer Certificate (TC) from the institution last attended',
  'Character Certificate issued within the last six months',
  'Domicile certificate of Uttar Pradesh',
  'Category certificate (SC / ST / OBC / EWS), where claimed',
  'Income certificate, where a fee concession or scholarship is claimed',
  'Sub-category certificate — PH, Freedom Fighter, Armed Forces — where claimed',
  'Aadhaar card',
];

const COPIES = [
  'Two self-attested photocopies of every original listed above',
  'Six recent passport-size photographs, identical to the one on the application form',
  'Fee payment receipt generated on the counselling portal',
];

const LATERAL = [
  'Class 12 (Intermediate) marksheet and passing certificate, for candidates entering on the Class 12 route',
  'Two-year ITI certificate with all marksheets, for candidates entering on the ITI route',
  'Class 10 marksheet, required in both cases as proof of age and of the qualification preceding ITI',
  'JEECUP Group K rank card and the Group K seat allotment letter',
];

const RULES = [
  'Reach the allotted verification centre on the date and shift printed on your allotment letter.',
  'Originals are checked and returned at the counter — only the photocopy set is retained.',
  'The candidate must appear in person; verification by a representative is not permitted.',
  'A candidate whose documents do not match the details filled online loses the allotted seat.',
  'Carry the documents in the order listed above; it makes the counter check considerably faster.',
];

export default function DocumentListForVerification() {
  return (
    <>
      <div className="panel">
        <div className="panel-header">
          <i className="bi bi-file-earmark-check-fill" />
          Document List for Verification
        </div>
        <div className="panel-body">
          <p className="lead">
            After seat allotment, every candidate must report to the allotted document verification
            centre with the originals listed below, along with one photocopy set.
          </p>
          <p>
            Verification confirms that the marks, category and sub-category you declared during
            registration match your certificates. Bring every applicable document — a missing
            certificate can cost you the allotted seat.
          </p>

          <div className="gold-rule-thin my-4" />

          <Row className="g-4">
            <Col lg={7}>
              <h5 className="fw-bold mb-3">
                <i className="bi bi-file-earmark-text-fill text-gold me-2" />
                Original Documents
              </h5>
              <ul className="gold-list is-numbered">
                {ORIGINALS.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>
            </Col>

            <Col lg={5}>
              <h5 className="fw-bold mb-3">
                <i className="bi bi-files text-gold me-2" />
                Copies &amp; Photographs
              </h5>
              <ul className="gold-list">
                {COPIES.map((doc) => (
                  <li key={doc}>{doc}</li>
                ))}
              </ul>

              <div className="callout mt-4">
                <i className="bi bi-exclamation-triangle-fill" />
                <p>
                  Category and sub-category certificates must be in the format prescribed by the
                  Government of Uttar Pradesh. A certificate in any other format is not accepted.
                </p>
              </div>
            </Col>
          </Row>
        </div>
      </div>

      <div className="panel mt-4">
        <div className="panel-header">
          <i className="bi bi-box-arrow-in-right" />
          Additional Documents — Group K Lateral Entry
        </div>
        <div className="panel-body">
          <p>
            Candidates admitted under <strong>Group K</strong> to the second year must carry the
            following in addition to every original listed above.
          </p>
          <ul className="gold-list">
            {LATERAL.map((doc) => (
              <li key={doc}>{doc}</li>
            ))}
          </ul>

          <div className="callout mt-4">
            <i className="bi bi-info-circle-fill" />
            <p>
              An ITI candidate&rsquo;s trade must be related to the branch allotted. The verification
              officer checks this against the JEECUP trade-to-branch mapping, so carry the trade
              certificate even if it was not uploaded during registration.
            </p>
          </div>
        </div>
      </div>

      <div className="panel mt-4">
        <div className="panel-header">
          <i className="bi bi-shield-check" />
          Rules at the Verification Centre
        </div>
        <div className="panel-body">
          <ul className="gold-list">
            {RULES.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>

          <div className="download-note mt-4">
            <p>
              Your verification centre, date and reporting time are printed on the seat allotment
              letter available in your counselling account.
            </p>
            <a className="btn-gold" href={JEECUP_PORTAL} target="_blank" rel="noopener noreferrer">
              <i className="bi bi-box-arrow-up-right" />
              Download Allotment Letter
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
