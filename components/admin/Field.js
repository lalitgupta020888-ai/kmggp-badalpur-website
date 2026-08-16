"use client";

import React, { useId, useState } from 'react';

/**
 * One form control, chosen by its schema `type`.
 *
 * `onBrowse(kind, apply)` opens the media picker; the parent owns the dialog and
 * calls `apply(url)` with what was chosen. Passing it down this way is what lets
 * a nested list — a dropdown's links, a programme's semesters — carry media
 * fields without every level needing a picker of its own.
 */

/** Icons offered as suggestions; any valid `bi-*` name is still accepted. */
export const ICON_SUGGESTIONS = [
  'bi-megaphone-fill', 'bi-mortarboard-fill', 'bi-calendar-check-fill', 'bi-briefcase-fill',
  'bi-trophy-fill', 'bi-cash-coin', 'bi-file-earmark-text-fill', 'bi-file-earmark-pdf-fill',
  'bi-list-check', 'bi-journal-richtext', 'bi-images', 'bi-buildings-fill', 'bi-flag-fill',
  'bi-cpu-fill', 'bi-book-half', 'bi-people-fill', 'bi-calendar3', 'bi-calendar-event',
  'bi-patch-check-fill', 'bi-bell-fill', 'bi-stars', 'bi-shop', 'bi-rulers', 'bi-globe2',
  'bi-pc-display', 'bi-hdd-network-fill', 'bi-award-fill', 'bi-person-video2', 'bi-clock-history',
  'bi-bullseye', 'bi-collection', 'bi-signpost-split', 'bi-cash-stack', 'bi-house-heart-fill',
  'bi-balloon-fill', 'bi-shield-check', 'bi-person-lock', 'bi-send-fill', 'bi-graph-up-arrow',
];

const swatchStyle = {
  width: 38,
  height: 38,
  placeItems: 'center',
  borderRadius: 'var(--radius-sm)',
  background: 'var(--navy-800)',
  color: 'var(--gold-300)',
  flex: '0 0 auto',
};

export default function Field({ field, value, onChange, onBrowse }) {
  const id = useId();
  const wrapperStyle = field.full ? { gridColumn: '1 / -1' } : undefined;

  if (field.type === 'items') {
    return (
      <div className="admin-field" style={{ gridColumn: '1 / -1' }}>
        <label>{field.label}</label>
        <NestedList field={field} value={value} onChange={onChange} onBrowse={onBrowse} />
        {field.hint && <div className="hint">{field.hint}</div>}
      </div>
    );
  }

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
        <>
          <input
            id={id}
            className="admin-input"
            list={`${id}-options`}
            value={value || ''}
            placeholder={field.placeholder}
            onChange={(event) => onChange(event.target.value)}
          />
          <datalist id={`${id}-options`}>
            {(field.options || []).map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </>
      )}

      {field.type === 'icon' && (
        <div className="d-flex gap-2 align-items-center">
          <span className="d-grid" style={swatchStyle}>
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
        <div className="d-flex gap-2 align-items-center flex-wrap">
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
            style={{ minWidth: 160, flex: '1 1 160px' }}
            value={value || ''}
            placeholder="/media/… or /images/…"
            onChange={(event) => onChange(event.target.value)}
          />
          <button
            type="button"
            className="admin-btn flex-shrink-0"
            onClick={() => onBrowse(field.kind || 'image', onChange)}
          >
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

      {(!field.type || field.type === 'text' || field.type === 'link' || field.type === 'number') && (
        <input
          id={id}
          className="admin-input"
          type={field.type === 'number' ? 'number' : 'text'}
          value={value ?? ''}
          placeholder={field.placeholder}
          onChange={(event) => onChange(event.target.value)}
        />
      )}

      {field.hint && <div className="hint">{field.hint}</div>}
    </div>
  );
}

/* ------------------------------ Nested list ----------------------------- */

let nestedSequence = 0;
const nextNestedKey = () => `nested-${(nestedSequence += 1)}`;

/**
 * A list inside a record — a menu's dropdown links, a programme's semesters.
 *
 * Rows are kept flat and always expanded rather than collapsible: a nested list
 * is short by nature, and a second layer of accordions inside an accordion is
 * more to fight than to read.
 */
function NestedList({ field, value, onChange, onBrowse }) {
  const rows = Array.isArray(value) ? value : [];
  // Stable React keys for rows that have no id of their own yet.
  const [keys, setKeys] = useState(() => rows.map(() => nextNestedKey()));

  const commit = (nextRows, nextKeys) => {
    setKeys(nextKeys);
    onChange(nextRows);
  };

  const blank = () => Object.fromEntries(field.fields.map((sub) => [sub.name, '']));

  const add = () => commit([...rows, blank()], [...keys, nextNestedKey()]);

  const remove = (index) =>
    commit(
      rows.filter((_, i) => i !== index),
      keys.filter((_, i) => i !== index),
    );

  const move = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const nextRows = [...rows];
    const nextKeys = [...keys];
    [nextRows[index], nextRows[target]] = [nextRows[target], nextRows[index]];
    [nextKeys[index], nextKeys[target]] = [nextKeys[target], nextKeys[index]];
    commit(nextRows, nextKeys);
  };

  const patch = (index, name, fieldValue) =>
    onChange(rows.map((row, i) => (i === index ? { ...row, [name]: fieldValue } : row)));

  return (
    <div
      style={{
        border: '1px solid var(--hairline)',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--white)',
        padding: rows.length ? 12 : 0,
      }}
    >
      {rows.length === 0 ? (
        <div className="admin-empty" style={{ padding: '22px 16px' }}>
          <strong>Nothing here yet</strong>
        </div>
      ) : (
        rows.map((row, index) => (
          <div
            key={row.id || keys[index] || index}
            style={{
              padding: '12px 12px 0',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--paper)',
              border: '1px solid var(--hairline)',
              marginBottom: 10,
            }}
          >
            <div className="d-flex align-items-center gap-2 mb-2">
              <span className="admin-badge">{index + 1}</span>
              <div className="ms-auto d-flex gap-1">
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
                  className="admin-btn admin-btn-icon admin-btn-danger"
                  onClick={() => remove(index)}
                  aria-label="Remove"
                >
                  <i className="bi bi-trash3" />
                </button>
              </div>
            </div>

            <div className="admin-grid-2">
              {field.fields.map((sub) => (
                <Field
                  key={sub.name}
                  field={sub}
                  value={row[sub.name]}
                  onChange={(fieldValue) => patch(index, sub.name, fieldValue)}
                  onBrowse={onBrowse}
                />
              ))}
            </div>
          </div>
        ))
      )}

      <button type="button" className="admin-btn" onClick={add}>
        <i className="bi bi-plus-lg" />
        {field.addLabel || 'Add'}
      </button>
    </div>
  );
}
