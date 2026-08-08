"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Sticky sidebar used by the department, placements and counselling sections.
 * items: [{ href, label, icon, external }] — an external item opens the
 * government portal in a new tab and never reads as the current page.
 */
export default function SideNav({ eyebrow, title, items, cta }) {
  const pathname = usePathname();

  // The nav and the CTA are pinned together as one rail — pinning only the nav
  // would let the CTA scroll away from under it.
  return (
    <div className="side-rail">
      <nav className="side-nav">
        <div className="side-nav-head">
          {eyebrow && (
            <span className="eyebrow eyebrow-light">
              <i className="bi bi-bookmark-star-fill" />
              {eyebrow}
            </span>
          )}
          <h5>{title}</h5>
        </div>
        {items.map((item) =>
          item.external ? (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className="side-nav-link"
            >
              <i className={`bi ${item.icon}`} />
              {item.label}
              <i className="bi bi-box-arrow-up-right ms-auto small" aria-hidden="true" />
            </a>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={`side-nav-link ${pathname === item.href ? 'is-active' : ''}`}
            >
              <i className={`bi ${item.icon}`} />
              {item.label}
            </Link>
          )
        )}
      </nav>

      {cta && (
        <aside className="side-cta">
          <i className={`bi ${cta.icon || 'bi-headset'} side-cta-icon`} />
          <h6>{cta.title}</h6>
          <p>{cta.text}</p>
          <Link href={cta.href} className="btn-gold btn-sm">
            {cta.label}
            <i className="bi bi-arrow-right" />
          </Link>
        </aside>
      )}
    </div>
  );
}
