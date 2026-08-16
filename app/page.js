import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { getHomeContent } from '@/lib/server/content';
import { getSections } from '@/lib/server/sections';
import HeroSlider from '@/components/HeroSlider';
import NoticeBoard from '@/components/NoticeBoard';
import NewsTicker from '@/components/NewsTicker';
import Leadership from '@/components/Leadership';
import PrincipalCard from '@/components/PrincipalCard';
import SectionHead from '@/components/SectionHead';
import GalleryMapBand from '@/components/GalleryMapBand';






export default async function Home() {
  // Every block on this page is admin-owned content, so the page reads it all
  // on the server and hands it down to the presentational components.
  const [{ ticker, notices, images }, sections] = await Promise.all([
    getHomeContent(),
    getSections([
      'hero-slides',
      'home-stats',
      'home-highlights',
      'home-pillars',
      'home-departments',
      'leadership',
      'leadership-heading',
      'principal-card',
      'testimonials',
      'recruiters',
      'institute',
    ]),
  ]);

  const STATS = sections['home-stats'];
  const HIGHLIGHTS = sections['home-highlights'];
  const PILLARS = sections['home-pillars'];
  const DEPARTMENTS = sections['home-departments'];
  const TESTIMONIALS = sections.testimonials;
  const RECRUITERS = sections.recruiters;

  return (
    <>
      <HeroSlider slides={sections['hero-slides']} />

      {/* Key figures */}
      <section className="stat-strip">
        <Container>
          <Row className="g-0">
            {/* Two up on a phone — stacked one per row the strip ran for most
                of a screen before the page even began. */}
            {STATS.map((stat) => (
              <Col key={stat.label} md={3} xs={6}>
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

      {/* Running announcements, straight under the figures */}
      <NewsTicker notices={ticker} />

      {/* Welcome + notice board */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-5">
            <Col lg={7}>
              <SectionHead
                align="start"
                eyebrow="Welcome to the Institute"
                icon="bi-buildings-fill"
                title="Km. Mayawati Government Girls Polytechnic, Badalpur"
              />

              {/* The campus itself, between the name and the prose */}
              <figure className="welcome-figure">
                <Image
                  src="/images/slider1.png"
                  alt="The academic block of Km. Mayawati Government Girls Polytechnic, Badalpur"
                  width={1280}
                  height={556}
                  sizes="(max-width: 991px) 100vw, 58vw"
                  priority
                />
                <figcaption>
                  <span className="welcome-figure-rule" />
                  <span>
                    <i className="bi bi-geo-alt-fill me-2" />
                    The Academic Block, Badalpur Campus
                  </span>
                </figcaption>
              </figure>

              <p className="lead">
                Established in 2002 with a vision to empower women through technical education, our
                institute is a premier government polytechnic offering AICTE-approved diploma
                programmes, affiliated to BTEUP, across engineering and management disciplines —
                equipped
                with modern laboratories, state-of-the-art infrastructure and a highly qualified
                faculty dedicated to holistic development, academic excellence and comprehensive
                placement assistance.
              </p>

              <Row className="g-3 mt-3">
                {PILLARS.slice(0, 4).map((pillar) => (
                  <Col md={6} key={pillar.title}>
                    <div className="feature-row h-100">
                      <span className="icon-tile icon-tile-sm">
                        <i className={`bi ${pillar.icon}`} />
                      </span>
                      <div>
                        <h5>{pillar.title}</h5>
                        <p>{pillar.text}</p>
                      </div>
                    </div>
                  </Col>
                ))}
              </Row>

              <div className="d-flex flex-wrap gap-3 mt-4">
                <Link href="/about" className="btn-gold">
                  <i className="bi bi-book-half" />
                  Read More About Us
                </Link>
                <Link href="/contact" className="btn-outline-navy">
                  <i className="bi bi-telephone-fill" />
                  Get in Touch
                </Link>
              </div>
            </Col>

            {/* The notice board absorbs whatever height the left column runs
                to, so both columns finish on the same line */}
            <Col lg={5} className="home-aside">
              <NoticeBoard notices={notices} />
              <PrincipalCard principal={sections['principal-card']} />
            </Col>
          </Row>
        </Container>
      </section>

      <Leadership leaders={sections.leadership} heading={sections['leadership-heading']} />

      {/* Explore */}
      <section className="section" style={{ background: 'var(--paper)' }}>
        <Container>
          <SectionHead
            eyebrow="Explore Our Institute"
            icon="bi-compass-fill"
            title="Everything You Need, One Click Away"
            subtitle="Quick access to the sections most requested by students, parents and recruiters."
          />
          <Row className="g-4">
            {HIGHLIGHTS.map((item) => (
              <Col lg={3} md={6} key={item.title}>
                <div className="premium-card h-100 p-4 text-center d-flex flex-column">
                  <span className="icon-tile mx-auto mb-4">
                    <i className={`bi ${item.icon}`} />
                  </span>
                  <h5 className="fw-bold mb-3">{item.title}</h5>
                  <p className="small flex-grow-1">{item.text}</p>
                  <div className="gold-rule-thin my-3" />
                  <Link href={item.href} className="fw-bold text-decoration-none text-primary-blue">
                    View Details <i className="bi bi-arrow-right" />
                  </Link>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Departments */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <SectionHead
            eyebrow="Academic Departments"
            icon="bi-diagram-3-fill"
            title="Four Disciplines, One Standard of Excellence"
            subtitle="Each department combines a rigorous curriculum with practical, laboratory-led learning."
          />
          <Row className="g-4">
            {/* Two up from md and four across at xl — at lg the fourth card
                would otherwise sit alone on a row below the other three. */}
            {DEPARTMENTS.map((dept) => (
              <Col xl={3} md={6} key={dept.name}>
                <div className="premium-card is-featured h-100 p-4">
                  {dept.image && (
                    <div className="dept-media" aria-hidden="true">
                      <Image
                        src={dept.image}
                        alt=""
                        fill
                        sizes="(max-width: 767px) 100vw, 25vw"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                  )}

                  <div className="dept-body">
                    <span className="icon-tile mb-4">
                      <i className={`bi ${dept.icon}`} />
                    </span>
                    <h5 className="fw-bold mb-3">{dept.name}</h5>
                    <p className="small">{dept.text}</p>
                    <div className="gold-rule-thin my-3" />
                    <div className="d-flex flex-wrap gap-3 small">
                      <Link href={`${dept.href}/faculty`} className="text-decoration-none text-primary-blue fw-semibold">
                        <i className="bi bi-person-badge me-1" />
                        Faculty
                      </Link>
                      <Link href={`${dept.href}/labs`} className="text-decoration-none text-primary-blue fw-semibold">
                        <i className="bi bi-beaker me-1" />
                        Labs
                      </Link>
                      <Link href={dept.href} className="text-decoration-none text-primary-blue fw-semibold ms-auto">
                        Visit <i className="bi bi-arrow-right" />
                      </Link>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Recruiters — light plate, because the logos carry white backgrounds */}
      <section className="section recruiter-section">
        <Container>
          <SectionHead
            eyebrow="Our Recruiters"
            icon="bi-briefcase-fill"
            title="Where Our Students Build Careers"
            subtitle="Leading technology, electronics and engineering organisations recruit from this campus through the Training & Placement cell."
          />

          <div className="recruiter-grid">
            {RECRUITERS.map((company) => (
              <div className="recruiter-card" key={company.name}>
                <div className="recruiter-logo">
                  {company.logo ? (
                    <Image
                      src={company.logo}
                      alt={`${company.name} logo`}
                      fill
                      sizes="180px"
                      style={{ objectFit: 'contain' }}
                    />
                  ) : (
                    <span className="recruiter-wordmark">{company.short}</span>
                  )}
                </div>
                <span className="recruiter-rule" />
                <p className="recruiter-name">{company.name}</p>
              </div>
            ))}
          </div>

          <div className="recruiter-actions">
            <Link href="/placements/recruiters" className="btn-gold">
              <i className="bi bi-buildings me-2" />
              See All Recruiters
            </Link>
            <Link href="/placements/records" className="btn-navy">
              <i className="bi bi-graph-up-arrow me-2" />
              Placement Records
            </Link>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <SectionHead
            eyebrow="Student Voices"
            icon="bi-chat-quote-fill"
            title="What Our Alumnae Say"
            subtitle="Stories from students who began here and went on to build strong technical careers."
          />
          <Row className="g-4">
            {TESTIMONIALS.map((item) => (
              <Col md={6} key={item.name}>
                <div className="quote-card">
                  <span className="quote-mark">&rdquo;</span>
                  <p>{item.quote}</p>
                  <div className="quote-author">
                    <span className="quote-avatar">{item.initial}</span>
                    <div>
                      <div className="quote-name">{item.name}</div>
                      <div className="quote-meta">{item.meta}</div>
                    </div>
                    <span className="ms-auto text-gold">
                      <i className="bi bi-star-fill" />
                      <i className="bi bi-star-fill" />
                      <i className="bi bi-star-fill" />
                      <i className="bi bi-star-fill" />
                      <i className="bi bi-star-fill" />
                    </span>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Gallery strip beside the campus map */}
      <GalleryMapBand
        images={images}
        location={{
          name: sections.institute.mapName,
          lat: sections.institute.mapLat,
          lng: sections.institute.mapLng,
        }}
      />

      {/* Closing CTA */}
      <section className="cta-band">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={8}>
              <span className="eyebrow eyebrow-light">
                <i className="bi bi-send-fill" />
                Admissions Open 2026-27
              </span>
              <h3>Begin Your Engineering Journey With Us</h3>
              <div className="hero-gold-line" />
              <p>
                Have a question about eligibility, courses, fees or hostel facilities? Our admission
                team is here to help you take the next step.
              </p>
            </Col>
            <Col lg={4} className="d-flex flex-column gap-3 align-items-lg-end">
              <Link href="/admission/enquiry" className="btn-gold">
                <i className="bi bi-pencil-square" />
                Submit an Enquiry
              </Link>
              <Link href="/admission/booklet" className="hero-btn-ghost">
                <i className="bi bi-file-earmark-pdf" />
                Download Booklet
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
