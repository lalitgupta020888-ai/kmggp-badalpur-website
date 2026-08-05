"use client";

import React from 'react';
import { Carousel, Container } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';

const SLIDES = [
  {
    src: '/images/campus.png',
    alt: 'The main entrance of Km. Mayawati Government Girls Polytechnic, Badalpur',
    // Deliberately captionless — the photograph carries this slide on its own.
    whole: true,
  },
  {
    src: '/images/college_1.png',
    alt: 'The academic block of Km. Mayawati Government Girls Polytechnic, Badalpur',
    whole: true,
    eyebrow: 'Government of Uttar Pradesh',
    icon: 'bi-award-fill',
    title: 'Empowering Women Through Technical Excellence',
    text: 'Km. Mayawati Government Girls Polytechnic, Badalpur — a premier institute shaping confident, industry-ready engineers.',
    primary: { href: '/admission/process', label: 'Apply for Admission', icon: 'bi-mortarboard-fill' },
    secondary: { href: '/about', label: 'Discover the Institute', icon: 'bi-arrow-right' },
  },
  {
    src: '/images/slider2.jpg',
    alt: 'Modern laboratories at Km. Mayawati Government Girls Polytechnic, Badalpur',
    eyebrow: 'World-class Infrastructure',
    icon: 'bi-cpu-fill',
    title: 'State of the Art Laboratories',
    text: 'Hands-on learning across advanced computing, electronics, networking and hardware laboratories.',
    primary: { href: '/admission/courses', label: 'Explore Courses', icon: 'bi-collection-fill' },
    secondary: { href: '/gallery', label: 'View Campus Gallery', icon: 'bi-images' },
  },
  {
    src: '/images/slider3.jpg',
    alt: 'The institute library',
    eyebrow: 'Knowledge & Research',
    icon: 'bi-book-half',
    title: 'A Rich Foundation of Learning',
    text: 'An extensive library and a serene academic environment with thousands of curated resources.',
    primary: { href: '/placements/records', label: 'Placement Records', icon: 'bi-graph-up-arrow' },
    secondary: { href: '/life', label: 'Life @ KMGGP', icon: 'bi-stars' },
  },
];

export default function HeroSlider() {
  return (
    <Carousel fade indicators interval={6000} pause="hover" nextLabel="" prevLabel="">
      {SLIDES.map((slide, index) => (
        <Carousel.Item
          key={slide.src + index}
          className={`hero-slide${slide.title ? '' : ' hero-slide--bare'}`}
        >
          {/* A `whole` slide shows its photograph uncropped rather than trimmed
              to the hero's ratio, so the letterbox left over by `contain` is
              filled with a blurred copy of the same frame. */}
          {slide.whole && (
            <Image
              src={slide.src}
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              className="hero-backdrop"
              style={{ objectFit: 'cover' }}
              priority={index === 0}
            />
          )}
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            sizes="100vw"
            style={{
              objectFit: slide.whole ? 'contain' : 'cover',
              objectPosition: slide.position ?? 'center',
            }}
            priority={index === 0}
          />
          <div className="hero-overlay" />
          <div className="hero-vignette" />

          {/* A slide may carry no copy at all, in which case the photograph
              stands alone — every caption field is then absent. */}
          {slide.title && (
            <div className="hero-caption">
              <Container>
                <div style={{ maxWidth: '760px' }}>
                  <span className="eyebrow eyebrow-light anim-up anim-up-1">
                    <i className={`bi ${slide.icon}`} />
                    {slide.eyebrow}
                  </span>
                  <h2 className="anim-up anim-up-1">{slide.title}</h2>
                  <div className="hero-gold-line anim-up anim-up-2" />
                  <p className="anim-up anim-up-2">{slide.text}</p>
                  <div className="d-flex flex-wrap gap-3 mt-4 anim-up anim-up-3">
                    <Link href={slide.primary.href} className="hero-btn-primary">
                      <i className={`bi ${slide.primary.icon}`} />
                      {slide.primary.label}
                    </Link>
                    <Link href={slide.secondary.href} className="hero-btn-ghost">
                      <i className={`bi ${slide.secondary.icon}`} />
                      {slide.secondary.label}
                    </Link>
                  </div>
                </div>
              </Container>
            </div>
          )}
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
