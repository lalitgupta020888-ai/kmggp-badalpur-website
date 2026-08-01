"use client";
import React from 'react';
import { Container, Card } from 'react-bootstrap';

export default function AboutPage() {
  return (
    <div className="py-5 bg-white">
      <Container>
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-primary-blue text-white fw-bold">
            About Km. Mayawati Government Girls Polytechnic
          </Card.Header>
          <Card.Body>
            <p>Km. Mayawati Government Girls Polytechnic, Badalpur, Gautam Buddha Nagar is a premier technical institution established by the Government of Uttar Pradesh to promote technical education among women.</p>
            <p>Our goal is to foster an environment of academic excellence, innovation, and holistic development. The institute offers diploma courses in various engineering disciplines, supported by state-of-the-art infrastructure and highly experienced faculty.</p>
            <p>Our vision is to empower young women with technical skills, leadership qualities, and ethical values, enabling them to excel in the competitive global landscape.</p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

