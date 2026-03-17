# N8N LinkedIn Relationship Sequencer — Complete Build Guide

## Overview

This workflow automates a 35-day LinkedIn relationship-building funnel with 6 phases. It runs hourly, processes active enrollments, executes LinkedIn actions via Unipile, and logs all activity.

---

## Credentials Setup (Do First)

### 1. Create HTTP Header Auth Credential for Unipile
- **Name:** `Unipile API`
- **Header Name:** `X-API-KEY`
- **Header Value:** `vLurcq/9.sCRBpfP5sOzvEW/RFqTk+63rALEGbcYaut2LabBa5zc=`

### 2. Create HTTP Header Auth Credential for Supabase
- **Name:** `Supabase API`
- **Header Name:** `apikey`
- **Header Value:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY3lmcnFnbXBua3ZyZ3pleXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA4NTQ5MCwiZXhwIjoyMDg2NjYxNDkwfQ.rsLKNUvn9AykmAsYdara50qrAyErbHP_YMEVz9PewAw`

---

## Workflow Nodes — Step by Step

---

### NODE 1: Schedule Trigger

**Node Type:** Schedule Trigger
**Node Name:** `Schedule Trigger`

**Settings:**
| Field | Value |
|-------|-------|
| Trigger Interval | Hours |
| Hours Between Triggers | 1 |

**Notes:** This triggers the workflow every hour to process due enrollments.

---

### NODE 2: Get Active Enrollments

**Node Type:** HTTP Request
**Node Name:** `Get Active Enrollments`

**Settings:**
| Field | Value |
|-------|-------|
| Method | GET |
| URL | `https://rmcyfrqgmpnkvrgzeyxq.supabase.co/rest/v1/linkedin_enrollments?status=eq.active&next_action_at=lte.now()&select=*,leads(*)&limit=20` |
| Authentication | Predefined Credential Type |
| Credential Type | Header Auth |
| Header Auth | Supabase API (the one you created) |
| Send Headers | ON |

**Additional Headers:**
| Name | Value |
|------|-------|
| Authorization | `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY3lmcnFnbXBua3ZyZ3pleXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA4NTQ5MCwiZXhwIjoyMDg2NjYxNDkwfQ.rsLKNUvn9AykmAsYdara50qrAyErbHP_YMEVz9PewAw` |
| Prefer | `return=representation` |

**Options:**
| Field | Value |
|-------|-------|
| Response Format | JSON |
| Continue On Fail | OFF |

---

### NODE 3: IF Has Enrollments

**Node Type:** IF
**Node Name:** `IF Has Enrollments`

**Settings:**
| Field | Value |
|-------|-------|
| Condition | Expression |

**Condition Configuration:**
- **Value 1 (Expression):** `{{ $json.length }}`
- **Operation:** Number > Greater Than
- **Value 2:** `0`

**Notes:** If no enrollments are due, the workflow ends. If there are enrollments, continue processing.

---

### NODE 4: No Enrollments (End)

**Node Type:** No Operation, do nothing
**Node Name:** `No Enrollments`

**Connection:** Connect from "IF Has Enrollments" FALSE output

**Notes:** This is just an endpoint for when there are no enrollments to process.

---

### NODE 5: Split In Batches

**Node Type:** Split In Batches
**Node Name:** `Split In Batches`

**Connection:** Connect from "IF Has Enrollments" TRUE output

**Settings:**
| Field | Value |
|-------|-------|
| Batch Size | 1 |
| Options → Reset | ON |

**Notes:** Processes enrollments one at a time to respect rate limits and ensure proper sequencing.

---

### NODE 6: Determine Action

**Node Type:** Code
**Node Name:** `Determine Action`

**Settings:**
| Field | Value |
|-------|-------|
| Mode | Run Once for Each Item |
| Language | JavaScript |

