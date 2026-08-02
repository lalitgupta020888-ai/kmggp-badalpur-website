"use client";

import React from 'react';
import { Row, Col } from 'react-bootstrap';

const PROGRAMMES = [
  {
    icon: 'bi-chat-left-text-fill',
    title: 'Soft Skills Training',
    text: 'Communication skills, group discussion practice, resume building and professional etiquette workshops.',
  },
  {
    icon: 'bi-cpu-fill',
    title: 'Technical Workshops',
    text: 'Seminars on emerging technologies such as AI, IoT and cloud computing, led by industry experts.',
  },
  {
    icon: 'bi-person-video2',
    title: 'Mock Interviews',
    text: 'Regular mock interview sessions conducted by alumnae and practising HR professionals.',
  },
  {
    icon: 'bi-calculator-fill',
    title: 'Aptitude Training',
    text: 'Structured classes in quantitative aptitude and logical reasoning to clear screening tests.',
  },
  {
    icon: 'bi-bus-front-fill',
    title: 'Industrial Visits',
    text: 'Guided visits to manufacturing units and technology parks for real-world exposure.',
  },
  {
    icon: 'bi-file-earmark-person-fill',
    title: 'Career Counselling',
    text: 'One-to-one guidance on career pathways, higher studies and competitive examinations.',
  },
];

const CALENDAR = [
  { title: 'Semester I – III · Foundation Phase', text: 'Communication skills, basic aptitude and personality development sessions.' },
  { title: 'Semester IV · Skill Building Phase', text: 'Technical workshops, resume preparation and introductory mock interviews.' },
  { title: 'Semester V · Placement Readiness', text: 'Intensive aptitude training, group discussions and company-specific preparation.' },
  { title: 'Semester VI · Recruitment Drive', text: 'On-campus interviews, offer coordination and post-placement mentoring.' },
];

export default function TNPProgrammes() {
  return (
    <>
      <div className="panel">
        <div className="panel-header">
          <i className="bi bi-easel" />
          Training &amp; Placement Programmes
        </div>
        <div className="panel-body">
          <p>
            We run a structured programme of training activities through the academic year to build
            the employability of every student, from her first semester to her final placement.
          </p>

          <Row className="g-4 mt-1">
            {PROGRAMMES.map((programme) => (
              <Col md={6} key={programme.title}>
                <div className="premium-card h-100 p-4">
                  <span className="icon-tile mb-3">
                    <i className={`bi ${programme.icon}`} />
                  </span>
                  <h5 className="fw-bold mb-2">{programme.title}</h5>
                  <p className="small mb-0">{programme.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      <div className="panel mt-4">
        <div className="panel-header">
          <i className="bi bi-calendar-week-fill" />
          Training Roadmap Across the Diploma
        </div>
        <div className="panel-body">
          <ul className="timeline">
            {CALENDAR.map((phase) => (
              <li key={phase.title}>
                <h6>{phase.title}</h6>
                <p>{phase.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
