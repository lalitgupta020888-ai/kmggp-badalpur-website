"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

import VideoModal from '@/components/VideoModal';
import { alreadySeen, markSeen } from '@/lib/popup-frequency';
import { useFocusTrap } from '@/lib/focus-trap';

/**
 * The window that greets a visitor when the site opens.
 *
 * What it shows is admin content: a notice, a poster, an uploaded film, or the
 * film carried by the featured gallery album. A film is handed to `VideoModal`,
 * which already knows how to autoplay muted and survive a refused autoplay; the
 * notice and poster forms are rendered here.
 *
 * It lives in the root layout, so it stays mounted across client-side
 * navigation — moving between pages does not replay it. Only a real reload or a
 * new visit does, subject to `frequency`.
 */

export default function WelcomePopup({ popup, galleryAlbum }) {
  // Opened from an effect rather than initial state, so the server-rendered
  // markup and the first client render agree before anything appears.
  const [open, setOpen] = useState(false);
  const dialogRef = useRef(null);

  const enabled = Boolean(popup?.enabled);
  const isFilm = popup?.kind === 'Film' || popup?.kind === 'Gallery film';

  // The film form is a VideoModal, which traps focus itself.
  useFocusTrap(dialogRef, open && enabled && !isFilm);

  // Escape closes the notice and poster forms, as it does every other dialog.
  useEffect(() => {
    if (!open || isFilm) return undefined;
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        markSeen(popup, window.localStorage);
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, isFilm, popup]);

  useEffect(() => {
    if (!enabled) return;
    if (alreadySeen(popup, window.localStorage)) return;
    setOpen(true);
  }, [enabled, popup]);

  const close = () => {
    setOpen(false);
    markSeen(popup, window.localStorage);
  };

  if (!enabled) return null;

  /* --------------------------------- Film -------------------------------- */

  if (popup.kind === 'Film' || popup.kind === 'Gallery film') {
    const film =
      popup.kind === 'Gallery film'
        ? galleryAlbum?.video
        : popup.video && { src: popup.video, poster: popup.poster, caption: popup.title };

    if (!film?.src) return null;

    return (
      <VideoModal
        video={film}
        icon={popup.icon}
        open={open}
        onClose={close}
        action={
          popup.buttonLabel && popup.buttonHref
            ? { href: popup.buttonHref, label: popup.buttonLabel, icon: popup.buttonIcon }
            : popup.kind === 'Gallery film' && galleryAlbum
              ? { href: `/gallery/${galleryAlbum.slug}`, label: galleryAlbum.title, icon: 'bi-images' }
              : null
        }
        autoPlay
      />
    );
  }

  /* --------------------------- Notice and poster -------------------------- */

  const hasImage = popup.kind === 'Image' && popup.image;
  if (!open) return null;
  if (!hasImage && !popup.title && !popup.message) return null;

  return (
    <div
      ref={dialogRef}
      className="welcome-pop"
      role="dialog"
      aria-modal="true"
      aria-labelledby={popup.title ? 'welcome-pop-title' : undefined}
      aria-label={popup.title ? undefined : 'Announcement'}
      onClick={close}
    >
      {/* Clicks inside the card must not reach the backdrop's close handler */}
      <div className="welcome-pop-card" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="welcome-pop-close" onClick={close} autoFocus>
          <i className="bi bi-x-lg" aria-hidden="true" />
          <span className="visually-hidden">Close</span>
        </button>

        {hasImage && (
          <div className="welcome-pop-figure">
            {/* A plain img: the poster is admin-uploaded at an unknown size and
                is shown once, so the optimiser earns nothing here. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={popup.image} alt={popup.title || 'Announcement'} />
          </div>
        )}

        <div className="welcome-pop-body">
          {popup.title && (
            <h2 className="welcome-pop-title" id="welcome-pop-title">
              <i className={`bi ${popup.icon || 'bi-megaphone-fill'}`} aria-hidden="true" />
              {popup.title}
            </h2>
          )}

          <div className="gold-rule-thin my-3" />

          {popup.message && (
            <div className="welcome-pop-text">
              {popup.message
                .split(/\n{2,}/)
                .map((part) => part.trim())
                .filter(Boolean)
                .map((part) => (
                  <p key={part.slice(0, 40)}>{part}</p>
                ))}
            </div>
          )}

          <div className="welcome-pop-actions">
            {popup.buttonLabel && popup.buttonHref && (
              <Link href={popup.buttonHref} className="btn-gold" onClick={close}>
                <i className={`bi ${popup.buttonIcon || 'bi-arrow-right'}`} aria-hidden="true" />
                {popup.buttonLabel}
              </Link>
            )}
            <button type="button" className="btn-outline-navy" onClick={close}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