**JavaScript Code:**
```javascript
// LinkedIn Relationship Sequencer - Action Determination Logic
// Phase definitions with day ranges and actions

const enrollment = $input.item.json;
const lead = enrollment.leads || {};

// Extract data
const currentPhase = enrollment.current_phase || 1;
const currentDay = enrollment.current_day || 1;
const connectionStatus = enrollment.connection_status || 'none';
const unipileAccountId = enrollment.unipile_account_id;

// Extract LinkedIn provider ID from URL
function extractLinkedInProviderId(linkedinUrl) {
  if (!linkedinUrl) return null;

  // Handle various LinkedIn URL formats
  // https://www.linkedin.com/in/username/
  // https://linkedin.com/in/username
  // /in/username/

  const patterns = [
    /linkedin\.com\/in\/([^\/\?]+)/i,
    /\/in\/([^\/\?]+)/i
  ];

  for (const pattern of patterns) {
    const match = linkedinUrl.match(pattern);
    if (match && match[1]) {
      return match[1].replace(/\/$/, ''); // Remove trailing slash
    }
  }

  return linkedinUrl; // Return as-is if no pattern matches
}

// Get lead data with fallbacks
const firstName = lead.first_name || (lead.contact_name ? lead.contact_name.split(' ')[0] : 'there');
const company = lead.company || 'your company';
const city = lead.city || 'your area';
const industry = lead.category || lead.industry || 'your industry';
const linkedinUrl = lead.linkedin || enrollment.linkedin_url;
const linkedinProviderId = extractLinkedInProviderId(linkedinUrl);

// Phase definitions
const phases = {
  1: { name: 'Silent Awareness', startDay: 1, endDay: 10 },
  2: { name: 'Connection', startDay: 12, endDay: 14 },
  3: { name: 'Warm Thanks', startDay: 15, endDay: 16 },
  4: { name: 'Advice Ask', startDay: 20, endDay: 22 },
  5: { name: 'Follow Up', startDay: 25, endDay: 27 },
  6: { name: 'Soft Offer', startDay: 30, endDay: 35 }
};

// Message templates
const messageTemplates = {
  connect_request: `Hi ${firstName}, I came across ${company} while researching ${industry} businesses in ${city}. Would love to connect.`,

  warm_thanks: `Hi ${firstName}, thanks for connecting! I noticed ${company} has been doing great work. No agenda — just good to be connected.`,

  advice_ask: `Hi ${firstName}, hope things are going well at ${company}. Quick question — what's been your biggest challenge with ${industry} lately? Always trying to learn from people in the field.`,

  follow_up: `Hi ${firstName}, following up on my last message. Totally understand if you're busy — just wanted to share that we've been helping businesses like ${company} with lead generation and automation. Happy to share more if useful.`,

  soft_offer: `Hi ${firstName}, last message from me — I help businesses like ${company} generate leads and book more meetings automatically. If that's ever relevant, I'd love to show you what we do. Either way, great connecting with you.`
};

// Determine action based on current phase and day
let actionType = 'skip';
let messageText = '';
let actionDescription = '';
let nextPhase = currentPhase;
let nextDay = currentDay + 1;
let newStatus = 'active';
let requiresConnection = false;

