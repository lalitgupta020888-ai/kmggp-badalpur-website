"use client";

import React, { useState } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import Link from 'next/link';

const NOTICES = [
  {
    icon: 'bi-shield-lock-fill',
    text: 'This portal is restricted to authorised institute staff only.',
  },
  {
    icon: 'bi-eye-slash-fill',
    text: 'Never share your credentials. The institute will never ask for your password.',
  },
  {
    icon: 'bi-clock-history',
    text: 'All login attempts and portal activity are recorded for audit purposes.',
  },
];

export default function AdminLoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Admin authentication will be connected to the backend.');
  };

  return (
    <div className="auth-wrap">
      <Container>
        <div className="auth-card">
          <div className="auth-head">
            <span className="auth-emblem">
              <i className="bi bi-shield-lock-fill" />
            </span>
            <h4>Admin Login</h4>
            <p>Restricted access — Km. Mayawati Government Girls Polytechnic, Badalpur</p>
          </div>

          <div className="p-4 p-sm-5">
            <Alert variant="warning" className="d-flex align-items-start gap-3 border-0 small mb-4">
              <i className="bi bi-exclamation-triangle-fill fs-5 lh-1 mt-1" />
              <span>
                Authorised personnel only. Unauthorised access attempts are logged and may invite
                disciplinary or legal action.
              </span>
            </Alert>

            <Form onSubmit={handleSubmit} className="premium-form">
              <Form.Group className="mb-3">
                <Form.Label>Admin ID / Username</Form.Label>
                <div className="input-icon">
                  <i className="bi bi-person-badge-fill" />
                  <Form.Control
                    type="text"
                    placeholder="Enter your admin ID"
                    autoComplete="username"
                    required
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <div className="input-icon input-icon-action">
                  <i className="bi bi-key-fill" />
                  <Form.Control
                    type={showPassword ? 'text' : 'password'}
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
                <Form.Label>Role</Form.Label>
                <div className="input-icon">
                  <i className="bi bi-diagram-3-fill" />
                  <Form.Select required defaultValue="">
                    <option value="" disabled>
                      Select your role
                    </option>
                    <option value="principal">Principal</option>
                    <option value="admin">Administrative Officer</option>
                    <option value="hod">Head of Department</option>
                    <option value="faculty">Faculty</option>
                    <option value="accounts">Accounts Section</option>
                    <option value="tnp">Training &amp; Placement Cell</option>
                  </Form.Select>
                </div>
              </Form.Group>

              <div className="d-flex justify-content-between align-items-center mb-4">
                <Form.Check
                  type="checkbox"
                  id="admin-remember"
                  label="Keep me signed in"
                  className="mb-0"
                />
                <Link
                  href="/contact"
                  className="text-decoration-none small"
                  style={{ color: 'var(--gold-700)' }}
                >
                  <i className="bi bi-question-circle me-1" />
                  Forgot Password?
                </Link>
              </div>

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

            <div className="text-center mt-4">
              <Link href="/" className="text-decoration-none small text-muted">
                <i className="bi bi-arrow-left me-1" />
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        <p className="text-center small text-muted mt-4 mb-0">
          Students looking for grievance services should use the{' '}
          <Link href="/igrs" className="fw-semibold text-decoration-none" style={{ color: 'var(--gold-700)' }}>
            IGRS Portal
          </Link>
          {' '}or the{' '}
          <Link
            href="/student/urise-portal"
            className="fw-semibold text-decoration-none"
            style={{ color: 'var(--gold-700)' }}
          >
            URISE Portal
          </Link>
          .
        </p>
      </Container>
    </div>
  );
}
