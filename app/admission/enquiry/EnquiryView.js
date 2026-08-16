"use client";

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';

const ASSURANCES = [
  {
    icon: 'bi-clock-history',
    title: 'Quick Response',
    text: 'Our admission team replies within one working day.',
  },
  {
    icon: 'bi-shield-lock-fill',
    title: 'Your Data is Safe',
    text: 'Details are used solely for admission counselling.',
  },
  {
    icon: 'bi-person-hearts',
    title: 'Personal Guidance',
    text: 'Talk to a counsellor about the right branch for you.',
  },
];

const NEXT_STEPS = [
  {
    title: 'We Receive Your Enquiry',
    text: 'Your details reach the admission cell immediately after submission.',
  },
  {
    title: 'A Counsellor Calls You',
    text: 'Expect a call or email within one working day on the number you provide.',
  },
  {
    title: 'Your Questions Answered',
    text: 'Eligibility, JEECUP counselling, fees, hostel and scholarships — all clarified.',
  },
  {
    title: 'Guidance Till Admission',
    text: 'We stay in touch through choice filling, seat allotment and reporting.',
  },
];

const QUICK_LINKS = [
  {
    href: '/admission/process',
    label: 'Admission Process',
    icon: 'bi-signpost-split',
    text: 'Eligibility, the JEECUP counselling steps and the documents to carry.',
  },
  {
    href: '/admission/courses',
    label: 'Courses Offered',
    icon: 'bi-collection',
    text: 'All four programmes with duration and sanctioned intake.',
  },
  {
    href: '/admission/fee',
    label: 'Fee Structure',
    icon: 'bi-cash-coin',
    text: 'Government-regulated fees, concessions and modes of payment.',
  },
  {
    href: '/scholarship',
    label: 'Scholarship Schemes',
    icon: 'bi-cash-stack',
    text: 'State and central schemes that can cover your tuition fees.',
  },
];

