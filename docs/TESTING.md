# Testing Documentation
# AI Free Tools Ecosystem

Version: 1.0.0

---

## 1. Testing Strategy

### Coverage Targets
| Layer | Coverage Target |
|-------|----------------|
| Core engines (AI, Export, SEO) | 90%+ |
| API controllers | 80%+ |
| Frontend components | 70%+ |
| E2E critical paths | 100% of golden paths |

---

## 2. Unit Tests

### 2.1 AI Workflow Engine Tests
```typescript
describe('AIWorkflowEngine', () => {
  it('builds correct prompt from template', () => {});
  it('handles provider fallback on primary failure', () => {});
  it('validates output against tool schema', () => {});
  it('returns cached result on cache hit', () => {});
  it('enforces max token limits', () => {});
  it('retries on transient errors', () => {});
});
```

### 2.2 Dynamic Form Engine Tests
```typescript
describe('DynamicFormEngine', () => {
  it('renders all field types correctly', () => {});
  it('applies conditional field visibility', () => {});
  it('validates required fields', () => {});
  it('serializes form data to prompt variables', () => {});
});
```

### 2.3 SEO Engine Tests
```typescript
describe('SEOEngine', () => {
  it('generates correct title for tool page', () => {});
  it('generates correct JSON-LD schema', () => {});
  it('generates sitemap with correct priority', () => {});
  it('detects and flags thin content', () => {});
});
```

### 2.4 Export Engine Tests
```typescript
describe('ExportEngine', () => {
  it('generates valid PDF from legal template', () => {});
  it('generates valid DOCX from legal template', () => {});
  it('applies watermark for free tier', () => {});
  it('omits watermark for premium tier', () => {});
});
```

---

## 3. Integration Tests

### 3.1 Tool Generation Flow
```typescript
describe('POST /tools/:slug/generate', () => {
  it('generates NDA with valid inputs', async () => {
    const res = await request(app)
      .post('/api/v1/tools/nda-generator/generate')
      .send({ inputs: validNDAInputs });
    
    expect(res.status).toBe(200);
    expect(res.body.output).toContain('NON-DISCLOSURE AGREEMENT');
    expect(res.body.generationId).toBeDefined();
  });
  
  it('returns 429 when rate limit exceeded', async () => {});
  it('returns 400 on invalid inputs', async () => {});
  it('serves cached result for identical inputs', async () => {});
});
```

### 3.2 Export Flow
```typescript
describe('POST /tools/:slug/export', () => {
  it('exports PDF successfully', async () => {});
  it('exports DOCX successfully', async () => {});
  it('returns signed download URL', async () => {});
  it('expires file after 24 hours', async () => {});
});
```

### 3.3 Queue Processing
```typescript
describe('Queue Workers', () => {
  it('processes generation job and completes', async () => {});
  it('handles AI provider failure with retry', async () => {});
  it('moves job to DLQ after max retries', async () => {});
  it('streams output via SSE', async () => {});
});
```

---

## 4. E2E Tests (Playwright)

### 4.1 Critical Golden Paths
```typescript
test('User generates NDA document', async ({ page }) => {
  await page.goto('/tools/nda-generator');
  await page.fill('[name="disclosingParty"]', 'Acme Corp');
  await page.fill('[name="receivingParty"]', 'John Smith');
  await page.selectOption('[name="state"]', 'california');
  await page.fill('[name="duration"]', '2');
  await page.fill('[name="scope"]', 'Software development');
  await page.click('[data-testid="generate-button"]');
  await expect(page.locator('[data-testid="output"]')).toBeVisible({ timeout: 15000 });
  await expect(page.locator('[data-testid="output"]')).toContainText('NON-DISCLOSURE AGREEMENT');
});

test('User exports PDF', async ({ page }) => {
  // ... navigate to tool, generate, click export PDF
  const download = await page.waitForEvent('download');
  expect(download.suggestedFilename()).toMatch(/NDA.*\.pdf/);
});

test('SEO page renders with schema markup', async ({ page }) => {
  await page.goto('/tools/nda-generator');
  const schemaScript = await page.$('script[type="application/ld+json"]');
  expect(schemaScript).toBeTruthy();
});
```

### 4.2 Performance Tests (Lighthouse CI)
```yaml
# .github/workflows/lighthouse.yml
- run: npx lhci autorun
  env:
    LHCI_GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

# lighthouserc.js assertions
assertions:
  'categories:performance': ['error', { minScore: 0.85 }]
  'categories:seo': ['error', { minScore: 0.95 }]
  'first-contentful-paint': ['error', { maxNumericValue: 2000 }]
  'largest-contentful-paint': ['error', { maxNumericValue: 2500 }]
  'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }]
```

---

## 5. Test Commands

```bash
# Unit tests
npm run test

# Integration tests  
npm run test:integration

# E2E tests
npm run test:e2e

# Coverage report
npm run test:coverage

# Type checking
npm run typecheck

# Linting
npm run lint
```

---

## 6. CI Test Pipeline

Every push to `main` or PR runs:
1. `npm run lint`
2. `npm run typecheck`
3. `npm run test` (unit + integration)
4. `npm run build`
5. `npm run test:e2e` (on preview URL)
6. Lighthouse CI
7. Security scan (npm audit + Snyk)
