"use client";

import React, { useEffect, useState } from 'react';
import { Carousel, Container } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';

/**
 * The rotating banner at the top of the home page.
 *
 * Slides come from the admin panel. A slide with no photograph still runs, over
 * the navy house gradient, so the copy survives while a picture is arranged;
 * a slide with no buttons simply shows none.
 */
export default function HeroSlider({ slides = [] }) {
  // Auto-advance is off for anyone who asked their system for less motion,
  // and for anyone who presses the pause button; a slideshow that moves on
  // its own is hard to read with magnification or a screen reader.
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setPaused(query.matches);
    sync();
    query.addEventListener('change', sync);
    return () => query.removeEventListener('change', sync);
  }, []);

  if (slides.length === 0) return null;

  return (
    <section aria-roledescription="carousel" aria-label="Highlights" className="hero-carousel">
      <Carousel
        fade
        indicators
        interval={paused ? null : 6000}
        pause="hover"
        prevLabel="Previous slide"
        nextLabel="Next slide"
        controls={slides.length > 1}
      >
      {slides.map((slide, index) => (
        <Carousel.Item
          key={slide.id || `${slide.src}-${index}`}
          className="hero-slide"
          role="group"
          aria-roledescription="slide"
          aria-label={`Slide ${index + 1} of ${slides.length}`}
        >
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
                  <i className={`bi ${slide.icon}`} aria-hidden="true" />
                  {slide.eyebrow}
                </span>
                <h2 className="anim-up anim-up-1">{slide.title}</h2>
                <div className="hero-gold-line anim-up anim-up-2" />
                <p className="anim-up anim-up-2">{slide.text}</p>
                <div className="d-flex flex-wrap gap-3 mt-4 anim-up anim-up-3">
                  {/* A button needs both its text and its destination before it
                      is worth rendering — half-filled slides are a normal state
                      while a new banner is being put together. */}
                  {slide.primaryLabel && slide.primaryHref && (
                    <Link href={slide.primaryHref} className="hero-btn-primary">
                      <i className={`bi ${slide.primaryIcon || 'bi-arrow-right'}`} aria-hidden="true" />
                      {slide.primaryLabel}
                    </Link>
                  )}
                  {slide.secondaryLabel && slide.secondaryHref && (
                    <Link href={slide.secondaryHref} className="hero-btn-ghost">
                      <i className={`bi ${slide.secondaryIcon || 'bi-arrow-right'}`} aria-hidden="true" />
                      {slide.secondaryLabel}
                    </Link>
                  )}
                </div>
              </div>
            </Container>
          </div>
        </Carousel.Item>
      ))}
      </Carousel>
      {slides.length > 1 && (
        <button
          type="button"
          className="hero-pause"
          aria-pressed={paused}
          onClick={() => setPaused((wasPaused) => !wasPaused)}
        >
          <i className={`bi ${paused ? 'bi-play-fill' : 'bi-pause-fill'}`} aria-hidden="true" />
          {paused ? 'Play slideshow' : 'Pause slideshow'}
        </button>
      )}
    </section>
  );
}
