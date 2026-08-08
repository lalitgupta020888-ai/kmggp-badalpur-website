"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';

/**
 * Branch-wise class time-tables. Each entry points at the PDF published for the
 * current session; drop a replacement at the same path when the timetable is
 * revised and nothing here needs to change.
 */
const BRANCHES = [
  {
    slug: 'electronics',
    icon: 'bi-cpu-fill',
    name: 'Electronics Engineering',
    text: 'Lecture, tutorial and laboratory slots for all six semesters of the Electronics diploma.',
    file: '/documents/time-table-electronics.pdf',
  },
  {
    slug: 'cse',
    icon: 'bi-pc-display',
    name: 'Computer Science & Engineering',
    text: 'Weekly class schedule with programming and project laboratory allocations.',
    file: '/documents/time-table-cse.pdf',
  },
  {
    slug: 'it',
    icon: 'bi-hdd-network-fill',
    name: 'Information Technology',
    text: 'Weekly class schedule covering networking, web technology and security laboratories.',
    file: '/documents/time-table-it.pdf',
  },
];

/**
 * Six one-hour periods with a lunch break in the middle, filling the institute
 * day of 10:00 AM to 5:00 PM. `isBreak` marks the recess row so it reads as a
 * divider rather than another period.
 */
const PERIODS = [
  { period: 'I', time: '10:00 AM – 11:00 AM', kind: 'Theory' },
  { period: 'II', time: '11:00 AM – 12:00 Noon', kind: 'Theory' },
  { period: 'III', time: '12:00 Noon – 01:00 PM', kind: 'Theory' },
  { period: 'Lunch / Break', time: '01:00 PM – 02:00 PM', kind: 'Recess', isBreak: true },
  { period: 'IV', time: '02:00 PM – 03:00 PM', kind: 'Practical' },
  { period: 'V', time: '03:00 PM – 04:00 PM', kind: 'Practical' },
  { period: 'VI', time: '04:00 PM – 05:00 PM', kind: 'Practical / Remedial' },
];

const NOTES = [
  'Classes run Monday to Saturday, 10:00 AM to 5:00 PM, with a lunch break from 1:00 PM to 2:00 PM.',
  'Saturday is reserved for remedial and project work.',
  'Laboratory batches are split as notified on the department notice board.',
  'Any change in the schedule is announced by the department a day in advance.',
];

export default function TimeTable() {
  return (
    <>
      <PageHeader
        icon="bi-clock-history"
        eyebrow="Academics"
        title="Time-Table"
        subtitle="Branch-wise class and laboratory schedule for the academic session 2026-27."
        crumbs={[{ label: 'Academics' }, { label: 'Time-Table' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <SectionHead
            eyebrow="Download Centre"
            icon="bi-download"
            title="Time-Table by Branch"
            subtitle="Select your branch to download the current semester time-table."
          />

          <Row className="g-4">
            {BRANCHES.map((branch) => (
              <Col lg={4} md={6} key={branch.slug}>
                <div className="premium-card h-100 p-4 d-flex flex-column">
                  <span className="icon-tile mb-4">
                    <i className={`bi ${branch.icon}`} />
                  </span>
                  <h5 className="fw-bold mb-3">{branch.name}</h5>
                  <p className="small flex-grow-1">{branch.text}</p>
                  <div className="gold-rule-thin my-3" />
                  <a
                    href={branch.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="doc-link mb-0"
                  >
                    <i className="bi bi-file-earmark-pdf-fill" />
                    Download Time-Table (PDF)
                    <i className="bi bi-arrow-right-short" />
                  </a>
                </div>
              </Col>
            ))}
          </Row>

          <Row className="g-4 mt-2">
            <Col lg={7}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-hourglass-split" />
                  Daily Period Timings
                </div>
                <div className="panel-body p-0">
                  <div className="table-wrap">
                    <table className="premium-table period-table">
                      <thead>
                        <tr>
                          <th>Period</th>
                          <th>Timing</th>
                          <th>Type</th>
                        </tr>
                      </thead>
                      <tbody>
                        {PERIODS.map((slot) => (
                          <tr key={slot.period} className={slot.isBreak ? 'is-break' : ''}>
                            <td>
                              <i
                                className={`bi ${slot.isBreak ? 'bi-cup-hot-fill' : 'bi-clock'} text-gold me-2`}
                              />
                              {slot.period}
                            </td>
                            <td>
                              <span className="period-time">{slot.time}</span>
                            </td>
                            <td>{slot.kind}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={5}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-info-square-fill" />
                  Points to Note
                </div>
                <div className="panel-body">
                  <ul className="gold-list">
                    {NOTES.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>

                  <div className="callout mt-4">
                    <i className="bi bi-info-circle-fill" />
                    <p>
                      The time-table is revised at the start of every semester. Always check the
                      session and semester printed on the document before following it.
                    </p>
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
