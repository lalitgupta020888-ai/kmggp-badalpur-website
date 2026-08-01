"use client";
import React from 'react';
import { Card, ListGroup, Badge } from 'react-bootstrap';
import Link from 'next/link';

export default function NoticeBoard() {
  const notices = [
    {
      id: 1,
      title: 'Admission 2026-27 Open',
      date: 'Aug 01, 2026',
      isNew: true,
      link: '/admission/process'
    },
    {
      id: 2,
      title: 'Even Semester Exam Schedule Released',
      date: 'Jul 15, 2026',
      isNew: false,
      link: '/academic/calendar'
    },
    {
      id: 3,
      title: 'Campus Placement Drive by Tech Mahindra',
      date: 'Jul 10, 2026',
      isNew: false,
      link: '/placements/records'
    },
    {
      id: 4,
      title: 'National Level Hackathon Announcement',
      date: 'Jun 25, 2026',
      isNew: false,
      link: '/department/cse/achievements'
    }
  ];

  return (
    <Card className="shadow-sm border-0 h-100">
      <Card.Header className="bg-primary-blue text-white fw-bold">
        📢 Notice Board & Latest Updates
      </Card.Header>
      <ListGroup variant="flush">
        {notices.map((notice) => (
          <ListGroup.Item key={notice.id} className="d-flex justify-content-between align-items-start py-3">
            <div className="ms-2 me-auto">
              <div className="fw-bold">
                <Link href={notice.link} className="text-decoration-none text-dark">
                  {notice.title}
                </Link>
                {notice.isNew && <Badge bg="danger" className="ms-2">New</Badge>}
              </div>
              <small className="text-muted">{notice.date}</small>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
      <Card.Footer className="bg-white text-center">
        <Link href="/academic/calendar" className="text-primary-blue fw-bold text-decoration-none">
          View All Notices &rarr;
        </Link>
      </Card.Footer>
    </Card>
  );
}

