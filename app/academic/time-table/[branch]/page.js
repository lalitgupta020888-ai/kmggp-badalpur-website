"use client";

import React, { use } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';
import { getTimetable, PERIODS, NOTES } from '@/lib/timetable';

export default function BranchTimeTable({ params }) {
  const { branch } = use(params);
  const timetable = getTimetable(branch);

  if (!timetable) notFound();

  return (
    <>
      <PageHeader
        icon={timetable.icon}
        eyebrow="Academics"
        title={`${timetable.name} Time-Table`}
        subtitle={timetable.tagline}
        crumbs={[
          { label: 'Academics' },
          { label: 'Time-Table', href: '/academic/time-table' },
          { label: timetable.short },
        ]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-4">
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
                  <p className="small">{timetable.structure}</p>
                  <div className="gold-rule-thin my-3" />
                  <ul className="gold-list mb-0">
                    {NOTES.map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>
          </Row>

          <SectionHead
            eyebrow="Download Centre"
            icon="bi-download"
            title="Semester-wise Time-Table"
            subtitle="Download the weekly class and laboratory schedule for each running semester."
          />

          <div className="panel">
            <div className="panel-header">
              <i className="bi bi-calendar3-week-fill" />
              {timetable.name}
            </div>
            <div className="panel-body">
              {timetable.semesters.map((semester) => (
                <div className="syllabus-year" key={semester.key}>
                  <div>
                    <h6 className="syllabus-year-title">
                      {semester.title}
                      <span className="year-semesters">{semester.year}</span>
                    </h6>
                    <p className="syllabus-year-note">{semester.note}</p>
                  </div>
                  {/* Listed either way — a semester with no document published
                      yet still tells the reader how its week is shaped. */}
                  {semester.file ? (
                    <a
                      className="btn-gold"
                      href={semester.file}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <i className="bi bi-file-earmark-pdf-fill" />
                      Download Here
                    </a>
                  ) : (
                    <span className="btn-awaited">
                      <i className="bi bi-hourglass-split" />
                      Awaited
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="callout mt-4">
            <i className="bi bi-info-circle-fill" />
            <p>
              The time-table is revised at the start of every semester. Always check the session and
              semester printed on the document before following it.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
