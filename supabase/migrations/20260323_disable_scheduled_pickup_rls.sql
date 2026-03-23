-- Migration: Disable RLS on scheduled_pickup for the current client-only auth model
-- Date: 2026-03-23
-- Description: The app uses the Supabase anon key directly from the browser and
-- does not use Supabase Auth, so scheduled_pickup must remain accessible without
-- row-level policies until auth moves server-side or to Supabase Auth.

ALTER TABLE IF EXISTS public.scheduled_pickup DISABLE ROW LEVEL SECURITY;
