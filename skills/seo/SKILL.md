---
name: seo-strategy
description: >
  Unified SEO skill with two modes: Article/Page Optimization and Full Website Audit.

  MODE 1 — ARTICLE/PAGE SEO OPTIMIZATION: Use this mode whenever the user shares an article,
  blog post, draft, page content, or a URL to a single page and mentions SEO, search optimization,
  ranking, or Google — or even when they just say "check this article", "optimize this", or
  "improve this" without explicitly saying SEO. Also trigger when the user pastes or attaches
  article text and asks you to review, improve, rewrite, or polish it for publishing. Trigger
  phrases include: "optimize this article", "SEO optimize this", "improve this for SEO",
  "optimize this page", "rewrite for SEO", "check this article", "improve this content",
  "make this rank", "SEO this". When in doubt, lean toward activating this mode — it's better
  to offer SEO optimization than to miss the opportunity.

  MODE 2 — FULL WEBSITE AUDIT: Use this mode whenever the user asks for a full website SEO audit,
  site-wide SEO strategy, multi-page SEO analysis, SEO health check, website audit, site audit,
  domain SEO review, or wants to understand their overall website SEO performance. Trigger phrases
  include: "audit my site", "SEO strategy for my website", "check my website SEO", "full SEO audit",
  "multi-page SEO", "site SEO", "website SEO review", "SEO health check", "site audit",
  "domain audit", or when the user provides a root URL and asks for SEO help. This mode crawls
  multiple pages across a website and produces a comprehensive HTML report with site-wide analysis,
  cross-page patterns, architecture review, and prioritized strategy.
---

# Unified SEO Skill

This skill handles two distinct SEO workflows depending on what the user provides. Read the Mode Detection section first to determine which mode to use, then follow the corresponding instructions.

---

## Mode Detection

Before doing anything else, determine which mode to use based on the user's input.

### Use Mode 1 (Article/Page SEO Optimization) when:
- User shares article text, a blog post draft, or page content directly
- User provides a single URL and asks to "optimize", "improve", "rewrite" the content
- User mentions a target keyword or title they want to rank for
- User says "optimize this article", "SEO optimize this", "improve this for SEO", "check this article", "make this rank"
- User pastes or attaches written content and asks you to review, improve, or polish it for publishing
- The focus is on making a single piece of content rank better

### Use Mode 2 (Full Website Audit) when:
- User provides a root domain or homepage URL and asks for an "audit", "review", "strategy"
- User says "audit my site", "full SEO audit", "website SEO", "site audit", "SEO health check"
- User asks about site-wide issues, multiple pages, site architecture
- User provides a local directory of HTML files and asks for a review
- The focus is on evaluating an entire website's SEO health across many pages

### If ambiguous:
- A single URL + "optimize" or "improve the content" = Mode 1
- A single URL + "audit" or "review my site" = Mode 2
- Just a domain with no specific request = Mode 2
- Just article text with no specific request = Mode 1

---

# MODE 1: Article/Page SEO Optimization

You receive an article and produce a visual HTML report with three tabs:
1. **Revised Article** — a fully rewritten, SEO-optimized version the user can publish as-is
2. **Changelog** — every change grouped by category with impact badges (High/Medium/Low)
3. **Original** — the unmodified article for easy comparison

## How to Think About This

Your goal is to maximize the article's chance of ranking on Google. The process is research-first:
study what's already winning, understand exactly what keywords and topics the top results cover,
then rewrite the article to compete with — and surpass — those results. Every change should be
data-informed, not guesswork.

## Mode 1 Step 0: User Intake Questionnaire (MANDATORY — DO NOT SKIP)

**Before doing ANY research or analysis, you MUST ask the user the following questions.**
Use `AskUserQuestion` to gather this information. Do NOT proceed until you have answers.
Present all questions in a single message so the user can answer them at once.

Ask the user:

1. **Target keywords** — "What keywords or phrases do you want this article to rank for?
   List your primary keyword and any secondary keywords. If you're unsure, I can suggest
   some based on your article — just say 'suggest for me'."

2. **Target audience** — "Who is your target reader? (e.g., homeowners in the UK, first-time
   buyers, small business owners, developers, etc.)"

