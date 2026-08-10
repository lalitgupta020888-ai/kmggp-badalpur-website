"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const DEPARTMENTS = [
  { slug: 'electronics', name: 'Electronics Engineering', icon: 'bi-cpu-fill' },
  { slug: 'cse', name: 'Computer Science & Engineering', icon: 'bi-pc-display' },
  { slug: 'it', name: 'Information Technology', icon: 'bi-hdd-network-fill' },
  { slug: 'retail-management', name: 'P. G. Diploma in Retail Management', icon: 'bi-shop' },
  { slug: 'applied-sciences', name: 'Applied Sciences & Humanities', icon: 'bi-rulers' },
  { slug: 'non-technical-staff', name: 'Non-Technical Staff', icon: 'bi-people-fill' },
];

const ABOUT = [
  { href: '/about', label: 'About the Institute', icon: 'bi-buildings-fill' },
  { href: '/about/vision-mission', label: 'Vision & Mission', icon: 'bi-bullseye' },
  { href: '/about/principal-message', label: "Principal's Message", icon: 'bi-person-video2' },
  { href: '/about/approvals', label: 'Approvals by Statutory Bodies', icon: 'bi-patch-check-fill' },
  { href: '/about/aicte-approvals', label: 'AICTE Approval Letters', icon: 'bi-file-earmark-pdf-fill' },
];

const ACADEMIC = [
  { href: '/academic/calendar', label: 'Academic Calendar', icon: 'bi-calendar3' },
  { href: '/academic/holidays', label: 'List of Holidays', icon: 'bi-calendar-event' },
  { href: '/academic/syllabus', label: 'Syllabus', icon: 'bi-journal-bookmark' },
  { href: '/academic/time-table', label: 'Time-Table', icon: 'bi-clock-history' },
  { href: '/academic/verification', label: 'Educational Verification', icon: 'bi-patch-check' },
  {
    href: '/academic/caution-money-refund',
    label: 'Policy & Process for Refund of Caution Money',
    icon: 'bi-piggy-bank-fill',
  },
  {
    href: '/academic/certificate-issuance',
    label: 'Issuance of Certificate for Passout Students',
    icon: 'bi-award-fill',
  },
];

const ADMISSION = [
  { href: '/admission/courses', label: 'Courses Offered', icon: 'bi-collection' },
  { href: '/admission/process', label: 'Admission Process', icon: 'bi-signpost-split' },
  { href: '/admission/fee', label: 'Fee Structure', icon: 'bi-cash-coin' },
  { href: '/admission/booklet', label: 'Information Booklet 26-27', icon: 'bi-file-earmark-pdf' },
];

const STUDENT = [
  { href: '/student/urise-portal', label: 'Urise Portal', icon: 'bi-globe2' },
  { href: '/scholarship', label: 'Scholarship', icon: 'bi-cash-stack' },
];

const LIFE = [
  { href: '/life', label: 'Life @ KMGGP', icon: 'bi-stars' },
  { href: '/life/events', label: 'Events', icon: 'bi-balloon-fill' },
  { href: '/life/hostels', label: 'Hostels', icon: 'bi-house-heart-fill' },
  { href: '/life/library', label: 'Library', icon: 'bi-book-half' },
  { href: '/life/result', label: 'Result', icon: 'bi-file-earmark-text' },
];

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
  return items.map((item) => (
    <NavDropdown.Item as={Link} href={item.href} key={item.href} onClick={bar.closeAll}>
      <i className={`bi ${item.icon}`} />
      {item.label}
    </NavDropdown.Item>
  ));
}

