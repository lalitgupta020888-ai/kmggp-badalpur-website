"use client";

import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import PageHeader from '@/components/PageHeader';
import { sendContactMessage } from './actions';

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

/**
 * The contact page.
 *
 * The phone number, email and office hours are built here rather than in a
 * module constant, because they come from the admin panel and have to be able
 * to change without a deployment.
 */
export default function ContactView({ officeHours, topbar = {} }) {
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
    { icon: 'bi-telephone-fill', label: 'Phone', value: topbar.phone },
    { icon: 'bi-envelope-fill', label: 'Email', value: topbar.email },
    { icon: 'bi-clock-fill', label: 'Office Hours', value: officeHours },
  ];

  const [submitted, setSubmitted] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSending(true);
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    const result = await sendContactMessage(data).catch(() => ({
      error: 'Could not reach the server. Please try again.',
    }));
    setSending(false);
    if (result.error) return setError(result.error);
    setSubmitted(result.ref || 'sent');
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
                  <i className="bi bi-geo-alt-fill" aria-hidden="true" />
                  Contact Information
                </div>
                <div className="panel-body">
                  {CONTACT_LINES.map((line) => (
                    <div className="contact-line" key={line.label}>
                      <span className="icon-tile icon-tile-sm">
                        <i className={`bi ${line.icon}`} aria-hidden="true" />
                      </span>
                      <div>
                        <div className="label">{line.label}</div>
                        <p className="value">{line.value}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Col>

            <Col lg={7}>
              <div className="panel h-100">
                <div className="panel-header">
                  <i className="bi bi-chat-dots-fill" aria-hidden="true" />
                  Send Us a Message
                </div>
                <div className="panel-body">
                  {submitted ? (
                    <div className="text-center py-4" role="status">
                      <span className="igrs-receipt-seal" aria-hidden="true">
                        <i className="bi bi-envelope-check-fill" />
                      </span>
                      <h3 className="h4 fw-bold mb-2">Message Sent</h3>
                      <div className="gold-flourish">
                        <i className="bi bi-diamond-fill" aria-hidden="true" />
                      </div>
                      <p className="mt-3">
                        Thank you for writing to us. Your message has reached the institute office
                        and we will reply to your email soon.
                      </p>
                      {submitted !== 'sent' && (
                        <div className="ref-badge">
                          <span className="ref-label">Message Reference</span>
                          <span className="ref-value">{submitted}</span>
                        </div>
                      )}
                      <div className="mt-4">
                        <Button type="button" className="btn-outline-navy" onClick={() => setSubmitted('')}>
                          <i className="bi bi-arrow-counterclockwise" aria-hidden="true" />
                          Send Another Message
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Form onSubmit={handleSubmit} className="premium-form">
                      {/* Hidden from people; bots fill it in and are quietly dropped. */}
                      <input
                        type="text"
                        name="website"
                        tabIndex={-1}
                        autoComplete="off"
                        aria-hidden="true"
                        style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, opacity: 0 }}
                      />
                      <Row>
                        <Col sm={6}>
                          <Form.Group className="mb-3" controlId="contact-your-name">
                            <Form.Label>Your Name</Form.Label>
                            <div className="input-icon">
                              <i className="bi bi-person-fill" aria-hidden="true" />
                              <Form.Control name="name" type="text" placeholder="Enter your full name" maxLength={120} required />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col sm={6}>
                          <Form.Group className="mb-3" controlId="contact-email-address">
                            <Form.Label>Email Address</Form.Label>
                            <div className="input-icon">
                              <i className="bi bi-envelope-fill" aria-hidden="true" />
                              <Form.Control name="email" type="email" placeholder="you@example.com" maxLength={200} required />
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3" controlId="contact-mobile">
                        <Form.Label>
                          Mobile Number <span className="text-muted small">(optional)</span>
                        </Form.Label>
                        <div className="input-icon">
                          <i className="bi bi-telephone-fill" aria-hidden="true" />
                          <Form.Control
                            name="mobile"
                            type="tel"
                            inputMode="numeric"
                            pattern="[6-9][0-9]{9}"
                            maxLength={10}
                            title="A 10-digit Indian mobile number"
                            placeholder="So we can call you back"
                          />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-3" controlId="contact-subject">
                        <Form.Label>Subject</Form.Label>
                        <div className="input-icon">
                          <i className="bi bi-tag-fill" aria-hidden="true" />
                          <Form.Control name="subject" type="text" placeholder="What is this regarding?" maxLength={200} required />
                        </div>
                      </Form.Group>

                      <Form.Group className="mb-4" controlId="contact-your-message">
                        <Form.Label>Your Message</Form.Label>
                        <Form.Control name="message" as="textarea" rows={5} placeholder="Write your message here..." maxLength={5000} required />
                      </Form.Group>

                      {error && (
                        <Alert variant="danger" role="alert" className="border-0 small">
                          {error}
                        </Alert>
                      )}

                      <Button type="submit" className="btn-gold w-100 justify-content-center" disabled={sending}>
                        <i className="bi bi-send-fill" aria-hidden="true" />
                        {sending ? 'Sending…' : 'Send Message'}
                      </Button>
                    </Form>
                  )}
                </div>
              </div>
            </Col>
          </Row>

          <div className="panel mt-4">
            <div className="panel-header">
              <i className="bi bi-pin-map-fill" aria-hidden="true" />
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
                    <i className="bi bi-signpost-split-fill" aria-hidden="true" />
                    Get Directions
                  </a>
                  <a className="btn-outline-navy" href={MAP_VIEW} target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-box-arrow-up-right" aria-hidden="true" />
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
