"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

/**
 * The accessibility options panel — the "screen reader access" control that
 * Indian government sites carry, folded into one floating button.
 *
 * Display modes (persisted in localStorage, applied as data attributes on
 * <html>; the styling lives in globals.css under "Accessibility modes"):
 *   text size · high contrast · greyscale · underline links · readable font ·
 *   text spacing · reading guide · large cursor · stop animations
 *
 * Read aloud: the main content is spoken block by block by the browser's own
 * speech engine, with the block being read highlighted and kept in view, and
 * play / pause / resume / stop and a speed setting. Useful for a visitor with
 * low vision or a reading difficulty who has no screen reader installed.
 *
 * Every change is confirmed through a polite live region, so a screen reader
 * hears "High contrast on" rather than nothing.
 *
 * Access keys (Alt + key in Chrome and Edge, Alt + Shift + key in Firefox,
 * Control + Option + key in Safari): 0 opens this panel; the others live in
 * SiteFrame and are listed on /accessibility.
 */

const STORAGE_KEY = 'kmggp-a11y';
const FONT_STEPS = [100, 112, 125, 150, 175];
const RATES = [
  { value: 0.8, label: 'Slow' },
  { value: 1, label: 'Normal' },
  { value: 1.25, label: 'Fast' },
];

const DEFAULTS = {
  font: 0,
  contrast: false,
  grey: false,
  underline: false,
  readable: false,
  spacing: false,
  guide: false,
  cursor: false,
  still: false,
  rate: 1,
};

const MODES = [
  { name: 'contrast', icon: 'bi-circle-half', label: 'High contrast' },
  { name: 'grey', icon: 'bi-droplet-half', label: 'Greyscale' },
  { name: 'underline', icon: 'bi-type-underline', label: 'Underline links' },
  { name: 'readable', icon: 'bi-fonts', label: 'Readable font' },
  { name: 'spacing', icon: 'bi-text-paragraph', label: 'Text spacing' },
  { name: 'guide', icon: 'bi-rulers', label: 'Reading guide' },
  { name: 'cursor', icon: 'bi-cursor-fill', label: 'Large cursor' },
  { name: 'still', icon: 'bi-pause-circle', label: 'Stop animations' },
];

const ATTRS = ['contrast', 'grey', 'underline', 'readable', 'spacing', 'guide', 'cursor', 'still'];

/* ------------------------------ Settings store ----------------------------- */

/* The preferences live outside React, in a tiny store read through
   `useSyncExternalStore`. The server and the first client render both see the
   defaults, so the markup matches; the stored values are applied the moment
   the store is first subscribed in the browser. */

const SERVER_STATE = {
  prefs: DEFAULTS,
  loaded: false,
  reading: 'idle', // idle | playing | paused
  status: '',
};
let state = SERVER_STATE;
const listeners = new Set();

function setState(patch) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener());
}

function announce(status) {
  // The same message twice would not be re-read; a trailing space makes it new.
  setState({ status: state.status === status ? `${status} ` : status });
}

