"use client";

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { syncPortalsNow } from '@/app/admin/actions';
import Flash from '@/components/admin/Flash';

/** "Sync now" — reads every portal immediately and refreshes the table. */
export default function SyncPortalsButton() {
  const [result, setResult] = useState(null);
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const run = () =>
    startTransition(async () => {
      const response = await syncPortalsNow().catch(() => ({ ok: false, message: 'Could not reach the server.' }));
      setResult(response);
      router.refresh();
    });

  return (
    <div className="d-flex flex-column align-items-end gap-2">
      <button type="button" className="admin-btn admin-btn-primary" onClick={run} disabled={pending}>
        <i className={`bi bi-arrow-repeat ${pending ? 'spin' : ''}`} aria-hidden="true" />
        {pending ? 'Syncing…' : 'Sync now'}
      </button>
      <Flash result={result} />
    </div>
  );
}
