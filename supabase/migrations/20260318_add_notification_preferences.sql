-- Migration: Add email_notifications and weekly_reminders to user_account
-- Date: 2026-03-18
-- Description: Adds boolean columns for user notification preferences.
--   Both default to true so existing users are opted-in automatically.

ALTER TABLE public.user_account
  ADD COLUMN IF NOT EXISTS email_notifications boolean NOT NULL DEFAULT true;

ALTER TABLE public.user_account
  ADD COLUMN IF NOT EXISTS weekly_reminders boolean NOT NULL DEFAULT true;
