# AI FREE TOOLS USA — PROJECT BIBLE

## MISSION
Build 65 premium AI tools targeting US market.
Revenue from Google AdSense. All content dynamic from PostgreSQL.
Articles auto-generated daily by AI based on Google Trends data.
SEO-first approach targeting Google.com USA rankings.

## TECH STACK
- Next.js 14 App Router + TypeScript
- PostgreSQL direct with pg library (NO ORM)
- Groq API (primary AI — fast, free)
- Gemini Flash API (backup + long-form)
- Google AdSense (monetization)
- Vercel (deploy + cron jobs)

## ABSOLUTE RULES — NEVER VIOLATE
1. ZERO hardcode content — everything from PostgreSQL
2. ALL prompts stored in DB — update without redeploy
3. Every tool page: meta + schema + FAQ + AdSense + hreflang en-us
4. AI output MUST pass validation before showing to user
5. Calculator tools = JavaScript math, AI writes explanation only
6. All SQL must be parameterized ($1, $2) — no string concat
7. User-facing errors always friendly, never technical
8. Articles generated DAILY based on Google Trends — never duplicate

## AI QUALITY STANDARDS
Legal/Real Estate: Gemini Flash, temp 0.2, min 600 words
HR/Business: Groq 70B, temp 0.5, min 300 words
Content tools: Groq 70B, temp 0.7, min 200 words
Calculator: JS calculation, Groq 8B narration, temp 0.1
Article generation: Gemini Flash, temp 0.7, min 2000 words
ALWAYS inject: role + expertise + US law context + required structure

## DATABASE RULES
- Pool connection singleton pattern
- All queries parameterized
- Cache hot data in memory (1-24 hours)
- Never expose raw DB errors to users

## SEO RULES
- Every page: unique meta title 50-60 chars
- Every page: unique meta description 145-155 chars
- hreflang="en-us" on all pages
- Schema markup: WebApplication + FAQPage + BreadcrumbList
- Sitemap auto-generated from DB
- Google Indexing API: submit every new URL

## ARTICLE UNIQUENESS SYSTEM
- Base on Google Trends + Search Console data
- 10 different angles per tool
- Anti-duplication check before publish
- New keyword focus every day
- Never repeat same angle within 30 days
