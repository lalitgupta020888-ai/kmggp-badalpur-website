"use client";

import React, { useMemo, useState, useSyncExternalStore } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import IgrsShell from '@/components/igrs/IgrsShell';
import {
  STATUSES,
  STATUS_META,
  TYPE_META,
  checkAdminCredentials,
  clearAdminSession,
  formatDate,
  getAdminSessionServerSnapshot,
  getAdminSessionSnapshot,
  getGrievancesServerSnapshot,
  getGrievancesSnapshot,
  setAdminSession,
  subscribeAdminSession,
  subscribeGrievances,
  updateGrievance,
} from '@/lib/igrs';

const NOTICES = [
  {
    icon: 'bi-shield-lock-fill',
    text: 'Restricted to members of the institute grievance committee.',
  },
  {
    icon: 'bi-eye-slash-fill',
    text: 'Never share your credentials. The institute will never ask for your password.',
  },
  {
    icon: 'bi-clock-history',
    text: 'Every status change and remark is recorded against the case.',
  },
];

function StatusPill({ status }) {
  const meta = STATUS_META[status] || STATUS_META.Pending;
  return (
    <span className={`status-pill ${meta.tone}`}>
      <i className={`bi ${meta.icon}`} />
      {status}
    </span>
  );
}

function AdminLogin({ onSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    setError('');
    if (!checkAdminCredentials(username.trim(), password)) {
      setError('Invalid username or password. Please try again.');
      return;
    }
    setPassword('');
    onSuccess(remember);
  };

  return (
    <Row>
      <Col md={11} xl={9} className="mx-auto">
        <div className="auth-card">
          <div className="auth-head">
            <span className="auth-emblem">
              <i className="bi bi-person-lock" />
            </span>
            <h4>Grievance Committee Login</h4>
            <p>Integrated Grievance Redressal System — Km. Mayawati Government Girls Polytechnic</p>
          </div>

          <div className="p-4 p-sm-5">
            <Alert variant="warning" className="d-flex align-items-start gap-3 border-0 small mb-4">
              <i className="bi bi-exclamation-triangle-fill fs-5 lh-1 mt-1" />
              <span>
                Authorised committee members only. Unauthorised access attempts are logged and may
                invite disciplinary or legal action.
              </span>
            </Alert>

            <Form className="premium-form" onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Username</Form.Label>
                <div className="input-icon">
                  <i className="bi bi-person-badge-fill" />
                  <Form.Control
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                    autoComplete="username"
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <div className="input-icon input-icon-action">
                  <i className="bi bi-key-fill" />
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="input-action"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    title={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} />
                  </button>
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  id="igrs-remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  label="Keep me signed in on this device"
                />
              </Form.Group>

              {error && (
                <Alert variant="danger" className="border-0 small d-flex align-items-center gap-2">
                  <i className="bi bi-exclamation-circle-fill" />
                  {error}
                </Alert>
              )}

              <Button type="submit" className="btn-gold w-100 justify-content-center">
                <i className="bi bi-box-arrow-in-right" />
                Sign In to Dashboard
              </Button>
            </Form>

            <div className="gold-rule-thin my-4" />

            <div className="auth-notes">
              {NOTICES.map((notice) => (
                <div className="auth-note" key={notice.text}>
                  <i className={`bi ${notice.icon}`} />
                  <span>{notice.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Col>
    </Row>
  );
}

function AdminDashboard({ onLogout }) {
  const { list: grievances } = useSyncExternalStore(
    subscribeGrievances,
    getGrievancesSnapshot,
    getGrievancesServerSnapshot
  );
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [drafts, setDrafts] = useState({});
  const [savedRef, setSavedRef] = useState('');

  const handleUpdate = (refNumber) => {
    const draft = drafts[refNumber] || {};
    const current = grievances.find((g) => g.refNumber === refNumber);
    if (!current) return;
    updateGrievance(refNumber, draft.status ?? current.status, draft.remarks ?? current.remarks);
    setSavedRef(refNumber);
    window.setTimeout(() => setSavedRef(''), 2500);
  };

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return grievances
      .filter((g) => (filterType === 'all' ? true : g.type === filterType))
      .filter((g) => (filterStatus === 'all' ? true : g.status === filterStatus))
      .filter((g) =>
        !term
          ? true
          : g.refNumber.toLowerCase().includes(term) ||
            String(g.name || g.parentName || '').toLowerCase().includes(term) ||
            String(g.subject || '').toLowerCase().includes(term)
      )
      .sort((a, b) => new Date(b.submittedOn) - new Date(a.submittedOn));
  }, [grievances, filterType, filterStatus, search]);

  const counts = useMemo(() => {
    const base = { total: grievances.length };
    STATUSES.forEach((s) => {
      base[s] = grievances.filter((g) => g.status === s).length;
    });
    return base;
  }, [grievances]);

  return (
    <>
      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div>
          <span className="eyebrow">
            <i className="bi bi-speedometer2" />
            Committee Dashboard
          </span>
          <h2 className="fw-bold mb-0">Grievance Management</h2>
        </div>
        <button type="button" className="btn-outline-navy" onClick={onLogout}>
          <i className="bi bi-box-arrow-right" />
          Sign Out
        </button>
      </div>

      <Row className="g-3 mb-4">
        <Col md={3} sm={6}>
          <div className="premium-card is-featured p-4 text-center h-100">
            <span className="icon-tile mx-auto mb-3"><i className="bi bi-inboxes-fill" /></span>
            <h4 className="fw-bold mb-1">{counts.total}</h4>
            <p className="small mb-0">Total Grievances</p>
          </div>
        </Col>
        {['Pending', 'In Progress', 'Resolved'].map((status) => (
          <Col md={3} sm={6} key={status}>
            <div className="premium-card p-4 text-center h-100">
              <span className="icon-tile mx-auto mb-3">
                <i className={`bi ${STATUS_META[status].icon}`} />
              </span>
              <h4 className="fw-bold mb-1">{counts[status]}</h4>
              <p className="small mb-0">{status}</p>
            </div>
          </Col>
        ))}
      </Row>

      <div className="panel mb-4">
        <div className="panel-header">
          <i className="bi bi-funnel-fill" />
          Filter &amp; Search
        </div>
        <div className="panel-body">
          <Row className="g-3 premium-form">
            <Col md={4}>
              <Form.Label>Grievance Type</Form.Label>
              <Form.Select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                <option value="all">All types</option>
                {Object.entries(TYPE_META).map(([value, meta]) => (
                  <option key={value} value={value}>{meta.label}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>Status</Form.Label>
              <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">All statuses</option>
                {STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={4}>
              <Form.Label>Search</Form.Label>
              <div className="input-icon">
                <i className="bi bi-search" />
                <Form.Control
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Reference, name or subject"
                />
              </div>
            </Col>
          </Row>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="panel">
          <div className="panel-body text-center py-5">
            <span className="icon-tile mx-auto mb-3"><i className="bi bi-inbox" /></span>
            <h5 className="fw-bold mb-2">No Grievances Found</h5>
            <p className="small mb-0">
              {counts.total === 0
                ? 'No grievances have been submitted yet.'
                : 'No grievances match the current filters.'}
            </p>
          </div>
        </div>
      ) : (
        <Row className="g-4">
          {filtered.map((g) => {
            const draft = drafts[g.refNumber] || {};
            return (
              <Col lg={6} key={g.refNumber}>
                <div className="panel h-100">
                  <div className="panel-header">
                    <i className={`bi ${TYPE_META[g.type]?.icon || 'bi-tag-fill'}`} />
                    {g.subject || 'No Subject'}
                  </div>
                  <div className="panel-body">
                    <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                      <span className="ref-inline">
                        <i className="bi bi-hash" />
                        {g.refNumber}
                      </span>
                      <StatusPill status={g.status} />
                    </div>

                    <div className="table-wrap mb-3">
                      <table className="premium-table">
                        <tbody>
                          <tr>
                            <td>Type</td>
                            <td>{TYPE_META[g.type]?.label || g.type}</td>
                          </tr>
                          <tr>
                            <td>Name</td>
                            <td>{g.parentName || g.name || '—'}</td>
                          </tr>
                          <tr>
                            <td>Category</td>
                            <td className="text-capitalize">{g.category || '—'}</td>
                          </tr>
                          <tr>
                            <td>Contact</td>
                            <td>{g.email || '—'}<br />{g.phone || ''}</td>
                          </tr>
                          <tr>
                            <td>Submitted</td>
                            <td>{formatDate(g.submittedOn)}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <p className="small">
                      <strong className="text-primary-blue">Description:</strong> {g.description}
                    </p>

                    <div className="gold-rule-thin my-3" />

                    <div className="premium-form">
                      <Form.Label>Update Status</Form.Label>
                      <Form.Select
                        className="mb-3"
                        value={draft.status ?? g.status}
                        onChange={(e) =>
                          setDrafts((d) => ({
                            ...d,
                            [g.refNumber]: { ...d[g.refNumber], status: e.target.value },
                          }))
                        }
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </Form.Select>

                      <Form.Label>Committee Remarks</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        className="mb-3"
                        value={draft.remarks ?? g.remarks}
                        onChange={(e) =>
                          setDrafts((d) => ({
                            ...d,
                            [g.refNumber]: { ...d[g.refNumber], remarks: e.target.value },
                          }))
                        }
                      />

                      <button
                        type="button"
                        className="btn-gold w-100 justify-content-center"
                        onClick={() => handleUpdate(g.refNumber)}
                      >
                        <i className="bi bi-save-fill" />
                        Save Update
                      </button>

                      {savedRef === g.refNumber && (
                        <p className="small text-center mt-2 mb-0" style={{ color: 'var(--gold-700)' }}>
                          <i className="bi bi-check-circle-fill me-1" />
                          Updated successfully
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            );
          })}
        </Row>
      )}
    </>
  );
}

export default function IgrsAdminPage() {
  // The session flag lives in browser storage, so it is read as an external
  // store — an existing session is picked up without a mount effect.
  const isAdmin = useSyncExternalStore(
    subscribeAdminSession,
    getAdminSessionSnapshot,
    getAdminSessionServerSnapshot
  );

  return (
    <IgrsShell
      icon="bi-person-lock"
      title={isAdmin ? 'Committee Dashboard' : 'Admin Login'}
      crumb={isAdmin ? 'Dashboard' : 'Admin Login'}
      subtitle={
        isAdmin
          ? 'Review every grievance received, update its status and record the committee remarks.'
          : 'Grievance committee members sign in here to review and update submitted cases.'
      }
      wide={isAdmin}
    >
      {isAdmin ? (
        <AdminDashboard onLogout={clearAdminSession} />
      ) : (
        <AdminLogin onSuccess={setAdminSession} />
      )}
    </IgrsShell>
  );
}
