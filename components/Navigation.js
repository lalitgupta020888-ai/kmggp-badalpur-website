"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

/* Below this the navbar is collapsed into the toggler, where a menu belongs to
   whichever item was tapped — hover has no business opening anything. */
const HOVER_QUERY = '(min-width: 1400px)';

/* How long an open menu survives after the pointer leaves it. Long enough to
   cross the gap under the link, or to cut a corner on the way to the third
   item down, and short enough that a menu never feels stuck open. */
const CLOSE_DELAY = 280;

/* How long hover is ignored after a menu link is followed — long enough for
   the navbar to re-render and the new page to settle, short enough that a
   deliberate move back up to the bar is never refused. */
const REOPEN_LOCK = 500;

/**
 * Which menu is open is held for the whole bar, not per dropdown — one id, so
 * only one menu can be open at a time. Moving to a neighbouring link claims the
 * id, and the menu that held it goes the same instant: no delay, no pair of
 * menus briefly on screen together.
 */
function useMenuBar(pathname) {
  const [openId, setOpenId] = useState(null);
  const timer = useRef(null);
  const lockTimer = useRef(null);
  const hoverable = useRef(false);
  const locked = useRef(false);

  useEffect(() => {
    const query = window.matchMedia(HOVER_QUERY);
    const sync = () => {
      hoverable.current = query.matches;
    };

    sync();
    query.addEventListener('change', sync);
    return () => {
      query.removeEventListener('change', sync);
      clearTimeout(timer.current);
      clearTimeout(lockTimer.current);
    };
  }, []);

  const open = useCallback((id) => {
    // `locked` covers the moment just after a link inside a menu was followed.
    // The navbar re-renders on select and the page swaps underneath, and the
    // bar can slide a link under a pointer that never moved — which fires
    // mouseenter and reopens the menu the click just closed. Nothing opens on
    // hover until that has settled; a pointer genuinely on a menu only has to
    // move for the enter to fire again.
    if (!hoverable.current || locked.current) return;
    clearTimeout(timer.current);
    setOpenId(id);
  }, []);

  /**
   * Deferred, and conditional on the id not having moved on. A menu the pointer
   * has already left keeps its pending close, but if a neighbour claimed the
   * bar in the meantime that close must not fire — it would shut the new menu.
   */
  const close = useCallback((id) => {
    if (!hoverable.current) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setOpenId((current) => (current === id ? null : current));
    }, CLOSE_DELAY);
  }, []);

  // Clicks and the Escape key still route through React-Bootstrap, so the menus
  // keep their keyboard behaviour and close when a link inside one is followed.
  const toggle = useCallback((id, next) => {
    clearTimeout(timer.current);
    setOpenId((current) => (next ? id : current === id ? null : current));
  }, []);

  /* The plain links in the bar carry no menu of their own, so arriving at one
     is the same signal as arriving at a neighbouring dropdown: whatever is open
     is no longer what the pointer is on. */
  const closeNow = useCallback(() => {
    if (!hoverable.current) return;
    clearTimeout(timer.current);
    setOpenId(null);
  }, []);

  /* Following a link inside a menu — the one close that must happen at every
     width, so it is not behind the hover guard. React-Bootstrap closes on
     select too; this runs first and does not depend on it. */
  const closeAll = useCallback(() => {
    clearTimeout(timer.current);
    clearTimeout(lockTimer.current);
    locked.current = true;
    setOpenId(null);
    lockTimer.current = setTimeout(() => {
      locked.current = false;
    }, REOPEN_LOCK);
  }, []);

  /* A completed navigation is the same signal as the click that started it,
     and catches the cases the click handler cannot see — the browser's back
     button, or a link followed from somewhere else on the page. No lock here:
     the click that navigated already set one, and this also runs on the first
     render, where locking would deaden the bar for half a second on load. */
  useEffect(() => {
    clearTimeout(timer.current);
    setOpenId(null);
  }, [pathname]);

  return { openId, open, close, toggle, closeNow, closeAll };
}

/**
 * A NavDropdown that opens on hover and — the point of the exercise — does not
 * shut the moment the pointer leaves the link.
 *
 * Pure CSS cannot do this reliably. The menu is a DOM child of the nav item but
 * sits below it in layout, past the gap under the link, so `:hover` on the item
 * drops out mid-journey and a `display` toggle has nothing to transition. Mouse
 * events follow the DOM tree rather than the layout, so `onMouseLeave` on the
 * item fires once for the whole pair — and the close is deferred, giving the
 * pointer time to arrive before anything disappears.
 */
function HoverDropdown({ bar, title, id, children }) {
  return (
    <NavDropdown
      title={title}
      id={id}
      show={bar.openId === id}
      onToggle={(next) => bar.toggle(id, next)}
      onMouseEnter={() => bar.open(id)}
      onMouseLeave={() => bar.close(id)}
      renderMenuOnMount
    >
      {children}
    </NavDropdown>
  );
}

function DropdownLinks({ bar, items }) {
  return items.map((item, index) => (
    <NavDropdown.Item
      as={Link}
      href={item.href || '#'}
      key={item.id || `${item.href}-${index}`}
      onClick={bar.closeAll}
    >
      <i className={`bi ${item.icon || 'bi-dot'}`} />
      {item.label}
    </NavDropdown.Item>
  ));
}

