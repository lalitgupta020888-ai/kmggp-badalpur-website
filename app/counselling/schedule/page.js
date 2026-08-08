"use client";

import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { JEECUP_PORTAL } from '@/lib/counselling';

/**
 * The counselling schedule notified by JEECUP for the 2026 session.
 *
 * Kept in the board's own shape — phase, then round, then the activities within
 * that round — so a revised notification can be transcribed row for row. The
 * `deadline` field carries the reporting cut-off time where the board prints
 * one; it renders as a second line under the date.
 */
const UPDATED_ON = '23 July 2026';

const PHASES = [
  {
    name: 'Online (1st Phase) — Main Counselling',
    icon: 'bi-1-circle-fill',
    eligible: 'Qualified candidates of Uttar Pradesh',
    rounds: [
      {
        round: 'Round 01',
        activities: [
          { activity: 'Choice Filling (Qualified candidates of UP state)', date: '25/06/2026 – 30/06/2026' },
          { activity: 'Seat allotment', date: '01/07/2026' },
          {
            activity: 'Online Freeze / Float option selection and deposit of Security + Counselling fee',
            date: '02/07/2026 – 05/07/2026',
          },
          {
            activity: 'Document Verification at district Help Centres (Freeze candidates only)',
            date: '02/07/2026 – 06/07/2026',
            deadline: 'up to 6:00 PM',
          },
          { activity: 'Admitted Seat Withdrawal', date: '06/07/2026' },
        ],
      },
      {
        round: 'Round 02',
        activities: [
          { activity: 'Choice Filling (Qualified candidates of UP state)', date: '07/07/2026 – 09/07/2026' },
          { activity: 'Seat allotment', date: '10/07/2026' },
          {
            activity: 'Online Freeze / Float option selection and deposit of Security + Counselling fee',
            date: '11/07/2026 – 13/07/2026',
          },
          {
            activity: 'Document Verification at district Help Centres (Freeze candidates only)',
            date: '11/07/2026 – 14/07/2026',
            deadline: 'up to 6:00 PM',
          },
          { activity: 'Admitted Seat Withdrawal', date: '15/07/2026' },
        ],
      },
      {
        round: 'Round 03',
        activities: [
          { activity: 'Choice Filling (Qualified candidates of UP state)', date: '16/07/2026 – 19/07/2026' },
          { activity: 'Seat allotment', date: '20/07/2026' },
          {
            activity: 'Deposit of Security + Counselling fee (all candidates are auto-freezed)',
            date: '21/07/2026 – 23/07/2026',
          },
          {
            activity: 'Document Verification at district Help Centres (Freeze candidates only)',
            date: '21/07/2026 – 24/07/2026',
            deadline: 'up to 6:00 PM',
          },
          { activity: 'Admitted Seat Withdrawal (Rounds 1–3)', date: '25/07/2026' },
        ],
      },
    ],
  },
  {
    name: 'Online (2nd Phase) — Special Counselling',
    icon: 'bi-2-circle-fill',
    eligible: 'Qualified candidates of Uttar Pradesh and other states',
    rounds: [
      {
        round: 'Round 04',
        activities: [
          {
            activity: 'Choice Filling (Qualified candidates of UP and other states)',
            date: '27/07/2026 – 29/07/2026',
          },
          { activity: 'Seat allotment', date: '30/07/2026' },
          {
            activity: 'Online Freeze / Float option selection and deposit of Security + Counselling fee',
            date: '31/07/2026 – 03/08/2026',
            deadline: 'up to 5:00 PM',
          },
          {
            activity: 'Document Verification at district Help Centres (Freeze candidates only)',
            date: '31/07/2026 – 04/08/2026',
            deadline: 'up to 6:00 PM',
          },
          { activity: 'Admitted Seat Withdrawal', date: '05/08/2026' },
        ],
      },
      {
        round: 'Round 05',
        activities: [
          {
            activity: 'Choice Filling (Qualified candidates of UP and other states)',
            date: '06/08/2026 – 10/08/2026',
          },
          { activity: 'Seat allotment', date: '11/08/2026' },
          {
            activity: 'Deposit of Security + Counselling fee (all candidates are auto-freezed)',
            date: '12/08/2026 – 14/08/2026',
            deadline: 'up to 5:00 PM',
          },
          {
            activity: 'Document Verification at district Help Centres (Freeze candidates only)',
            date: '12/08/2026 – 14/08/2026',
            deadline: 'up to 6:00 PM',
          },
          { activity: 'Admitted Seat Withdrawal (Rounds 4–5)', date: '15/08/2026' },
        ],
      },
    ],
  },
];

const KEY_DATES = [
  { icon: 'bi-play-circle-fill', label: 'Counselling Begins', value: '25 June 2026', note: 'Round 01 choice filling opens' },
  { icon: 'bi-flag-fill', label: 'Main Counselling Ends', value: '25 July 2026', note: 'Withdrawal window for Rounds 1–3' },
  { icon: 'bi-stars', label: 'Special Counselling', value: '27 July 2026', note: 'Round 04 opens for all states' },
  { icon: 'bi-check-circle-fill', label: 'Counselling Closes', value: '15 August 2026', note: 'Withdrawal window for Rounds 4–5' },
];

const ENGINEERING = [
  'Group A — three-year diploma in Engineering & Technology, including all three branches offered at this institute.',
  'Group K — lateral entry directly into the second year for Class 12 Science and two-year ITI holders.',
  'Rounds 1 to 3 are open to qualified candidates of Uttar Pradesh only.',
];

