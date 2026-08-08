"use client";

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import { JEECUP_PORTAL } from '@/lib/counselling';

const STEPS = [
  {
    icon: 'bi-person-plus-fill',
    title: 'Register for Counselling',
    text: 'Log in with your JEECUP roll number and password, verify your personal details and pay the counselling registration fee online.',
  },
  {
    icon: 'bi-ui-checks',
    title: 'Fill Your Choices',
    text: 'Add institutes and branches in your true order of preference. There is no limit on the number of choices — a longer list improves your chance of allotment.',
  },
  {
    icon: 'bi-lock-fill',
    title: 'Lock the Choices',
    text: 'Locking is compulsory. Choices left unlocked at the deadline are auto-locked as they stand, so review the order carefully before the window closes.',
  },
  {
    icon: 'bi-shuffle',
    title: 'Check Seat Allotment',
    text: 'Allotment is made on the basis of rank, choice order, category and seat availability. Download the allotment letter as soon as the result is declared.',
  },
  {
    icon: 'bi-file-earmark-check-fill',
    title: 'Attend Document Verification',
    text: 'Report to the allotted centre with all originals and one photocopy set on the date and shift printed on your allotment letter.',
  },
  {
    icon: 'bi-building-check',
    title: 'Report to the Institute',
    text: 'Submit your documents, pay the institute fee and complete admission formalities within the notified reporting window.',
  },
];

const DOS = [
  'Use your own active mobile number and email — every alert goes there.',
  'Keep the registration number, password and security question answers safe.',
  'Fill choices from a stable internet connection and save regularly.',
  'Download and print the allotment letter and every fee receipt.',
  'Check the official portal daily during the counselling period.',
];

const DONTS = [
  'Do not share your password or OTP with anyone, including cyber-cafe operators.',
  'Do not rely on unofficial websites or social media groups for dates.',
  'Do not fill choices you are not willing to join — an allotted seat blocks later rounds.',
  'Do not wait until the last hour of a window; the portal is heavily loaded then.',
  'Do not alter or misrepresent any certificate — it cancels the candidature.',
];

const FREEZE = [
  {
    term: 'Freeze',
    text: 'You accept the allotted seat and withdraw from further rounds. The seat is confirmed after reporting.',
  },
  {
    term: 'Float',
    text: 'You accept the allotted seat but remain in the running for a better choice in the next round.',
  },
  {
    term: 'Withdraw',
    text: 'You surrender the allotted seat and exit the counselling process as per the refund rules in force.',
  },
];

export default function InstructionForCandidates() {
  return (
    <>
      <div className="panel">
        <div className="panel-header">
          <i className="bi bi-info-square-fill" />
          Instruction for Candidates
        </div>
        <div className="panel-body">
          <p className="lead">
            Read these instructions completely before you begin counselling. Most seats are lost not
            to low rank but to a missed deadline or an unlocked choice list.
          </p>

          <div className="gold-rule-thin my-4" />

          <ul className="timeline">
            {STEPS.map((step) => (
              <li key={step.title}>
                <h6 className="fw-bold mb-1">
                  <i className={`bi ${step.icon} text-gold me-2`} />
                  {step.title}
                </h6>
                <p className="small mb-0">{step.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Row className="g-4 mt-0">
        <Col lg={6}>
          <div className="panel h-100">
            <div className="panel-header">
              <i className="bi bi-check2-circle" />
              Do
            </div>
            <div className="panel-body">
              <ul className="gold-list">
                {DOS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Col>

        <Col lg={6}>
          <div className="panel h-100">
            <div className="panel-header">
              <i className="bi bi-x-circle" />
              Do Not
            </div>
            <div className="panel-body">
              <ul className="gold-list">
                {DONTS.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Col>
      </Row>

      <div className="panel mt-4">
        <div className="panel-header">
          <i className="bi bi-signpost-2-fill" />
          Freeze, Float or Withdraw
        </div>
        <div className="panel-body">
          <p>
            After a seat is allotted you must record one of three decisions on the portal. Choose
            carefully — the option decides whether you stay in the later rounds.
          </p>

          <Row className="g-3 mt-1">
            {FREEZE.map((option) => (
              <Col md={4} key={option.term}>
                <div className="premium-card h-100 p-4">
                  <span className="icon-tile icon-tile-sm mb-3">
                    <i className="bi bi-diamond-fill" />
                  </span>
                  <h6 className="fw-bold mb-2">{option.term}</h6>
                  <p className="small mb-0">{option.text}</p>
                </div>
              </Col>
            ))}
          </Row>

          <div className="download-note mt-4">
            <p>
              Every instruction here follows the JEECUP counselling brochure. The complete official
              information booklet is also available on this website.
            </p>
            <Link className="btn-gold" href="/admission/booklet">
              <i className="bi bi-file-earmark-pdf-fill" />
              Information Booklet
            </Link>
          </div>

          <div className="callout mt-4">
            <i className="bi bi-info-circle-fill" />
            <p>
              In case of any difference between this page and the official JEECUP brochure, the{' '}
              <a href={JEECUP_PORTAL} target="_blank" rel="noopener noreferrer">
                JEECUP notification
              </a>{' '}
              shall prevail.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
