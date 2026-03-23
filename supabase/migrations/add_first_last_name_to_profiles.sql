-- Add first_name and last_name columns to profiles table
-- This allows separate storage instead of just full_name

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS first_name TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Migrate existing full_name data to first_name/last_name
UPDATE profiles
SET
  first_name = SPLIT_PART(TRIM(full_name), ' ', 1),
  last_name = CASE
    WHEN POSITION(' ' IN TRIM(full_name)) > 0
    THEN SUBSTRING(TRIM(full_name) FROM POSITION(' ' IN TRIM(full_name)) + 1)
    ELSE ''
  END
WHERE full_name IS NOT NULL AND first_name IS NULL;
