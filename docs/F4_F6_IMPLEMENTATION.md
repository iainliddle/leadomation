# F4 & F6 Implementation Guide

## Overview
This document contains:
1. **F4**: SQL to seed 25 email templates
2. **F6**: A/B testing logic for N8N Email Sequence Processor

---

## PART 1: F4 — SEED EMAIL TEMPLATE LIBRARY

### Schema Update (Run First)

Before inserting templates, ensure the `email_templates` table has the required columns:

```sql
-- Add missing columns to email_templates if they don't exist
ALTER TABLE email_templates
ADD COLUMN IF NOT EXISTS delay_days INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS is_system BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS industry TEXT,
ADD COLUMN IF NOT EXISTS use_case TEXT;

-- Create index for system templates
CREATE INDEX IF NOT EXISTS idx_email_templates_is_system ON email_templates(is_system) WHERE is_system = true;
```

### Insert 25 System Templates (Run Second)

Copy and paste this entire block into Supabase SQL Editor:

```sql
INSERT INTO email_templates (user_id, name, subject, body, delay_days, is_system, industry, use_case, created_at, updated_at)
VALUES

-- =====================================================
-- RESTAURANTS (3 Templates)
-- =====================================================

(NULL, 'Restaurant New Customer Outreach',
'Quick idea for {{business_name}}',
'Hi {{first_name}},

I came across {{business_name}} while researching top restaurants in {{city}} and was genuinely impressed by your {{rating}} star rating.

I help restaurants like yours attract more local diners through targeted digital marketing. Many of our restaurant clients have seen a 30% increase in midweek bookings within 60 days.

Would you be open to a quick 10 minute call this week to see if this could work for {{business_name}}?

Looking forward to hearing from you.',
0, true, 'Restaurants', 'new_customer_outreach', NOW(), NOW()),

(NULL, 'Restaurant Review Generation',
'Helping {{business_name}} get more 5 star reviews',
'Hi {{first_name}},

I noticed {{business_name}} has built a solid reputation in {{city}} with your current {{rating}} rating. Congratulations on that.

I work with restaurants to increase their Google review count without being pushy to customers. Our approach uses simple table cards and follow up texts that feel natural.

One restaurant owner told me they went from 80 reviews to 250 in just four months using our system.

Would you like me to send over a quick case study showing how it works?

Best wishes.',
0, true, 'Restaurants', 'review_generation', NOW(), NOW()),

(NULL, 'Restaurant Catering Enquiry',
'Catering partnership with {{business_name}}',
'Hi {{first_name}},

I organise corporate events in {{city}} and I am looking for reliable catering partners. {{business_name}} came up in my search and your menu looks perfect for the type of events we run.

We typically handle 10 to 15 corporate lunches per month, ranging from 20 to 80 people each.

Would {{business_name}} be interested in discussing a potential partnership? I would love to learn more about your catering options and pricing.

Let me know if you have 15 minutes for a quick chat this week.',
0, true, 'Restaurants', 'catering_enquiry', NOW(), NOW()),

-- =====================================================
-- TRADES AND CONTRACTORS (4 Templates)
-- =====================================================

(NULL, 'Plumber New Business Outreach',
'More jobs for your plumbing business in {{city}}',
'Hi {{first_name}},

I help plumbers in {{city}} get more booked jobs without spending hours chasing leads.

Most plumbers I work with tell me the same thing: they are great at the work, but finding new customers is a headache. That is where I come in.

I have a simple system that brings in 5 to 10 new enquiries per week from homeowners actively looking for a plumber. No cold calling required.

Would you be interested in hearing how it works? Takes about 10 minutes to explain.

Cheers.',
0, true, 'Trades', 'plumber_outreach', NOW(), NOW()),

(NULL, 'Electrician New Business Outreach',
'Filling your diary with electrical jobs in {{city}}',
'Hi {{first_name}},

Running an electrical business means you are probably brilliant at the technical side but marketing takes up time you do not have.

I work specifically with electricians in {{city}} to generate consistent enquiries from homeowners and small businesses. No need to rely on word of mouth alone anymore.

One electrician I work with went from 3 jobs a week to fully booked within 6 weeks.

Interested in learning how? Happy to walk you through it on a quick call.

Best.',
0, true, 'Trades', 'electrician_outreach', NOW(), NOW()),

(NULL, 'Builder Follow Up',
'Following up on my message to {{business_name}}',
'Hi {{first_name}},

I sent a message last week about helping {{business_name}} attract more renovation and extension projects in {{city}}.

I know builders are usually flat out, so I will keep this brief. We specialise in getting builders found by homeowners searching for quotes online. Most of our builder clients get their first lead within 14 days.

If the timing is better now, I would love to chat for 10 minutes about how we could help fill your pipeline.

No pressure either way.',
0, true, 'Trades', 'builder_followup', NOW(), NOW()),

(NULL, 'Contractor Referral Ask',
'Quick favour, {{first_name}}',
'Hi {{first_name}},

I hope this finds you well. I wanted to reach out because we have had great results working together and I am looking to help more contractors like {{business_name}} in {{city}}.

Do you know any other trade business owners who might benefit from getting more consistent leads? I am happy to offer them the same quality service.

If anyone comes to mind, just reply with their name and I will reach out. Of course, I will mention you sent me.

Thanks for considering it.',
0, true, 'Trades', 'referral_ask', NOW(), NOW()),

-- =====================================================
-- DIGITAL AGENCIES (3 Templates)
-- =====================================================

(NULL, 'Website Audit Offer',
'Free website audit for {{business_name}}',
'Hi {{first_name}},

I had a quick look at the {{business_name}} website and spotted a few opportunities that could improve your search visibility and conversion rate.

Nothing major, but small tweaks that often make a noticeable difference. Things like page speed, mobile experience, and calls to action.

I have put together a free 5 minute audit video specifically for {{business_name}}. Would you like me to send it over?

No obligation and no sales pitch. Just genuine feedback you can use whether you work with us or not.

Let me know.',
0, true, 'Digital Agencies', 'website_audit', NOW(), NOW()),

(NULL, 'SEO Pitch',
'Getting {{business_name}} found on Google',
'Hi {{first_name}},

I noticed {{business_name}} is not showing up for some key search terms in {{city}} that your competitors are ranking for.

We help businesses like yours climb the Google rankings without the confusing jargon. Our approach is straightforward: we find what your customers are searching for and make sure you appear.

One similar business went from page 5 to page 1 for their main keyword in four months.

Would a quick call to discuss your visibility goals be helpful?

Thanks.',
0, true, 'Digital Agencies', 'seo_pitch', NOW(), NOW()),

(NULL, 'Social Media Pitch',
'Social media idea for {{business_name}}',
'Hi {{first_name}},

I have been following {{business_name}} on social media and I think there is real potential to turn your content into new customers.

Most businesses post regularly but struggle to convert followers into paying clients. We have a simple framework that bridges that gap without needing you to become a full time content creator.

One client in {{city}} generated 23 new enquiries last month purely from Instagram. They spend just 2 hours a week on it now.

Would you be open to a chat about what might work for {{business_name}}?

Best.',
0, true, 'Digital Agencies', 'social_media_pitch', NOW(), NOW()),

-- =====================================================
-- RETAIL (3 Templates)
-- =====================================================

(NULL, 'New Store Outreach',
'Partnership opportunity with {{business_name}}',
'Hi {{first_name}},

I noticed {{business_name}} recently opened in {{city}}. Congratulations on the launch.

We help new retail stores build their customer base quickly through local marketing. Rather than waiting months for word of mouth, we accelerate awareness so you hit your stride faster.

One boutique we worked with reached their 6 month sales target in just 10 weeks.

Would you be interested in a quick conversation about what is working for new stores right now?

Wishing you success with the opening.',
0, true, 'Retail', 'new_store_outreach', NOW(), NOW()),

(NULL, 'Seasonal Promotion Partnership',
'Seasonal promotion idea for {{business_name}}',
'Hi {{first_name}},

With the upcoming season approaching, I wanted to reach out about a promotional partnership that could drive extra footfall to {{business_name}}.

We run coordinated campaigns with multiple retailers in {{city}}, creating buzz that benefits everyone involved. Think of it as collective marketing with shared costs.

Last season, participating stores saw an average 40% increase in foot traffic during the campaign period.

Would you like to hear more about how {{business_name}} could be involved?

Thanks.',
0, true, 'Retail', 'seasonal_promotion', NOW(), NOW()),

(NULL, 'Loyalty Programme Pitch',
'Keeping customers coming back to {{business_name}}',
'Hi {{first_name}},

Repeat customers are worth 10 times more than new ones, but most retailers do not have a system to encourage loyalty.

We help stores like {{business_name}} set up simple loyalty programmes that actually work. No complicated apps or expensive systems. Just a straightforward approach that keeps customers returning.

One retailer in {{city}} saw repeat purchases increase by 60% within three months.

Would you be interested in learning how this could work for {{business_name}}?

Best wishes.',
0, true, 'Retail', 'loyalty_programme', NOW(), NOW()),

-- =====================================================
-- PROFESSIONAL SERVICES (3 Templates)
-- =====================================================

(NULL, 'Accountant Outreach',
'Client acquisition idea for {{business_name}}',
'Hi {{first_name}},

I help accounting firms in {{city}} attract more of the clients they actually want to work with.

Most accountants I speak to are tired of competing on price. Instead, we position firms like {{business_name}} as the obvious choice for business owners who value expertise over cheap quotes.

One firm added 15 new business clients in a single quarter using our approach.

If you are looking to grow your client base with quality over quantity, I would love to share how it works.

Any interest in a brief chat?',
0, true, 'Professional Services', 'accountant_outreach', NOW(), NOW()),

(NULL, 'Solicitor Outreach',
'Growing {{business_name}} in {{city}}',
'Hi {{first_name}},

I work with law firms to build a consistent pipeline of new clients without relying solely on referrals.

Many solicitors tell me they are excellent at the legal work but marketing feels like a different language. That is exactly why I focus on making client acquisition simple and predictable.

One family law firm went from 4 new matters a month to 12 within 90 days.

Would it be helpful to discuss how we could achieve similar results for {{business_name}}?

Thanks for your time.',
0, true, 'Professional Services', 'solicitor_outreach', NOW(), NOW()),

(NULL, 'Financial Advisor Outreach',
'Attracting ideal clients to {{business_name}}',
'Hi {{first_name}},

Finding clients who are the right fit is one of the biggest challenges for financial advisors. Too many leads that go nowhere.

I help advisors like you attract qualified prospects who are genuinely ready to discuss their finances. No more chasing people who are just browsing.

One advisor in {{city}} now has a waiting list for initial consultations. Six months ago they were struggling to fill their diary.

Would you be open to learning how we could help {{business_name}} achieve something similar?

Best regards.',
0, true, 'Professional Services', 'financial_advisor_outreach', NOW(), NOW()),

-- =====================================================
-- HEALTH AND WELLNESS (3 Templates)
-- =====================================================

(NULL, 'Gym and Personal Trainer Outreach',
'Filling your client list at {{business_name}}',
'Hi {{first_name}},

I help personal trainers and gyms in {{city}} attract members who actually stick around.

The fitness industry has a churn problem. Most gyms gain members in January and lose them by March. We focus on bringing in committed clients who see training as a lifestyle, not a New Year resolution.

One PT went from 12 clients to a full roster of 30 within two months using our approach.

Would you be interested in hearing how we find clients who are serious about their fitness?

Thanks.',
0, true, 'Health and Wellness', 'gym_trainer_outreach', NOW(), NOW()),

(NULL, 'Clinic Outreach',
'Growing {{business_name}} patient base',
'Hi {{first_name}},

I noticed {{business_name}} has strong reviews in {{city}}. Your {{rating}} star rating clearly shows you deliver excellent care.

I help clinics like yours convert that great reputation into a consistent flow of new patients. Many clinic owners focus on patient care but have less time for marketing.

One physiotherapy clinic added 40 new patients in their first month working with us.

Would a quick conversation about your growth goals be useful?

Best wishes.',
0, true, 'Health and Wellness', 'clinic_outreach', NOW(), NOW()),

(NULL, 'Wellness Centre Outreach',
'Partnership idea for {{business_name}}',
'Hi {{first_name}},

I am reaching out to wellness centres in {{city}} about a marketing approach that is working really well.

Rather than competing with every spa and wellness centre in the area, we help businesses like {{business_name}} carve out a unique position that attracts your ideal clients.

One wellness centre doubled their booking rate within 8 weeks by refining their messaging.

Would you be open to discussing how we could help {{business_name}} stand out?

Thanks for considering it.',
0, true, 'Health and Wellness', 'wellness_centre_outreach', NOW(), NOW()),

-- =====================================================
-- REAL ESTATE (3 Templates)
-- =====================================================

(NULL, 'Letting Agent Outreach',
'Landlord acquisition for {{business_name}}',
'Hi {{first_name}},

Finding landlords who want to switch agents is one of the toughest parts of growing a lettings business.

I help letting agents in {{city}} attract landlords who are unhappy with their current management. These are warm leads, not cold calls to people with no intention of moving.

One agency added 25 new managed properties in a single quarter using our approach.

Would you be interested in learning how we identify landlords ready to make a change?

Thanks.',
0, true, 'Real Estate', 'letting_agent_outreach', NOW(), NOW()),

(NULL, 'Property Management Pitch',
'Property management opportunity in {{city}}',
'Hi {{first_name}},

I work with property investors in {{city}} who are looking for reliable management services.

Many investors own multiple properties but lack the time or local presence to manage them effectively. They need a trusted partner like {{business_name}} to handle the day to day.

I have several investors asking for recommendations. Would {{business_name}} be interested in being introduced?

Let me know if this is something worth discussing.',
0, true, 'Real Estate', 'property_management_pitch', NOW(), NOW()),

(NULL, 'Estate Agent Outreach',
'Vendor leads for {{business_name}}',
'Hi {{first_name}},

I help estate agents in {{city}} find homeowners who are thinking about selling but have not listed yet.

These pre market leads give you first contact before the property hits Rightmove and every other agent starts calling. It is a significant competitive advantage.

One agent secured 8 instructions in their first month using leads we provided.

Would you be interested in a quick chat about how this could work for {{business_name}}?

Best.',
0, true, 'Real Estate', 'estate_agent_outreach', NOW(), NOW()),

-- =====================================================
-- AUTOMOTIVE (3 Templates)
-- =====================================================

(NULL, 'Car Dealership Outreach',
'Driving more sales to {{business_name}}',
'Hi {{first_name}},

I help car dealerships in {{city}} generate more qualified enquiries from buyers who are ready to purchase.

Most dealership marketing attracts tyre kickers. We focus on finding people with genuine buying intent, so your sales team spends time on prospects that convert.

One dealership increased their monthly sales by 35% after implementing our lead generation approach.

Would a quick call to discuss your current lead flow be helpful?

Thanks.',
0, true, 'Automotive', 'car_dealership_outreach', NOW(), NOW()),

(NULL, 'Garage Mechanic Outreach',
'Getting more customers to {{business_name}}',
'Hi {{first_name}},

I noticed {{business_name}} has great reviews for your work. That {{rating}} star rating shows you do quality repairs.

I help independent garages turn that good reputation into a steady stream of new customers. Many garage owners tell me they rely too heavily on word of mouth.

One mechanic in {{city}} went from quiet weeks to being fully booked after just 6 weeks with us.

Would you be interested in hearing how we bring in new customers consistently?

Cheers.',
0, true, 'Automotive', 'garage_mechanic_outreach', NOW(), NOW()),

(NULL, 'Auto Service Centre Outreach',
'Booking more services at {{business_name}}',
'Hi {{first_name}},

Service centres like {{business_name}} often have spare capacity in their diaries. I help fill those gaps with customers who need MOTs, servicing, and repairs.

Rather than waiting for customers to remember their service is due, we proactively reach out to drivers in {{city}} and connect them with quality centres.

One service centre increased their weekly bookings by 50% within the first month.

Would you be open to a conversation about filling your appointment slots?

Best.',
0, true, 'Automotive', 'auto_service_outreach', NOW(), NOW());
```

