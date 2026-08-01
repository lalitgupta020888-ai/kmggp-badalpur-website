"use client";
import React from 'react';
import { Card, Table } from 'react-bootstrap';

export default function PlacementRecords() {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h2 className="text-primary-blue mb-4">Placement Records</h2>
        <p>Our students have consistently performed well in campus interviews. Here are the highlights from the recent batch.</p>
        <Table striped bordered hover responsive>
          <thead className="bg-light-blue">
            <tr>
              <th>Year</th>
              <th>Total Eligible</th>
              <th>Placed</th>
              <th>Top Recruiter</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>2025-26</td>
              <td>150</td>
              <td>132</td>
              <td>Tech Mahindra</td>
            </tr>
            <tr>
              <td>2024-25</td>
              <td>140</td>
              <td>125</td>
              <td>Wipro</td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}

