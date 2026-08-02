"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';

const IMAGES = [
  { src: '/images/slider1.jpg', caption: 'The Main Campus', tag: 'Campus' },
  { src: '/images/slider2.jpg', caption: 'Advanced Computing Laboratory', tag: 'Laboratories' },
  { src: '/images/slider3.jpg', caption: 'The Institute Library', tag: 'Library' },
  { src: '/images/slider1.jpg', caption: 'Academic Block', tag: 'Campus' },
  { src: '/images/slider2.jpg', caption: 'Electronics Laboratory', tag: 'Laboratories' },
  { src: '/images/slider3.jpg', caption: 'Reading & Study Hall', tag: 'Library' },
];

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        icon="bi-images"
        eyebrow="Campus Moments"
        title="Photo Gallery"
        subtitle="Glimpses of academic life, events and facilities at Km. Mayawati Government Girls Polytechnic, Badalpur."
        crumbs={[{ label: 'Gallery' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <SectionHead
            eyebrow="Our Campus in Pictures"
            icon="bi-camera-fill"
            title="Life, Learning and Facilities"
            subtitle="A visual walk through our classrooms, laboratories, library and campus grounds."
          />

          <Row className="g-4">
            {IMAGES.map((image, index) => (
              <Col lg={4} md={6} key={`${image.src}-${index}`}>
                <figure className="gallery-tile m-0">
                  <Image
                    src={image.src}
                    alt={image.caption}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <figcaption className="gallery-veil">
                    <div className="gold-rule-thin" />
                    <span>
                      <i className="bi bi-camera-fill me-2" />
                      {image.caption}
                    </span>
                    <span className="small mt-1" style={{ color: 'var(--gold-300)' }}>
                      {image.tag}
                    </span>
                  </figcaption>
                </figure>
              </Col>
            ))}
          </Row>

          <div className="callout mt-5">
            <i className="bi bi-info-circle-fill" />
            <p>
              More photographs from annual functions, technical festivals and industrial visits will
              be added to this gallery through the academic session.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
