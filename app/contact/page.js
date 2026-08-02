"use client";

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';

const CONTACT_LINES = [
  {
    icon: 'bi-geo-alt-fill',
    label: 'Campus Address',
    value: (
      <>
        Km. Mayawati Government Girls Polytechnic,
        <br />
        Badalpur, Gautam Buddha Nagar,
        <br />
        Uttar Pradesh, India
      </>
    ),
  },
  { icon: 'bi-telephone-fill', label: 'Phone', value: '+91 XXXXX XXXXX' },
  { icon: 'bi-envelope-fill', label: 'Email', value: 'info@kmggp.ac.in' },
  { icon: 'bi-clock-fill', label: 'Office Hours', value: 'Monday – Saturday, 9:00 AM – 5:00 PM' },
];

const DESKS = [
  { icon: 'bi-mortarboard-fill', title: 'Admission Cell', value: 'admission@kmggp.ac.in' },
  { icon: 'bi-briefcase-fill', title: 'Training & Placement', value: 'tnp@kmggp.ac.in' },
  { icon: 'bi-patch-check-fill', title: 'Verification Desk', value: 'verification@kmggp.ac.in' },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <>
      <PageHeader
        icon="bi-headset"
        eyebrow="We Are Here to Help"
        title="Contact Us"
        subtitle="Reach the right desk directly, or send us a message and our team will respond shortly."
        crumbs={[{ label: 'Contact' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="g-4">
            <Col lg={5}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-geo-alt-fill" />
                  Contact Information
                </div>
                <div className="panel-body">
                  {CONTACT_LINES.map((line) => (
                    <div className="contact-line" key={line.label}>
                      <span className="icon-tile icon-tile-sm">
                        <i className={`bi ${line.icon}`} />
                      </span>
                      <div>
                        <div className="label">{line.label}</div>
                        <p className="value">{line.value}</p>
                      </div>
                    </div>
                  ))}

                  <div className="gold-rule-thin my-4" />

                  <h6 className="fw-bold mb-3">
                    <i className="bi bi-signpost-2-fill text-gold me-2" />
                    Departmental Desks
                  </h6>
                  {DESKS.map((desk) => (
                    <div className="contact-line" key={desk.title}>
                      <span className="icon-tile icon-tile-sm">
                        <i className={`bi ${desk.icon}`} />
                      </span>
                      <div>
                        <div className="label">{desk.title}</div>
                        <p className="value">{desk.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>

            <Col lg={7}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-chat-dots-fill" />
                  Send Us a Message
                </div>
                <div className="panel-body">
                  {submitted ? (
                    <Alert variant="success" className="d-flex align-items-center gap-3 border-0">
                      <i className="bi bi-check-circle-fill fs-4" />
                      <span>Your message has been sent successfully. We will get back to you soon.</span>
                    </Alert>
                  ) : (
                    <Form onSubmit={handleSubmit} className="premium-form">
                      <Row>
                        <Col sm={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Your Name</Form.Label>
                            <div className="input-icon">
                              <i className="bi bi-person-fill" />
                              <Form.Control type="text" placeholder="Enter your full name" required />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Email Address</Form.Label>
                            <div className="input-icon">
                              <i className="bi bi-envelope-fill" />
                              <Form.Control type="email" placeholder="you@example.com" required />
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Subject</Form.Label>
                        <div className="input-icon">
                          <i className="bi bi-tag-fill" />
                          <Form.Control type="text" placeholder="What is this regarding?" required />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Your Message</Form.Label>
                        <Form.Control as="textarea" rows={5} placeholder="Write your message here..." required />
                      </Form.Group>

                      <Button type="submit" className="btn-gold w-100 justify-content-center">
                        <i className="bi bi-send-fill" />
                        Send Message
                      </Button>
                    </Form>
                  )}
                </div>
              </div>
            </Col>
          </Row>

          <div className="panel mt-4">
            <div className="panel-header">
              <i className="bi bi-pin-map-fill" />
              Find Us on the Map
            </div>
            <div style={{ height: '420px' }}>
              <iframe
                title="Institute location on Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112108.5714088998!2d77.41164917539003!3d28.588820473550383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce59f143715c1%3A0xc39f9fbceba7a4b!2sBadalpur%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1707812903820!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block' }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
