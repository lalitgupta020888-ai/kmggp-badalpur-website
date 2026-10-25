"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import WelcomePopup from '@/components/WelcomePopup';
import AccessibilityBar from '@/components/AccessibilityBar';
import A11yEnhancer from '@/components/A11yEnhancer';
import RouteFocus from '@/components/RouteFocus';

/**
 * Keyboard shortcuts to the places a visitor most often needs. Each is a link
 * that appears only while focused, at the very top of the tab order, and each
 * carries an access key: Alt + key in Chrome and Edge, Alt + Shift + key in
 * Firefox, Control + Option + key in Safari. The full list is on /accessibility.
 * Access key 0 opens the accessibility options panel (see AccessibilityBar).
 */
const QUICK_ACCESS = [
  { href: '#main-content', label: 'Skip to main content', key: '2', plain: true },
  { href: '/', label: 'Home', key: '1' },
  { href: '/notices', label: 'Notices', key: '3' },
  { href: '/contact', label: 'Contact', key: '4' },
  { href: '/accessibility', label: 'Accessibility help', key: '5' },
];

function QuickAccess() {
  return (
    <nav className="skip-links" aria-label="Quick access">
      {QUICK_ACCESS.map((item) =>
        item.plain ? (
          <a key={item.key} href={item.href} className="skip-link" accessKey={item.key}>
            {item.label}
          </a>
        ) : (
          <Link key={item.key} href={item.href} className="skip-link" accessKey={item.key}>
            {item.label}
          </Link>
        )
      )}
    </nav>
  );
}

/**
 * The public site's chrome — navigation, footer, and the floating extras.
 *
 * The admin panel brings its own full-screen shell and must not sit inside the
 * visitor-facing header and footer, so this drops all of it under `/admin`.
 * Doing it here rather than with route groups keeps every existing page exactly
 * where it is; the alternative would mean moving all sixty of them into an
 * `app/(site)/` directory to give the panel a sibling root layout.
 *
 * `children` is passed straight through, so the pages inside stay server
 * components even though this wrapper is a client one.
 *
 * For assistive technology the frame also provides the quick-access links
 * (the first things a keyboard reaches), the `main` landmark they jump to, the
 * focus move after every client-side navigation, the content enhancer, and the
 * accessibility options panel.
 */
export default function SiteFrame({ children, videoAlbum, popup, chrome = {} }) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return (
      <>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <main id="main-content" tabIndex={-1}>
          {children}
        </main>
      </>
    );
  }

  return (
    <>
      <QuickAccess />
      <Navigation
        menus={chrome.menus}
        actions={chrome.actions}
        topbar={chrome.topbar}
        social={chrome.social}
        brand={chrome.brand}
      />
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
      <Footer officeHours={chrome.officeHours} social={chrome.social} topbar={chrome.topbar} />
      <ScrollToTop />
      <AccessibilityBar />
      <A11yEnhancer />
      <RouteFocus />
      <WelcomePopup popup={popup} galleryAlbum={videoAlbum} />
    </>
  );
}
