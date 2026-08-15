"use client";

import React, { useEffect, useState } from 'react';
import VideoModal from '@/components/VideoModal';
import { FEATURED_VIDEO_ALBUM } from '@/lib/gallery';

/**
 * The welcome film — the video carried by the featured gallery album, played
 * over the page as soon as the site opens. The viewer itself is `VideoModal`,
 * the same one the album page opens on a click; this component only decides
 * when it greets a visitor.
 *
 * It opens on every fresh load of the site. Moving between pages afterwards
 * does not replay it: this sits in the root layout, so it stays mounted across
 * client-side navigation and only runs again on a real reload or a new visit.
 */
export default function IntroVideo() {
  const album = FEATURED_VIDEO_ALBUM;
  // Opened from an effect rather than initial state, so the server-rendered
  // markup and the first client render agree before it appears.
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (album) setOpen(true);
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
