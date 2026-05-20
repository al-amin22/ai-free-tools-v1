# SEO Architecture
# AI Free Tools Ecosystem

Version: 1.0.0

---

## 1. SEO Layer Overview

```
┌──────────────────────────────────────────────────────┐
│                  SEO ARCHITECTURE                    │
│                                                      │
│  Tier 1: Tool Pages          /tools/[slug]           │
│  Tier 2: Category Pages      /[category]             │
│  Tier 3: State Pages         /tools/[slug]/[state]   │
│  Tier 4: Long-tail Pages     /[intent]/[modifier]    │
│  Tier 5: Support Articles    /blog/[slug]            │
│  Tier 6: Comparison Pages    /compare/[a]-vs-[b]     │
│  Tier 7: Glossary Pages      /glossary/[term]        │
│  Tier 8: FAQ Pages           /faq/[topic]            │
└──────────────────────────────────────────────────────┘
```

---

## 2. URL Architecture

### 2.1 Tool Pages
```
/tools/nda-generator
/tools/privacy-policy-generator
/tools/invoice-generator
... (65 tool pages)
```

### 2.2 Category Pages
```
/legal-document-generators
/real-estate-tools
/hr-recruitment-tools
/finance-tax-tools
/small-business-tools
/copywriting-tools
/legal-forms
```

### 2.3 Programmatic SEO Pages (State-Specific)
```
/tools/nda-generator/california
/tools/nda-generator/texas
/tools/nda-generator/new-york
... (65 tools × 50 states = 3,250 pages)
```

### 2.4 Long-Tail Programmatic Pages
```
/free-nda-generator-for-freelancers
/free-nda-generator-small-business
/free-nda-template-software-company
/simple-nda-generator
/one-page-nda-generator
... (65 tools × 10-20 variants = ~1,000 pages)
```

### 2.5 Comparison Pages
```
/compare/nda-vs-non-disclosure-agreement
/compare/llc-vs-sole-proprietorship
/compare/w2-vs-1099
... (50+ comparison pages)
```

### 2.6 Support Articles (Topical Cluster)
```
/blog/what-is-an-nda
/blog/nda-laws-by-state
/blog/how-to-write-nda
/blog/nda-mistakes-to-avoid
... (65 tools × 5-10 articles = 300-650 articles)
```

---

## 3. On-Page SEO Requirements

### 3.1 Every Tool Page MUST Have

```typescript
interface ToolPageSEO {
  // Metadata
  title: string;          // "{Tool Name} — Free AI Generator | AIFreeTools"
  description: string;    // 150-160 chars, includes primary keyword
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;        // 1200×630 OG image (AI-generated)
  twitterCard: 'summary_large_image';
  
  // Schema Markup
  schemas: (
    | SoftwareApplicationSchema
    | FAQPageSchema
    | BreadcrumbListSchema
    | OrganizationSchema
    | HowToSchema
  )[];
  
  // Content Structure
  h1: string;             // Primary keyword-optimized
  h2s: string[];          // Min 4 H2 sections
  faq: FAQItem[];         // Min 5 Q&A pairs
  relatedTools: string[]; // Min 4 related tool slugs
  internalLinks: InternalLink[]; // Min 3 contextual links
  
  // Technical
  robots: 'index,follow';
  hreflang: 'en-us';
}
```

### 3.2 Title Tag Formulas

```
Primary: "Free {Tool Name} — AI-Powered | AIFreeTools"
State:   "Free {Tool Name} for {State} — AI Generator"
LT:      "Free {Adjective} {Tool Name} — {Modifier}"

Examples:
"Free NDA Generator — AI-Powered Legal Document | AIFreeTools"
"Free NDA Generator for California — Legal Compliance 2026"
"Free Simple NDA Generator for Freelancers"
```

### 3.3 Meta Description Formulas

```
Primary: "Generate a professional {document} in seconds with AI. 
         Free, customizable, and ready to sign. No lawyer needed."

Length: 150-160 characters
Include: primary keyword, CTA (Generate Free), benefit
```

---

## 4. Schema Markup Architecture

### 4.1 Tool Pages — JSON-LD Stack

```json
[
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Free NDA Generator",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [...]
  },
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [...]
  }
]
```

