"use client";
import React from 'react';
import { Container, Card, Table } from 'react-bootstrap';

export default function CoursesOffered() {
  return (
    <div className="py-5 bg-white">
      <Container>
        <Card className="border-0 shadow-sm">
          <Card.Header className="bg-primary-blue text-white fw-bold">
            Courses Offered
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead className="bg-light-blue">
                <tr>
                  <th>Course Name</th>
                  <th>Duration</th>
                  <th>Intake</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Diploma in Electronics Engineering</td>
                  <td>3 Years</td>
                  <td>60</td>
                </tr>
                <tr>
                  <td>Diploma in Computer Science & Engineering</td>
                  <td>3 Years</td>
                  <td>60</td>
                </tr>
                <tr>
                  <td>Diploma in Information Technology</td>
                  <td>3 Years</td>
                  <td>60</td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
}

