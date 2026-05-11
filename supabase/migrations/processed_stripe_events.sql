-- Processed Stripe Events Migration
-- Run this in Supabase SQL Editor
-- Required for Stripe webhook idempotency (LEA-2)
--
-- Stripe retries webhook delivery on transient failures (network timeouts, 5xx).
-- Without an event-id dedupe table a retried invoice.paid or
-- customer.subscription.updated could double-credit a customer or fire
-- duplicate emails. This table stores every successfully ingested event id
-- so the webhook handler can short-circuit duplicates.

-- ============================================
-- Table
-- ============================================

CREATE TABLE IF NOT EXISTS processed_stripe_events (
    event_id     TEXT PRIMARY KEY,
    event_type   TEXT NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- Access control
-- ============================================
-- This is a system-only table written by the Stripe webhook using the
-- service-role key. Anon and authenticated roles must never read or write
-- it. We enable RLS with no policies so PostgREST denies every request,
-- while the service role continues to bypass RLS for the webhook handler.

ALTER TABLE processed_stripe_events ENABLE ROW LEVEL SECURITY;

REVOKE ALL ON processed_stripe_events FROM anon, authenticated;

-- ============================================
-- Helpful index for ops / debugging
-- ============================================

CREATE INDEX IF NOT EXISTS idx_processed_stripe_events_processed_at
    ON processed_stripe_events (processed_at DESC);

-- ============================================
-- VERIFICATION
-- ============================================
-- SELECT event_id, event_type, processed_at
-- FROM processed_stripe_events
-- ORDER BY processed_at DESC
-- LIMIT 10;
