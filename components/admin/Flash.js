"use client";

import React, { useEffect, useState } from 'react';

/**
 * The result banner shown after a save.
 *
 * A successful message clears itself so the panel does not keep claiming
 * "Saved" long after the fact; an error stays until the next attempt, because
 * an error the admin scrolled past is an error they will not fix.
 */
export default function Flash({ result }) {
  const [visible, setVisible] = useState(Boolean(result));

  useEffect(() => {
    setVisible(Boolean(result));
    if (!result?.ok) return undefined;

    const timer = setTimeout(() => setVisible(false), 4000);
    return () => clearTimeout(timer);
  }, [result]);

  if (!result || !visible) return null;

  return (
    <div className={`admin-flash ${result.ok ? 'ok' : 'error'}`} role="status">
      <i className={`bi ${result.ok ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'}`} />
      <span>{result.message}</span>
    </div>
  );
}
