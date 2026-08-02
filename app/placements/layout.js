"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';
import SideNav from '@/components/SideNav';

const NAV_ITEMS = [
  { href: '/placements/tnp-department', label: 'T&P Department', icon: 'bi-building-gear' },
  { href: '/placements/recruiters', label: 'Our Recruiters', icon: 'bi-buildings' },
  { href: '/placements/records', label: 'Placement Records', icon: 'bi-graph-up-arrow' },
  { href: '/placements/programmes', label: 'T&P Programmes', icon: 'bi-easel' },
];

export default function PlacementsLayout({ children }) {
  return (
    <>
      <PageHeader
        icon="bi-briefcase-fill"
        eyebrow="Career Development"
        title="Training &amp; Placements"
        subtitle="A dedicated cell connecting our students with leading recruiters and industry opportunities."
        crumbs={[{ label: 'Placements' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={3}>
              <SideNav
                eyebrow="Placements"
                title="Training &amp; Placement Cell"
                items={NAV_ITEMS}
                cta={{
                  icon: 'bi-building-check',
                  title: 'Recruiters, Partner With Us',
                  text: 'Invite our students for campus recruitment or an industrial collaboration.',
                  href: '/contact',
                  label: 'Get in Touch',
                }}
              />
            </Col>
            <Col lg={9}>{children}</Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
