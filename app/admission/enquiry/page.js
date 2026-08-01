"use client";

import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert } from 'react-bootstrap';

export default function AdmissionEnquiry() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="py-5 bg-white">
      <Container>
        <Card className="border-0 shadow-sm mx-auto" style={{ maxWidth: '600px' }}>
          <Card.Header className="bg-primary-blue text-white fw-bold">
            Admission Enquiry Form
          </Card.Header>
          <Card.Body>
            {submitted ? (
              <Alert variant="success">
                Thank you for your enquiry! Our admission team will contact you shortly.
              </Alert>
            ) : (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter your full name" required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control type="email" placeholder="Enter your email" required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control type="tel" placeholder="Enter your mobile number" required />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Interested Course</Form.Label>
                  <Form.Select required>
                    <option value="">Select a course</option>
                    <option value="ee">Electronics Engineering</option>
                    <option value="cse">Computer Science & Engineering</option>
                    <option value="it">Information Technology</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Your Query</Form.Label>
                  <Form.Control as="textarea" rows={3} placeholder="Write your question here..." />
                </Form.Group>

                <Button variant="primary" type="submit" className="btn-primary-custom w-100">
                  Submit Enquiry
                </Button>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
