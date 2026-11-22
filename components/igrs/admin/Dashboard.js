"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Row, Col, Form, Button, Alert, Modal } from 'react-bootstrap';
import {
  STATUSES,
  STATUS_META,
  TYPE_META,
  categoryLabel,
  complainantName,
  formatDate,
  identityRows,
} from '@/lib/igrs';
import {
  changeIgrsPasswordAction,
  fetchGrievances,
  saveGrievanceUpdate,
} from '@/app/igrs/admin/actions';
import { PasswordInput, StrengthMeter } from './AuthPanels';

const PAGE_SIZE = 12;
// Matches the server limit (lib/server/igrs-letters.js); Vercel caps bodies at ~4.5 MB.
const LETTER_MAX_BYTES = 4 * 1024 * 1024;

export function StatusPill({ status }) {
  const meta = STATUS_META[status] || STATUS_META.Pending;
  return (
    <span className={`status-pill ${meta.tone}`}>
      <i className={`bi ${meta.icon}`} aria-hidden="true" />
      {status}
    </span>
  );
}

/** Days since a date, for the "waiting" badge on open cases. */
function ageInDays(iso) {
  const then = new Date(iso).getTime();
  if (!Number.isFinite(then)) return 0;
  return Math.floor((Date.now() - then) / 86400000);
}

/* ----------------------------------- CSV ---------------------------------- */

function toCsv(list, options) {
  const quote = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  const header = ['Reference', 'Type', 'Status', 'Submitted', 'Last updated', 'Name', 'Identity', 'Mobile', 'Email', 'Category', 'Subject', 'Description', 'Remarks'];
  const rows = list.map((g) => {
    const identity = identityRows(g, options)
      .filter(([label]) => !['Mobile', 'Email'].includes(label))
      .map(([label, value]) => `${label}: ${value || '—'}`)
      .join(' | ');
    return [
      g.refNumber,
      TYPE_META[g.type]?.label,
      g.status,
      formatDate(g.submittedOn),
      formatDate(g.lastUpdated),
      complainantName(g),
      identity,
      g.phone,
      g.email,
      categoryLabel(g.type, g.category),
      g.subject,
      g.description,
      g.remarks,
    ].map(quote).join(',');
  });
  // BOM so Excel opens Hindi names and the ₹ sign correctly.
  return '﻿' + [header.map(quote).join(','), ...rows].join('\r\n');
}

