# CLAUDE.md - Leadomation Project Context

## Project Overview

Leadomation is a B2B lead generation and outreach automation SaaS platform built by Iain Liddle (Lumarr Ltd, UAE). The product automates finding business leads via Google Maps scraping, enriching them with contact data and intent signals, then running multi-channel outreach sequences via email, AI voice calls and LinkedIn automation.

- URL: https://www.leadomation.co.uk
- Status: Pre-launch. QA complete, final fixes in progress.
- GitHub: github.com/iainliddle/leadomation (branch: main)
- Vercel project: leadomation-d1a1

## How Iain Builds - READ THIS FIRST

Iain does NOT write code manually. Every change goes through Claude Code or Antigravity (VS Code AI extension). Follow these rules on every task:

1. After ANY code changes, always provide git commands: `git add -A`, `git commit -m '...'`, `git push`
2. All SQL must be run manually in Supabase SQL Editor. Always provide the exact SQL.
3. N8N workflows are built manually in the N8N dashboard. Provide exact node configurations.
4. Multiple Claude Code agents can run in parallel in Antigravity as long as they work on different files.
5. Always push to main branch. This is the production branch.
6. Check available skills before starting any task. Custom skills are loaded in Antigravity.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React + TypeScript + Vite (deployed on Vercel) |
| Database | Supabase (PostgreSQL) |
| Automation | N8N (self-hosted, Docker) |
| Email | Resend (from: iainliddle@leadomation.co.uk) |
| Payments | Stripe |
| AI Voice | Vapi.ai + Twilio |
| LinkedIn | Unipile |
| Lead Scraping | Apify (Google Maps) |
| Email Finding | Hunter.io (Starter, 2000 credits/mo) |
| Enrichment | Apollo.io (Basic, $49/mo) |
| AI | Anthropic Claude API |
| SEO Data | DataForSEO |
| DNS/CDN | Cloudflare |

## Design System - Boxera

ALL UI must follow the Leadomation Boxera design system. Never deviate from these rules.

### Colours

| Token | Value |
|-------|-------|
| Primary | #4F46E5 (Indigo) |
| Primary Dark | #4338CA |
| Primary Light | #EEF2FF |
| Cyan/Teal | #22D3EE (secondary CTA buttons) |
| Page Background | #F8F9FA |
| Card Background | #FFFFFF |
| Border | #E5E7EB |
| Text Primary | #111827 |
| Text Secondary | #6B7280 |
| Text Muted | #9CA3AF |

### Layout Rules

- Page root: `className='p-6 bg-[#F8F9FA] min-h-screen'`
- All cards: `bg-white rounded-xl border border-gray-200 shadow-sm`
- NO native `<select>` elements. All dropdowns must be custom React components.
- ALL button text must be sentence case. NEVER uppercase.
- NEVER use `font-black` anywhere.
- TopBar background must be `bg-[#F8F9FA]` (not white).
- NO em-dashes anywhere in UI copy or code. Use hyphens only.
- Light mode only.
- Primary button: `bg-[#4F46E5] text-white rounded-lg text-sm font-medium hover:bg-[#4338CA]`
- Secondary CTA button (View Leads, Use, Connect): `bg-[#22D3EE] text-white rounded-lg text-sm font-medium hover:bg-[#06B6D4]`

## Credentials

| Credential | Value |
|-----------|-------|
| Supabase URL | https://rmcyfrqgmpnkvrgzeyxq.supabase.co |
| Supabase Project | rmcyfrqgmpnkvrgzeyxq |
| N8N | https://n8n.srv1377696.hstgr.cloud |
| Unipile DSN | api4.unipile.com:13458 |
| Unipile Account ID | 4FUgDVu3RyaxwstoCY3k7Q |
| Vapi Assistant ID | 05bf6227-d42d-4f2e-b008-bc3d3377c68e |
| Iain User ID | 66171da2-7937-4149-97d8-b929974987c7 |
| Iain's Account | Permanently on Pro, trial_end = 2099 |

### Stripe Price IDs

| Plan | Price ID |
|------|----------|
| Starter Monthly (£59/mo) | price_1TDOsn2LCoJYV9n6gOvnD106 |
| Starter Annual (£566/yr) | price_1TDOup2LCoJYV9n63trbI9Ma |
| Pro Monthly (£159/mo) | price_1TDOvT2LCoJYV9n60fKRQSig |
| Pro Annual (£1,526/yr) | price_1TDOvz2LCoJYV9n6mN8itZQe |

## Pricing and Plans

| Feature | Starter £59/mo | Pro £159/mo | Scale £359/mo |
|---------|---------------|-------------|---------------|
| Leads/month | 300 | 2,000 | 3,000 |
| Emails/day | 30 | 100 | 250 |
| AI Voice calls/mo | 0 | 50 | 150 |
| Keyword searches/mo | 25 | 75 | 150 |
| LinkedIn Sequencer | No | Yes | Yes |

