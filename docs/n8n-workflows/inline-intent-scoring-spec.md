# Inline Intent Scoring - N8N Node Specifications

## Overview

Add instant intent scoring to the **Lead Enrichment** workflow so new leads are scored immediately during enrichment, rather than waiting for the batch processor.

## Target Workflow

**Workflow Name:** `Lead Enrichment`
**Workflow ID:** `LRCsI71DkWzH8NFN`

## Current Flow

```
Webhook → HTTP Request (Hunter.io) → HTTP Request1 (Update Lead) → Respond to Webhook
```

## New Flow

```
Webhook → HTTP Request (Hunter.io) → HTTP Request1 (Update Lead)
    → Intent Website Check
    → Intent Extract Signals
    → Intent Calculate Score
    → Intent Update Lead
    → Respond to Webhook
```

## Connection Changes

1. Disconnect: `HTTP Request1` → `Respond to Webhook`
2. Connect: `HTTP Request1` → `Intent Website Check`
3. Connect: `Intent Update Lead` → `Respond to Webhook`

---

## Node A: Intent Website Check

### Basic Settings
| Field | Value |
|-------|-------|
| **Node Name** | `Intent Website Check` |
| **Node Type** | HTTP Request |
| **Connect FROM** | `HTTP Request1` (output 0) |
| **Connect TO** | `Intent Extract Signals` (input 0) |

### Parameters
| Field | Value |
|-------|-------|
| **Method** | `GET` |
| **URL** | `={{ $json[0].website }}` |

### Options (Click "Add Option")
| Option | Value |
|--------|-------|
| **Timeout** | `5000` (5 seconds) |
| **Response Format** | `Text` |
| **Redirects → Max Redirects** | `3` |

### Settings Tab
| Field | Value |
|--------|-------|
| **Continue On Fail** | `ON` (enabled) |
| **Always Output Data** | `ON` (enabled) |

> **Note:** HTTP Request1 returns an array. Use `$json[0].website` to access the first item. If your workflow returns a single object, use `$json.website` instead.

---

## Node B: Intent Extract Signals

### Basic Settings
| Field | Value |
|-------|-------|
| **Node Name** | `Intent Extract Signals` |
| **Node Type** | Code |
| **Language** | JavaScript |
| **Connect FROM** | `Intent Website Check` (output 0) |
| **Connect TO** | `Intent Calculate Score` (input 0) |

### JavaScript Code
```javascript
// Get lead data from the HTTP Request1 node (lead update response)
// HTTP Request1 returns the updated lead with return=representation
const leadData = $('HTTP Request1').first().json;

// Handle array response from Supabase PATCH
const lead = Array.isArray(leadData) ? leadData[0] : leadData;

// Get website response from previous node
const websiteResponse = $('Intent Website Check').first();

let hasWebsite = !!(lead.website && lead.website.trim().length > 0);
let hasSSL = false;
let loadMs = null;
let hasContactForm = false;
let hasPhone = !!(lead.phone && lead.phone.trim().length > 0);

if (hasWebsite && websiteResponse && !websiteResponse.json?.error) {
  hasSSL = lead.website.toLowerCase().startsWith('https://');

  const body = (typeof websiteResponse.json === 'string' ? websiteResponse.json : '').toLowerCase();
  if (body.length > 0) {
    hasContactForm = (
      body.includes('contact') &&
      (body.includes('<form') ||
       body.includes('contact-form') ||
       body.includes('contact_form'))
    );
  }
}

return [{
  json: {
    lead_id: lead.id,
    rating: lead.rating ? parseFloat(lead.rating) : null,
    review_count: lead.review_count ? parseInt(lead.review_count) : null,
    photos_count: lead.photos_count ? parseInt(lead.photos_count) : 0,
    has_website: hasWebsite,
    has_phone: hasPhone,
    business_age_months: null,
    website_has_ssl: hasSSL,
    website_load_ms: loadMs,
    website_has_contact_form: hasContactForm
  }
}];
```

### Settings Tab
| Field | Value |
|--------|-------|
| **Continue On Fail** | `ON` (enabled) |

---

## Node C: Intent Calculate Score

### Basic Settings
| Field | Value |
|-------|-------|
| **Node Name** | `Intent Calculate Score` |
| **Node Type** | HTTP Request |
| **Connect FROM** | `Intent Extract Signals` (output 0) |
| **Connect TO** | `Intent Update Lead` (input 0) |

### Parameters
| Field | Value |
|-------|-------|
| **Method** | `POST` |
| **URL** | `https://rmcyfrqgmpnkvrgzeyxq.supabase.co/rest/v1/rpc/calculate_intent_score` |

