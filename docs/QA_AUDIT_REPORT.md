# Leadomation QA Audit Report
**Date:** March 2026
**Auditor:** Claude Code
**Scope:** Full frontend, landing page, and API audit

---

## EXECUTIVE SUMMARY

| Severity | Count |
|----------|-------|
| CRITICAL | 8 |
| HIGH | 19 |
| MEDIUM | 23 |
| LOW | 18 |

---

## CRITICAL ISSUES (Blocks Launch)

### C1. Missing API Authentication (8 endpoints)
**Files:** Multiple API files
**Problem:** 8 API endpoints accept requests without verifying user authentication:
- `api/cancellation-reason.ts` - Accepts any POST with user-supplied userId
- `api/send-inbox-reply.ts` - No ownership verification
- `api/classify-email.ts` - No ownership verification
- `api/spam-check.ts` - Any user can consume AI quota
- `api/generate-sequence.ts` - Any user can consume AI quota
- `api/regenerate-step.ts` - Any user can consume AI quota
- `api/cron/daily-emails.ts` - Auth check is commented out (lines 18-21)
- `api/cron/run-sequences.ts` - No cron secret verification

**Fix:** Add authentication verification to all endpoints using Supabase JWT validation.

### C2. Trial Users Getting Pro Access
**File:** `src/pages/NewCampaign.tsx:283`
**Problem:** `canAccessProFeatures = userPlan === 'pro' || userPlan === 'trial'` incorrectly grants Trial users Pro-only features.
**Fix:** Change to `const canAccessProFeatures = userPlan === 'pro';`

### C3. Smart Intent Filters Accessible to Trial
**File:** `src/pages/NewCampaign.tsx:687`
**Problem:** Trial users can access Pro-only Smart Intent Filters.
**Fix:** Change gate condition from `!isStarterPlan` to `userPlan === 'pro'`

---

## HIGH PRIORITY ISSUES (Poor UX / First Users Will Notice)

### H1. No Rate Limiting on AI Endpoints
**Files:** `spam-check.ts`, `generate-sequence.ts`, `regenerate-step.ts`, `classify-email.ts`
**Problem:** Users can make unlimited requests, exhausting API quota and costs.
**Fix:** Implement rate limiting (e.g., 10 requests/minute per user).

### H2. Incomplete Features in UI
**Files:** Multiple
**Problems:**
- `ActiveCampaigns.tsx:425` - "View Full Analytics" shows `alert('Coming soon')`
- `NewCampaign.tsx:559` - Custom tag creation shows alert
- `Integrations.tsx:65,69` - LinkedIn/Email OAuth show "coming soon"

**Fix:** Either implement features or remove buttons, or add proper "Coming Soon" disabled state with tooltip.

### H3. Unenforced Plan Limits
| Feature | Plan | Limit | Status |
|---------|------|-------|--------|
| Emails/day | Starter | 50 | NOT ENFORCED |
| Keyword searches | Starter | 50/mo | NOT ENFORCED |

**Fix:** Add enforcement in relevant API endpoints and UI.

### H4. Missing Null Checks in APIs
**File:** `api/execute-sequences.ts:33-36`
**Problem:** `enrollment.sequences` and `enrollment.leads` accessed without null checks.
**Fix:** Add null checks before accessing properties.

**File:** `api/classify-email.ts:54`
**Problem:** `message.content[0]` accessed without checking array length.
**Fix:** Check `message.content.length > 0` before accessing.

### H5. Silent Webhook Failures
**File:** `src/pages/NewCampaign.tsx:459`
**Problem:** N8N webhook call catches errors but doesn't update UI.
**Fix:** Add `setError('Failed to start campaign scraping');` in catch block.

### H6. Campaign Load Errors Not Shown
**File:** `src/pages/ActiveCampaigns.tsx:101-105`
**Problem:** Campaign fetch error logged but not displayed to user.
**Fix:** Show error banner or toast notification.

### H7. Webhook Idempotency Missing
**File:** `api/stripe-webhook.ts`
**Problem:** No idempotency check. Webhook retries will process same event twice.
**Fix:** Store processed webhook IDs in database, skip if already processed.

### H8. User Data in Request Body (Security)
**Files:** `UpgradeModal.tsx`, `UpgradePrompt.tsx`
**Problem:** `userId` and `userEmail` sent in request body instead of derived from JWT.
**Fix:** Remove from request body, derive from token server-side.

