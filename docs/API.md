# API Documentation
# AI Free Tools Ecosystem

Version: 1.0.0
Base URL: `https://api.aifreetools.com/v1`

---

## 1. Authentication

### JWT Bearer Token
```
Authorization: Bearer {access_token}
```

### Anonymous Access
Most endpoints work without authentication. Rate limits apply.

---

## 2. Tools API

### GET /tools
List all active tools.

**Query params:**
- `category` — filter by category slug
- `search` — search by name/description
- `limit` — default 20, max 100
- `offset` — pagination offset

**Response:**
```json
{
  "data": [
    {
      "id": "uuid",
      "slug": "nda-generator",
      "name": "NDA Generator",
      "category": "legal-documents",
      "description": "...",
      "generationCount": 45231
    }
  ],
  "total": 65,
  "limit": 20,
  "offset": 0
}
```

---

### GET /tools/:slug
Get single tool with form schema.

**Response:**
```json
{
  "id": "uuid",
  "slug": "nda-generator",
  "name": "Free NDA Generator",
  "category": "legal-documents",
  "description": "...",
  "formSchema": {
    "fields": [
      {
        "id": "disclosingParty",
        "type": "text",
        "label": "Disclosing Party Name",
        "placeholder": "Your Company Name",
        "required": true,
        "validation": { "minLength": 2, "maxLength": 200 }
      },
      {
        "id": "state",
        "type": "select",
        "label": "Governing State",
        "options": [/* 50 US states */],
        "required": true
      }
    ],
    "groups": [/* field groupings */]
  }
}
```

---

### POST /tools/:slug/generate
Generate AI content for a tool.

**Request:**
```json
{
  "inputs": {
    "disclosingParty": "Acme Corp",
    "receivingParty": "John Smith",
    "state": "california",
    "duration": "2",
    "scope": "Software development services"
  },
  "stream": false
}
```

**Response (non-streaming):**
```json
{
  "generationId": "uuid",
  "output": "NON-DISCLOSURE AGREEMENT\n\nThis Non-Disclosure Agreement...",
  "metadata": {
    "promptVersion": "1.2.0",
    "provider": "openclaw",
    "latencyMs": 2340,
    "tokensUsed": 1823,
    "cached": false
  }
}
```

**Streaming (SSE):**
```
POST /tools/:slug/generate with { "stream": true }
Content-Type: text/event-stream

data: NON
data: -DIS
data: CLOS
...
data: [DONE]
```

**Errors:**
```json
{ "error": "RATE_LIMIT_EXCEEDED", "message": "10 generations per hour for anonymous users", "retryAfter": 3600 }
{ "error": "VALIDATION_ERROR", "fields": { "disclosingParty": "Required" } }
{ "error": "AI_GENERATION_FAILED", "message": "All AI providers unavailable" }
```

---

### POST /tools/:slug/export
Export generation as PDF or DOCX.

**Request:**
```json
{
  "generationId": "uuid",
  "format": "pdf",
  "options": {
    "watermark": false,  // premium only
    "fontSize": 12,
    "pageSize": "letter"
  }
}
```

**Response:**
```json
{
  "exportId": "uuid",
  "downloadUrl": "https://files.aifreetools.com/exports/uuid.pdf?token=...",
  "expiresAt": "2026-05-20T10:00:00Z",
  "fileSizeBytes": 85420
}
```

---

## 3. SEO Pages API

### GET /seo/tool/:slug/meta
Get SEO metadata for a tool page (used by Next.js generateMetadata).

**Response:**
```json
{
  "title": "Free NDA Generator — AI-Powered | AIFreeTools",
  "description": "Generate a professional NDA in seconds with AI. Free, customizable, legally structured. No lawyer needed.",
  "canonical": "https://aifreetools.com/tools/nda-generator",
  "ogImage": "https://cdn.aifreetools.com/og/nda-generator.jpg",
  "schemas": [/* JSON-LD objects */],
  "faqs": [
    { "question": "What is an NDA?", "answer": "..." },
    { "question": "Is this NDA legally binding?", "answer": "..." }
  ],
  "relatedTools": ["non-compete-agreement", "freelance-contract", "independent-contractor-agreement"]
}
```

---

### GET /seo/state/:toolSlug/:stateSlug/meta
Get SEO metadata for state-specific tool page.

---

### GET /seo/sitemap
Get sitemap data for all published pages.

**Response:** XML sitemap or JSON data for Next.js sitemap generation.

---

## 4. Analytics API

### POST /analytics/events
Track an analytics event.

**Request:**
```json
{
  "eventType": "generation_complete",
  "toolId": "uuid",
  "sessionId": "sess_abc123",
  "properties": {
    "latencyMs": 2340,
    "cached": false,
    "state": "california"
  }
}
```

---

### GET /analytics/tools/:slug/stats
Get public stats for a tool.

**Response:**
```json
{
  "generationCount": 45231,
  "exportCount": 12043,
  "avgRating": 4.8
}
```

---

## 5. AI Manager API (Admin)

### POST /admin/manager/run-audit
Trigger SEO audit for all pages.

### POST /admin/manager/generate-content
Trigger AI content generation for specified page type.

### GET /admin/manager/jobs
List active AI Manager jobs with status.

---

## 6. Rate Limits

| Tier | Generations/Hour | Exports/Hour | API Calls/Min |
|------|-----------------|--------------|---------------|
| Anonymous | 10 | 5 | 60 |
| Free User | 50 | 20 | 120 |
| Premium | Unlimited | Unlimited | 300 |

Rate limit headers:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 7
X-RateLimit-Reset: 1716123600
```

---

## 7. Error Codes

| Code | HTTP | Description |
|------|------|-------------|
| VALIDATION_ERROR | 400 | Input validation failed |
| UNAUTHORIZED | 401 | Missing/invalid token |
| FORBIDDEN | 403 | Insufficient permissions |
| NOT_FOUND | 404 | Resource not found |
| RATE_LIMIT_EXCEEDED | 429 | Too many requests |
| AI_GENERATION_FAILED | 503 | All AI providers unavailable |
| AI_TIMEOUT | 504 | AI response timed out |
| EXPORT_FAILED | 500 | Export generation failed |

---

## 8. Webhook Events (Future)

```json
{
  "event": "generation.completed",
  "timestamp": "2026-05-19T10:00:00Z",
  "data": {
    "generationId": "uuid",
    "toolSlug": "nda-generator",
    "userId": "uuid"
  }
}
```
