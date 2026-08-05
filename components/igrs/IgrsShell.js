"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';
import SideNav from '@/components/SideNav';

export const IGRS_NAV_ITEMS = [
  { href: '/igrs/student', label: 'Student Grievance', icon: 'bi-mortarboard-fill' },
  { href: '/igrs/parent', label: 'Parent Grievance', icon: 'bi-people-fill' },
  { href: '/igrs/employee', label: 'Employee Grievance', icon: 'bi-person-badge-fill' },
  { href: '/igrs/status', label: 'Check Status', icon: 'bi-search' },
  { href: '/igrs/admin', label: 'Admin Login', icon: 'bi-person-lock' },
];

/**
 * Common frame for every IGRS service page: navy banner, breadcrumb back to
 * the portal, and the services sidebar so visitors can switch service without
 * returning to the landing page.
 *
 * wide: drop the sidebar and use the full container (admin dashboard).
 */
export default function IgrsShell({
  icon = 'bi-shield-check',
  eyebrow = 'Integrated Grievance Redressal System',
  title,
  subtitle,
  crumb,
  wide = false,
  children,
}) {
  return (
    <>
      <PageHeader
        icon={icon}
        eyebrow={eyebrow}
        title={title}
        subtitle={subtitle}
        crumbs={[{ label: crumb || title }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          {wide ? (
            children
          ) : (
            <Row className="g-4">
              <Col lg={3}>
                <SideNav
                  eyebrow="IGRS Portal"
                  title="Grievance Services"
                  items={IGRS_NAV_ITEMS}
                  cta={{
                    icon: 'bi-headset',
                    title: 'Need Assistance?',
                    text: 'Speak to the institute office during working hours for help with your grievance.',
                    href: '/contact',
                    label: 'Contact Us',
                  }}
                />
              </Col>
              <Col lg={9}>{children}</Col>
            </Row>
          )}
        </Container>
      </section>
    </>
  );
}
