"use client";

import React, { Suspense, useEffect, useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import IgrsShell from '@/components/igrs/IgrsShell';
import {
  STATUSES,
  STATUS_META,
  TYPE_META,
  categoryLabel,
  formatDate,
} from '@/lib/igrs';
import { lookupGrievance } from '@/app/igrs/actions';

function StatusPill({ status }) {
  const meta = STATUS_META[status] || STATUS_META.Pending;
  return (
    <span className={`status-pill ${meta.tone}`}>
      <i className={`bi ${meta.icon}`} aria-hidden="true" />
      {status}
    </span>
  );
}

/** Horizontal Pending → In Progress → Resolved tracker. Rejected cases stop. */
function StatusTrack({ status }) {
  const flow = ['Pending', 'In Progress', 'Resolved'];
  const rejected = status === 'Rejected';
  const activeIndex = rejected ? 0 : flow.indexOf(status);

  return (
    <ol className="status-track">
      {flow.map((step, i) => (
        <li
          key={step}
          className={`status-track-step ${i <= activeIndex ? 'is-done' : ''} ${
            i === activeIndex && !rejected ? 'is-current' : ''
          }`}
        >
          <span className="status-track-dot">
            <i className={`bi ${i < activeIndex ? 'bi-check-lg' : STATUS_META[step].icon}`} aria-hidden="true" />
          </span>
          <span className="status-track-label">{step}</span>
        </li>
      ))}
    </ol>
  );
}

function StatusLookup() {
  // A receipt links here as /igrs/status?ref=GR… — that number is looked up
  // straight away, so the visitor sees the case without retyping it.
  const searchParams = useSearchParams();
  const preset = searchParams.get('ref') || '';

  const [refInput, setRefInput] = useState(preset);
  const [lookup, setLookup] = useState({ state: 'idle' });

  // Lookups go to the server, which returns only the case's status fields.
  const runLookup = async (ref) => {
    const target = String(ref || '').replace(/\s+/g, '').toUpperCase();
    if (!target) return setLookup({ state: 'idle' });
    setLookup({ state: 'loading' });
    const result = await lookupGrievance(target).catch(() => ({ error: true }));
    if (result.error) return setLookup({ state: 'error' });
    setLookup(result.grievance ? { state: 'found', g: result.grievance } : { state: 'missing' });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- a receipt link carries ?ref=
    if (preset) runLookup(preset);
  }, [preset]);

  const handleSubmit = (event) => {
    event.preventDefault();
    runLookup(refInput);
  };

  const g = lookup.g || null;

  return (
    <Row className="g-4">
      <Col xl={8}>
        <div className="panel">
          <div className="panel-header">
            <i className="bi bi-search" aria-hidden="true" />
            Track Your Grievance
          </div>
          <div className="panel-body">
            <Form className="premium-form" onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label>
                  Reference Number <span className="text-gold">*</span>
                </Form.Label>
                <div className="input-icon">
                  <i className="bi bi-hash" aria-hidden="true" />
                  <Form.Control
                    type="text"
                    value={refInput}
                    onChange={(e) => setRefInput(e.target.value)}
                    placeholder="e.g. GRS261122K7Q4M"
                    autoCapitalize="characters"
                    spellCheck={false}
                    className="text-uppercase ref-input"
                    required
                  />
                </div>
                <Form.Text className="text-muted">
                  Enter the reference number issued when you submitted the grievance.
                </Form.Text>
              </Form.Group>

              <Button type="submit" className="btn-gold w-100 justify-content-center">
                <i className="bi bi-search" aria-hidden="true" />
                Check Status
              </Button>
            </Form>

            {lookup.state === 'error' && (
              <Alert variant="danger" role="alert" className="border-0 mt-4 small">
                Could not check the status right now. Please try again in a moment.
              </Alert>
            )}

            {lookup.state === 'missing' && (
              <Alert variant="danger" role="alert" className="d-flex align-items-start gap-3 border-0 mt-4 small">
                <i className="bi bi-exclamation-circle-fill fs-5 lh-1" aria-hidden="true" />
                <span>
                  No grievance found with that reference number. Please check it and try again — the
                  number is case-insensitive but must be entered in full.
                </span>
              </Alert>
            )}

            {lookup.state === 'found' && g && (
              <div className="mt-4">
                <div className="gold-rule-thin mb-4" />

                <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-4">
                  <h3 className="h5 fw-bold mb-0">{g.subject}</h3>
                  <StatusPill status={g.status} />
                </div>

                <StatusTrack status={g.status} />

                <div className="contact-line">
                  <span className="icon-tile icon-tile-sm"><i className="bi bi-hash" aria-hidden="true" /></span>
                  <div>
                    <div className="label">Reference Number</div>
                    <p className="value">{g.refNumber}</p>
                  </div>
                </div>
                <div className="contact-line">
                  <span className="icon-tile icon-tile-sm">
                    <i className={`bi ${TYPE_META[g.type]?.icon || 'bi-tag-fill'}`} aria-hidden="true" />
                  </span>
                  <div>
                    <div className="label">Grievance Type</div>
                    <p className="value">{TYPE_META[g.type]?.label || g.type}</p>
                  </div>
                </div>
                <div className="contact-line">
                  <span className="icon-tile icon-tile-sm"><i className="bi bi-tag-fill" aria-hidden="true" /></span>
                  <div>
                    <div className="label">Category</div>
                    <p className="value">{categoryLabel(g.type, g.category) || '—'}</p>
                  </div>
                </div>
                <div className="contact-line">
                  <span className="icon-tile icon-tile-sm"><i className="bi bi-calendar3" aria-hidden="true" /></span>
                  <div>
                    <div className="label">Submitted On</div>
                    <p className="value">{formatDate(g.submittedOn)}</p>
                  </div>
                </div>
                <div className="contact-line">
                  <span className="icon-tile icon-tile-sm"><i className="bi bi-clock-history" aria-hidden="true" /></span>
                  <div>
                    <div className="label">Last Updated</div>
                    <p className="value">{formatDate(g.lastUpdated)}</p>
                  </div>
                </div>
                <div className="contact-line">
                  <span className="icon-tile icon-tile-sm"><i className="bi bi-chat-left-text-fill" aria-hidden="true" /></span>
                  <div>
                    <div className="label">Committee Remarks</div>
                    <p className="value">{g.remarks}</p>
                  </div>
                </div>

                {g.history?.length > 0 && (
                  <div className="igrs-public-history">
                    <h4 className="h6 fw-bold">
                      <i className="bi bi-clock-history me-2 text-gold" aria-hidden="true" />
                      Case Timeline
                    </h4>
                    <ol>
                      {g.history
                        .slice()
                        .reverse()
                        .map((h, i) => (
                          <li key={`${h.at}-${i}`} className={STATUS_META[h.status]?.tone}>
                            <span className="dot">
                              <i className={`bi ${STATUS_META[h.status]?.icon || 'bi-circle'}`} aria-hidden="true" />
                            </span>
                            <div>
                              <div className="d-flex flex-wrap gap-2 align-items-baseline">
                                <strong>{h.status}</strong>
                                <span className="when">{formatDate(h.at)}</span>
                              </div>
                              {h.remarks && <p>{h.remarks}</p>}
                            </div>
                          </li>
                        ))}
                    </ol>
                  </div>
                )}

                <div className="d-flex flex-wrap gap-2 mt-4 no-print">
                  <button type="button" className="btn-outline-navy btn-sm" onClick={() => window.print()}>
                    <i className="bi bi-printer" aria-hidden="true" />
                    Print Status
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Col>

      <Col xl={4}>
        <div className="panel">
          <div className="panel-header">
            <i className="bi bi-info-circle-fill" aria-hidden="true" />
            What the Statuses Mean
          </div>
          <div className="panel-body">
            {STATUSES.map((s) => (
              <div className="contact-line" key={s}>
                <span className="icon-tile icon-tile-sm">
                  <i className={`bi ${STATUS_META[s].icon}`} aria-hidden="true" />
                </span>
                <div>
                  <div className="label">{s}</div>
                  <p className="value">
                    {s === 'Pending' && 'Received and queued for committee review.'}
                    {s === 'In Progress' && 'The committee is actively examining your case.'}
                    {s === 'Resolved' && 'Action has been taken — see the remarks.'}
                    {s === 'Rejected' && 'Closed without action; the reason is in the remarks.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="side-cta mt-4">
          <i className="bi bi-question-circle side-cta-icon" aria-hidden="true" />
          <h4 className="h6">Lost Your Reference Number?</h4>
          <p>Contact the institute office with your name and the date of submission.</p>
          <Link href="/contact" className="btn-gold btn-sm">
            Contact Us
            <i className="bi bi-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </Col>
    </Row>
  );
}

export default function GrievanceStatusPage() {
  return (
    <IgrsShell
      icon="bi-search"
      title="Check Grievance Status"
      crumb="Check Status"
      subtitle="Track any grievance — student, parent or employee — using the reference number issued at the time of submission."
    >
      <Suspense
        fallback={
          <div className="panel">
            <div className="panel-body text-center py-5">
              <span className="icon-tile mx-auto mb-3"><i className="bi bi-hourglass-split" aria-hidden="true" /></span>
              <p className="small mb-0">Loading the status tracker…</p>
            </div>
          </div>
        }
      >
        <StatusLookup />
      </Suspense>
    </IgrsShell>
  );
}
