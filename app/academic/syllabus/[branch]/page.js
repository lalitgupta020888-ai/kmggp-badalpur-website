"use client";

import React, { use } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';
import { getSyllabus } from '@/lib/syllabus';

export default function BranchSyllabus({ params }) {
  const { branch } = use(params);
  const syllabus = getSyllabus(branch);

  if (!syllabus) notFound();

  return (
    <>
      <PageHeader
        icon={syllabus.icon}
        eyebrow="Academics"
        title={`${syllabus.name} Syllabus`}
        subtitle={syllabus.tagline}
        crumbs={[
          { label: 'Academics' },
          { label: 'Syllabus', href: '/academic/syllabus' },
          { label: syllabus.short },
        ]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={7}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className={`bi ${syllabus.icon}`} />
                  About the Programme
                </div>
                <div className="panel-body">
                  <p className="lead">{syllabus.intro}</p>
                  <p>{syllabus.structure}</p>
                </div>
              </div>
            </Col>

            <Col lg={5}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-bullseye" />
                  Core Focus Areas
                </div>
                <div className="panel-body">
                  <ul className="gold-list">
                    {syllabus.focus.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>
          </Row>

          <SectionHead
            eyebrow="Download Centre"
            icon="bi-download"
            title={syllabus.downloadsTitle}
            subtitle={syllabus.downloadsNote}
          />

          <div className="panel">
            <div className="panel-header">
              <i className="bi bi-journal-bookmark-fill" />
              {syllabus.name}
            </div>
            <div className="panel-body">
              {syllabus.years.map((year) => (
                <div className="syllabus-year" key={year.key}>
                  <div>
                    <h6 className="syllabus-year-title">{year.title}</h6>
                    <p className="syllabus-year-note">{year.note}</p>
                  </div>
                  {/* Listed either way — a paper with no document yet still
                      tells the reader what the scheme covers. */}
                  {year.file ? (
                    <a
                      className="btn-gold"
                      href={year.file}
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
              Syllabus documents are updated whenever BTEUP revises the curriculum. Always verify the
              session year printed on the document before use.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