3. **Search intent** — "What should someone searching for this topic be looking to do?
   - Learn something (informational)
   - Buy or hire something (transactional)
   - Compare options before deciding (commercial investigation)
   - Find a specific brand or site (navigational)
   - Not sure (I'll determine this from competitor research)"

4. **Geographic focus** — "Is there a geographic focus? (e.g., UK-only, US, global, specific city)"

5. **LSI / semantic keyword preferences** — "Are there any specific related terms, industry
   jargon, or semantic keywords you want included? For example, if your article is about
   'home removals', related terms might include 'packing service', 'man and van', 'moving
   checklist', 'removal quote', etc. List any you want prioritized, or say 'research for me'
   and I'll extract them from competitor analysis."

6. **Competitor awareness** — "Are there any specific competitor URLs or articles you want me
   to analyze and outrank? (optional — I'll find top-ranking competitors automatically either way)"

7. **Content constraints** — "Any constraints I should know about?
   - Maximum word count?
   - Tone/voice requirements? (formal, casual, authoritative, friendly)
   - Topics or claims to avoid?
   - Mandatory sections or CTAs to include?"

### Processing the answers:

- If the user says "suggest for me" for keywords: proceed to Step 1 and infer keywords from
  the article, but confirm your suggestion with the user before starting competitor research.
- If the user says "research for me" for LSI keywords: note this and extract LSI terms from
  competitor research in Step 2b, but highlight them prominently in the report for user review.
- If the user provides specific keywords: use those as the definitive target. Do NOT override
  the user's keyword choices with your own inference — the user knows their business and audience.
- If the user provides competitor URLs: include those in your competitor analysis in Step 2a
  alongside the top organic results.
- Store ALL user answers and reference them throughout the optimization. The user's keyword
  choices and audience context should inform every decision in Steps 1-5.

---

## Mode 1 Step 1: Determine Target Keyword

Using the user's answers from Step 0, confirm the target keyword strategy:

1. **Target keyword/keyphrase** — Use the primary keyword the user provided in Step 0.
   If the user said "suggest for me", read the article carefully and infer the primary keyword
   from the title, recurring themes, and topic. Pick the most specific, searchable phrase that
   captures the article's intent. **Present your suggestion to the user and get confirmation
   before proceeding.**

2. **Search intent** — Use the intent the user selected in Step 0. If they said "not sure",
   determine it from the keyword and competitor research. The article must match this intent
   or it won't rank regardless of other optimizations.

## Mode 1 Step 2: Competitor Research (CRITICAL — DO NOT SKIP)

This is the most important step. You must research what's currently ranking before making any changes.

### 2a. Find Top-Ranking Competitors

Use `WebSearch` to search for the target keyword. Examine the top 5-10 results.

For each top result, note:
- **Title tag** — exact wording
- **URL** — structure and slug
- **Meta description** — if visible in search results

Then use `WebFetch` to retrieve the full HTML of the **top 3-5 ranking pages**. For each page, extract:

- **Title tag and H1**
- **All H2 and H3 headings** — these reveal the subtopics competitors cover
- **Word count** — approximate length of the content
- **Key topics/sections covered** — what subtopics do they address that the user's article doesn't?
- **Content structure** — how do they organize the information? (listicle, how-to, comparison, etc.)

### 2b. Extract Keyword & LSI Strategy (CRITICAL FOR RANKING)

From the competitor pages AND the user's keyword preferences from Step 0, build a **keyword map**:

1. **Primary keyword** — Use the keyword the user provided in Step 0. If they said "suggest for me",
   confirm/refine based on what competitors are targeting and present your recommendation.
2. **Secondary keywords** — close variations and long-tail versions competitors use in their titles/H2s
   (e.g., if primary is "best running shoes", secondaries might be "top running shoes 2025", "running shoes for beginners").
   Cross-reference with any secondary keywords the user listed in Step 0.
3. **LSI (Latent Semantic Indexing) keywords** — semantically related terms that appear frequently
   across multiple competitor pages. These are NOT synonyms — they're contextually related words
   that signal topical depth to Google. **This is one of the most powerful ranking signals you
   can optimize for — Google uses semantic relevance to determine topical authority.**

   **How to extract LSI keywords:**
   - Start with any LSI terms the user provided in Step 0 — these are priority inclusions
   - Read through competitor content and note terms/phrases that appear in 2+ of the top results
   - Look for technical terms, related concepts, and descriptive phrases specific to the topic
   - Group them by subtopic/theme (e.g., for a moving company: "logistics terms", "cost terms",
     "service types", "trust signals")
   - Aim for 20-40 LSI terms (more than fewer — topical depth is a ranking advantage)
   - Use `WebSearch` to search for "[primary keyword] related searches" and
     "[primary keyword] people also ask" to discover additional LSI terms from Google's own
     suggestions

   **Example:** For "home removals UK" the LSI terms might include: packing service, removal quote,
   man and van, moving checklist, removal insurance, house clearance, storage solutions, moving day,
   white glove service, fragile items, disassembly, inventory list, transit insurance, removal boxes,
   bubble wrap, moving costs, local movers, long distance move, same day removal, weekend moves,
   Trustpilot reviews, vetted movers, price comparison

   **LSI keyword categories to always look for:**
   - **Process terms** — words describing how the service/product works
   - **Cost/pricing terms** — words people use when comparing prices
   - **Trust/quality terms** — words that signal reliability and quality
   - **Problem terms** — words describing the pain points the content solves
   - **Comparison terms** — words used when evaluating alternatives
   - **Location terms** — geographic modifiers relevant to the user's target area (from Step 0)

4. **Keyword density targets** — For the primary keyword, note the approximate density used by
   top-ranking pages (typically 1-2%). For LSI keywords, they should appear naturally throughout
   the article — not forced, but present. Each LSI term should appear 1-3 times depending on
   article length.

5. **User-provided LSI integration** — If the user provided specific LSI/semantic keywords in
   Step 0, these MUST be integrated into the revised article. Mark them separately in the report
   so the user can verify their priority terms were included.

### 2c. Gap Analysis

Compare the user's article against the competitor research:

- **Content gaps** — What subtopics do ALL top competitors cover that the user's article misses?
  These are mandatory additions.
- **Structural gaps** — Do competitors use a format (e.g., comparison table, step-by-step, FAQ)
  that the user's article doesn't? Consider adopting effective structures.
- **Depth gaps** — Where do competitors go deeper? Which sections of the user's article are
  too thin compared to what's ranking?
- **Keyword gaps** — Which LSI keywords and secondary keywords are missing from the user's article?
- **Unique angles** — What does the user's article offer that competitors DON'T? Preserve and
  amplify these differentiators.

## Mode 1 Step 3: Analyze Current Article Strengths

Now assess the user's article:

1. **Current SEO strengths** — What's already working? Don't fix what isn't broken.
2. **SEO gaps** — Mapped against the competitor research above.
3. **Author's voice and style** — Note the tone so you can preserve it in the rewrite.

## Mode 1 Step 4: The SEO Optimization Checklist

Work through each of these areas. Every decision should be informed by the competitor research from Step 2.

### Content Quality & Search Intent (Highest Impact)

- **Search intent match**: Does the article fully satisfy what the searcher wants? If someone
  Googles the target keyword, would this article answer their question completely? Based on
  competitor research, add any missing subtopics that ALL top results cover.
- **Depth and comprehensiveness**: Based on your gap analysis, add substance where the article
  is thinner than competitors. Cover the subtopics they cover. But don't pad with fluff —
  only add genuinely useful information.
- **LSI keyword integration**: Weave the LSI keywords from Step 2b naturally throughout the
  article. They should appear in body text, headings, image alt text, and lists. Aim for each
  LSI term to appear 1-3 times depending on article length. Never force them — if a term
  doesn't fit naturally, skip it.
- **E-E-A-T signals**: Experience, Expertise, Authoritativeness, Trustworthiness. Does the
  article demonstrate firsthand knowledge? Add concrete examples, data points, specific
  details, or actionable steps where the content feels generic.
- **Originality**: Amplify any unique angles the user's article has that competitors lack.
  This is the article's competitive advantage — don't dilute it while adding competitor-matched content.

### Title Tag / H1

- Include the target keyword, ideally near the beginning
- Keep it under 60 characters so it doesn't get truncated in search results
- Make it compelling enough to earn clicks over competing results
- Use a power word or emotional trigger where it fits naturally (e.g., "proven," "complete,"
  "ultimate," "[year]")

### Meta Description

- Write a meta description of 150-160 characters
- Include the target keyword naturally
- Write it as a compelling pitch — give the reader a reason to click
- Include a call to action or value proposition

### Heading Structure (H2s, H3s)

- Use a clear hierarchy: one H1 (the title), then H2s for major sections, H3s for subsections
- Include the target keyword or close variations in at least one H2
- **Cross-reference competitor H2s from Step 2a** — if all top results have a section for a
  specific subtopic (e.g., "How Much Does X Cost?"), the article likely needs one too
- Use headings that read like the questions/subtopics people actually search for —
  these can appear as featured snippets
- Every section should earn its heading. If a section is only one paragraph, it probably
  doesn't need its own H2.

### Keyword Usage (Informed by Competitor Research)

- Use the **primary keyword** in the first 100 words of the article
- Match or slightly exceed the keyword density of top-ranking competitors (typically 1-2%)
- Include **all secondary keywords** from Step 2b at least once, ideally in headings or early paragraphs
- Integrate **LSI keywords** from Step 2b throughout — aim for each term to appear 1-3 times
  naturally in body text. Cluster related LSI terms near relevant sections.
- Cross-reference your keyword placement against the competitor analysis — if every top result
  mentions a specific term in their intro, include it in yours too
- Never keyword-stuff. If it sounds unnatural when read aloud, remove it.

### Internal & External Linking

- If the article references concepts that could link to other content, note where internal
  links should go (use placeholder notation like `[link to: topic]` if you don't know the
  user's site structure)
- Suggest 1-2 authoritative external link opportunities where citing a source would boost
  credibility (studies, official documentation, reputable sources)

### URL Slug

- Suggest an SEO-friendly URL slug: short, lowercase, hyphenated, includes the target keyword
- Example: `how-to-start-a-podcast` not `how-to-start-a-podcast-in-2024-the-complete-guide`

### Readability & User Experience

- Break up long paragraphs (aim for 2-4 sentences per paragraph for web reading)
- Use bullet points and numbered lists where they make content easier to scan
- Add a clear introduction that hooks the reader and previews what they'll learn
- Include a conclusion or summary that reinforces the key takeaway
- Ensure transitions between sections are smooth

### Featured Snippet Optimization

- If the keyword has featured snippet potential (how-to, what-is, list, comparison),
  structure one section to directly answer the query in a concise format that Google
  can pull as a snippet (a short paragraph, a numbered list, or a table)

### Image/Media Recommendations

- Suggest where images, diagrams, or tables would improve the article and help rankings
- Provide recommended alt text for each suggested image (include the keyword where relevant)

## Mode 1 Step 5: Produce the Output as an HTML Report

Generate a single, self-contained HTML file using the template provided. Replace all `{{PLACEHOLDER}}` values with actual data from the analysis.

Save the HTML file next to the user's article (same directory), named `seo-report-{{URL_SLUG}}.html`. Then open it in the user's browser and tell the user where the file is saved.

## Mode 1 Important Principles

- **Preserve the author's voice.** You're an SEO editor, not a ghostwriter. The article
  should still sound like the person who wrote it. Match their tone, vocabulary level, and
  style.

- **Don't over-optimize.** Google penalizes content that reads like it was written for bots.
  Every keyword insertion should feel natural. If you can't fit the keyword naturally,
  don't force it.

- **Substance over tricks.** The single most important ranking factor is whether the content
  genuinely helps the reader. Prioritize making the article genuinely better and more useful.

- **Be honest in the changelog.** If the article was already strong in an area, say so.
  The user wants to understand what was changed, not see a list of trivial edits.

---

# MODE 2: Full Website SEO Audit

Perform a comprehensive, site-wide SEO audit covering multiple pages, cross-page patterns, site architecture, technical infrastructure, content strategy, and internal linking. Produce a visually stunning interactive HTML report with scores, findings, and a prioritized action plan.

## Mode 2 Workflow Overview

0. **Ask the user mandatory intake questions** (target keywords, audience, LSI preferences, goals)
1. Determine input type (live URL or local directory)
2. Crawl and collect data from multiple pages (up to 15)
3. Fetch site-wide resources (robots.txt, sitemap.xml, security headers)
4. Analyze each page individually
5. Perform cross-page analysis (duplicates, cannibalization, linking, LSI coverage)
6. Score all categories
7. Generate the interactive HTML report
8. Save and open in browser

---

## Mode 2 Step 0: User Intake Questionnaire (MANDATORY — DO NOT SKIP)

**Before crawling or analyzing anything, you MUST ask the user the following questions.**
Use `AskUserQuestion` to gather this information. Do NOT proceed until you have answers.
Present all questions in a single message so the user can answer them at once.

Ask the user:

1. **Target keywords** — "What are the main keywords or phrases your website should rank for?
   List your top 3-5 target keywords. If you're unsure, I can infer them from your site
   content — just say 'analyze and suggest'."

2. **Business type & audience** — "Briefly describe your business and target audience.
   (e.g., 'We're a UK removals company targeting homeowners who need affordable moving services')"

3. **Geographic focus** — "What geographic area do you serve? (e.g., UK-wide, London only,
   US, global, etc.)"

4. **Key competitors** — "Are there any competitor websites you want to outrank or that you
   consider benchmarks? (optional — list URLs if you have them)"

5. **SEO goals** — "What's your primary SEO goal right now?
   - Get more organic traffic generally
   - Rank for specific keywords (list them)
   - Improve local SEO / Google Maps presence
   - Fix technical issues I know about
   - Build a content strategy from scratch
   - Other (describe)"

6. **LSI / semantic keyword priorities** — "Are there any specific related terms, industry
   jargon, or semantic keywords that are important to your business? For example, if you're
   a removals company, related terms might include 'packing service', 'man and van', 'storage',
   'house move checklist', etc. List any you want prioritized across your site, or say
   'research for me' and I'll identify them from your content and competitors."

7. **Known issues** — "Are there any SEO issues you already know about or have been told about?
   (e.g., 'pages aren't getting indexed', 'we lost rankings recently', 'site is slow')"

### Processing the answers:

- If the user says "analyze and suggest" for keywords: proceed with the audit, infer keywords
  from page content, but highlight your keyword suggestions prominently in the Content Strategy
  tab for user review.
- If the user says "research for me" for LSI keywords: extract semantic keywords from the site's
  content and competitor analysis. Include a dedicated LSI keyword section in the report showing
  which terms are present vs missing across all pages.
- If the user provides specific target keywords: evaluate every page against those keywords.
  Check which pages target which keywords, flag cannibalization, and assess keyword coverage
  across the site.
- If the user provides competitor URLs: include those in the analysis. Compare the user's site
  structure, content depth, and keyword coverage against those competitors.
- Store ALL user answers and reference them throughout the audit. The user's keyword priorities
  and business context should inform scoring, recommendations, and the action plan.

---

## Mode 2 Step 1: Determine Input and Collect Page List

### If the user provides a live URL (root domain or homepage):

1. Use `WebFetch` to retrieve the homepage HTML.
2. Parse all internal links from the homepage HTML.
3. Deduplicate the link list and remove query parameters and fragments.
4. Prioritize pages to audit (select up to 15 total including the homepage).
5. Use `WebFetch` to retrieve each selected page's HTML. Fetch pages in parallel where possible.
6. Also fetch these site-wide resources using `WebFetch`:
   - `{root_domain}/robots.txt`
   - `{root_domain}/sitemap.xml`
   - `{root_domain}/sitemap_index.xml` (fallback if sitemap.xml is an index)

### If the user provides a local directory:

1. Use `Glob` to find all HTML files: `{directory}/**/*.html`
2. Use `Read` to load each HTML file (up to 15 files).
3. Treat the file named `index.html` at the root as the homepage.
4. robots.txt and sitemap.xml checks will be limited to checking if those files exist in the directory.

### Data to Extract From Each Page

For every page, extract and store: meta information, heading structure, content metrics, links, and technical elements.

---

## Mode 2 Step 2: Site-Wide Resource Analysis

Analyze robots.txt, sitemap.xml, and server/hosting headers.

---

## Mode 2 Step 3: Per-Page Analysis

For each page, evaluate on-page SEO and technical SEO elements with PASS, WARNING, or FAIL status.

---

## Mode 2 Step 4: Cross-Page Analysis

Analyze patterns across all audited pages: duplicate content detection, keyword cannibalization, internal linking analysis, site architecture assessment, content theme clustering, and LSI/semantic keyword analysis.

---

## Mode 2 Step 5: Scoring

Calculate scores for each category on a 0-100 scale: Technical SEO (25%), Content (25%), Architecture (20%), Cross-Page (15%), Social & Schema (15%).

---

## Mode 2 Step 6: Generate the HTML Report

Generate a single, self-contained HTML file with tabs for: Executive Summary, Page Breakdown, Site-Wide Issues, Technical, Content Strategy, Internal Linking, and Action Plan.

---

## Mode 2 Step 7: Save and Deliver

1. Save the HTML report to the user's preferred location.
2. Open the file in the user's browser.
3. Tell the user where the file was saved, the overall score, and the top 3 most critical issues.

---

## Important Principles (Both Modes)

- **Be specific, not generic.** Every finding should reference actual content, URLs, or text.
- **Prioritize ruthlessly.** Communicate what matters most for maximum ranking impact.
- **Think like a search engine.** Focus on what actually affects rankings.
- **Think like a site owner.** The report should be understandable by non-experts.
- **Be honest about limitations.** Note what the audit cannot measure.
