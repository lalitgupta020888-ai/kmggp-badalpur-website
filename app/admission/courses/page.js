"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';
import {
  PROGRAMMES,
  LATERAL_PROGRAMMES,
  LATERAL_INTAKE,
  TOTAL_INTAKE,
  TOTAL_LATERAL,
  TOTAL_SEATS,
} from '@/lib/programmes';

/**
 * Lateral entry admits the three engineering branches under JEECUP Group K,
 * straight into the third semester, on seats supernumerary to the sanctioned
 * first-year intake. The one year PG diploma has no second year to enter, so it
 * is absent from every Group K listing on this page.
 */
const LATERAL_ELIGIBILITY = [
  'Class 12 (Intermediate) passed with Science and Mathematics, minimum 35% marks.',
  'Or Class 12 passed with a vocational or technical subject relevant to the branch.',
  'Or a two-year ITI course, after Class 10, in a trade related to the branch.',
  'Qualified in the JEECUP entrance examination under Group K.',
];

const LATERAL_POINTS = [
  { icon: 'bi-box-arrow-in-right', label: 'Entry Point', value: 'Third semester (second year)' },
  { icon: 'bi-hourglass-split', label: 'Duration', value: '2 Years (4 Semesters)' },
  {
    icon: 'bi-people-fill',
    label: 'Seats',
    value: `${LATERAL_INTAKE} per branch — supernumerary, as per AICTE norms`,
  },
  { icon: 'bi-diagram-3-fill', label: 'JEECUP Group', value: 'Group K' },
];

