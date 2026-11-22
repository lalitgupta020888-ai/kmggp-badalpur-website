"use client";

import React, { useEffect, useRef, useState } from 'react';
import { Row, Col, Form, Button, Alert } from 'react-bootstrap';
import {
  igrsRecoveryHint,
  requestIgrsOtp,
  resetIgrsPassword,
  verifyIgrsLogin,
} from '@/app/igrs/admin/actions';

const NOTICES = [
  { icon: 'bi-shield-lock-fill', text: 'Restricted to members of the institute grievance committee.' },
  { icon: 'bi-eye-slash-fill', text: 'Never share your credentials. The institute will never ask for your password.' },
  { icon: 'bi-clock-history', text: 'Every status change and remark is recorded against the case.' },
];

/* --------------------------------- Pieces -------------------------------- */

export function PasswordInput({ value, onChange, placeholder, autoComplete, id, autoFocus }) {
  const [show, setShow] = useState(false);
  return (
    <div className="input-icon input-icon-action">
      <i className="bi bi-key-fill" aria-hidden="true" />
      <Form.Control
        id={id}
        type={show ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        required
      />
      <button
        type="button"
        className="input-action"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? 'Hide password' : 'Show password'}
        title={show ? 'Hide password' : 'Show password'}
      >
        <i className={`bi ${show ? 'bi-eye-slash' : 'bi-eye'}`} aria-hidden="true" />
      </button>
    </div>
  );
}

/** 0–4 score for the strength bar. Mirrors the server rule (8+, letters and digits). */
function strength(password) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Za-z]/.test(password) && /\d/.test(password)) score += 1;
  if (password.length >= 12) score += 1;
  if (/[^A-Za-z0-9]/.test(password) && /[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
  return score;
}
const STRENGTH = ['Too short', 'Weak', 'Fair', 'Good', 'Strong'];

export function StrengthMeter({ password }) {
  if (!password) return null;
  const score = strength(password);
  return (
    <div className={`pw-meter is-${score}`} aria-live="polite">
      <div className="pw-meter-bar">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={n <= score ? 'is-on' : ''} />
        ))}
      </div>
      <small>{STRENGTH[score]} · at least 8 characters with letters and numbers</small>
    </div>
  );
}

/** Six single-digit boxes that behave as one field (typing, backspace, paste). */
function OtpInput({ value, onChange, disabled }) {
  const refs = useRef([]);
  const digits = Array.from({ length: 6 }, (_, i) => value[i] || '');

  const setAt = (index, digit) => {
    const next = digits.slice();
    next[index] = digit;
    onChange(next.join('').slice(0, 6));
  };

  const onKey = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      refs.current[index - 1]?.focus();
      setAt(index - 1, '');
      event.preventDefault();
    }
    if (event.key === 'ArrowLeft' && index > 0) refs.current[index - 1]?.focus();
    if (event.key === 'ArrowRight' && index < 5) refs.current[index + 1]?.focus();
  };

  const onInput = (index, raw) => {
    const clean = raw.replace(/\D/g, '');
    if (!clean) return setAt(index, '');
    if (clean.length > 1) {
      // Pasted or autofilled the whole code.
      const merged = (digits.slice(0, index).join('') + clean).slice(0, 6);
      onChange(merged);
      refs.current[Math.min(merged.length, 5)]?.focus();
      return undefined;
    }
    setAt(index, clean);
    if (index < 5) refs.current[index + 1]?.focus();
    return undefined;
  };

  return (
    <div className="otp-boxes" role="group" aria-label="6-digit code">
      {digits.map((digit, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={6}
          value={digit}
          disabled={disabled}
          aria-label={`Digit ${i + 1}`}
          onChange={(e) => onInput(i, e.target.value)}
          onKeyDown={(e) => onKey(i, e)}
          onFocus={(e) => e.target.select()}
        />
      ))}
    </div>
  );
}

function AuthFrame({ icon, title, subtitle, children }) {
  return (
    <Row>
      <Col md={11} lg={9} xl={7} className="mx-auto">
        <div className="auth-card igrs-auth">
          <div className="auth-head">
            <span className="auth-emblem">
              <i className={`bi ${icon}`} aria-hidden="true" />
            </span>
            <h4>{title}</h4>
            <p>{subtitle}</p>
          </div>
          <div className="p-4 p-sm-5">{children}</div>
        </div>
      </Col>
    </Row>
  );
}

