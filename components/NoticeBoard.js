"use client";

import React, { useMemo, useState } from 'react';
import Link from 'next/link';

/**
 * The notice panel beside the hero on the home page.
 *
 * Two streams meet here: the institute's own notices (kept in the admin
 * panel) and the updates read automatically from BTEUP, JEECUP, the UP and
 * National scholarship portals and AICTE. Tabs separate them; "All" merges
 * them newest first. The nearest open last date rides on top as a strip, so a
 * deadline is never buried under newer news.
 *
 * Portal items arrive already shaped by `asNotice` (lib/portals.js) on the
 * server, dates and "days left" included, so nothing here depends on the
 * visitor's clock and the markup hydrates cleanly.
 */

const TABS = [
  { key: 'all', label: 'All', icon: 'bi-grid-fill' },
  { key: 'college', label: 'College', icon: 'bi-building' },
  { key: 'bteup', label: 'BTEUP', icon: 'bi-building-fill-check' },
  { key: 'jeecup', label: 'JEECUP', icon: 'bi-clipboard2-check-fill' },
  { key: 'scholarship', label: 'Scholarship', icon: 'bi-cash-coin', sources: ['upscholarship', 'nsp'] },
  { key: 'aicte', label: 'AICTE', icon: 'bi-bank2' },
];

function timeOf(notice) {
  const t = new Date(notice.sortDate || notice.date || 0).getTime();
  return Number.isFinite(t) ? t : 0;
}

function NoticeLink({ notice, children }) {
  if (!notice.link) return <span>{children}</span>;
  if (notice.external) {
    return (
      <a href={notice.link} target="_blank" rel="noopener noreferrer">
        {children}
        <span className="visually-hidden"> (opens the official portal in a new tab)</span>
      </a>
    );
  }
  return <Link href={notice.link}>{children}</Link>;
}

export default function NoticeBoard({ notices = [], portal = [], deadlines = [], limit = 12 }) {
  const [tab, setTab] = useState('all');

  const college = useMemo(() => notices.map((n) => ({ ...n, source: 'college' })), [notices]);

  const counts = useMemo(() => {
    const tally = { all: college.length + portal.length, college: college.length };
    for (const t of TABS.slice(2)) tally[t.key] = portal.filter((p) => (t.sources || [t.key]).includes(p.source)).length;
    return tally;
  }, [college, portal]);

  const shown = useMemo(() => {
    if (tab === 'college') return college.slice(0, limit);
    const def = TABS.find((t) => t.key === tab);
    if (tab !== 'all') return portal.filter((p) => (def.sources || [def.key]).includes(p.source)).slice(0, limit);
    // "All": the institute's own pinned notices first (they are curated), then
    // the portals newest first.
    const pinned = college.slice(0, 3);
    const rest = [...college.slice(3), ...portal].sort((a, b) => timeOf(b) - timeOf(a));
    return [...pinned, ...rest].slice(0, limit);
  }, [tab, college, portal, limit]);

  const next = deadlines[0];

  return (
    <section className="notice-card notice-card-tabs" aria-label="Notice board and updates">
      <div className="notice-head">
        <i className="bi bi-megaphone-fill" aria-hidden="true" />
        Notice Board &amp; Updates
        {portal.length > 0 && (
          <span className="notice-live" title="Updated automatically from the official portals">
            <span className="notice-live-dot" aria-hidden="true" />
            Live
          </span>
        )}
      </div>

      {next && (
        <a href={next.link} target="_blank" rel="noopener noreferrer" className={`deadline-strip ${next.deadline.days <= 3 ? 'is-urgent' : ''}`}>
          <span className="deadline-strip-when">
            <i className="bi bi-alarm-fill" aria-hidden="true" />
            {next.deadline.left}
          </span>
          <span className="deadline-strip-text">
            <strong>{next.sourceLabel}:</strong> {next.title}
            <span className="deadline-strip-date">Last date {next.deadline.label}</span>
          </span>
        </a>
      )}

      {portal.length > 0 && (
        <div className="notice-tabs" role="tablist" aria-label="Filter notices by source">
          {TABS.filter((t) => t.key === 'all' || t.key === 'college' || counts[t.key] > 0).map((t) => (
            <button
              key={t.key}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              className={tab === t.key ? 'is-active' : ''}
              onClick={() => setTab(t.key)}
            >
              {t.label}
              <span className="count">{counts[t.key]}</span>
            </button>
          ))}
        </div>
      )}

      {shown.length === 0 ? (
        <div className="notice-list px-3 py-4 text-center text-muted small">
          There are no notices at the moment.
        </div>
      ) : (
        <ul className="notice-list" role="tabpanel">
          {shown.map((notice) => (
            <li className="notice-item" key={notice.id}>
              <span className={`icon-tile icon-tile-sm ${notice.tone || ''}`}>
                <i className={`bi ${notice.icon}`} aria-hidden="true" />
              </span>
              <div className="min-w-0">
                {notice.sourceLabel && <span className={`source-chip ${notice.tone || ''}`}>{notice.sourceLabel}</span>}
                <NoticeLink notice={notice}>
                  <span className="notice-title-text">{notice.title}</span>
                  {notice.isNew && <span className="badge-new">NEW</span>}
                </NoticeLink>
                {(notice.date || notice.deadline) && (
                  <div className="notice-date">
                    {notice.date && (
                      <>
                        <i className="bi bi-clock" aria-hidden="true" />
                        {notice.date}
                      </>
                    )}
                    {notice.deadline && notice.deadline.days >= 0 && (
                      <span className={`deadline-pill ${notice.deadline.days <= 3 ? 'is-urgent' : ''}`}>
                        <i className="bi bi-alarm" aria-hidden="true" />
                        Last date {notice.deadline.label} · {notice.deadline.left}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="notice-foot">
        <Link href="/notices#portal-updates">
          View All Notices &amp; Portal Updates <i className="bi bi-arrow-right" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