// Check if sequence is complete
if (currentDay > 35) {
  actionType = 'complete';
  newStatus = 'completed';
  actionDescription = 'Sequence completed';
}
// Phase 1: Silent Awareness (Days 1-10)
else if (currentPhase === 1 && currentDay >= 1 && currentDay <= 10) {
  // Alternate between view_profile and like_post
  if (currentDay <= 3) {
    actionType = 'view_profile';
    actionDescription = 'View LinkedIn profile (building awareness)';
  } else if (currentDay === 4 || currentDay === 7) {
    actionType = 'like_post';
    actionDescription = 'Like a recent LinkedIn post';
  } else if (currentDay === 5 || currentDay === 8) {
    actionType = 'view_profile';
    actionDescription = 'View LinkedIn profile again';
  } else {
    actionType = 'skip';
    actionDescription = 'Rest day - no action';
  }

  // Transition to Phase 2 after day 10
  if (currentDay === 10) {
    nextPhase = 2;
  }
}
// Gap days 11 - skip
else if (currentDay === 11) {
  actionType = 'skip';
  actionDescription = 'Gap day before connection phase';
  nextPhase = 2;
}
// Phase 2: Connection (Days 12-14)
else if (currentPhase === 2 && currentDay >= 12 && currentDay <= 14) {
  if (connectionStatus === 'connected') {
    // Already connected, advance to next phase
    actionType = 'skip';
    actionDescription = 'Already connected - advancing to next phase';
    if (currentDay === 14) {
      nextPhase = 3;
    }
  } else if (connectionStatus === 'pending') {
    // Connection request sent, waiting
    actionType = 'skip';
    actionDescription = 'Connection request pending - waiting for acceptance';
    if (currentDay === 14) {
      nextPhase = 3;
    }
  } else {
    // Send connection request on first day of phase
    if (currentDay === 12) {
      actionType = 'connect_request';
      messageText = messageTemplates.connect_request;
      actionDescription = 'Send personalized connection request';
    } else {
      actionType = 'skip';
      actionDescription = 'Waiting for connection response';
    }
    if (currentDay === 14) {
      nextPhase = 3;
    }
  }
}
// Gap days 15-16 transition check
else if (currentPhase === 2 && currentDay > 14) {
  nextPhase = 3;
  actionType = 'skip';
}
// Phase 3: Warm Thanks (Days 15-16)
else if (currentPhase === 3 && currentDay >= 15 && currentDay <= 16) {
  if (connectionStatus === 'connected') {
    if (currentDay === 15) {
      actionType = 'message';
      messageText = messageTemplates.warm_thanks;
      actionDescription = 'Send warm thanks message';
      requiresConnection = true;
    } else {
      actionType = 'skip';
      actionDescription = 'Rest day after thanks message';
    }
  } else {
    actionType = 'skip';
    actionDescription = 'Not connected yet - skipping message';
  }
  if (currentDay === 16) {
    nextPhase = 4;
  }
}
// Gap days 17-19
else if (currentDay >= 17 && currentDay <= 19) {
  actionType = 'skip';
  actionDescription = 'Gap day before advice ask phase';
  if (currentDay === 19) {
    nextPhase = 4;
  }
}
// Phase 4: Advice Ask (Days 20-22)
else if (currentPhase === 4 && currentDay >= 20 && currentDay <= 22) {
  if (connectionStatus === 'connected') {
    if (currentDay === 20) {
      actionType = 'message';
      messageText = messageTemplates.advice_ask;
      actionDescription = 'Send advice ask message';
      requiresConnection = true;
    } else {
      actionType = 'skip';
      actionDescription = 'Waiting for response to advice ask';
    }
  } else {
    actionType = 'skip';
    actionDescription = 'Not connected - skipping advice ask';
  }
  if (currentDay === 22) {
    nextPhase = 5;
  }
}
// Gap days 23-24
else if (currentDay >= 23 && currentDay <= 24) {
  actionType = 'skip';
  actionDescription = 'Gap day before follow up phase';
  if (currentDay === 24) {
    nextPhase = 5;
  }
}
// Phase 5: Follow Up (Days 25-27)
else if (currentPhase === 5 && currentDay >= 25 && currentDay <= 27) {
  if (connectionStatus === 'connected') {
    if (currentDay === 25) {
      actionType = 'message';
      messageText = messageTemplates.follow_up;
      actionDescription = 'Send follow up message';
      requiresConnection = true;
    } else {
      actionType = 'skip';
      actionDescription = 'Waiting after follow up';
    }
  } else {
    actionType = 'skip';
    actionDescription = 'Not connected - skipping follow up';
  }
  if (currentDay === 27) {
    nextPhase = 6;
  }
}
// Gap days 28-29
else if (currentDay >= 28 && currentDay <= 29) {
  actionType = 'skip';
  actionDescription = 'Gap day before soft offer phase';
  if (currentDay === 29) {
    nextPhase = 6;
  }
}
// Phase 6: Soft Offer (Days 30-35)
else if (currentPhase === 6 && currentDay >= 30 && currentDay <= 35) {
  if (connectionStatus === 'connected') {
    if (currentDay === 30) {
      actionType = 'message';
      messageText = messageTemplates.soft_offer;
      actionDescription = 'Send soft offer message';
      requiresConnection = true;
    } else {
      actionType = 'skip';
      actionDescription = 'Final days of sequence';
    }
  } else {
    actionType = 'skip';
    actionDescription = 'Not connected - skipping soft offer';
  }
  if (currentDay === 35) {
    newStatus = 'completed';
  }
}
// Catch-all for edge cases
else {
  actionType = 'skip';
  actionDescription = 'No action scheduled for this day';
}

// Calculate next action time (24 hours from now)
const nextActionAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

