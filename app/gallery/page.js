"use client";
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import Image from 'next/image';

export default function GalleryPage() {
  // Using placeholder image paths. Since we only generated 3, we can reuse them.
  const images = [
    '/images/slider1.png',
    '/images/slider2.png',
    '/images/slider3.png',
    '/images/slider1.png',
    '/images/slider2.png',
    '/images/slider3.png',
  ];

  return (
    <div className="py-5 bg-white">
      <Container>
        <div className="text-center mb-5">
          <h2 className="text-primary-blue fw-bold">Photo Gallery</h2>
          <p className="text-muted">Glimpses of life, events, and facilities at KMGGP Badalpur</p>
        </div>
        <Row className="g-4">
          {images.map((img, index) => (
            <Col md={4} sm={6} key={index}>
              <Card className="border-0 shadow-sm h-100 overflow-hidden">
                <div style={{ position: 'relative', height: '250px' }}>
                  <Image 
                    src={img} 
                    alt={`Gallery Image ${index + 1}`} 
                    fill 
                    style={{ objectFit: 'cover' }}
                    className="gallery-img-hover"
                  />
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <style>{`
          .gallery-img-hover {
            transition: transform 0.3s ease;
          }
          .gallery-img-hover:hover {
            transform: scale(1.05);
          }
        `}</style>
      </Container>
    </div>
  );
}

