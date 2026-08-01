"use client";

import React from 'react';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';
import Link from 'next/link';

export default function Navigation() {
  return (
    <Navbar expand="lg" className="navbar-custom sticky-top">
      <Container>
        <Navbar.Brand as={Link} href="/">
          KMGGP Badalpur
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/">Home</Nav.Link>
            
            <NavDropdown title="Department" id="department-dropdown">
              <NavDropdown title="Electronics Engineering" id="ee-dropdown" drop="end">
                  <NavDropdown.Item as={Link} href="/department/electronics">Home</NavDropdown.Item>
                  <NavDropdown.Item as={Link} href="/department/electronics/faculty">Faculty</NavDropdown.Item>
                  <NavDropdown.Item as={Link} href="/department/electronics/labs">Labs</NavDropdown.Item>
                  <NavDropdown.Item as={Link} href="/department/electronics/achievements">Achievements</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Computer Science & Engineering" id="cse-dropdown" drop="end">
                  <NavDropdown.Item as={Link} href="/department/cse">Home</NavDropdown.Item>
                  <NavDropdown.Item as={Link} href="/department/cse/faculty">Faculty</NavDropdown.Item>
                  <NavDropdown.Item as={Link} href="/department/cse/labs">Labs</NavDropdown.Item>
                  <NavDropdown.Item as={Link} href="/department/cse/achievements">Achievements</NavDropdown.Item>
              </NavDropdown>
              <NavDropdown title="Information Technology" id="it-dropdown" drop="end">
                  <NavDropdown.Item as={Link} href="/department/it">Home</NavDropdown.Item>
                  <NavDropdown.Item as={Link} href="/department/it/faculty">Faculty</NavDropdown.Item>
                  <NavDropdown.Item as={Link} href="/department/it/labs">Labs</NavDropdown.Item>
                  <NavDropdown.Item as={Link} href="/department/it/achievements">Achievements</NavDropdown.Item>
              </NavDropdown>
            </NavDropdown>

            <NavDropdown title="Academic" id="academic-dropdown">
              <NavDropdown.Item as={Link} href="/academic/calendar">Academic Calendar</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/academic/holidays">List of Holidays</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/academic/syllabus">Syllabus</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/academic/verification">Educational Verification</NavDropdown.Item>
            </NavDropdown>

            <NavDropdown title="Admission" id="admission-dropdown">
              <NavDropdown.Item as={Link} href="/admission/courses">Courses Offered</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/admission/process">Admission Process</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/admission/fee">Fee Structure</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/admission/booklet">Information Booklet 26-27</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} href="/scholarship">Scholarship</Nav.Link>

            <NavDropdown title="Placements" id="placements-dropdown">
              <NavDropdown.Item as={Link} href="/placements/tnp-department">T&P Department</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/placements/recruiters">Our Recruiters</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/placements/records">Placement Records</NavDropdown.Item>
              <NavDropdown.Item as={Link} href="/placements/programmes">T&P Programmes</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link as={Link} href="/life">Life@KMGGP</Nav.Link>
            <Nav.Link as={Link} href="/gallery">Gallery</Nav.Link>
            <Nav.Link as={Link} href="/contact">Contact</Nav.Link>
          </Nav>
          
          <Nav className="gap-2">
            <Button as={Link} href="/login" variant="outline-light" size="sm">Login</Button>
            <Button as={Link} href="/igrs" variant="outline-light" size="sm">IGRS Login</Button>
            <Button as={Link} href="/admission/enquiry" variant="light" size="sm" className="text-primary-blue fw-bold">Admission Enquiry</Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
