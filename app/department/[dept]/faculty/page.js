"use client";

import React, { use } from 'react';
import { Row, Col } from 'react-bootstrap';
import { notFound } from 'next/navigation';
import { getDepartment } from '@/lib/departments';

const FACULTY = [
  {
    name: 'Dr. Example Name',
    designation: 'Head of Department',
    qualification: 'Ph.D., M.Tech.',
    experience: '15 Years',
    initial: 'D',
  },
  {
    name: 'Mrs. Faculty Two',
    designation: 'Lecturer',
    qualification: 'M.Tech.',
    experience: '8 Years',
    initial: 'F',
  },
  {
    name: 'Ms. Faculty Three',
    designation: 'Lecturer',
    qualification: 'B.Tech.',
    experience: '3 Years',
    initial: 'F',
  },
];

export default function FacultyPage({ params }) {
  const { dept } = use(params);
  const department = getDepartment(dept);

  // A staff listing has no faculty page — the sidebar never links here, and the
  // URL typed by hand must not render an empty one either.
  if (department.staff) notFound();

  return (
    <>
      <div className="panel">
        <div className="panel-header">
          <i className="bi bi-person-badge" />
          Faculty — {department.name}
        </div>
        <div className="panel-body">
          <p>
            Our faculty combine strong academic credentials with industry awareness, mentoring every
            student individually through the three-year diploma programme.
          </p>

          <Row className="g-4 mt-1">
            {FACULTY.map((member) => (
              <Col lg={4} md={6} key={member.name}>
                <div className="premium-card h-100 p-4 text-center">
                  <span className="quote-avatar mx-auto mb-3" style={{ width: 64, height: 64, flex: '0 0 64px', fontSize: '1.5rem' }}>
                    {member.initial}
                  </span>
                  <h5 className="fw-bold mb-1">{member.name}</h5>
                  <span className="eyebrow">{member.designation}</span>
                  <div className="gold-rule-thin my-3" />
                  <p className="small mb-1">
                    <i className="bi bi-mortarboard-fill text-gold me-2" />
                    {member.qualification}
                  </p>
                  <p className="small mb-0">
                    <i className="bi bi-clock-history text-gold me-2" />
                    {member.experience} of experience
                  </p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      <div className="panel mt-4">
        <div className="panel-header">
          <i className="bi bi-table" />
          Faculty Directory
        </div>
        <div className="panel-body p-0">
          <div className="table-wrap">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Designation</th>
                  <th>Qualification</th>
                  <th>Experience</th>
                </tr>
              </thead>
              <tbody>
                {FACULTY.map((member, index) => (
                  <tr key={member.name}>
                    <td>{index + 1}</td>
                    <td>
                      <i className="bi bi-person-circle text-gold me-2" />
                      {member.name}
                    </td>
                    <td>{member.designation}</td>
                    <td>{member.qualification}</td>
                    <td>{member.experience}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="callout mt-4">
        <i className="bi bi-info-circle-fill" />
        <p>
          Faculty details are updated at the start of every academic session. For departmental
          enquiries, please contact the institute office.
        </p>
      </div>
    </>
  );
}