### Verify Templates Were Created

```sql
SELECT name, industry, use_case, is_system
FROM email_templates
WHERE is_system = true
ORDER BY industry, use_case;
```

---

## PART 2: F6 — A/B TESTING LOGIC IN N8N

### Database Schema Update

Add A/B testing fields to your sequences steps JSONB structure. No schema change needed since steps is already JSONB, but here is the expected step structure:

```json
{
  "index": 0,
  "channel": "email",
  "subject": "Original subject line",
  "subject_b": "Alternative subject line for testing",
  "body": "Email body content...",
  "waitDays": 0,
  "ab_test_active": true,
  "ab_sample_size": 50,
  "ab_winner": null,
  "ab_variant_a_sends": 0,
  "ab_variant_a_opens": 0,
  "ab_variant_b_sends": 0,
  "ab_variant_b_opens": 0
}
```

### Node 1: ExtractStep Code Node (Updated with A/B Logic)

Replace your existing ExtractStep code node with this complete JavaScript:

```javascript
// ExtractStep with A/B Testing Logic
// N8N Code Node - JavaScript

const enrollment = $input.first().json;
const sequence = enrollment.sequences;
const lead = enrollment.leads;
const steps = sequence.steps || [];
const currentStepIndex = enrollment.current_step || 0;

// Check if sequence is complete
if (currentStepIndex >= steps.length) {
  return [{
    json: {
      skip: true,
      reason: 'sequence_complete',
      enrollment_id: enrollment.id
    }
  }];
}

const step = steps[currentStepIndex];

// =========================================
// A/B TESTING LOGIC
// =========================================

let selectedSubject = step.subject || '';
let variantAssigned = null;
let abTestActive = step.ab_test_active === true;

if (abTestActive && step.channel === 'email') {
  // Check if winner has already been determined
  if (step.ab_winner === 'A') {
    // Use variant A (original subject)
    selectedSubject = step.subject || '';
    variantAssigned = 'A';
  } else if (step.ab_winner === 'B') {
    // Use variant B (alternative subject)
    selectedSubject = step.subject_b || step.subject || '';
    variantAssigned = 'B';
  } else {
    // Test still running - randomly assign variant
    if (Math.random() > 0.5) {
      selectedSubject = step.subject_b || step.subject || '';
      variantAssigned = 'B';
    } else {
      selectedSubject = step.subject || '';
      variantAssigned = 'A';
    }
  }
}

// =========================================
// MERGE TAG REPLACEMENT
// =========================================

const replaceMergeTags = (text) => {
  if (!text) return '';
  return text
    .replace(/\{\{business_name\}\}/g, lead.company || '')
    .replace(/\{\{first_name\}\}/g, lead.first_name || '')
    .replace(/\{\{last_name\}\}/g, lead.last_name || '')
    .replace(/\{\{city\}\}/g, lead.location || '')
    .replace(/\{\{rating\}\}/g, lead.rating || '')
    .replace(/\{\{website\}\}/g, lead.website || '')
    .replace(/\{\{company\}\}/g, lead.company || '')
    .replace(/\{\{title\}\}/g, lead.title || '');
};

const processedSubject = replaceMergeTags(selectedSubject);
const processedBody = replaceMergeTags(step.body || '');

// =========================================
// CALCULATE NEXT STEP TIMING
// =========================================

const nextStepIndex = currentStepIndex + 1;
let nextStepAt = null;

if (nextStepIndex < steps.length) {
  const nextStep = steps[nextStepIndex];
  const waitDays = nextStep.waitDays || 1;
  const next = new Date();
  next.setDate(next.getDate() + waitDays);
  nextStepAt = next.toISOString();
}

// =========================================
// RETURN PROCESSED STEP DATA
// =========================================

return [{
  json: {
    skip: false,
    enrollment_id: enrollment.id,
    enrollment_user_id: enrollment.user_id,
    sequence_id: sequence.id,
    sequence_name: sequence.name,
    lead_id: lead.id,
    lead_email: lead.email,
    lead_first_name: lead.first_name,
    lead_company: lead.company,

    // Step details
    step_index: currentStepIndex,
    step_channel: step.channel,
    subject: processedSubject,
    body: processedBody,

    // A/B testing data
    ab_test_active: abTestActive,
    variant_assigned: variantAssigned,
    ab_sample_size: step.ab_sample_size || 50,
    ab_current_a_sends: step.ab_variant_a_sends || 0,
    ab_current_b_sends: step.ab_variant_b_sends || 0,
    ab_current_a_opens: step.ab_variant_a_opens || 0,
    ab_current_b_opens: step.ab_variant_b_opens || 0,
    ab_winner: step.ab_winner || null,

    // Sequence progression
    next_step_index: nextStepIndex,
    next_step_at: nextStepAt,
    is_final_step: nextStepIndex >= steps.length,

    // Full step data for AB update
    full_steps: steps,

    // Original unprocessed subjects for reference
    original_subject_a: step.subject,
    original_subject_b: step.subject_b
  }
}];
```

