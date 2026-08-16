import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { notFound } from 'next/navigation';
import { getDepartment } from '@/lib/server/departments';
import { getSection } from '@/lib/server/sections';



export default async function AchievementsPage({ params }) {
  const { dept } = await params;
  const department = await getDepartment(dept);
  const text = await getSection('department-pages');
  const ACHIEVEMENTS = department.achievements || [];
  const AWARDS = department.awards || [];

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
          <p>{text.achievementsIntro}</p>

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
