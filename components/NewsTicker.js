"use client";

import React from 'react';
import Link from 'next/link';

/**
 * The running announcement line that sits under the stat strip.
 *
 * The track holds the notices twice over and slides exactly half its width, so
 * the second copy lands where the first began and the loop is seamless. The
 * marquee pauses on hover and stands still under `prefers-reduced-motion`.
 *
 * `notices` comes from the admin panel, through the page above. With nothing to
 * announce the whole strip is left out rather than scrolling an empty bar.
 */
export default function NewsTicker({ notices: source = [] }) {
  if (source.length === 0) return null;

  const items = [...source, ...source];

  return (
    <section className="news-ticker" aria-label="News updates and announcements">
      <div className="news-ticker-label">
        <i className="bi bi-broadcast-pin" />
        <span>News Updates &amp; Announcement</span>
      </div>

      <div className="news-ticker-viewport">
        <div className="news-ticker-track">
          {items.map((notice, index) => {
            const isClone = index >= source.length;
            // An entry saved without a link still belongs in the ticker; it
            // just renders as plain text rather than an anchor to nowhere.
            const Item = !notice.link ? 'span' : notice.external ? 'a' : Link;
            const linkProps = !notice.link
              ? {}
              : notice.external
                ? { href: notice.link, target: '_blank', rel: 'noopener noreferrer' }
                : { href: notice.link };

            return (
              <Item
                key={`${notice.id}-${index}`}
                {...linkProps}
                className="news-ticker-item"
                aria-hidden={isClone}
                tabIndex={isClone ? -1 : undefined}
              >
                <i className={`bi ${notice.icon}`} />
                <span>{notice.title}</span>
                {notice.isNew && <span className="news-ticker-new">NEW</span>}
                <span className="news-ticker-dot" aria-hidden="true" />
              </Item>
            );
          })}
        </div>
      </div>
    </section>
  );
}
