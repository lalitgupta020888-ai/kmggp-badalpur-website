-- Newer Supabase projects do not auto-grant table privileges to service_role.
-- The website's server uses the service-role key, so it needs these explicitly.
-- anon/authenticated get nothing; RLS stays on.
grant select, insert, update, delete on public.kmggp_collections to service_role;
