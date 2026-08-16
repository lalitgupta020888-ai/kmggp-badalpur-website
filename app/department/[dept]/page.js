import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import { getDepartment } from '@/lib/server/departments';
import { getSection } from '@/lib/server/sections';

/**
 * The figure tiles are derived from the department rather than fixed, because
 * they differ per department: the PG diploma runs a single year, Applied
 * Sciences intakes no cohort of its own, and the lab count is simply however
 * many laboratories the department lists.
 */
function highlightsFor(department) {
  const tiles = [];

  if (department.seats) {
    tiles.push({ icon: 'bi-people-fill', value: department.seats, label: 'Seats per Year' });
  }
  if (department.duration) {
    tiles.push({
      icon: 'bi-hourglass-split',
      value: department.duration,
      label: 'Programme Duration',
    });
  }
  if (department.labs.length > 0) {
    tiles.push({
      icon: 'bi-beaker',
      value: String(department.labs.length).padStart(2, '0'),
      label: 'Dedicated Labs',
    });
  }
  tiles.push({ icon: 'bi-patch-check-fill', value: 'BTEUP', label: 'Affiliation' });

  return tiles;
}

/**
 * A staff department carries no programme, laboratories or achievements — the
 * listing below is the whole of its section: a photograph and the person's
 * details, and nothing more.
 */
function StaffDirectory({ department }) {
  return (
    <div className="panel">
      <div className="panel-header">
        <i className={`bi ${department.icon}`} />
        {department.name}
      </div>
      <div className="panel-body">
        <Row className="g-4">
          {department.staff.map((member) => (
            <Col lg={4} md={6} key={member.name}>
              <div className="premium-card h-100 p-4 text-center">
                <span className="staff-photo">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      sizes="132px"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <i className="bi bi-person-fill" />
                  )}
                </span>
                <h5 className="fw-bold mb-1">{member.name}</h5>
                <span className="eyebrow">{member.designation}</span>
                {member.detail && (
                  <>
                    <div className="gold-rule-thin my-3" />
                    <p className="small mb-0">{member.detail}</p>
                  </>
                )}
              </div>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default async function DepartmentHome({ params }) {
  const { dept } = await params;
  const department = await getDepartment(dept);
  const text = await getSection('department-pages');

  if (department.staff) return <StaffDirectory department={department} />;

  const highlights = highlightsFor(department);

  return (
    <>
      <div className="panel">
        <div className="panel-header">
          <i className={`bi ${department.icon}`} />
          {text.homeIntroHeading} {department.name}
        </div>
        <div className="panel-body">
          <p className="lead">{department.intro}</p>
          <p>
            The programme is approved by AICTE, New Delhi and follows the curriculum prescribed by
            BTEUP. We offer comprehensive coursework, state-of-the-art laboratory facilities and
            experienced faculty to ensure that students acquire both the theoretical knowledge and
            the practical skills the industry expects today.
          </p>

          <div className="gold-rule-thin my-4" />

          <Row className="g-3">
            {highlights.map((item) => (
              <Col md={Math.floor(12 / highlights.length)} sm={6} key={item.label}>
                <div className="feature-row align-items-center h-100">
                  <span className="icon-tile icon-tile-sm">
                    <i className={`bi ${item.icon}`} />
                  </span>
                  <div>
                    <h5 className="mb-0">{item.value}</h5>
                    <p className="small mb-0">{item.label}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      <Row className="g-4 mt-1">
        <Col md={6}>
          <div className="panel h-100">
            <div className="panel-header">
              <i className="bi bi-eye-fill" />
              Vision
            </div>
            <div className="panel-body">
              <p className="mb-0">
                To be recognised for excellence in education, innovation and applied research in the
                field, and to produce technically competent women professionals who lead with
                confidence and integrity.
              </p>
            </div>
          </div>
        </Col>

        <Col md={6}>
          <div className="panel h-100">
            <div className="panel-header">
              <i className="bi bi-bullseye" />
              Mission
            </div>
            <div className="panel-body">
              <ul className="gold-list mb-0">
                <li>Provide a rigorous academic environment that fosters innovation and continuous learning.</li>
                <li>Establish industry collaborations for hands-on exposure and stronger placements.</li>
                <li>Empower women through technical prowess and leadership skills.</li>
              </ul>
            </div>
          </div>
        </Col>
      </Row>

      {department.focus.length > 0 && (
        <div className="panel mt-4">
          <div className="panel-header">
            <i className="bi bi-bookmark-star-fill" />
            Areas of Focus
          </div>
          <div className="panel-body">
            <Row className="g-3">
              {department.focus.map((area) => (
                <Col md={6} key={area}>
                  <div className="feature-row align-items-center h-100">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-check-lg" />
                    </span>
                    <h5 className="mb-0">{area}</h5>
                  </div>
                </Col>
              ))}
            </Row>
          </div>
        </div>
      )}
    </>
  );
}
