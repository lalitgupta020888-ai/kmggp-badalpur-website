import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';
import { getSection } from '@/lib/server/sections';

export const metadata = {
  title: 'Screen Reader Access & Accessibility',
  description:
    'How blind and visually impaired visitors can use this website: compatible screen readers, keyboard access keys, display options, read-aloud, and our accessibility statement.',
};

/* Screen readers the site is built to work with — the set the Guidelines for
   Indian Government Websites ask every public site to list. */
const SCREEN_READERS = [
  { name: 'NVDA (NonVisual Desktop Access)', href: 'https://www.nvaccess.org/download/', platform: 'Windows', cost: 'Free' },
  { name: 'JAWS (Job Access With Speech)', href: 'https://www.freedomscientific.com/products/software/jaws/', platform: 'Windows', cost: 'Commercial' },
  { name: 'Narrator', href: 'https://support.microsoft.com/windows/complete-guide-to-narrator-e4397a0d-ef4f-b386-d8ae-c172f109bdb1', platform: 'Windows (built in)', cost: 'Free' },
  { name: 'VoiceOver', href: 'https://www.apple.com/accessibility/vision/', platform: 'macOS, iPhone, iPad (built in)', cost: 'Free' },
  { name: 'TalkBack', href: 'https://support.google.com/accessibility/android/answer/6283677', platform: 'Android (built in)', cost: 'Free' },
  { name: 'ChromeVox', href: 'https://support.google.com/chromebook/answer/7031755', platform: 'ChromeOS (built in)', cost: 'Free' },
  { name: 'Orca', href: 'https://help.gnome.org/users/orca/stable/', platform: 'Linux', cost: 'Free' },
];

const ACCESS_KEYS = [
  { key: '1', action: 'Go to the Home page' },
  { key: '2', action: 'Skip to the main content of the current page' },
  { key: '3', action: 'Go to Notices' },
  { key: '4', action: 'Go to Contact Us' },
  { key: '5', action: 'Open this help page' },
  { key: '0', action: 'Open the Accessibility Options panel' },
];

const KEY_COMBOS = [
  { browser: 'Chrome, Edge, Brave (Windows, Linux)', combo: 'Alt + key' },
  { browser: 'Firefox (Windows, Linux)', combo: 'Alt + Shift + key' },
  { browser: 'Chrome, Edge, Firefox (Mac)', combo: 'Control + Option + key' },
  { browser: 'Safari (Mac)', combo: 'Control + Option + key' },
];

const GENERAL_KEYS = [
  { keys: 'Tab / Shift + Tab', action: 'Move forward / back through links, buttons and form fields' },
  { keys: 'Enter', action: 'Follow the focused link or press the focused button' },
  { keys: 'Space', action: 'Press a button, tick a box, open a menu' },
  { keys: 'Esc', action: 'Close an open menu, photo viewer, film or announcement' },
  { keys: 'Left / Right arrows', action: 'Previous / next photograph in the photo viewer' },
  { keys: 'H (in a screen reader)', action: 'Jump between headings — every page is outlined from one heading level 1 downward' },
  { keys: 'D or R (in a screen reader)', action: 'Jump between landmarks — banner, navigation, main, each named section, footer' },
];

const OPTIONS = [
  { icon: 'bi-type', title: 'Text size', text: 'Five steps from 100% to 175%. The whole page scales, including menus and forms.' },
  { icon: 'bi-circle-half', title: 'High contrast', text: 'Yellow text on a black background, with every card and button outlined.' },
  { icon: 'bi-droplet-half', title: 'Greyscale', text: 'Removes colour for visitors with colour-vision deficiency.' },
  { icon: 'bi-type-underline', title: 'Underline links', text: 'Links are shown by shape, not by colour alone.' },
  { icon: 'bi-fonts', title: 'Readable font', text: 'A plain typeface with wider letter spacing and taller lines.' },
  { icon: 'bi-text-paragraph', title: 'Text spacing', text: 'Wider word, letter and line spacing, as WCAG 1.4.12 describes.' },
  { icon: 'bi-rulers', title: 'Reading guide', text: 'A horizontal band that follows the pointer, to keep your place in a line.' },
  { icon: 'bi-cursor-fill', title: 'Large cursor', text: 'A bigger, high-contrast mouse pointer.' },
  { icon: 'bi-pause-circle', title: 'Stop animations', text: 'Halts the slideshow, the news ticker and every moving effect.' },
  { icon: 'bi-volume-up-fill', title: 'Read aloud', text: 'The page is spoken by your browser, one passage at a time, with the passage being read highlighted. Pause, resume, stop and choose a speed.' },
];

