-- Migration: LinkedIn Reply Detection
-- Adds columns needed for LinkedIn reply detection and sequence pause functionality

-- Add paused_reason column to linkedin_enrollments
ALTER TABLE linkedin_enrollments
ADD COLUMN IF NOT EXISTS paused_reason TEXT;

-- Add LinkedIn-specific columns to inbound_emails for storing LinkedIn messages
ALTER TABLE inbound_emails
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'email';

ALTER TABLE inbound_emails
ADD COLUMN IF NOT EXISTS linkedin_enrollment_id UUID REFERENCES linkedin_enrollments(id);

ALTER TABLE inbound_emails
ADD COLUMN IF NOT EXISTS sender_linkedin_id TEXT;

-- Add index for efficient querying by source
CREATE INDEX IF NOT EXISTS idx_inbound_emails_source ON inbound_emails(source);

-- Add index for linkedin_enrollment_id lookups
CREATE INDEX IF NOT EXISTS idx_inbound_emails_linkedin_enrollment ON inbound_emails(linkedin_enrollment_id);

-- Add comment explaining paused_reason values
COMMENT ON COLUMN linkedin_enrollments.paused_reason IS 'Reason for pause: reply_received, manual, etc.';
COMMENT ON COLUMN inbound_emails.source IS 'Message source: email or linkedin';
COMMENT ON COLUMN inbound_emails.sender_linkedin_id IS 'LinkedIn provider_id of the sender (for LinkedIn messages)';
