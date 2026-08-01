"use client";
import React from 'react';
import { Card, Table } from 'react-bootstrap';

export default function FacultyPage({ params }) {
  return (
    <Card className="border-0 shadow-sm">
      <Card.Body>
        <h2 className="text-primary-blue mb-4">Faculty Members</h2>
        <Table striped bordered hover responsive className="mt-3">
          <thead className="bg-light-blue">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Designation</th>
              <th>Qualification</th>
              <th>Experience</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Dr. Example Name</td>
              <td>Head of Department</td>
              <td>Ph.D, M.Tech</td>
              <td>15 Years</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Mrs. Faculty Two</td>
              <td>Lecturer</td>
              <td>M.Tech</td>
              <td>8 Years</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Ms. Faculty Three</td>
              <td>Lecturer</td>
              <td>B.Tech</td>
              <td>3 Years</td>
            </tr>
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
}
