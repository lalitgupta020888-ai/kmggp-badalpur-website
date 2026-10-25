"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import WelcomePopup from '@/components/WelcomePopup';
import AccessibilityBar from '@/components/AccessibilityBar';
import RouteFocus from '@/components/RouteFocus';

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
 * For assistive technology the frame also provides the skip link (the first
 * thing a keyboard reaches), the `main` landmark it jumps to, the focus move
 * after every client-side navigation, and the accessibility options panel.
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
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
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
      <RouteFocus />
      <WelcomePopup popup={popup} galleryAlbum={videoAlbum} />
    </>
  );
}
