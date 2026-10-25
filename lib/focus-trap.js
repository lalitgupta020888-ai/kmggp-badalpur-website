"use client";

import { useEffect } from 'react';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), ' +
  'textarea:not([disabled]), video[controls], [tabindex]:not([tabindex="-1"])';

/**
 * Keeps keyboard focus inside an open dialog and hands it back afterwards.
 *
 * A screen-reader or keyboard user who tabs past the last control in a modal
 * must land on its first control again, not on the page hidden underneath;
 * and when the dialog closes, focus must return to whatever opened it rather
 * than falling to the top of the document.
 *
 * `ref` points at the dialog element; `active` is whether it is open.
 */
export function useFocusTrap(ref, active) {
  useEffect(() => {
    if (!active) return undefined;

    const opener = document.activeElement;
    const node = ref.current;

    const onKeyDown = (event) => {
      if (event.key !== 'Tab' || !node) return;
      const items = Array.from(node.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null || el === document.activeElement
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];
      const current = document.activeElement;

      if (event.shiftKey && (current === first || !node.contains(current))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && current === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      if (opener && typeof opener.focus === 'function' && document.contains(opener)) {
        opener.focus();
      }
    };
  }, [ref, active]);
}
