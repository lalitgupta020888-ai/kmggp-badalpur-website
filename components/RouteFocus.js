"use client";

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * After a client-side navigation, moves keyboard focus to the new page's main
 * landmark and announces its title.
 *
 * In a single-page app the document never reloads, so a screen reader is
 * otherwise left wherever it was — usually on the link just followed in the
 * navbar — with no sign that the page has changed. Next.js announces the new
 * title on its own; this adds the focus move, so the next Tab press starts
 * at the top of the new content and the first heading is read straight away.
 *
 * The first render is skipped: on a fresh load the browser already starts at
 * the top, and stealing focus there would defeat the skip link.
 */
export default function RouteFocus() {
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (window.location.hash) return;

    const main = document.getElementById('main-content');
    if (!main) return;

    const heading = main.querySelector('h1');
    const target = heading || main;
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname]);

  return null;
}
