"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';

const CATEGORIES = [
  {
    icon: 'bi-cpu-fill',
    title: 'Technical Festival',
    text: 'Project exhibitions, coding contests, circuit design challenges and technical quizzes across all three branches.',
  },
  {
    icon: 'bi-music-note-beamed',
    title: 'Annual Cultural Function',
    text: 'Dance, music, drama and poetry performances that bring the whole campus together each year.',
  },
  {
    icon: 'bi-flag-fill',
    title: 'National Celebrations',
    text: 'Independence Day, Republic Day and Gandhi Jayanti observed with flag hoisting and cultural programmes.',
  },
  {
    icon: 'bi-trophy-fill',
    title: 'Annual Sports Meet',
    text: 'Athletics, indoor games and inter-branch tournaments culminating in a prize distribution ceremony.',
  },
  {
    icon: 'bi-mic-fill',
    title: 'Guest Lectures & Seminars',
    text: 'Industry experts and alumnae speak on emerging technologies, careers and higher education.',
  },
  {
    icon: 'bi-globe2',
    title: 'NSS & Outreach Drives',
    text: 'Cleanliness campaigns, tree plantation, digital literacy drives and health awareness camps.',
  },
];

const CALENDAR = [
  {
    month: 'August',
    event: 'Independence Day Celebration',
    detail: 'Flag hoisting, cultural programme and prize distribution',
    icon: 'bi-flag-fill',
  },
  {
    month: 'September',
    event: 'Fresher’s Welcome',
    detail: 'Orientation and welcome function for the incoming first-year batch',
    icon: 'bi-emoji-smile-fill',
  },
  {
    month: 'October',
    event: 'Technical Project Exhibition',
    detail: 'Branch-wise student projects displayed and judged by a faculty panel',
    icon: 'bi-cpu-fill',
  },
  {
    month: 'December',
    event: 'Annual Sports Meet',
    detail: 'Athletics and indoor games across all branches and years',
    icon: 'bi-trophy-fill',
  },
  {
    month: 'January',
    event: 'Republic Day Celebration',
    detail: 'Flag hoisting followed by patriotic cultural performances',
    icon: 'bi-flag-fill',
  },
  {
    month: 'February',
    event: 'Annual Cultural Festival',
    detail: 'The institute’s flagship two-day cultural celebration',
    icon: 'bi-music-note-beamed',
  },
  {
    month: 'March',
    event: 'International Women’s Day',
    detail: 'Talks, felicitations and awareness sessions on women’s empowerment',
    icon: 'bi-gender-female',
  },
  {
    month: 'April',
    event: 'Farewell for Final Year',
    detail: 'Send-off ceremony organised by the second-year students',
    icon: 'bi-mortarboard-fill',
  },
];

const HIGHLIGHTS = [
  { icon: 'bi-people-fill', value: '20+', label: 'Events Each Year' },
  { icon: 'bi-trophy-fill', value: '100+', label: 'Prizes Awarded' },
  { icon: 'bi-mic-fill', value: '15+', label: 'Guest Sessions' },
  { icon: 'bi-heart-fill', value: '6', label: 'Outreach Drives' },
];

export default function EventsPage() {
  return (
    <>
      <PageHeader
        icon="bi-balloon-fill"
        eyebrow="Life @ KMGGP"
        title="Events"
        subtitle="Technical festivals, cultural celebrations, sports and outreach — the calendar that shapes campus life."
        crumbs={[{ label: 'Life@KMGGP', href: '/life' }, { label: 'Events' }]}
      />

      <section className="stat-strip">
        <Container>
          <Row className="g-0">
            {HIGHLIGHTS.map((item) => (
              <Col md={3} sm={6} key={item.label}>
                <div className="stat-item">
                  <i className={`bi ${item.icon}`} />
                  <div className="stat-value">{item.value}</div>
                  <div className="stat-label">{item.label}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <SectionHead
            eyebrow="What Happens on Campus"
            icon="bi-calendar-heart-fill"
            title="Our Events Through the Year"
            subtitle="Every event is an opportunity for students to organise, perform, compete and lead."
          />

          <Row className="g-4">
            {CATEGORIES.map((category) => (
              <Col lg={4} md={6} key={category.title}>
                <div className="premium-card h-100 p-4">
                  <span className="icon-tile mb-4">
                    <i className={`bi ${category.icon}`} />
                  </span>
                  <h5 className="fw-bold mb-3">{category.title}</h5>
                  <p className="small mb-0">{category.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section" style={{ background: 'var(--paper)' }}>
        <Container>
          <SectionHead
            eyebrow="Annual Calendar"
            icon="bi-calendar3"
            title="Events at a Glance"
            subtitle="An indicative month-wise schedule for the academic session."
          />

          <div className="panel">
            <div className="panel-header">
              <i className="bi bi-calendar-week-fill" />
              Month-wise Event Schedule
            </div>
            <div className="panel-body p-0">
              <div className="table-wrap">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Month</th>
                      <th>Event</th>
                      <th>Details</th>
                    </tr>
                  </thead>
                  <tbody>
                    {CALENDAR.map((row) => (
                      <tr key={row.event}>
                        <td>{row.month}</td>
                        <td>
                          <i className={`bi ${row.icon} text-gold me-2`} />
                          {row.event}
                        </td>
                        <td>{row.detail}</td>
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
              Event dates are indicative and confirmed each session through the institute notice
              board and the academic calendar. Students are encouraged to participate and volunteer
              in organising committees.
            </p>
          </div>

          <div className="d-flex flex-wrap gap-3 mt-4">
            <Link href="/gallery" className="btn-gold">
              <i className="bi bi-images" />
              View Event Photographs
            </Link>
            <Link href="/academic/calendar" className="btn-outline-navy">
              <i className="bi bi-calendar3" />
              Academic Calendar
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