/** Which react-bootstrap class each action button style maps to. */
const ACTION_CLASS = {
  ghost: 'nav-ghost nav-icon-only',
  cta: 'nav-cta',
  highlight: 'nav-highlight',
};

/**
 * The site header — the utility strip, the crest and the menu bar.
 *
 * Every part of it is content now: menus and their dropdown links, the action
 * buttons, the contact strip, the social icons and the crest all arrive as
 * props from the admin panel. A menu carrying `items` opens as a dropdown; one
 * with only an `href` is a plain link, which is how the sections that keep
 * their own sidebar (Placements, Gallery, Contact) behave.
 */
export default function Navigation({
  menus = [],
  actions = [],
  topbar = {},
  social = [],
  brand = {},
}) {
  const pathname = usePathname();
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const bar = useMenuBar(pathname);

  const shownSocial = social.filter((item) => item.href);

  return (
    // The whole header stays pinned while the page scrolls — the utility
    // bar and the navbar move together, not just the navbar.
    <header className="site-header">
      {/* Utility bar — contact details and social links */}
      <div className="topbar d-none d-lg-block">
        <Container fluid className="nav-shell d-flex align-items-center justify-content-between py-2">
          <div className="d-flex align-items-center gap-4">
            {topbar.address && (
              <span className="topbar-item">
                <i className="bi bi-geo-alt-fill" />
                {topbar.address}
              </span>
            )}
            {topbar.phone && (
              <a href={topbar.phoneHref || `tel:${topbar.phone}`} className="topbar-item">
                <i className="bi bi-telephone-fill" />
                {topbar.phone}
              </a>
            )}
            {topbar.email && (
              <a href={`mailto:${topbar.email}`} className="topbar-item">
                <i className="bi bi-envelope-fill" />
                {topbar.email}
              </a>
            )}
            {/* Staff-facing, so it sits in the utility bar rather than taking a
                slot in the main menu students use. */}
            {topbar.staffHref && (
              <Link
                href={topbar.staffHref}
                className={`topbar-item topbar-link ${isActive(topbar.staffHref) ? 'is-active' : ''}`}
              >
                <i className="bi bi-person-vcard-fill" />
                {topbar.staffLabel}
              </Link>
            )}
          </div>
          <div className="d-flex align-items-center gap-3">
            {/* The longest line in the bar — it only appears once there is
                genuinely room, otherwise the contact details wrap. */}
            {topbar.accreditation && (
              <span className="topbar-item topbar-accred">
                <i className="bi bi-award-fill" />
                {topbar.accreditation}
              </span>
            )}
            {/* Only profiles that actually have an address are shown — an icon
                linking to "#" invites a click that goes nowhere. */}
            {shownSocial.length > 0 && (
              <div className="topbar-social d-flex gap-2">
                {shownSocial.map((item) => (
                  <a
                    key={item.id || item.label}
                    href={item.href}
                    aria-label={item.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <i className={`bi ${item.icon}`} />
                  </a>
                ))}
              </div>
            )}
          </div>
        </Container>
      </div>

      {/* Nine nav links plus four action buttons need more than xl to breathe —
          below 1400px the bar collapses to the toggler instead of crushing
          the last button off the edge. */}
      <Navbar expand="xxl" className="navbar-custom" collapseOnSelect>
        <Container fluid className="nav-shell">
          <Navbar.Brand as={Link} href="/">
            <span className="brand-crest brand-crest--logo">
              {brand.logo && (
                <Image
                  src={brand.logo}
                  alt={`${brand.line1} ${brand.line2}`.trim() || 'Institute crest'}
                  width={92}
                  height={92}
                  priority
                />
              )}
            </span>
            <span className="brand-text">
              <span className="brand-line-1">{brand.line1}</span>
              <span className="brand-line-2">{brand.line2}</span>
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              {menus.map((menu) =>
                menu.items?.length ? (
                  <HoverDropdown bar={bar} title={menu.label} id={menu.id} key={menu.id}>
                    <DropdownLinks bar={bar} items={menu.items} />
                  </HoverDropdown>
                ) : (
                  <Nav.Link
                    as={Link}
                    href={menu.href || "#"}
                    key={menu.id}
                    className={isActive(menu.match || menu.href || "") ? "active" : ""}
                    onMouseEnter={bar.closeNow}
                  >
                    {menu.label}
                  </Nav.Link>
                ),
              )}
            </Nav>

            <Nav
              className="nav-actions gap-2 align-items-xl-center mt-3 mt-xl-0"
              onMouseEnter={bar.closeNow}
            >
              {/* The ghost buttons show their label only as a tooltip once the
                  bar is tight; the gold and accent ones swap to `shortLabel`.
                  Both spans are always rendered — CSS decides which is on. */}
              {actions.map((action) => (
                <Button
                  as={Link}
                  href={action.href || '#'}
                  key={action.id || action.label}
                  size="sm"
                  className={`${ACTION_CLASS[action.style] || ACTION_CLASS.ghost} ${
                    action.match && isActive(action.match) ? 'active' : ''
                  }`.trim()}
                  title={action.label}
                  aria-label={action.label}
                >
                  <i className={`bi ${action.icon || 'bi-arrow-right'}`} />
                  {action.style === 'ghost' ? (
                    <span className="nav-btn-label">{action.label}</span>
                  ) : (
                    <>
                      <span className="cta-label-full">{action.label}</span>
                      <span className="cta-label-short">{action.shortLabel || action.label}</span>
                    </>
                  )}
                </Button>
              ))}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
