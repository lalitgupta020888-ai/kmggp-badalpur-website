"use client";
import React from 'react';
import { Container, Card } from 'react-bootstrap';

export default function LifeAtKMGGP() {
  return (
    <div className="py-5 bg-white">
      <Container>
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-primary-blue text-white fw-bold">
            Life @ KMGGP
          </Card.Header>
          <Card.Body>
            <p className="lead">Life at Km. Mayawati Government Girls Polytechnic is a vibrant blend of academics, extracurricular activities, and personal growth.</p>
            <h4 className="mt-4 text-primary-blue">Clubs and Societies</h4>
            <p>Students can join various clubs such as the Tech Club, Cultural Society, and Sports Club to pursue their passions beyond academics.</p>
            <h4 className="mt-4 text-primary-blue">Events & Festivals</h4>
            <p>We celebrate annual fests, technical symposiums, and national holidays with great enthusiasm, providing a platform for students to showcase their talents.</p>
            <h4 className="mt-4 text-primary-blue">Hostel Life</h4>
            <p>The on-campus hostel provides a safe, secure, and conducive environment for learning, with modern amenities and a supportive community.</p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

