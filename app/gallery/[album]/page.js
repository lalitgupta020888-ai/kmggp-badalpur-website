"use client";

import React, { use, useState } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import Lightbox from '@/components/Lightbox';
import VideoModal from '@/components/VideoModal';
import { getAlbum, GALLERY_ALBUMS } from '@/lib/gallery';

export default function AlbumPage({ params }) {
  const { album: slug } = use(params);
  const album = getAlbum(slug);

  // null while the viewer is closed; otherwise the photograph on show.
  const [openAt, setOpenAt] = useState(null);
  const [filmOpen, setFilmOpen] = useState(false);

  if (!album) notFound();

  // Each photograph carries the album title, which the viewer shows as its tag.
  const photos = album.photos.map((photo) => ({ ...photo, tag: album.title }));
  const others = GALLERY_ALBUMS.filter((other) => other.slug !== album.slug);

  return (
    <>
      <PageHeader
        icon={album.icon}
        eyebrow="Photo Gallery"
        title={album.title}
        subtitle={album.description}
        crumbs={[{ label: 'Gallery', href: '/gallery' }, { label: album.title }]}
      />

      <section className="section" style={{ background: 'var(--white)' }}>
        <Container>
          <div className="album-bar">
            <Link href="/gallery" className="album-back">
              <i className="bi bi-arrow-left" />
              All Albums
            </Link>
            <span className="d-flex flex-wrap gap-2">
              {album.video && (
                <span className="status-pill is-meta">
                  <i className="bi bi-camera-reels-fill me-2" />1 Film
                </span>
              )}
              <span className="status-pill is-meta">
                <i className="bi bi-images me-2" />
                {photos.length} {photos.length === 1 ? 'Photograph' : 'Photographs'}
              </span>
            </span>
          </div>

          <Row className="g-4 mt-1">
            {/* The film sits in the grid as one more tile, the same size as the
                photographs — its poster with a play badge over it. */}
            {album.video && (
              <Col lg={4} md={6}>
                <figure
                  className="gallery-tile is-clickable is-film m-0"
                  role="button"
                  tabIndex={0}
                  aria-label={`Play ${album.video.caption}`}
                  onClick={() => setFilmOpen(true)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setFilmOpen(true);
                    }
                  }}
                >
                  <Image
                    src={album.video.poster}
                    alt={album.video.caption}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <span className="film-sheen" aria-hidden="true" />
                  <span className="film-badge" aria-hidden="true">
                    <i className="bi bi-play-fill" />
                  </span>
                  <span className="film-ribbon" aria-hidden="true">
                    <i className="bi bi-camera-reels-fill" />
                    Film
                  </span>
                  <figcaption className="gallery-veil">
                    <div className="gold-rule-thin" />
                    <span>
                      <i className="bi bi-camera-reels-fill me-2" />
                      {album.video.caption}
                    </span>
                    <span className="small mt-1" style={{ color: 'var(--gold-300)' }}>
                      Watch the film
                    </span>
                  </figcaption>
                </figure>
              </Col>
            )}

            {photos.map((photo, index) => (
              <Col lg={4} md={6} key={`${photo.src}-${index}`}>
                <figure
                  className="gallery-tile is-clickable m-0"
                  role="button"
                  tabIndex={0}
                  aria-label={`View ${photo.caption} full size`}
                  onClick={() => setOpenAt(index)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setOpenAt(index);
                    }
                  }}
                >
                  <Image
                    src={photo.src}
                    alt={photo.caption}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                  <figcaption className="gallery-veil">
                    <div className="gold-rule-thin" />
                    <span>
                      <i className="bi bi-camera-fill me-2" />
                      {photo.caption}
                    </span>
                    <span className="small mt-1" style={{ color: 'var(--gold-300)' }}>
                      {album.title}
                    </span>
                  </figcaption>
                  <span className="gallery-zoom" aria-hidden="true">
                    <i className="bi bi-arrows-fullscreen" />
                  </span>
                </figure>
              </Col>
            ))}
          </Row>

          {others.length > 0 && (
            <>
              <div className="gold-rule-thin my-5" />
              <h5 className="fw-bold mb-3">
                <i className="bi bi-collection text-gold me-2" />
                Other Albums
              </h5>
              <div className="d-flex flex-wrap gap-2">
                {others.map((other) => (
                  <Link key={other.slug} href={`/gallery/${other.slug}`} className="album-chip">
                    <i className={`bi ${other.icon}`} />
                    {other.title}
                    <span className="album-chip-count">{other.photos.length}</span>
                  </Link>
                ))}
              </div>
            </>
          )}
        </Container>
      </section>

      <Lightbox
        images={photos}
        index={openAt}
        onClose={() => setOpenAt(null)}
        onIndexChange={setOpenAt}
      />

      {album.video && (
        <VideoModal
          video={album.video}
          icon={album.icon}
          open={filmOpen}
          onClose={() => setFilmOpen(false)}
        />
      )}
    </>
  );
}
