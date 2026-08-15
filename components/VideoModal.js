"use client";

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';

/**
 * Full-screen film viewer — the moving-picture counterpart to `Lightbox`.
 *
 * Driven by the parent: `open` puts it up, `onClose` takes it down. Escape and
 * the backdrop close it, and the page behind is locked so it cannot scroll away
 * underneath.
 *
 * It starts muted whenever `autoPlay` is set, because every browser blocks a
 * video that autoplays with sound; the sound button un-mutes it on the
 * visitor's own click. If autoplay is refused anyway, the poster stays up with
 * a play button over it rather than a frozen frame.
 *
 * video:  { src, poster, caption }
 * action: optional { href, label, icon } shown as a gold button in the bar
 */
export default function VideoModal({ video, open, onClose, icon, action, autoPlay = false }) {
  const [muted, setMuted] = useState(autoPlay);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();

    // A refused autoplay rejects rather than throwing.
    videoRef.current?.play?.().catch(() => setPlaying(false));

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

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
    if (el.paused) el.play().catch(() => setPlaying(false));
    else el.pause();
  };

  return (
    <div
      className="video-modal"
      role="dialog"
      aria-modal="true"
      aria-label={video.caption}
      onClick={onClose}
    >
      {/* Clicks inside the frame must not reach the backdrop's close handler */}
      <div className="video-modal-frame" onClick={(event) => event.stopPropagation()}>
        <button ref={closeRef} type="button" className="video-modal-close" onClick={onClose}>
          <i className="bi bi-x-lg" />
          <span className="visually-hidden">Close</span>
        </button>

        <video
          ref={videoRef}
          className="video-modal-player"
          poster={video.poster}
          autoPlay={autoPlay}
          muted={autoPlay}
          playsInline
          controls
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={onClose}
        >
          <source src={video.src} type="video/mp4" />
          Your browser cannot play this video.
        </video>

        <div className="video-modal-bar">
          <span className="video-modal-title">
            <i className={`bi ${icon || 'bi-film'}`} />
            {video.caption}
          </span>

          <div className="video-modal-actions">
            <button type="button" className="video-modal-btn" onClick={togglePlay}>
              <i className={`bi ${playing ? 'bi-pause-fill' : 'bi-play-fill'}`} />
              {playing ? 'Pause' : 'Play'}
            </button>
            <button type="button" className="video-modal-btn" onClick={toggleSound}>
              <i className={`bi ${muted ? 'bi-volume-mute-fill' : 'bi-volume-up-fill'}`} />
              {muted ? 'Sound on' : 'Mute'}
            </button>
            {action && (
              <Link href={action.href} className="video-modal-btn is-gold" onClick={onClose}>
                <i className={`bi ${action.icon}`} />
                {action.label}
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