// Return the action specification
return {
  // Original enrollment data
  enrollment_id: enrollment.id,
  user_id: enrollment.user_id,
  lead_id: enrollment.lead_id,
  sequence_id: enrollment.sequence_id,

  // Lead data
  lead: lead,
  linkedin_url: linkedinUrl,
  linkedin_provider_id: linkedinProviderId,
  unipile_account_id: unipileAccountId,

  // Current state
  current_phase: currentPhase,
  current_day: currentDay,
  connection_status: connectionStatus,

  // Action to take
  action_type: actionType,
  action_description: actionDescription,
  message_text: messageText,
  requires_connection: requiresConnection,

  // Next state
  next_phase: nextPhase,
  next_day: nextDay,
  next_action_at: nextActionAt,
  new_status: newStatus,

  // Phase info for logging
  phase_name: phases[currentPhase]?.name || 'Unknown'
};
```

---

### NODE 7: IF Action Required

**Node Type:** IF
**Node Name:** `IF Action Required`

**Condition Configuration:**
- **Value 1 (Expression):** `{{ $json.action_type }}`
- **Operation:** String → Is Not Equal To
- **Value 2:** `skip`

**AND Condition:**
- **Value 1 (Expression):** `{{ $json.action_type }}`
- **Operation:** String → Is Not Equal To
- **Value 2:** `complete`

**Notes:**
- TRUE branch → Execute Action
- FALSE branch → Update Enrollment (skip action execution)

---

### NODE 8: Switch Action Type

**Node Type:** Switch
**Node Name:** `Switch Action Type`

**Connection:** Connect from "IF Action Required" TRUE output

**Settings:**
| Field | Value |
|-------|-------|
| Mode | Expression |
| Output Key (Expression) | `{{ $json.action_type }}` |

**Output Names:**
1. `view_profile`
2. `like_post`
3. `connect_request`
4. `message`

**Fallback Output:** `fallback` (connects to Update Enrollment)

---

### NODE 9: View Profile

**Node Type:** HTTP Request
**Node Name:** `View Profile`

**Connection:** Connect from "Switch Action Type" → `view_profile` output

**Settings:**
| Field | Value |
|-------|-------|
| Method | GET |
| URL (Expression) | `https://api4.unipile.com:13458/api/v1/users/{{ $json.linkedin_provider_id }}?account_id={{ $json.unipile_account_id }}` |
| Authentication | Predefined Credential Type |
| Credential Type | Header Auth |
| Header Auth | Unipile API |
| Continue On Fail | **ON** |

**Options:**
| Field | Value |
|-------|-------|
| Response Format | JSON |

---

### NODE 10: Get Recent Posts

**Node Type:** HTTP Request
**Node Name:** `Get Recent Posts`

**Connection:** Connect from "Switch Action Type" → `like_post` output

**Settings:**
| Field | Value |
|-------|-------|
| Method | GET |
| URL (Expression) | `https://api4.unipile.com:13458/api/v1/posts?account_id={{ $json.unipile_account_id }}&author={{ $json.linkedin_provider_id }}&limit=5` |
| Authentication | Predefined Credential Type |
| Credential Type | Header Auth |
| Header Auth | Unipile API |
| Continue On Fail | **ON** |

---

### NODE 11: IF Has Posts

**Node Type:** IF
**Node Name:** `IF Has Posts`

**Connection:** Connect from "Get Recent Posts"

**Condition Configuration:**
- **Value 1 (Expression):** `{{ $json.items?.length || 0 }}`
- **Operation:** Number > Greater Than
- **Value 2:** `0`

---

### NODE 12: Like Post

**Node Type:** HTTP Request
**Node Name:** `Like Post`

**Connection:** Connect from "IF Has Posts" TRUE output

**Settings:**
| Field | Value |
|-------|-------|
| Method | POST |
| URL (Expression) | `https://api4.unipile.com:13458/api/v1/posts/{{ $json.items[0].id }}/reactions` |
| Authentication | Predefined Credential Type |
| Credential Type | Header Auth |
| Header Auth | Unipile API |
| Send Body | ON |
| Body Content Type | JSON |
| Continue On Fail | **ON** |

**Body (JSON):**
```json
{
  "account_id": "{{ $json.unipile_account_id }}",
  "reaction_type": "LIKE"
}
```

**Note:** You'll need to pass through the original data. Add a Set node before this or use expression to access earlier node data: `{{ $('Determine Action').item.json.unipile_account_id }}`

---

### NODE 13: No Posts to Like

**Node Type:** Set
**Node Name:** `No Posts to Like`

**Connection:** Connect from "IF Has Posts" FALSE output

**Settings:**
| Field | Value |
|-------|-------|
| Mode | Manual Mapping |

