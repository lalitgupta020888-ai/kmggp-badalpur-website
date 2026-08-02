"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';

const COURSES = [
  {
    icon: 'bi-cpu-fill',
    name: 'Diploma in Electronics Engineering',
    short: 'Electronics Engineering',
    duration: '3 Years (6 Semesters)',
    intake: 60,
    href: '/department/electronics',
    text: 'Analog and digital circuits, microprocessors, communication systems and embedded design.',
  },
  {
    icon: 'bi-pc-display',
    name: 'Diploma in Computer Science & Engineering',
    short: 'Computer Science & Engineering',
    duration: '3 Years (6 Semesters)',
    intake: 60,
    href: '/department/cse',
    text: 'Programming, data structures, databases, operating systems and software development.',
  },
  {
    icon: 'bi-hdd-network-fill',
    name: 'Diploma in Information Technology',
    short: 'Information Technology',
    duration: '3 Years (6 Semesters)',
    intake: 60,
    href: '/department/it',
    text: 'Computer networks, web technologies, cloud fundamentals and IT infrastructure.',
  },
];

export default function CoursesOffered() {
  return (
    <>
      <PageHeader
        icon="bi-collection"
        eyebrow="Admissions"
        title="Courses Offered"
        subtitle="Three-year diploma programmes approved by AICTE and affiliated to BTEUP, Uttar Pradesh."
        crumbs={[{ label: 'Admissions' }, { label: 'Courses Offered' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <SectionHead
            eyebrow="Our Programmes"
            icon="bi-mortarboard-fill"
            title="Choose Your Engineering Discipline"
            subtitle="Each programme combines a rigorous curriculum with extensive laboratory practice."
          />

          <Row className="g-4">
            {COURSES.map((course) => (
              <Col lg={4} md={6} key={course.name}>
                <div className="premium-card h-100 p-4 d-flex flex-column">
                  <span className="icon-tile mb-4">
                    <i className={`bi ${course.icon}`} />
                  </span>
                  <h5 className="fw-bold mb-3">{course.short}</h5>
                  <p className="small flex-grow-1">{course.text}</p>
                  <div className="gold-rule-thin my-3" />
                  <div className="d-flex justify-content-between small fw-semibold text-primary-blue mb-3">
                    <span>
                      <i className="bi bi-hourglass-split text-gold me-1" />
                      {course.duration.split(' (')[0]}
                    </span>
                    <span>
                      <i className="bi bi-people-fill text-gold me-1" />
                      {course.intake} Seats
                    </span>
                  </div>
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
                    {COURSES.map((course) => (
                      <tr key={course.name}>
                        <td>
                          <i className={`bi ${course.icon} text-gold me-2`} />
                          {course.name}
                        </td>
                        <td>{course.duration}</td>
                        <td>{course.intake}</td>
                        <td>Class 10th passed (min. 35%)</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
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
