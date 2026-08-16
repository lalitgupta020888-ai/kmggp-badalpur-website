import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { JEECUP_PORTAL } from '@/lib/counselling';
import { getSection } from '@/lib/server/sections';

/**
 * The section landing page — the same seven entries as the sidebar, laid out as
 * cards so a candidate arriving from the navbar sees every action at once.
 */
const BLURBS = {
  'Counsellor Login': 'For institute counsellors and nodal officers verifying candidates on the JEECUP portal.',
  'Document List for Verification':'The originals and copies to carry to the document verification centre.',
  'Document List for Admission': 'What to submit at the institute while reporting after seat allotment.',
  'Instruction for Candidates': 'Step-by-step guidance on registration, choice filling, locking and reporting.',
  'Groupwise Eligibility Table': 'Minimum qualification and subject requirement for each JEECUP group.',
  'Student Login 4 Counselling': 'Candidate login for registration, choice filling and seat allotment status.',
  'Counselling Schedule for Engineering and Pharmacy Courses': 'Round-wise stages of the counselling process for the current session.',
};

const STAGES = [
  { icon: 'bi-person-plus-fill', title: 'Registration', text: 'Register on the JEECUP counselling portal with your roll number and rank.' },
  { icon: 'bi-ui-checks', title: 'Choice Filling & Locking', text: 'Select and order your preferred institutes and branches, then lock the choices.' },
  { icon: 'bi-shuffle', title: 'Seat Allotment', text: 'Seats are allotted on the basis of rank, choice order, category and availability.' },
  { icon: 'bi-file-earmark-check-fill', title: 'Document Verification', text: 'Report to the allotted verification centre with all original documents.' },
  { icon: 'bi-building-check', title: 'Reporting at the Institute', text: 'Deposit the admission fee and submit your documents at KMGGP, Badalpur.' },
];

export default async function CounsellingHome() {
  const COUNSELLING_LINKS = await getSection('counselling-links');

  return (
    <>
      <div className="panel">
        <div className="panel-header">
          <i className="bi bi-clipboard2-check-fill" />
          Counselling &amp; Admission 2026 — Quick Access
        </div>
        <div className="panel-body">
          <p className="lead">
            Admission to all diploma programmes at Km. Mayawati Government Girls Polytechnic,
            Badalpur is made solely through the counselling conducted by the Joint Entrance
            Examination Council, Uttar Pradesh (JEECUP).
          </p>
          <p>
            Use the links below at each stage of the process. Registration, choice filling and seat
            allotment happen on the JEECUP portal; document verification and reporting happen at the
            centre and institute allotted to you.
          </p>
          <p className="mb-0">
            All three diploma branches admit under two groups — <strong>Group A</strong> for
            first-year
            entry after Class 10, and <strong>Group K</strong> for lateral entry straight into the
            second year after Class 12 or a two-year ITI. Both routes follow the same counselling
            steps; see the{' '}
            <Link href="/counselling/eligibility">Groupwise Eligibility Table</Link> for the
            qualification each one needs.
          </p>

          <div className="gold-rule-thin my-4" />

          <Row className="g-3">
            {COUNSELLING_LINKS.map((link, index) => {
              const body = (
                <>
                  <span className="icon-tile icon-tile-sm mb-3">
                    <i className={`bi ${link.icon}`} />
                  </span>
                  <h6 className="fw-bold mb-2">
                    {link.label}
                    {link.external && (
                      <i className="bi bi-box-arrow-up-right ms-2 small text-gold" aria-hidden="true" />
                    )}
                  </h6>
                  <p className="small mb-0">{BLURBS[link.label]}</p>
                </>
              );

              return (
                <Col md={6} key={`${link.href}-${index}`}>
                  {link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="premium-card h-100 p-4 d-flex flex-column text-decoration-none"
                    >
                      {body}
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="premium-card h-100 p-4 d-flex flex-column text-decoration-none"
                    >
                      {body}
                    </Link>
                  )}
                </Col>
              );
            })}
          </Row>
        </div>
      </div>

      <div className="panel mt-4">
        <div className="panel-header">
          <i className="bi bi-signpost-split-fill" />
          How the Counselling Works
        </div>
        <div className="panel-body">
          <ul className="timeline">
            {STAGES.map((stage) => (
              <li key={stage.title}>
                <h6 className="fw-bold mb-1">
                  <i className={`bi ${stage.icon} text-gold me-2`} />
                  {stage.title}
                </h6>
                <p className="small mb-0">{stage.text}</p>
              </li>
            ))}
          </ul>

          <div className="download-note mt-4">
            <p>
              Registration, choice filling, seat allotment and fee payment are all done on the
              official JEECUP counselling portal.
            </p>
            <a className="btn-gold" href={JEECUP_PORTAL} target="_blank" rel="noopener noreferrer">
              <i className="bi bi-box-arrow-up-right" />
              Open JEECUP Portal
            </a>
          </div>

          <div className="callout mt-4">
            <i className="bi bi-info-circle-fill" />
            <p>
              Counselling dates, rounds and rules are notified by JEECUP each year. Always confirm
              the current schedule on the official portal before acting on any date.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