**Fields to Set:**
| Name | Value (Expression) |
|------|---------------------|
| action_result | `no_posts_available` |
| original_data | `{{ $('Determine Action').item.json }}` |

---

### NODE 14: Send Connection Request

**Node Type:** HTTP Request
**Node Name:** `Send Connection Request`

**Connection:** Connect from "Switch Action Type" → `connect_request` output

**Settings:**
| Field | Value |
|-------|-------|
| Method | POST |
| URL | `https://api4.unipile.com:13458/api/v1/users/invite` |
| Authentication | Predefined Credential Type |
| Credential Type | Header Auth |
| Header Auth | Unipile API |
| Send Body | ON |
| Body Content Type | JSON |
| Continue On Fail | **ON** |

**Body (Expression Mode - use Expression for each field):**
```json
{
  "account_id": "{{ $json.unipile_account_id }}",
  "provider_id": "{{ $json.linkedin_provider_id }}",
  "message": "{{ $json.message_text }}"
}
```

**Actual JSON Body with Expressions:**
```
={
  "account_id": "{{ $json.unipile_account_id }}",
  "provider_id": "{{ $json.linkedin_provider_id }}",
  "message": "{{ $json.message_text }}"
}
```

---

### NODE 15: Send Message

**Node Type:** HTTP Request
**Node Name:** `Send Message`

**Connection:** Connect from "Switch Action Type" → `message` output

**Settings:**
| Field | Value |
|-------|-------|
| Method | POST |
| URL | `https://api4.unipile.com:13458/api/v1/chats` |
| Authentication | Predefined Credential Type |
| Credential Type | Header Auth |
| Header Auth | Unipile API |
| Send Body | ON |
| Body Content Type | JSON |
| Continue On Fail | **ON** |

**Body (Expression Mode):**
```
={
  "account_id": "{{ $json.unipile_account_id }}",
  "attendees_ids": ["{{ $json.linkedin_provider_id }}"],
  "text": "{{ $json.message_text }}"
}
```

---

### NODE 16: Merge Action Results

**Node Type:** Merge
**Node Name:** `Merge Action Results`

**Connection:** Connect ALL action outputs here:
- View Profile
- Like Post
- No Posts to Like
- Send Connection Request
- Send Message

**Settings:**
| Field | Value |
|-------|-------|
| Mode | Combine |
| Combination Mode | Merge By Position |

**Alternative:** Use multiple connections flowing into the next node (N8N handles this automatically)

---

### NODE 17: Prepare Log Entry

**Node Type:** Code
**Node Name:** `Prepare Log Entry`

**Connection:** Connect from Merge Action Results (or connect all action nodes directly here)

**Settings:**
| Field | Value |
|-------|-------|
| Mode | Run Once for Each Item |
| Language | JavaScript |

**JavaScript Code:**
```javascript
// Prepare the log entry for Supabase
const actionData = $('Determine Action').item.json;
const actionResult = $input.item.json;

// Determine if the action was successful
let status = 'sent';
let errorMessage = null;

// Check for error indicators in the response
if (actionResult.error || actionResult.statusCode >= 400) {
  status = 'failed';
  errorMessage = actionResult.error?.message || actionResult.message || 'Unknown error';
}

// Handle case where no posts were available to like
if (actionResult.action_result === 'no_posts_available') {
  status = 'skipped';
  errorMessage = 'No recent posts available to like';
}

// Build the log entry
const logEntry = {
  enrollment_id: actionData.enrollment_id,
  user_id: actionData.user_id,
  lead_id: actionData.lead_id,
  phase: actionData.current_phase,
  phase_name: actionData.phase_name,
  day: actionData.current_day,
  action_type: actionData.action_type,
  action_payload: {
    message_text: actionData.message_text || null,
    linkedin_url: actionData.linkedin_url,
    linkedin_provider_id: actionData.linkedin_provider_id,
    action_description: actionData.action_description
  },
  status: status,
  error_message: errorMessage,
  unipile_response: actionResult,
  created_at: new Date().toISOString()
};

// Also pass through the enrollment update data
return {
  log_entry: logEntry,
  enrollment_update: {
    id: actionData.enrollment_id,
    current_phase: actionData.next_phase,
    current_day: actionData.next_day,
    next_action_at: actionData.next_action_at,
    status: actionData.new_status,
    last_action_at: new Date().toISOString(),
    // Update connection status if we sent a connection request
    connection_status: actionData.action_type === 'connect_request' ? 'pending' : actionData.connection_status
  },
  action_status: status
};
```