export default async function AccessibilityPage() {
  const topbar = await getSection('topbar');

  return (
    <>
      <PageHeader
        icon="bi-universal-access-circle"
        eyebrow="Accessible to Everyone"
        title="Screen Reader Access"
        subtitle="How blind and visually impaired visitors can read, navigate and use every part of this website — and what we commit to."
        crumbs={[{ label: 'Screen Reader Access' }]}
      />

      {/* Statement */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-5 align-items-start">
            <Col lg={7}>
              <SectionHead
                align="start"
                eyebrow="Our Commitment"
                icon="bi-heart-fill"
                title="Built so that sight is not a requirement"
              />
              <p className="lead">
                Km. Mayawati Government Girls Polytechnic, Badalpur is committed to ensuring that this
                website is accessible to all visitors, irrespective of device, technology or ability.
              </p>
              <p>
                The site is designed to meet the{' '}
                <a href="https://www.w3.org/TR/WCAG21/" target="_blank" rel="noopener noreferrer">
                  Web Content Accessibility Guidelines (WCAG) 2.1
                </a>{' '}
                at Level AA, and follows the{' '}
                <a href="https://guidelines.india.gov.in/" target="_blank" rel="noopener noreferrer">
                  Guidelines for Indian Government Websites (GIGW)
                </a>
                . In practice this means:
              </p>
              <ul className="gold-list">
                <li>
                  <i className="bi bi-check2-circle" aria-hidden="true" />
                  Every page has one main heading and an orderly outline beneath it, so a screen
                  reader can move through it heading by heading.
                </li>
                <li>
                  <i className="bi bi-check2-circle" aria-hidden="true" />
                  Banner, navigation, main content, each named section and the footer are landmarks
                  that can be jumped to directly.
                </li>
                <li>
                  <i className="bi bi-check2-circle" aria-hidden="true" />
                  Photographs carry descriptions; decorative icons are silent.
                </li>
                <li>
                  <i className="bi bi-check2-circle" aria-hidden="true" />
                  Everything works with the keyboard alone, with a visible focus ring; slideshows
                  and the news ticker can be paused, and menus, viewers and announcements close with
                  Escape.
                </li>
                <li>
                  <i className="bi bi-check2-circle" aria-hidden="true" />
                  Every form field is named, required fields are marked, and the result of sending a
                  form is announced.
                </li>
                <li>
                  <i className="bi bi-check2-circle" aria-hidden="true" />
                  Links that open a new tab or a PDF say so before you follow them.
                </li>
              </ul>
            </Col>

            <Col lg={5}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-universal-access-circle" aria-hidden="true" />
                  Accessibility Options
                </div>
                <div className="panel-body">
                  <p className="small">
                    The round button at the bottom-left of every page (access key <kbd>0</kbd>)
                    opens a panel of display and reading options. Your choices are remembered on
                    this device.
                  </p>
                  <ul className="list-unstyled a11y-option-list mb-0">
                    {OPTIONS.map((option) => (
                      <li key={option.title}>
                        <span className="icon-tile icon-tile-sm">
                          <i className={`bi ${option.icon}`} aria-hidden="true" />
                        </span>
                        <div>
                          <strong>{option.title}</strong>
                          <p className="small mb-0">{option.text}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Screen readers */}
      <section className="section" style={{ background: 'var(--paper)' }}>
        <Container>
          <SectionHead
            eyebrow="Assistive Technology"
            icon="bi-headphones"
            title="Screen readers this site works with"
            subtitle="Any standards-based screen reader will read this site. These are the ones we test with, with where to get them."
          />
          <div className="panel">
            <div className="table-responsive">
              <table className="premium-table">
                <caption className="visually-hidden">
                  Compatible screen readers, the platform each runs on, and whether it is free
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Screen reader</th>
                    <th scope="col">Platform</th>
                    <th scope="col">Cost</th>
                    <th scope="col">Website</th>
                  </tr>
                </thead>
                <tbody>
                  {SCREEN_READERS.map((reader) => (
                    <tr key={reader.name}>
                      <th scope="row">{reader.name}</th>
                      <td>{reader.platform}</td>
                      <td>{reader.cost}</td>
                      <td>
                        <a href={reader.href} target="_blank" rel="noopener noreferrer">
                          Get {reader.name.split(' (')[0]}
                          <i className="bi bi-box-arrow-up-right ms-2 small" aria-hidden="true" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="small text-muted mt-3 mb-0">
            Documents on this site are published as PDF. They open in the browser, or in Adobe
            Acrobat Reader, which is free and reads PDF text aloud under View &rarr; Read Out Loud.
          </p>
        </Container>
      </section>

      {/* Keyboard */}
      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <SectionHead
            eyebrow="No Mouse Needed"
            icon="bi-keyboard-fill"
            title="Keyboard navigation and access keys"
            subtitle="Six access keys reach the most-used places from anywhere on the site. The modifier depends on your browser."
          />
          <Row className="g-4">
            <Col lg={6}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-123" aria-hidden="true" />
                  Access keys
                </div>
                <div className="table-responsive">
                  <table className="premium-table">
                    <caption className="visually-hidden">Access keys and what each does</caption>
                    <thead>
                      <tr>
                        <th scope="col">Key</th>
                        <th scope="col">Goes to</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ACCESS_KEYS.map((item) => (
                        <tr key={item.key}>
                          <th scope="row">
                            <kbd className="a11y-kbd">{item.key}</kbd>
                          </th>
                          <td>{item.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="panel-body pt-3">
                  <p className="small fw-semibold mb-2">Press the key together with:</p>
                  <ul className="small mb-0 ps-3">
                    {KEY_COMBOS.map((item) => (
                      <li key={item.browser}>
                        <strong>{item.combo}</strong> — {item.browser}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-keyboard" aria-hidden="true" />
                  Everyday keys
                </div>
                <div className="table-responsive">
                  <table className="premium-table">
                    <caption className="visually-hidden">General keyboard controls</caption>
                    <thead>
                      <tr>
                        <th scope="col">Keys</th>
                        <th scope="col">What happens</th>
                      </tr>
                    </thead>
                    <tbody>
                      {GENERAL_KEYS.map((item) => (
                        <tr key={item.keys}>
                          <th scope="row">
                            <kbd className="a11y-kbd">{item.keys}</kbd>
                          </th>
                          <td>{item.action}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Feedback */}
      <section className="cta-band">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={8}>
              <span className="eyebrow eyebrow-light">
                <i className="bi bi-chat-dots-fill" aria-hidden="true" />
                Tell Us
              </span>
              <h2 className="h3">Found something hard to use?</h2>
              <div className="hero-gold-line" />
              <p>
                If any page, document or form on this site is difficult to read or operate with
                your assistive technology, please tell us which page and what went wrong. We aim to
                reply within seven working days and to fix the problem, or provide the information
                in another form.
              </p>
            </Col>
            <Col lg={4} className="d-flex flex-column gap-3 align-items-lg-end">
              {topbar.email && (
                <a href={`mailto:${topbar.email}?subject=Website%20accessibility`} className="btn-gold">
                  <i className="bi bi-envelope-fill" aria-hidden="true" />
                  {topbar.email}
                </a>
              )}
              {topbar.phone && (
                <a href={topbar.phoneHref || `tel:${topbar.phone}`} className="hero-btn-ghost">
                  <i className="bi bi-telephone-fill" aria-hidden="true" />
                  {topbar.phone}
                </a>
              )}
              <Link href="/contact" className="hero-btn-ghost">
                <i className="bi bi-pencil-square" aria-hidden="true" />
                Write to us
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
