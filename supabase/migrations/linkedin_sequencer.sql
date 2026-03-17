-- LinkedIn Sequencer Tables Migration
-- Run this in Supabase SQL Editor

-- ============================================
-- PART 1: Add unipile_account_id to profiles
-- ============================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS unipile_account_id TEXT;

-- ============================================
-- PART 2: Create linkedin_enrollments table
-- ============================================

CREATE TABLE IF NOT EXISTS linkedin_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    unipile_account_id TEXT NOT NULL,
    linkedin_url TEXT NOT NULL,
    current_phase INTEGER DEFAULT 1 CHECK (current_phase BETWEEN 1 AND 6),
    current_day INTEGER DEFAULT 1 CHECK (current_day BETWEEN 1 AND 35),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'failed', 'connected')),
    connected_at TIMESTAMPTZ,
    last_action_at TIMESTAMPTZ,
    next_action_at TIMESTAMPTZ DEFAULT NOW(),
    enrolled_at TIMESTAMPTZ DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for linkedin_enrollments
CREATE INDEX IF NOT EXISTS idx_linkedin_enrollments_user_id ON linkedin_enrollments(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_enrollments_lead_id ON linkedin_enrollments(lead_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_enrollments_status ON linkedin_enrollments(status);
CREATE INDEX IF NOT EXISTS idx_linkedin_enrollments_next_action_at ON linkedin_enrollments(next_action_at);

-- ============================================
-- PART 3: Create linkedin_action_log table
-- ============================================

CREATE TABLE IF NOT EXISTS linkedin_action_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID REFERENCES linkedin_enrollments(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    phase INTEGER CHECK (phase BETWEEN 1 AND 6),
    day INTEGER CHECK (day BETWEEN 1 AND 35),
    action_type TEXT NOT NULL CHECK (action_type IN (
        'view_profile',
        'like_post',
        'comment_post',
        'connect_request',
        'message',
        'follow_up'
    )),
    action_payload JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed')),
    unipile_response JSONB,
    executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for linkedin_action_log
CREATE INDEX IF NOT EXISTS idx_linkedin_action_log_enrollment_id ON linkedin_action_log(enrollment_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_action_log_user_id ON linkedin_action_log(user_id);
CREATE INDEX IF NOT EXISTS idx_linkedin_action_log_status ON linkedin_action_log(status);

-- ============================================
-- PART 4: Enable RLS on both tables
-- ============================================

ALTER TABLE linkedin_enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE linkedin_action_log ENABLE ROW LEVEL SECURITY;

-- ============================================
-- PART 5: RLS Policies for linkedin_enrollments
-- ============================================

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view their own linkedin enrollments" ON linkedin_enrollments;
DROP POLICY IF EXISTS "Users can insert their own linkedin enrollments" ON linkedin_enrollments;
DROP POLICY IF EXISTS "Users can update their own linkedin enrollments" ON linkedin_enrollments;
DROP POLICY IF EXISTS "Users can delete their own linkedin enrollments" ON linkedin_enrollments;
DROP POLICY IF EXISTS "Service role has full access to linkedin enrollments" ON linkedin_enrollments;

-- Users can only see their own enrollments
CREATE POLICY "Users can view their own linkedin enrollments"
ON linkedin_enrollments FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can only insert their own enrollments
CREATE POLICY "Users can insert their own linkedin enrollments"
ON linkedin_enrollments FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can only update their own enrollments
CREATE POLICY "Users can update their own linkedin enrollments"
ON linkedin_enrollments FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can only delete their own enrollments
CREATE POLICY "Users can delete their own linkedin enrollments"
ON linkedin_enrollments FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Service role has full access
CREATE POLICY "Service role has full access to linkedin enrollments"
ON linkedin_enrollments FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- PART 6: RLS Policies for linkedin_action_log
-- ============================================

-- Drop existing policies if they exist (for idempotency)
DROP POLICY IF EXISTS "Users can view their own linkedin action logs" ON linkedin_action_log;
DROP POLICY IF EXISTS "Users can insert their own linkedin action logs" ON linkedin_action_log;
DROP POLICY IF EXISTS "Users can update their own linkedin action logs" ON linkedin_action_log;
DROP POLICY IF EXISTS "Users can delete their own linkedin action logs" ON linkedin_action_log;
DROP POLICY IF EXISTS "Service role has full access to linkedin action logs" ON linkedin_action_log;

-- Users can only see their own action logs
CREATE POLICY "Users can view their own linkedin action logs"
ON linkedin_action_log FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Users can only insert their own action logs
CREATE POLICY "Users can insert their own linkedin action logs"
ON linkedin_action_log FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Users can only update their own action logs
CREATE POLICY "Users can update their own linkedin action logs"
ON linkedin_action_log FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Users can only delete their own action logs
CREATE POLICY "Users can delete their own linkedin action logs"
ON linkedin_action_log FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Service role has full access
CREATE POLICY "Service role has full access to linkedin action logs"
ON linkedin_action_log FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- ============================================
-- VERIFICATION: Check tables were created
-- ============================================

-- Run this to verify:
-- SELECT table_name FROM information_schema.tables
-- WHERE table_schema = 'public'
-- AND table_name IN ('linkedin_enrollments', 'linkedin_action_log');
