"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

const PRIORITIES = [
  {
    icon: 'bi-mortarboard-fill',
    title: 'Academic Rigour',
    text: 'Disciplined teaching, regular assessment and individual attention for every student.',
  },
  {
    icon: 'bi-tools',
    title: 'Practical Skill',
    text: 'Laboratory work and live projects that make classroom concepts tangible.',
  },
  {
    icon: 'bi-briefcase-fill',
    title: 'Career Readiness',
    text: 'Training, mentoring and placement support from the first semester onward.',
  },
  {
    icon: 'bi-shield-lock-fill',
    title: 'A Safe Campus',
    text: 'A secure, respectful environment where students can focus entirely on learning.',
  },
];

export default function PrincipalMessagePage() {
  return (
    <>
      <PageHeader
        icon="bi-person-video2"
        eyebrow="About the Institute"
        title="Principal's Message"
        subtitle="A word of welcome to our students, parents and visitors."
        crumbs={[{ label: 'About', href: '/about' }, { label: "Principal's Message" }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={4}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-person-badge-fill" />
                  The Principal
                </div>
                <div className="panel-body text-center">
                  <span
                    className="quote-avatar mx-auto mb-3"
                    style={{ width: 120, height: 120, flex: '0 0 120px', fontSize: '2.6rem' }}
                  >
                    <i className="bi bi-person-fill" />
                  </span>
                  <h5 className="fw-bold mb-1">Principal</h5>
                  <span className="eyebrow">Km. Mayawati Government Girls Polytechnic, Badalpur</span>
                  <div className="gold-rule-thin my-3" />
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-envelope-fill" />
                    </span>
                    <div className="text-start">
                      <div className="label">Email</div>
                      <p className="value">principal@kmggp.ac.in</p>
                    </div>
                  </div>
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-telephone-fill" />
                    </span>
                    <div className="text-start">
                      <div className="label">Office</div>
                      <p className="value">+91 XXXXX XXXXX</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="side-cta mt-4">
                <i className="bi bi-chat-dots-fill side-cta-icon" />
                <h6>Want to Meet the Principal?</h6>
                <p>Appointments can be arranged through the institute office during working hours.</p>
                <Link href="/contact" className="btn-gold btn-sm">
                  Contact the Office
                  <i className="bi bi-arrow-right" />
                </Link>
              </div>
            </Col>

            <Col lg={8}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-chat-quote-fill" />
                  Message from the Principal
                </div>
                <div className="panel-body">
                  <div className="quote-card border-0 shadow-none p-0 mb-4" style={{ borderLeft: 'none' }}>
                    <span className="quote-mark">&rdquo;</span>
                    <p className="lead" style={{ fontStyle: 'italic' }}>
                      Education is the most powerful instrument a young woman can hold. Our purpose
                      here is to place that instrument firmly in her hands.
                    </p>
                  </div>

                  <div className="gold-rule-thin mb-4" />

                  <p>
                    It gives me great pleasure to welcome you to Km. Mayawati Government Girls
                    Polytechnic, Badalpur. Established in 2002 by the Government of Uttar Pradesh, this
                    institute exists for a clear and important reason — to make quality technical
                    education accessible to young women, and to help them build careers of
                    independence and dignity.
                  </p>

                  <p>
                    Over the years we have grown into a campus with modern laboratories, a rich
                    library and a committed faculty who know their students by name. Our diploma
                    programmes in Electronics Engineering, Computer Science &amp; Engineering and
                    Information Technology follow the BTEUP curriculum, but our teaching goes
                    further — we insist that every concept taught in the classroom is proved on a
                    workbench.
                  </p>

                  <p>
                    Equally important is what happens beyond academics. Through clubs, cultural
                    festivals, sports and community outreach, our students learn to speak with
                    confidence, work in teams and lead. Employers tell us these qualities matter as
                    much as technical knowledge, and our placement record reflects that.
                  </p>

                  <p>
                    To parents, I offer this assurance: your daughter will study in a safe,
                    disciplined and supportive environment where her progress is watched closely and
                    her wellbeing is taken seriously.
                  </p>

                  <p className="mb-0">
                    To our students — be curious, be diligent, and never underestimate what you are
                    capable of achieving. The institute and its faculty stand with you at every step
                    of your journey.
                  </p>

                  <div className="quote-author mt-4">
                    <span className="quote-avatar">
                      <i className="bi bi-pen-fill" />
                    </span>
                    <div>
                      <div className="quote-name">Principal</div>
                      <div className="quote-meta">
                        Km. Mayawati Government Girls Polytechnic, Badalpur
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel mt-4">
                <div className="panel-header">
                  <i className="bi bi-list-stars" />
                  Our Priorities
                </div>
                <div className="panel-body">
                  <Row className="g-3">
                    {PRIORITIES.map((item) => (
                      <Col md={6} key={item.title}>
                        <div className="feature-row h-100">
                          <span className="icon-tile icon-tile-sm">
                            <i className={`bi ${item.icon}`} />
                          </span>
                          <div>
                            <h5>{item.title}</h5>
                            <p>{item.text}</p>
                          </div>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
