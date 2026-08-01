"use client";
import HeroSlider from '@/components/HeroSlider';
import NoticeBoard from '@/components/NoticeBoard';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Link from 'next/link';

export default function Home() {
  return (
    <>
      <HeroSlider />
      
      {/* Introduction Section */}
      <section className="py-5 bg-white">
        <Container>
          <Row className="align-items-center">
            <Col lg={8} className="mb-4 mb-lg-0">
              <h2 className="text-primary-blue fw-bold mb-4">Welcome to Km. Mayawati Government Girls Polytechnic</h2>
              <p className="lead">
                Established with a vision to empower women through technical education, Km. Mayawati Government Girls Polytechnic, Badalpur is a premier institute offering diploma courses in various engineering disciplines.
              </p>
              <p>
                Our campus is equipped with state-of-the-art infrastructure, modern laboratories, and a highly qualified faculty dedicated to shaping the future of young women. We focus on holistic development, academic excellence, and providing 100% placement assistance.
              </p>
              <Link href="/about" className="btn btn-primary-custom mt-3 px-4 py-2">
                Read More About Us
              </Link>
            </Col>
            <Col lg={4}>
              <NoticeBoard />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Quick Links Section */}
      <section className="py-5 bg-light-blue">
        <Container>
          <div className="text-center mb-5">
            <h2 className="text-primary-blue fw-bold">Explore Our Institute</h2>
            <p className="text-muted">Quick access to important sections</p>
          </div>
          <Row className="g-4 text-center">
            <Col md={3} sm={6}>
              <Card className="h-100 shadow-sm border-0 py-4 hover-lift">
                <Card.Body>
                  <div className="display-4 text-primary-blue mb-3">📚</div>
                  <Card.Title className="fw-bold">Courses Offered</Card.Title>
                  <Card.Text className="text-muted small">Explore our Diploma programs in EE, CSE, and IT.</Card.Text>
                  <Link href="/admission/courses" className="stretched-link text-decoration-none">View Details</Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="h-100 shadow-sm border-0 py-4 hover-lift">
                <Card.Body>
                  <div className="display-4 text-primary-blue mb-3">🎓</div>
                  <Card.Title className="fw-bold">Admissions</Card.Title>
                  <Card.Text className="text-muted small">Check the admission process, eligibility, and fees.</Card.Text>
                  <Link href="/admission/process" className="stretched-link text-decoration-none">View Details</Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="h-100 shadow-sm border-0 py-4 hover-lift">
                <Card.Body>
                  <div className="display-4 text-primary-blue mb-3">💼</div>
                  <Card.Title className="fw-bold">Placements</Card.Title>
                  <Card.Text className="text-muted small">Top recruiters and our excellent placement records.</Card.Text>
                  <Link href="/placements/records" className="stretched-link text-decoration-none">View Details</Link>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="h-100 shadow-sm border-0 py-4 hover-lift">
                <Card.Body>
                  <div className="display-4 text-primary-blue mb-3">🏆</div>
                  <Card.Title className="fw-bold">Life@KMGGP</Card.Title>
                  <Card.Text className="text-muted small">Discover campus life, events, and student activities.</Card.Text>
                  <Link href="/life" className="stretched-link text-decoration-none">View Details</Link>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="py-5 bg-white">
        <Container>
          <div className="text-center mb-5">
            <h2 className="text-primary-blue fw-bold">Student Testimonials</h2>
            <p className="text-muted">What our alumnae have to say</p>
          </div>
          <Row className="g-4">
            <Col md={6}>
              <Card className="shadow-sm border-0 h-100 bg-light p-3">
                <Card.Body>
                  <Card.Text className="fst-italic">
                    "The Computer Science department here is phenomenal. The faculty are extremely supportive and the labs are well-equipped. I secured a job at a top MNC directly through campus placements!"
                  </Card.Text>
                  <div className="mt-3 fw-bold text-primary-blue">- Anjali Sharma, CSE Batch 2025</div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="shadow-sm border-0 h-100 bg-light p-3">
                <Card.Body>
                  <Card.Text className="fst-italic">
                    "KMGGP Badalpur completely transformed my career. The practical approach in Electronics Engineering helped me understand core concepts effortlessly."
                  </Card.Text>
                  <div className="mt-3 fw-bold text-primary-blue">- Priya Verma, EE Batch 2024</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* Additional styling for hover effects */}
      <style>{`
        .hover-lift {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hover-lift:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
        }
      `}</style>
    </>
  );
}