### 4.2 Article Pages — JSON-LD

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "...",
  "author": { "@type": "Organization", "name": "AIFreeTools" },
  "datePublished": "...",
  "dateModified": "...",
  "mainEntityOfPage": "..."
}
```

---

## 5. Sitemap Architecture

### 5.1 Sitemap Index

```xml
/sitemap.xml                  → Sitemap index
/sitemap-tools.xml            → 65 tool pages
/sitemap-categories.xml       → 7 category pages
/sitemap-states.xml           → 3,250 state pages
/sitemap-longtail.xml         → ~1,000 long-tail pages
/sitemap-articles.xml         → 300-650 articles
/sitemap-comparisons.xml      → 50+ comparison pages
/sitemap-glossary.xml         → 100+ glossary terms
```

### 5.2 Sitemap Update Triggers

- New tool published → update sitemap-tools.xml
- New article published → update sitemap-articles.xml
- New state page generated → update sitemap-states.xml
- Weekly: full sitemap regeneration

---

## 6. Internal Linking Architecture

### 6.1 Linking Strategy

```
Tool Page → Related Tools (4+ links)
Tool Page → State Pages (link to top 5 states)
Tool Page → Support Articles (3+ links)
Article → Tool Page (1+ contextual link)
Article → Related Articles (3+ links)
Category Page → All tools in category
Comparison Page → Both compared tools
```

### 6.2 Auto Internal Linking Engine

```typescript
interface InternalLinkSuggestion {
  sourcePageId: string;
  targetPageId: string;
  anchorText: string;
  context: string;       // surrounding text
  relevanceScore: number; // 0-1
  position: 'body' | 'related_section' | 'faq';
}

// Engine runs AI to find linking opportunities:
// "Given this content, identify 3-5 natural places to link to related tools"
```

---

## 7. Programmatic SEO Engine

### 7.1 Page Generation Pipeline

```
1. Keyword Research Database (seed keywords per tool)
2. Modifier Matrix (state × intent × audience × format)
3. Template Selection (per page type)
4. AI Content Generation (unique content per page)
5. Validation (uniqueness check, quality check)
6. Database Storage
7. Sitemap Update
8. Search Console Submission
```

### 7.2 State Page Content Template

```
H1: Free {Tool Name} for {State} — {Year}
 
Intro: 2-3 paragraphs unique to state (laws, requirements)
Tool: Embedded tool with state pre-selected
H2: {State} {Document Type} Requirements
H2: How to Use This {Tool Name} in {State}
H2: {State}-Specific Legal Considerations
FAQ: 5 state-specific questions
Related: Other tools + state law resources
```

---

## 8. Core Web Vitals Strategy

| Metric | Target | Implementation |
|--------|--------|----------------|
| LCP | < 2.5s | Next.js ISR/SSG, image optimization, CDN |
| FID/INP | < 100ms | Lazy loading, code splitting, React Suspense |
| CLS | < 0.1 | Fixed dimensions for ad slots, skeleton loaders |
| TTFB | < 800ms | Edge caching, Redis, Vercel Edge Network |

---

## 9. Content Freshness Strategy

- Tool pages: reviewed every 6 months
- State pages: reviewed annually (law changes)
- Articles: updated when content score drops below threshold
- FAQs: regenerated when CTR < 2% for 30 days
- AI Manager detects and flags stale content automatically

---

## 10. Topical Authority Map

```
Legal Documents (Hub)
  ├── NDA Generator (Spoke) → [what is NDA, NDA laws, NDA template, ...]
  ├── Privacy Policy Generator (Spoke) → [GDPR, CCPA, ...]
  ├── Terms of Service (Spoke) → [ToS requirements, SaaS ToS, ...]
  └── ... (all 10 legal tools)

Finance & Tax (Hub)
  ├── Invoice Generator (Spoke) → [invoice template, billing, ...]
  ├── Tax Calculators (Spoke) → [1099 tax, freelancer tax, ...]
  └── ... (all 10 finance tools)
```

Each hub has:
- Category overview page (2000+ words)
- 10 spoke tool pages
- 5-10 supporting articles per spoke = 50-100 articles per hub
- Total: 7 hubs × 50-100 articles = 350-700 articles
