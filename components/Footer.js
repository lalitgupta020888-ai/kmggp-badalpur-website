"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';

const QUICK_LINKS = [
  { href: '/about', label: 'About Us' },
  { href: '/admission/courses', label: 'Courses Offered' },
  { href: '/academic/calendar', label: 'Academic Calendar' },
  { href: '/admission/fee', label: 'Fee Structure' },
  { href: '/contact', label: 'Contact Us' },
];

/* Official portals students and staff need most — all external. */
const IMPORTANT_LINKS = [
  { href: 'https://bteup.ac.in/', label: 'UP BTE' },
  { href: 'http://upted.gov.in/directorate', label: 'UPTED' },
  { href: 'https://www.irdtup.in/', label: 'IRDTUP' },
  { href: 'https://www.aicte.gov.in/', label: 'AICTE' },
  { href: 'https://urise.up.gov.in/', label: 'URISE' },
  { href: 'https://jeecup.admissions.nic.in/', label: 'JEECUP' },
  { href: 'https://scholarship.up.gov.in/', label: 'SCHOLARSHIP' },
];

export default function Footer() {
  return (
    <footer className="footer mt-auto">
      <Container>
        <Row className="gy-5">
          <Col lg={4} md={6}>
            <div className="footer-brand">
              <span className="brand-crest brand-crest--logo">
                <Image
                  src="/images/logo.png"
                  alt="Km. Mayawati Government Girls Polytechnic, Badalpur crest"
                  width={92}
                  height={92}
                />
              </span>
              <span className="brand-text">
                <span className="brand-line-1">Km. Mayawati Government Girls</span>
                <span className="brand-line-2">Polytechnic, Badalpur</span>
              </span>
            </div>
            <p>
              Km. Mayawati Government Girls Polytechnic, Badalpur is committed to providing quality
              technical education to women and empowering them to lead in the engineering profession.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook"><i className="bi bi-facebook" /></a>
              <a href="#" aria-label="Instagram"><i className="bi bi-instagram" /></a>
              <a href="#" aria-label="YouTube"><i className="bi bi-youtube" /></a>
              <a href="#" aria-label="LinkedIn"><i className="bi bi-linkedin" /></a>
            </div>
          </Col>

          <Col lg={2} md={6}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled footer-links">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link href={link.href}>
                    <i className="bi bi-chevron-right" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h5>Important Links</h5>
            <ul className="list-unstyled footer-links">
              {IMPORTANT_LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-chevron-right" />
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h5>Reach Us</h5>
            <div className="footer-contact-item">
              <i className="bi bi-geo-alt-fill" />
              <address className="mb-0">
                Km. Mayawati Government Girls Polytechnic, Badalpur,
                <br />
                Gautam Buddha Nagar,
                <br />
                Uttar Pradesh, India
              </address>
            </div>
            <div className="footer-contact-item">
              <i className="bi bi-telephone-fill" />
              <a href="tel:+910000000000">+91 XXXXX XXXXX</a>
            </div>
            <div className="footer-contact-item">
              <i className="bi bi-envelope-fill" />
              <a href="mailto:info@kmggp.ac.in">info@kmggp.ac.in</a>
            </div>
            <div className="footer-contact-item">
              <i className="bi bi-clock-fill" />
              <span>Mon – Sat, 10:00 AM – 5:00 PM</span>
            </div>
          </Col>
        </Row>

        <div className="footer-bottom d-flex flex-column flex-md-row justify-content-between align-items-center gap-2">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} Km. Mayawati Government Girls Polytechnic, Badalpur.
            All Rights Reserved.
          </p>
          <p className="mb-0 d-flex align-items-center gap-2">
            <i className="bi bi-patch-check-fill text-gold" />
            Approved by AICTE · Affiliated to BTEUP, Government of Uttar Pradesh
          </p>
        </div>

        <p className="footer-credit mb-0 text-center">
          Designed By : Lalit Kumar Gupta & Team, KMGGP, Badalapur, G.B. Nagar
        </p>
      </Container>
    </footer>
  );
}
