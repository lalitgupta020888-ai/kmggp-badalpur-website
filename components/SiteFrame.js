"use client";

import React from 'react';
import { usePathname } from 'next/navigation';

import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import IntroVideo from '@/components/IntroVideo';

/**
 * The public site's chrome — navigation, footer, and the two floating extras.
 *
 * The admin panel brings its own full-screen shell and must not sit inside the
 * visitor-facing header and footer, so this drops all of it under `/admin`.
 * Doing it here rather than with route groups keeps every existing page exactly
 * where it is; the alternative would mean moving all sixty of them into an
 * `app/(site)/` directory to give the panel a sibling root layout.
 *
 * `children` is passed straight through, so the pages inside stay server
 * components even though this wrapper is a client one.
 */
export default function SiteFrame({ children, videoAlbum }) {
  const pathname = usePathname();

  if (pathname.startsWith('/admin')) {
    return <>{children}</>;
  }

  return (
    <>
      <Navigation />
      <main>{children}</main>
      <Footer />
      <ScrollToTop />
      <IntroVideo album={videoAlbum} />
    </>
  );
}
