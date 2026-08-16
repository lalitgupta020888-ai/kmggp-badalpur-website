"use client";

import React, { useId, useState, useTransition } from 'react';

import Flash from '@/components/admin/Flash';
import MediaPicker from '@/components/admin/MediaPicker';
import { restoreDefaults } from '@/app/admin/actions';

/**
 * The editor behind most sections of the panel.
 *
 * A section describes its records as a list of fields and this renders the
 * whole thing — add, reorder, delete, and one Save. Adding a new editable part
 * of the site is therefore a matter of describing its fields, not writing
 * another form by hand.
 *
 * The entire list is held in local state and saved in one go. For lists of this
 * size that is what makes reordering and "add three notices, then save" feel
 * immediate, and it keeps the stored file consistent — one write, not a dozen
 * interleaved ones.
 */

/** Icons offered as suggestions; any valid `bi-*` name is still accepted. */
const ICON_SUGGESTIONS = [
  'bi-megaphone-fill',
  'bi-mortarboard-fill',
  'bi-calendar-check-fill',
  'bi-briefcase-fill',
  'bi-trophy-fill',
  'bi-cash-coin',
  'bi-file-earmark-text-fill',
  'bi-file-earmark-pdf-fill',
  'bi-list-check',
  'bi-journal-richtext',
  'bi-images',
  'bi-buildings-fill',
  'bi-flag-fill',
  'bi-cpu-fill',
  'bi-book-half',
  'bi-people-fill',
  'bi-calendar3',
  'bi-calendar-event',
  'bi-patch-check-fill',
  'bi-bell-fill',
];

let sequence = 0;
const nextKey = () => `row-${(sequence += 1)}`;

