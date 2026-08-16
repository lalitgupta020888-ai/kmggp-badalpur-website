"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Modal } from 'react-bootstrap';

import { uploadFiles } from '@/app/admin/actions';

const KIND_LABEL = {
  image: 'photograph',
  document: 'document',
  video: 'film',
};

const ACCEPT = {
  image: 'image/jpeg,image/png,image/webp,image/gif',
  document: 'application/pdf',
  video: 'video/mp4,video/webm',
};

/**
 * Choose a file for a content field — either one already uploaded, or a new one
 * uploaded on the spot.
 *
 * Uploading from inside the picker matters: the alternative is sending the
 * admin to the media library, losing the half-filled form they were editing.
 *
 * In `multiple` mode the caller is filling an album, so tiles toggle a
 * selection and `onPick` receives the whole set at once — adding thirty
 * photographs one dialog at a time would be the single most tedious thing in
 * the panel.
 */
export default function MediaPicker({ open, kind = 'image', multiple = false, onPick, onClose }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const [chosen, setChosen] = useState([]);
  const inputRef = useRef(null);

  const chosenSet = useMemo(() => new Set(chosen), [chosen]);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/admin/media?kind=${encodeURIComponent(kind)}`);
      if (!response.ok) throw new Error('Could not load the media library.');
      const data = await response.json();
      setItems(data.items || []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }, [kind]);

  useEffect(() => {
    if (open) {
      setChosen([]);
      load();
    }
  }, [open, load]);

  const upload = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    setBusy(true);
    setError('');

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    const result = await uploadFiles(formData);
    setBusy(false);

    if (!result.ok) {
      setError(result.message);
      return;
    }

    // Hand back the upload straight away — picking a file the admin has just
    // chosen is what they were doing, so making them click it again in the grid
    // would be a pointless extra step.
    const uploaded = result.items || [];
    if (uploaded.length > 0) {
      onPick(multiple ? uploaded : uploaded[0]);
      onClose();
    } else {
      load();
    }
  };

  const confirmSelection = () => {
    const picked = items.filter((item) => chosenSet.has(item.id));
    if (picked.length === 0) return;
    onPick(picked);
    onClose();
  };

  return (
    <Modal show={open} onHide={onClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: '1.05rem' }}>
          <i className="bi bi-collection-fill me-2" style={{ color: 'var(--gold-600)' }} />
          Choose a {KIND_LABEL[kind] || 'file'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        {error && (
          <div className="admin-flash error">
            <i className="bi bi-exclamation-triangle-fill" />
            <span>{error}</span>
          </div>
        )}

        <div
          className={`admin-dropzone mb-4${dragging ? ' dragging' : ''}`}
          onClick={() => !busy && inputRef.current?.click()}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            if (!busy) upload(event.dataTransfer.files);
          }}
          role="button"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click();
          }}
        >
          <input
            ref={inputRef}
            type="file"
            hidden
            multiple
            accept={ACCEPT[kind] || undefined}
            onChange={(event) => {
              upload(event.target.files);
              event.target.value = '';
            }}
          />
          <i className={`bi ${busy ? 'bi-hourglass-split' : 'bi-cloud-arrow-up-fill'}`} />
          <strong>{busy ? 'Uploading…' : 'Upload a new file'}</strong>
          <span>Drag a file here, or click to browse</span>
        </div>

        {loading ? (
          <div className="admin-empty">
            <i className="bi bi-hourglass-split" />
            <strong>Loading…</strong>
          </div>
        ) : items.length === 0 ? (
          <div className="admin-empty">
            <i className="bi bi-images" />
            <strong>Nothing uploaded yet</strong>
            Upload your first file using the box above.
          </div>
        ) : (
          <div className="admin-media-grid">
            {items.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`admin-media-tile text-start border-0 p-0${
                  chosenSet.has(item.id) ? ' selected' : ''
                }`}
                onClick={() => {
                  if (multiple) {
                    setChosen((current) =>
                      current.includes(item.id)
                        ? current.filter((id) => id !== item.id)
                        : [...current, item.id],
                    );
                  } else {
                    onPick(item);
                    onClose();
                  }
                }}
              >
                <div className="admin-media-frame">
                  {item.kind === 'image' ? (
                    // A plain img, not next/image: these are admin thumbnails on
                    // a private page, so the optimiser would add work and cost
                    // for no visitor-facing benefit.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt={item.alt || item.name} loading="lazy" />
                  ) : (
                    <i
                      className={`bi ${
                        item.kind === 'video' ? 'bi-film' : 'bi-file-earmark-pdf'
                      } placeholder`}
                    />
                  )}
                </div>
                <div className="admin-media-info">
                  <div className="admin-media-name">{item.name}</div>
                  <div className="admin-media-meta">
                    {new Date(item.uploadedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </Modal.Body>

      {multiple && (
        <Modal.Footer>
          <span className="me-auto small text-muted">
            {chosen.length === 0
              ? 'Tap photographs to select them'
              : `${chosen.length} selected`}
          </span>
          <button type="button" className="admin-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="admin-btn admin-btn-gold"
            onClick={confirmSelection}
            disabled={chosen.length === 0}
          >
            <i className="bi bi-plus-lg" />
            Add {chosen.length || ''} photograph{chosen.length === 1 ? '' : 's'}
          </button>
        </Modal.Footer>
      )}
    </Modal>
  );
}