export default function CoursesOffered() {
  return (
    <>
      <PageHeader
        icon="bi-collection"
        eyebrow="Admissions"
        title="Courses Offered"
        subtitle="Four programmes approved by AICTE and affiliated to BTEUP, Uttar Pradesh — three diploma branches with lateral entry into the second year, and a one year post graduate diploma."
        crumbs={[{ label: 'Admissions' }, { label: 'Courses Offered' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <SectionHead
            eyebrow="Our Programmes"
            icon="bi-mortarboard-fill"
            title="Four Disciplines, One Standard of Excellence"
            subtitle="Each programme combines a rigorous curriculum with extensive laboratory practice."
          />

          {/* Four across on the widest screens, two up from md — the fourth
              card must never be left stranded alone on a row of its own. */}
          <Row className="g-4">
            {PROGRAMMES.map((course) => (
              <Col xl={3} md={6} key={course.name}>
                <div className="premium-card course-card h-100 p-4 d-flex flex-column">
                  <span className="course-level">{course.level}</span>
                  <span className="icon-tile mb-4">
                    <i className={`bi ${course.icon}`} />
                  </span>
                  <h5 className="fw-bold mb-3">{course.short}</h5>
                  <p className="small flex-grow-1">{course.text}</p>
                  <div className="gold-rule-thin my-3" />
                  <div className="d-flex justify-content-between small fw-semibold text-primary-blue mb-2">
                    <span>
                      <i className="bi bi-hourglass-split text-gold me-1" />
                      {course.years}
                    </span>
                    <span>
                      <i className="bi bi-people-fill text-gold me-1" />
                      {course.intake} Seats
                    </span>
                  </div>
                  {/* Held to a fixed height whether or not the programme takes
                      lateral entry, so the buttons below stay on one line. */}
                  <p className="course-lateral small mb-3">
                    {course.lateral ? (
                      <>
                        <i className="bi bi-box-arrow-in-right text-gold me-1" />
                        {course.lateral} lateral entry seats
                      </>
                    ) : (
                      <span className="course-lateral-none">No lateral entry</span>
                    )}
                  </p>
                  <Link href={course.href} className="btn-outline-navy justify-content-center">
                    Visit Department
                    <i className="bi bi-arrow-right" />
                  </Link>
                </div>
              </Col>
            ))}
          </Row>

          <div className="panel mt-5">
            <div className="panel-header">
              <i className="bi bi-table" />
              Programme Summary
            </div>
            <div className="panel-body p-0">
              <div className="table-wrap">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Course Name</th>
                      <th>Duration</th>
                      <th>Sanctioned Intake</th>
                      <th>Eligibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    {PROGRAMMES.map((course) => (
                      <tr key={course.name}>
                        <td>
                          <i className={`bi ${course.icon} text-gold me-2`} />
                          {course.name}
                        </td>
                        <td>{course.duration}</td>
                        <td>{course.intake}</td>
                        <td>{course.eligibility}</td>
                      </tr>
                    ))}
                    {LATERAL_PROGRAMMES.map((course) => (
                      <tr key={`${course.name}-lateral`}>
                        <td>
                          <i className={`bi ${course.icon} text-gold me-2`} />
                          {course.name}
                          <span className="badge-group">Lateral Entry</span>
                        </td>
                        <td>2 Years (4 Semesters)</td>
                        <td>{course.lateral}</td>
                        <td>Class 12th with Science &amp; Maths, or 2-year ITI</td>
                      </tr>
                    ))}
                  </tbody>
                  {/* The figure every parent scrolls for. Totalled from the
                      rows above rather than typed, so it cannot fall behind
                      them. */}
                  <tfoot>
                    <tr className="table-total">
                      <td>
                        <i className="bi bi-people-fill text-gold me-2" />
                        Total Seats
                      </td>
                      <td>—</td>
                      <td>
                        {TOTAL_SEATS}
                        <span className="table-total-note">
                          {TOTAL_INTAKE} sanctioned + {TOTAL_LATERAL} lateral
                        </span>
                      </td>
                      <td>—</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          </div>

          <div className="panel mt-4">
            <div className="panel-header">
              <i className="bi bi-box-arrow-in-right" />
              Lateral Entry (Group K) — Direct Admission to the Second Year
            </div>
            <div className="panel-body">
              <p className="lead">
                All three diploma branches above admit lateral entry candidates on{' '}
                <strong>{LATERAL_INTAKE} seats each</strong>. If you have passed Class 12 with
                Science and Mathematics, or a two-year ITI, you can join the diploma directly in the
                third semester and complete it in two years.
              </p>

              <Row className="g-3 mt-1">
                {LATERAL_POINTS.map((point) => (
                  <Col md={6} xl={3} key={point.label}>
                    <div className="premium-card h-100 p-4">
                      <span className="icon-tile icon-tile-sm mb-3">
                        <i className={`bi ${point.icon}`} />
                      </span>
                      <p className="small text-uppercase fw-bold mb-1 text-primary-blue">
                        {point.label}
                      </p>
                      <p className="small mb-0">{point.value}</p>
                    </div>
                  </Col>
                ))}
              </Row>

              <div className="gold-rule-thin my-4" />

              <Row className="g-4">
                <Col lg={7}>
                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-patch-check-fill text-gold me-2" />
                    Lateral Entry Eligibility
                  </h5>
                  <ul className="gold-list">
                    {LATERAL_ELIGIBILITY.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>

                  <div className="seat-matrix">
                    {LATERAL_PROGRAMMES.map((course) => (
                      <div className="seat-matrix-item" key={course.slug}>
                        <i className={`bi ${course.icon}`} />
                        <span className="seat-matrix-count">{course.lateral}</span>
                        <span className="seat-matrix-label">{course.short}</span>
                      </div>
                    ))}
                    <div className="seat-matrix-item is-total">
                      <i className="bi bi-box-arrow-in-right" />
                      <span className="seat-matrix-count">{TOTAL_LATERAL}</span>
                      <span className="seat-matrix-label">Total Lateral Seats</span>
                    </div>
                  </div>
                </Col>

                <Col lg={5}>
                  <div className="callout">
                    <i className="bi bi-info-circle-fill" />
                    <p>
                      Lateral entry seats are filled through JEECUP counselling under Group K. The
                      full eligibility table for every group is on the{' '}
                      <Link href="/counselling/eligibility">Groupwise Eligibility</Link> page.
                    </p>
                  </div>

                  <div className="callout mt-3">
                    <i className="bi bi-mortarboard-fill" />
                    <p>
                      From the third semester onwards, the curriculum, examinations and diploma
                      awarded are identical for lateral entry and first-year students.
                    </p>
                  </div>
                </Col>
              </Row>
            </div>
          </div>

          <div className="callout mt-4">
            <i className="bi bi-info-circle-fill" />
            <p>
              Admission to all programmes is granted exclusively through the Joint Entrance
              Examination Council, Uttar Pradesh (JEECUP) counselling process.
            </p>
          </div>

          <div className="d-flex flex-wrap gap-3 mt-4">
            <Link href="/admission/process" className="btn-gold">
              <i className="bi bi-signpost-split" />
              View Admission Process
            </Link>
            <Link href="/admission/fee" className="btn-outline-navy">
              <i className="bi bi-cash-coin" />
              Fee Structure
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
