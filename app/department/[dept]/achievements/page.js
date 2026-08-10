"use client";

import React, { use } from 'react';
import { Row, Col } from 'react-bootstrap';
import { notFound } from 'next/navigation';
import { getDepartment } from '@/lib/departments';

const ACHIEVEMENTS = [
  {
    icon: 'bi-mortarboard-fill',
    title: 'Student Excellence',
    text: 'Many of our students have secured top ranks in the Board of Technical Education (BTEUP) examinations consistently over the last five years.',
  },
  {
    icon: 'bi-briefcase-fill',
    title: 'Placements',
    text: 'Over 85% of eligible students were placed in leading multinational companies including Tech Mahindra, Wipro and Infosys during the recent placement drive.',
  },
  {
    icon: 'bi-trophy-fill',
    title: 'Projects & Hackathons',
    text: 'Final year students recently won first prize at the State Level Technical Project Exhibition for their innovative Smart Campus project.',
  },
  {
    icon: 'bi-people-fill',
    title: 'Workshops & Seminars',
    text: 'The department regularly hosts industry experts for technical seminars on emerging technologies and career pathways.',
  },
];

const AWARDS = [
  { year: '2026', title: 'First Prize — State Level Technical Project Exhibition', icon: 'bi-award-fill' },
  { year: '2025', title: 'Best Performing Department — Institute Annual Awards', icon: 'bi-trophy-fill' },
  { year: '2025', title: 'Top Ranks in BTEUP Diploma Examinations', icon: 'bi-star-fill' },
  { year: '2024', title: 'Winners — Inter-Polytechnic Technical Quiz', icon: 'bi-patch-check-fill' },
];

export default function AchievementsPage({ params }) {
  const { dept } = use(params);
  const department = getDepartment(dept);

  // A staff listing has no achievements page — see the faculty page for the reason.
  if (department.staff) notFound();

  return (
    <>
      <div className="panel">
        <div className="panel-header">
          <i className="bi bi-trophy" />
          Achievements — {department.name}
        </div>
        <div className="panel-body">
          <p>
            Our students and faculty consistently distinguish themselves in academics, competitions and
            campus recruitment. A few highlights from recent years are listed below.
          </p>

          <Row className="g-4 mt-1">
            {ACHIEVEMENTS.map((item) => (
              <Col md={6} key={item.title}>
                <div className="premium-card h-100 p-4">
                  <span className="icon-tile mb-3">
                    <i className={`bi ${item.icon}`} />
                  </span>
                  <h5 className="fw-bold mb-2">{item.title}</h5>
                  <p className="small mb-0">{item.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      <div className="panel mt-4">
        <div className="panel-header">
          <i className="bi bi-award-fill" />
          Recent Awards &amp; Recognition
        </div>
        <div className="panel-body p-0">
          <div className="table-wrap">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Award / Recognition</th>
                </tr>
              </thead>
              <tbody>
                {AWARDS.map((award) => (
                  <tr key={award.title}>
                    <td>{award.year}</td>
                    <td>
                      <i className={`bi ${award.icon} text-gold me-2`} />
                      {award.title}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