---

### NODE 18: Log Action

**Node Type:** HTTP Request
**Node Name:** `Log Action`

**Connection:** Connect from "Prepare Log Entry"

**Settings:**
| Field | Value |
|-------|-------|
| Method | POST |
| URL | `https://rmcyfrqgmpnkvrgzeyxq.supabase.co/rest/v1/linkedin_action_log` |
| Authentication | Predefined Credential Type |
| Credential Type | Header Auth |
| Header Auth | Supabase API |
| Send Headers | ON |
| Send Body | ON |
| Body Content Type | JSON |
| Continue On Fail | **ON** |

**Additional Headers:**
| Name | Value |
|------|-------|
| Authorization | `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY3lmcnFnbXBua3ZyZ3pleXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA4NTQ5MCwiZXhwIjoyMDg2NjYxNDkwfQ.rsLKNUvn9AykmAsYdara50qrAyErbHP_YMEVz9PewAw` |
| Content-Type | `application/json` |
| Prefer | `return=minimal` |

**Body (Expression):**
```
={{ JSON.stringify($json.log_entry) }}
```

---

### NODE 19: Update Enrollment

**Node Type:** HTTP Request
**Node Name:** `Update Enrollment`

**Connection:** Connect from BOTH:
1. "Log Action" (after action was executed)
2. "IF Action Required" FALSE output (when action was skipped)

**Settings:**
| Field | Value |
|-------|-------|
| Method | PATCH |
| URL (Expression) | `https://rmcyfrqgmpnkvrgzeyxq.supabase.co/rest/v1/linkedin_enrollments?id=eq.{{ $json.enrollment_update?.id || $json.enrollment_id }}` |
| Authentication | Predefined Credential Type |
| Credential Type | Header Auth |
| Header Auth | Supabase API |
| Send Headers | ON |
| Send Body | ON |
| Body Content Type | JSON |
| Continue On Fail | **ON** |

**Additional Headers:**
| Name | Value |
|------|-------|
| Authorization | `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJtY3lmcnFnbXBua3ZyZ3pleXhxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTA4NTQ5MCwiZXhwIjoyMDg2NjYxNDkwfQ.rsLKNUvn9AykmAsYdara50qrAyErbHP_YMEVz9PewAw` |
| Content-Type | `application/json` |
| Prefer | `return=minimal` |

**Body (Code Node Before or Expression):**

For items coming from Log Action path:
```
={{ JSON.stringify({
  current_phase: $json.enrollment_update.current_phase,
  current_day: $json.enrollment_update.current_day,
  next_action_at: $json.enrollment_update.next_action_at,
  status: $json.enrollment_update.status,
  last_action_at: $json.enrollment_update.last_action_at,
  connection_status: $json.enrollment_update.connection_status
}) }}
```

**Alternative: Add a Prepare Skip Update node for the FALSE path:**

---

### NODE 20: Prepare Skip Update

**Node Type:** Code
**Node Name:** `Prepare Skip Update`

**Connection:** Connect from "IF Action Required" FALSE output

**Settings:**
| Field | Value |
|-------|-------|
| Mode | Run Once for Each Item |
| Language | JavaScript |

**JavaScript Code:**
```javascript
// Prepare update for skipped actions
const actionData = $input.item.json;

return {
  enrollment_update: {
    id: actionData.enrollment_id,
    current_phase: actionData.next_phase,
    current_day: actionData.next_day,
    next_action_at: actionData.next_action_at,
    status: actionData.new_status,
    last_action_at: new Date().toISOString()
  }
};
```

Then connect this to a copy of the Update Enrollment node (or use a Merge before Update Enrollment).

---

### NODE 21: Loop Complete

**Node Type:** No Operation, do nothing
**Node Name:** `Loop Complete`

**Connection:** Connect from "Update Enrollment"

**Notes:** This node connects back to "Split In Batches" to process the next enrollment. N8N handles this automatically — the Split In Batches node will continue with the next item.

---

## Complete Workflow Connection Map

