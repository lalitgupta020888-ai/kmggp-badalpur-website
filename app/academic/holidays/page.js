"use client";

import React from 'react';
import { Container } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';

const HOLIDAYS = [
  { date: 'August 15, 2026', occasion: 'Independence Day', day: 'Saturday', icon: 'bi-flag-fill' },
  { date: 'October 2, 2026', occasion: 'Gandhi Jayanti', day: 'Friday', icon: 'bi-flower1' },
  { date: 'October 24, 2026', occasion: 'Diwali', day: 'Saturday', icon: 'bi-lamp-fill' },
  { date: 'November 5, 2026', occasion: 'Guru Nanak Jayanti', day: 'Thursday', icon: 'bi-brightness-high-fill' },
  { date: 'December 25, 2026', occasion: 'Christmas Day', day: 'Friday', icon: 'bi-snow' },
  { date: 'January 26, 2027', occasion: 'Republic Day', day: 'Tuesday', icon: 'bi-flag-fill' },
  { date: 'March 4, 2027', occasion: 'Holi', day: 'Thursday', icon: 'bi-palette-fill' },
];

export default function ListOfHolidays() {
  return (
    <>
      <PageHeader
        icon="bi-calendar-event"
        eyebrow="Academics"
        title="List of Holidays"
        subtitle="Gazetted and institutional holidays observed during the academic session 2026-27."
        crumbs={[{ label: 'Academics' }, { label: 'List of Holidays' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <div className="panel">
            <div className="panel-header">
              <i className="bi bi-calendar2-heart-fill" />
              Holiday Calendar 2026-27
            </div>
            <div className="panel-body p-0">
              <div className="table-wrap">
                <table className="premium-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Occasion</th>
                      <th>Day</th>
                    </tr>
                  </thead>
                  <tbody>
                    {HOLIDAYS.map((holiday) => (
                      <tr key={holiday.date}>
                        <td>
                          <i className="bi bi-calendar3 text-gold me-2" />
                          {holiday.date}
                        </td>
                        <td>
                          <i className={`bi ${holiday.icon} text-gold me-2`} />
                          {holiday.occasion}
                        </td>
                        <td>{holiday.day}</td>
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
              Holidays follow the list notified by the Government of Uttar Pradesh and are subject to
              revision by official order. Any change will be announced on the institute notice board.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
