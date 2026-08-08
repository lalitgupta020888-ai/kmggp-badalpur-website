"use client";

import React, { useCallback, useEffect, useRef } from 'react';
import Image from 'next/image';

/**
 * Full-screen photo viewer.
 *
 * Driven entirely by the parent: `index` is the photograph on show, or null
 * when closed. Escape and the arrow keys work, the backdrop closes on click,
 * and the page behind is locked so it cannot scroll away underneath.
 *
 * images: [{ src, caption, tag }]
 */
export default function Lightbox({ images, index, onClose, onIndexChange }) {
  const open = index !== null && index !== undefined;
  const closeRef = useRef(null);
  const touchStartX = useRef(null);

  const step = useCallback(
    (delta) => {
      if (!open) return;
      onIndexChange((index + delta + images.length) % images.length);
    },
    [open, index, images.length, onIndexChange]
  );

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') step(1);
      if (event.key === 'ArrowLeft') step(-1);
    };

    document.addEventListener('keydown', onKeyDown);

    // Hold the page still while the viewer is up
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose, step]);

  if (!open) return null;

  const image = images[index];

  const onTouchStart = (event) => {
    touchStartX.current = event.changedTouches[0].clientX;
  };

  const onTouchEnd = (event) => {
    if (touchStartX.current === null) return;
    const travelled = event.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(travelled) > 50) step(travelled < 0 ? 1 : -1);
    touchStartX.current = null;
  };

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={image.caption}
      onClick={onClose}
    >
      <button ref={closeRef} type="button" className="lightbox-close" onClick={onClose}>
        <i className="bi bi-x-lg" />
        <span className="visually-hidden">Close</span>
      </button>

      {images.length > 1 && (
        <button
          type="button"
          className="lightbox-nav lightbox-prev"
          onClick={(event) => {
            event.stopPropagation();
            step(-1);
          }}
        >
          <i className="bi bi-chevron-left" />
          <span className="visually-hidden">Previous photograph</span>
        </button>
      )}

      {/* Clicks inside the frame must not reach the backdrop's close handler */}
      <figure className="lightbox-frame m-0" onClick={(event) => event.stopPropagation()}>
        <div
          className="lightbox-stage"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <Image
            src={image.src}
            alt={image.caption}
            fill
            sizes="100vw"
            priority
            style={{ objectFit: 'contain' }}
          />
        </div>

        <figcaption className="lightbox-caption">
          <span className="lightbox-tag">{image.tag}</span>
          <strong>{image.caption}</strong>
          <span className="lightbox-count">
            {index + 1} / {images.length}
          </span>
        </figcaption>
      </figure>

      {images.length > 1 && (
        <button
          type="button"
          className="lightbox-nav lightbox-next"
          onClick={(event) => {
            event.stopPropagation();
            step(1);
          }}
        >
          <i className="bi bi-chevron-right" />
          <span className="visually-hidden">Next photograph</span>
        </button>
      )}
    </div>
  );
}
