"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';

const FACETS = [
  {
    icon: 'bi-people-fill',
    title: 'Clubs & Societies',
    text: 'Join the Tech Club, Cultural Society, Literary Club or Sports Club and pursue your passions beyond the syllabus.',
  },
  {
    icon: 'bi-balloon-fill',
    title: 'Events & Festivals',
    text: 'Annual fests, technical symposiums and national celebrations give every student a stage to showcase her talent.',
    href: '/life/events',
  },
  {
    icon: 'bi-house-heart-fill',
    title: 'Hostel Life',
    text: 'A safe, secure and supportive on-campus residence with modern amenities and a warm community.',
    href: '/life/hostels',
  },
  {
    icon: 'bi-book-half',
    title: 'Library',
    text: 'A well-stocked library and digital section supporting study, revision and research across every branch.',
    href: '/life/library',
  },
  {
    icon: 'bi-trophy-fill',
    title: 'Sports & Fitness',
    text: 'Indoor and outdoor sports, annual athletics meets and inter-polytechnic tournaments.',
  },
  {
    icon: 'bi-heart-pulse-fill',
    title: 'Wellness & Counselling',
    text: 'Confidential mentoring, health check-ups and guidance to help students thrive academically and personally.',
  },
  {
    icon: 'bi-globe2',
    title: 'Community Outreach',
    text: 'NSS activities, digital literacy drives and awareness campaigns in the surrounding villages.',
  },
];

const AMENITIES = [
  { icon: 'bi-book-half', label: 'Well-stocked Library' },
  { icon: 'bi-wifi', label: 'Campus-wide Wi-Fi' },
  { icon: 'bi-cup-hot-fill', label: 'Canteen' },
  { icon: 'bi-bus-front-fill', label: 'Transport Facility' },
  { icon: 'bi-shield-lock-fill', label: '24×7 Security' },
  { icon: 'bi-hospital-fill', label: 'Medical Room' },
  { icon: 'bi-lightning-charge-fill', label: 'Power Backup' },
  { icon: 'bi-camera-video-fill', label: 'CCTV Surveillance' },
];

export default function LifeAtKMGGP() {
  return (
    <>
      <PageHeader
        icon="bi-stars"
        eyebrow="Beyond the Classroom"
        title="Life @ KMGGP"
        subtitle="A vibrant blend of academics, extracurricular activity and personal growth."
        crumbs={[{ label: 'Life@KMGGP' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <SectionHead
            eyebrow="Campus Experience"
            icon="bi-emoji-smile-fill"
            title="More Than a Diploma"
            subtitle="Life at Km. Mayawati Government Girls Polytechnic, Badalpur is designed to build both capability and confidence."
          />

          <Row className="g-4">
            {FACETS.map((facet) => (
              <Col lg={4} md={6} key={facet.title}>
                <div className="premium-card h-100 p-4 d-flex flex-column">
                  <span className="icon-tile mb-4">
                    <i className={`bi ${facet.icon}`} />
                  </span>
                  <h5 className="fw-bold mb-3">{facet.title}</h5>
                  <p className="small flex-grow-1">{facet.text}</p>
                  {facet.href && (
                    <>
                      <div className="gold-rule-thin my-3" />
                      <Link
                        href={facet.href}
                        className="fw-bold text-decoration-none text-primary-blue small"
                      >
                        Learn More <i className="bi bi-arrow-right" />
                      </Link>
                    </>
                  )}
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section" style={{ background: 'var(--paper)' }}>
        <Container>
          <SectionHead
            eyebrow="Campus Amenities"
            icon="bi-buildings-fill"
            title="Facilities That Support Every Student"
          />
          <Row className="g-3">
            {AMENITIES.map((amenity) => (
              <Col lg={3} md={4} sm={6} key={amenity.label}>
                <div className="feature-row align-items-center h-100">
                  <span className="icon-tile icon-tile-sm">
                    <i className={`bi ${amenity.icon}`} />
                  </span>
                  <h5 className="mb-0">{amenity.label}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="cta-band">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={8}>
              <span className="eyebrow eyebrow-light">
                <i className="bi bi-images" />
                See It For Yourself
              </span>
              <h3>Take a Look Around Our Campus</h3>
              <div className="hero-gold-line" />
              <p>Browse photographs of our classrooms, laboratories, library and student events.</p>
            </Col>
            <Col lg={4} className="d-flex flex-column gap-3 align-items-lg-end">
              <Link href="/gallery" className="btn-gold">
                <i className="bi bi-camera-fill" />
                View Photo Gallery
              </Link>
              <Link href="/contact" className="hero-btn-ghost">
                <i className="bi bi-telephone-fill" />
                Plan a Campus Visit
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