function applyPrefs(prefs) {
  const root = document.documentElement;
  root.style.fontSize = prefs.font ? `${FONT_STEPS[prefs.font]}%` : '';
  ATTRS.forEach((name) => root.toggleAttribute(`data-a11y-${name}`, Boolean(prefs[name])));
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

function updatePrefs(patch, message) {
  const prefs = { ...state.prefs, ...patch };
  applyPrefs(prefs);
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
  } catch {
    /* private mode — the settings simply last for this page */
  }
  setState({ prefs });
  if (message) announce(message);
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

const READ_BLOCKS = 'h1, h2, h3, h4, p, li, blockquote, figcaption, dt, dd, th, td, .lead';
const READING_CLASS = 'a11y-reading';

let current = null;
let session = 0;

function clearHighlight() {
  if (current) current.classList.remove(READING_CLASS);
  current = null;
}

function highlight(el) {
  clearHighlight();
  current = el;
  el.classList.add(READING_CLASS);
  el.scrollIntoView({ block: 'center', behavior: 'smooth' });
}

/** Spoken text of one block, with icon glyphs and hidden helpers left out. */
function blockText(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll('[aria-hidden="true"], script, style').forEach((n) => n.remove());
  return clone.innerText.replace(/\s+/g, ' ').trim();
}

/** The readable blocks of the main landmark, outermost first, no nesting. */
function readableBlocks() {
  const main = document.getElementById('main-content');
  if (!main) return [];
  const all = Array.from(main.querySelectorAll(READ_BLOCKS));
  return all.filter((el) => {
    if (el.closest('[aria-hidden="true"]')) return false;
    if (el.offsetParent === null) return false;
    // A list item that holds its own paragraphs is read through them.
    if (all.some((other) => other !== el && el.contains(other))) return false;
    return blockText(el).length > 0;
  });
}

function stopReading(message) {
  session += 1;
  if (canSpeakNow()) window.speechSynthesis.cancel();
  clearHighlight();
  if (state.reading !== 'idle') setState({ reading: 'idle' });
  if (message) announce(message);
}

function pauseReading() {
  if (!canSpeakNow() || state.reading !== 'playing') return;
  window.speechSynthesis.pause();
  setState({ reading: 'paused' });
  announce('Reading paused');
}

function resumeReading() {
  if (!canSpeakNow() || state.reading !== 'paused') return;
  window.speechSynthesis.resume();
  setState({ reading: 'playing' });
  announce('Reading resumed');
}

function readPage() {
  if (!canSpeakNow()) return;
  stopReading();
  const blocks = readableBlocks();
  if (blocks.length === 0) {
    announce('Nothing to read on this page');
    return;
  }

  const mine = session;
  const synth = window.speechSynthesis;
  const lang = document.documentElement.lang || 'en-IN';

  blocks.forEach((el, index) => {
    const utterance = new SpeechSynthesisUtterance(blockText(el));
    utterance.lang = lang;
    utterance.rate = state.prefs.rate;
    utterance.onstart = () => {
      if (mine === session) highlight(el);
    };
    if (index === blocks.length - 1) {
      utterance.onend = () => {
        if (mine === session) stopReading('Finished reading');
      };
    }
    synth.speak(utterance);
  });

  setState({ reading: 'playing' });
  announce('Reading the page');
}

/* --------------------------------- Pieces ---------------------------------- */

function ModeButton({ name, icon, label, prefs }) {
  const on = Boolean(prefs[name]);
  return (
    <button
      type="button"
      className={`a11y-option ${on ? 'is-on' : ''}`}
      aria-pressed={on}
      onClick={() => updatePrefs({ [name]: !on }, `${label} ${on ? 'off' : 'on'}`)}
    >
      <i className={`bi ${icon}`} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
}

/** The horizontal band that follows the pointer when the reading guide is on. */
function ReadingGuide() {
  const ref = useRef(null);
  useEffect(() => {
    const onMove = (event) => {
      if (ref.current) ref.current.style.top = `${event.clientY}px`;
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => window.removeEventListener('mousemove', onMove);
  }, []);
  return <div ref={ref} className="a11y-guide" aria-hidden="true" />;
}

export default function AccessibilityBar() {
  const pathname = usePathname();
  const { prefs, reading, status } = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
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
    updatePrefs(DEFAULTS, 'All accessibility settings reset');
    stopReading();
  };

  return (
    <div className="a11y-bar">
      {/* Confirmations for screen readers — never shown, always announced. */}
      <div role="status" aria-live="polite" className="visually-hidden">
        {status}
      </div>

      {prefs.guide && <ReadingGuide />}

      <button
        ref={buttonRef}
        type="button"
        className={`a11y-launcher ${reading !== 'idle' ? 'is-reading' : ''}`}
        aria-expanded={open}
        aria-controls="a11y-panel"
        aria-label="Accessibility options"
        title="Accessibility options (access key 0)"
        accessKey="0"
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

        <div className="a11y-scroll">
          <div className="a11y-group" role="group" aria-label="Text size">
            <span className="a11y-group-label">Text size</span>
            <div className="a11y-font">
              <button
                type="button"
                aria-label="Decrease text size"
                disabled={prefs.font === 0}
                onClick={() => {
                  const font = Math.max(0, prefs.font - 1);
                  updatePrefs({ font }, `Text size ${FONT_STEPS[font]} percent`);
                }}
              >
                A<span aria-hidden="true">−</span>
              </button>
              <span className="a11y-font-value">{FONT_STEPS[prefs.font]}%</span>
              <button
                type="button"
                aria-label="Increase text size"
                disabled={prefs.font === FONT_STEPS.length - 1}
                onClick={() => {
                  const font = Math.min(FONT_STEPS.length - 1, prefs.font + 1);
                  updatePrefs({ font }, `Text size ${FONT_STEPS[font]} percent`);
                }}
              >
                A<span aria-hidden="true">+</span>
              </button>
            </div>
          </div>

          <div className="a11y-group" role="group" aria-label="Display">
            <span className="a11y-group-label">Display</span>
            <div className="a11y-options">
              {MODES.map((mode) => (
                <ModeButton key={mode.name} {...mode} prefs={prefs} />
              ))}
            </div>
          </div>

          {canSpeak && (
            <div className="a11y-group" role="group" aria-label="Read aloud">
              <span className="a11y-group-label">Read aloud</span>
              <div className="a11y-read">
                {reading === 'idle' && (
                  <button type="button" className="a11y-option is-primary" onClick={readPage}>
                    <i className="bi bi-volume-up-fill" aria-hidden="true" />
                    <span>Read this page</span>
                  </button>
                )}
                {reading === 'playing' && (
                  <button type="button" className="a11y-option is-primary" onClick={pauseReading}>
                    <i className="bi bi-pause-fill" aria-hidden="true" />
                    <span>Pause</span>
                  </button>
                )}
                {reading === 'paused' && (
                  <button type="button" className="a11y-option is-primary" onClick={resumeReading}>
                    <i className="bi bi-play-fill" aria-hidden="true" />
                    <span>Resume</span>
                  </button>
                )}
                <button
                  type="button"
                  className="a11y-option"
                  onClick={() => stopReading('Reading stopped')}
                  disabled={reading === 'idle'}
                >
                  <i className="bi bi-stop-circle" aria-hidden="true" />
                  <span>Stop</span>
                </button>
              </div>
              <div className="a11y-rate" role="radiogroup" aria-label="Reading speed">
                {RATES.map((rate) => (
                  <button
                    key={rate.value}
                    type="button"
                    role="radio"
                    aria-checked={prefs.rate === rate.value}
                    className={prefs.rate === rate.value ? 'is-on' : ''}
                    onClick={() => updatePrefs({ rate: rate.value }, `Reading speed ${rate.label}`)}
                  >
                    {rate.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="a11y-group a11y-keys" role="group" aria-label="Keyboard">
            <span className="a11y-group-label">Keyboard</span>
            <p className="a11y-hint">
              <kbd>Tab</kbd> moves between links and controls, <kbd>Enter</kbd> follows one,{' '}
              <kbd>Esc</kbd> closes a window. Access keys: <kbd>1</kbd> Home, <kbd>2</kbd> Main
              content, <kbd>3</kbd> Notices, <kbd>4</kbd> Contact, <kbd>5</kbd> Help,{' '}
              <kbd>0</kbd> this panel.
            </p>
          </div>
        </div>

        <div className="a11y-foot">
          <button type="button" className="a11y-reset" onClick={reset}>
            <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
            Reset all
          </button>
          <Link href="/accessibility" className="a11y-help" onClick={() => closePanel(false)}>
            Screen Reader Access &amp; help
            <i className="bi bi-arrow-right" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
