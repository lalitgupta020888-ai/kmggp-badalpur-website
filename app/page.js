"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { RECRUITERS } from '@/lib/recruiters';
import HeroSlider from '@/components/HeroSlider';
import NoticeBoard from '@/components/NoticeBoard';
import Leadership from '@/components/Leadership';
import PrincipalCard from '@/components/PrincipalCard';
import SectionHead from '@/components/SectionHead';
import GalleryMapBand from '@/components/GalleryMapBand';

const STATS = [
  { icon: 'bi-people-fill', value: '500+', label: 'Students Enrolled' },
  { icon: 'bi-diagram-3-fill', value: '03', label: 'Engineering Branches' },
  { icon: 'bi-graph-up-arrow', value: '88%', label: 'Placement Rate' },
  { icon: 'bi-calendar2-check-fill', value: '15+', label: 'Years of Excellence' },
];

const HIGHLIGHTS = [
  {
    icon: 'bi-collection-fill',
    title: 'Courses Offered',
    text: 'Three-year AICTE-approved diploma programmes in Electronics, Computer Science and Information Technology.',
    href: '/admission/courses',
  },
  {
    icon: 'bi-mortarboard-fill',
    title: 'Admissions 2026-27',
    text: 'Eligibility, the JEECUP counselling process, fee structure and the official information booklet.',
    href: '/admission/process',
  },
  {
    icon: 'bi-briefcase-fill',
    title: 'Training & Placements',
    text: 'A dedicated T&P cell, leading recruiters and a consistently strong campus placement record.',
    href: '/placements/records',
  },
  {
    icon: 'bi-stars',
    title: 'Life @ KMGGP',
    text: 'Clubs, cultural festivals, technical symposiums, sports and a secure on-campus hostel.',
    href: '/life',
  },
];

/** The welcome section leads with the first four of these. */
const PILLARS = [
  {
    icon: 'bi-buildings-fill',
    title: 'Modern Infrastructure',
    text: 'Well-equipped laboratories, smart classrooms, a rich library and a green, secure campus.',
  },
  {
    icon: 'bi-person-video3',
    title: 'Experienced Faculty',
    text: 'Highly qualified teaching staff committed to mentoring every student individually.',
  },
  {
    icon: 'bi-shield-lock-fill',
    title: 'Safe Girls Campus',
    text: 'A protected, women-only environment with hostel facilities and round-the-clock security.',
  },
  {
    icon: 'bi-cash-stack',
    title: 'Scholarship Support',
    text: 'State and central government schemes including the AICTE Pragati scheme for girls.',
  },
];

/**
 * `image` is optional: where set it fills the card behind the content, under
 * a white scrim, so the icon, copy and links keep the same colours and
 * contrast as a card without one. Dark artwork suits it best — the scrim is
 * tuned to hold a dark photograph back, and a light one all but disappears.
 */
const DEPARTMENTS = [
  {
    icon: 'bi-cpu-fill',
    name: 'Electronics Engineering',
    text: 'Circuits, microprocessors, communication systems and embedded design.',
    href: '/department/electronics',
    image: '/images/departments/electronics.png',
  },
  {
    icon: 'bi-pc-display',
    name: 'Computer Science & Engineering',
    text: 'Programming, data structures, databases and modern software development.',
    href: '/department/cse',
    image: '/images/departments/cse.png',
  },
  {
    icon: 'bi-hdd-network-fill',
    name: 'Information Technology',
    text: 'Networking, web technologies, cloud fundamentals and IT infrastructure.',
    href: '/department/it',
    image: '/images/departments/it.jpg',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'The Computer Science department here is phenomenal. The faculty are extremely supportive and the labs are well equipped. I secured a job at a top MNC directly through campus placements.',
    name: 'Anjali Sharma',
    meta: 'CSE, Batch of 2025',
    initial: 'A',
  },
  {
    quote:
      'Km. Mayawati Government Girls Polytechnic, Badalpur completely transformed my career. The practical approach in Electronics Engineering helped me understand core concepts effortlessly and gave me real confidence.',
    name: 'Priya Verma',
    meta: 'Electronics, Batch of 2024',
    initial: 'P',
  },
];

export default function Home() {
  return (
    <>
      <HeroSlider />

      {/* Key figures */}
      <section className="stat-strip">
        <Container>
          <Row className="g-0">
            {STATS.map((stat) => (
              <Col key={stat.label} md={3} sm={6}>
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

      {/* Welcome + notice board */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-5 align-items-start">
            <Col lg={7}>
              <SectionHead
                align="start"
                eyebrow="Welcome to the Institute"
                icon="bi-buildings-fill"
                title="Km. Mayawati Government Girls Polytechnic, Badalpur"
              />
              <p className="lead">
                Established with a vision to empower women through technical education, our institute
                is a premier government polytechnic offering diploma programmes across leading
                engineering disciplines.
              </p>
              <p>
                The campus is equipped with state-of-the-art infrastructure, modern laboratories and a
                highly qualified faculty dedicated to shaping the future of young women. We focus on
                holistic development, academic excellence and comprehensive placement assistance.
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

            <Col lg={5}>
              <NoticeBoard />
              <div className="mt-4">
                <PrincipalCard />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Leadership />

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
            title="Three Disciplines, One Standard of Excellence"
            subtitle="Each department combines a rigorous curriculum with practical, laboratory-led learning."
          />
          <Row className="g-4">
            {DEPARTMENTS.map((dept) => (
              <Col lg={4} md={6} key={dept.name}>
                <div className="premium-card is-featured h-100 p-4">
                  {dept.image && (
                    <div className="dept-media" aria-hidden="true">
                      <Image
                        src={dept.image}
                        alt=""
                        fill
                        sizes="(max-width: 767px) 100vw, 33vw"
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
      <GalleryMapBand />

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
