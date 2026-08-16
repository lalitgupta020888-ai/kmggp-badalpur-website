import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { notFound } from 'next/navigation';
import { getDepartment } from '@/lib/server/departments';

const FEATURES = [
  { icon: 'bi-pc-display', label: 'Modern equipment and workstations' },
  { icon: 'bi-person-workspace', label: 'Individual workbench for every student' },
  { icon: 'bi-shield-check', label: 'Full safety protocols and supervision' },
  { icon: 'bi-clock-fill', label: 'Extended access during project work' },
];

export default async function LabsPage({ params }) {
  const { dept } = await params;
  const department = await getDepartment(dept);

  // A staff listing has no laboratories — see the faculty page for the reason.
  if (department.staff) notFound();

  return (
    <>
      <div className="panel">
        <div className="panel-header">
          <i className="bi bi-beaker" />
          Laboratory Facilities — {department.name}
        </div>
        <div className="panel-body">
          <p>
            Practical work sits at the heart of every diploma programme. Our laboratories are equipped
            to give each student direct, hands-on experience with the tools and instruments used in
            industry.
          </p>

          <Row className="g-4 mt-1">
            {department.labs.map((lab) => (
              <Col md={6} key={lab.name}>
                <div className="premium-card h-100 p-4">
                  <span className="icon-tile mb-3">
                    <i className={`bi ${lab.icon}`} />
                  </span>
                  <h5 className="fw-bold mb-2">{lab.name}</h5>
                  <p className="small mb-0">{lab.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      <div className="panel mt-4">
        <div className="panel-header">
          <i className="bi bi-stars" />
          What Makes Our Labs Different
        </div>
        <div className="panel-body">
          <Row className="g-3">
            {FEATURES.map((feature) => (
              <Col md={6} key={feature.label}>
                <div className="feature-row align-items-center h-100">
                  <span className="icon-tile icon-tile-sm">
                    <i className={`bi ${feature.icon}`} />
                  </span>
                  <h5 className="mb-0">{feature.label}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </>
  );
}