const PHARMACY = [
  'Group E — two-year Diploma in Pharmacy, conducted at institutes approved for the programme.',
  'Pharmacy candidates follow the same round dates shown above, at their own allotted Help Centres.',
  'Diploma in Pharmacy is not offered at KMGGP, Badalpur — this institute admits Group A and Group K candidates only.',
];

const TERMS = [
  { term: 'Freeze', text: 'You accept the allotted seat and leave the later rounds. Document verification applies to freeze candidates only.' },
  { term: 'Float', text: 'You accept the allotted seat but stay in the running for a better choice in the next round.' },
  { term: 'Auto-Freeze', text: 'In the last round of each phase every candidate is frozen automatically — the float option is no longer offered.' },
  { term: 'Seat Withdrawal', text: 'The window to surrender an allotted seat. Miss it and the seat, with its fee, stands against your name.' },
];

export default function CounsellingSchedule() {
  return (
    <>
      <div className="panel">
        <div className="panel-header">
          <i className="bi bi-calendar2-week-fill" />
          Counselling Schedule for Engineering and Pharmacy Courses
        </div>
        <div className="panel-body">
          <p className="lead">
            JEECUP counselling for the 2026 session runs in two phases and five rounds. Each round
            repeats the same sequence — choice filling, seat allotment, fee deposit with the freeze
            or float option, document verification, and the seat withdrawal window.
          </p>

          <div className="d-flex flex-wrap align-items-center gap-2 mt-3">
            <span className="status-pill is-meta">
              <i className="bi bi-arrow-clockwise me-2" />
              Updated on {UPDATED_ON}
            </span>
            <span className="status-pill is-meta">
              <i className="bi bi-calendar-range me-2" />
              25 June – 15 August 2026
            </span>
          </div>

          <div className="gold-rule-thin my-4" />

          <Row className="g-3">
            {KEY_DATES.map((item) => (
              <Col md={6} xl={3} key={item.label}>
                <div className="premium-card h-100 p-4">
                  <span className="icon-tile icon-tile-sm mb-3">
                    <i className={`bi ${item.icon}`} />
                  </span>
                  <p className="small text-uppercase fw-bold mb-1 text-primary-blue">{item.label}</p>
                  <h6 className="fw-bold mb-1">{item.value}</h6>
                  <p className="small mb-0">{item.note}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {PHASES.map((phase) => (
        <div className="panel mt-4" key={phase.name}>
          <div className="panel-header">
            <i className={`bi ${phase.icon}`} />
            {phase.name}
          </div>
          <div className="panel-body p-0">
            <p className="small px-4 pt-4 mb-3">
              <i className="bi bi-people-fill text-gold me-2" />
              Open to: <strong>{phase.eligible}</strong>
            </p>

            <div className="table-wrap">
              <table className="premium-table schedule-table">
                <thead>
                  <tr>
                    <th>Round</th>
                    <th>Counselling Activity</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {phase.rounds.map((round) =>
                    round.activities.map((item, index) => (
                      <tr
                        key={`${round.round}-${item.activity}`}
                        className={index === 0 ? 'is-round-start' : ''}
                      >
                        {index === 0 && (
                          <td rowSpan={round.activities.length} className="round-cell">
                            <span className="round-chip">{round.round}</span>
                          </td>
                        )}
                        <td>{item.activity}</td>
                        <td>
                          <span className="schedule-date">{item.date}</span>
                          {item.deadline && (
                            <span className="schedule-deadline">{item.deadline}</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ))}

      <div className="panel mt-4">
        <div className="panel-header">
          <i className="bi bi-info-square-fill" />
          Reading the Schedule
        </div>
        <div className="panel-body">
          <Row className="g-3">
            {TERMS.map((item) => (
              <Col md={6} key={item.term}>
                <div className="premium-card h-100 p-4">
                  <span className="icon-tile icon-tile-sm mb-3">
                    <i className="bi bi-diamond-fill" />
                  </span>
                  <h6 className="fw-bold mb-2">{item.term}</h6>
                  <p className="small mb-0">{item.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      <Row className="g-4 mt-0">
        <Col lg={6}>
          <div className="panel h-100">
            <div className="panel-header">
              <i className="bi bi-gear-wide-connected" />
              Engineering &amp; Technology
            </div>
            <div className="panel-body">
              <ul className="gold-list">
                {ENGINEERING.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Col>

        <Col lg={6}>
          <div className="panel h-100">
            <div className="panel-header">
              <i className="bi bi-capsule" />
              Pharmacy
            </div>
            <div className="panel-body">
              <ul className="gold-list">
                {PHARMACY.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </Col>
      </Row>

      <div className="panel mt-4">
        <div className="panel-body">
          <div className="download-note">
            <p>
              This schedule reproduces the JEECUP notification updated on {UPDATED_ON}. The board
              publishes any revision on its counselling portal.
            </p>
            <a className="btn-gold" href={JEECUP_PORTAL} target="_blank" rel="noopener noreferrer">
              <i className="bi bi-box-arrow-up-right" />
              View Official Schedule
            </a>
          </div>

          <div className="callout mt-4">
            <i className="bi bi-exclamation-triangle-fill" />
            <p>
              Rounds are sometimes added, merged or rescheduled by the board, and seats still vacant
              after Round 05 are filled through direct admission at institute level. Treat the JEECUP
              notification as final and check the portal daily during the counselling period.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
