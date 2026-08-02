"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * Sticky sidebar used by the department and placements sections.
 * items: [{ href, label, icon }]
 */
export default function SideNav({ eyebrow, title, items, cta }) {
  const pathname = usePathname();

  return (
    <>
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
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`side-nav-link ${pathname === item.href ? 'is-active' : ''}`}
          >
            <i className={`bi ${item.icon}`} />
            {item.label}
          </Link>
        ))}
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
    </>
  );
}