### Node 2: IF Node - Check Skip

After ExtractStep, add an IF node:
- **Name:** Check If Skip
- **Condition:** `{{ $json.skip }}` equals `true`
- **True Branch:** Go to Update Enrollment Status (mark complete)
- **False Branch:** Continue to Send Email

### Node 3: Send Email (Existing)

Your existing email sending logic. Make sure it uses:
- Subject: `{{ $json.subject }}`
- Body: `{{ $json.body }}`
- To: `{{ $json.lead_email }}`

### Node 4: Update AB Counts (New Node - Add After Successful Email Send)

**Type:** HTTP Request
**Method:** PATCH
**URL:** `https://rmcyfrqgmpnkvrgzeyxq.supabase.co/rest/v1/sequences?id=eq.{{ $json.sequence_id }}`

**Headers:**
```
apikey: {{ $env.SUPABASE_SERVICE_ROLE_KEY }}
Authorization: Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}
Content-Type: application/json
Prefer: return=representation
```

**Before this node, add a Code Node to prepare the update:**

```javascript
// Prepare AB Counts Update
// This runs AFTER email is sent successfully

const data = $input.first().json;

// If A/B test is not active, skip the update
if (!data.ab_test_active || !data.variant_assigned) {
  return [{
    json: {
      skip_ab_update: true,
      sequence_id: data.sequence_id,
      steps: data.full_steps
    }
  }];
}

// Clone steps array to modify
const steps = JSON.parse(JSON.stringify(data.full_steps));
const stepIndex = data.step_index;
const step = steps[stepIndex];

// Increment the appropriate sends counter
if (data.variant_assigned === 'A') {
  step.ab_variant_a_sends = (step.ab_variant_a_sends || 0) + 1;
} else if (data.variant_assigned === 'B') {
  step.ab_variant_b_sends = (step.ab_variant_b_sends || 0) + 1;
}

// Check if we have reached sample size and should determine winner
const totalSends = (step.ab_variant_a_sends || 0) + (step.ab_variant_b_sends || 0);
const sampleSize = step.ab_sample_size || 50;

let shouldDetermineWinner = false;
let winner = null;

if (totalSends >= sampleSize && !step.ab_winner) {
  shouldDetermineWinner = true;

  // Calculate open rates
  const aOpens = step.ab_variant_a_opens || 0;
  const bOpens = step.ab_variant_b_opens || 0;
  const aSends = step.ab_variant_a_sends || 0;
  const bSends = step.ab_variant_b_sends || 0;

  const aOpenRate = aSends > 0 ? aOpens / aSends : 0;
  const bOpenRate = bSends > 0 ? bOpens / bSends : 0;

  // Determine winner (if open tracking is not yet implemented,
  // this will default to 'A' since both rates will be 0)
  if (aOpenRate >= bOpenRate) {
    winner = 'A';
  } else {
    winner = 'B';
  }

  step.ab_winner = winner;
}

// Update the step in the array
steps[stepIndex] = step;

return [{
  json: {
    skip_ab_update: false,
    sequence_id: data.sequence_id,
    steps: steps,
    step_index: stepIndex,
    variant_assigned: data.variant_assigned,
    total_sends: totalSends,
    sample_size: sampleSize,
    winner_determined: shouldDetermineWinner,
    winner: winner
  }
}];
```

