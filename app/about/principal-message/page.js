import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import { getSection } from '@/lib/server/sections';
import { paragraphs } from '@/lib/pages';

export default async function PrincipalMessagePage() {
  const page = await getSection('page-principal-message');
  const PRIORITIES = page.priorities || [];

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
                      <p className="value">{page.email}</p>
                    </div>
                  </div>
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-telephone-fill" />
                    </span>
                    <div className="text-start">
                      <div className="label">Office</div>
                      <p className="value">{page.phone}</p>
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
                      {page.quote}
                    </p>
                  </div>

                  <div className="gold-rule-thin mb-4" />

                  {paragraphs(page.body).map((text) => (
                    <p key={text.slice(0, 40)}>{text}</p>
                  ))}

                  <div className="quote-author mt-4">
                    <span className="quote-avatar">
                      <i className="bi bi-pen-fill" />
                    </span>
                    <div>
                      <div className="quote-name">{page.signatureName}</div>
                      <div className="quote-meta">{page.signatureRole}</div>
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
