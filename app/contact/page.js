"use client";

import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-5 bg-white">
      <Container>
        <div className="text-center mb-5">
          <h2 className="text-primary-blue fw-bold">Contact Us</h2>
          <p className="text-muted">Get in touch with Km. Mayawati Government Girls Polytechnic</p>
        </div>
        
        <Row className="g-4">
          <Col md={5}>
            <Card className="border-0 shadow-sm h-100 bg-light-blue">
              <Card.Body className="p-4">
                <h4 className="text-primary-blue mb-4">Contact Information</h4>
                <div className="mb-3">
                  <strong>Address:</strong>
                  <p className="text-muted">Badalpur, Gautam Buddha Nagar,<br/>Uttar Pradesh, India</p>
                </div>
                <div className="mb-3">
                  <strong>Phone:</strong>
                  <p className="text-muted">+91 XXXXXXXXXX</p>
                </div>
                <div className="mb-3">
                  <strong>Email:</strong>
                  <p className="text-muted">info@kmggp.ac.in</p>
                </div>
              </Card.Body>
            </Card>
          </Col>
          
          <Col md={7}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body className="p-4">
                <h4 className="text-primary-blue mb-4">Send us a Message</h4>
                {submitted ? (
                  <Alert variant="success">Your message has been sent successfully!</Alert>
                ) : (
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col sm={6}>
                        <Form.Group className="mb-3">
                          <Form.Control type="text" placeholder="Your Name" required />
                        </Form.Group>
                      </Col>
                      <Col sm={6}>
                        <Form.Group className="mb-3">
                          <Form.Control type="email" placeholder="Your Email" required />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Control type="text" placeholder="Subject" required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Control as="textarea" rows={4} placeholder="Your Message" required />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="btn-primary-custom w-100">
                      Send Message
                    </Button>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <div className="mt-5">
          <Card className="border-0 shadow-sm overflow-hidden" style={{ height: '400px' }}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d112108.5714088998!2d77.41164917539003!3d28.588820473550383!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce59f143715c1%3A0xc39f9fbceba7a4b!2sBadalpur%2C%20Uttar%20Pradesh!5e0!3m2!1sen!2sin!4v1707812903820!5m2!1sen!2sin" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </Card>
        </div>
      </Container>
    </div>
  );
}
