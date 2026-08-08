"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';
import SideNav from '@/components/SideNav';
import { COUNSELLING_LINKS } from '@/lib/counselling';

/**
 * The counselling section mirrors the JEECUP portal's layout — a standing
 * column of every counselling action on the left, the selected page beside it.
 * The item list comes from lib/counselling so the navbar dropdown and this
 * sidebar always show the same seven entries.
 */
export default function CounsellingLayout({ children }) {
  return (
    <>
      <PageHeader
        icon="bi-clipboard2-check-fill"
        eyebrow="Admission Cycle 2026-27"
        title="Counselling &amp; Admission 2026"
        subtitle="Everything a candidate needs for JEECUP counselling — document lists, eligibility, instructions and the counselling schedule."
        crumbs={[{ label: 'Counselling & Admission 2026' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={4} xl={3}>
              <SideNav
                eyebrow="Session 2026-27"
                title="Counselling Desk"
                items={COUNSELLING_LINKS}
                cta={{
                  icon: 'bi-headset',
                  title: 'Need Help With Counselling?',
                  text: 'Our admission cell guides candidates through choice filling, verification and reporting.',
                  href: '/admission/enquiry',
                  label: 'Admission Enquiry',
                }}
              />
            </Col>
            <Col lg={8} xl={9}>{children}</Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
