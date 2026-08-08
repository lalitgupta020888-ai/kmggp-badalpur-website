"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';
import SideNav from '@/components/SideNav';
import { EMPLOYEE_LINKS } from '@/lib/employee';

/**
 * The employee section follows the counselling desk's shape — a standing column
 * of tools on the left, the selected one beside it.
 */
export default function EmployeeLayout({ children }) {
  return (
    <>
      <PageHeader
        icon="bi-person-vcard-fill"
        eyebrow="For Staff"
        title="Employee Section"
        subtitle="Calculators and tools for the teaching and non-teaching staff of the institute."
        crumbs={[{ label: 'Employee Section' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={4} xl={3}>
              <SideNav
                eyebrow="Staff Tools"
                title="Employee Desk"
                items={EMPLOYEE_LINKS}
                cta={{
                  icon: 'bi-headset',
                  title: 'Need Help?',
                  text: 'For pay, service or tax queries, contact the institute establishment section.',
                  href: '/contact',
                  label: 'Contact Office',
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
