"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { usePathname } from 'next/navigation';

/**
 * The accessibility options panel — the "screen reader access" control that
 * Indian government sites carry, folded into one floating button.
 *
 * What it offers:
 *   - text size, in steps, applied to the root font size so every rem scales
 *   - high contrast (black on yellow), the scheme most low-vision readers ask for
 *   - greyscale, for colour-blind readers
 *   - underlined links, so links no longer depend on colour alone
 *   - a readable font with wider spacing, for dyslexic readers
 *   - stop animations, which also halts the ticker and both sliders
 *   - read aloud: the page's main content, spoken by the browser's own
 *     speech engine, for a reader without a screen reader installed
 *
 * Settings persist in localStorage, so they follow the visitor across pages
 * and visits. They are applied as data attributes on <html>, and the styling
 * for each lives in globals.css under "Accessibility modes".
 */

const STORAGE_KEY = 'kmggp-a11y';
const FONT_STEPS = [100, 112, 125, 150, 175];

const DEFAULTS = {
  font: 0,
  contrast: false,
  grey: false,
  underline: false,
  readable: false,
  still: false,
};

/* ------------------------------ Settings store ----------------------------- */

/* The preferences live outside React, in a tiny store read through
   `useSyncExternalStore`. The server and the first client render both see the
   defaults, so the markup matches; the stored values are applied the moment
   the store is first subscribed in the browser. */

const SERVER_STATE = { prefs: DEFAULTS, speaking: false, loaded: false };
let state = SERVER_STATE;
const listeners = new Set();

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(patch) {
  state = { ...state, ...patch };
  emit();
}

function applyPrefs(prefs) {
  const root = document.documentElement;
  root.style.fontSize = prefs.font ? `${FONT_STEPS[prefs.font]}%` : '';
  root.toggleAttribute('data-a11y-contrast', prefs.contrast);
  root.toggleAttribute('data-a11y-grey', prefs.grey);
  root.toggleAttribute('data-a11y-underline', prefs.underline);
  root.toggleAttribute('data-a11y-readable', prefs.readable);
  root.toggleAttribute('data-a11y-still', prefs.still);
}

function loadPrefs() {
  if (state.loaded) return;
  let prefs = DEFAULTS;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) prefs = { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    /* unreadable storage — defaults it is */
  }
  applyPrefs(prefs);
  setState({ prefs, loaded: true });
}

function updatePrefs(patch) {
  const prefs = { ...state.prefs, ...patch };
  applyPrefs(prefs);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* private mode — the settings simply last for this page */
  }
  setState({ prefs });
}

function subscribe(listener) {
  listeners.add(listener);
  // Reading storage happens on the first subscription, which is always in the
  // browser and after hydration — never during render.
  loadPrefs();
  return () => listeners.delete(listener);
}

const getSnapshot = () => state;
const getServerSnapshot = () => SERVER_STATE;

/* -------------------------------- Read aloud ------------------------------- */

const noopSubscribe = () => () => {};
const canSpeakNow = () => 'speechSynthesis' in window;
const cannotSpeak = () => false;

/** The visitor-facing text of the main landmark, with hidden helpers left out. */
function mainText() {
  const main = document.getElementById('main-content');
  if (!main) return '';
  const clone = main.cloneNode(true);
  clone
    .querySelectorAll('[aria-hidden="true"], .visually-hidden, script, style, iframe, video')
    .forEach((el) => el.remove());
  return clone.innerText.replace(/\s+\n/g, '\n').replace(/[ \t]+/g, ' ').trim();
}

function stopReading() {
  if ('speechSynthesis' in window) window.speechSynthesis.cancel();
  if (state.speaking) setState({ speaking: false });
}

function readPage() {
  if (!canSpeakNow()) return;
  stopReading();
  const text = mainText();
  if (!text) return;

  // Long passages are split at sentence ends: some engines fall silent
  // partway through a single very long utterance.
  const chunks = text.match(/[^.!?\n]+[.!?\n]*/g) || [text];
  const synth = window.speechSynthesis;
  chunks.forEach((chunk, index) => {
    const utterance = new SpeechSynthesisUtterance(chunk.trim());
    utterance.lang = document.documentElement.lang || 'en-IN';
    utterance.rate = 0.95;
    if (index === chunks.length - 1) utterance.onend = () => setState({ speaking: false });
    synth.speak(utterance);
  });
  setState({ speaking: true });
}

/* --------------------------------- Pieces ---------------------------------- */