Scale tier is NOT being built pre-launch. Show "Coming Soon" only. NEVER build Scale tier features (SMS, WhatsApp, AI Video).

## N8N Workflows

| Workflow | ID | Status |
|----------|----|--------|
| LinkedIn Relationship Sequencer | CZuS9Jj3jcJtSBif | Published |
| Lead Enrichment | LRCsI71DkWzH8NFN | Published |
| Email Sequence Processor | - | Published (call channel extension pending) |
| Monthly Usage Reset | - | NOT BUILT (spec at docs/n8n-workflows/monthly-usage-reset.md) |
| LinkedIn Keyword Monitor | - | NOT BUILT (frontend KeywordMonitor.tsx built) |
| Resend Email Events Processor | - | Published |
| Intent Score Processor | - | Published (30 min schedule) |
| Vapi Post-Call Handler | - | Published |
| Campaign Performance Analyser | - | NOT BUILT (13 nodes, 4-session build, spec in docs/) |

## Outstanding Pre-Launch Tasks (Priority Order)

### Priority 1 - Fix Before Launch (Code Changes)

1. Cyan button colour consistency: Force `bg-[#22D3EE] text-white` on Connect email account (Integrations) and View Leads (Active Campaigns).
2. Settings page four broken buttons: Update payment method (Stripe portal), Download invoices (Stripe API), Change plan (navigate to /pricing), Notifications Save preferences (wire to Supabase profiles table).
3. Supabase WebSocket CHANNEL_ERROR flooding console from Dashboard Live Feed subscription.

### Priority 2 - Manual Verification (No Code)

COMP-01 through COMP-08 compliance tests. See handover document v6 for full details.

### Priority 3 - Pre-Launch Data Cleanup

Delete all test data from Supabase before first customer onboards. SQL provided in handover document v6.

### Lower Priority - Post-Launch

- Apollo.io card missing from Integrations infrastructure grid
- Deal card "Manual" tooltip
- Calendar timezone indicator and colour legend
- Feature comparison table missing Scale column
- Duplicate campaign name warning

## Hard Rules - NEVER Break These

1. NEVER use em-dashes anywhere in UI copy or code. Use hyphens only.
2. NEVER use native `<select>` elements. Always custom React dropdown components.
3. NEVER use `font-black` anywhere.
4. NEVER build Scale tier features. Coming Soon only.
5. ALWAYS provide git commands after code changes.
6. ALWAYS provide SQL separately for Iain to run in Supabase.
7. ALWAYS check planLimits.ts before adding new features. Gating must match the plan table.
8. ALWAYS follow Boxera design system colours exactly.
9. Cyan secondary CTA buttons must always use `bg-[#22D3EE] text-white`. Never a darker shade.
10. The current Stripe webhook endpoint is on the www subdomain. Never change this.
11. TipTap is used for the email signature rich text editor in EmailConfig.tsx.
12. Supabase Storage bucket 'signature-images' exists with public read and authenticated upload policies.
13. All test data in the database is Iain's testing. Do not delete without asking.

## Campaign Performance Analyser - Pre-Launch Feature

A Claude-powered analytics engine that auto-generates personalised performance reports for each user. This is a key market differentiator. Primary marketing message: "The longer you use Leadomation, the better your results get."

### How It Works

- N8N workflow runs every 6 hours (Cron trigger)
- Stays dormant until Leadomation reaches 5+ active users (zero cost before activation)
- Once active, checks each user's unanalysed email volume
- Runs Claude analysis for any user with 50+ unanalysed emails since last report
- Stores structured report in Supabase (powers in-app dashboard)
- Sends HTML summary email via Resend with key insights and CTA to view full report
- Parallel aggregate analysis runs across all users for admin system-wide view

### Supabase Tables Required (Run Before Build)

- `performance_reports` table: id, user_id, report_type ('user' or 'aggregate'), report_data (JSONB), emails_analysed, period_start, period_end, created_at
- `aggregate_performance` table: id, total_users, total_emails, avg_open_rate, avg_click_rate, avg_reply_rate, avg_bounce_rate, top_subject_patterns (JSONB), worst_subject_patterns (JSONB), intent_accuracy, spam_false_positive_rate, spam_false_negative_rate, recommendations (JSONB), created_at
- Column additions: `ALTER TABLE email_events ADD COLUMN IF NOT EXISTS analysed BOOLEAN DEFAULT false; ALTER TABLE email_events ADD COLUMN IF NOT EXISTS analysed_at TIMESTAMPTZ;`

### N8N Workflow - 13 Nodes

