"use client";

import React from 'react';

import ListEditor from '@/components/admin/ListEditor';
import { saveOrders } from '@/app/admin/actions';
import { COLLECTIONS } from '@/lib/admin-collections';

const FIELDS = [
  { name: 'title', label: 'Document title', full: true, placeholder: 'Academic Calendar 2026-27' },
  {
    name: 'file',
    label: 'PDF file',
    type: 'media',
    kind: 'document',
    full: true,
    hint: 'Upload the PDF or pick one you have already uploaded.',
  },
  {
    name: 'note',
    label: 'Description',
    type: 'textarea',
    full: true,
    placeholder: 'Session dates, examination windows, and the teaching schedule for the year.',
  },
  { name: 'icon', label: 'Icon', type: 'icon' },
];

export default function OrdersEditor({ initial }) {
  return (
    <ListEditor
      initial={initial}
      fields={FIELDS}
      onSave={saveOrders}
      collection={COLLECTIONS.orders}
      addLabel="Add document"
      emptyTitle="No documents published"
      emptyHint="Upload orders, circulars and government notifications for visitors to download."
      blank={() => ({ title: '', note: '', icon: 'bi-file-earmark-pdf-fill', file: '' })}
      summary={(item) => ({
        title: item.title,
        meta: item.file || 'No file attached — this entry will not be saved',
        icon: item.icon,
      })}
    />
  );
}
