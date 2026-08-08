"use client";

import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import SectionHead from '@/components/SectionHead';
import { GALLERY_ALBUMS, GALLERY_IMAGES, albumCover } from '@/lib/gallery';

export default function GalleryPage() {
  return (
    <>
      <PageHeader
        icon="bi-images"
        eyebrow="Campus Moments"
        title="Photo Gallery"
        subtitle="Glimpses of academic life, events and facilities at Km. Mayawati Government Girls Polytechnic, Badalpur."
        crumbs={[{ label: 'Gallery' }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <SectionHead
            eyebrow="Our Campus in Pictures"
            icon="bi-camera-fill"
            title="Albums"
            subtitle="Open an album to see every photograph inside it."
          />

          <Row className="g-4">
            {GALLERY_ALBUMS.map((album) => (
              <Col lg={4} md={6} key={album.slug}>
                {/* The sheets peeking out behind the cover are what make this
                    read as a folder of photographs, not a single picture. */}
                <Link href={`/gallery/${album.slug}`} className="album-card">
                  <span className="album-stack" aria-hidden="true" />
                  <span className="album-cover">
                    <Image
                      src={albumCover(album)}
                      alt={album.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: 'cover' }}
                    />
                    <span className="album-veil" />
                    <span className="album-count">
                      <i className="bi bi-images" />
                      {album.photos.length} {album.photos.length === 1 ? 'Photo' : 'Photos'}
                    </span>
                    <span className="album-open">
                      <i className="bi bi-folder2-open" />
                      Open Album
                    </span>
                  </span>

                  <span className="album-body">
                    <span className="album-title">
                      <i className={`bi ${album.icon}`} />
                      {album.title}
                    </span>
                    <span className="album-text">{album.description}</span>
                  </span>
                </Link>
              </Col>
            ))}
          </Row>

          <div className="callout mt-5">
            <i className="bi bi-info-circle-fill" />
            <p>
              {GALLERY_IMAGES.length} photographs across {GALLERY_ALBUMS.length} albums. More from
              annual functions, technical festivals and industrial visits will be added through the
              academic session.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
