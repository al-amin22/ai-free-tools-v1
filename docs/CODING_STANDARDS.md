# Coding Standards
# AI Free Tools Ecosystem

Version: 1.0.0

---

## 1. TypeScript

- Strict mode enabled (`"strict": true`)
- No `any` — use `unknown` and type guards
- All function parameters and returns typed
- Interfaces over type aliases for objects
- Enums for fixed sets of values
- Zod for runtime validation (matches TS types)

---

## 2. Naming Conventions

```typescript
// Files
tool-engine.service.ts        // kebab-case
ToolEngineService             // PascalCase class

// Variables/functions
const toolConfig              // camelCase
function generateContent()    // camelCase

// Constants
const MAX_TOKENS = 4000       // SCREAMING_SNAKE for true constants
const AI_QUEUES = { ... }     // SCREAMING_SNAKE object

// Types/Interfaces
interface ToolConfig {}        // PascalCase
type ExportFormat = 'pdf' | 'docx';
```

---

## 3. File Organization

```
// Each module follows this pattern:
module/
  ├── module.module.ts         // NestJS module declaration
  ├── module.controller.ts     // HTTP handlers only
  ├── module.service.ts        // Business logic
  ├── module.repository.ts     // DB queries
  ├── dto/                     // Request/response DTOs
  ├── interfaces/              // TypeScript interfaces
  └── module.spec.ts           // Tests co-located
```

---

## 4. Comments Policy

- No comments explaining WHAT the code does
- Comments only for WHY something non-obvious is done
- Complex regex: one-line explanation
- Legal disclaimer requirements: comment the law/clause being implemented

---

## 5. Error Handling

```typescript
// Custom exception hierarchy
class AIGenerationException extends BaseException {}
class ProviderUnavailableException extends AIGenerationException {}
class RateLimitException extends BaseException {}

// Always throw typed exceptions (never generic Error)
throw new RateLimitException('Anonymous user exceeded hourly limit');

// Use NestJS exception filters for HTTP responses
// Never expose internal error details to client
```

---

## 6. Async Patterns

```typescript
// Always await — never floating promises
await this.cache.set(key, value);

// Parallel when independent
const [tool, faqs] = await Promise.all([
  this.toolsService.findBySlug(slug),
  this.faqService.findByTool(slug),
]);

// Never use callbacks — async/await only
```

---

## 7. React/Next.js Standards

```typescript
// Server Components by default
// Only use 'use client' when strictly needed (interactivity, hooks)

// Props interface always defined
interface ToolPageProps {
  params: { slug: string };
  searchParams: Record<string, string>;
}

// Named exports for components (not default)
export function ToolPage({ params }: ToolPageProps) {}

// Tailwind classes: use cn() utility for conditional classes
className={cn('base-classes', condition && 'conditional-class')}
```

---

## 8. API Design Standards

```typescript
// Consistent response shape
interface APIResponse<T> {
  data: T;
  meta?: {
    total?: number;
    limit?: number;
    offset?: number;
  };
}

interface APIError {
  error: string;   // machine-readable code
  message: string; // human-readable
  details?: unknown;
}

// HTTP methods:
// GET — read (cacheable)
// POST — create/generate
// PATCH — partial update
// DELETE — remove

// Never use GET for mutations
// Never return 200 with error in body
```
