# N8N Workflow: Monthly Usage Reset

## Overview
Resets the `monthly_searches_used` column to 0 for all users in the `profiles` table on the 1st of every month.

---

## Workflow Details

| Property | Value |
|----------|-------|
| **Workflow Name** | Monthly Usage Reset |
| **Nodes** | 3 |
| **Trigger** | Schedule (1st of month, 00:01 UTC) |

---

## Node 1: Schedule Trigger

**Node Type:** Schedule Trigger
**Node Name:** `Monthly Reset Trigger`

### Configuration

| Setting | Value |
|---------|-------|
| **Trigger Interval** | Months |
| **Months Between Triggers** | 1 |
| **Trigger at Day of Month** | 1 |
| **Trigger at Hour** | 0 |
| **Trigger at Minute** | 1 |

### N8N UI Settings Path
1. Add node → "Schedule Trigger"
2. Set "Trigger Interval" to **Months**
3. Set "Months Between Triggers" to **1**
4. Set "Trigger at Day of Month" to **1**
5. Set "Trigger at Hour" to **0**
6. Set "Trigger at Minute" to **1**

---

## Node 2: Reset Usage (HTTP Request)

**Node Type:** HTTP Request
**Node Name:** `Reset Monthly Searches`

### Configuration

| Setting | Value |
|---------|-------|
| **Method** | PATCH |
| **URL** | `https://rmcyfrqgmpnkvrgzeyxq.supabase.co/rest/v1/profiles` |

### Headers

| Header | Value |
|--------|-------|
| `apikey` | `{{ $credentials.supabaseServiceRoleKey }}` |
| `Authorization` | `Bearer {{ $credentials.supabaseServiceRoleKey }}` |
| `Content-Type` | `application/json` |
| `Prefer` | `return=minimal` |

### Body (JSON)

```json
{
  "monthly_searches_used": 0
}
```

### N8N UI Settings

1. Add node → "HTTP Request"
2. **Method:** PATCH
3. **URL:** `https://rmcyfrqgmpnkvrgzeyxq.supabase.co/rest/v1/profiles`
4. **Authentication:** None (we use headers)
5. **Send Headers:** ON
6. Add headers:
   - `apikey` → Use expression: `{{ $env.SUPABASE_SERVICE_ROLE_KEY }}`
   - `Authorization` → Use expression: `Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}`
   - `Content-Type` → `application/json`
   - `Prefer` → `return=minimal`
7. **Send Body:** ON
8. **Body Content Type:** JSON
9. **Body:** `{"monthly_searches_used": 0}`

### Why This Works

- **No filter parameter** = Updates ALL rows in the table
- **PATCH method** = Only updates the specified column
- **Other columns remain untouched** (email, plan_type, stripe_customer_id, etc.)
- **Service Role Key** bypasses RLS policies for admin operations

---

## Node 3: Log Completion (No Operation)

**Node Type:** No Operation, do nothing
**Node Name:** `Reset Complete`

### Configuration
No configuration needed. This node serves as:
- Visual confirmation the workflow completed
- A hook point for future notifications if needed

---

## Complete Workflow Connection

```
┌─────────────────────────┐
│  Monthly Reset Trigger  │
│  (Schedule - 1st 00:01) │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Reset Monthly Searches │
│  (HTTP Request - PATCH) │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│     Reset Complete      │
│     (No Operation)      │
└─────────────────────────┘
```

---

## Environment Variables Required

Ensure these are set in N8N Settings → Variables:

| Variable | Description |
|----------|-------------|
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key from Supabase project settings |

---

## Safety Confirmation

### What This Workflow Does:
✅ Resets `monthly_searches_used` to 0 for ALL profiles
✅ Runs automatically on the 1st of every month at 00:01 UTC
✅ Uses service role key to bypass RLS

### What This Workflow Does NOT Do:
✅ Does NOT delete any rows
✅ Does NOT modify any other columns (plan_type, email, stripe_customer_id, etc.)
✅ Does NOT affect billing or subscription status
✅ Does NOT require user authentication

### Supabase PATCH Behavior:
The Supabase REST API PATCH operation is a **partial update** — it only modifies the columns specified in the request body. All other columns remain exactly as they were.

---

## Testing Checklist

Before activating:

- [ ] Verify `SUPABASE_SERVICE_ROLE_KEY` environment variable is set
- [ ] Test manually by clicking "Execute Workflow"
- [ ] Check Supabase Table Editor to confirm all `monthly_searches_used` values are 0
- [ ] Verify no other profile data was changed
- [ ] Activate workflow

---

## Manual Test Command

To test the API call directly (replace `YOUR_SERVICE_ROLE_KEY`):

```bash
curl -X PATCH \
  'https://rmcyfrqgmpnkvrgzeyxq.supabase.co/rest/v1/profiles' \
  -H 'apikey: YOUR_SERVICE_ROLE_KEY' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json' \
  -H 'Prefer: return=minimal' \
  -d '{"monthly_searches_used": 0}'
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| 401 Unauthorized | Check service role key is correct |
| 403 Forbidden | Ensure using service role key, not anon key |
| No rows updated | Verify profiles table exists and has data |
| Wrong timezone | N8N uses UTC by default; adjust hour if needed |