export default function EnquiryView({ officeHours }) {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <PageHeader
        icon="bi-send-fill"
        eyebrow="Admissions Open 2026-27"
        title="Admission Enquiry"
        subtitle="Tell us what you would like to know and our admission team will get in touch with you."
        crumbs={[{ label: 'Admissions' }, { label: 'Enquiry' }]}
      />

      {/* Assurance strip — sits directly under the banner so the page
          opens with three short promises rather than a bare form. */}
      <section style={{ background: 'var(--paper)', padding: '38px 0' }}>
        <Container>
          <Row className="g-3">
            {ASSURANCES.map((item) => (
              <Col md={4} key={item.title}>
                <div className="feature-row h-100 align-items-center">
                  <span className="icon-tile icon-tile-sm">
                    <i className={`bi ${item.icon}`} />
                  </span>
                  <div>
                    <h5>{item.title}</h5>
                    <p>{item.text}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="section" style={{ background: 'var(--white)', paddingTop: '56px' }}>
        <Container>
          <Row className="g-4">
            {/* ---------------- Form ---------------- */}
            <Col lg={7}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-pencil-square" />
                  Enquiry Form
                </div>
                <div className="panel-body">
                  {submitted ? (
                    <div className="text-center py-4">
                      <span
                        className="icon-tile mx-auto mb-4"
                        style={{ width: 78, height: 78, fontSize: '2rem' }}
                      >
                        <i className="bi bi-check-lg" />
                      </span>
                      <h4 className="fw-bold mb-2">Enquiry Submitted</h4>
                      <div className="gold-flourish">
                        <i className="bi bi-diamond-fill" />
                      </div>
                      <p className="mt-3 mb-4">
                        Thank you for reaching out. Our admission team will contact you within one
                        working day on the details you provided.
                      </p>
                      <div className="d-flex flex-wrap gap-3 justify-content-center">
                        <Link href="/admission/process" className="btn-gold">
                          <i className="bi bi-signpost-split" />
                          Read the Admission Process
                        </Link>
                        <Button
                          type="button"
                          className="btn-outline-navy"
                          onClick={() => setSubmitted(false)}
                        >
                          <i className="bi bi-arrow-counterclockwise" />
                          Submit Another Enquiry
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Form onSubmit={handleSubmit} className="premium-form">
                      <p className="text-muted small mb-4">
                        Fields marked <span className="text-gold fw-bold">*</span> are required. We
                        never share your details with third parties.
                      </p>

                      <Row>
                        <Col sm={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              Full Name <span className="text-gold">*</span>
                            </Form.Label>
                            <div className="input-icon">
                              <i className="bi bi-person-fill" />
                              <Form.Control type="text" placeholder="Enter your full name" required />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              Mobile Number <span className="text-gold">*</span>
                            </Form.Label>
                            <div className="input-icon">
                              <i className="bi bi-telephone-fill" />
                              <Form.Control
                                type="tel"
                                inputMode="numeric"
                                pattern="[0-9]{10}"
                                maxLength={10}
                                placeholder="10-digit mobile number"
                                required
                              />
                            </div>
                            <Form.Text className="text-muted">
                              We will call you on this number.
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>
                          Email Address <span className="text-gold">*</span>
                        </Form.Label>
                        <div className="input-icon">
                          <i className="bi bi-envelope-fill" />
                          <Form.Control type="email" placeholder="you@example.com" required />
                        </div>
                      </Form.Group>

                      <Row>
                        <Col sm={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              Interested Course <span className="text-gold">*</span>
                            </Form.Label>
                            <div className="input-icon">
                              <i className="bi bi-collection-fill" />
                              <Form.Select required defaultValue="">
                                <option value="" disabled>
                                  Select a course
                                </option>
                                <option value="ee">Electronics Engineering</option>
                                <option value="cse">Computer Science &amp; Engineering</option>
                                <option value="it">Information Technology</option>
                                <option value="undecided">Not decided yet</option>
                              </Form.Select>
                            </div>
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>
                              Class 10th Status <span className="text-gold">*</span>
                            </Form.Label>
                            <div className="input-icon">
                              <i className="bi bi-mortarboard-fill" />
                              <Form.Select required defaultValue="">
                                <option value="" disabled>
                                  Select your status
                                </option>
                                <option value="passed">Passed</option>
                                <option value="appearing">Result awaited</option>
                              </Form.Select>
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>City / District</Form.Label>
                        <div className="input-icon">
                          <i className="bi bi-geo-alt-fill" />
                          <Form.Control type="text" placeholder="e.g. Gautam Buddha Nagar" />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Your Query</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={4}
                          placeholder="Ask us about eligibility, fees, hostel facilities or anything else..."
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Check
                          type="checkbox"
                          id="enquiry-consent"
                          required
                          label="I agree to be contacted by the institute regarding my admission enquiry."
                        />
                      </Form.Group>

                      <Button type="submit" className="btn-gold w-100 justify-content-center">
                        <i className="bi bi-send-fill" />
                        Submit Enquiry
                      </Button>
                    </Form>
                  )}
                </div>
              </div>
            </Col>

            {/* ---------------- Sidebar ---------------- */}
            <Col lg={5}>
              <div className="panel">
                <div className="panel-header">
                  <i className="bi bi-telephone-inbound-fill" />
                  Speak to Us Directly
                </div>
                <div className="panel-body">
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-telephone-fill" />
                    </span>
                    <div>
                      <div className="label">Admission Helpline</div>
                      <p className="value">+91 XXXXX XXXXX</p>
                    </div>
                  </div>
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-envelope-fill" />
                    </span>
                    <div>
                      <div className="label">Email</div>
                      <p className="value">admission@kmggp.ac.in</p>
                    </div>
                  </div>
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-clock-fill" />
                    </span>
                    <div>
                      <div className="label">Office Hours</div>
                      <p className="value">{officeHours}</p>
                    </div>
                  </div>
                  <div className="contact-line">
                    <span className="icon-tile icon-tile-sm">
                      <i className="bi bi-geo-alt-fill" />
                    </span>
                    <div>
                      <div className="label">Campus</div>
                      <p className="value">Badalpur, Gautam Buddha Nagar, Uttar Pradesh</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="panel mt-4">
                <div className="panel-header">
                  <i className="bi bi-signpost-2-fill" />
                  What Happens Next
                </div>
                <div className="panel-body">
                  <ul className="timeline mb-0">
                    {NEXT_STEPS.map((step) => (
                      <li key={step.title}>
                        <h6>{step.title}</h6>
                        <p>{step.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

          </Col>
          </Row>
        </Container>
      </section>

      {/* Full-width band — keeps the sidebar short so the form column
          does not sit beside a tall stack of empty space. */}
      <section className="section" style={{ background: 'var(--paper)', paddingTop: '56px' }}>
        <Container>
          <SectionHead
            eyebrow="Before You Ask"
            icon="bi-lightbulb-fill"
            title="Many Answers Are Already Here"
            subtitle="Check these pages first — they cover the questions we are asked most often."
          />
          <Row className="g-4">
            {QUICK_LINKS.map((link) => (
              <Col lg={3} md={6} key={link.href}>
                <Link href={link.href} className="premium-card h-100 p-4 d-block text-decoration-none">
                  <span className="icon-tile mb-3">
                    <i className={`bi ${link.icon}`} />
                  </span>
                  <h5 className="fw-bold mb-2">{link.label}</h5>
                  <p className="small mb-0">{link.text}</p>
                  <div className="gold-rule-thin my-3" />
                  <span className="fw-bold text-primary-blue small">
                    Read More <i className="bi bi-arrow-right" />
                  </span>
                </Link>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="cta-band">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={8}>
              <span className="eyebrow eyebrow-light">
                <i className="bi bi-file-earmark-pdf-fill" />
                Information Booklet 2026-27
              </span>
              <h3>Prefer to Read Everything in One Place?</h3>
              <div className="hero-gold-line" />
              <p>
                The official booklet covers courses, eligibility, fees, hostel facilities and campus
                life in full detail.
              </p>
            </Col>
            <Col lg={4} className="d-flex flex-column gap-3 align-items-lg-end">
              <Link href="/admission/booklet" className="btn-gold">
                <i className="bi bi-download" />
                Get the Booklet
              </Link>
              <Link href="/contact" className="hero-btn-ghost">
                <i className="bi bi-geo-alt-fill" />
                Plan a Campus Visit
              </Link>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
}
