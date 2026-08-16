"use client";

import React, { useRef, useState, useTransition } from 'react';

import Flash from '@/components/admin/Flash';
import { removeMedia, renameMedia, uploadFiles } from '@/app/admin/actions';

const FILTERS = [
  { key: 'all', label: 'Everything', icon: 'bi-collection' },
  { key: 'image', label: 'Photographs', icon: 'bi-image' },
  { key: 'document', label: 'Documents', icon: 'bi-file-earmark-pdf' },
  { key: 'video', label: 'Films', icon: 'bi-film' },
];

function formatSize(bytes) {
  if (bytes >= 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${bytes} B`;
}

export default function MediaLibrary({ initial }) {
  const [items, setItems] = useState(initial);
  const [filter, setFilter] = useState('all');
  const [result, setResult] = useState(null);
  const [editing, setEditing] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef(null);

  const shown = filter === 'all' ? items : items.filter((item) => item.kind === filter);

  const upload = (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));

    startTransition(async () => {
      const response = await uploadFiles(formData);
      setResult(response);
      if (response.ok && response.items) {
        setItems((current) => [...response.items, ...current]);
      }
    });
  };

  const destroy = (item) => {
    if (
      !window.confirm(
        `Delete “${item.name}”?\n\nIf any page still uses this file, that image or link will break.`,
      )
    ) {
      return;
    }

    startTransition(async () => {
      const response = await removeMedia(item.id);
      setResult(response);
      if (response.ok) setItems((current) => current.filter((entry) => entry.id !== item.id));
    });
  };

  const saveDetails = () => {
    const draft = editing;
    startTransition(async () => {
      const response = await renameMedia(draft.id, { name: draft.name, alt: draft.alt });
      setResult(response);
      if (response.ok) {
        setItems((current) =>
          current.map((entry) =>
            entry.id === draft.id ? { ...entry, name: draft.name, alt: draft.alt } : entry,
          ),
        );
        setEditing(null);
      }
    });
  };

  return (
    <>
      <Flash result={result} />

      <div
        className={`admin-dropzone mb-4${dragging ? ' dragging' : ''}`}
        onClick={() => !pending && inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!pending) upload(event.dataTransfer.files);
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
          onChange={(event) => {
            upload(event.target.files);
            event.target.value = '';
          }}
        />
        <i className={`bi ${pending ? 'bi-hourglass-split' : 'bi-cloud-arrow-up-fill'}`} />
        <strong>{pending ? 'Uploading…' : 'Upload files'}</strong>
        <span>
          Drag files here, or click to browse — JPG, PNG, WebP, GIF, PDF, MP4 and WebM
        </span>
      </div>

      <div className="admin-card">
        <div className="admin-card-head">
          <i className="bi bi-collection-fill head-icon" />
          <div>
            <h2>
              {shown.length} file{shown.length === 1 ? '' : 's'}
            </h2>
            <p>Files stay available until you delete them here</p>
          </div>
          <div className="head-actions">
            {FILTERS.map((option) => (
              <button
                key={option.key}
                type="button"
                className={`admin-btn${filter === option.key ? ' admin-btn-primary' : ''}`}
                onClick={() => setFilter(option.key)}
              >
                <i className={`bi ${option.icon}`} />
                <span className="d-none d-md-inline">{option.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="admin-card-body">
          {shown.length === 0 ? (
            <div className="admin-empty">
              <i className="bi bi-images" />
              <strong>Nothing here</strong>
              Upload a file using the box above.
            </div>
          ) : (
            <div className="admin-media-grid">
              {shown.map((item) => (
                <div className="admin-media-tile" key={item.id}>
                  <a href={item.url} target="_blank" rel="noreferrer" className="d-block">
                    <div className="admin-media-frame">
                      {item.kind === 'image' ? (
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
                  </a>

                  <div className="admin-media-info">
                    {editing?.id === item.id ? (
                      <>
                        <input
                          className="admin-input mb-1"
                          style={{ fontSize: '0.78rem', padding: '5px 8px' }}
                          value={editing.name}
                          placeholder="Name"
                          onChange={(event) =>
                            setEditing((current) => ({ ...current, name: event.target.value }))
                          }
                        />
                        <input
                          className="admin-input"
                          style={{ fontSize: '0.78rem', padding: '5px 8px' }}
                          value={editing.alt}
                          placeholder="Description for screen readers"
                          onChange={(event) =>
                            setEditing((current) => ({ ...current, alt: event.target.value }))
                          }
                        />
                        <div className="d-flex gap-1 mt-2">
                          <button
                            type="button"
                            className="admin-btn admin-btn-gold flex-grow-1"
                            onClick={saveDetails}
                            disabled={pending}
                          >
                            <i className="bi bi-check-lg" />
                            Save
                          </button>
                          <button
                            type="button"
                            className="admin-btn"
                            onClick={() => setEditing(null)}
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="admin-media-name">{item.name}</div>
                        <div className="admin-media-meta">
                          {formatSize(item.size)} ·{' '}
                          {new Date(item.uploadedAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </div>
                        <div className="d-flex gap-1 mt-2">
                          <button
                            type="button"
                            className="admin-btn admin-btn-icon"
                            onClick={() =>
                              setEditing({ id: item.id, name: item.name, alt: item.alt || '' })
                            }
                            aria-label="Edit details"
                          >
                            <i className="bi bi-pencil" />
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn-icon"
                            onClick={() => navigator.clipboard?.writeText(item.url)}
                            aria-label="Copy link"
                            title="Copy link"
                          >
                            <i className="bi bi-link-45deg" />
                          </button>
                          <button
                            type="button"
                            className="admin-btn admin-btn-icon admin-btn-danger ms-auto"
                            onClick={() => destroy(item)}
                            aria-label="Delete file"
                          >
                            <i className="bi bi-trash3" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
