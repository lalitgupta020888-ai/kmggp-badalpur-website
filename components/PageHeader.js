"use client";

import React from 'react';
import { Container } from 'react-bootstrap';
import Link from 'next/link';

/**
 * Premium banner used at the top of every inner page.
 * Navy wash + diagonal texture + gold rule along the bottom edge.
 *
 * crumbs: [{ label, href }] — the last entry renders as the current page.
 */
export default function PageHeader({ icon = 'bi-mortarboard-fill', eyebrow, title, subtitle, crumbs = [] }) {
  return (
    <header className="page-header">
      <Container>
        {eyebrow && (
          <span className="eyebrow eyebrow-light">
            <i className={`bi ${icon}`} />
            {eyebrow}
          </span>
        )}
        <h1>{title}</h1>
        {subtitle && <p className="page-sub">{subtitle}</p>}

        <nav className="page-crumb" aria-label="Breadcrumb">
          <Link href="/">
            <i className="bi bi-house-door-fill me-1" />
            Home
          </Link>
          {crumbs.map((crumb, i) => (
            <React.Fragment key={`${crumb.label}-${i}`}>
              <i className="bi bi-chevron-right sep" />
              {crumb.href && i !== crumbs.length - 1 ? (
                <Link href={crumb.href}>{crumb.label}</Link>
              ) : (
                <span className="current">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      </Container>
    </header>
  );
}