1. Schedule Trigger (every 6 hours)
2. Check Active User Count (Supabase SQL: COUNT DISTINCT active profiles)
3. Activation Gate (IF active_count >= 5, else workflow ends)
4. Fetch Active Users (Supabase Get Many from profiles)
5. Split Into Batches (batch size 1, prevents Claude rate limits)
6. Count Unanalysed Emails (Supabase SQL per user, analysed = false)
7. Email Threshold Check (IF email_count >= 50, else skip to next user)
8. Collect Performance Data (Code node: 4 Supabase queries merged into single JSON - campaign_metrics, intent_accuracy, sequence_performance, spam_outcomes)
9. Claude Analysis (HTTP Request to Claude API, Sonnet, returns structured JSON with summary, rates, patterns, recommendations)
10. Store Report in Supabase (Insert to performance_reports)
11. Send Report Email via Resend (HTML template with metrics and top 3 recommendations)
12. Mark Emails Analysed (UPDATE email_events SET analysed = true WHERE user_id = X AND analysed = false)
13. Log Aggregate Metrics (Code node + Supabase Insert to aggregate_performance)

### Claude API Prompt (Node 9)

System prompt instructs Claude to return valid JSON only with: summary, open/click/reply/bounce rate averages, top/worst subject patterns, best send window, sequence insights, intent accuracy, spam accuracy (false positive/negative), and 5 ranked recommendations with priority and expected impact.

### Frontend Component: PerformanceInsights.tsx

- Dashboard component or dedicated route
- Reads latest performance_report for logged-in user
- Renders: summary card with trend indicators, top 3 recommendations with priority badges, subject line insights, sequence step heatmap, intent accuracy with trend arrow, report timestamp with "next report after X more emails" indicator
- Pro feature only. Starter users see locked preview with upgrade prompt.

### Build Order (4 Sessions)

1. Database SQL migrations + N8N Nodes 1-7 (trigger through threshold check)
2. N8N Nodes 8-9 (data collection + Claude analysis)
3. N8N Nodes 10-13 (output, email, cleanup, aggregation)
4. Frontend PerformanceInsights.tsx with Pro gating

### Cost Per Run

- Claude API: ~$0.01-0.03 per user analysis (Sonnet, ~1500 input + 1500 output tokens)
- At 50 users: ~$0.50-$1.50 per 6-hour run
- At 500 users: ~$5-$15 per run
- Supabase queries and Resend emails within existing plan limits

### Marketing Angle

- Landing page section positioned between feature grid and pricing as premium differentiator
- Pricing page: Pro tier highlighted item, Starter tier shows "Campaign Performance Reports (upgrade to Pro)" to drive upgrades
- Key messaging: "Every campaign teaches the system what converts for your audience"
- Words to use: performance profile, personalised, pattern recognition, compounding, learns
- Words to avoid: AI-powered (overused), machine learning (too technical for ICP), revolutionary, game-changing
- Competitive positioning: "Most outreach tools give you static templates. Leadomation learns from your campaigns." Never name competitors directly.

### Full Specs Location

- N8N workflow spec: docs/campaign-performance-analyser-n8n-spec.md
- Marketing copy: docs/campaign-performance-analyser-marketing.md
- Architecture diagram (HTML): docs/leadomation-performance-analyser-architecture.html
- Architecture diagram note: The PDF version exported blank from iOS. Use the HTML version as the source of truth.

### Architecture Diagram - 6 Stages

The HTML architecture diagram shows the full 13-node workflow across 6 stages:

- Stage 1 - Activation Gate: Cron trigger (every 6h) into activation check (5+ active users or stop)
- Stage 2 - Per-User Eligibility: Fetch active users, split into batches (1 at a time), count unanalysed emails (50+ threshold or skip)
- Stage 3 - Data Collection: 4 parallel Supabase queries (campaign metrics, intent accuracy, sequence performance, spam outcomes)
- Stage 4 - Claude Analysis: Single HTTP request to Claude API with all collected data, returns structured JSON with recommendations
- Stage 5 - Dual Output: Store report in Supabase (performance_reports) + send HTML email via Resend (parallel)
- Stage 6 - Cleanup: Mark emails as analysed + log aggregate metrics to aggregate_performance table

Colour coding: Cyan = data source, Indigo = processing, Green = AI analysis, Amber = output/trigger, Red = gate/condition.

## Post-Launch Roadmap

- LinkedIn Keyword Monitor N8N workflow (frontend built, needs N8N setup)
- LinkedIn reply AI response drafting
- Call Practice Mode (Claude plays AI prospect, user rehearses script)
- Transcript Insights (Claude analyses Vapi call transcripts)
- Dedicated cost review session (all API costs per plan, break-even analysis)
- Inbox reply composer
- Recent calls log on Call Agent page
- Email Sequence Processor call channel extension
- Monthly Usage Reset N8N workflow
- Apollo enrichment end-to-end test
