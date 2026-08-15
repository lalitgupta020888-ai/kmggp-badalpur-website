"use client";

import React from 'react';
import { Carousel, Container } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';

/**
 * `src: null` means the photograph for that slide has not been supplied yet.
 * The slide still runs in the rotation with its copy intact, over the navy
 * house gradient instead of a photo — same convention PrincipalCard uses.
 * Drop the file into `public/images/` and set `src` to its path to restore it.
 */
const SLIDES = [
  {
    src: '/images/campus.png',
    alt: 'The main entrance of Km. Mayawati Government Girls Polytechnic, Badalpur',
    // A wide panorama in a 2.2:1 hero: cover trims a good part of the width.
    // Anchoring left spends the whole trim on the right edge, so the tree line
    // and the name board survive intact.
    position: 'left center',
    eyebrow: 'Government of Uttar Pradesh',
    icon: 'bi-award-fill',
    title: 'Empowering Women Through Technical Excellence',
    text: 'Km. Mayawati Government Girls Polytechnic, Badalpur — a premier institute shaping confident, industry-ready engineers.',
    primary: { href: '/admission/process', label: 'Apply for Admission', icon: 'bi-mortarboard-fill' },
    secondary: { href: '/about', label: 'Discover the Institute', icon: 'bi-arrow-right' },
  },
  {
    src: '/images/har-ghar-tiranga/rangoli-display.jpg',
    alt: 'Independence Day decorations at KMGGP Badalpur — a tricolour display board and a "Happy Independence Day" rangoli in the campus corridor',
    // A 16:9 frame in a hero that goes much wider than that: cover crops the
    // top and bottom. Biasing above the midpoint keeps the display board whole;
    // the rangoli loses only its lowest edge.
    position: 'center 42%',
    eyebrow: 'Independence Day 2026',
    icon: 'bi-flag-fill',
    title: 'Celebrating the Spirit of Freedom',
    text: 'The campus came alive with rangoli, tricolour displays and student artwork as KMGGP Badalpur marked the 15th of August.',
    primary: { href: '/gallery/har-ghar-tiranga', label: 'View the Album', icon: 'bi-images' },
    secondary: { href: '/life', label: 'Life @ KMGGP', icon: 'bi-stars' },
  },
  {
    src: '/images/slider1.png',
    alt: 'The academic block of Km. Mayawati Government Girls Polytechnic, Badalpur',
    // This frame is 2.35:1, so it only crops vertically once the viewport is
    // wide enough to out-stretch it (~1500px up; below that the height fits
    // exactly and this offset is inert). Biasing past the midpoint lifts the
    // photo clear of the headline and keeps the building's base in frame.
    position: 'center 70%',
    eyebrow: 'Our Campus',
    icon: 'bi-building-fill',
    title: 'A Campus Built for Learning',
    text: 'Spacious academic blocks, green surroundings and a safe, well-equipped environment for every student.',
    primary: { href: '/gallery', label: 'View Campus Gallery', icon: 'bi-images' },
    secondary: { href: '/life', label: 'Life @ KMGGP', icon: 'bi-stars' },
  },
  {
    src: '/images/slider2.png',
    alt: 'Modern laboratories at Km. Mayawati Government Girls Polytechnic, Badalpur',
    eyebrow: 'World-class Infrastructure',
    icon: 'bi-cpu-fill',
    title: 'State of the Art Laboratories',
    text: 'Hands-on learning across advanced computing, electronics, networking and hardware laboratories.',
    primary: { href: '/admission/courses', label: 'Explore Courses', icon: 'bi-collection-fill' },
    secondary: { href: '/gallery', label: 'View Campus Gallery', icon: 'bi-images' },
  },
  {
    src: '/images/slider3.png',
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
        <Carousel.Item key={slide.src + index} className="hero-slide">
          {slide.src ? (
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              sizes="100vw"
              className="hero-photo"
              style={{ objectFit: 'cover', objectPosition: slide.position ?? 'center' }}
              priority={index === 0}
            />
          ) : (
            <div className="hero-photo-pending" role="img" aria-label={slide.alt} />
          )}
          <div className="hero-overlay" />
          <div className="hero-vignette" />

          <div className="hero-caption">
            <Container>
              <div className="hero-caption-inner">
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
        </Carousel.Item>
      ))}
    </Carousel>
  );
}