### Node 5: IF Node - Check Skip AB Update

- **Condition:** `{{ $json.skip_ab_update }}` equals `true`
- **True Branch:** Skip to Log Step node
- **False Branch:** Continue to PATCH Sequences

### Node 6: PATCH Sequences (HTTP Request)

**Type:** HTTP Request
**Method:** PATCH
**URL:** `https://rmcyfrqgmpnkvrgzeyxq.supabase.co/rest/v1/sequences?id=eq.{{ $json.sequence_id }}`

**Headers:**
```
apikey: {{ $env.SUPABASE_SERVICE_ROLE_KEY }}
Authorization: Bearer {{ $env.SUPABASE_SERVICE_ROLE_KEY }}
Content-Type: application/json
```

**Body (Expression Mode):**
```json
{
  "steps": {{ JSON.stringify($json.steps) }},
  "updated_at": "{{ new Date().toISOString() }}"
}
```

### Node 7: Log Step (Existing - Update to Include Variant)

When logging to `sequence_step_logs`, include the A/B variant:

```json
{
  "enrollment_id": "{{ $node['ExtractStep'].json.enrollment_id }}",
  "sequence_id": "{{ $node['ExtractStep'].json.sequence_id }}",
  "lead_id": "{{ $node['ExtractStep'].json.lead_id }}",
  "user_id": "{{ $node['ExtractStep'].json.enrollment_user_id }}",
  "step_index": {{ $node['ExtractStep'].json.step_index }},
  "channel": "email",
  "subject": "{{ $node['ExtractStep'].json.subject }}",
  "body": "{{ $node['ExtractStep'].json.body }}",
  "status": "sent",
  "sent_at": "{{ new Date().toISOString() }}",
  "ab_variant": "{{ $node['ExtractStep'].json.variant_assigned || null }}"
}
```

