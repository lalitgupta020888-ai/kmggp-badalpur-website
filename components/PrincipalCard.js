"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Compact Principal's Message teaser shown under the notice board.
 *
 * To add a portrait, drop the file into `public/images/leadership/` and set
 * PHOTO to its path — the gold emblem placeholder is used until then.
 */
const PHOTO = null; // e.g. '/images/leadership/principal.jpg'

export default function PrincipalCard() {
  return (
    <section className="principal-card">
      <div className="principal-head">
        <i className="bi bi-chat-quote-fill" />
        Principal&apos;s Message
      </div>

      <div className="principal-body">
        {/* Portrait leads, with the post and the institute stacked beneath it */}
        <div className="principal-person">
          <span className="principal-photo">
            {PHOTO ? (
              <Image src={PHOTO} alt="Principal" fill sizes="96px" style={{ objectFit: 'cover' }} />
            ) : (
              <i className="bi bi-person-fill" />
            )}
          </span>
          <span className="principal-name">Principal</span>
          <span className="principal-role">
            Km. Mayawati Government Girls Polytechnic, Badalpur
          </span>
        </div>

        <div className="gold-flourish principal-flourish">
          <i className="bi bi-diamond-fill" />
        </div>

        <blockquote className="principal-quote">
          <i className="bi bi-quote" />
          Education is the most powerful instrument a young woman can hold. Our purpose here is to
          place that instrument firmly in her hands.
        </blockquote>

        <Link href="/about/principal-message" className="principal-link">
          Read Full Message
          <i className="bi bi-arrow-right" />
        </Link>
      </div>
    </section>
  );
}