export default function Navigation() {
  const pathname = usePathname();
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));
  const bar = useMenuBar(pathname);

  return (
    // The whole header stays pinned while the page scrolls — the utility
    // bar and the navbar move together, not just the navbar.
    <header className="site-header">
      {/* Utility bar — contact details and social links */}
      <div className="topbar d-none d-lg-block">
        <Container fluid className="nav-shell d-flex align-items-center justify-content-between py-2">
          <div className="d-flex align-items-center gap-4">
            <span className="topbar-item">
              <i className="bi bi-geo-alt-fill" />
              Badalpur, Gautam Buddha Nagar, Uttar Pradesh
            </span>
            <a href="tel:+910000000000" className="topbar-item">
              <i className="bi bi-telephone-fill" />
              +91 XXXXX XXXXX
            </a>
            <a href="mailto:info@kmggp.ac.in" className="topbar-item">
              <i className="bi bi-envelope-fill" />
              info@kmggp.ac.in
            </a>
            {/* Staff-facing, so it sits in the utility bar rather than taking a
                slot in the main menu students use. */}
            <Link
              href="/employee"
              className={`topbar-item topbar-link ${isActive('/employee') ? 'is-active' : ''}`}
            >
              <i className="bi bi-person-vcard-fill" />
              Employee Section
            </Link>
          </div>
          <div className="d-flex align-items-center gap-3">
            {/* The longest line in the bar — it only appears once there is
                genuinely room, otherwise the contact details wrap. */}
            <span className="topbar-item topbar-accred">
              <i className="bi bi-award-fill" />
              Govt. of Uttar Pradesh | Approved by AICTE | Affiliated to BTEUP
            </span>
            <div className="topbar-social d-flex gap-2">
              <a href="#" aria-label="Facebook"><i className="bi bi-facebook" /></a>
              <a href="#" aria-label="Instagram"><i className="bi bi-instagram" /></a>
              <a href="#" aria-label="YouTube"><i className="bi bi-youtube" /></a>
              <a href="#" aria-label="X"><i className="bi bi-twitter-x" /></a>
            </div>
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
              <Image
                src="/images/logo.png"
                alt="Km. Mayawati Government Girls Polytechnic, Badalpur crest"
                width={92}
                height={92}
                priority
              />
            </span>
            <span className="brand-text">
              <span className="brand-line-1">Km. Mayawati Government Girls</span>
              <span className="brand-line-2">Polytechnic, Badalpur</span>
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <HoverDropdown bar={bar} title="About" id="about-dropdown">
                <DropdownLinks bar={bar} items={ABOUT} />
              </HoverDropdown>

              <HoverDropdown bar={bar} title="Departments" id="department-dropdown">
                {DEPARTMENTS.map((dept) => (
                  <NavDropdown.Item
                    as={Link}
                    href={`/department/${dept.slug}`}
                    key={dept.slug}
                    onClick={bar.closeAll}
                  >
                    <i className={`bi ${dept.icon}`} />
                    {dept.name}
                  </NavDropdown.Item>
                ))}
              </HoverDropdown>

              <HoverDropdown bar={bar} title="Academics" id="academic-dropdown">
                <DropdownLinks bar={bar} items={ACADEMIC} />
              </HoverDropdown>

              <HoverDropdown bar={bar} title="Admissions" id="admission-dropdown">
                <DropdownLinks bar={bar} items={ADMISSION} />
              </HoverDropdown>

              <HoverDropdown bar={bar} title="Student Section" id="student-dropdown">
                <DropdownLinks bar={bar} items={STUDENT} />
              </HoverDropdown>

              {/* No dropdown here — the placements section carries its own
                  sidebar with every sub-page. */}
              <Nav.Link
                as={Link}
                href="/placements/tnp-department"
                className={isActive('/placements') ? 'active' : ''}
                onMouseEnter={bar.closeNow}
              >
                Placements
              </Nav.Link>

              <HoverDropdown bar={bar} title="Life@KMGGP" id="life-dropdown">
                <DropdownLinks bar={bar} items={LIFE} />
              </HoverDropdown>
              <Nav.Link
                as={Link}
                href="/gallery"
                className={isActive('/gallery') ? 'active' : ''}
                onMouseEnter={bar.closeNow}
              >
                Gallery
              </Nav.Link>
              <Nav.Link
                as={Link}
                href="/contact"
                className={isActive('/contact') ? 'active' : ''}
                onMouseEnter={bar.closeNow}
              >
                Contact
              </Nav.Link>
            </Nav>

            <Nav
              className="nav-actions gap-2 align-items-xl-center mt-3 mt-xl-0"
              onMouseEnter={bar.closeNow}
            >
              <Button
                as={Link}
                href="/login"
                size="sm"
                className="nav-ghost nav-icon-only"
                title="Admin Login"
                aria-label="Admin Login"
              >
                <i className="bi bi-person-lock" />
                <span className="nav-btn-label">Admin Login</span>
              </Button>
              <Button
                as={Link}
                href="/igrs/student"
                size="sm"
                className="nav-ghost nav-icon-only"
                title="IGRS Grievance Portal"
                aria-label="IGRS Grievance Portal"
              >
                <i className="bi bi-shield-check" />
                <span className="nav-btn-label">IGRS</span>
              </Button>
              <Button as={Link} href="/admission/enquiry" size="sm" className="nav-cta">
                <i className="bi bi-send-fill" />
                <span className="cta-label-full">Admission Enquiry</span>
                <span className="cta-label-short">Enquiry</span>
              </Button>

              {/* No dropdown — the counselling page carries every sub-page in
                  its own sidebar. The year in the label marks it as the live
                  admission cycle rather than a permanent section. */}
              <Button
                as={Link}
                href="/counselling"
                size="sm"
                className={`nav-highlight ${isActive('/counselling') ? 'active' : ''}`}
              >
                <i className="bi bi-clipboard2-check-fill" />
                <span className="cta-label-full">Counselling &amp; Admission 2026</span>
                <span className="cta-label-short">Counselling 2026</span>
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
