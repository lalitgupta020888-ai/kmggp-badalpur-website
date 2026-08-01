"use client";

import React from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';

export default function IGRSLoginPage() {
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("IGRS Portal login processing...");
  };

  return (
    <div className="py-5 bg-light-blue" style={{ minHeight: 'calc(100vh - 300px)', display: 'flex', alignItems: 'center' }}>
      <Container>
        <Card className="border-0 shadow mx-auto" style={{ maxWidth: '450px' }}>
          <Card.Header className="bg-dark text-white text-center py-3">
            <h4 className="mb-0">IGRS Grievance Portal Login</h4>
          </Card.Header>
          <Card.Body className="p-4">
            <div className="text-center mb-4">
              <p className="text-muted small">Integrated Grievance Redressal System (IGRS) portal for staff and students.</p>
            </div>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>IGRS ID / Username</Form.Label>
                <Form.Control type="text" placeholder="Enter IGRS ID" required />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" required />
              </Form.Group>

              <Button variant="dark" type="submit" className="w-100 py-2">
                Access Portal
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
