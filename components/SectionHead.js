"use client";

import React from 'react';

/**
 * Centred section heading with an eyebrow and the signature gold flourish.
 * Pass align="start" for left-aligned sections.
 */
export default function SectionHead({ eyebrow, icon = 'bi-gem', title, subtitle, align = 'center' }) {
  return (
    <div className={`section-head ${align === 'start' ? 'section-head-start' : ''}`}>
      {eyebrow && (
        <span className="eyebrow">
          <i className={`bi ${icon}`} />
          {eyebrow}
        </span>
      )}
      <h2>{title}</h2>
      <div className={`gold-flourish ${align === 'start' ? 'gold-flourish-start' : ''}`}>
        <i className="bi bi-diamond-fill" />
      </div>
      {subtitle && <p>{subtitle}</p>}
    </div>
  );
}