function ErrorLine({ children }) {
  if (!children) return null;
  return (
    <Alert variant="danger" className="border-0 small d-flex align-items-center gap-2" role="alert">
      <i className="bi bi-exclamation-circle-fill" aria-hidden="true" />
      {children}
    </Alert>
  );
}

/* ---------------------------------- Login --------------------------------- */

export function AdminLogin({ onSuccess, notice }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [flash, setFlash] = useState(notice || '');

  if (mode === 'forgot') {
    return (
      <ForgotPassword
        onDone={(message) => {
          setMode('login');
          setPassword('');
          setError('');
          setFlash(message || '');
        }}
      />
    );
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setFlash('');
    setChecking(true);
    const result = await verifyIgrsLogin(username.trim(), password, remember).catch(() => ({
      ok: false,
      error: 'Could not reach the server. Please try again.',
    }));
    setChecking(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setPassword('');
    onSuccess(remember);
  };

  return (
    <AuthFrame
      icon="bi-person-lock"
      title="Grievance Committee Login"
      subtitle="Integrated Grievance Redressal System — Km. Mayawati Government Girls Polytechnic"
    >
      <Alert variant="warning" className="d-flex align-items-start gap-3 border-0 small mb-4">
        <i className="bi bi-exclamation-triangle-fill fs-5 lh-1 mt-1" aria-hidden="true" />
        <span>
          Authorised committee members only. Unauthorised access attempts are logged and may invite
          disciplinary or legal action.
        </span>
      </Alert>

      {flash && (
        <Alert variant="success" className="border-0 small d-flex align-items-center gap-2" role="status">
          <i className="bi bi-check-circle-fill" aria-hidden="true" />
          {flash}
        </Alert>
      )}

      <Form className="premium-form" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="igrs-user">
          <Form.Label>User ID</Form.Label>
          <div className="input-icon">
            <i className="bi bi-person-badge-fill" aria-hidden="true" />
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              required
            />
          </div>
        </Form.Group>

        <Form.Group className="mb-3" controlId="igrs-password">
          <div className="d-flex justify-content-between align-items-baseline">
            <Form.Label>Password</Form.Label>
            <button type="button" className="link-button small" onClick={() => setMode('forgot')}>
              Forgot password?
            </button>
          </div>
          <PasswordInput
            id="igrs-password"
            value={password}
            onChange={setPassword}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Check
            type="checkbox"
            id="igrs-remember"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            label="Keep me signed in on this device for 7 days"
          />
        </Form.Group>

        <ErrorLine>{error}</ErrorLine>

        <Button type="submit" className="btn-gold w-100 justify-content-center" disabled={checking}>
          {checking ? (
            <span className="spinner-border spinner-border-sm" aria-hidden="true" />
          ) : (
            <i className="bi bi-box-arrow-in-right" aria-hidden="true" />
          )}
          {checking ? 'Signing in…' : 'Sign In to Dashboard'}
        </Button>
      </Form>

      <div className="gold-rule-thin my-4" />

      <div className="auth-notes">
        {NOTICES.map((item) => (
          <div className="auth-note" key={item.text}>
            <i className={`bi ${item.icon}`} aria-hidden="true" />
            <span>{item.text}</span>
          </div>
        ))}
      </div>
    </AuthFrame>
  );
}

/* ----------------------------- Forgot password ---------------------------- */

function ForgotPassword({ onDone }) {
  const [step, setStep] = useState('send'); // send → verify
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [wait, setWait] = useState(0);

  useEffect(() => {
    let live = true;
    igrsRecoveryHint()
      .then((hint) => live && setEmail(hint.email))
      .catch(() => {});
    return () => {
      live = false;
    };
  }, []);

  // Resend countdown.
  useEffect(() => {
    if (wait <= 0) return undefined;
    const timer = window.setTimeout(() => setWait((w) => w - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [wait]);

  const send = async () => {
    setBusy(true);
    setError('');
    setInfo('');
    const result = await requestIgrsOtp().catch(() => ({ ok: false, error: 'Could not reach the server.' }));
    setBusy(false);
    if (result.waitSeconds) setWait(result.waitSeconds);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    setStep('verify');
    setCode('');
    setWait(result.resendIn || 60);
    setInfo(`A 6-digit code has been sent to ${result.email}. It is valid for 10 minutes.`);
  };

  const reset = async (event) => {
    event.preventDefault();
    if (code.length !== 6) {
      setError('Enter all 6 digits of the code.');
      return;
    }
    setBusy(true);
    setError('');
    const result = await resetIgrsPassword(code, next, confirm).catch(() => ({
      ok: false,
      error: 'Could not reach the server.',
    }));
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    onDone('Password changed. Sign in with your new password.');
  };

  return (
    <AuthFrame
      icon="bi-shield-lock"
      title="Reset Committee Password"
      subtitle="A one-time code is sent to the college's official email address."
    >
      <ol className="reset-steps" aria-label="Progress">
        <li className={step === 'send' ? 'is-current' : 'is-done'}>
          <span>{step === 'send' ? '1' : <i className="bi bi-check-lg" aria-hidden="true" />}</span>
          Send code
        </li>
        <li className={step === 'verify' ? 'is-current' : ''}>
          <span>2</span>
          Verify &amp; set password
        </li>
      </ol>

      {step === 'send' && (
        <>
          <div className="reset-mailbox">
            <i className="bi bi-envelope-paper-fill" aria-hidden="true" />
            <div>
              <div className="label">Code will be sent to</div>
              <div className="value">{email || 'the college email'}</div>
            </div>
          </div>
          <p className="small text-muted">
            For security, reset codes go only to the institute&rsquo;s registered email — not to an
            address typed here. Ask the office to read you the code if you do not have access.
          </p>
          <ErrorLine>{error}</ErrorLine>
          <Button className="btn-gold w-100 justify-content-center" onClick={send} disabled={busy || wait > 0}>
            {busy ? <span className="spinner-border spinner-border-sm" aria-hidden="true" /> : <i className="bi bi-send-fill" aria-hidden="true" />}
            {busy ? 'Sending…' : wait > 0 ? `Try again in ${wait}s` : 'Send Code to College Email'}
          </Button>
        </>
      )}

      {step === 'verify' && (
        <Form className="premium-form" onSubmit={reset}>
          {info && (
            <Alert variant="success" className="border-0 small d-flex align-items-start gap-2" role="status">
              <i className="bi bi-envelope-check-fill mt-1" aria-hidden="true" />
              <span>{info}</span>
            </Alert>
          )}

          <Form.Group className="mb-3">
            <Form.Label>One-time code</Form.Label>
            <OtpInput value={code} onChange={setCode} disabled={busy} />
            <div className="d-flex justify-content-end mt-2">
              <button type="button" className="link-button small" onClick={send} disabled={busy || wait > 0}>
                {wait > 0 ? `Resend code in ${wait}s` : 'Resend code'}
              </button>
            </div>
          </Form.Group>

          <Form.Group className="mb-3" controlId="igrs-new-password">
            <Form.Label>New password</Form.Label>
            <PasswordInput id="igrs-new-password" value={next} onChange={setNext} placeholder="New password" autoComplete="new-password" />
            <StrengthMeter password={next} />
          </Form.Group>

          <Form.Group className="mb-4" controlId="igrs-confirm-password">
            <Form.Label>Confirm new password</Form.Label>
            <PasswordInput id="igrs-confirm-password" value={confirm} onChange={setConfirm} placeholder="Type it again" autoComplete="new-password" />
            {confirm && next !== confirm && <Form.Text className="text-danger">The passwords do not match yet.</Form.Text>}
          </Form.Group>

          <ErrorLine>{error}</ErrorLine>

          <Button type="submit" className="btn-gold w-100 justify-content-center" disabled={busy}>
            {busy ? <span className="spinner-border spinner-border-sm" aria-hidden="true" /> : <i className="bi bi-shield-check" aria-hidden="true" />}
            {busy ? 'Saving…' : 'Reset Password'}
          </Button>
        </Form>
      )}

      <div className="text-center mt-4">
        <button type="button" className="link-button small" onClick={() => onDone('')}>
          <i className="bi bi-arrow-left me-1" aria-hidden="true" />
          Back to sign in
        </button>
      </div>
    </AuthFrame>
  );
}