**Note:** You may need to add an `ab_variant` column to `sequence_step_logs`:

```sql
ALTER TABLE sequence_step_logs
ADD COLUMN IF NOT EXISTS ab_variant TEXT;
```

---

## PART 3: WORKFLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                    Email Sequence Processor                      │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Cron Trigger   │
                    │  (Every 5 min)  │
                    └────────┬────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │ Get Due         │
                    │ Enrollments     │
                    │ (Supabase)      │
                    └────────┬────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Loop Over      │
                    │  Enrollments    │
                    └────────┬────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  ExtractStep    │◄──── A/B Logic Here
                    │  (Code Node)    │
                    └────────┬────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Check If Skip  │
                    │  (IF Node)      │
                    └────────┬────────┘
                              │
               ┌──────────────┴──────────────┐
               │                              │
          skip=true                      skip=false
               │                              │
               ▼                              ▼
    ┌─────────────────┐            ┌─────────────────┐
    │ Update Status   │            │  Send Email     │
    │ (Complete)      │            │  (Resend)       │
    └─────────────────┘            └────────┬────────┘
                                            │
                                            ▼
                                  ┌─────────────────┐
                                  │ Prepare AB      │
                                  │ Counts Update   │
                                  │ (Code Node)     │
                                  └────────┬────────┘
                                            │
                                            ▼
                                  ┌─────────────────┐
                                  │ Check Skip AB   │
                                  │ (IF Node)       │
                                  └────────┬────────┘
                                            │
                         ┌──────────────────┴──────────────────┐
                         │                                      │
                   skip_ab=true                           skip_ab=false
                         │                                      │
                         │                                      ▼
                         │                            ┌─────────────────┐
                         │                            │ PATCH Sequences │
                         │                            │ (Supabase)      │
                         │                            └────────┬────────┘
                         │                                      │
                         └──────────────────┬───────────────────┘
                                            │
                                            ▼
                                  ┌─────────────────┐
                                  │  Log Step       │
                                  │  (Supabase)     │
                                  └────────┬────────┘
                                            │
                                            ▼
                                  ┌─────────────────┐
                                  │ Update          │
                                  │ Enrollment      │
                                  │ (Next Step)     │
                                  └─────────────────┘
