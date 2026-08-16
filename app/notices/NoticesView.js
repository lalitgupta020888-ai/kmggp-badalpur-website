"use client";

import React, { useMemo, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';

const ALL = 'All';

/**
 * The notices page — the filterable timeline and the published orders.
 *
 * Content arrives as props from the route, which reads whatever the admin
 * panel currently holds; only the category filter needs browser state.
 */
export default function NoticesView({ notices, orders, categories, ticker }) {
  const [active, setActive] = useState(ALL);

  /* Counts come off the same list the timeline renders, so a category can
     never advertise a notice the filter then fails to show. */
  const counts = useMemo(() => {
    const tally = { [ALL]: notices.length };
    categories.forEach((category) => {
      tally[category] = notices.filter((notice) => notice.category === category).length;
    });
    return tally;
  }, [notices, categories]);

  const visible =
    active === ALL ? notices : notices.filter((notice) => notice.category === active);

  return (
    <>
      <PageHeader
        icon="bi-megaphone-fill"
        eyebrow="Announcements"
        title="Notices & Orders"
        subtitle="Every notice, announcement and official order published by the institute, newest first."
        crumbs={[{ label: 'Notices & Orders' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={8}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-megaphone-fill" />
                  Notice Board
                  <span className="panel-count">{visible.length}</span>
                </div>
                <div className="panel-body">
                  {/* Empty categories are still offered, showing 0 — a reader
                      learns there is nothing under Placements rather than
                      wondering where the filter went. */}
                  <div className="filter-chips">
                    {[ALL, ...categories].map((category) => (
                      <button
                        type="button"
                        key={category}
                        className={`filter-chip ${active === category ? 'is-active' : ''}`}
                        onClick={() => setActive(category)}
                        aria-pressed={active === category}
                      >
                        {category}
                        <span className="filter-chip-count">{counts[category]}</span>
                      </button>
                    ))}
                  </div>

                  {visible.length > 0 ? (
                    <ol className="notice-timeline">
                      {visible.map((notice) => (
                        <li className="notice-entry" key={notice.id}>
                          <span className="notice-entry-marker">
                            <i className={`bi ${notice.icon}`} />
                          </span>
                          <div className="notice-entry-body">
                            <div className="notice-entry-meta">
                              <span className="notice-entry-date">
                                <i className="bi bi-calendar3" />
                                {notice.date}
                              </span>
                              <span className="notice-chip">{notice.category}</span>
                              {notice.isNew && <span className="badge-new">NEW</span>}
                            </div>
                            <h5 className="notice-entry-title">{notice.title}</h5>
                            <Link href={notice.link} className="notice-entry-link">
                              Read the notice
                              <i className="bi bi-arrow-right" />
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <div className="empty-state">
                      <i className="bi bi-inbox" />
                      <p className="mb-0">
                        No notices under {active} at the moment. New announcements are posted here
                        as soon as they are issued.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </Col>

            <Col lg={4}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-link-45deg" />
                  Quick Links
                </div>
                <div className="panel-body">
                  {ticker.map((item) =>
                    item.external ? (
                      <a
                        href={item.link}
                        className="doc-link"
                        key={item.id}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <i className={`bi ${item.icon}`} />
                        <span className="flex-grow-1">{item.title}</span>
                        <i className="bi bi-box-arrow-up-right doc-link-external" />
                      </a>
                    ) : (
                      <Link href={item.link} className="doc-link" key={item.id}>
                        <i className={`bi ${item.icon}`} />
                        <span className="flex-grow-1">{item.title}</span>
                        <i className="bi bi-arrow-right-short" />
                      </Link>
                    )
                  )}

                  <div className="callout mt-4 mb-0">
                    <i className="bi bi-info-circle-fill" />
                    <p>
                      Notices are published here as they are issued. For anything not listed,
                      contact the institute office during working hours.
                    </p>
                  </div>
                </div>
              </div>

              <div className="side-cta mt-4">
                <i className="bi bi-envelope-paper-fill side-cta-icon" />
                <h6>Need Something Else?</h6>
                <p>The office can confirm any notice and issue a certified copy on request.</p>
                <Link href="/contact" className="btn-gold btn-sm">
                  Contact the Office
                  <i className="bi bi-arrow-right" />
                </Link>
              </div>
            </Col>
          </Row>

          <SectionHead
            eyebrow="Download Centre"
            icon="bi-file-earmark-pdf-fill"
            title="Orders & Circulars"
            subtitle="Official documents published by the institute, available to download in full."
          />

          <Row className="g-4">
            {orders.map((order) => (
              <Col lg={6} key={order.id}>
                <a
                  href={order.file}
                  className="order-card"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="icon-tile icon-tile-sm">
                    <i className={`bi ${order.icon}`} />
                  </span>
                  <span className="order-card-body">
                    <span className="order-card-title">{order.title}</span>
                    <span className="order-card-note">{order.note}</span>
                  </span>
                  <span className="order-card-action">
                    <i className="bi bi-download" />
                    PDF
                  </span>
                </a>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </>
  );
}