### H9. Testimonial Copy Issues
**File:** `src/pages/LandingPage.tsx:223-227`
**Problems:**
- "actually sound human" - defensive language
- "game-changer" - clichéd marketing
- "incredibly fast" - vague superlative
- "untapped markets" - buzzword
- "shockingly good" - sensationalism

**Fix:** Rewrite testimonials with more genuine, specific language.

---

## MEDIUM PRIORITY ISSUES (Polish Before Marketing)

### M1. Input Validation Missing
| File | Issue |
|------|-------|
| `api/send-email.ts:11` | No email format validation |
| `api/generate-sequence.ts:20` | No validation on `num_steps` |
| `api/keyword-search-volume.ts:14-16` | No array length or content validation |
| `api/cancellation-reason.ts:12` | No length limit on `reason` field |
| `api/send-inbox-reply.ts:27` | User content not HTML-escaped |

### M2. Error Information Leakage
Multiple API endpoints return `error.message` to client, potentially exposing internal details:
- `api/create-checkout-session.ts:59-62`
- `api/keyword-search-volume.ts:94`
- `api/spam-check.ts:56-58`
- `api/generate-sequence.ts:72-74`
- `api/regenerate-step.ts:76-80`
- `api/stripe-webhook.ts:128`

**Fix:** Return generic error messages, log details server-side.

### M3. Missing Try/Catch
**File:** `api/execute-sequences.ts:15-24`
**Problem:** Initial database query not wrapped in try/catch.

**File:** `api/cron/run-sequences.ts`
**Problem:** No try/catch block at all.

### M4. LeadDatabase Missing Plan Gating
**File:** `src/pages/LeadDatabase.tsx`
**Problem:** `canAccess` prop defined but never used for batch operations.
**Fix:** Add plan checks for batch enroll and batch call queue.

### M5. Sidebar Emoji Inconsistency
**File:** `src/components/Sidebar.tsx`
**Lines:** 282, 301, 313, 360
**Problem:** Emojis in nav labels (📊, 📞, 📥, 💎) inconsistent with rest of codebase.
**Fix:** Remove emojis, rely on icons only.

### M6. Modal Mobile Responsiveness
**File:** `src/components/SpamCheckModal.tsx:239`
**Problem:** `max-w-3xl` too wide for mobile.
**Fix:** Use `max-w-md md:max-w-3xl`.

### M7. TopBar Fixed Height
**File:** `src/components/TopBar.tsx:63`
**Problem:** `h-20` fixed height should be responsive.
**Fix:** Use `h-16 md:h-20`.

### M8. CampaignPerformance Missing Error State
**File:** `src/components/CampaignPerformance.tsx:102-116`
**Problem:** Has loading state but no error state if fetch fails.
**Fix:** Add error state similar to empty state pattern.

### M9. Pricing Page Feature Mismatch
**File:** `src/pages/Pricing.tsx:277-294`
**Problem:** Pro features listed don't match actual gated features.
**Fix:** Sync feature list with actual plan gates to avoid false marketing.

---

## LOW PRIORITY ISSUES (Post-Launch)

### L1. Hardcoded Email Address
**Files:** `api/send-email.ts`, `api/execute-sequences.ts`, `api/stripe-webhook.ts`, `api/cron/daily-emails.ts`
**Problem:** `iainliddle@leadomation.co.uk` hardcoded in multiple files.
**Fix:** Move to environment variable `RESEND_FROM_EMAIL`.

### L2. Design System Color Inconsistencies
| File | Issue |
|------|-------|
| `StatCard.tsx:26-28` | Custom hex colors instead of Tailwind |
| `FeatureGate.tsx:30` | `bg-[#F3F4F6]` instead of `bg-gray-100` |
| `Settings.tsx:339-355` | Inline styles instead of Tailwind |

### L3. OnboardingModal/TrialBanner Emojis
**Files:** `OnboardingModal.tsx:57`, `TrialBanner.tsx:47`
**Problem:** Uses emojis (🚀, ⚠️) instead of icons.
**Fix:** Use Lucide icons for consistency.

### L4. TopCampaigns Button Font Weight
**File:** `src/components/TopCampaigns.tsx:118`
**Problem:** Conflicting `font-bold` and `font-black` classes.
**Fix:** Use single consistent weight.

