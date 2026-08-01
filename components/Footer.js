"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer mt-auto">
      <Container>
        <Row className="gy-4">
          <Col lg={4} md={6}>
            <h5 className="text-white mb-3">Km. Mayawati Government Girls Polytechnic</h5>
            <p className="mb-4">
              Providing quality technical education to women and empowering them for a better future.
              Located in Badalpur, Gautam Buddha Nagar.
            </p>
          </Col>
          <Col lg={2} md={6}>
            <h5 className="text-white mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/about">About Us</Link></li>
              <li className="mb-2"><Link href="/admission/courses">Courses</Link></li>
              <li className="mb-2"><Link href="/academic/calendar">Academic Calendar</Link></li>
              <li className="mb-2"><Link href="/contact">Contact</Link></li>
            </ul>
          </Col>
          <Col lg={3} md={6}>
            <h5 className="text-white mb-3">Important Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link href="/igrs">IGRS Login</Link></li>
              <li className="mb-2"><Link href="/scholarship">Scholarships</Link></li>
              <li className="mb-2"><Link href="/placements/records">Placements</Link></li>
              <li className="mb-2"><Link href="/gallery">Gallery</Link></li>
            </ul>
          </Col>
          <Col lg={3} md={6}>
            <h5 className="text-white mb-3">Contact Us</h5>
            <address className="text-light-text">
              Km. Mayawati Government Girls Polytechnic<br />
              Badalpur, Gautam Buddha Nagar<br />
              Uttar Pradesh, India<br />
              <br />
              <strong>Phone:</strong> +91 XXXXXXXXXX<br />
              <strong>Email:</strong> info@kmggp.ac.in
            </address>
          </Col>
        </Row>
        <div className="footer-bottom">
          <p className="mb-0">&copy; {new Date().getFullYear()} Km. Mayawati Government Girls Polytechnic, Badalpur. All Rights Reserved.</p>
        </div>
      </Container>
    </footer>
  );
}
