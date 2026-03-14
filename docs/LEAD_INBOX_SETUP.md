# Lead Inbox Setup Guide

## Part 1: Supabase Database Setup

Run this SQL in your Supabase SQL Editor:

```sql
-- Create inbound_emails table for Lead Inbox
CREATE TABLE inbound_emails (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
  campaign_id UUID REFERENCES campaigns(id) ON DELETE SET NULL,
  from_email TEXT NOT NULL,
  subject TEXT,
  body_text TEXT,
  body_html TEXT,
  received_at TIMESTAMPTZ DEFAULT NOW(),
  ai_label TEXT,
  ai_confidence NUMERIC(4,3),
  is_read BOOLEAN DEFAULT false,
  replied BOOLEAN DEFAULT false,
  reply_body TEXT
);

-- Enable Row Level Security
ALTER TABLE inbound_emails ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for users to see only their own inbound emails
CREATE POLICY "Users see own inbound emails" ON inbound_emails
  FOR ALL USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_inbound_emails_user_id ON inbound_emails(user_id);
CREATE INDEX idx_inbound_emails_lead_id ON inbound_emails(lead_id);
CREATE INDEX idx_inbound_emails_campaign_id ON inbound_emails(campaign_id);
CREATE INDEX idx_inbound_emails_received_at ON inbound_emails(received_at DESC);
CREATE INDEX idx_inbound_emails_is_read ON inbound_emails(user_id, is_read) WHERE is_read = false;

-- Enable Realtime for the table
ALTER PUBLICATION supabase_realtime ADD TABLE inbound_emails;
```

## Part 2: N8N Workflow Specification

### Workflow Name: "Inbound Email Processor"

Create this workflow in your N8N instance:

### Node 1: Webhook Trigger
- **Type:** Webhook
- **HTTP Method:** POST
- **Path:** `/inbound-email`
- **Authentication:** Header Auth (use a secret key)
- **Response Mode:** Last Node

Configure Resend to send inbound emails to this webhook URL.

### Node 2: Match Lead (Supabase)
- **Type:** HTTP Request
- **Method:** GET
- **URL:** `https://rmcyfrqgmpnkvrgzeyxq.supabase.co/rest/v1/leads`
- **Authentication:** API Key (in header)
- **Headers:**
  - `apikey`: `{{ $env.SUPABASE_SERVICE_ROLE_KEY }}`
  - `Authorization`: `Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}`
- **Query Parameters:**
  - `select`: `id,user_id,campaign_id`
  - `email`: `eq.{{ $json.from }}`
  - `limit`: `1`

### Node 3: AI Classification (Claude)
- **Type:** HTTP Request
- **Method:** POST
- **URL:** `https://api.anthropic.com/v1/messages`
- **Headers:**
  - `x-api-key`: `{{ $env.ANTHROPIC_API_KEY }}`
  - `anthropic-version`: `2023-06-01`
  - `content-type`: `application/json`
- **Body (JSON):**
```json
{
  "model": "claude-haiku-4-5-20251001",
  "max_tokens": 256,
  "system": "You are an email reply classifier for B2B sales outreach. Classify the email reply into exactly one of these labels:\n- Interested: The sender shows interest in learning more, scheduling a call, or continuing the conversation\n- Not Interested: The sender explicitly declines or shows no interest\n- Out of Office: Automatic out-of-office or vacation reply\n- Unsubscribe: The sender wants to be removed from the mailing list or stop receiving emails\n- Question: The sender has questions but hasn't indicated clear interest or disinterest\n- Referral: The sender is referring to another person or department\n\nReturn ONLY a valid JSON object with no additional text: { \"label\": string, \"confidence\": number (0-1), \"reason\": string (one sentence) }",
  "messages": [
    {
      "role": "user",
      "content": "Subject: {{ $node['Webhook'].json.subject }}\n\nBody: {{ $node['Webhook'].json.text }}"
    }
  ]
}
```

