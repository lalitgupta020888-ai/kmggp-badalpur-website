"use client";

import React, { use } from 'react';
import { Row, Col } from 'react-bootstrap';
import { getDepartment } from '@/lib/departments';

const HIGHLIGHTS = [
  { icon: 'bi-people-fill', value: '75', label: 'Seats per Year' },
  { icon: 'bi-hourglass-split', value: '3 Yrs', label: 'Programme Duration' },
  { icon: 'bi-beaker', value: '04', label: 'Dedicated Labs' },
  { icon: 'bi-patch-check-fill', value: 'BTEUP', label: 'Affiliation' },
];

export default function DepartmentHome({ params }) {
  const { dept } = use(params);
  const department = getDepartment(dept);

  return (
    <>
      <div className="panel">
        <div className="panel-header">
          <i className={`bi ${department.icon}`} />
          Welcome to {department.name}
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
            {HIGHLIGHTS.map((item) => (
              <Col md={3} sm={6} key={item.label}>
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
