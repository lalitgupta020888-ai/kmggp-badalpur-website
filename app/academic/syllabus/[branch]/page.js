import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';
import { getSyllabusFor } from '@/lib/server/syllabus';

export default async function BranchSyllabus({ params }) {
  const { branch } = await params;
  const syllabus = await getSyllabusFor(branch);

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
                  <i className={`bi ${syllabus.icon}`} aria-hidden="true" />
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
                  <i className="bi bi-bullseye" aria-hidden="true" />
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
              <i className="bi bi-journal-bookmark-fill" aria-hidden="true" />
              {syllabus.name}
            </div>
            <div className="panel-body">
              {syllabus.years.map((year) => (
                <div className="syllabus-year" key={year.key}>
                  <div>
                    <h4 className="h6 syllabus-year-title">{year.title}</h4>
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
                      <i className="bi bi-file-earmark-pdf-fill" aria-hidden="true" />
                      Download Here
                    </a>
                  ) : (
                    <span className="btn-awaited">
                      <i className="bi bi-hourglass-split" aria-hidden="true" />
                      Awaited
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="callout mt-4">
            <i className="bi bi-info-circle-fill" aria-hidden="true" />
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
