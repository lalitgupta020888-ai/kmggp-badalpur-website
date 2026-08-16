"use client";

import React, { useActionState } from 'react';

import Flash from '@/components/admin/Flash';
import { changePassword } from '@/app/admin/actions';

export default function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePassword, null);

  return (
    <form action={formAction}>
      <Flash result={state} />

      <div className="admin-grid-2">
        <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
          <label htmlFor="current">Current password</label>
          <input
            id="current"
            name="current"
            type="password"
            className="admin-input"
            autoComplete="current-password"
            required
          />
        </div>

        <div className="admin-field">
          <label htmlFor="next">New password</label>
          <input
            id="next"
            name="next"
            type="password"
            className="admin-input"
            autoComplete="new-password"
            minLength={10}
            required
          />
          <div className="hint">At least 10 characters.</div>
        </div>

        <div className="admin-field">
          <label htmlFor="confirm">Repeat new password</label>
          <input
            id="confirm"
            name="confirm"
            type="password"
            className="admin-input"
            autoComplete="new-password"
            minLength={10}
            required
          />
        </div>
      </div>

      <button type="submit" className="admin-btn admin-btn-gold" disabled={pending}>
        <i className={`bi ${pending ? 'bi-hourglass-split' : 'bi-key-fill'}`} />
        {pending ? 'Changing…' : 'Change password'}
      </button>
    </form>
  );
}
