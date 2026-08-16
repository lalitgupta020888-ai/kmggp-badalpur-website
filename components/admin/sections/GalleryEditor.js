"use client";

import React, { useState, useTransition } from 'react';

import Flash from '@/components/admin/Flash';
import MediaPicker from '@/components/admin/MediaPicker';
import { restoreDefaults, saveAlbums } from '@/app/admin/actions';
import { COLLECTIONS } from '@/lib/admin-collections';

/**
 * The gallery is the one section the generic list editor cannot express: an
 * album holds a list of photographs of its own, and optionally a film. So it
 * gets a purpose-built editor, with the photographs laid out as a grid of
 * thumbnails rather than rows — you judge a gallery by looking at it.
 */

let sequence = 0;
const nextKey = () => `album-${(sequence += 1)}`;

const slugify = (value) =>
  String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);

export default function GalleryEditor({ initial }) {
  const [albums, setAlbums] = useState(() => initial.map((album) => ({ key: nextKey(), album })));
  const [open, setOpen] = useState(() => new Set());
  const [result, setResult] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();
  const [picker, setPicker] = useState(null);

  const change = (updater) => {
    setAlbums(updater);
    setDirty(true);
    setResult(null);
  };

  const patch = (key, changes) =>
    change((current) =>
      current.map((row) => (row.key === key ? { ...row, album: { ...row.album, ...changes } } : row)),
    );

  const addAlbum = () => {
    const key = nextKey();
    change((current) => [
      ...current,
      { key, album: { slug: '', title: '', icon: 'bi-images', description: '', photos: [] } },
    ]);
    setOpen((current) => new Set(current).add(key));
  };

  const moveAlbum = (index, direction) =>
    change((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const addPhotos = (key, media) => {
    const list = Array.isArray(media) ? media : [media];
    change((current) =>
      current.map((row) =>
        row.key === key
          ? {
              ...row,
              album: {
                ...row.album,
                photos: [
                  ...(row.album.photos || []),
                  ...list.map((item) => ({ src: item.url, caption: item.alt || item.name || '' })),
                ],
              },
            }
          : row,
      ),
    );
  };

  const patchPhoto = (key, index, changes) =>
    change((current) =>
      current.map((row) =>
        row.key === key
          ? {
              ...row,
              album: {
                ...row.album,
                photos: row.album.photos.map((photo, i) =>
                  i === index ? { ...photo, ...changes } : photo,
                ),
              },
            }
          : row,
      ),
    );

  const removePhoto = (key, index) =>
    change((current) =>
      current.map((row) =>
        row.key === key
          ? { ...row, album: { ...row.album, photos: row.album.photos.filter((_, i) => i !== index) } }
          : row,
      ),
    );

  const movePhoto = (key, index, direction) =>
    change((current) =>
      current.map((row) => {
        if (row.key !== key) return row;
        const photos = [...row.album.photos];
        const target = index + direction;
        if (target < 0 || target >= photos.length) return row;
        [photos[index], photos[target]] = [photos[target], photos[index]];
        return { ...row, album: { ...row.album, photos } };
      }),
    );

  const save = () => {
    startTransition(async () => {
      const response = await saveAlbums(
        albums.map(({ album }) => ({ ...album, slug: album.slug || slugify(album.title) })),
      );
      setResult(response);
      if (response.ok) setDirty(false);
    });
  };

  const restore = () => {
    if (!window.confirm('Discard your saved albums and go back to what the site shipped with?')) return;
    startTransition(async () => {
      const response = await restoreDefaults(COLLECTIONS.albums);
      setResult(response);
      if (response.ok) window.location.reload();
    });
  };

  return (
    <>
      <Flash result={result} />

      <div className="d-flex flex-wrap gap-2 align-items-center mb-3">
        <button type="button" className="admin-btn" onClick={addAlbum} disabled={pending}>
          <i className="bi bi-folder-plus" />
          Add album
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-gold"
          onClick={save}
          disabled={pending || !dirty}
        >
          <i className={`bi ${pending ? 'bi-hourglass-split' : 'bi-check-lg'}`} />
          {pending ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
        </button>
        <button
          type="button"
          className="admin-btn admin-btn-danger ms-auto"
          onClick={restore}
          disabled={pending}
        >
          <i className="bi bi-arrow-counterclockwise" />
          Restore original albums
        </button>
      </div>

      {albums.length === 0 && (
        <div className="admin-card">
          <div className="admin-empty">
            <i className="bi bi-images" />
            <strong>No albums yet</strong>
            Add an album, then upload photographs into it.
          </div>
        </div>
      )}

      {albums.map(({ key, album }, index) => {
        const expanded = open.has(key);
        const photos = album.photos || [];

        return (
          <div className="admin-card" key={key}>
            <div className="admin-card-head">
              <i className={`bi ${album.icon || 'bi-images'} head-icon`} />
              <div className="min-w-0">
                <h2>{album.title || 'Untitled album'}</h2>
                <p>
                  /gallery/{album.slug || slugify(album.title) || '…'} · {photos.length} photograph
                  {photos.length === 1 ? '' : 's'}
                  {album.video?.src ? ' · has a film' : ''}
                </p>
              </div>
              <div className="head-actions">
                <button
                  type="button"
                  className="admin-btn admin-btn-icon"
                  onClick={() => moveAlbum(index, -1)}
                  disabled={index === 0}
                  aria-label="Move album up"
                >
                  <i className="bi bi-arrow-up" />
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-icon"
                  onClick={() => moveAlbum(index, 1)}
                  disabled={index === albums.length - 1}
                  aria-label="Move album down"
                >
                  <i className="bi bi-arrow-down" />
                </button>
                <button
                  type="button"
                  className="admin-btn"
                  onClick={() =>
                    setOpen((current) => {
                      const next = new Set(current);
                      if (next.has(key)) next.delete(key);
                      else next.add(key);
                      return next;
                    })
                  }
                >
                  <i className={`bi ${expanded ? 'bi-chevron-up' : 'bi-pencil'}`} />
                  {expanded ? 'Close' : 'Edit'}
                </button>
                <button
                  type="button"
                  className="admin-btn admin-btn-icon admin-btn-danger"
                  onClick={() => {
                    if (window.confirm(`Delete the album “${album.title || 'Untitled'}”?`)) {
                      change((current) => current.filter((row) => row.key !== key));
                    }
                  }}
                  aria-label="Delete album"
                >
                  <i className="bi bi-trash3" />
                </button>
              </div>
            </div>

            {expanded && (
              <div className="admin-card-body">
                <div className="admin-grid-2">
                  <div className="admin-field">
                    <label>Album title</label>
                    <input
                      className="admin-input"
                      value={album.title || ''}
                      placeholder="Annual Sports Day"
                      onChange={(event) => patch(key, { title: event.target.value })}
                    />
                  </div>

                  <div className="admin-field">
                    <label>Web address</label>
                    <input
                      className="admin-input"
                      value={album.slug || ''}
                      placeholder={slugify(album.title) || 'annual-sports-day'}
                      onChange={(event) => patch(key, { slug: event.target.value })}
                    />
                    <div className="hint">
                      Leave blank to build it from the title. Changing it breaks any link already
                      shared.
                    </div>
                  </div>

                  <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                    <label>Description</label>
                    <textarea
                      className="admin-textarea"
                      value={album.description || ''}
                      placeholder="What this album shows, in a sentence or two."
                      onChange={(event) => patch(key, { description: event.target.value })}
                    />
                  </div>

                  <div className="admin-field">
                    <label>Icon</label>
                    <div className="d-flex gap-2 align-items-center">
                      <span
                        className="d-grid flex-shrink-0"
                        style={{
                          width: 38,
                          height: 38,
                          placeItems: 'center',
                          borderRadius: 'var(--radius-sm)',
                          background: 'var(--navy-800)',
                          color: 'var(--gold-300)',
                        }}
                      >
                        <i className={`bi ${album.icon || 'bi-images'}`} />
                      </span>
                      <input
                        className="admin-input"
                        list="admin-icon-suggestions"
                        value={album.icon || ''}
                        placeholder="bi-images"
                        onChange={(event) => patch(key, { icon: event.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* ------------------------------ Film ------------------------------ */}

                <div
                  style={{
                    marginTop: 8,
                    padding: 16,
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--paper)',
                    border: '1px solid var(--hairline)',
                  }}
                >
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <i className="bi bi-film" style={{ color: 'var(--gold-600)' }} />
                    <strong style={{ fontSize: '0.88rem' }}>Film (optional)</strong>
                    <span className="admin-badge ms-1">Plays as the site&apos;s welcome video</span>
                  </div>

                  <div className="admin-grid-2">
                    <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
                      <label>Video file</label>
                      <div className="d-flex gap-2">
                        <input
                          className="admin-input"
                          value={album.video?.src || ''}
                          placeholder="/media/… (MP4 or WebM)"
                          onChange={(event) =>
                            patch(key, { video: { ...album.video, src: event.target.value } })
                          }
                        />
                        <button
                          type="button"
                          className="admin-btn flex-shrink-0"
                          onClick={() => setPicker({ key, target: 'video', kind: 'video' })}
                        >
                          <i className="bi bi-folder2-open" />
                          Browse
                        </button>
                        {album.video?.src && (
                          <button
                            type="button"
                            className="admin-btn admin-btn-icon admin-btn-danger flex-shrink-0"
                            onClick={() => patch(key, { video: null })}
                            aria-label="Remove film"
                          >
                            <i className="bi bi-x-lg" />
                          </button>
                        )}
                      </div>
                      <div className="hint">
                        Only the first album with a film is used for the welcome popup.
                      </div>
                    </div>

                    {album.video?.src && (
                      <>
                        <div className="admin-field">
                          <label>Poster image</label>
                          <div className="d-flex gap-2">
                            <input
                              className="admin-input"
                              value={album.video?.poster || ''}
                              placeholder="/media/…"
                              onChange={(event) =>
                                patch(key, { video: { ...album.video, poster: event.target.value } })
                              }
                            />
                            <button
                              type="button"
                              className="admin-btn flex-shrink-0"
                              onClick={() => setPicker({ key, target: 'poster', kind: 'image' })}
                            >
                              <i className="bi bi-folder2-open" />
                            </button>
                          </div>
                          <div className="hint">The still shown before the film starts.</div>
                        </div>

                        <div className="admin-field">
                          <label>Film caption</label>
                          <input
                            className="admin-input"
                            value={album.video?.caption || ''}
                            placeholder="Independence Day at KMGGP Badalpur"
                            onChange={(event) =>
                              patch(key, { video: { ...album.video, caption: event.target.value } })
                            }
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* --------------------------- Photographs -------------------------- */}

                <div className="d-flex align-items-center gap-2 mt-4 mb-3">
                  <i className="bi bi-images" style={{ color: 'var(--gold-600)' }} />
                  <strong style={{ fontSize: '0.88rem' }}>
                    Photographs ({photos.length})
                  </strong>
                  <button
                    type="button"
                    className="admin-btn admin-btn-primary ms-auto"
                    onClick={() => setPicker({ key, target: 'photos', kind: 'image', multiple: true })}
                  >
                    <i className="bi bi-cloud-arrow-up-fill" />
                    Upload / add photographs
                  </button>
                </div>

                {photos.length === 0 ? (
                  <div className="admin-empty" style={{ padding: '30px 20px' }}>
                    <i className="bi bi-image" />
                    <strong>No photographs in this album</strong>
                    The first photograph you add becomes the album&apos;s cover.
                  </div>
                ) : (
                  <div className="admin-media-grid">
                    {photos.map((photo, photoIndex) => (
                      <div className="admin-media-tile" key={`${photo.src}-${photoIndex}`}>
                        <div className="admin-media-frame">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={photo.src} alt={photo.caption || ''} loading="lazy" />
                        </div>
                        <div className="admin-media-info">
                          {photoIndex === 0 && <span className="admin-badge new mb-1">Cover</span>}
                          <input
                            className="admin-input"
                            style={{ fontSize: '0.78rem', padding: '5px 8px' }}
                            value={photo.caption || ''}
                            placeholder="Caption"
                            onChange={(event) =>
                              patchPhoto(key, photoIndex, { caption: event.target.value })
                            }
                          />
                          <div className="d-flex gap-1 mt-2">
                            <button
                              type="button"
                              className="admin-btn admin-btn-icon"
                              onClick={() => movePhoto(key, photoIndex, -1)}
                              disabled={photoIndex === 0}
                              aria-label="Move left"
                            >
                              <i className="bi bi-arrow-left" />
                            </button>
                            <button
                              type="button"
                              className="admin-btn admin-btn-icon"
                              onClick={() => movePhoto(key, photoIndex, 1)}
                              disabled={photoIndex === photos.length - 1}
                              aria-label="Move right"
                            >
                              <i className="bi bi-arrow-right" />
                            </button>
                            <button
                              type="button"
                              className="admin-btn admin-btn-icon admin-btn-danger ms-auto"
                              onClick={() => removePhoto(key, photoIndex)}
                              aria-label="Remove photograph"
                            >
                              <i className="bi bi-trash3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      <datalist id="admin-icon-suggestions">
        {['bi-images', 'bi-buildings-fill', 'bi-flag-fill', 'bi-cpu-fill', 'bi-book-half', 'bi-trophy-fill'].map(
          (name) => (
            <option key={name} value={name} />
          ),
        )}
      </datalist>

      <MediaPicker
        open={Boolean(picker)}
        kind={picker?.kind || 'image'}
        multiple={Boolean(picker?.multiple)}
        onPick={(media) => {
          if (!picker) return;
          if (picker.target === 'photos') {
            addPhotos(picker.key, media);
            return;
          }

          const row = albums.find((entry) => entry.key === picker.key);
          const video = row?.album.video || {};
          if (picker.target === 'video') {
            patch(picker.key, { video: { ...video, src: media.url } });
          } else if (picker.target === 'poster') {
            patch(picker.key, { video: { ...video, poster: media.url } });
          }
        }}
        onClose={() => setPicker(null)}
      />
    </>
  );
}
