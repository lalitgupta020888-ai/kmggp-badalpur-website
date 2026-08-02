"use client";

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';
import {
  CATEGORIES,
  COURSES,
  DEPARTMENTS,
  RELATIONS,
  STATUSES,
  STATUS_META,
  TYPE_META,
  YEARS,
  checkAdminCredentials,
  clearAdminSession,
  findGrievance,
  formatDate,
  hasAdminSession,
  loadGrievances,
  saveGrievance,
  setAdminSession,
  updateGrievance,
} from '@/lib/igrs';

const ACTIONS = [
  {
    view: 'student',
    icon: 'bi-mortarboard-fill',
    title: 'Submit Student Grievance',
    text: 'Raise an academic, examination, hostel, library or canteen concern.',
  },
  {
    view: 'parent',
    icon: 'bi-people-fill',
    title: 'Submit Parent Grievance',
    text: 'Parents and guardians can report concerns on behalf of a student.',
  },
  {
    view: 'employee',
    icon: 'bi-person-badge-fill',
    title: 'Submit Employee Grievance',
    text: 'Faculty and staff may raise service, workplace or facility matters.',
  },
  {
    view: 'status',
    icon: 'bi-search',
    title: 'Check Grievance Status',
    text: 'Track any grievance using the reference number issued to you.',
  },
  {
    view: 'admin-login',
    icon: 'bi-person-lock',
    title: 'Admin Login',
    text: 'Grievance committee members sign in to review and update cases.',
  },
];

const FORM_TITLES = {
  student: { title: 'Student Grievance Form', icon: 'bi-mortarboard-fill' },
  parent: { title: 'Parent Grievance Form', icon: 'bi-people-fill' },
  employee: { title: 'Employee Grievance Form', icon: 'bi-person-badge-fill' },
};

function StatusPill({ status }) {
  const meta = STATUS_META[status] || STATUS_META.Pending;
  return (
    <span className={`status-pill ${meta.tone}`}>
      <i className={`bi ${meta.icon}`} />
      {status}
    </span>
  );
}

function Field({ label, children, required }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>
        {label} {required && <span className="text-gold">*</span>}
      </Form.Label>
      {children}
    </Form.Group>
  );
}

