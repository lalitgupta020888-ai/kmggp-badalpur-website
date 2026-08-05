"use client";

import React, { useState } from 'react';
import { Row, Col, Form, Button } from 'react-bootstrap';
import Link from 'next/link';
import {
  CATEGORIES,
  COURSES,
  DEPARTMENTS,
  RELATIONS,
  YEARS,
  saveGrievance,
} from '@/lib/igrs';

const STEPS = [
  { icon: 'bi-pencil-square', title: 'Fill the form', text: 'Share your details and describe the issue.' },
  { icon: 'bi-hash', title: 'Get a reference number', text: 'Issued instantly — save it to track the case.' },
  { icon: 'bi-people', title: 'Committee review', text: 'The grievance committee examines your case.' },
  { icon: 'bi-check2-circle', title: 'Resolution', text: 'Status and remarks are updated for you.' },
];

function Field({ label, children, required, hint }) {
  return (
    <Form.Group className="mb-3">
      <Form.Label>
        {label} {required && <span className="text-gold">*</span>}
      </Form.Label>
      {children}
      {hint && <Form.Text className="text-muted">{hint}</Form.Text>}
    </Form.Group>
  );
}

function Receipt({ grievance, type }) {
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
          Your {type} grievance has been recorded. Please save the reference number below — it is
          the only way to track your case.
        </p>

        <div className="ref-badge">
          <span className="ref-label">Reference Number</span>
          <span className="ref-value">{grievance.refNumber}</span>
        </div>

        <div className="d-flex flex-wrap gap-3 justify-content-center mt-4">
          <button type="button" className="btn-outline-navy" onClick={copyRef}>
            <i className={`bi ${copied ? 'bi-check-lg' : 'bi-clipboard'}`} />
            {copied ? 'Copied' : 'Copy Number'}
          </button>
          <Link href={`/igrs/status?ref=${grievance.refNumber}`} className="btn-gold">
            <i className="bi bi-search" />
            Track This Grievance
          </Link>
          <Link href="/" className="btn-outline-navy">
            <i className="bi bi-house-door" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

/**
 * Shared grievance form for the student, parent and employee pages.
 * The only difference between the three is the identity block at the top and
 * the category list, so the rest of the form is written once here.
 */
export default function GrievanceForm({ type, heading, icon }) {
  const [receipt, setReceipt] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    setReceipt(saveGrievance(data, type));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (receipt) {
    return (
      <Row>
        <Col xl={10} className="mx-auto">
          <Receipt grievance={receipt} type={type} />
        </Col>
      </Row>
    );
  }

  return (
    <Row className="g-4">
      <Col xl={8}>
        <div className="panel">
          <div className="panel-header">
            <i className={`bi ${icon}`} />
            {heading}
          </div>
          <div className="panel-body">
            <Form className="premium-form" onSubmit={handleSubmit}>
              <p className="text-muted small mb-4">
                Fields marked <span className="text-gold fw-bold">*</span> are required.
              </p>

              {type === 'student' && (
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

              {type === 'parent' && (
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

              {type === 'employee' && (
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
                  {CATEGORIES[type].map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </Form.Select>
              </Field>

              <Field label="Subject" required>
                <Form.Control name="subject" type="text" placeholder="Brief subject of your grievance" required />
              </Field>

              <Field
                label="Description"
                required
                hint="Include dates, places and any people involved so the committee can act quickly."
              >
                <Form.Control
                  name="description"
                  as="textarea"
                  rows={5}
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

              <Button type="submit" className="btn-gold w-100 justify-content-center">
                <i className="bi bi-send-fill" />
                Submit Grievance
              </Button>
            </Form>
          </div>
        </div>
      </Col>

      <Col xl={4}>
        <div className="panel">
          <div className="panel-header">
            <i className="bi bi-signpost-split-fill" />
            What Happens Next
          </div>
          <div className="panel-body">
            <ul className="timeline mb-0">
              {STEPS.map((step) => (
                <li key={step.title}>
                  <h6>
                    <i className={`bi ${step.icon} me-2 text-gold`} />
                    {step.title}
                  </h6>
                  <p>{step.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="panel mt-4">
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
          <Link href="/igrs/status" className="btn-gold btn-sm">
            Check Status
            <i className="bi bi-arrow-right" />
          </Link>
        </div>
      </Col>
    </Row>
  );
}
