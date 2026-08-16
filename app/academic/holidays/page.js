import React from 'react';
import { Container } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';
import { getSection } from '@/lib/server/sections';


export default async function ListOfHolidays() {
  const HOLIDAYS = await getSection('holidays');

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

          <div className="download-note mt-4">
            <p>
              The complete holiday list for the session 2026-27, as notified by the Government of
              Uttar Pradesh, is available for download.
            </p>
            <a
              className="btn-gold"
              href="/documents/holiday-list-2026-27.pdf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="bi bi-file-earmark-pdf-fill" />
              Click Here
            </a>
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
