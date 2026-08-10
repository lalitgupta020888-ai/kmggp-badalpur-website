"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';
import { PERIODS, NOTES } from '@/lib/timetable';

/**
 * Each card opens the programme's own page, where the schedule is published a
 * year at a time — one card cannot carry three of them, and a single PDF per
 * branch left a first year student downloading the final year's week.
 * The years themselves live in `lib/timetable.js`.
 */
const BRANCHES = [
  {
    slug: 'electronics',
    icon: 'bi-cpu-fill',
    name: 'Electronics Engineering',
    text: 'Lecture, tutorial and laboratory slots for all six semesters of the Electronics diploma.',
  },
  {
    slug: 'cse',
    icon: 'bi-pc-display',
    name: 'Computer Science & Engineering',
    text: 'Weekly class schedule with programming and project laboratory allocations.',
  },
  {
    slug: 'it',
    icon: 'bi-hdd-network-fill',
    name: 'Information Technology',
    text: 'Weekly class schedule covering networking, web technology and security laboratories.',
  },
  {
    slug: 'retail-management',
    icon: 'bi-shop',
    name: 'P. G. Diploma in Retail Management',
    text: 'Weekly schedule for the retail operations, merchandising and business computing sessions.',
  },
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
            title="Time-Table by Programme"
            subtitle="Select your programme to download its year-wise class time-table."
          />

          <Row className="g-4">
            {BRANCHES.map((branch) => (
              <Col xl={3} md={6} key={branch.slug}>
                <div className="premium-card h-100 p-4 d-flex flex-column">
                  <span className="icon-tile mb-4">
                    <i className={`bi ${branch.icon}`} />
                  </span>
                  <h5 className="fw-bold mb-3">{branch.name}</h5>
                  <p className="small flex-grow-1">{branch.text}</p>
                  <div className="gold-rule-thin my-3" />
                  <Link href={`/academic/time-table/${branch.slug}`} className="doc-link mb-0">
                    <i className="bi bi-file-earmark-pdf-fill" />
                    <span className="flex-grow-1">Download Time-Table (PDF)</span>
                    <i className="bi bi-arrow-right-short" />
                  </Link>
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