function ToggleOption({ name, icon, label, prefs }) {
  return (
    <button
      type="button"
      className={`a11y-option ${prefs[name] ? 'is-on' : ''}`}
      aria-pressed={prefs[name]}
      onClick={() => updatePrefs({ [name]: !prefs[name] })}
    >
      <i className={`bi ${icon}`} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

export default function AccessibilityBar() {
  const pathname = usePathname();
  const { prefs, speaking } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const canSpeak = useSyncExternalStore(noopSubscribe, canSpeakNow, cannotSpeak);

  // The panel remembers the path it was opened on, so a navigation closes it
  // without an effect: on the new page `openedAt` no longer matches.
  const [openedAt, setOpenedAt] = useState(null);
  const open = openedAt === pathname;
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  // Speech must not carry on into the next page.
  useEffect(() => {
    stopReading();
  }, [pathname]);

  const closePanel = (refocus) => {
    setOpenedAt(null);
    if (refocus) buttonRef.current?.focus();
  };

  // Escape closes the panel and returns focus to the button that opened it;
  // a click anywhere else just closes it.
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') closePanel(true);
    };
    const onClick = (event) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target) &&
        !buttonRef.current?.contains(event.target)
      ) {
        closePanel(false);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onClick);
    };
  }, [open]);

  const reset = () => {
    updatePrefs(DEFAULTS);
    stopReading();
  };

  return (
    <div className="a11y-bar">
      <button
        ref={buttonRef}
        type="button"
        className="a11y-launcher"
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label="Accessibility options"
        title="Accessibility options"
        onClick={() => setOpenedAt(open ? null : pathname)}
      >
        <i className="bi bi-universal-access-circle" aria-hidden="true" />
      </button>

      <div
        id="a11y-panel"
        ref={panelRef}
        className={`a11y-panel ${open ? 'is-open' : ''}`}
        role="region"
        aria-label="Accessibility options"
        hidden={!open}
      >
        <div className="a11y-panel-head">
          <i className="bi bi-universal-access-circle" aria-hidden="true" />
          <span>Accessibility Options</span>
          <button
            type="button"
            className="a11y-close"
            aria-label="Close accessibility options"
            onClick={() => closePanel(true)}
          >
            <i className="bi bi-x-lg" aria-hidden="true" />
          </button>
        </div>

        <div className="a11y-group" role="group" aria-label="Text size">
          <span className="a11y-group-label">Text size</span>
          <div className="a11y-font">
            <button
              type="button"
              aria-label="Decrease text size"
              disabled={prefs.font === 0}
              onClick={() => updatePrefs({ font: Math.max(0, prefs.font - 1) })}
            >
              A<span aria-hidden="true">−</span>
            </button>
            <span aria-live="polite" className="a11y-font-value">
              {FONT_STEPS[prefs.font]}%
            </span>
            <button
              type="button"
              aria-label="Increase text size"
              disabled={prefs.font === FONT_STEPS.length - 1}
              onClick={() =>
                updatePrefs({ font: Math.min(FONT_STEPS.length - 1, prefs.font + 1) })
              }
            >
              A<span aria-hidden="true">+</span>
            </button>
          </div>
        </div>

        <div className="a11y-group" role="group" aria-label="Display">
          <span className="a11y-group-label">Display</span>
          <div className="a11y-options">
            <ToggleOption name="contrast" icon="bi-circle-half" label="High contrast" prefs={prefs} />
            <ToggleOption name="grey" icon="bi-droplet-half" label="Greyscale" prefs={prefs} />
            <ToggleOption name="underline" icon="bi-type-underline" label="Underline links" prefs={prefs} />
            <ToggleOption name="readable" icon="bi-fonts" label="Readable font" prefs={prefs} />
            <ToggleOption name="still" icon="bi-pause-circle" label="Stop animations" prefs={prefs} />
          </div>
        </div>

        {canSpeak && (
          <div className="a11y-group" role="group" aria-label="Read aloud">
            <span className="a11y-group-label">Read aloud</span>
            <div className="a11y-options">
              <button type="button" className="a11y-option" onClick={readPage} disabled={speaking}>
                <i className="bi bi-volume-up-fill" aria-hidden="true" />
                <span>{speaking ? 'Reading…' : 'Read this page'}</span>
              </button>
              <button type="button" className="a11y-option" onClick={stopReading} disabled={!speaking}>
                <i className="bi bi-stop-circle" aria-hidden="true" />
                <span>Stop</span>
              </button>
            </div>
          </div>
        )}

        <div className="a11y-foot">
          <button type="button" className="a11y-reset" onClick={reset}>
            <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
            Reset to default
          </button>
          <p className="a11y-hint">
            Press <kbd>Tab</kbd> to move between links and controls, <kbd>Enter</kbd> to follow
            one, and <kbd>Esc</kbd> to close a window.
          </p>
        </div>
      </div>
    </div>
  );
}
