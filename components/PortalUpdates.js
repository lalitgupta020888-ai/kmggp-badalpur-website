"use client";

import React, { useMemo, useState } from 'react';
import { Row, Col } from 'react-bootstrap';
import { PORTALS, TOPICS } from '@/lib/portals';

/**
 * Live updates from the government portals, on /notices.
 *
 * - Last-date tracker: every open deadline, soonest first, with days left.
 * - The feed: filter by portal and by topic (exam, result, last date…), or
 *   search — in Hindi or English, as the portals publish in both.
 * - Each portal's last successful read, so a stale source is visible rather
 *   than silently out of date.
 *
 * Items arrive shaped on the server (see getPortalFeed), so nothing here
 * depends on the visitor's clock.
 */

const PAGE = 15;

function relative(iso, nowIso) {
  if (!iso) return 'not yet';
  const mins = Math.round((new Date(nowIso) - new Date(iso)) / 60000);
  if (mins < 2) return 'just now';
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  return `${days} day${days === 1 ? '' : 's'} ago`;
}

export default function PortalUpdates({ notices = [], deadlines = [], status = null, renderedAt }) {
  const [source, setSource] = useState('all');
  const [topic, setTopic] = useState('all');
  const [query, setQuery] = useState('');
  const [shown, setShown] = useState(PAGE);
  const [allDeadlines, setAllDeadlines] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return notices.filter(
      (n) =>
        (source === 'all' || n.source === source) &&
        (topic === 'all' || n.topics.includes(topic)) &&
        (!q || `${n.title} ${n.section} ${n.sourceLabel}`.toLowerCase().includes(q)),
    );
  }, [notices, source, topic, query]);

  // Reset paging when the filters change.
  const key = `${source}|${topic}|${query}`;
  const [lastKey, setLastKey] = useState(key);
  if (key !== lastKey) {
    setLastKey(key);
    setShown(PAGE);
  }

  const sourceCounts = useMemo(() => {
    const tally = { all: notices.length };
    for (const n of notices) tally[n.source] = (tally[n.source] || 0) + 1;
    return tally;
  }, [notices]);

  const topicCounts = useMemo(() => {
    const tally = {};
    for (const n of notices) {
      if (source !== 'all' && n.source !== source) continue;
      for (const t of n.topics) tally[t] = (tally[t] || 0) + 1;
    }
    return tally;
  }, [notices, source]);

  const visibleDeadlines = allDeadlines ? deadlines : deadlines.slice(0, 6);

  if (notices.length === 0) {
    return (
      <div className="panel" id="portal-updates">
        <div className="panel-body text-center py-5">
          <span className="icon-tile mx-auto mb-3"><i className="bi bi-broadcast" aria-hidden="true" /></span>
          <h3 className="h5 fw-bold mb-2">Fetching the latest portal updates…</h3>
          <p className="small mb-0">
            Updates from BTEUP, JEECUP, the scholarship portals and AICTE appear here automatically.
            Please check back in a few minutes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div id="portal-updates" className="portal-updates">
      {deadlines.length > 0 && (
        <div className="deadline-tracker">
          <div className="deadline-tracker-head">
            <div>
              <span className="eyebrow">
                <i className="bi bi-alarm-fill" aria-hidden="true" />
                Do Not Miss
              </span>
              <h3 className="h4 fw-bold mb-0">Upcoming Last Dates</h3>
            </div>
            {deadlines.length > 6 && (
              <button type="button" className="btn-outline-navy btn-sm" onClick={() => setAllDeadlines((v) => !v)}>
                {allDeadlines ? 'Show fewer' : `Show all ${deadlines.length}`}
              </button>
            )}
          </div>
          <Row className="g-3">
            {visibleDeadlines.map((d) => (
              <Col md={6} xl={4} key={d.id}>
                <a
                  href={d.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`deadline-card ${d.deadline.days <= 3 ? 'is-urgent' : d.deadline.days <= 10 ? 'is-soon' : ''}`}
                >
                  <span className="deadline-count">
                    <strong>{d.deadline.days}</strong>
                    <small>{d.deadline.days === 1 ? 'day' : 'days'}</small>
                  </span>
                  <span className="deadline-body">
                    <span className={`source-chip ${d.tone}`}>{d.sourceLabel}</span>
                    <span className="deadline-title">{d.title}</span>
                    <span className="deadline-date">
                      <i className="bi bi-calendar-x" aria-hidden="true" />
                      Last date {d.deadline.label}
                    </span>
                  </span>
                </a>
              </Col>
            ))}
          </Row>
        </div>
      )}

      <div className="panel">
        <div className="panel-header">
          <i className="bi bi-broadcast-pin" aria-hidden="true" />
          Live Updates from Official Portals
          <span className="panel-count">{filtered.length}</span>
        </div>
        <div className="panel-body">
          <div className="portal-tabs" role="tablist" aria-label="Portal">
            {['all', ...Object.keys(PORTALS)].filter((k) => k === 'all' || sourceCounts[k]).map((k) => (
              <button
                type="button"
                role="tab"
                key={k}
                aria-selected={source === k}
                className={`${source === k ? 'is-active' : ''} ${PORTALS[k]?.tone || ''}`}
                onClick={() => {
                  setSource(k);
                  setTopic('all');
                }}
              >
                <i className={`bi ${PORTALS[k]?.icon || 'bi-grid-fill'}`} aria-hidden="true" />
                {k === 'all' ? 'All Portals' : PORTALS[k].label}
                <span className="count">{sourceCounts[k] || 0}</span>
              </button>
            ))}
          </div>

          <div className="portal-toolbar">
            <div className="filter-chips mb-0">
              <button type="button" className={`filter-chip ${topic === 'all' ? 'is-active' : ''}`} aria-pressed={topic === 'all'} onClick={() => setTopic('all')}>
                All topics
              </button>
              {TOPICS.filter((t) => topicCounts[t.key]).map((t) => (
                <button
                  type="button"
                  key={t.key}
                  className={`filter-chip ${topic === t.key ? 'is-active' : ''}`}
                  aria-pressed={topic === t.key}
                  onClick={() => setTopic(t.key)}
                >
                  <i className={`bi ${t.icon} me-1`} aria-hidden="true" />
                  {t.label}
                  <span className="filter-chip-count">{topicCounts[t.key]}</span>
                </button>
              ))}
            </div>
            <div className="input-icon portal-search premium-form">
              <i className="bi bi-search" aria-hidden="true" />
              <input
                type="search"
                className="form-control"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search updates — e.g. परीक्षा, scholarship, result"
                aria-label="Search portal updates"
              />
            </div>
          </div>

          {filtered.length === 0 ? (
            <p className="text-center text-muted small py-4 mb-0">No updates match these filters.</p>
          ) : (
            <ol className="portal-feed">
              {filtered.slice(0, shown).map((n) => (
                <li key={n.id} className="portal-feed-item">
                  <span className={`portal-feed-icon ${n.tone}`}>
                    <i className={`bi ${n.icon}`} aria-hidden="true" />
                  </span>
                  <div className="portal-feed-body">
                    <div className="portal-feed-meta">
                      <span className={`source-chip ${n.tone}`}>{n.sourceLabel}</span>
                      {n.section && <span className="portal-feed-section">{n.section}</span>}
                      {n.date && (
                        <span className="portal-feed-date">
                          <i className="bi bi-calendar3" aria-hidden="true" />
                          {n.date}
                        </span>
                      )}
                      {n.isNew && <span className="badge-new">NEW</span>}
                    </div>
                    <a href={n.link} target="_blank" rel="noopener noreferrer" className="portal-feed-title">
                      {n.title}
                      <i className="bi bi-box-arrow-up-right ms-2" aria-hidden="true" />
                      <span className="visually-hidden"> (opens the official portal in a new tab)</span>
                    </a>
                    {n.deadline && (
                      <span className={`deadline-pill ${n.deadline.days < 0 ? 'is-closed' : n.deadline.days <= 3 ? 'is-urgent' : ''}`}>
                        <i className="bi bi-alarm" aria-hidden="true" />
                        Last date {n.deadline.label} · {n.deadline.left}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}

          {filtered.length > shown && (
            <div className="text-center mt-3">
              <button type="button" className="btn-outline-navy" onClick={() => setShown((s) => s + PAGE)}>
                <i className="bi bi-chevron-down" aria-hidden="true" />
                Show more ({filtered.length - shown} remaining)
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="portal-sources">
        {Object.entries(PORTALS).map(([k, p]) => {
          const s = status?.sources?.[k];
          return (
            <a key={k} href={p.all} target="_blank" rel="noopener noreferrer" className={`portal-source ${p.tone}`}>
              <i className={`bi ${p.icon}`} aria-hidden="true" />
              <span>
                <strong>{p.label}</strong>
                <small>{p.name}</small>
                <small className={`portal-source-state ${!s?.updatedAt || !s.ok ? 'is-stale' : ''}`}>
                  {s?.updatedAt
                    ? `Synced ${relative(s.updatedAt, renderedAt)}${!s.ok ? ' · portal not responding, showing last copy' : ''}`
                    : s && !s.ok
                      ? 'Portal not responding — retrying automatically'
                      : 'Waiting for first sync'}
                </small>
              </span>
              <i className="bi bi-box-arrow-up-right ms-auto" aria-hidden="true" />
            </a>
          );
        })}
      </div>
      <p className="small text-muted mt-3 mb-0">
        <i className="bi bi-info-circle me-1" aria-hidden="true" />
        These updates are read automatically from each portal&rsquo;s official website and link to
        the original notice. Always confirm dates on the official portal.
      </p>
    </div>
  );
}
