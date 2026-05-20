# Deployment Architecture
# AI Free Tools Ecosystem

Version: 1.0.0

---

## 1. Environments

| Env | Web | API | DB | Purpose |
|-----|-----|-----|----|---------|
| local | localhost:3000 | localhost:4000 | localhost:5432 | Development |
| staging | staging.aifreetools.com | api-staging | Supabase/staging | QA & preview |
| production | aifreetools.com | api.aifreetools.com | Managed PostgreSQL | Live |

---

## 2. Docker Compose (Local + Staging)

```yaml
# infra/docker-compose.yml (see actual file for full config)
services:
  web:       # Next.js
  api:       # NestJS
  postgres:  # PostgreSQL 16
  redis:     # Redis 7
  meilisearch: # Search
  minio:     # S3-compatible storage
  prometheus: # Metrics
  grafana:   # Dashboards
  loki:      # Log aggregation
```

---

## 3. Production Deployment Options

### Option A: Vercel + Railway/Render (Recommended for speed)
- Web: Vercel (zero-config Next.js, edge network)
- API: Railway or Render (NestJS)
- DB: Supabase (managed PostgreSQL)
- Redis: Upstash (serverless Redis)
- Storage: AWS S3

### Option B: Self-hosted Docker (Full control)
- Web + API: Docker Swarm or Kubernetes
- DB: Managed PostgreSQL (RDS/Supabase)
- Redis: ElastiCache or self-hosted cluster
- Storage: S3

---

## 4. CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]

jobs:
  test:
    - npm run lint
    - npm run typecheck  
    - npm run test
    - npm run build

  security:
    - npm audit --audit-level=high
    - snyk test

  deploy-web:
    needs: [test, security]
    - vercel deploy --prod

  deploy-api:
    needs: [test, security]
    - docker build + push
    - railway up / render deploy

  post-deploy:
    - run smoke tests
    - notify Slack
    - ping Google Search Console
```

---

## 5. Environment Variables

```env
# apps/web
NEXT_PUBLIC_API_URL=https://api.aifreetools.com
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_ADSENSE_ID=ca-pub-XXXXXXXX

# apps/api  
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_PRIVATE_KEY=...
JWT_PUBLIC_KEY=...

# AI Providers
OPENCLAW_API_KEY=...
ANTHROPIC_API_KEY=...
OPENAI_API_KEY=...
GROQ_API_KEY=...

# Storage
AWS_S3_BUCKET=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...

# Email
SENDGRID_API_KEY=...

# Monitoring
PROMETHEUS_PORT=9090
```