export default function ListEditor({
  fields,
  initial,
  onSave,
  collection,
  blank,
  summary,
  addLabel = 'Add item',
  emptyTitle = 'Nothing here yet',
  emptyHint = 'Add your first entry to get started.',
}) {
  const [rows, setRows] = useState(() => initial.map((item) => ({ key: nextKey(), item })));
  const [open, setOpen] = useState(() => new Set());
  const [result, setResult] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();
  const [picker, setPicker] = useState(null);
  const listId = useId();

  const change = (updater) => {
    setRows(updater);
    setDirty(true);
    setResult(null);
  };

  const setField = (key, name, value) =>
    change((current) =>
      current.map((row) => (row.key === key ? { ...row, item: { ...row.item, [name]: value } } : row)),
    );

  const add = () => {
    const key = nextKey();
    change((current) => [...current, { key, item: blank() }]);
    setOpen((current) => new Set(current).add(key));
  };

  const remove = (key) => change((current) => current.filter((row) => row.key !== key));

  const move = (index, direction) =>
    change((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });

  const toggle = (key) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  const save = () => {
    startTransition(async () => {
      const response = await onSave(rows.map((row) => row.item));
      setResult(response);
      if (response.ok) setDirty(false);
    });
  };

  const restore = () => {
    if (!window.confirm('Discard your saved content here and go back to what the site shipped with?'))
      return;

    startTransition(async () => {
      const response = await restoreDefaults(collection);
      setResult(response);
      // The restored list comes from the server, so reload rather than guess.
      if (response.ok) window.location.reload();
    });
  };

  return (
    <>
      <Flash result={result} />

      <div className="admin-card">
        <div className="admin-card-head">
          <i className="bi bi-list-ul head-icon" />
          <div>
            <h2>{rows.length} entr{rows.length === 1 ? 'y' : 'ies'}</h2>
            <p>Drag order with the arrows — the site shows them top to bottom</p>
          </div>
          <div className="head-actions">
            <button type="button" className="admin-btn" onClick={add} disabled={pending}>
              <i className="bi bi-plus-lg" />
              {addLabel}
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
          </div>
        </div>

        <div className="admin-card-body flush">
          {rows.length === 0 ? (
            <div className="admin-empty">
              <i className="bi bi-inbox" />
              <strong>{emptyTitle}</strong>
              {emptyHint}
            </div>
          ) : (
            rows.map((row, index) => {
              const expanded = open.has(row.key);
              const info = summary(row.item);

              return (
                <div key={row.key}>
                  <div className="admin-row">
                    <span className="admin-row-handle" aria-hidden="true">
                      <i className="bi bi-grip-vertical" />
                    </span>

                    {info.thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img className="admin-row-thumb" src={info.thumb} alt="" />
                    ) : (
                      <span
                        className="admin-row-thumb d-grid"
                        style={{ placeItems: 'center', color: 'var(--ink-faint)' }}
                      >
                        <i className={`bi ${info.icon || 'bi-dot'}`} />
                      </span>
                    )}

                    <button
                      type="button"
                      className="admin-row-main text-start border-0 bg-transparent p-0"
                      onClick={() => toggle(row.key)}
                      aria-expanded={expanded}
                      aria-controls={`${listId}-${row.key}`}
                    >
                      <div className="admin-row-title">
                        {info.title || <span className="text-muted fst-italic">Untitled</span>}
                        {info.badge && <span className="admin-badge new ms-2">{info.badge}</span>}
                      </div>
                      {info.meta && <div className="admin-row-meta">{info.meta}</div>}
                    </button>

                    <div className="admin-row-actions">
                      <button
                        type="button"
                        className="admin-btn admin-btn-icon"
                        onClick={() => move(index, -1)}
                        disabled={index === 0}
                        aria-label="Move up"
                      >
                        <i className="bi bi-arrow-up" />
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-icon"
                        onClick={() => move(index, 1)}
                        disabled={index === rows.length - 1}
                        aria-label="Move down"
                      >
                        <i className="bi bi-arrow-down" />
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-icon"
                        onClick={() => toggle(row.key)}
                        aria-label={expanded ? 'Collapse' : 'Edit'}
                      >
                        <i className={`bi ${expanded ? 'bi-chevron-up' : 'bi-pencil'}`} />
                      </button>
                      <button
                        type="button"
                        className="admin-btn admin-btn-icon admin-btn-danger"
                        onClick={() => remove(row.key)}
                        aria-label="Delete"
                      >
                        <i className="bi bi-trash3" />
                      </button>
                    </div>
                  </div>

                  {expanded && (
                    <div
                      id={`${listId}-${row.key}`}
                      style={{
                        padding: '18px 20px 6px 20px',
                        background: 'var(--paper)',
                        borderBottom: '1px solid var(--hairline)',
                      }}
                    >
                      <div className="admin-grid-2">
                        {fields.map((field) => (
                          <Field
                            key={field.name}
                            field={field}
                            value={row.item[field.name]}
                            onChange={(value) => setField(row.key, field.name, value)}
                            onBrowse={() =>
                              setPicker({ rowKey: row.key, name: field.name, kind: field.kind || 'image' })
                            }
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="d-flex flex-wrap gap-2 align-items-center mt-3">
        <button type="button" className="admin-btn" onClick={add} disabled={pending}>
          <i className="bi bi-plus-lg" />
          {addLabel}
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
        {collection && (
          <button
            type="button"
            className="admin-btn admin-btn-danger ms-auto"
            onClick={restore}
            disabled={pending}
          >
            <i className="bi bi-arrow-counterclockwise" />
            Restore original content
          </button>
        )}
      </div>

      <datalist id="admin-icon-suggestions">
        {ICON_SUGGESTIONS.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>

      <MediaPicker
        open={Boolean(picker)}
        kind={picker?.kind || 'image'}
        onPick={(media) => setField(picker.rowKey, picker.name, media.url)}
        onClose={() => setPicker(null)}
      />
    </>
  );
}

/* ------------------------------ Field types ----------------------------- */

function Field({ field, value, onChange, onBrowse }) {
  const id = useId();
  const wrapperStyle = field.full ? { gridColumn: '1 / -1' } : undefined;

  if (field.type === 'check') {
    return (
      <div className="admin-field" style={wrapperStyle}>
        <label className="admin-check" htmlFor={id}>
          <input
            id={id}
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onChange(event.target.checked)}
          />
          {field.label}
        </label>
        {field.hint && <div className="hint">{field.hint}</div>}
      </div>
    );
  }

  return (
    <div className="admin-field" style={wrapperStyle}>
      <label htmlFor={id}>{field.label}</label>

      {field.type === 'textarea' && (
        <textarea
          id={id}
          className="admin-textarea"
          value={value || ''}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      {field.type === 'select' && (
        <input
          id={id}
          className="admin-input"
          list={`${id}-options`}
          value={value || ''}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}
      {field.type === 'select' && (
        <datalist id={`${id}-options`}>
          {(field.options || []).map((option) => (
            <option key={option} value={option} />
          ))}
        </datalist>
      )}

      {field.type === 'icon' && (
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
            <i className={`bi ${value || 'bi-dot'}`} />
          </span>
          <input
            id={id}
            className="admin-input"
            list="admin-icon-suggestions"
            value={value || ''}
            placeholder="bi-megaphone-fill"
            onChange={(event) => onChange(event.target.value)}
          />
        </div>
      )}

      {field.type === 'media' && (
        <div className="d-flex gap-2 align-items-center">
          {field.kind !== 'document' && value && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt=""
              style={{
                width: 54,
                height: 40,
                objectFit: 'cover',
                borderRadius: 8,
                border: '1px solid var(--hairline)',
                flex: '0 0 auto',
              }}
            />
          )}
          <input
            id={id}
            className="admin-input"
            value={value || ''}
            placeholder="/media/… or /images/…"
            onChange={(event) => onChange(event.target.value)}
          />
          <button type="button" className="admin-btn flex-shrink-0" onClick={onBrowse}>
            <i className="bi bi-folder2-open" />
            Browse
          </button>
          {value && (
            <button
              type="button"
              className="admin-btn admin-btn-icon admin-btn-danger flex-shrink-0"
              onClick={() => onChange('')}
              aria-label="Clear"
            >
              <i className="bi bi-x-lg" />
            </button>
          )}
        </div>
      )}

      {(!field.type || field.type === 'text' || field.type === 'link') && (
        <input
          id={id}
          className="admin-input"
          type="text"
          value={value || ''}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      {field.hint && <div className="hint">{field.hint}</div>}
    </div>
  );
}