### L5. Sidebar Real-time Error Handling
**File:** `src/components/Sidebar.tsx:110-169`
**Problem:** No visual indicator if `loadCounts()` fails.
**Fix:** Add fallback or error state.

### L6. Lead Limits Hardcoded
**File:** `src/pages/NewCampaign.tsx:306`
**Problem:** `max="500"` doesn't respect plan limits.
**Fix:** Set max based on user plan.

### L7. Sequence Step Limits Location
**File:** `src/pages/SequenceBuilder.tsx:173`
**Problem:** Step limits hardcoded in component, should be in central config.
**Fix:** Move to `planLimits.ts`.

---

## PLAN GATING VERIFICATION

### Correctly Gated Features ✓
- Sequence step limits (Trial: 2, Starter: 4, Pro: unlimited)
- Campaign limits (Trial: 5, Starter: 3, Pro: unlimited)
- Lead limits (Trial: 100, Starter: 500, Pro: unlimited)
- LinkedIn strategy (Pro only)
- Full Pipeline strategy (Pro only)
- CSV Export (Starter+)
- Deal Pipeline (Pro only)
- Global Demand (Pro only)
- Lead Inbox (Pro only)

### Incorrectly Gated Features
- Smart Intent Filters - Trial users have access (should be Pro only)
- Pro features access - Trial users incorrectly included

### Unenforced Limits
- Daily email limit (50 for Starter)
- Keyword search limit (50/month for Starter)

---

## LANDING PAGE VERIFICATION

### Pricing ✓
- Starter: £49/month (correct)
- Pro: £149/month (correct)
- Scale: "Coming Soon" ribbon present (correct)

### CTAs ✓
- All buttons properly wired to correct routes
- All scroll anchors functional
- Sign In / Register flows correct

### Copy Issues
- 5 testimonial phrases need refinement (see H9)
- No em-dashes in customer-facing copy (only in code comments)

### Design System ✓
- Consistent color palette
- Responsive breakpoints at 1024px, 768px, 480px
- Consistent button styling

---

## SECURITY SUMMARY

### Good Practices ✓
- No API keys exposed in frontend code
- All Supabase queries filter by user_id
- No SQL injection vulnerabilities (parameterized queries)
- Stripe webhook signature verification implemented

### Needs Improvement
- 8 API endpoints missing authentication
- No rate limiting on AI endpoints
- User data sent in request body instead of JWT
- No webhook idempotency
- HTML content not escaped in some endpoints

---

## RECOMMENDED FIX ORDER

### Week 1 (Critical)
1. Add authentication to all 8 unprotected API endpoints
2. Fix trial users getting Pro access (2 changes)
3. Add rate limiting to AI endpoints

### Week 2 (High Priority)
4. Enforce email/day and keyword search limits
5. Add null checks to API endpoints
6. Fix webhook failures showing to users
7. Implement webhook idempotency
8. Rewrite testimonial copy

### Week 3 (Medium Priority)
9. Add input validation to all API endpoints
10. Fix error information leakage
11. Add missing error/empty states
12. Mobile responsiveness fixes

### Post-Launch (Low Priority)
13. Move hardcoded values to env vars
14. Design system consistency cleanup
15. Remove emojis from nav/modals
16. Centralize plan limits config

---

## FILES REQUIRING CHANGES

### Critical Changes
- `api/cancellation-reason.ts`
- `api/send-inbox-reply.ts`
- `api/classify-email.ts`
- `api/spam-check.ts`
- `api/generate-sequence.ts`
- `api/regenerate-step.ts`
- `api/cron/daily-emails.ts`
- `api/cron/run-sequences.ts`
- `src/pages/NewCampaign.tsx`

### High Priority Changes
- `api/execute-sequences.ts`
- `api/stripe-webhook.ts`
- `src/pages/ActiveCampaigns.tsx`
- `src/pages/Integrations.tsx`
- `src/pages/LandingPage.tsx`
- `src/components/UpgradeModal.tsx`
- `src/components/UpgradePrompt.tsx`

### Medium Priority Changes
- `src/pages/LeadDatabase.tsx`
- `src/pages/Pricing.tsx`
- `src/components/Sidebar.tsx`
- `src/components/SpamCheckModal.tsx`
- `src/components/TopBar.tsx`
- `src/components/CampaignPerformance.tsx`

---

*Report generated by Claude Code QA Audit*
