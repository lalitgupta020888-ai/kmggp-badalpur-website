"use client";

import React, { useState, useTransition } from 'react';

import Field, { ICON_SUGGESTIONS } from '@/components/admin/Field';
import Flash from '@/components/admin/Flash';
import MediaPicker from '@/components/admin/MediaPicker';
import { restoreDefaults, saveSection } from '@/app/admin/actions';

/**
 * The editor for any section described in `lib/sections/schema.js`.
 *
 * Handles both shapes: a `single` section is one record shown as a plain form,
 * a `list` section is the add/reorder/delete list. Both save through the one
 * `saveSection` action, which re-validates against the same schema on the
 * server.
 */

let sequence = 0;
const nextKey = () => `row-${(sequence += 1)}`;

export default function SchemaEditor({ sectionKey, section, initial }) {
  const isSingle = section.type === 'single';

  const [single, setSingle] = useState(() => (isSingle ? { ...initial } : null));
  const [rows, setRows] = useState(() =>
    isSingle ? [] : (initial || []).map((item) => ({ key: nextKey(), item })),
  );
  const [open, setOpen] = useState(() => new Set());
  const [result, setResult] = useState(null);
  const [dirty, setDirty] = useState(false);
  const [pending, startTransition] = useTransition();
  // `apply` is the setter the picker hands its choice back to, which is what
  // lets one dialog serve fields at any depth.
  const [picker, setPicker] = useState(null);

  const touched = () => {
    setDirty(true);
    setResult(null);
  };

  const browse = (kind, apply) => setPicker({ kind, apply });

  /* ------------------------------ Single ------------------------------- */

  const setSingleField = (name, value) => {
    setSingle((current) => ({ ...current, [name]: value }));
    touched();
  };

  /* ------------------------------- List -------------------------------- */

  const setRowField = (key, name, value) => {
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, item: { ...row.item, [name]: value } } : row)),
    );
    touched();
  };

  const blankRow = () =>
    Object.fromEntries(
      section.fields.map((field) => [
        field.name,
        field.type === 'items' ? [] : field.type === 'check' ? false : '',
      ]),
    );

  const add = () => {
    const key = nextKey();
    setRows((current) => [...current, { key, item: blankRow() }]);
    setOpen((current) => new Set(current).add(key));
    touched();
  };

  const remove = (key) => {
    setRows((current) => current.filter((row) => row.key !== key));
    touched();
  };

  const move = (index, direction) => {
    setRows((current) => {
      const target = index + direction;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    touched();
  };

  const toggle = (key) =>
    setOpen((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });

  /* ------------------------------- Save -------------------------------- */

  const save = () => {
    startTransition(async () => {
      const payload = isSingle ? single : rows.map((row) => row.item);
      const response = await saveSection(sectionKey, payload);
      setResult(response);
      if (response.ok) setDirty(false);
    });
  };

  const restore = () => {
    if (!window.confirm('Discard your changes here and go back to what the site shipped with?')) return;
    startTransition(async () => {
      const response = await restoreDefaults(section.collection);
      setResult(response);
      if (response.ok) window.location.reload();
    });
  };

  const saveButton = (
    <button
      type="button"
      className="admin-btn admin-btn-gold"
      onClick={save}
      disabled={pending || !dirty}
    >
      <i className={`bi ${pending ? 'bi-hourglass-split' : 'bi-check-lg'}`} />
      {pending ? 'Saving…' : dirty ? 'Save changes' : 'Saved'}
    </button>
  );

  const summaryOf = (item) => {
    const config = section.summary || {};
    const meta = (config.meta || [])
      .map((name) => item[name])
      .filter(Boolean)
      .join('  ·  ');
    const nested = config.count ? (item[config.count] || []).length : null;

    return {
      title: item[config.title] || '',
      meta: [meta, nested !== null ? `${nested} ${config.countLabel || 'items'}` : '']
        .filter(Boolean)
        .join('  ·  '),
      thumb: config.thumb ? item[config.thumb] : '',
      icon: item.icon,
    };
  };

  return (
    <>
      {section.intro && (
        <div className="admin-card mb-4">
          <div className="admin-card-head">
            <i className={`bi ${section.icon} head-icon`} />
            <div>
              <h2>{section.title}</h2>
              <p>{section.group}</p>
            </div>
          </div>
          <div className="admin-card-body">
            <p className="mb-0 text-muted" style={{ fontSize: '0.88rem' }}>
              {section.intro}
            </p>
          </div>
        </div>
      )}

      <Flash result={result} />

      {isSingle ? (
        <div className="admin-card">
          <div className="admin-card-body">
            <div className="admin-grid-2">
              {section.fields.map((field) => (
                <Field
                  key={field.name}
                  field={field}
                  value={single?.[field.name]}
                  onChange={(value) => setSingleField(field.name, value)}
                  onBrowse={browse}
                />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="admin-card">
          <div className="admin-card-head">
            <i className="bi bi-list-ul head-icon" />
            <div>
              <h2>
                {rows.length} entr{rows.length === 1 ? 'y' : 'ies'}
              </h2>
              <p>Shown on the site top to bottom, in this order</p>
            </div>
            <div className="head-actions">
              <button type="button" className="admin-btn" onClick={add} disabled={pending}>
                <i className="bi bi-plus-lg" />
                {section.addLabel || 'Add'}
              </button>
              {saveButton}
            </div>
          </div>

          <div className="admin-card-body flush">
            {rows.length === 0 ? (
              <div className="admin-empty">
                <i className="bi bi-inbox" />
                <strong>Nothing here yet</strong>
                This part of the site is hidden while the list is empty.
              </div>
            ) : (
              rows.map((row, index) => {
                const expanded = open.has(row.key);
                const info = summaryOf(row.item);

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
                      >
                        <div className="admin-row-title">
                          {info.title || <span className="text-muted fst-italic">Untitled</span>}
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
                        style={{
                          padding: '18px 20px 6px',
                          background: 'var(--paper)',
                          borderBottom: '1px solid var(--hairline)',
                        }}
                      >
                        <div className="admin-grid-2">
                          {section.fields.map((field) => (
                            <Field
                              key={field.name}
                              field={field}
                              value={row.item[field.name]}
                              onChange={(value) => setRowField(row.key, field.name, value)}
                              onBrowse={browse}
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
      )}

      <div className="d-flex flex-wrap gap-2 align-items-center mt-3">
        {!isSingle && (
          <button type="button" className="admin-btn" onClick={add} disabled={pending}>
            <i className="bi bi-plus-lg" />
            {section.addLabel || 'Add'}
          </button>
        )}
        {saveButton}
        <button
          type="button"
          className="admin-btn admin-btn-danger ms-auto"
          onClick={restore}
          disabled={pending}
        >
          <i className="bi bi-arrow-counterclockwise" />
          Restore original content
        </button>
      </div>

      <datalist id="admin-icon-suggestions">
        {ICON_SUGGESTIONS.map((name) => (
          <option key={name} value={name} />
        ))}
      </datalist>

      <MediaPicker
        open={Boolean(picker)}
        kind={picker?.kind || 'image'}
        onPick={(media) => {
          picker?.apply(media.url);
          touched();
        }}
        onClose={() => setPicker(null)}
      />
    </>
  );
}
