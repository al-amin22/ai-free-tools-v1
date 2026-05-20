# System Architecture
# AI Free Tools Ecosystem

Version: 1.0.0

---

## 1. Monorepo Structure

```
aifreetools/                          # Turborepo monorepo root
├── apps/
│   ├── web/                          # Next.js 15 frontend
│   │   ├── src/
│   │   │   ├── app/                  # App Router
│   │   │   │   ├── (tools)/          # Tool pages (grouped route)
│   │   │   │   │   └── tools/[slug]/ # /tools/nda-generator
│   │   │   │   ├── (seo)/            # SEO pages
│   │   │   │   │   ├── [category]/   # Category pages
│   │   │   │   │   └── tools/[slug]/[state]/ # State pages
│   │   │   │   ├── blog/[slug]/      # Articles
│   │   │   │   ├── api/              # Next.js API routes (BFF)
│   │   │   │   ├── layout.tsx        # Root layout
│   │   │   │   ├── page.tsx          # Homepage
│   │   │   │   ├── sitemap.ts        # Dynamic sitemap
│   │   │   │   └── robots.ts         # robots.txt
│   │   │   ├── components/
│   │   │   │   ├── tools/            # Tool-specific UI
│   │   │   │   ├── ui/               # shadcn/ui components
│   │   │   │   ├── seo/              # SEO components (FAQ, Schema, etc.)
│   │   │   │   └── shared/           # Header, Footer, Nav
│   │   │   ├── engines/              # Frontend engines
│   │   │   │   ├── tool/             # Universal Tool Engine (client)
│   │   │   │   ├── form/             # Dynamic Form Engine
│   │   │   │   ├── seo/              # SEO Engine (client-side)
│   │   │   │   ├── schema/           # JSON-LD Schema Engine
│   │   │   │   ├── metadata/         # Metadata Engine
│   │   │   │   ├── linking/          # Internal Linking Engine
│   │   │   │   ├── analytics/        # Analytics Engine
│   │   │   │   └── export/           # Export Engine (client-side)
│   │   │   ├── lib/                  # API client, utils
│   │   │   ├── hooks/                # Custom React hooks
│   │   │   ├── store/                # Zustand state stores
│   │   │   ├── types/                # TypeScript types
│   │   │   └── config/               # App configuration
│   │   └── public/
│   │
│   └── api/                          # NestJS backend
│       └── src/
│           ├── modules/
│           │   ├── tools/            # Tools module (CRUD + generation)
│           │   ├── ai/               # AI module (provider router)
│           │   ├── seo/              # SEO module (pages, sitemap, schema)
│           │   ├── export/           # Export module (PDF, DOCX)
│           │   ├── queue/            # Queue module (BullMQ)
│           │   ├── auth/             # Auth module (JWT, OAuth)
│           │   ├── users/            # Users module
│           │   ├── analytics/        # Analytics module
│           │   └── manager/          # AI Manager module
│           ├── engines/
│           │   ├── ai/               # AI Workflow Engine
│           │   ├── prompt/           # Prompt Management System
│           │   ├── export/           # Export Engine
│           │   └── seo/              # SEO Engine (server-side)
│           ├── shared/               # Guards, interceptors, filters
│           ├── database/             # Prisma schema, migrations, seeds
│           └── config/               # NestJS configuration
│
├── packages/
│   ├── shared-types/                 # Shared TypeScript interfaces
│   ├── tool-configs/                 # 65 tool JSON configurations
│   ├── ai-prompts/                   # AI prompt library
│   ├── seo-utils/                    # SEO helper utilities
│   └── ui-components/                # Shared React components
│
├── docs/                             # All documentation
├── infra/                            # Docker, Nginx, monitoring config
│   ├── docker/                       # Dockerfiles
│   ├── nginx/                        # Nginx config
│   ├── monitoring/                   # Prometheus, Grafana, Loki
│   └── docker-compose.yml
└── .github/workflows/                # CI/CD pipelines
```

---

## 2. Request Flow — Tool Generation