```
[Schedule Trigger]
        ↓
[Get Active Enrollments]
        ↓
[IF Has Enrollments]
    ├── FALSE → [No Enrollments] (end)
    └── TRUE  → [Split In Batches]
                      ↓
               [Determine Action]
                      ↓
               [IF Action Required]
                  ├── FALSE → [Prepare Skip Update] → [Update Enrollment] → (loop back)
                  └── TRUE  → [Switch Action Type]
                                  ├── view_profile → [View Profile] ─────────────────┐
                                  ├── like_post → [Get Recent Posts]                  │
                                  │                    ↓                              │
                                  │              [IF Has Posts]                       │
                                  │                 ├── FALSE → [No Posts to Like] ──┤
                                  │                 └── TRUE  → [Like Post] ─────────┤
                                  ├── connect_request → [Send Connection Request] ───┤
                                  └── message → [Send Message] ──────────────────────┤
                                                                                      ↓
                                                                           [Prepare Log Entry]
                                                                                      ↓
                                                                              [Log Action]
                                                                                      ↓
                                                                          [Update Enrollment]
                                                                                      ↓
                                                                             [Loop Complete]
                                                                                      ↓
                                                                         (back to Split In Batches)
```

---

## Database Tables Required

Ensure these tables exist in Supabase:

### linkedin_enrollments
```sql
CREATE TABLE linkedin_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  lead_id UUID REFERENCES leads(id),
  sequence_id UUID REFERENCES linkedin_sequences(id),
  unipile_account_id TEXT NOT NULL,
  linkedin_url TEXT,
  current_phase INTEGER DEFAULT 1,
  current_day INTEGER DEFAULT 1,
  connection_status TEXT DEFAULT 'none', -- none, pending, connected
  status TEXT DEFAULT 'active', -- active, paused, completed, failed
  next_action_at TIMESTAMPTZ DEFAULT NOW(),
  last_action_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_enrollments_active ON linkedin_enrollments(status, next_action_at)
  WHERE status = 'active';
```

### linkedin_action_log
```sql
CREATE TABLE linkedin_action_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID REFERENCES linkedin_enrollments(id),
  user_id UUID REFERENCES auth.users(id),
  lead_id UUID REFERENCES leads(id),
  phase INTEGER,
  phase_name TEXT,
  day INTEGER,
  action_type TEXT NOT NULL,
  action_payload JSONB,
  status TEXT DEFAULT 'sent', -- sent, failed, skipped
  error_message TEXT,
  unipile_response JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_action_log_enrollment ON linkedin_action_log(enrollment_id);
CREATE INDEX idx_action_log_user ON linkedin_action_log(user_id);
```

---

## Testing the Workflow

### Step 1: Manual Test Run
1. Create a test enrollment in Supabase with:
   - `status`: 'active'
   - `next_action_at`: a past timestamp
   - `current_phase`: 1
   - `current_day`: 1
   - Valid `unipile_account_id`
   - A linked lead with `linkedin` URL

2. Click "Test Workflow" in N8N

3. Check:
   - Get Active Enrollments returns your test enrollment
   - Determine Action outputs correct action_type
   - Unipile API calls succeed (or fail gracefully)
   - Log entry is created in linkedin_action_log
   - Enrollment is updated with new day/phase

### Step 2: Test Each Phase
Create test enrollments at different day numbers:
- Day 1 → should view_profile
- Day 4 → should like_post
- Day 12 → should connect_request
- Day 15 → should message (if connected)
- Day 20 → should message (advice ask)
- Day 30 → should message (soft offer)
- Day 36 → should mark as completed

---

## Rate Limiting Considerations

LinkedIn/Unipile may have rate limits. To handle this:

1. The workflow already processes one enrollment at a time (batch size 1)
2. Add a Wait node after Update Enrollment if needed:

**Optional: Add Wait Node**
| Field | Value |
|-------|-------|
| Resume | After Time Interval |
| Wait Amount | 5 |
| Wait Unit | Seconds |

This adds a 5-second delay between each enrollment processed.

---

## Error Handling

The workflow uses "Continue On Fail: ON" for all Unipile API calls. This means:
- If an API call fails, the workflow continues
- The error is captured in the Prepare Log Entry node
- Failed actions are logged with `status: 'failed'`
- The enrollment still advances to prevent infinite retries

For critical failures, you may want to add error notification (Slack, email) after the Log Action node when `status === 'failed'`.

---

## Webhook for Connection Acceptance (Optional Enhancement)

To detect when a connection request is accepted, you could add a separate webhook workflow:

1. Set up a Unipile webhook for connection events
2. When connection is accepted:
   - Update enrollment `connection_status` to 'connected'
   - Optionally trigger immediate next action

This is an advanced enhancement beyond the core workflow.
