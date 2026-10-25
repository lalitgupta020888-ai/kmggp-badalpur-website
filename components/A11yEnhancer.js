"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

/**
 * Finishing touches that a screen reader needs and that are impractical to
 * hand-write across sixty pages of admin-editable content.
 *
 *   - Every `<section>` with a heading is named after it, so it becomes a
 *     landmark a reader can jump between ("region: Notice Board & Updates").
 *   - A link to a PDF says so, because the file opens outside the page.
 *   - A link that opens a new tab says so, unless its text already does.
 *
 * It runs after each navigation and again whenever the page's content changes
 * (a filter applied, a panel opened). Everything it does is idempotent and
 * marked with a data attribute, so a second pass over the same element is a
 * no-op, and React never notices: the attributes and hidden spans it adds are
 * ones React does not manage.
 */

const HINT_TAB = ' (opens in a new tab)';
const HINT_PDF = ' (PDF)';

let sectionCounter = 0;

function hiddenSpan(text) {
  const span = document.createElement('span');
  span.className = 'visually-hidden';
  span.textContent = text;
  return span;
}

function nameSections(root) {
  root.querySelectorAll('section:not([aria-label]):not([aria-labelledby])').forEach((section) => {
    const heading = section.querySelector('h1, h2, h3');
    if (!heading || heading.closest('section') !== section) return;
    if (!heading.id) heading.id = `section-title-${(sectionCounter += 1)}`;
    section.setAttribute('aria-labelledby', heading.id);
  });
}

function hintLinks(root) {
  root.querySelectorAll('a[href]:not([data-a11y-hinted])').forEach((link) => {
    link.setAttribute('data-a11y-hinted', '1');

    const href = link.getAttribute('href') || '';
    const isPdf = /\.pdf(\?|#|$)/i.test(href);
    const newTab = link.getAttribute('target') === '_blank';
    if (!isPdf && !newTab) return;

    const label = link.getAttribute('aria-label');
    const spoken = (label || link.textContent || '').toLowerCase();
    const hints = [];
    if (isPdf && !spoken.includes('pdf')) hints.push(HINT_PDF);
    if (newTab && !spoken.includes('new tab') && !spoken.includes('new window')) hints.push(HINT_TAB);
    if (hints.length === 0) return;

    if (label) link.setAttribute('aria-label', label + hints.join(''));
    else link.appendChild(hiddenSpan(hints.join('')));
  });
}

function enhance() {
  const main = document.getElementById('main-content');
  if (!main) return;
  nameSections(main);
  hintLinks(document.body);
}

export default function A11yEnhancer() {
  const pathname = usePathname();

  useEffect(() => {
    enhance();

    let timer = null;
    const observer = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(enhance, 150);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, [pathname]);

  return null;
}