```
1. User fills form on /tools/nda-generator
2. Browser submits to Next.js Server Action or API route
3. Next.js BFF validates input (Zod schema)
4. BFF calls NestJS POST /api/v1/tools/nda-generator/generate
5. NestJS Tools Controller → Tools Service
6. Tools Service checks Redis cache (input hash)
   → Cache hit: return cached result immediately
   → Cache miss: continue
7. Tools Service creates generation record (DB: status=pending)
8. Tools Service adds job to BullMQ queue (ai:generation)
9. AI Worker picks up job
10. AI Workflow Engine builds prompt from template + inputs
11. AI Provider Router calls primary AI provider
    → If fails: try fallback providers
12. Response streams back via SSE to browser
13. Worker validates output, stores in DB (status=completed)
14. Worker caches result in Redis (1hr TTL)
15. Worker updates tool generation counter
16. Browser receives complete output
17. User can copy / export (PDF/DOCX)
```

---

## 3. Universal Tool Engine Architecture

```typescript
// Tool config drives everything — no hardcoded UI
const ndaToolConfig: ToolConfig = {
  id: 'nda-generator',
  slug: 'nda-generator',
  name: 'Free NDA Generator',
  category: 'legal-documents',
  
  formSchema: {
    fields: [/* dynamic form fields */],
    groups: [/* field groupings */],
    validationSchema: {/* Zod schema */}
  },
  
  promptConfig: {
    version: '1.2.0',
    systemPrompt: 'legal-expert-system-v2',
    userPromptTemplate: 'nda-generation-v2',
    maxTokens: 3000,
    temperature: 0.3,
    outputFormat: 'text',
    validationRules: [/* output validators */]
  },
  
  exportConfig: {
    pdfTemplate: 'legal-document-v1',
    docxTemplate: 'legal-document-v1',
    fileName: 'NDA-Agreement',
    pageSize: 'letter',
    margins: { top: 72, right: 72, bottom: 72, left: 72 }
  },
  
  seoConfig: {
    titleTemplate: 'Free NDA Generator — AI-Powered | AIFreeTools',
    descriptionTemplate: '...',
    primaryKeyword: 'free nda generator',
    keywords: ['nda template', 'non disclosure agreement', ...],
    faqCount: 8,
    statePages: true,
    articleTopics: ['what is an nda', 'nda laws by state', ...]
  }
};
```

---

## 4. Frontend State Architecture

```typescript
// Zustand store for each active tool session
interface ToolStore {
  // Form state
  inputs: Record<string, unknown>;
  errors: Record<string, string>;
  
  // Generation state
  status: 'idle' | 'generating' | 'completed' | 'error';
  generationId: string | null;
  output: string | null;
  streamBuffer: string;
  
  // UI state
  isEditing: boolean;
  
  // Actions
  setInput: (field: string, value: unknown) => void;
  generate: () => Promise<void>;
  reset: () => void;
  setEditing: (editing: boolean) => void;
}
```

---

## 5. SEO Page Generation Architecture

### Static Tool Pages (SSG)
- Generated at build time
- `generateStaticParams` for all 65 tool slugs
- `generateMetadata` fetches from API at build

### State Pages (ISR)
- On-demand ISR with 24-hour revalidation
- `generateStaticParams` for top 10 states per tool at build
- Remaining states generated on first request

### Programmatic Long-Tail Pages (On-demand ISR)
- Generated on first request
- Stored in DB after first generation
- 7-day revalidation

### Articles (ISR)
- 1-day revalidation
- Author date tracking for freshness signals

---

## 6. Infrastructure Architecture

```
                    [Cloudflare CDN / Edge]
                            ↓
                   [Nginx Load Balancer]
                       ↙          ↘
            [Next.js Web]      [Next.js Web]
            (Vercel/Docker)    (Vercel/Docker)
                       ↘          ↙
                    [NestJS API]
                  (2+ instances)
                 ↙      ↓       ↘
        [PostgreSQL] [Redis]  [Meilisearch]
        (Primary +   (Cluster)  (Search)
         Replica)
                 ↘      ↓
          [BullMQ Workers] → [AI Providers]
                  ↓
             [S3/MinIO]   (file storage)
                  ↓
          [Prometheus] → [Grafana] (monitoring)
          [Loki]        (log aggregation)
```
