"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';

const VALUES = [
  {
    icon: 'bi-lightbulb-fill',
    title: 'Academic Excellence',
    text: 'A rigorous, industry-aligned curriculum delivered by experienced and dedicated faculty.',
  },
  {
    icon: 'bi-gender-female',
    title: 'Women Empowerment',
    text: 'A campus built exclusively for young women to learn, lead and thrive with confidence.',
  },
  {
    icon: 'bi-tools',
    title: 'Practical Learning',
    text: 'Laboratory-led teaching that turns theory into demonstrable, employable skill.',
  },
  {
    icon: 'bi-heart-fill',
    title: 'Ethics & Values',
    text: 'Integrity, discipline and social responsibility woven through campus life.',
  },
];

const MILESTONES = [
  {
    title: 'Established in 2002 by the Government of Uttar Pradesh',
    text: 'Founded to widen access to technical education for women across Gautam Buddha Nagar and beyond.',
  },
  {
    title: 'A 7.3-Acre Campus at Badalpur',
    text: 'Academic blocks, laboratories, the library, hostel and playgrounds spread across 7.3 acres of green campus.',
  },
  {
    title: 'Approved by AICTE',
    text: 'All diploma programmes run under the approval of the All India Council for Technical Education, New Delhi.',
  },
  {
    title: 'Affiliated to BTEUP',
    text: 'All diploma programmes follow the curriculum prescribed by the Board of Technical Education, Uttar Pradesh.',
  },
  {
    title: 'Three Engineering Disciplines',
    text: 'Electronics Engineering, Computer Science & Engineering and Information Technology, with 75 seats each.',
  },
  {
    title: 'A Growing Placement Network',
    text: 'Strong ties with leading recruiters supported by a dedicated Training & Placement cell.',
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        icon="bi-buildings-fill"
        eyebrow="Know the Institute"
        title="About Km. Mayawati Government Girls Polytechnic, Badalpur"
        subtitle="A premier government polytechnic dedicated to empowering women through excellence in technical education."
        crumbs={[{ label: 'About Us' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-5 align-items-start">
            <Col lg={7}>
              <SectionHead
                align="start"
                eyebrow="Our Story"
                icon="bi-bookmark-star-fill"
                title="Education That Opens Doors"
              />
              <p className="lead">
                Km. Mayawati Government Girls Polytechnic, Badalpur, Gautam Buddha Nagar is a premier
                technical institution established in 2002 by the Government of Uttar Pradesh to
                promote technical education among women. Spread over 7.3 acres, its diploma
                programmes are approved by AICTE, New Delhi and affiliated to BTEUP, Lucknow.
              </p>
              <p>
                Our goal is to foster an environment of academic excellence, innovation and holistic
                development. The institute offers diploma courses across several engineering
                disciplines, supported by state-of-the-art infrastructure and highly experienced
                faculty who mentor every student individually.
              </p>
              <p>
                Beyond the classroom, students take part in technical clubs, cultural festivals,
                sports and community initiatives — building the confidence and character that employers
                value as highly as technical skill.
              </p>

              <div className="callout mt-4">
                <i className="bi bi-quote" />
                <p>
                  <strong>Our vision</strong> is to empower young women with technical skills,
                  leadership qualities and ethical values, enabling them to excel in a competitive
                  global landscape.
                </p>
              </div>
            </Col>

            <Col lg={5}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-flag-fill" />
                  Vision &amp; Mission
                </div>
                <div className="panel-body">
                  <h5 className="fw-bold mb-2">
                    <i className="bi bi-eye-fill text-gold me-2" />
                    Vision
                  </h5>
                  <p className="small">
                    To be recognised as a centre of excellence in technical education for women,
                    producing skilled professionals who lead with competence and integrity.
                  </p>

                  <div className="gold-rule-thin my-4" />

                  <h5 className="fw-bold mb-3">
                    <i className="bi bi-bullseye text-gold me-2" />
                    Mission
                  </h5>
                  <ul className="gold-list">
                    <li>Deliver a rigorous academic programme that fosters innovation and lifelong learning.</li>
                    <li>Build industry collaborations for practical exposure and better placements.</li>
                    <li>Provide a safe, inclusive campus where every student can realise her potential.</li>
                    <li>Instil ethical values, discipline and a sense of social responsibility.</li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="section" style={{ background: 'var(--paper)' }}>
        <Container>
          <SectionHead
            eyebrow="What We Stand For"
            icon="bi-gem"
            title="Our Core Values"
          />
          <Row className="g-4">
            {VALUES.map((value) => (
              <Col lg={3} md={6} key={value.title}>
                <div className="premium-card h-100 p-4 text-center">
                  <span className="icon-tile mx-auto mb-4">
                    <i className={`bi ${value.icon}`} />
                  </span>
                  <h5 className="fw-bold mb-3">{value.title}</h5>
                  <p className="small mb-0">{value.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-5">
            <Col lg={6}>
              <SectionHead
                align="start"
                eyebrow="At a Glance"
                icon="bi-clock-history"
                title="Institute Milestones"
              />
              <ul className="timeline mt-4">
                {MILESTONES.map((item) => (
                  <li key={item.title}>
                    <h6>{item.title}</h6>
                    <p>{item.text}</p>
                  </li>
                ))}
              </ul>
            </Col>

            <Col lg={6}>
              {/* No h-100 here — this panel has a sibling below it, and
                  stretching it to the full column height would push the
                  "More About the Institute" panel off the section. */}
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-info-circle-fill" />
                  Institute Profile
                </div>
                <div className="panel-body">
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-bank" />
                    </span>
                    <div>
                      <div className="label">Established By</div>
                      <p className="value">Government of Uttar Pradesh, in 2002</p>
                    </div>
                  </div>
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-rulers" />
                    </span>
                    <div>
                      <div className="label">Campus Area</div>
                      <p className="value">7.3 acres</p>
                    </div>
                  </div>
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-award-fill" />
                    </span>
                    <div>
                      <div className="label">Approval</div>
                      <p className="value">
                        All India Council for Technical Education (AICTE), New Delhi
                      </p>
                    </div>
                  </div>
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-patch-check-fill" />
                    </span>
                    <div>
                      <div className="label">Affiliation</div>
                      <p className="value">Board of Technical Education, Uttar Pradesh (BTEUP)</p>
                    </div>
                  </div>
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-diagram-3-fill" />
                    </span>
                    <div>
                      <div className="label">Programmes</div>
                      <p className="value">3 diploma branches · 3 years each · 75 seats per branch</p>
                    </div>
                  </div>
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-geo-alt-fill" />
                    </span>
                    <div>
                      <div className="label">Location</div>
                      <p className="value">Badalpur, Gautam Buddha Nagar, Uttar Pradesh</p>
                    </div>
                  </div>

                  <div className="d-flex flex-wrap gap-3 mt-4">
                    <Link href="/admission/courses" className="btn-gold">
                      <i className="bi bi-collection-fill" />
                      Courses Offered
                    </Link>
                    <Link href="/contact" className="btn-outline-navy">
                      <i className="bi bi-envelope-fill" />
                      Contact Us
                    </Link>
                  </div>
                </div>
              </div>

              <div className="panel mt-4">
                <div className="panel-header">
                  <i className="bi bi-folder2-open" />
                  More About the Institute
                </div>
                <div className="panel-body">
                  <Link href="/about/vision-mission" className="doc-link">
                    <i className="bi bi-bullseye" />
                    Vision &amp; Mission
                    <i className="bi bi-arrow-right-short" />
                  </Link>
                  <Link href="/about/principal-message" className="doc-link">
                    <i className="bi bi-person-video2" />
                    Principal&apos;s Message
                    <i className="bi bi-arrow-right-short" />
                  </Link>
                  <Link href="/about/approvals" className="doc-link">
                    <i className="bi bi-patch-check-fill" />
                    Approvals by Statutory Bodies
                    <i className="bi bi-arrow-right-short" />
                  </Link>
                  <Link href="/about/aicte-approvals" className="doc-link mb-0">
                    <i className="bi bi-file-earmark-pdf-fill" />
                    AICTE Approval Letters
                    <i className="bi bi-arrow-right-short" />
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
