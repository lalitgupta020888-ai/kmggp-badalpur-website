"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

const ACADEMIC_CALENDAR_FILE = '/documents/academic-calendar-2026-27.pdf';

const ODD_SEMESTER = [
  { icon: 'bi-play-circle-fill', event: 'Odd Semester Classes Begin', date: 'July 2026' },
  { icon: 'bi-pencil-square', event: 'Mid Semester Examinations', date: 'October 2026' },
  { icon: 'bi-journal-check', event: 'Practical Examinations', date: 'November 2026' },
  { icon: 'bi-mortarboard-fill', event: 'Odd Semester Theory Examinations', date: 'November 2026' },
];

const EVEN_SEMESTER = [
  { icon: 'bi-play-circle-fill', event: 'Even Semester Classes Begin', date: 'January 2027' },
  { icon: 'bi-pencil-square', event: 'Mid Semester Examinations', date: 'March 2027' },
  { icon: 'bi-journal-check', event: 'Practical Examinations', date: 'April 2027' },
  { icon: 'bi-mortarboard-fill', event: 'Even Semester Theory Examinations', date: 'May 2027' },
];

function SemesterPanel({ title, icon, rows }) {
  return (
    <div className="panel h-100">
      <div className="panel-header">
        <i className={`bi ${icon}`} />
        {title}
      </div>
      <div className="panel-body p-0">
        <div className="table-wrap">
          <table className="premium-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>Schedule</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.event}>
                  <td>
                    <i className={`bi ${row.icon} text-gold me-2`} />
                    {row.event}
                  </td>
                  <td>{row.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function AcademicCalendar() {
  return (
    <>
      <PageHeader
        icon="bi-calendar3"
        eyebrow="Academics"
        title="Academic Calendar 2026-27"
        subtitle="Key dates for the odd and even semesters, examinations and institute activities."
        crumbs={[{ label: 'Academics' }, { label: 'Academic Calendar' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={6}>
              <SemesterPanel title="Odd Semester (I, III, V)" icon="bi-calendar-week-fill" rows={ODD_SEMESTER} />
            </Col>
            <Col lg={6}>
              <SemesterPanel title="Even Semester (II, IV, VI)" icon="bi-calendar-range-fill" rows={EVEN_SEMESTER} />
            </Col>
          </Row>

          <div className="download-note mt-4">
            <p>
              The complete academic calendar for the session 2026-27, as notified by the Board of
              Technical Education, Uttar Pradesh (BTEUP), is available for download.
            </p>
            <a
              className="btn-gold"
              href={ACADEMIC_CALENDAR_FILE}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-file-earmark-pdf-fill" />
              Download Academic Calendar
            </a>
          </div>

          <div className="callout mt-4">
            <i className="bi bi-info-circle-fill" />
            <p>
              Dates are indicative and follow the schedule notified by the Board of Technical
              Education, Uttar Pradesh (BTEUP). The final calendar and any revisions will be published
              on this page and on the institute notice board.
            </p>
          </div>

          <Row className="g-4 mt-1">
            <Col md={4}>
              <Link href="/academic/holidays" className="premium-card h-100 p-4 d-block text-decoration-none">
                <span className="icon-tile mb-3">
                  <i className="bi bi-calendar-event" />
                </span>
                <h5 className="fw-bold mb-2">List of Holidays</h5>
                <p className="small mb-0">The official holiday calendar for the current session.</p>
              </Link>
            </Col>
            <Col md={4}>
              <Link href="/academic/syllabus" className="premium-card h-100 p-4 d-block text-decoration-none">
                <span className="icon-tile mb-3">
                  <i className="bi bi-journal-bookmark" />
                </span>
                <h5 className="fw-bold mb-2">Syllabus</h5>
                <p className="small mb-0">Branch-wise syllabus as prescribed by BTEUP.</p>
              </Link>
            </Col>
            <Col md={4}>
              <Link href="/admission/courses" className="premium-card h-100 p-4 d-block text-decoration-none">
                <span className="icon-tile mb-3">
                  <i className="bi bi-collection" />
                </span>
                <h5 className="fw-bold mb-2">Courses Offered</h5>
                <p className="small mb-0">Programmes, duration and sanctioned intake.</p>
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
