"use client";

import React, { useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import Link from 'next/link';
import {
  CATEGORIES,
  PENSION_SCHEMES,
  TYPE_META,
  categoryLabel,
  formatDate,
  semesterLabel,
  semestersFor,
} from '@/lib/igrs';
import { submitGrievance } from '@/app/igrs/actions';

const STEPS = [
  { icon: 'bi-pencil-square', title: 'Fill the form', text: 'Share your details and describe the issue.' },
  { icon: 'bi-hash', title: 'Get a reference number', text: 'Issued instantly and emailed to you — save it to track the case.' },
  { icon: 'bi-people', title: 'Committee review', text: 'The grievance committee examines your case.' },
  { icon: 'bi-check2-circle', title: 'Resolution', text: 'Every status change and remark is emailed and shown on the tracker.' },
];

const DESCRIPTION_MAX = 5000;

function Field({ label, children, required, hint }) {
  // controlId gives the label a `for` and the control an `id`, so a screen
  // reader names the field when it gains focus.
  const id = React.useId();
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>
        {label}{' '}
        {required && (
          <span className="text-gold" aria-hidden="true">
            *
          </span>
        )}
      </Form.Label>
      {children}
      {hint && <Form.Text className="text-muted d-block">{hint}</Form.Text>}
    </Form.Group>
  );
}

