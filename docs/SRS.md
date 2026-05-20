# Software Requirements Specification (SRS)
# AI Free Tools Ecosystem

Version: 1.0.0
Date: 2026-05-19

---

## 1. System Overview

The AI Free Tools Ecosystem is a monorepo-based, full-stack platform with:
- **apps/web** — Next.js 15 frontend (App Router, TypeScript, TailwindCSS)
- **apps/api** — NestJS backend (TypeScript, PostgreSQL, Redis, BullMQ)
- **packages/** — Shared types, tool configs, AI prompts, SEO utils

---

## 2. Functional Requirements

### 2.1 Universal Tool Engine (UTE)

FR-UTE-001: System MUST render any tool dynamically from a JSON configuration schema without hardcoded components per tool.

FR-UTE-002: Dynamic Form Engine MUST support field types: text, textarea, select, multiselect, radio, checkbox, number, date, toggle, rich-text.

FR-UTE-003: Dynamic Form Engine MUST support conditional field rendering (show/hide based on other field values).

FR-UTE-004: Every tool MUST support these actions: Generate (AI), Reset, Copy, Download PDF, Download DOCX.

FR-UTE-005: Tool generation MUST use AI Workflow Engine with tool-specific prompt chains.

FR-UTE-006: System MUST support tool versioning (prompt version, config version).

FR-UTE-007: Tool output MUST be editable inline after AI generation.

FR-UTE-008: System MUST queue long-running AI generations via BullMQ.

FR-UTE-009: Tool configuration MUST include: id, slug, name, category, description, keywords, formSchema, promptConfig, exportConfig, seoConfig, monetizationConfig.

FR-UTE-010: Tool results MUST be cacheable in Redis for 1 hour (same inputs = cached output).

### 2.2 AI Workflow Engine

FR-AI-001: AI Engine MUST support multi-provider routing (primary: configured provider, fallback: secondary provider).

FR-AI-002: AI Engine MUST support prompt chaining (multiple AI calls in sequence for complex documents).

FR-AI-003: AI Engine MUST support streaming responses for real-time UI feedback.

FR-AI-004: Prompt Management System MUST store prompts in DB with versioning.

FR-AI-005: AI Engine MUST log all requests, responses, latency, token usage, and cost.

FR-AI-006: AI Engine MUST implement retry logic (3 retries with exponential backoff).

FR-AI-007: AI Engine MUST implement rate limiting per user (10 generations/hour for anonymous).

FR-AI-008: AI Engine MUST support structured output (JSON mode) for calculator tools.

FR-AI-009: AI Engine MUST support response validation against expected schema.

FR-AI-010: AI Engine MUST cache identical prompts for 1 hour to reduce AI costs.

### 2.3 SEO Engine

FR-SEO-001: Every tool page MUST have dynamically generated metadata (title, description, OG tags, Twitter cards).

FR-SEO-002: SEO Engine MUST generate JSON-LD schema markup (Tool, FAQPage, BreadcrumbList, Organization).

FR-SEO-003: Every tool page MUST have: H1, H2 sections, FAQ block (min 5 Q&A), related tools, internal links.

FR-SEO-004: Programmatic SEO Engine MUST generate state-specific pages (50 states × tools).

FR-SEO-005: SEO Engine MUST generate sitemap.xml with all pages and last-modified dates.

FR-SEO-006: Internal Linking Engine MUST automatically insert relevant anchor links into content.

FR-SEO-007: Metadata Engine MUST A/B test title tags and descriptions.

FR-SEO-008: SEO Engine MUST track and report: indexed pages, impressions, clicks, CTR, position.

FR-SEO-009: FAQ Engine MUST generate 5–10 questions per tool from AI, stored in DB.

FR-SEO-010: All programmatic pages MUST have unique content (no thin or duplicate content).

### 2.4 Export Engine

FR-EXP-001: Export Engine MUST generate PDF output with professional legal formatting.

FR-EXP-002: Export Engine MUST generate DOCX output compatible with Microsoft Word.

FR-EXP-003: PDF generation MUST use templates per tool category (legal, finance, HR, etc.).

FR-EXP-004: Free tier exports MAY include platform watermark; premium tier exports are watermark-free.

FR-EXP-005: Export Engine MUST support async export for large documents via queue.

FR-EXP-006: Generated files MUST be stored in S3/MinIO with TTL of 24 hours.

FR-EXP-007: Export Engine MUST track: exports per tool, export format, user tier.

### 2.5 AI Manager System

FR-MGR-001: AI Manager MUST run scheduled jobs for: SEO audit, content refresh, metadata optimization.

FR-MGR-002: AI Manager MUST detect thin content pages and trigger content enhancement.

FR-MGR-003: AI Manager MUST monitor Core Web Vitals and alert on degradation.

FR-MGR-004: AI Manager MUST auto-generate supporting articles for each tool (topical cluster).

FR-MGR-005: AI Manager MUST optimize internal linking across all pages weekly.

FR-MGR-006: AI Manager MUST generate OG images and featured images per tool/article.

FR-MGR-007: AI Manager MUST monitor Google Search Console data and surface ranking opportunities.

FR-MGR-008: AI Manager MUST optimize ad placements based on engagement heatmaps.

### 2.6 Analytics Engine

FR-ANA-001: Analytics Engine MUST track: page views, tool usage, generation count, export count, time on page.

FR-ANA-002: Analytics Engine MUST integrate with Google Analytics 4.

FR-ANA-003: Analytics Engine MUST track AI cost per tool.

FR-ANA-004: Analytics Engine MUST track revenue per tool (ads + affiliate).

FR-ANA-005: Analytics dashboard MUST be available at /admin with role-based access.

### 2.7 Authentication & Authorization

FR-AUTH-001: Platform MUST support anonymous tool usage (no login required for basic features).

FR-AUTH-002: Platform MUST support email/password registration for saving history.

FR-AUTH-003: Platform MUST support Google OAuth.

FR-AUTH-004: RBAC MUST support roles: anonymous, user, premium, admin.

FR-AUTH-005: JWT tokens MUST be used for API authentication (access: 15min, refresh: 30 days).

---

## 3. Non-Functional Requirements

### 3.1 Performance
- NFR-PERF-001: Tool generation MUST complete within 10 seconds (P95).
- NFR-PERF-002: Page load (LCP) MUST be < 2.5 seconds.
- NFR-PERF-003: API response time MUST be < 200ms (non-AI endpoints, P95).
- NFR-PERF-004: System MUST handle 1,000 concurrent users without degradation.
- NFR-PERF-005: AI queue MUST process at least 100 jobs/minute.

### 3.2 Scalability
- NFR-SCALE-001: Architecture MUST support horizontal scaling of API workers.
- NFR-SCALE-002: Database MUST support read replicas for scaling reads.
- NFR-SCALE-003: Redis MUST support cluster mode.
- NFR-SCALE-004: S3 storage MUST support unlimited file storage.

### 3.3 Reliability
- NFR-REL-001: Platform uptime MUST be 99.9% (< 8.7 hours downtime/year).
- NFR-REL-002: All external AI API failures MUST have fallback providers.
- NFR-REL-003: Failed queue jobs MUST be retried 3 times before dead-letter queue.
- NFR-REL-004: Database MUST have automated backups (daily, 30-day retention).

### 3.4 Security
- NFR-SEC-001: All API endpoints MUST be rate-limited.
- NFR-SEC-002: User inputs MUST be sanitized to prevent XSS, SQL injection.
- NFR-SEC-003: AI outputs MUST be sanitized before rendering.
- NFR-SEC-004: All data MUST be encrypted in transit (TLS 1.3).
- NFR-SEC-005: PII MUST be encrypted at rest (AES-256).
- NFR-SEC-006: GDPR/CCPA compliance MUST be maintained.
- NFR-SEC-007: Security headers MUST be configured (CSP, HSTS, X-Frame-Options).

### 3.5 SEO Technical
- NFR-SEO-001: All pages MUST have canonical URLs.
- NFR-SEO-002: All pages MUST be crawlable (no important content in client-only JS).
- NFR-SEO-003: Sitemap MUST be updated automatically on new content.
- NFR-SEO-004: robots.txt MUST be properly configured.
- NFR-SEO-005: Core Web Vitals MUST meet Google's "Good" threshold.

### 3.6 Observability
- NFR-OBS-001: All API requests MUST be logged with: method, path, status, latency, user_id.
- NFR-OBS-002: All errors MUST include stack traces and context in logs.
- NFR-OBS-003: Metrics MUST be exported to Prometheus.
- NFR-OBS-004: Alerts MUST be configured for: error rate > 1%, latency > 5s, queue depth > 500.

---

## 4. System Interfaces

### 4.1 External Interfaces
- AI Provider API (OpenClaw/Claude/OpenAI) — for generation
- Google Analytics 4 — for tracking
- Google Search Console — for SEO monitoring
- Google AdSense / Ezoic — for monetization
- S3/MinIO — for file storage
- SMTP (SendGrid/Postmark) — for email

### 4.2 Internal Interfaces
- Web ↔ API: REST + Server-Sent Events (SSE) for streaming
- API ↔ Queue: BullMQ over Redis
- API ↔ DB: Prisma ORM over PostgreSQL
- API ↔ Cache: ioredis over Redis

---

## 5. Data Requirements

### 5.1 Data Retention
- Tool generations: 90 days for anonymous, unlimited for registered users
- Exported files: 24 hours (S3 TTL)
- Analytics events: 2 years
- Logs: 30 days
- Audit logs: 1 year

### 5.2 Data Privacy
- No PII stored for anonymous users
- Registered user data deletable on request (GDPR right to erasure)
- Tool inputs not used for AI training without explicit consent

---

## 6. Constraints

- Must use TypeScript throughout (strict mode)
- Must use ESLint + Prettier for code quality
- Must maintain 80%+ test coverage for core engines
- Must pass security scan (OWASP ZAP) before production
- AI responses must include legal disclaimers for legal tool category
