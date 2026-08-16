import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';
import SideNav from '@/components/SideNav';
import { getDepartment, deptNav } from '@/lib/server/departments';

export default async function DepartmentLayout({ children, params }) {
  // In Next.js 16 `params` is a Promise, unwrapped with React's `use` hook.
  const { dept } = await params;
  const department = await getDepartment(dept);

  const navItems = deptNav(department).map((item) => ({
    href: `/department/${dept}${item.path}`,
    label: item.label,
    icon: item.icon,
  }));

  return (
    <>
      <PageHeader
        icon={department.icon}
        eyebrow={department.eyebrow ?? 'Academic Department'}
        title={department.name}
        subtitle={department.tagline}
        crumbs={[{ label: 'Departments' }, { label: department.name }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={3}>
              <SideNav
                eyebrow={department.staff ? 'Staff' : 'Department'}
                title={department.name}
                items={navItems}
                cta={{
                  icon: 'bi-headset',
                  title: 'Have a Question?',
                  text: 'Reach out to the department office for academic guidance.',
                  href: '/contact',
                  label: 'Contact Us',
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
