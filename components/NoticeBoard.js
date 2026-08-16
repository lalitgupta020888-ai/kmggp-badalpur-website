"use client";

import React from 'react';
import Link from 'next/link';

/**
 * The notice panel beside the hero on the home page.
 *
 * Shows the top of the notice list the admin maintains — the full set lives on
 * `/notices`, which the footer link leads to. `limit` keeps the panel from
 * growing taller than the hero next to it as notices accumulate.
 */
export default function NoticeBoard({ notices = [], limit = 5 }) {
  const shown = notices.slice(0, limit);

  return (
    <section className="notice-card">
      <div className="notice-head">
        <i className="bi bi-megaphone-fill" />
        Notice Board &amp; Updates
      </div>

      {shown.length === 0 ? (
        <div className="notice-list px-3 py-4 text-center text-muted small">
          There are no notices at the moment.
        </div>
      ) : (
        <ul className="notice-list">
          {shown.map((notice) => {
            const Title = !notice.link ? 'span' : notice.external ? 'a' : Link;
            const linkProps = !notice.link
              ? {}
              : notice.external
                ? { href: notice.link, target: '_blank', rel: 'noopener noreferrer' }
                : { href: notice.link };

            return (
              <li className="notice-item" key={notice.id}>
                <span className="icon-tile icon-tile-sm">
                  <i className={`bi ${notice.icon}`} />
                </span>
                <div>
                  <Title {...linkProps}>
                    {notice.title}
                    {notice.isNew && <span className="badge-new">NEW</span>}
                  </Title>
                  {notice.date && (
                    <div className="notice-date">
                      <i className="bi bi-clock" />
                      {notice.date}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <div className="notice-foot">
        <Link href="/notices">
          View All Notices <i className="bi bi-arrow-right" />
        </Link>
      </div>
    </section>
  );
}
