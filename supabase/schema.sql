-- ─── CPA Dashboard · Supabase schema ────────────────────────────────────────
--
-- Run this in the Supabase SQL Editor (supabase.com → your project → SQL Editor).
-- This creates one table that stores each user's full configuration as a JSONB blob.
-- Access is controlled by Row Level Security — only the service role key (used by
-- the Vercel Function) can read/write; no client-side DB access is exposed.

-- 1. Create the table
CREATE TABLE IF NOT EXISTS public.user_configs (
  google_id   TEXT        PRIMARY KEY,          -- Google user sub (stable ID)
  email       TEXT        NOT NULL,
  config      JSONB       NOT NULL DEFAULT '{}',
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Enable Row Level Security (deny all by default)
ALTER TABLE public.user_configs ENABLE ROW LEVEL SECURITY;

-- 3. Grant usage on the schema to authenticated and anon roles
GRANT USAGE ON SCHEMA public TO anon, authenticated;

-- 4. The Vercel Function uses the service_role key, which bypasses RLS.
--    No additional policies needed for server-side access.
--    If you ever want to add direct client access, add policies here.

-- Indexes
CREATE INDEX IF NOT EXISTS user_configs_email_idx ON public.user_configs (email);
