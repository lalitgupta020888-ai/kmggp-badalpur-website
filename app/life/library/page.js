"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';

const STATS = [
  { icon: 'bi-journals', value: '8,000+', label: 'Books & Volumes' },
  { icon: 'bi-newspaper', value: '25+', label: 'Journals & Magazines' },
  { icon: 'bi-people-fill', value: '80', label: 'Reading Hall Seats' },
  { icon: 'bi-pc-display', value: '10', label: 'Digital Terminals' },
];

const SECTIONS = [
  {
    icon: 'bi-book-half',
    title: 'Text Book Section',
    text: 'Prescribed BTEUP textbooks for all three branches, available in multiple copies for issue.',
  },
  {
    icon: 'bi-journals',
    title: 'Reference Section',
    text: 'Handbooks, encyclopaedias, technical dictionaries and standards for in-library consultation.',
  },
  {
    icon: 'bi-newspaper',
    title: 'Periodicals & Newspapers',
    text: 'Daily newspapers, technical magazines and journals covering current developments.',
  },
  {
    icon: 'bi-laptop-fill',
    title: 'Digital Library',
    text: 'Computer terminals with internet access for e-books, online lectures and e-journals.',
  },
  {
    icon: 'bi-file-earmark-text-fill',
    title: 'Question Bank',
    text: 'Previous years’ BTEUP question papers and model answers organised branch-wise.',
  },
  {
    icon: 'bi-briefcase-fill',
    title: 'Competitive Exam Corner',
    text: 'Material for aptitude tests, government recruitment examinations and higher studies.',
  },
];

const RULES = [
  'A valid library card is required to enter and to issue any book.',
  'Students may issue up to two books at a time for a period of fourteen days.',
  'Reference books, journals and newspapers are for reading inside the library only.',
  'Books may be renewed once, provided there is no pending reservation.',
  'A late fee is charged for each day a book is retained beyond the due date.',
  'Lost or damaged books must be replaced, or their cost paid as assessed by the librarian.',
  'Silence must be maintained in the reading hall at all times.',
  'Library clearance is required before appearing for the final examination and at the time of leaving.',
];

const SERVICES = [
  { icon: 'bi-search', label: 'Book search and reservation assistance' },
  { icon: 'bi-printer-fill', label: 'Photocopy facility for permitted material' },
  { icon: 'bi-bell-fill', label: 'New arrival notifications on the notice board' },
  { icon: 'bi-mortarboard-fill', label: 'Reading support during examination periods' },
];

export default function LibraryPage() {
  return (
    <>
      <PageHeader
        icon="bi-book-half"
        eyebrow="Life @ KMGGP"
        title="Library"
        subtitle="A quiet, well-stocked centre of learning supporting every branch and every semester."
        crumbs={[{ label: 'Life@KMGGP', href: '/life' }, { label: 'Library' }]}
      />

      <section className="stat-strip">
        <Container>
          <Row className="g-0">
            {STATS.map((stat) => (
              <Col md={3} sm={6} key={stat.label}>
                <div className="stat-item">
                  <i className={`bi ${stat.icon}`} />
                  <div className="stat-value">{stat.value}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-5 align-items-start">
            <Col lg={7}>
              <SectionHead
                align="start"
                eyebrow="Centre of Learning"
                icon="bi-book-half"
                title="The Institute Library"
              />
              <p className="lead">
                The library is the academic heart of the campus — a calm, well-lit space where
                students read, revise and research through every semester of the diploma.
              </p>
              <p>
                Our collection covers the complete BTEUP curriculum for Electronics Engineering,
                Computer Science &amp; Engineering and Information Technology, supported by reference
                works, technical journals, previous years&apos; question papers and material for
                competitive examinations.
              </p>
              <p>
                A digital section with internet-enabled terminals gives students access to e-books,
                online lectures and e-journals, extending the collection well beyond the shelves.
              </p>
            </Col>

            <Col lg={5}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-clock-fill" />
                  Library Timings
                </div>
                <div className="panel-body">
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-calendar-week-fill" />
                    </span>
                    <div>
                      <div className="label">Monday – Friday</div>
                      <p className="value">9:00 AM – 5:00 PM</p>
                    </div>
                  </div>
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-calendar-event" />
                    </span>
                    <div>
                      <div className="label">Saturday</div>
                      <p className="value">9:00 AM – 1:00 PM</p>
                    </div>
                  </div>
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-journal-check" />
                    </span>
                    <div>
                      <div className="label">Book Issue &amp; Return</div>
                      <p className="value">10:00 AM – 4:00 PM on working days</p>
                    </div>
                  </div>
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-person-badge-fill" />
                    </span>
                    <div>
                      <div className="label">Librarian</div>
                      <p className="value">library@kmggp.ac.in</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel mt-4">
                <div className="panel-header">
                  <i className="bi bi-stars" />
                  Library Services
                </div>
                <div className="panel-body">
                  {SERVICES.map((service) => (
                    <div className="feature-row align-items-center mb-3" key={service.label}>
                      <span className="icon-tile icon-tile-sm">
                        <i className={`bi ${service.icon}`} />
                      </span>
                      <h5 className="mb-0">{service.label}</h5>
                    </div>
                  ))}
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section" style={{ background: 'var(--paper)' }}>
        <Container>
          <SectionHead
            eyebrow="Collection"
            icon="bi-grid-3x3-gap-fill"
            title="Sections of the Library"
          />
          <Row className="g-4">
            {SECTIONS.map((section) => (
              <Col lg={4} md={6} key={section.title}>
                <div className="premium-card h-100 p-4">
                  <span className="icon-tile mb-4">
                    <i className={`bi ${section.icon}`} />
                  </span>
                  <h5 className="fw-bold mb-3">{section.title}</h5>
                  <p className="small mb-0">{section.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={7}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-clipboard-check-fill" />
                  Library Rules
                </div>
                <div className="panel-body">
                  <ul className="gold-list mb-0">
                    {RULES.map((rule) => (
                      <li key={rule}>{rule}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>

            <Col lg={5}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-download" />
                  Useful Downloads
                </div>
                <div className="panel-body">
                  <a href="#" className="doc-link">
                    <i className="bi bi-file-earmark-pdf-fill" />
                    Library Book Catalogue (PDF)
                    <i className="bi bi-arrow-right-short" />
                  </a>
                  <a href="#" className="doc-link">
                    <i className="bi bi-file-earmark-text-fill" />
                    Previous Year Question Papers
                    <i className="bi bi-arrow-right-short" />
                  </a>
                  <Link href="/academic/syllabus" className="doc-link mb-0">
                    <i className="bi bi-journal-bookmark" />
                    Branch-wise Syllabus
                    <i className="bi bi-arrow-right-short" />
                  </Link>
                </div>
              </div>

              <div className="side-cta mt-4">
                <i className="bi bi-headset side-cta-icon" />
                <h6>Need a Book We Don&apos;t Have?</h6>
                <p>Suggest a title to the librarian — acquisition requests are reviewed each session.</p>
                <Link href="/contact" className="btn-gold btn-sm">
                  Contact the Librarian
                  <i className="bi bi-arrow-right" />
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
