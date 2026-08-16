"use client";

import React from 'react';

import ListEditor from '@/components/admin/ListEditor';
import { saveTicker } from '@/app/admin/actions';
import { COLLECTIONS } from '@/lib/admin-collections';

const FIELDS = [
  {
    name: 'title',
    label: 'Headline',
    full: true,
    placeholder: 'Admission 2026-27',
    hint: 'Keep it short — this scrolls past, so a few words read best.',
  },
  {
    name: 'link',
    label: 'Link',
    type: 'link',
    full: true,
    placeholder: '/admission/process or https://jeecup.admissions.nic.in/',
    hint: 'A page on this site starts with “/”. A full https:// address opens in a new tab automatically.',
  },
  { name: 'icon', label: 'Icon', type: 'icon' },
  { name: 'isNew', label: 'Show the NEW badge', type: 'check' },
];

export default function TickerEditor({ initial }) {
  return (
    <ListEditor
      initial={initial}
      fields={FIELDS}
      onSave={saveTicker}
      collection={COLLECTIONS.ticker}
      addLabel="Add announcement"
      emptyTitle="No announcements"
      emptyHint="The scrolling line on the home page is hidden while this is empty."
      blank={() => ({ title: '', link: '', icon: 'bi-megaphone-fill', isNew: true })}
      summary={(item) => ({
        title: item.title,
        meta: item.link || 'No link',
        icon: item.icon,
        badge: item.isNew ? 'New' : '',
      })}
    />
  );
}