```

---

## PART 4: DEPENDENCIES ON SPRINT 3

The A/B testing winner selection relies on open tracking data:

### Required for Full A/B Testing

1. **Email Open Tracking (Sprint 3)**
   - Open events must be captured in `email_events` table
   - When an open event is recorded, it should increment `ab_variant_a_opens` or `ab_variant_b_opens` based on which variant was sent

2. **Email Events Table Schema (if not exists)**

```sql
CREATE TABLE IF NOT EXISTS email_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  lead_id UUID REFERENCES leads(id),
  sequence_id UUID REFERENCES sequences(id),
  enrollment_id UUID REFERENCES sequence_enrollments(id),
  step_index INTEGER,
  event_type TEXT NOT NULL, -- 'open', 'click', 'bounce', 'complaint'
  ab_variant TEXT, -- 'A' or 'B'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_events_sequence ON email_events(sequence_id, step_index);
CREATE INDEX idx_email_events_type ON email_events(event_type);
```

3. **Open Event Handler (N8N or Webhook)**
   - When an email open is detected (via tracking pixel)
   - Look up the `sequence_step_logs` entry by email/lead
   - Get the `ab_variant` that was used
   - Increment the appropriate counter in `sequences.steps[n].ab_variant_X_opens`

### What Works Without Sprint 3

- Random A/B assignment works immediately
- Send counting works immediately
- Winner determination logic is in place
- Once sample size is reached, winner defaults to 'A' if no opens tracked
- When open tracking is added, winner selection will automatically use real data

---

## PART 5: QUICK REFERENCE

### All SQL to Run (In Order)

1. Schema update for email_templates
2. Insert 25 templates
3. Add ab_variant to sequence_step_logs
4. Create email_events table (for Sprint 3)

### Files Changed

- N8N Workflow: Email Sequence Processor
  - Updated: ExtractStep code node
  - New: Prepare AB Counts Update code node
  - New: Check Skip AB IF node
  - New: PATCH Sequences HTTP Request node

### Environment Variables Required

```
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Testing the A/B Logic

1. Create a sequence with `ab_test_active: true` on a step
2. Add `subject_b` with an alternative subject line
3. Set `ab_sample_size` (e.g., 10 for testing)
4. Enrol 10+ leads
5. Check `sequences.steps` JSONB to see counters incrementing
6. Verify winner is set after sample size reached
