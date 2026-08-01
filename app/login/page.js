"use client";

import React, { useState } from 'react';
import { Container, Card, Form, Button } from 'react-bootstrap';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(isLogin ? "Login functionality will be connected to backend." : "Registration functionality will be connected to backend.");
  };

  return (
    <div className="py-5 bg-light-blue" style={{ minHeight: 'calc(100vh - 300px)', display: 'flex', alignItems: 'center' }}>
      <Container>
        <Card className="border-0 shadow mx-auto" style={{ maxWidth: '450px' }}>
          <Card.Header className="bg-primary-blue text-white text-center py-3">
            <h4 className="mb-0">{isLogin ? 'Student Login' : 'Student Registration'}</h4>
          </Card.Header>
          <Card.Body className="p-4">
            <Form onSubmit={handleSubmit}>
              {!isLogin && (
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter full name" required />
                </Form.Group>
              )}
              
              <Form.Group className="mb-3">
                <Form.Label>Email / Enrollment No.</Form.Label>
                <Form.Control type="text" placeholder="Enter email or enrollment number" required />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password" required />
              </Form.Group>

              {isLogin && (
                <div className="text-end mb-3">
                  <Link href="#" className="text-decoration-none small text-muted">Forgot Password?</Link>
                </div>
              )}

              <Button variant="primary" type="submit" className="btn-primary-custom w-100 py-2">
                {isLogin ? 'Login' : 'Register'}
              </Button>
            </Form>

            <div className="text-center mt-4 pt-3 border-top">
              <span className="text-muted small">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
              </span>
              <Button 
                variant="link" 
                className="p-0 text-primary-blue text-decoration-none small fw-bold" 
                onClick={() => setIsLogin(!isLogin)}
              >
                {isLogin ? 'Register Here' : 'Login Here'}
              </Button>
            </div>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}
