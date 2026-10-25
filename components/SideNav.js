"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Sticky sidebar used by the department, placements, counselling, employee and
 * IGRS sections.
 *
 * items: [{ href, label, icon, external }] — an external item opens the
 * government portal in a new tab and never reads as the current page.
 *
 * On a phone the rail sits above the content it belongs to, so a seven-item
 * list would push the page itself off the first screen. There the head becomes
 * a toggle: it names the page you are on and opens the list on tap. From lg up
 * the toggle is hidden and the list is always shown.
 */
export default function SideNav({ eyebrow, title, items, cta }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const current = items.find((item) => !item.external && item.href === pathname);
  const listId = React.useId();

  return (
    <div className="side-rail">
      <nav className={`side-nav ${open ? 'is-open' : ''}`} aria-label={title}>
        <div className="side-nav-head">
          {eyebrow && (
            <span className="eyebrow eyebrow-light">
              <i className="bi bi-bookmark-star-fill" aria-hidden="true" />
              {eyebrow}
            </span>
          )}
          <h5>{title}</h5>

          <button
            type="button"
            className="side-nav-toggle"
            aria-expanded={open}
            aria-controls={listId}
            onClick={() => setOpen((wasOpen) => !wasOpen)}
          >
            <span>{current ? current.label : 'Browse this section'}</span>
            <i className={`bi ${open ? 'bi-chevron-up' : 'bi-chevron-down'}`} aria-hidden="true" />
          </button>
        </div>

        <div className="side-nav-list" id={listId}>
          {items.map((item) =>
            item.external ? (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="side-nav-link"
                onClick={() => setOpen(false)}
              >
                <i className={`bi ${item.icon}`} aria-hidden="true" />
                {item.label}
                <span className="visually-hidden"> (opens in a new tab)</span>
                <i className="bi bi-box-arrow-up-right ms-auto small" aria-hidden="true" />
              </a>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={`side-nav-link ${pathname === item.href ? 'is-active' : ''}`}
                aria-current={pathname === item.href ? 'page' : undefined}
                onClick={() => setOpen(false)}
              >
                <i className={`bi ${item.icon}`} aria-hidden="true" />
                {item.label}
              </Link>
            )
          )}
        </div>
      </nav>

      {cta && (
        <aside className="side-cta">
          <i className={`bi ${cta.icon || 'bi-headset'} side-cta-icon`} aria-hidden="true" />
          <h6>{cta.title}</h6>
          <p>{cta.text}</p>
          <Link href={cta.href} className="btn-gold btn-sm">
            {cta.label}
            <i className="bi bi-arrow-right" aria-hidden="true" />
          </Link>
        </aside>
      )}
    </div>
  );
}
