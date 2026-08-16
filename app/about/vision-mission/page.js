import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';
import { getSection } from '@/lib/server/sections';




export default async function VisionMissionPage() {
  const page = await getSection('page-vision-mission');
  const MISSION = (page.mission || []).map((item) => item.text);
  const OBJECTIVES = page.objectives || [];
  const VALUES = page.values || [];

  return (
    <>
      <PageHeader
        icon="bi-bullseye"
        eyebrow="About the Institute"
        title="Vision &amp; Mission"
        subtitle="The purpose that guides every decision we take at Km. Mayawati Government Girls Polytechnic, Badalpur."
        crumbs={[{ label: 'About', href: '/about' }, { label: 'Vision & Mission' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={6}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-eye-fill" />
                  Our Vision
                </div>
                <div className="panel-body">
                  <span className="icon-tile mb-4">
                    <i className="bi bi-eye-fill" />
                  </span>
                  <p className="lead">{page.vision}</p>
                  <div className="gold-rule-thin my-4" />
                  <p className="mb-0">
                    We aspire to a campus where every young woman, regardless of her background,
                    finds the opportunity, mentorship and confidence to build a technical career on
                    her own terms.
                  </p>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-bullseye" />
                  Our Mission
                </div>
                <div className="panel-body">
                  <span className="icon-tile mb-4">
                    <i className="bi bi-flag-fill" />
                  </span>
                  <ul className="gold-list mb-0">
                    {MISSION.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
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
            eyebrow="What We Work Towards"
            icon="bi-compass-fill"
            title="Institutional Objectives"
          />
          <Row className="g-4">
            {OBJECTIVES.map((objective) => (
              <Col lg={3} md={6} key={objective.title}>
                <div className="premium-card h-100 p-4 text-center">
                  <span className="icon-tile mx-auto mb-4">
                    <i className={`bi ${objective.icon}`} />
                  </span>
                  <h5 className="fw-bold mb-3">{objective.title}</h5>
                  <p className="small mb-0">{objective.text}</p>
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
                eyebrow="Quality Policy"
                icon="bi-award-fill"
                title="Our Commitment to Quality"
              />
              <div className="callout">
                <i className="bi bi-quote" />
                <p>
                  Km. Mayawati Government Girls Polytechnic, Badalpur is committed to imparting
                  quality technical education through a qualified faculty, well-equipped
                  laboratories and a disciplined academic environment — continually improving its
                  systems to meet the evolving expectations of students, industry and society.
                </p>
              </div>

              <p className="mt-4">
                This policy is reviewed periodically by the institute administration and guides our
                academic planning, laboratory upgrades, faculty development and student support
                services throughout the year.
              </p>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link href="/about/principal-message" className="btn-gold">
                  <i className="bi bi-person-video2" />
                  Principal&apos;s Message
                </Link>
                <Link href="/about/approvals" className="btn-outline-navy">
                  <i className="bi bi-patch-check-fill" />
                  Statutory Approvals
                </Link>
              </div>
            </Col>

            <Col lg={5}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-gem" />
                  Core Values
                </div>
                <div className="panel-body">
                  <Row className="g-3">
                    {VALUES.map((value) => (
                      <Col sm={6} key={value.label}>
                        <div className="feature-row align-items-center h-100">
                          <span className="icon-tile icon-tile-sm">
                            <i className={`bi ${value.icon}`} />
                          </span>
                          <h5 className="mb-0">{value.label}</h5>
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
