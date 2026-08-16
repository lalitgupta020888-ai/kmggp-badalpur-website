"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/**
 * The paired band that closes the home page: a self-advancing gallery strip on
 * the left and the campus map on the right, both wearing the same navy header.
 *
 * The strip is a single track translated by one slide-width every few seconds,
 * so the photographs walk past one by one rather than cross-fading in place.
 */

const SLIDE_MS = 3500;

export default function GalleryMapBand({ images = [], location = {} }) {
  // The pin and the address under the map are admin-editable, so the map URLs
  // are built per render rather than frozen into module constants.
  const point = `${location.lat || '28.593145'},${location.lng || '77.51895'}`;
  const mapEmbed = `https://www.google.com/maps?q=${point}&z=16&hl=en&output=embed`;
  const mapView = `https://www.google.com/maps/search/?api=1&query=${point}`;
  const slides = images;
  const [index, setIndex] = useState(0);
  // Deleting photographs in the panel can leave `index` past the end of a
  // shorter list, and an empty gallery would turn the modulo arithmetic below
  // into NaN — so the position actually rendered is always clamped.
  const activeIndex = slides.length ? Math.min(index, slides.length - 1) : 0;
  const step = (direction) => {
    if (slides.length === 0) return;
    setIndex((current) => (current + direction + slides.length) % slides.length);
  };
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || slides.length < 2) return undefined;
    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length);
    }, SLIDE_MS);
    return () => clearInterval(timer);
  }, [paused, slides.length]);

  return (
    <section className="section gallery-map-band" style={{ background: 'var(--paper)' }}>
      <div className="gallery-map-bleed">
        <div className="gallery-map-grid">
          {/* Gallery — the photographs move past one at a time */}
          <div className="panel gm-panel">
            <div className="panel-header gm-header">
              <i className="bi bi-camera-fill" />
              <span>GALLERY</span>
              <Link href="/gallery" className="gm-header-link">
                VIEW ALL
              </Link>
            </div>

            <div
              className="gm-slider"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div
                className="gm-track"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {slides.map((image, position) => (
                  <div className="gm-slide" key={`${image.src}-${position}`}>
                    <Image
                      src={image.src}
                      alt={image.caption}
                      fill
                      sizes="(max-width: 991px) 100vw, 45vw"
                      style={{ objectFit: 'cover' }}
                      priority={position === 0}
                    />
                    <span className="gm-slide-caption">
                      <i className="bi bi-camera-fill me-2" />
                      {image.caption}
                    </span>
                  </div>
                ))}
              </div>

              <button
                type="button"
                className="gm-nav gm-nav-prev"
                aria-label="Previous photograph"
                onClick={() => step(-1)}
              >
                <i className="bi bi-chevron-left" />
              </button>
              <button
                type="button"
                className="gm-nav gm-nav-next"
                aria-label="Next photograph"
                onClick={() => step(1)}
              >
                <i className="bi bi-chevron-right" />
              </button>

              <div className="gm-dots">
                {slides.map((image, position) => (
                  <button
                    type="button"
                    key={`dot-${image.src}-${position}`}
                    className={`gm-dot${position === activeIndex ? ' is-active' : ''}`}
                    aria-label={`Show ${image.caption}`}
                    aria-current={position === activeIndex}
                    onClick={() => setIndex(position)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="panel gm-panel">
            <div className="panel-header gm-header">
              <i className="bi bi-globe2" />
              <span>Find US ON MAP</span>
            </div>

            <div className="gm-map">
              <iframe
                title="Km. Mayawati Government Girls Polytechnic, Badalpur on Google Maps"
                src={mapEmbed}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
              <a className="gm-map-open" href={mapView} target="_blank" rel="noreferrer">
                Open in Maps
                <i className="bi bi-box-arrow-up-right ms-2" />
              </a>
            </div>

            <p className="gm-map-address">
              <i className="bi bi-geo-alt-fill" />
              {location.name}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
