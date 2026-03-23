-- Migration: Add scheduled_pickup table for persisted dashboard pickup scheduling
-- Date: 2026-03-23
-- Description: Stores user-selected pickup dates so the dashboard schedule survives refreshes and new sessions.

CREATE SEQUENCE IF NOT EXISTS scheduled_pickup_pickup_id_seq;

CREATE TABLE IF NOT EXISTS public.scheduled_pickup (
  pickup_id integer NOT NULL DEFAULT nextval('scheduled_pickup_pickup_id_seq'::regclass),
  account_id integer NOT NULL,
  pickup_date date NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT scheduled_pickup_pkey PRIMARY KEY (pickup_id),
  CONSTRAINT scheduled_pickup_account_id_fkey FOREIGN KEY (account_id) REFERENCES public.user_account(user_id) ON DELETE CASCADE,
  CONSTRAINT scheduled_pickup_account_id_pickup_date_key UNIQUE (account_id, pickup_date)
);

CREATE INDEX IF NOT EXISTS scheduled_pickup_account_id_pickup_date_idx
  ON public.scheduled_pickup (account_id, pickup_date);

-- This app writes to Supabase directly from the browser with the anon key and
-- does not use Supabase Auth, so per-user RLS policies cannot be enforced here.
ALTER TABLE public.scheduled_pickup DISABLE ROW LEVEL SECURITY;