### Node 4: Parse AI Response
- **Type:** Code (JavaScript)
```javascript
const response = $input.first().json;
const textContent = response.content[0].text;

let classification;
try {
  classification = JSON.parse(textContent.trim());
} catch (e) {
  classification = {
    label: 'Question',
    confidence: 0.5,
    reason: 'Unable to classify automatically'
  };
}

// Validate label
const validLabels = ['Interested', 'Not Interested', 'Out of Office', 'Unsubscribe', 'Question', 'Referral'];
if (!validLabels.includes(classification.label)) {
  classification.label = 'Question';
}

return [{
  json: {
    ...classification,
    from_email: $node['Webhook'].json.from,
    subject: $node['Webhook'].json.subject,
    body_text: $node['Webhook'].json.text,
    body_html: $node['Webhook'].json.html,
    lead: $node['Match Lead'].json[0] || null
  }
}];
```

### Node 5: Insert Inbound Email (Supabase)
- **Type:** HTTP Request
- **Method:** POST
- **URL:** `https://rmcyfrqgmpnkvrgzeyxq.supabase.co/rest/v1/inbound_emails`
- **Headers:**
  - `apikey`: `{{ $env.SUPABASE_SERVICE_ROLE_KEY }}`
  - `Authorization`: `Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}`
  - `Content-Type`: `application/json`
  - `Prefer`: `return=representation`
- **Body (JSON):**
```json
{
  "user_id": "{{ $json.lead?.user_id || null }}",
  "lead_id": "{{ $json.lead?.id || null }}",
  "campaign_id": "{{ $json.lead?.campaign_id || null }}",
  "from_email": "{{ $json.from_email }}",
  "subject": "{{ $json.subject }}",
  "body_text": "{{ $json.body_text }}",
  "body_html": "{{ $json.body_html }}",
  "ai_label": "{{ $json.label }}",
  "ai_confidence": {{ $json.confidence }},
  "is_read": false,
  "replied": false
}
```

### Node 6: IF Unsubscribe
- **Type:** IF
- **Condition:** `{{ $json.label }}` equals `Unsubscribe`
- **True Branch:** Continue to Node 7
- **False Branch:** End workflow

### Node 7: Update Lead Status (Unsubscribe)
- **Type:** HTTP Request
- **Method:** PATCH
- **URL:** `https://rmcyfrqgmpnkvrgzeyxq.supabase.co/rest/v1/leads?id=eq.{{ $node['Parse AI Response'].json.lead?.id }}`
- **Headers:**
  - `apikey`: `{{ $env.SUPABASE_SERVICE_ROLE_KEY }}`
  - `Authorization`: `Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}`
  - `Content-Type`: `application/json`
- **Body:**
```json
{
  "status": "unsubscribed"
}
```

### Node 8: Stop Sequence Enrollments
- **Type:** HTTP Request
- **Method:** PATCH
- **URL:** `https://rmcyfrqgmpnkvrgzeyxq.supabase.co/rest/v1/sequence_enrollments?lead_id=eq.{{ $node['Parse AI Response'].json.lead?.id }}&status=eq.active`
- **Headers:**
  - `apikey`: `{{ $env.SUPABASE_SERVICE_ROLE_KEY }}`
  - `Authorization`: `Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}`
  - `Content-Type`: `application/json`
- **Body:**
```json
{
  "status": "completed"
}
```

## Part 3: Resend Inbound Email Setup

1. Go to Resend Dashboard > Domains
2. Add an inbound domain (e.g., `inbound.yourdomain.com`)
3. Configure MX records as instructed by Resend
4. Set up the inbound webhook URL: `https://your-n8n-instance.com/webhook/inbound-email`
5. Configure authentication headers to match your N8N webhook

## Part 4: Environment Variables

Add these to your N8N environment:

```
SUPABASE_URL=https://rmcyfrqgmpnkvrgzeyxq.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

## Part 5: Testing

1. Send a test email to your inbound email address
2. Check N8N execution logs for the workflow
3. Verify the email appears in the Lead Inbox in Leadomation
4. Verify the AI label is correct
5. Test the unsubscribe flow by sending "Please unsubscribe me"

## AI Labels Reference

| Label | Color | Description |
|-------|-------|-------------|
| Interested | Green | Lead wants to learn more or schedule a call |
| Not Interested | Gray | Lead explicitly declined |
| Out of Office | Amber | Automatic OOO reply |
| Unsubscribe | Red | Lead wants to stop receiving emails (auto-handled) |
| Question | Blue | Lead has questions, unclear intent |
| Referral | Purple | Lead referred to someone else |
