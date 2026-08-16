"use client";

import React from 'react';

import ListEditor from '@/components/admin/ListEditor';
import { saveNotices } from '@/app/admin/actions';
import { COLLECTIONS } from '@/lib/admin-collections';

/** Today, in the same style the notice board already prints. */
function today() {
  return new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  });
}

export default function NoticesEditor({ initial, categories }) {
  const fields = [
    {
      name: 'title',
      label: 'Notice',
      full: true,
      placeholder: 'Even Semester examination schedule released',
    },
    {
      name: 'link',
      label: 'Link',
      type: 'link',
      full: true,
      placeholder: '/academic/calendar or https://…',
      hint: 'Where the notice takes the reader. Leave blank for a notice with nothing to open.',
    },
    { name: 'date', label: 'Date', placeholder: today(), hint: 'Shown as written.' },
    {
      name: 'category',
      label: 'Category',
      type: 'select',
      options: categories,
      hint: 'Becomes a filter button on /notices. Reuse a name to group notices together.',
    },
    { name: 'icon', label: 'Icon', type: 'icon' },
    { name: 'isNew', label: 'Show the NEW badge', type: 'check' },
  ];

  return (
    <ListEditor
      initial={initial}
      fields={fields}
      onSave={saveNotices}
      collection={COLLECTIONS.notices}
      addLabel="Add notice"
      emptyTitle="No notices"
      emptyHint="The notice board on the home page is hidden while this is empty."
      blank={() => ({
        title: '',
        date: today(),
        icon: 'bi-megaphone-fill',
        category: categories[0] || 'Announcements',
        isNew: true,
        link: '',
      })}
      summary={(item) => ({
        title: item.title,
        meta: [item.date, item.category, item.link].filter(Boolean).join('  ·  '),
        icon: item.icon,
        badge: item.isNew ? 'New' : '',
      })}
    />
  );
}
