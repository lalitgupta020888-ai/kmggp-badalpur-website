"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';

const BRANCHES = [
  {
    slug: 'electronics',
    icon: 'bi-cpu-fill',
    name: 'Electronics Engineering',
    text: 'Circuit theory, digital electronics, microprocessors, communication systems and embedded design.',
  },
  {
    slug: 'cse',
    icon: 'bi-pc-display',
    name: 'Computer Science & Engineering',
    text: 'Programming fundamentals, data structures, databases, operating systems and software engineering.',
  },
  {
    slug: 'it',
    icon: 'bi-hdd-network-fill',
    name: 'Information Technology',
    text: 'Computer networks, web technologies, cloud fundamentals, cyber security and IT infrastructure.',
  },
];

const SEMESTERS = [
  'First & Second Semester (Common Curriculum)',
  'Third Semester — Branch Specialisation Begins',
  'Fourth Semester — Core Subjects & Laboratories',
  'Fifth Semester — Advanced Electives',
  'Sixth Semester — Major Project & Industrial Training',
];

export default function Syllabus() {
  return (
    <>
      <PageHeader
        icon="bi-journal-bookmark"
        eyebrow="Academics"
        title="Syllabus"
        subtitle="Branch-wise diploma syllabus as prescribed by the Board of Technical Education, Uttar Pradesh."
        crumbs={[{ label: 'Academics' }, { label: 'Syllabus' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <SectionHead
            eyebrow="Download Centre"
            icon="bi-download"
            title="Curriculum by Branch"
            subtitle="Select your branch to download the complete three-year diploma curriculum."
          />

          <Row className="g-4">
            {BRANCHES.map((branch) => (
              <Col lg={4} md={6} key={branch.name}>
                <div className="premium-card h-100 p-4 d-flex flex-column">
                  <span className="icon-tile mb-4">
                    <i className={`bi ${branch.icon}`} />
                  </span>
                  <h5 className="fw-bold mb-3">{branch.name}</h5>
                  <p className="small flex-grow-1">{branch.text}</p>
                  <div className="gold-rule-thin my-3" />
                  <Link href={`/academic/syllabus/${branch.slug}`} className="doc-link mb-0">
                    <i className="bi bi-file-earmark-pdf-fill" />
                    Download Syllabus (PDF)
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
                  <i className="bi bi-list-ol" />
                  Semester-wise Structure
                </div>
                <div className="panel-body">
                  <ul className="gold-list is-numbered">
                    {SEMESTERS.map((semester) => (
                      <li key={semester}>{semester}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>

            <Col lg={5}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-link-45deg" />
                  Reference Links
                </div>
                <div className="panel-body">
                  <a href="#" className="doc-link">
                    <i className="bi bi-globe2" />
                    BTEUP Official Website
                    <i className="bi bi-arrow-right-short" />
                  </a>
                  <a href="#" className="doc-link">
                    <i className="bi bi-file-earmark-ruled-fill" />
                    Examination Scheme
                    <i className="bi bi-arrow-right-short" />
                  </a>
                  <a href="#" className="doc-link mb-0">
                    <i className="bi bi-journals" />
                    Recommended Reading List
                    <i className="bi bi-arrow-right-short" />
                  </a>

                  <div className="callout mt-4">
                    <i className="bi bi-info-circle-fill" />
                    <p>
                      Syllabus documents are updated whenever BTEUP revises the curriculum. Always
                      verify the session year printed on the document before use.
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
