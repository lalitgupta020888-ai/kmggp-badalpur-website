"use client";

import React from 'react';
import Link from 'next/link';

const NOTICES = [
  {
    id: 1,
    title: 'Admission 2026-27 is now open — apply through JEECUP counselling',
    date: 'Aug 01, 2026',
    icon: 'bi-mortarboard-fill',
    isNew: true,
    link: '/admission/process',
  },
  {
    id: 2,
    title: 'Even Semester examination schedule released',
    date: 'Jul 15, 2026',
    icon: 'bi-calendar-check-fill',
    isNew: true,
    link: '/academic/calendar',
  },
  {
    id: 3,
    title: 'Campus placement drive by Tech Mahindra',
    date: 'Jul 10, 2026',
    icon: 'bi-briefcase-fill',
    isNew: false,
    link: '/placements/records',
  },
  {
    id: 4,
    title: 'National level hackathon — registrations open',
    date: 'Jun 25, 2026',
    icon: 'bi-trophy-fill',
    isNew: false,
    link: '/department/cse/achievements',
  },
  {
    id: 5,
    title: 'Post-matric scholarship forms — last date reminder',
    date: 'Jun 12, 2026',
    icon: 'bi-cash-coin',
    isNew: false,
    link: '/scholarship',
  },
];

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
        <Link href="/academic/calendar">
          View All Notices <i className="bi bi-arrow-right" />
        </Link>
      </div>
    </section>
  );
}