function download(name, text) {
  const blob = new Blob([text], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/* --------------------------- Change password modal ------------------------ */

function ChangePasswordModal({ show, onHide, onSignedOut }) {
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const close = () => {
    setCurrent('');
    setNext('');
    setConfirm('');
    setError('');
    setDone(false);
    onHide();
  };

  const submit = async (event) => {
    event.preventDefault();
    setBusy(true);
    setError('');
    const result = await changeIgrsPasswordAction(current, next, confirm).catch(() => ({
      ok: false,
      error: 'Could not reach the server.',
    }));
    setBusy(false);
    if (result.signedOut) return onSignedOut();
    if (!result.ok) return setError(result.error);
    setDone(true);
    return undefined;
  };

  return (
    <Modal show={show} onHide={close} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h5">
          <i className="bi bi-key-fill me-2 text-gold" aria-hidden="true" />
          Change Password
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {done ? (
          <Alert variant="success" className="border-0 mb-0">
            <i className="bi bi-check-circle-fill me-2" aria-hidden="true" />
            Password changed. Any other device signed in to the dashboard has been signed out.
          </Alert>
        ) : (
          <Form className="premium-form" id="igrs-change-password" onSubmit={submit}>
            <Form.Group className="mb-3" controlId="igrs-current">
              <Form.Label>Current password</Form.Label>
              <PasswordInput id="igrs-current" value={current} onChange={setCurrent} placeholder="Current password" autoComplete="current-password" autoFocus />
            </Form.Group>
            <Form.Group className="mb-3" controlId="igrs-next">
              <Form.Label>New password</Form.Label>
              <PasswordInput id="igrs-next" value={next} onChange={setNext} placeholder="New password" autoComplete="new-password" />
              <StrengthMeter password={next} />
            </Form.Group>
            <Form.Group className="mb-2" controlId="igrs-confirm">
              <Form.Label>Confirm new password</Form.Label>
              <PasswordInput id="igrs-confirm" value={confirm} onChange={setConfirm} placeholder="Type it again" autoComplete="new-password" />
            </Form.Group>
            {error && <Alert variant="danger" className="border-0 small mt-3 mb-0">{error}</Alert>}
          </Form>
        )}
      </Modal.Body>
      <Modal.Footer>
        {done ? (
          <Button className="btn-gold" onClick={close}>Done</Button>
        ) : (
          <>
            <button type="button" className="btn-outline-navy" onClick={close}>Cancel</button>
            <Button type="submit" form="igrs-change-password" className="btn-gold" disabled={busy}>
              {busy ? 'Saving…' : 'Change Password'}
            </Button>
          </>
        )}
      </Modal.Footer>
    </Modal>
  );
}

/* ------------------------------- One grievance ----------------------------- */

function GrievanceCard({ g, options, onSave, saving, saved }) {
  const [status, setStatus] = useState(g.status);
  // Remarks are typed fresh for every update — the box starts empty.
  const [remarks, setRemarks] = useState('');
  const [letter, setLetter] = useState(null);
  const [letterError, setLetterError] = useState('');
  const [notify, setNotify] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const fileRef = useRef(null);

  // Fresh data from the server (after a save or a refresh) resets the draft.
  const [seen, setSeen] = useState(g.lastUpdated);
  if (seen !== g.lastUpdated) {
    setSeen(g.lastUpdated);
    setStatus(g.status);
    setRemarks('');
    setLetter(null);
    setLetterError('');
  }

  const hasLetterOnFile = (g.history || []).some((h) => h.letter?.file);
  const needsLetter = status === 'Resolved' && !hasLetterOnFile && !letter;
  const ready = remarks.trim().length > 0 && !needsLetter;

  const pickLetter = (file) => {
    setLetterError('');
    if (!file) return setLetter(null);
    if (file.type !== 'application/pdf' && !/\.pdf$/i.test(file.name)) {
      setLetterError('Only a PDF file can be attached.');
      return setLetter(null);
    }
    if (file.size > LETTER_MAX_BYTES) {
      setLetterError('The PDF must be under 4 MB. Scan at a lower resolution or compress it.');
      return setLetter(null);
    }
    return setLetter(file);
  };

  const clearLetter = () => {
    setLetter(null);
    setLetterError('');
    if (fileRef.current) fileRef.current.value = '';
  };
  const open = g.status === 'Pending' || g.status === 'In Progress';
  const age = ageInDays(g.submittedOn);
  const long = String(g.description || '').length > 280;
  const history = (g.history || []).slice().reverse();

  return (
    <article className={`panel igrs-case h-100 ${open && age >= 15 ? 'is-overdue' : ''}`} id={`case-${g.refNumber}`}>
      <div className="panel-header">
        <i className={`bi ${TYPE_META[g.type]?.icon || 'bi-tag-fill'}`} aria-hidden="true" />
        <span className="text-truncate">{g.subject || 'No Subject'}</span>
      </div>
      <div className="panel-body">
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
          <span className="ref-inline">
            <i className="bi bi-hash" aria-hidden="true" />
            {g.refNumber}
          </span>
          <div className="d-flex align-items-center gap-2">
            {open && age >= 7 && (
              <span className={`age-chip ${age >= 15 ? 'is-late' : ''}`} title="Days since submission">
                <i className="bi bi-hourglass-bottom" aria-hidden="true" />
                {age} days
              </span>
            )}
            <StatusPill status={g.status} />
          </div>
        </div>

        <div className="igrs-case-tags">
          <span><i className={`bi ${TYPE_META[g.type]?.icon}`} aria-hidden="true" />{TYPE_META[g.type]?.label}</span>
          <span><i className="bi bi-tag" aria-hidden="true" />{categoryLabel(g.type, g.category)}</span>
          <span><i className="bi bi-calendar3" aria-hidden="true" />{formatDate(g.submittedOn)}</span>
        </div>

        <div className="table-wrap mb-3">
          <table className="premium-table kv-table">
            <tbody>
              {identityRows(g, options).map(([label, value]) => (
                <tr key={label}>
                  <td>{label}</td>
                  <td>
                    {label === 'Mobile' && value ? (
                      <a href={`tel:+91${value}`}>{value}</a>
                    ) : label === 'Email' && value ? (
                      <a href={`mailto:${value}?subject=${encodeURIComponent(`Your grievance ${g.refNumber}`)}`}>{value}</a>
                    ) : (
                      value || '—'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="igrs-case-desc">
          <strong>Description</strong>
          <p className={long && !expanded ? 'is-clamped' : ''}>{g.description}</p>
          {long && (
            <button type="button" className="link-button small" onClick={() => setExpanded((v) => !v)}>
              {expanded ? 'Show less' : 'Read full description'}
            </button>
          )}
        </div>

        {history.length > 0 && (
          <details className="igrs-history">
            <summary>
              <i className="bi bi-clock-history" aria-hidden="true" />
              Case history ({history.length})
            </summary>
            <ol>
              {history.map((h, i) => (
                <li key={`${h.at}-${i}`}>
                  <StatusPill status={h.status} />
                  <span className="when">{formatDate(h.at)}</span>
                  {h.remarks && <p>{h.remarks}</p>}
                  {h.letter?.file && (
                    <a className="letter-link" href={`/igrs/letter/${h.letter.file}`} target="_blank" rel="noopener noreferrer">
                      <i className="bi bi-file-earmark-pdf-fill" aria-hidden="true" />
                      {h.letter.name}
                    </a>
                  )}
                </li>
              ))}
            </ol>
          </details>
        )}

        <div className="gold-rule-thin my-3" />

        <div className="premium-form no-print">
          <Form.Label htmlFor={`status-${g.refNumber}`}>Update Status</Form.Label>
          <div className="igrs-status-choices mb-3" role="radiogroup" id={`status-${g.refNumber}`}>
            {STATUSES.map((s) => (
              <button
                type="button"
                key={s}
                role="radio"
                aria-checked={status === s}
                className={`${STATUS_META[s].tone} ${status === s ? 'is-active' : ''}`}
                onClick={() => setStatus(s)}
              >
                <i className={`bi ${STATUS_META[s].icon}`} aria-hidden="true" />
                {s}
              </button>
            ))}
          </div>

          {g.remarks && (
            <div className="igrs-last-remark">
              <span>Last remark</span>
              {g.remarks}
            </div>
          )}

          <Form.Label htmlFor={`remarks-${g.refNumber}`}>
            Committee Remarks <span className="text-gold">*</span>
          </Form.Label>
          <Form.Control
            id={`remarks-${g.refNumber}`}
            as="textarea"
            rows={3}
            maxLength={2000}
            className="mb-3"
            value={remarks}
            placeholder={
              status === 'Resolved'
                ? 'Describe how the grievance was resolved. The complainant sees this.'
                : 'Type the committee remarks for this update. The complainant sees this.'
            }
            onChange={(e) => setRemarks(e.target.value)}
          />

          <Form.Label htmlFor={`letter-${g.refNumber}`}>
            {status === 'Resolved' ? 'Resolution Letter (PDF)' : 'Letter (PDF, optional)'}
            {needsLetter && <span className="text-gold"> *</span>}
          </Form.Label>
          <div className={`letter-drop ${letter ? 'has-file' : ''} ${needsLetter ? 'is-required' : ''}`}>
            <input
              ref={fileRef}
              id={`letter-${g.refNumber}`}
              type="file"
              accept="application/pdf,.pdf"
              onChange={(e) => pickLetter(e.target.files?.[0] || null)}
            />
            <i className={`bi ${letter ? 'bi-file-earmark-pdf-fill' : 'bi-cloud-arrow-up'}`} aria-hidden="true" />
            <span className="letter-drop-text">
              {letter ? (
                <>
                  <strong>{letter.name}</strong>
                  <small>{(letter.size / 1024 / 1024).toFixed(2)} MB · click to change</small>
                </>
              ) : (
                <>
                  <strong>Choose PDF letter</strong>
                  <small>
                    {status === 'Resolved' && hasLetterOnFile
                      ? 'A letter is already on file; attach another only if needed'
                      : 'Signed letter scanned as PDF · up to 4 MB'}
                  </small>
                </>
              )}
            </span>
            {letter && (
              <button type="button" className="letter-clear" aria-label="Remove the chosen letter" onClick={clearLetter}>
                <i className="bi bi-x-lg" aria-hidden="true" />
              </button>
            )}
          </div>
          {letterError && <p className="small text-danger mt-1 mb-0">{letterError}</p>}
          {needsLetter && !letterError && (
            <p className="small mt-1 mb-0" style={{ color: '#a52222' }}>
              <i className="bi bi-info-circle me-1" aria-hidden="true" />
              Attach the resolution letter to mark this grievance Resolved.
            </p>
          )}
          <div className="mb-3" />
          <Form.Check
            type="checkbox"
            id={`notify-${g.refNumber}`}
            className="mb-3 small"
            checked={notify}
            onChange={(e) => setNotify(e.target.checked)}
            label="Email the complainant about this update"
          />

          <div className="d-flex gap-2">
            <button
              type="button"
              className="btn-gold flex-grow-1 justify-content-center"
              onClick={() => onSave(g, { status, remarks, notify, letter })}
              disabled={saving || !ready}
              title={!remarks.trim() ? 'Type the committee remarks first' : needsLetter ? 'Attach the resolution letter first' : undefined}
            >
              {saving ? <span className="spinner-border spinner-border-sm" aria-hidden="true" /> : <i className="bi bi-save-fill" aria-hidden="true" />}
              {saving ? (letter ? 'Uploading…' : 'Saving…') : status === 'Resolved' ? 'Resolve Grievance' : 'Save Update'}
            </button>
            <button
              type="button"
              className="btn-outline-navy"
              title="Print this case"
              aria-label="Print this case"
              onClick={(event) => {
                // Print just this case: mark it, hide the rest (see globals.css).
                const card = event.currentTarget.closest('.igrs-case');
                card?.classList.add('print-target');
                document.body.dataset.printCase = g.refNumber;
                window.print();
                delete document.body.dataset.printCase;
                card?.classList.remove('print-target');
              }}
            >
              <i className="bi bi-printer" aria-hidden="true" />
            </button>
          </div>

          {saved && (
            <p className="small text-center mt-2 mb-0" style={{ color: 'var(--gold-700)' }} role="status">
              <i className="bi bi-check-circle-fill me-1" aria-hidden="true" />
              Updated{saved === 'mailed' ? ' and the complainant has been emailed' : ''}
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

/* --------------------------------- Dashboard ------------------------------ */

export default function Dashboard({ onLogout, options }) {
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sort, setSort] = useState('newest');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [savingRef, setSavingRef] = useState('');
  const [saved, setSaved] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [refreshedAt, setRefreshedAt] = useState(null);

  // Grievances live in Supabase; the server returns them only to a signed-in
  // committee session. A lapsed session sends the member back to the login.
  const load = useCallback(async () => {
    setLoading(true);
    const result = await fetchGrievances().catch(() => ({ error: 'Could not load grievances.', list: [] }));
    if (result.signedOut) {
      onLogout('Your session has ended. Please sign in again.');
      return;
    }
    setGrievances(result.list || []);
    setLoadError(result.error || '');
    setLoading(false);
    setRefreshedAt(new Date());
  }, [onLogout]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetching on mount
    load();
  }, [load]);

  const handleSave = async (g, { status, remarks, notify, letter }) => {
    if (savingRef) return;
    setSavingRef(g.refNumber);
    const form = new FormData();
    form.set('type', g.type);
    form.set('refNumber', g.refNumber);
    form.set('status', status);
    form.set('remarks', remarks);
    form.set('notify', notify ? 'true' : 'false');
    if (letter) form.set('letter', letter);
    const result = await saveGrievanceUpdate(form)
      .catch(() => ({ error: 'Could not save the update. If a letter was attached, check that it is a PDF under 4 MB.' }))
      .finally(() => setSavingRef(''));
    if (result.signedOut) {
      onLogout('Your session has ended. Please sign in again.');
      return;
    }
    if (result.error) {
      window.alert(result.error);
      return;
    }
    setGrievances((list) => list.map((item) => (item.refNumber === g.refNumber ? result.grievance : item)));
    setSaved((s) => ({ ...s, [g.refNumber]: notify && result.changed ? 'mailed' : 'saved' }));
    window.setTimeout(() => setSaved((s) => ({ ...s, [g.refNumber]: '' })), 3000);
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    const list = grievances
      .filter((g) => (filterType === 'all' ? true : g.type === filterType))
      .filter((g) => (filterStatus === 'all' ? true : g.status === filterStatus))
      .filter((g) => {
        if (!term) return true;
        const haystack = [
          g.refNumber, g.name, g.parentName, g.enrollmentNumber, g.employeeId,
          g.email, g.phone, g.subject, g.designation,
        ].join(' ').toLowerCase();
        return haystack.includes(term);
      });
    const byDate = (a, b) => new Date(b.submittedOn) - new Date(a.submittedOn);
    if (sort === 'oldest') return list.sort((a, b) => -byDate(a, b));
    if (sort === 'updated') return list.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    if (sort === 'open') {
      const rank = { Pending: 0, 'In Progress': 1, Resolved: 2, Rejected: 3 };
      return list.sort((a, b) => rank[a.status] - rank[b.status] || -byDate(a, b));
    }
    return list.sort(byDate);
  }, [grievances, filterType, filterStatus, search, sort]);

  // Back to page 1 whenever the filters change.
  const filterKey = `${filterType}|${filterStatus}|${search}|${sort}`;
  const [lastKey, setLastKey] = useState(filterKey);
  if (lastKey !== filterKey) {
    setLastKey(filterKey);
    setPage(1);
  }

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const shown = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const counts = useMemo(() => {
    const base = { total: grievances.length, overdue: 0 };
    STATUSES.forEach((s) => {
      base[s] = grievances.filter((g) => g.status === s).length;
    });
    Object.keys(TYPE_META).forEach((t) => {
      base[t] = grievances.filter((g) => g.type === t).length;
    });
    base.overdue = grievances.filter(
      (g) => (g.status === 'Pending' || g.status === 'In Progress') && ageInDays(g.submittedOn) >= 15,
    ).length;
    return base;
  }, [grievances]);

  const resolvedShare = counts.total ? Math.round(((counts.Resolved || 0) / counts.total) * 100) : 0;

  const STAT_CARDS = [
    { key: 'all', label: 'Total Grievances', icon: 'bi-inboxes-fill', value: counts.total, featured: true },
    ...STATUSES.map((s) => ({ key: s, label: s, icon: STATUS_META[s].icon, value: counts[s], tone: STATUS_META[s].tone })),
  ];

  return (
    <>
      <div className="igrs-dash-head">
        <div>
          <span className="eyebrow">
            <i className="bi bi-speedometer2" aria-hidden="true" />
            Committee Dashboard
          </span>
          <h2 className="fw-bold mb-1">Grievance Management</h2>
          <p className="small text-muted mb-0">
            Signed in as <strong>admin</strong>
            {refreshedAt && ` · updated ${refreshedAt.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`}
          </p>
        </div>
        <div className="d-flex flex-wrap gap-2 no-print">
          <button type="button" className="btn-outline-navy" onClick={load} disabled={loading}>
            <i className={`bi bi-arrow-clockwise ${loading ? 'spin' : ''}`} aria-hidden="true" />
            Refresh
          </button>
          <button
            type="button"
            className="btn-outline-navy"
            onClick={() => download(`igrs-grievances-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(filtered, options))}
            disabled={!filtered.length}
          >
            <i className="bi bi-file-earmark-spreadsheet" aria-hidden="true" />
            Export CSV
          </button>
          <button type="button" className="btn-outline-navy" onClick={() => setShowPassword(true)}>
            <i className="bi bi-key" aria-hidden="true" />
            Password
          </button>
          <button type="button" className="btn-gold" onClick={() => onLogout('')}>
            <i className="bi bi-box-arrow-right" aria-hidden="true" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="igrs-stats no-print">
        {STAT_CARDS.map((card) => (
          <button
            type="button"
            key={card.key}
            className={`igrs-stat ${card.featured ? 'is-featured' : ''} ${card.tone || ''} ${filterStatus === card.key ? 'is-active' : ''}`}
            onClick={() => setFilterStatus(card.key)}
            aria-pressed={filterStatus === card.key}
          >
            <i className={`bi ${card.icon}`} aria-hidden="true" />
            <span className="num">{card.value || 0}</span>
            <span className="lbl">{card.label}</span>
          </button>
        ))}
      </div>

      {(counts.overdue > 0 || counts.total > 0) && (
        <div className="igrs-insights no-print">
          <span>
            <i className="bi bi-graph-up-arrow" aria-hidden="true" />
            <strong>{resolvedShare}%</strong> resolved
          </span>
          {counts.overdue > 0 && (
            <button type="button" className="is-late" onClick={() => { setFilterStatus('all'); setSort('open'); }}>
              <i className="bi bi-exclamation-triangle-fill" aria-hidden="true" />
              <strong>{counts.overdue}</strong> open for 15+ days
            </button>
          )}
        </div>
      )}

      <div className="panel mb-4 no-print">
        <div className="panel-body">
          <div className="igrs-type-tabs" role="tablist" aria-label="Grievance type">
            {[['all', 'All', 'bi-grid-fill', counts.total], ...Object.entries(TYPE_META).map(([t, m]) => [t, m.label, m.icon, counts[t]])].map(
              ([value, label, icon, count]) => (
                <button
                  type="button"
                  role="tab"
                  key={value}
                  aria-selected={filterType === value}
                  className={filterType === value ? 'is-active' : ''}
                  onClick={() => setFilterType(value)}
                >
                  <i className={`bi ${icon}`} aria-hidden="true" />
                  {label}
                  <span className="count">{count || 0}</span>
                </button>
              ),
            )}
          </div>
          <Row className="g-3 premium-form mt-1">
            <Col md={6}>
              <Form.Label htmlFor="igrs-search">Search</Form.Label>
              <div className="input-icon">
                <i className="bi bi-search" aria-hidden="true" />
                <Form.Control
                  id="igrs-search"
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Reference, name, enrollment / NPS no., mobile, email…"
                />
              </div>
            </Col>
            <Col sm={6} md={3}>
              <Form.Label htmlFor="igrs-status">Status</Form.Label>
              <Form.Select id="igrs-status" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Form.Select>
            </Col>
            <Col sm={6} md={3}>
              <Form.Label htmlFor="igrs-sort">Sort by</Form.Label>
              <Form.Select id="igrs-sort" value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="updated">Recently updated</option>
                <option value="open">Open cases first</option>
              </Form.Select>
            </Col>
          </Row>
        </div>
      </div>

      {loadError && <Alert variant="danger" className="border-0 small">{loadError}</Alert>}

      {loading && grievances.length === 0 ? (
        <Row className="g-4">
          {[0, 1].map((i) => (
            <Col lg={6} key={i}>
              <div className="panel igrs-skeleton" aria-hidden="true"><span /><span /><span /><span /></div>
            </Col>
          ))}
        </Row>
      ) : filtered.length === 0 ? (
        <div className="panel">
          <div className="panel-body text-center py-5">
            <span className="icon-tile mx-auto mb-3"><i className="bi bi-inbox" aria-hidden="true" /></span>
            <h5 className="fw-bold mb-2">No Grievances Found</h5>
            <p className="small mb-0">
              {counts.total === 0 ? 'No grievances have been submitted yet.' : 'No grievances match the current filters.'}
            </p>
          </div>
        </div>
      ) : (
        <>
          <p className="small text-muted mb-3 no-print">
            Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <Row className="g-4">
            {shown.map((g) => (
              <Col lg={6} key={g.refNumber}>
                <GrievanceCard
                  g={g}
                  options={options}
                  onSave={handleSave}
                  saving={savingRef === g.refNumber}
                  saved={saved[g.refNumber]}
                />
              </Col>
            ))}
          </Row>
          {pages > 1 && (
            <nav className="igrs-pager no-print" aria-label="Pages">
              <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>
                <i className="bi bi-chevron-left" aria-hidden="true" /> Previous
              </button>
              <span>Page {page} of {pages}</span>
              <button type="button" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>
                Next <i className="bi bi-chevron-right" aria-hidden="true" />
              </button>
            </nav>
          )}
        </>
      )}

      <ChangePasswordModal
        show={showPassword}
        onHide={() => setShowPassword(false)}
        onSignedOut={() => onLogout('Your session has ended. Please sign in again.')}
      />
    </>
  );
}
