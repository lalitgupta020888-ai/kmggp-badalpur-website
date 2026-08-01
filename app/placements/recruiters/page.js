"use client";
import React from 'react';
import { Card } from 'react-bootstrap';

export default function Recruiters() {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h2 className="text-primary-blue mb-4">Our Recruiters</h2>
        <p>We are proud to have strong ties with leading multinational companies who consistently recruit our talented students.</p>
        <ul>
          <li>Tech Mahindra</li>
          <li>Wipro Technologies</li>
          <li>Infosys</li>
          <li>HCL Technologies</li>
          <li>TCS</li>
          <li>L&T Technology Services</li>
        </ul>
      </Card.Body>
    </Card>
  );
}

