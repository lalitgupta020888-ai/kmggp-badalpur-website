"use client";

import React from 'react';
import Link from 'next/link';
import { NOTICES } from '@/lib/notices';

/**
 * The running announcement line that sits under the stat strip.
 *
 * The track holds the notices twice over and slides exactly half its width, so
 * the second copy lands where the first began and the loop is seamless. The
 * marquee pauses on hover and stands still under `prefers-reduced-motion`.
 */
export default function NewsTicker() {
  const items = [...NOTICES, ...NOTICES];

  return (
    <section className="news-ticker" aria-label="News updates and announcements">
      <div className="news-ticker-label">
        <i className="bi bi-broadcast-pin" />
        <span>News Updates &amp; Announcement</span>
      </div>

      <div className="news-ticker-viewport">
        <div className="news-ticker-track">
          {items.map((notice, index) => (
            <Link
              href={notice.link}
              key={`${notice.id}-${index}`}
              className="news-ticker-item"
              aria-hidden={index >= NOTICES.length}
              tabIndex={index >= NOTICES.length ? -1 : undefined}
            >
              <i className={`bi ${notice.icon}`} />
              <span>{notice.title}</span>
              {notice.isNew && <span className="news-ticker-new">NEW</span>}
              <span className="news-ticker-dot" aria-hidden="true" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