### Headers (Add Header Parameters)
| Header Name | Value |
|-------------|-------|
| `apikey` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY3lmcnFnbXBua3ZyZ3pleXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODU0OTAsImV4cCI6MjA4NjY2MTQ5MH0.fMgZSL--G2xrrDGjmVQIXhxpdyZtMuEDPrLcyMdS9BE` |
| `Authorization` | `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY3lmcnFnbXBua3ZyZ3pleXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA4NTQ5MCwiZXhwIjoyMDg2NjYxNDkwfQ.rsLKNUvn9AykmAsYdara50qrAyErbHP_YMEVz9PewAw` |

### Body (Send Body = ON, Body Content Type = Form URL-Encoded or JSON)

#### Option 1: Individual Parameters (Body Content Type = Form URL-Encoded)
| Parameter Name | Value |
|----------------|-------|
| `p_rating` | `={{ $json.rating }}` |
| `p_review_count` | `={{ $json.review_count }}` |
| `p_photos_count` | `={{ $json.photos_count }}` |
| `p_has_website` | `={{ $json.has_website }}` |
| `p_has_phone` | `={{ $json.has_phone }}` |
| `p_business_age_months` | `={{ $json.business_age_months }}` |
| `p_website_has_ssl` | `={{ $json.website_has_ssl }}` |
| `p_website_load_ms` | `={{ $json.website_load_ms }}` |
| `p_website_has_contact_form` | `={{ $json.website_has_contact_form }}` |

### Settings Tab
| Field | Value |
|--------|-------|
| **Continue On Fail** | `ON` (enabled) |

---

## Node D: Intent Update Lead

### Basic Settings
| Field | Value |
|-------|-------|
| **Node Name** | `Intent Update Lead` |
| **Node Type** | HTTP Request |
| **Connect FROM** | `Intent Calculate Score` (output 0) |
| **Connect TO** | `Respond to Webhook` (input 0) |

### Parameters
| Field | Value |
|-------|-------|
| **Method** | `PATCH` |
| **URL** | `=https://rmcyfrqgmpnkvrgzeyxq.supabase.co/rest/v1/leads?id=eq.{{ $('Intent Extract Signals').first().json.lead_id }}` |

### Headers (Add Header Parameters)
| Header Name | Value |
|-------------|-------|
| `apikey` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY3lmcnFnbXBua3ZyZ3pleXhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwODU0OTAsImV4cCI6MjA4NjY2MTQ5MH0.fMgZSL--G2xrrDGjmVQIXhxpdyZtMuEDPrLcyMdS9BE` |
| `Authorization` | `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY3lmcnFnbXBua3ZyZ3pleXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA4NTQ5MCwiZXhwIjoyMDg2NjYxNDkwfQ.rsLKNUvn9AykmAsYdara50qrAyErbHP_YMEVz9PewAw` |
| `Content-Type` | `application/json` |
| `Prefer` | `return=minimal` |

### Body (Send Body = ON, Specify Body = Using JSON)
```
={
  "intent_score": {{ $json.score }},
  "intent_signals": {{ JSON.stringify($json.signals) }},
  "intent_scored_at": "{{ new Date().toISOString() }}"
}
```

### Settings Tab
| Field | Value |
|--------|-------|
| **Continue On Fail** | `ON` (enabled) |

---

## Visual Node Layout (Suggested Positions)

Starting from HTTP Request1's position (48, 0):

| Node | X Position | Y Position |
|------|------------|------------|
| HTTP Request1 (existing) | 48 | 0 |
| Intent Website Check | 256 | 0 |
| Intent Extract Signals | 464 | 0 |
| Intent Calculate Score | 672 | 0 |
| Intent Update Lead | 880 | 0 |
| Respond to Webhook (move) | 1088 | 0 |

---

## Key Differences from Batch Processor

| Aspect | Batch Processor | Inline (This Spec) |
|--------|-----------------|-------------------|
| **Lead Data Source** | `$('Split In Batches')` | `$('HTTP Request1')` |
| **Website Check Source** | `$('Website Intelligence Check')` | `$('Intent Website Check')` |
| **Trigger** | Schedule (every 30 min) | Webhook (during enrichment) |
| **Lead Selection** | Query unscored leads | Single lead being enriched |

---

## Testing Checklist

- [ ] Verify HTTP Request1 returns full lead data (check `Prefer: return=representation`)
- [ ] Test with lead that has a valid website
- [ ] Test with lead that has no website (should still score)
- [ ] Test with lead where website times out (Continue On Fail)
- [ ] Verify intent_score, intent_signals, intent_scored_at are saved
- [ ] Confirm webhook still responds correctly after adding nodes

---

## Rollback

To remove inline scoring, simply:
1. Delete nodes: Intent Website Check, Intent Extract Signals, Intent Calculate Score, Intent Update Lead
2. Reconnect: `HTTP Request1` → `Respond to Webhook`
