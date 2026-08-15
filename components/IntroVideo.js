"use client";

import React, { useEffect, useState } from 'react';
import VideoModal from '@/components/VideoModal';
import { FEATURED_VIDEO_ALBUM } from '@/lib/gallery';

/** Remembered for the tab, so the film greets a visitor once and not on every
 *  page they open afterwards. Clearing it (or a new tab) shows it again. */
const SEEN_KEY = 'kmggp-intro-video-seen';

/**
 * The welcome film — the video carried by the featured gallery album, played
 * over the page as soon as the site opens. The viewer itself is `VideoModal`,
 * the same one the album page opens on a click; this component only decides
 * when it greets a visitor.
 */
export default function IntroVideo() {
  const album = FEATURED_VIDEO_ALBUM;
  const [open, setOpen] = useState(false);

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

  if (!album) return null;

  return (
    <VideoModal
      video={album.video}
      icon={album.icon}
      open={open}
      onClose={() => setOpen(false)}
      action={{ href: `/gallery/${album.slug}`, label: album.title, icon: 'bi-images' }}
      autoPlay
    />
  );
}
