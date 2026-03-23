-- Add missing profile fields for Settings page
-- Run this migration in your Supabase SQL editor

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS job_title TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone TEXT;