function Select({ name, placeholder, list, value, onChange }) {
  // Controlled when the parent tracks the value (year), otherwise left alone.
  const control = value === undefined ? { defaultValue: '' } : { value, onChange };
  return (
    <Form.Select name={name} required {...control}>
      <option value="" disabled>{placeholder}</option>
      {(list || []).map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </Form.Select>
  );
}

function SectionTitle({ icon, children }) {
  return (
    <div className="igrs-form-section">
      <i className={`bi ${icon}`} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

function Receipt({ grievance, type, summary }) {
  const [copied, setCopied] = useState(false);

  const copyRef = async () => {
    try {
      await navigator.clipboard.writeText(grievance.refNumber);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      /* clipboard blocked — the number is on screen anyway */
    }
  };

  return (
    <div className="panel igrs-receipt">
      <div className="panel-header">
        <i className="bi bi-check-circle-fill" aria-hidden="true" />
        Grievance Registered
      </div>
      <div className="panel-body text-center">
        <span className="igrs-receipt-seal" aria-hidden="true">
          <i className="bi bi-patch-check-fill" />
        </span>
        <h3 className="h4 fw-bold mb-2">Thank You — Your Grievance Is Registered</h3>
        <div className="gold-flourish">
          <i className="bi bi-diamond-fill" aria-hidden="true" />
        </div>
        <p className="mt-3 mb-0">
          Your {TYPE_META[type]?.label.toLowerCase()} grievance has been forwarded to the institute
          grievance committee. A copy of this receipt has been emailed to you.
        </p>

        <div className="ref-badge">
          <span className="ref-label">Reference Number</span>
          <span className="ref-value">{grievance.refNumber}</span>
        </div>

        <div className="igrs-receipt-meta">
          <div><span>Category</span>{summary.category}</div>
          <div><span>Subject</span>{summary.subject}</div>
          <div><span>Status</span>{grievance.status || 'Pending'}</div>
          <div><span>Registered</span>{formatDate(grievance.submittedOn || new Date().toISOString())}</div>
        </div>

        <div className="d-flex flex-wrap gap-3 justify-content-center mt-4 no-print">
          <button type="button" className="btn-outline-navy" onClick={copyRef}>
            <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'}`} aria-hidden="true" />
            {copied ? 'Copied' : 'Copy Number'}
          </button>
          <button type="button" className="btn-outline-navy" onClick={() => window.print()}>
            <i className="bi bi-printer" aria-hidden="true" />
            Print Receipt
          </button>
          <Link href={`/igrs/status?ref=${grievance.refNumber}`} className="btn-gold">
            <i className="bi bi-search" aria-hidden="true" />
            Track This Grievance
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Shared grievance form for the student, parent and faculty pages.
 * The only difference between the three is the identity block at the top and
 * the category list, so the rest of the form is written once here.
 */
export default function GrievanceForm({ type, heading, icon, options = {} }) {
  const [receipt, setReceipt] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');
  const [scheme, setScheme] = useState('');
  const [descLength, setDescLength] = useState(0);

  const semesters = year ? semestersFor(year) : [];

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const result = await submitGrievance(type, data).catch(() => ({
      error: 'Could not reach the server. Please try again.',
    }));
    setSubmitting(false);
    if (result.error) {
      setError(result.error);
      return;
    }
    setReceipt({
      grievance: result.grievance,
      summary: { category: categoryLabel(type, data.category), subject: data.subject },
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (receipt) {
    return (
      <Row>
        <Col xl={10} className="mx-auto">
          <Receipt grievance={receipt.grievance} summary={receipt.summary} type={type} />
        </Col>
      </Row>
    );
  }

  const schemeLabel = scheme === 'GPF' ? 'GPF Number' : scheme === 'NPS' ? 'PRAN (NPS) Number' : 'NPS / GPF Number';

  return (
    <Row className="g-4">
      <Col xl={8}>
        <div className="panel">
          <div className="panel-header">
            <i className={`bi ${icon}`} aria-hidden="true" />
            {heading}
          </div>
          <div className="panel-body">
            <Form className="premium-form" onSubmit={handleSubmit}>
              <p className="text-muted small mb-4">
                Fields marked <span className="text-gold fw-bold">*</span> are required.
              </p>

              {/* Hidden from people; bots fill it, and their submission is dropped. */}
              <input type="text" name="website" tabIndex={-1} autoComplete="off" className="igrs-trap" aria-hidden="true" />

              {type === 'student' && (
                <>
                  <SectionTitle icon="bi-person-vcard">Student Details</SectionTitle>
                  <Row>
                    <Col sm={6}>
                      <Field label="Student Name" required>
                        <Form.Control name="name" type="text" maxLength={120} placeholder="Your full name" autoComplete="name" required />
                      </Field>
                    </Col>
                    <Col sm={6}>
                      <Field label="Enrollment Number" required hint="As printed on your college ID card / BTEUP records.">
                        <Form.Control
                          name="enrollmentNumber"
                          type="text"
                          maxLength={30}
                          placeholder="e.g. E2312345678"
                          className="text-uppercase"
                          required
                        />
                      </Field>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Field label="Course" required>
                        <Select name="course" placeholder="Select course" list={options.courses} />
                      </Field>
                    </Col>
                    <Col sm={6} md={3}>
                      <Field label="Year" required>
                        <Select
                          name="year"
                          placeholder="Year"
                          list={options.years}
                          value={year}
                          onChange={(e) => {
                            setYear(e.target.value);
                            setSemester('');
                          }}
                        />
                      </Field>
                    </Col>
                    <Col sm={6} md={3}>
                      <Field label="Semester" required>
                        <Form.Select
                          name="semester"
                          required
                          value={semester}
                          onChange={(e) => setSemester(e.target.value)}
                          disabled={!year}
                        >
                          <option value="" disabled>{year ? 'Semester' : 'Pick year first'}</option>
                          {semesters.map((s) => (
                            <option key={s} value={s}>{semesterLabel(s)}</option>
                          ))}
                        </Form.Select>
                      </Field>
                    </Col>
                  </Row>
                </>
              )}

              {type === 'parent' && (
                <>
                  <SectionTitle icon="bi-person-hearts">Parent / Guardian Details</SectionTitle>
                  <Row>
                    <Col sm={6}>
                      <Field label="Parent / Guardian Name" required>
                        <Form.Control name="parentName" type="text" maxLength={120} placeholder="Your full name" autoComplete="name" required />
                      </Field>
                    </Col>
                    <Col sm={6}>
                      <Field label="Relation with Student" required>
                        <Select name="relation" placeholder="Select relation" list={options.relations} />
                      </Field>
                    </Col>
                  </Row>
                  <SectionTitle icon="bi-mortarboard">Student Details</SectionTitle>
                  <Row>
                    <Col sm={6}>
                      <Field label="Student Name" required>
                        <Form.Control name="name" type="text" maxLength={120} placeholder="Student's full name" required />
                      </Field>
                    </Col>
                    <Col sm={6}>
                      <Field label="Student Enrollment Number" required>
                        <Form.Control
                          name="enrollmentNumber"
                          type="text"
                          maxLength={30}
                          placeholder="Student's enrollment number"
                          className="text-uppercase"
                          required
                        />
                      </Field>
                    </Col>
                  </Row>
                </>
              )}

              {type === 'employee' && (
                <>
                  <SectionTitle icon="bi-person-badge">Faculty / Staff Details</SectionTitle>
                  <Row>
                    <Col sm={6}>
                      <Field label="Full Name" required>
                        <Form.Control name="name" type="text" maxLength={120} placeholder="Your full name" autoComplete="name" required />
                      </Field>
                    </Col>
                    <Col sm={6}>
                      <Field label="Designation" required>
                        <Form.Control name="designation" type="text" maxLength={120} placeholder="e.g. Lecturer, Workshop Instructor" required />
                      </Field>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={6}>
                      <Field label="Department" required>
                        <Select name="department" placeholder="Select department" list={options.departments} />
                      </Field>
                    </Col>
                    <Col sm={6}>
                      <Field label="Pension Scheme" required>
                        <div className="igrs-segment" role="radiogroup" aria-label="Pension scheme">
                          {PENSION_SCHEMES.map((s) => (
                            <label key={s.value} className={scheme === s.value ? 'is-active' : ''}>
                              <input
                                type="radio"
                                name="pensionScheme"
                                value={s.value}
                                checked={scheme === s.value}
                                onChange={() => setScheme(s.value)}
                                required
                              />
                              {s.label}
                            </label>
                          ))}
                        </div>
                      </Field>
                    </Col>
                  </Row>
                  <Field label={schemeLabel} required hint="Used in place of an employee ID to identify you in the institute's records.">
                    <Form.Control
                      name="employeeId"
                      type="text"
                      maxLength={30}
                      placeholder={scheme === 'GPF' ? 'Your GPF account number' : 'Your 12-digit PRAN / GPF number'}
                      className="text-uppercase"
                      required
                    />
                  </Field>
                </>
              )}

              <SectionTitle icon="bi-telephone">Contact Details</SectionTitle>
              <Row>
                <Col sm={6}>
                  <Field label={type === 'parent' ? 'Parent / Guardian Mobile' : 'Mobile Number'} required>
                    <div className="input-icon">
                      <i className="bi bi-telephone-fill" aria-hidden="true" />
                      <Form.Control
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        pattern="[6-9][0-9]{9}"
                        maxLength={10}
                        title="A 10-digit Indian mobile number"
                        placeholder="10-digit mobile number"
                        autoComplete="tel-national"
                        required
                      />
                    </div>
                  </Field>
                </Col>
                <Col sm={6}>
                  <Field label="Email Address" required hint="Your receipt and every status update are sent here.">
                    <div className="input-icon">
                      <i className="bi bi-envelope-fill" aria-hidden="true" />
                      <Form.Control name="email" type="email" maxLength={200} placeholder="you@example.com" autoComplete="email" required />
                    </div>
                  </Field>
                </Col>
              </Row>

              <SectionTitle icon="bi-chat-square-text">Grievance</SectionTitle>
              <Field label="Grievance Category" required>
                <Select name="category" placeholder="Select category" list={CATEGORIES[type]} />
              </Field>

              <Field label="Subject" required>
                <Form.Control name="subject" type="text" maxLength={200} placeholder="Brief subject of your grievance" required />
              </Field>

              <Field
                label="Description"
                required
                hint={
                  <span className="d-flex justify-content-between gap-3">
                    <span>Include dates, places and any people involved so the committee can act quickly.</span>
                    <span className={descLength > DESCRIPTION_MAX - 200 ? 'text-danger' : ''}>
                      {descLength}/{DESCRIPTION_MAX}
                    </span>
                  </span>
                }
              >
                <Form.Control
                  name="description"
                  as="textarea"
                  rows={6}
                  minLength={20}
                  maxLength={DESCRIPTION_MAX}
                  onChange={(e) => setDescLength(e.target.value.length)}
                  placeholder="Describe your grievance in detail..."
                  required
                />
              </Field>

              <Form.Group className="mb-4">
                <Form.Check
                  type="checkbox"
                  id={`igrs-declaration-${type}`}
                  required
                  label="I declare that the information provided above is true to the best of my knowledge."
                />
              </Form.Group>

              {error && (
                <Alert variant="danger" className="border-0 small d-flex align-items-center gap-2" role="alert">
                  <i className="bi bi-exclamation-circle-fill" aria-hidden="true" />
                  {error}
                </Alert>
              )}

              <Button type="submit" className="btn-gold w-100 justify-content-center" disabled={submitting}>
                {submitting ? (
                  <span className="spinner-border spinner-border-sm" aria-hidden="true" />
                ) : (
                  <i className="bi bi-send-fill" aria-hidden="true" />
                )}
                {submitting ? 'Submitting…' : 'Submit Grievance'}
              </Button>
            </Form>
          </div>
        </div>
      </Col>

      <Col xl={4}>
        <div className="panel">
          <div className="panel-header">
            <i className="bi bi-signpost-split-fill" aria-hidden="true" />
            What Happens Next
          </div>
          <div className="panel-body">
            <ul className="timeline mb-0">
              {STEPS.map((step) => (
                <li key={step.title}>
                  <h4 className="h6">
                    <i className={`bi ${step.icon} me-2 text-gold`} aria-hidden="true" />
                    {step.title}
                  </h4>
                  <p>{step.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="panel mt-4">
          <div className="panel-header">
            <i className="bi bi-shield-lock-fill" aria-hidden="true" />
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
          <i className="bi bi-search side-cta-icon" aria-hidden="true" />
          <h4 className="h6">Already Submitted?</h4>
          <p>Track an existing grievance using its reference number.</p>
          <Link href="/igrs/status" className="btn-gold btn-sm">
            Check Status
            <i className="bi bi-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </Col>
    </Row>
  );
}
