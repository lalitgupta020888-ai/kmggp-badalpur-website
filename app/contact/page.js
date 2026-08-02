"use client";

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';

const LOCATION = {
  name: 'Km. Mayawati Govt. Girls Polytechnic',
  lines: ['HGV9+964, Sadopur, Badalpur', 'Gautam Buddha Nagar', 'Uttar Pradesh 203207, India'],
  plusCode: 'HGV9+964 Badalpur, Uttar Pradesh',
  lat: 28.593145,
  lng: 77.51895,
};

const MAP_POINT = `${LOCATION.lat},${LOCATION.lng}`;
const MAP_EMBED = `https://www.google.com/maps?q=${MAP_POINT}&z=17&hl=en&output=embed`;
const MAP_VIEW = `https://www.google.com/maps/search/?api=1&query=${MAP_POINT}`;
const MAP_DIRECTIONS = `https://www.google.com/maps/dir/?api=1&destination=${MAP_POINT}`;

const CONTACT_LINES = [
  {
    icon: 'bi-geo-alt-fill',
    label: 'Campus Address',
    value: (
      <>
        {LOCATION.name},
        <br />
        {LOCATION.lines[0]},
        <br />
        {LOCATION.lines[1]}, {LOCATION.lines[2]}
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
            <div className="map-frame">
              <iframe
                title="Km. Mayawati Government Girls Polytechnic, Badalpur on Google Maps"
                src={MAP_EMBED}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />

              <div className="map-card">
                <span className="map-card-eyebrow">Campus Location</span>
                <h3 className="map-card-title">{LOCATION.name}</h3>
                <address className="map-card-address">
                  {LOCATION.lines.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </address>

                <dl className="map-card-meta">
                  <div>
                    <dt>Plus Code</dt>
                    <dd>{LOCATION.plusCode}</dd>
                  </div>
                  <div>
                    <dt>Coordinates</dt>
                    <dd>
                      {LOCATION.lat}° N, {LOCATION.lng}° E
                    </dd>
                  </div>
                </dl>

                <div className="map-card-actions">
                  <a className="btn-gold" href={MAP_DIRECTIONS} target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-signpost-split-fill" />
                    Get Directions
                  </a>
                  <a className="btn-outline-navy" href={MAP_VIEW} target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-box-arrow-up-right" />
                    Open in Maps
                  </a>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
