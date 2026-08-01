"use client";

import React from 'react';
import { Carousel } from 'react-bootstrap';
import Image from 'next/image';

export default function HeroSlider() {
  return (
    <Carousel fade nextLabel="" prevLabel="">
      {/* Slide 1: Campus */}
      <Carousel.Item style={{ height: '600px' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image 
            src="/images/slider1.png" 
            alt="Beautiful Campus" 
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
        </div>
        <Carousel.Caption>
          <h2 className="display-4 fw-bold">Welcome to KMGGP Badalpur</h2>
          <p className="lead">Empowering women through quality technical education and holistic development.</p>
        </Carousel.Caption>
      </Carousel.Item>

      {/* Slide 2: Labs */}
      <Carousel.Item style={{ height: '600px' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image 
            src="/images/slider2.png" 
            alt="Modern Laboratories" 
            fill
            style={{ objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
        </div>
        <Carousel.Caption>
          <h2 className="display-4 fw-bold">State of the Art Facilities</h2>
          <p className="lead">Experience hands-on learning with our highly equipped modern laboratories.</p>
        </Carousel.Caption>
      </Carousel.Item>

      {/* Slide 3: Library */}
      <Carousel.Item style={{ height: '600px' }}>
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <Image 
            src="/images/slider3.png" 
            alt="Extensive Library" 
            fill
            style={{ objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)' }}></div>
        </div>
        <Carousel.Caption>
          <h2 className="display-4 fw-bold">Rich Knowledge Base</h2>
          <p className="lead">An extensive library offering a serene environment and thousands of resources for learning.</p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}