export default function IgrsPage() {
  const [view, setView] = useState('cards');
  const [receipt, setReceipt] = useState(null);

  // Status lookup
  const [refInput, setRefInput] = useState('');
  const [lookup, setLookup] = useState({ state: 'idle', grievance: null });

  // Admin
  const [adminUser, setAdminUser] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [remember, setRemember] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  // Dashboard
  const [grievances, setGrievances] = useState([]);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [drafts, setDrafts] = useState({});
  const [savedRef, setSavedRef] = useState('');

  const refreshGrievances = useCallback(() => {
    setGrievances(loadGrievances());
  }, []);

  // Restore an existing admin session on mount (client only).
  useEffect(() => {
    if (hasAdminSession()) {
      setIsAdmin(true);
      setView('admin-dashboard');
      refreshGrievances();
    }
  }, [refreshGrievances]);

  const goHome = () => {
    setView('cards');
    setReceipt(null);
    setLookup({ state: 'idle', grievance: null });
    setRefInput('');
  };

  const handleGrievanceSubmit = (event, type) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const grievance = saveGrievance(data, type);
    setReceipt(grievance);
    setView('receipt');
    if (isAdmin) refreshGrievances();
  };

  const handleStatusCheck = (event) => {
    event.preventDefault();
    const found = findGrievance(refInput);
    setLookup({ state: found ? 'found' : 'missing', grievance: found });
  };

  const handleAdminLogin = (event) => {
    event.preventDefault();
    setAdminError('');
    if (!checkAdminCredentials(adminUser.trim(), adminPass)) {
      setAdminError('Invalid username or password. Please try again.');
      return;
    }
    setAdminSession(remember);
    setIsAdmin(true);
    setAdminPass('');
    refreshGrievances();
    setView('admin-dashboard');
  };

  const handleLogout = () => {
    clearAdminSession();
    setIsAdmin(false);
    setAdminUser('');
    setAdminPass('');
    goHome();
  };

  const handleUpdate = (refNumber) => {
    const draft = drafts[refNumber] || {};
    const current = grievances.find((g) => g.refNumber === refNumber);
    if (!current) return;
    updateGrievance(
      refNumber,
      draft.status ?? current.status,
      draft.remarks ?? current.remarks
    );
    refreshGrievances();
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

  const backButton = (
    <button type="button" className="igrs-back" onClick={goHome}>
      <i className="bi bi-arrow-left" />
      Back to all services
    </button>
  );

  return (
    <>
      <PageHeader
        icon="bi-shield-check"
        eyebrow="Integrated Grievance Redressal System"
        title="Grievance Redressal System"
        subtitle="Km. Mayawati Government Girls Polytechnic, Badalpur, Gautam Buddha Nagar — submit a grievance, track its status, or sign in as a committee member."
        crumbs={[{ label: 'IGRS' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          {/* ---------------- Landing cards ---------------- */}
          {view === 'cards' && (
            <>
              <SectionHead
                eyebrow="How Can We Help?"
                icon="bi-headset"
                title="Choose a Service"
                subtitle="Every grievance is recorded with a unique reference number so you can follow it to resolution."
              />
              <Row className="g-4">
                {ACTIONS.map((action) => (
                  <Col lg={4} md={6} key={action.view}>
                    <button
                      type="button"
                      className="premium-card igrs-action h-100 p-4 w-100 text-start"
                      onClick={() => setView(action.view)}
                    >
                      <span className="icon-tile mb-4">
                        <i className={`bi ${action.icon}`} />
                      </span>
                      <h5 className="fw-bold mb-3">{action.title}</h5>
                      <p className="small">{action.text}</p>
                      <div className="gold-rule-thin my-3" />
                      <span className="fw-bold text-primary-blue small">
                        Continue <i className="bi bi-arrow-right" />
                      </span>
                    </button>
                  </Col>
                ))}
              </Row>

              <div className="callout mt-5">
                <i className="bi bi-info-circle-fill" />
                <p>
                  All grievances are treated confidentially and reviewed by the institute grievance
                  committee. Save the reference number shown after submission — it is the only way to
                  track your case.
                </p>
              </div>
            </>
          )}

          {/* ---------------- Grievance forms ---------------- */}
          {['student', 'parent', 'employee'].includes(view) && (
            <>
              {backButton}
              <Row className="g-4">
                <Col lg={8}>
                  <div className="panel">
                    <div className="panel-header">
                      <i className={`bi ${FORM_TITLES[view].icon}`} />
                      {FORM_TITLES[view].title}
                    </div>
                    <div className="panel-body">
                      <Form className="premium-form" onSubmit={(e) => handleGrievanceSubmit(e, view)}>
                        <p className="text-muted small mb-4">
                          Fields marked <span className="text-gold fw-bold">*</span> are required.
                        </p>

                        {view === 'student' && (
                          <>
                            <Row>
                              <Col sm={6}>
                                <Field label="Full Name" required>
                                  <Form.Control name="name" type="text" placeholder="Your full name" required />
                                </Field>
                              </Col>
                              <Col sm={6}>
                                <Field label="Roll Number" required>
                                  <Form.Control name="rollNumber" type="text" placeholder="Your roll number" required />
                                </Field>
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={6}>
                                <Field label="Course" required>
                                  <Form.Select name="course" required defaultValue="">
                                    <option value="" disabled>Select course</option>
                                    {COURSES.map((c) => (
                                      <option key={c.value} value={c.value}>{c.label}</option>
                                    ))}
                                  </Form.Select>
                                </Field>
                              </Col>
                              <Col sm={6}>
                                <Field label="Year" required>
                                  <Form.Select name="year" required defaultValue="">
                                    <option value="" disabled>Select year</option>
                                    {YEARS.map((y) => (
                                      <option key={y.value} value={y.value}>{y.label}</option>
                                    ))}
                                  </Form.Select>
                                </Field>
                              </Col>
                            </Row>
                          </>
                        )}

                        {view === 'parent' && (
                          <>
                            <Row>
                              <Col sm={6}>
                                <Field label="Parent / Guardian Name" required>
                                  <Form.Control name="parentName" type="text" placeholder="Your full name" required />
                                </Field>
                              </Col>
                              <Col sm={6}>
                                <Field label="Relation with Student" required>
                                  <Form.Select name="relation" required defaultValue="">
                                    <option value="" disabled>Select relation</option>
                                    {RELATIONS.map((r) => (
                                      <option key={r.value} value={r.value}>{r.label}</option>
                                    ))}
                                  </Form.Select>
                                </Field>
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={6}>
                                <Field label="Student Name" required>
                                  <Form.Control name="name" type="text" placeholder="Student's full name" required />
                                </Field>
                              </Col>
                              <Col sm={6}>
                                <Field label="Student Roll Number" required>
                                  <Form.Control name="rollNumber" type="text" placeholder="Student's roll number" required />
                                </Field>
                              </Col>
                            </Row>
                          </>
                        )}

                        {view === 'employee' && (
                          <>
                            <Row>
                              <Col sm={6}>
                                <Field label="Full Name" required>
                                  <Form.Control name="name" type="text" placeholder="Your full name" required />
                                </Field>
                              </Col>
                              <Col sm={6}>
                                <Field label="Employee ID" required>
                                  <Form.Control name="employeeId" type="text" placeholder="Your employee ID" required />
                                </Field>
                              </Col>
                            </Row>
                            <Row>
                              <Col sm={6}>
                                <Field label="Department" required>
                                  <Form.Select name="department" required defaultValue="">
                                    <option value="" disabled>Select department</option>
                                    {DEPARTMENTS.map((d) => (
                                      <option key={d.value} value={d.value}>{d.label}</option>
                                    ))}
                                  </Form.Select>
                                </Field>
                              </Col>
                              <Col sm={6}>
                                <Field label="Designation" required>
                                  <Form.Control name="designation" type="text" placeholder="Your designation" required />
                                </Field>
                              </Col>
                            </Row>
                          </>
                        )}

                        <Row>
                          <Col sm={6}>
                            <Field label="Email Address" required>
                              <div className="input-icon">
                                <i className="bi bi-envelope-fill" />
                                <Form.Control name="email" type="email" placeholder="you@example.com" required />
                              </div>
                            </Field>
                          </Col>
                          <Col sm={6}>
                            <Field label="Phone Number" required>
                              <div className="input-icon">
                                <i className="bi bi-telephone-fill" />
                                <Form.Control
                                  name="phone"
                                  type="tel"
                                  inputMode="numeric"
                                  pattern="[0-9]{10}"
                                  maxLength={10}
                                  placeholder="10-digit mobile number"
                                  required
                                />
                              </div>
                            </Field>
                          </Col>
                        </Row>

                        <Field label="Grievance Category" required>
                          <Form.Select name="category" required defaultValue="">
                            <option value="" disabled>Select category</option>
                            {CATEGORIES[view].map((c) => (
                              <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                          </Form.Select>
                        </Field>

                        <Field label="Subject" required>
                          <Form.Control name="subject" type="text" placeholder="Brief subject of your grievance" required />
                        </Field>

                        <Field label="Description" required>
                          <Form.Control
                            name="description"
                            as="textarea"
                            rows={5}
                            placeholder="Describe your grievance in detail, including dates and any people involved..."
                            required
                          />
                        </Field>

                        <Form.Group className="mb-4">
                          <Form.Check
                            type="checkbox"
                            id="igrs-declaration"
                            required
                            label="I declare that the information provided above is true to the best of my knowledge."
                          />
                        </Form.Group>

                        <Button type="submit" className="btn-gold w-100 justify-content-center">
                          <i className="bi bi-send-fill" />
                          Submit Grievance
                        </Button>
                      </Form>
                    </div>
                  </div>
                </Col>

                <Col lg={4}>
                  <div className="panel">
                    <div className="panel-header">
                      <i className="bi bi-shield-lock-fill" />
                      Your Privacy
                    </div>
                    <div className="panel-body">
                      <ul className="gold-list mb-0">
                        <li>Grievances are seen only by the institute grievance committee.</li>
                        <li>You receive a unique reference number to track progress.</li>
                        <li>Complaints made in good faith attract no adverse action.</li>
                        <li>Provide accurate contact details so we can reach you.</li>
                      </ul>
                    </div>
                  </div>

                  <div className="side-cta mt-4">
                    <i className="bi bi-search side-cta-icon" />
                    <h6>Already Submitted?</h6>
                    <p>Track an existing grievance using its reference number.</p>
                    <button type="button" className="btn-gold btn-sm" onClick={() => setView('status')}>
                      Check Status
                      <i className="bi bi-arrow-right" />
                    </button>
                  </div>
                </Col>
              </Row>
            </>
          )}

          {/* ---------------- Receipt ---------------- */}
          {view === 'receipt' && receipt && (
            <Row>
              <Col lg={8} className="mx-auto">
                <div className="panel">
                  <div className="panel-header">
                    <i className="bi bi-check-circle-fill" />
                    Grievance Submitted
                  </div>
                  <div className="panel-body text-center">
                    <span className="icon-tile mx-auto mb-4" style={{ width: 78, height: 78, fontSize: '2rem' }}>
                      <i className="bi bi-check-lg" />
                    </span>
                    <h4 className="fw-bold mb-2">Thank You — We Have Received It</h4>
                    <div className="gold-flourish">
                      <i className="bi bi-diamond-fill" />
                    </div>
                    <p className="mt-3">
                      Please save this reference number. It is required to track your grievance.
                    </p>

                    <div className="ref-badge">
                      <span className="ref-label">Reference Number</span>
                      <span className="ref-value">{receipt.refNumber}</span>
                    </div>

                    <div className="d-flex flex-wrap gap-3 justify-content-center mt-4">
                      <button
                        type="button"
                        className="btn-gold"
                        onClick={() => {
                          setRefInput(receipt.refNumber);
                          setLookup({ state: 'found', grievance: receipt });
                          setView('status');
                        }}
                      >
                        <i className="bi bi-search" />
                        Track This Grievance
                      </button>
                      <button type="button" className="btn-outline-navy" onClick={goHome}>
                        <i className="bi bi-house-door" />
                        Back to Services
                      </button>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          )}

          {/* ---------------- Status check ---------------- */}
          {view === 'status' && (
            <>
              {backButton}
              <Row>
                <Col lg={8} className="mx-auto">
                  <div className="panel">
                    <div className="panel-header">
                      <i className="bi bi-search" />
                      Check Grievance Status
                    </div>
                    <div className="panel-body">
                      <Form className="premium-form" onSubmit={handleStatusCheck}>
                        <Field label="Reference Number" required>
                          <div className="input-icon">
                            <i className="bi bi-hash" />
                            <Form.Control
                              type="text"
                              value={refInput}
                              onChange={(e) => setRefInput(e.target.value)}
                              placeholder="e.g. GR12345678901"
                              required
                            />
                          </div>
                          <Form.Text className="text-muted">
                            Enter the reference number issued when you submitted the grievance.
                          </Form.Text>
                        </Field>
                        <Button type="submit" className="btn-gold w-100 justify-content-center">
                          <i className="bi bi-search" />
                          Check Status
                        </Button>
                      </Form>

                      {lookup.state === 'missing' && (
                        <Alert variant="danger" className="d-flex align-items-start gap-3 border-0 mt-4 small">
                          <i className="bi bi-exclamation-circle-fill fs-5 lh-1" />
                          <span>
                            No grievance found with that reference number. Please check and try again.
                          </span>
                        </Alert>
                      )}

                      {lookup.state === 'found' && lookup.grievance && (
                        <div className="mt-4">
                          <div className="gold-rule-thin mb-4" />
                          <div className="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">
                            <h5 className="fw-bold mb-0">{lookup.grievance.subject}</h5>
                            <StatusPill status={lookup.grievance.status} />
                          </div>

                          <div className="contact-line">
                            <span className="icon-tile icon-tile-sm"><i className="bi bi-hash" /></span>
                            <div>
                              <div className="label">Reference Number</div>
                              <p className="value">{lookup.grievance.refNumber}</p>
                            </div>
                          </div>
                          <div className="contact-line">
                            <span className="icon-tile icon-tile-sm">
                              <i className={`bi ${TYPE_META[lookup.grievance.type]?.icon || 'bi-tag-fill'}`} />
                            </span>
                            <div>
                              <div className="label">Grievance Type</div>
                              <p className="value">
                                {TYPE_META[lookup.grievance.type]?.label || lookup.grievance.type}
                              </p>
                            </div>
                          </div>
                          <div className="contact-line">
                            <span className="icon-tile icon-tile-sm"><i className="bi bi-calendar3" /></span>
                            <div>
                              <div className="label">Submitted On</div>
                              <p className="value">{formatDate(lookup.grievance.submittedOn)}</p>
                            </div>
                          </div>
                          <div className="contact-line">
                            <span className="icon-tile icon-tile-sm"><i className="bi bi-clock-history" /></span>
                            <div>
                              <div className="label">Last Updated</div>
                              <p className="value">{formatDate(lookup.grievance.lastUpdated)}</p>
                            </div>
                          </div>
                          <div className="contact-line">
                            <span className="icon-tile icon-tile-sm"><i className="bi bi-chat-left-text-fill" /></span>
                            <div>
                              <div className="label">Committee Remarks</div>
                              <p className="value">{lookup.grievance.remarks}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Col>
              </Row>
            </>
          )}

          {/* ---------------- Admin login ---------------- */}
          {view === 'admin-login' && (
            <>
              {backButton}
              <Row>
                <Col lg={6} xl={5} className="mx-auto">
                  <div className="panel">
                    <div className="panel-header">
                      <i className="bi bi-person-lock" />
                      Grievance Committee Login
                    </div>
                    <div className="panel-body">
                      <Alert variant="warning" className="d-flex align-items-start gap-3 border-0 small mb-4">
                        <i className="bi bi-exclamation-triangle-fill fs-5 lh-1 mt-1" />
                        <span>
                          Restricted to grievance committee members. All actions taken here are
                          recorded against the case.
                        </span>
                      </Alert>

                      <Form className="premium-form" onSubmit={handleAdminLogin}>
                        <Field label="Username" required>
                          <div className="input-icon">
                            <i className="bi bi-person-badge-fill" />
                            <Form.Control
                              type="text"
                              value={adminUser}
                              onChange={(e) => setAdminUser(e.target.value)}
                              autoComplete="username"
                              placeholder="Enter your username"
                              required
                            />
                          </div>
                        </Field>

                        <Field label="Password" required>
                          <div className="input-icon">
                            <i className="bi bi-key-fill" />
                            <Form.Control
                              type="password"
                              value={adminPass}
                              onChange={(e) => setAdminPass(e.target.value)}
                              autoComplete="current-password"
                              placeholder="Enter your password"
                              required
                            />
                          </div>
                        </Field>

                        <Form.Group className="mb-4">
                          <Form.Check
                            type="checkbox"
                            id="igrs-remember"
                            checked={remember}
                            onChange={(e) => setRemember(e.target.checked)}
                            label="Keep me signed in on this device"
                          />
                        </Form.Group>

                        {adminError && (
                          <Alert variant="danger" className="border-0 small d-flex align-items-center gap-2">
                            <i className="bi bi-exclamation-circle-fill" />
                            {adminError}
                          </Alert>
                        )}

                        <Button type="submit" className="btn-gold w-100 justify-content-center">
                          <i className="bi bi-box-arrow-in-right" />
                          Sign In
                        </Button>
                      </Form>
                    </div>
                  </div>
                </Col>
              </Row>
            </>
          )}

          {/* ---------------- Admin dashboard ---------------- */}
          {view === 'admin-dashboard' && isAdmin && (
            <>
              <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
                <div>
                  <span className="eyebrow">
                    <i className="bi bi-speedometer2" />
                    Committee Dashboard
                  </span>
                  <h2 className="fw-bold mb-0">Grievance Management</h2>
                </div>
                <button type="button" className="btn-outline-navy" onClick={handleLogout}>
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
          )}
        </Container>
      </section>

      {view === 'cards' && (
        <section className="cta-band">
          <Container>
            <Row className="align-items-center g-4">
              <Col lg={8}>
                <span className="eyebrow eyebrow-light">
                  <i className="bi bi-telephone-fill" />
                  Need to Speak to Someone?
                </span>
                <h3>Prefer to Raise It in Person?</h3>
                <div className="hero-gold-line" />
                <p>
                  You may also approach the institute office during working hours, or write to us
                  directly. Every grievance is treated with confidentiality.
                </p>
              </Col>
              <Col lg={4} className="d-flex flex-column gap-3 align-items-lg-end">
                <Link href="/contact" className="btn-gold">
                  <i className="bi bi-envelope-fill" />
                  Contact the Institute
                </Link>
              </Col>
            </Row>
          </Container>
        </section>
      )}
    </>
  );
}
