-- Fix RLS policy for email_templates to allow reading system templates
-- System templates have is_system = true and user_id = NULL
-- Users should be able to read all system templates AND their own templates

-- Ensure RLS is enabled
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;

-- Drop existing select policy if it exists
DROP POLICY IF EXISTS email_templates_select ON email_templates;

-- Create new select policy: allow reading system templates OR user's own templates
CREATE POLICY email_templates_select ON email_templates
FOR SELECT USING (is_system = true OR user_id = auth.uid());

-- Also ensure insert/update/delete policies exist for user's own templates
DROP POLICY IF EXISTS email_templates_insert ON email_templates;
CREATE POLICY email_templates_insert ON email_templates
FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS email_templates_update ON email_templates;
CREATE POLICY email_templates_update ON email_templates
FOR UPDATE USING (user_id = auth.uid());

DROP POLICY IF EXISTS email_templates_delete ON email_templates;
CREATE POLICY email_templates_delete ON email_templates
FOR DELETE USING (user_id = auth.uid());
