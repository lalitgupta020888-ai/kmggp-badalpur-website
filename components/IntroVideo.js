"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { FEATURED_VIDEO_ALBUM } from '@/lib/gallery';

/** Remembered for the tab, so the film greets a visitor once and not on every
 *  page they open afterwards. Clearing it (or a new tab) shows it again. */
const SEEN_KEY = 'kmggp-intro-video-seen';

/**
 * The welcome film — the video carried by the featured gallery album, played
 * over the page as soon as the site opens.
 *
 * It starts muted because every browser blocks a video that autoplays with
 * sound; the sound button un-mutes it on the visitor's own click. If autoplay
 * is refused anyway, the poster stays up with a play button over it.
 */
export default function IntroVideo() {
  const album = FEATURED_VIDEO_ALBUM;
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const [playing, setPlaying] = useState(true);
  const videoRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!album) return;
    let seen = null;
    try {
      seen = window.sessionStorage.getItem(SEEN_KEY);
    } catch {
      // Private-mode storage refusal: treat it as unseen and just play.
    }
    if (seen) return;
    setOpen(true);
    try {
      window.sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      // Nothing to remember it with; the film simply greets them again.
    }
  }, [album]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    // A refused autoplay rejects rather than throwing — fall back to the poster
    // with a play button instead of leaving a frozen frame.
    videoRef.current?.play?.().catch(() => setPlaying(false));

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!album || !open) return null;

  const { video } = album;

  const toggleSound = () => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = !el.muted;
    setMuted(el.muted);
    if (el.paused) el.play().catch(() => setPlaying(false));
  };

  const togglePlay = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) el.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
    else {
      el.pause();
      setPlaying(false);
    }
  };

  return (
    <div
      className="intro-video"
      role="dialog"
      aria-modal="true"
      aria-label={video.caption}
      onClick={() => setOpen(false)}
    >
      {/* Clicks inside the frame must not reach the backdrop's close handler */}
      <div className="intro-video-frame" onClick={(event) => event.stopPropagation()}>
        <button
          ref={closeRef}
          type="button"
          className="intro-video-close"
          onClick={() => setOpen(false)}
        >
          <i className="bi bi-x-lg" />
          <span className="visually-hidden">Close</span>
        </button>

        <video
          ref={videoRef}
          className="intro-video-player"
          poster={video.poster}
          autoPlay
          muted
          playsInline
          controls
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setOpen(false)}
        >
          <source src={video.src} type="video/mp4" />
          Your browser cannot play this video.
        </video>

        <div className="intro-video-bar">
          <span className="intro-video-title">
            <i className={`bi ${album.icon}`} />
            {video.caption}
          </span>

          <div className="intro-video-actions">
            <button type="button" className="intro-video-btn" onClick={togglePlay}>
              <i className={`bi ${playing ? 'bi-pause-fill' : 'bi-play-fill'}`} />
              {playing ? 'Pause' : 'Play'}
            </button>
            <button type="button" className="intro-video-btn" onClick={toggleSound}>
              <i className={`bi ${muted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'}`} />
              {muted ? 'Sound on' : 'Mute'}
            </button>
            <Link
              href={`/gallery/${album.slug}`}
              className="intro-video-btn is-gold"
              onClick={() => setOpen(false)}
            >
              <i className="bi bi-images" />
              {album.title}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
