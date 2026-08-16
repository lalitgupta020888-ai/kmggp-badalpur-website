"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { signOut } from '@/app/login/actions';
import { sectionGroups } from '@/lib/sections/schema';

/**
 * The sidebar is part hand-written, part generated.
 *
 * The four sections below came first and have purpose-built pages. Everything
 * described in the schema is appended automatically, so making a new part of
 * the site editable puts it in this menu without touching this file.
 */
const NAV = [
  {
    group: 'Announcements',
    items: [
      { href: '/admin', label: 'Dashboard', icon: 'bi-speedometer2', exact: true },
      { href: '/admin/news', label: 'News & Updates', icon: 'bi-broadcast-pin' },
      { href: '/admin/notices', label: 'Notice Board', icon: 'bi-megaphone-fill' },
      { href: '/admin/gallery', label: 'Photos & Gallery', icon: 'bi-images' },
      { href: '/admin/orders', label: 'Orders & Circulars', icon: 'bi-file-earmark-pdf-fill' },
    ],
  },
  ...sectionGroups().map((group) => ({
    group: group.name,
    items: group.sections.map((section) => ({
      href: `/admin/content/${section.key}`,
      label: section.title,
      icon: section.icon,
    })),
  })),
  {
    group: 'Library',
    items: [{ href: '/admin/media', label: 'Media Library', icon: 'bi-collection-fill' }],
  },
  {
    group: 'System',
    items: [{ href: '/admin/settings', label: 'Settings', icon: 'bi-gear-fill' }],
  },
];

/** What the topbar says on each route, keyed by the section's base path. */
const TITLES = {
  '/admin': ['Dashboard', 'An overview of everything you can change on the site'],
  '/admin/news': ['News & Updates', 'The scrolling announcement line on the home page'],
  '/admin/notices': ['Notice Board', 'Announcements shown on the home page and /notices'],
  '/admin/gallery': ['Photos & Gallery', 'Albums, photographs and the welcome film'],
  '/admin/orders': ['Orders & Circulars', 'Published PDF documents'],
  '/admin/media': ['Media Library', 'Every file you have uploaded'],
  '/admin/settings': ['Settings', 'Your sign-in details and stored content'],
};

export default function AdminShell({ username, children }) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);

  // Longest matching prefix wins, so `/admin/gallery/campus` keeps the gallery
  // heading rather than falling back to the dashboard's.
  const titleKey = Object.keys(TITLES)
    .filter((key) => pathname === key || pathname.startsWith(`${key}/`))
    .sort((a, b) => b.length - a.length)[0];

  // Schema-described sections all live under one route, so their heading comes
  // from the schema rather than needing an entry in TITLES.
  const sectionKey = pathname.startsWith('/admin/content/')
    ? pathname.slice('/admin/content/'.length).split('/')[0]
    : null;
  const section = sectionKey
    ? sectionGroups()
        .flatMap((group) => group.sections)
        .find((entry) => entry.key === sectionKey)
    : null;

  const [title, subtitle] = section
    ? [section.title, section.group]
    : TITLES[titleKey] || ['Admin', ''];

  // A tap on a nav link on a phone should close the drawer behind it.
  useEffect(() => {
    setNavOpen(false);
  }, [pathname]);

  const isActive = (item) =>
    item.exact ? pathname === item.href : pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <div className={`admin-shell${navOpen ? ' nav-open' : ''}`}>
      <aside className="admin-sidebar">
        <Link href="/admin" className="admin-brand">
          <span className="admin-brand-mark">
            <i className="bi bi-shield-lock-fill" />
          </span>
          <span className="admin-brand-text">
            <strong>KMGGP Badalpur</strong>
            <span>Admin Panel</span>
          </span>
        </Link>

        <nav className="admin-nav">
          {NAV.map((section) => (
            <div key={section.group}>
              <div className="admin-nav-group">{section.group}</div>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`admin-nav-link${isActive(item) ? ' active' : ''}`}
                >
                  <i className={`bi ${item.icon}`} />
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-foot">
          <div className="admin-user">
            <span className="admin-user-avatar">{(username || 'A').charAt(0)}</span>
            <span className="flex-grow-1 text-truncate">
              {username}
              <br />
              <span style={{ fontSize: '0.72rem', opacity: 0.65 }}>Signed in</span>
            </span>
          </div>
        </div>
      </aside>

      <div
        className="admin-scrim"
        onClick={() => setNavOpen(false)}
        role="presentation"
        aria-hidden="true"
      />

      <div className="admin-main">
        <header className="admin-topbar">
          <button
            type="button"
            className="admin-burger"
            onClick={() => setNavOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            <i className="bi bi-list" />
          </button>

          <div className="min-w-0">
            <h1>{title || 'Dashboard'}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>

          <div className="admin-topbar-actions">
            <Link href="/" target="_blank" className="admin-btn" rel="noreferrer">
              <i className="bi bi-box-arrow-up-right" />
              <span className="d-none d-sm-inline">View Site</span>
            </Link>
            <form action={signOut}>
              <button type="submit" className="admin-btn admin-btn-danger">
                <i className="bi bi-box-arrow-right" />
                <span className="d-none d-sm-inline">Sign Out</span>
              </button>
            </form>
          </div>
        </header>

        <div className="admin-content">{children}</div>
      </div>
    </div>
  );
}
