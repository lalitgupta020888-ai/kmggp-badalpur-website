"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

/**
 * Compact Principal's Message teaser shown under the notice board.
 *
 * Name, post, portrait and quotation all come from the admin panel, so a change
 * of Principal is one edit in one place. Without a portrait the card shows the
 * gold emblem placeholder rather than a broken frame.
 */
export default function PrincipalCard({ principal = {} }) {
  const { name, role, photo, quote, linkLabel } = principal;

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
            {photo ? (
              <Image
                src={photo}
                alt={name || 'Principal'}
                fill
                sizes="96px"
                style={{ objectFit: 'cover' }}
              />
            ) : (
              <i className="bi bi-person-fill" />
            )}
          </span>
          <span className="principal-name">{name || 'Principal'}</span>
          <span className="principal-role">{role}</span>
        </div>

        <div className="gold-flourish principal-flourish">
          <i className="bi bi-diamond-fill" />
        </div>

        {quote && (
          <blockquote className="principal-quote">
            <i className="bi bi-quote" />
            {quote}
          </blockquote>
        )}

        <Link href="/about/principal-message" className="principal-link">
          {linkLabel || 'Read Full Message'}
          <i className="bi bi-arrow-right" />
        </Link>
      </div>
    </section>
  );
}
