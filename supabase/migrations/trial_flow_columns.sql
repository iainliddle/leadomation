-- Trial Flow Columns Migration
-- Run this in Supabase SQL Editor
-- Required for proper trial → paid plan conversion

-- ============================================
-- Add columns for tracking Stripe subscription status and selected plan
-- ============================================

-- stripe_subscription_status: tracks Stripe status ('trialing', 'active', 'past_due', 'canceled', etc.)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_subscription_status TEXT;

-- selected_plan: the plan user selected at checkout (used when trial ends)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS selected_plan TEXT CHECK (selected_plan IN ('starter', 'pro', 'scale'));

-- trial_end: when the trial period ends (set from Stripe subscription.trial_end)
-- Note: This column may already exist, IF NOT EXISTS handles that
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS trial_end TIMESTAMPTZ;

-- ============================================
-- Update existing 'starter' or 'pro' plan users who are actually trialing
-- This handles users who signed up before this migration
-- ============================================

-- If you have existing users with plan='starter' or 'pro' who are actually in trial,
-- you may need to run this update with their specific stripe_subscription_status from Stripe:
--
-- UPDATE profiles
-- SET plan = 'trialing',
--     selected_plan = 'starter',  -- or 'pro'
--     stripe_subscription_status = 'trialing'
-- WHERE stripe_customer_id IS NOT NULL
--   AND plan IN ('starter', 'pro')
--   AND trial_end > NOW();

-- ============================================
-- Create index for faster subscription status queries
-- ============================================

CREATE INDEX IF NOT EXISTS idx_profiles_stripe_subscription_status ON profiles(stripe_subscription_status);

-- ============================================
-- VERIFICATION: Check columns were added
-- ============================================

-- Run this to verify:
-- SELECT column_name, data_type
-- FROM information_schema.columns
-- WHERE table_name = 'profiles'
--   AND column_name IN ('stripe_subscription_status', 'selected_plan', 'trial_end');
