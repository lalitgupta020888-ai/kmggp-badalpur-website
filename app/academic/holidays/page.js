"use client";
import React from 'react';
import { Container, Card, Table } from 'react-bootstrap';

export default function ListOfHolidays() {
  return (
    <div className="py-5 bg-white">
      <Container>
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-primary-blue text-white fw-bold">
            List of Holidays
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead className="bg-light-blue">
                <tr>
                  <th>Date</th>
                  <th>Occasion</th>
                  <th>Day</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>August 15, 2026</td>
                  <td>Independence Day</td>
                  <td>Saturday</td>
                </tr>
                <tr>
                  <td>October 2, 2026</td>
                  <td>Gandhi Jayanti</td>
                  <td>Friday</td>
                </tr>
                <tr>
                  <td>October 24, 2026</td>
                  <td>Diwali</td>
                  <td>Saturday</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

