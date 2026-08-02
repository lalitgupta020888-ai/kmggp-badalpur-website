"use client";

import React from 'react';
import { Row, Col } from 'react-bootstrap';

const SUMMARY = [
  { icon: 'bi-graph-up-arrow', value: '88%', label: 'Placement Rate' },
  { icon: 'bi-people-fill', value: '132', label: 'Students Placed' },
  { icon: 'bi-buildings-fill', value: '20+', label: 'Recruiting Companies' },
  { icon: 'bi-cash-coin', value: '₹3.4 LPA', label: 'Highest Package' },
];

const RECORDS = [
  { year: '2025-26', eligible: 150, placed: 132, rate: '88%', top: 'Tech Mahindra' },
  { year: '2024-25', eligible: 140, placed: 125, rate: '89%', top: 'Wipro Technologies' },
  { year: '2023-24', eligible: 138, placed: 116, rate: '84%', top: 'Infosys' },
  { year: '2022-23', eligible: 132, placed: 108, rate: '82%', top: 'HCL Technologies' },
];

export default function PlacementRecords() {
  return (
    <>
      <div className="panel">
        <div className="panel-header">
          <i className="bi bi-graph-up-arrow" />
          Placement Highlights — 2025-26
        </div>
        <div className="panel-body">
          <p>
            Our students have consistently performed well in campus interviews. The figures below
            summarise the most recent placement season.
          </p>

          <Row className="g-3 mt-1">
            {SUMMARY.map((item) => (
              <Col md={3} sm={6} key={item.label}>
                <div className="premium-card is-featured h-100 p-4 text-center">
                  <span className="icon-tile mx-auto mb-3">
                    <i className={`bi ${item.icon}`} />
                  </span>
                  <h4 className="fw-bold mb-1">{item.value}</h4>
                  <p className="small mb-0">{item.label}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      <div className="panel mt-4">
        <div className="panel-header">
          <i className="bi bi-table" />
          Year-wise Placement Record
        </div>
        <div className="panel-body p-0">
          <div className="table-wrap">
            <table className="premium-table">
              <thead>
                <tr>
                  <th>Academic Year</th>
                  <th>Total Eligible</th>
                  <th>Students Placed</th>
                  <th>Placement Rate</th>
                  <th>Top Recruiter</th>
                </tr>
              </thead>
              <tbody>
                {RECORDS.map((record) => (
                  <tr key={record.year}>
                    <td>
                      <i className="bi bi-calendar3 text-gold me-2" />
                      {record.year}
                    </td>
                    <td>{record.eligible}</td>
                    <td>{record.placed}</td>
                    <td>
                      <span className="fw-bold text-primary-blue">{record.rate}</span>
                    </td>
                    <td>{record.top}</td>
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
          Placement figures are compiled at the close of each recruitment season and include both
          on-campus and off-campus offers verified by the Training &amp; Placement cell.
        </p>
      </div>
    </>
  );
}
