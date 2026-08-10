"use client";

import React from 'react';
import Link from 'next/link';
import { NOTICES } from '@/lib/notices';

export default function NoticeBoard() {
  return (
    <section className="notice-card">
      <div className="notice-head">
        <i className="bi bi-megaphone-fill" />
        Notice Board &amp; Updates
      </div>

      <ul className="notice-list">
        {NOTICES.map((notice) => (
          <li className="notice-item" key={notice.id}>
            <span className="icon-tile icon-tile-sm">
              <i className={`bi ${notice.icon}`} />
            </span>
            <div>
              <Link href={notice.link}>
                {notice.title}
                {notice.isNew && <span className="badge-new">NEW</span>}
              </Link>
              <div className="notice-date">
                <i className="bi bi-clock" />
                {notice.date}
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="notice-foot">
        <Link href="/notices">
          View All Notices <i className="bi bi-arrow-right" />
        </Link>
      </div>
    </section>
  );
}
