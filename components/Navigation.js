"use client";

import React from 'react';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const DEPARTMENTS = [
  { slug: 'electronics', name: 'Electronics Engineering', icon: 'bi-cpu-fill' },
  { slug: 'cse', name: 'Computer Science & Engineering', icon: 'bi-pc-display' },
  { slug: 'it', name: 'Information Technology', icon: 'bi-hdd-network-fill' },
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
];

function DropdownLinks({ items }) {
  return items.map((item) => (
    <NavDropdown.Item as={Link} href={item.href} key={item.href}>
      <i className={`bi ${item.icon}`} />
      {item.label}
    </NavDropdown.Item>
  ));
}

export default function Navigation() {
  const pathname = usePathname();
  const isActive = (href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

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
          </div>
          <div className="d-flex align-items-center gap-3">
            <span className="topbar-item d-none d-xl-inline">
              <i className="bi bi-award-fill" />
              Govt. of Uttar Pradesh | Affiliated to BTEUP
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

      <Navbar expand="xl" className="navbar-custom" collapseOnSelect>
        <Container fluid className="nav-shell">
          <Navbar.Brand as={Link} href="/">
            <span className="brand-crest">
              <i className="bi bi-mortarboard-fill" />
            </span>
            <span className="brand-text">
              <span className="brand-line-1">Km. Mayawati Government Girls</span>
              <span className="brand-line-2">Polytechnic, Badalpur</span>
            </span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="me-auto">
              <NavDropdown title="About" id="about-dropdown" renderMenuOnMount>
                <DropdownLinks items={ABOUT} />
              </NavDropdown>

              <NavDropdown title="Departments" id="department-dropdown" renderMenuOnMount>
                {DEPARTMENTS.map((dept) => (
                  <NavDropdown.Item as={Link} href={`/department/${dept.slug}`} key={dept.slug}>
                    <i className={`bi ${dept.icon}`} />
                    {dept.name}
                  </NavDropdown.Item>
                ))}
              </NavDropdown>

              <NavDropdown title="Academics" id="academic-dropdown" renderMenuOnMount>
                <DropdownLinks items={ACADEMIC} />
              </NavDropdown>

              <NavDropdown title="Admissions" id="admission-dropdown" renderMenuOnMount>
                <DropdownLinks items={ADMISSION} />
              </NavDropdown>

              <NavDropdown title="Student Section" id="student-dropdown" renderMenuOnMount>
                <DropdownLinks items={STUDENT} />
              </NavDropdown>

              {/* No dropdown here — the placements section carries its own
                  sidebar with every sub-page. */}
              <Nav.Link
                as={Link}
                href="/placements/tnp-department"
                className={isActive('/placements') ? 'active' : ''}
              >
                Placements
              </Nav.Link>

              <NavDropdown title="Life@KMGGP" id="life-dropdown" renderMenuOnMount>
                <DropdownLinks items={LIFE} />
              </NavDropdown>
              <Nav.Link as={Link} href="/gallery" className={isActive('/gallery') ? 'active' : ''}>
                Gallery
              </Nav.Link>
              <Nav.Link as={Link} href="/contact" className={isActive('/contact') ? 'active' : ''}>
                Contact
              </Nav.Link>
            </Nav>

            <Nav className="nav-actions gap-2 align-items-xl-center mt-3 mt-xl-0">
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
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
}
