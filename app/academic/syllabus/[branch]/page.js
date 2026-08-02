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
                  <p>
                    The three-year diploma is delivered under the curriculum prescribed by the Board
                    of Technical Education, Uttar Pradesh. The first year is common to all
                    engineering and technology branches; specialisation begins in the second year and
                    concludes with a major project and industrial training in the final year.
                  </p>
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
            title="Year-wise Syllabus"
            subtitle="Download the official BTEUP syllabus document for each year of the diploma."
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
                  <a className="btn-gold" href={year.file} target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-file-earmark-pdf-fill" />
                    Download Here
                  </a>
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
