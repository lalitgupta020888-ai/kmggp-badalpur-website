-- Run once in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.

-- One row per admin-panel collection (notices, gallery, faculty, ...).
create table if not exists public.kmggp_collections (
  name       text primary key,
  items      jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);

-- Only the server (service-role key) may touch it; the public anon key gets nothing.
alter table public.kmggp_collections enable row level security;

-- Public bucket for uploaded photos, videos and PDFs (150 MB max per file).
insert into storage.buckets (id, name, public, file_size_limit)
values ('uploads', 'uploads', true, 157286400)
on conflict (id) do nothing;
