# AI Architecture
# AI Free Tools Ecosystem

Version: 1.0.0

---

## 1. AI System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                      AI MANAGER SYSTEM                          │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────────┐  │
│  │ SEO AI    │ │Content AI │ │Image AI   │ │Monetization AI│  │
│  └───────────┘ └───────────┘ └───────────┘ └───────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                    AI WORKFLOW ENGINE                           │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────┐    │
│  │Prompt Engine│  │Chain Engine  │  │Validation Engine   │    │
│  └─────────────┘  └──────────────┘  └────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                   AI PROVIDER ROUTER                            │
│  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  │
│  │ OpenClaw  │  │  Claude   │  │  OpenAI   │  │  Groq     │  │
│  │(Primary)  │  │(Fallback 1│  │(Fallback 2│  │(Fallback 3│  │
│  └───────────┘  └───────────┘  └───────────┘  └───────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                      QUEUE LAYER                                │
│        BullMQ → Redis → AI Workers (auto-scaled)               │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. AI Workflow Engine

### 2.1 Prompt Chain Architecture

Each tool has a `promptConfig` that defines one or more prompt steps:

```typescript
interface PromptConfig {
  version: string;
  steps: PromptStep[];
  outputFormat: 'text' | 'json' | 'markdown';
  maxTokens: number;
  temperature: number;
  cacheKey: string; // for result caching
}

interface PromptStep {
  id: string;
  role: 'system' | 'user';
  template: string; // Handlebars template
  dependsOn?: string; // previous step id
  validator?: string; // validation function name
}
```

### 2.2 Example: NDA Generator Prompt Chain

```
Step 1 (System): Legal document expert system prompt
Step 2 (User): Generate NDA with: {party_one}, {party_two}, {state}, {duration}, {scope}
Step 3 (AI Output): Raw NDA text
Step 4 (Validator): Check for required clauses
Step 5 (Formatter): Format to professional structure
```

### 2.3 Prompt Template System

All prompts use Handlebars templating:

```handlebars
You are an expert legal document specialist for US law.

Generate a comprehensive Non-Disclosure Agreement with these specifications:
- Disclosing Party: {{disclosingParty}}
- Receiving Party: {{receivingParty}}
- State: {{state}}
- Duration: {{duration}} years
- Scope: {{scope}}
- Type: {{ndaType}} (mutual/one-way)

Requirements:
- Professional legal language
- State-compliant clauses for {{state}}
- Include: definition of confidential info, obligations, exceptions, term, remedies
- End with signature blocks

Format as a complete, ready-to-use legal document.
```

---

## 3. AI Provider Router

### 3.1 Routing Logic

```typescript
class AIProviderRouter {
  async route(request: AIRequest): Promise<AIResponse> {
    const providers = this.getProviderChain(request.tier);
    
    for (const provider of providers) {
      try {
        return await provider.generate(request);
      } catch (error) {
        if (error.retryable) continue;
        throw error;
      }
    }
    throw new AllProvidersFailedError();
  }
  
  private getProviderChain(tier: string): AIProvider[] {
    return [
      new OpenClawProvider(),    // Primary
      new ClaudeProvider(),      // Fallback 1
      new OpenAIProvider(),      // Fallback 2
      new GroqProvider(),        // Fallback 3 (fast, cheap)
    ];
  }
}
```

### 3.2 Provider Configuration

```typescript
interface AIProviderConfig {
  provider: 'openclaw' | 'claude' | 'openai' | 'groq';
  model: string;
  maxTokens: number;
  temperature: number;
  timeout: number;
  retries: number;
  costPerInputToken: number;
  costPerOutputToken: number;
}
```

---

## 4. AI Cost Management

### 4.1 Token Budget Per Tool Category

| Category | Max Input Tokens | Max Output Tokens | Est. Cost/Generation |
|----------|-----------------|-------------------|----------------------|
| Legal Docs (complex) | 1,500 | 3,000 | ~$0.06 |
| Legal Docs (simple) | 800 | 1,500 | ~$0.03 |
| HR Documents | 600 | 1,200 | ~$0.02 |
| Finance Calculators | 400 | 800 | ~$0.01 |
| Copywriting | 500 | 1,000 | ~$0.02 |
| Real Estate | 700 | 1,400 | ~$0.03 |

### 4.2 Cost Controls

- Anonymous users: 10 generations/hour, 50/day
- Registered free: 50 generations/day
- Premium: unlimited
- Response caching: identical inputs reuse cached response (1hr TTL)
- Prompt optimization: minimize token waste in system prompts

---

## 5. AI Manager System Architecture

### 5.1 Scheduled Jobs

```
┌──────────────────────────────────────────────────┐
│               AI MANAGER SCHEDULER               │
│                                                  │
│  Daily Jobs:                                     │
│  • SEO audit: check all tool pages               │
│  • Content refresh: update thin content          │
│  • FAQ refresh: regenerate FAQs for low CTR pages│
│  • Image generation: missing OG images           │
│                                                  │
│  Weekly Jobs:                                    │
│  • Internal link optimization                    │
│  • Programmatic page generation                  │
│  • Keyword ranking check                         │
│  • Monetization placement optimization           │
│                                                  │
│  Monthly Jobs:                                   │
│  • Full content audit                            │
│  • Topical cluster expansion                     │
│  • Competitor gap analysis                       │
└──────────────────────────────────────────────────┘
```

### 5.2 AI SEO Auditor

```typescript
interface SEOAuditResult {
  pageId: string;
  url: string;
  score: number; // 0-100
  issues: SEOIssue[];
  recommendations: string[];
  priority: 'critical' | 'high' | 'medium' | 'low';
}

interface SEOIssue {
  type: 'missing_meta' | 'thin_content' | 'duplicate' | 'broken_link' 
      | 'missing_schema' | 'slow_page' | 'missing_alt' | 'no_internal_links';
  description: string;
  autoFixable: boolean;
}
```

---

## 6. Streaming Architecture

For real-time tool generation feedback:

```
[Browser] ←── SSE stream ──← [Next.js Route Handler]
                                      ↓
                              [NestJS /ai/stream]
                                      ↓
                            [AI Provider (streaming)]
                                      ↓
                              [Stream transformer]
                                      ↓
                            Push tokens to SSE stream
```

### 6.1 Streaming Implementation Pattern

```typescript
// API endpoint
@Sse('generate-stream')
async generateStream(@Body() dto: GenerateDto): Observable<MessageEvent> {
  return new Observable(subscriber => {
    this.aiEngine.streamGenerate(dto).subscribe({
      next: (chunk) => subscriber.next({ data: chunk }),
      complete: () => subscriber.next({ data: '[DONE]' }),
      error: (err) => subscriber.error(err),
    });
  });
}
```

---

## 7. AI Validation System

After every AI generation, output is validated:

```typescript
interface ValidationPipeline {
  steps: ValidationStep[];
}

// For legal tools:
const legalValidation: ValidationPipeline = {
  steps: [
    { check: 'minLength', params: { min: 500 } },
    { check: 'containsSignatureBlock' },
    { check: 'containsPartyNames', params: { fields: ['disclosingParty', 'receivingParty'] } },
    { check: 'noPlaceholdersRemaining' },
    { check: 'legalDisclaimerPresent' },
  ]
};
```

---

## 8. AI Caching Layer

```
Request → Hash(prompt + inputs) → Redis Lookup
    ↓ (cache miss)              ↓ (cache hit)
  AI Provider              Return cached result
    ↓
  Store in Redis (TTL: 1hr)
    ↓
  Return result
```

Cache key format: `ai:tool:{toolSlug}:v{promptVersion}:{inputHash}`

---

## 9. AI Queue Architecture

```typescript
// Queue definitions
const AI_QUEUES = {
  GENERATION: 'ai:generation',        // Tool generation jobs
  SEO_CONTENT: 'ai:seo-content',      // AI Manager content jobs
  IMAGE_GEN: 'ai:image-generation',   // OG/featured image jobs
  EXPORT: 'ai:export',                // PDF/DOCX export jobs
  AUDIT: 'ai:audit',                  // SEO audit jobs
};

// Priority levels
const PRIORITIES = {
  GENERATION: 1,    // Highest (user-facing)
  EXPORT: 2,
  IMAGE_GEN: 5,
  SEO_CONTENT: 8,
  AUDIT: 10,        // Lowest (background)
};
```
