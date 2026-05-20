# Database Design
# AI Free Tools Ecosystem

Version: 1.0.0

---

## 1. Database Stack

- **Primary DB**: PostgreSQL 16
- **Cache**: Redis 7
- **Search**: Meilisearch / Elasticsearch

---

## 2. Core Schema

### 2.1 Tools

```sql
CREATE TABLE tools (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          VARCHAR(100) UNIQUE NOT NULL,
  name          VARCHAR(200) NOT NULL,
  category_id   UUID NOT NULL REFERENCES categories(id),
  description   TEXT NOT NULL,
  is_active     BOOLEAN DEFAULT true,
  is_featured   BOOLEAN DEFAULT false,
  sort_order    INTEGER DEFAULT 0,
  
  -- Config (JSON)
  form_schema   JSONB NOT NULL,    -- Dynamic form field definitions
  prompt_config JSONB NOT NULL,    -- AI prompt chain config
  export_config JSONB NOT NULL,    -- PDF/DOCX template config
  seo_config    JSONB NOT NULL,    -- SEO metadata config
  
  -- Counters
  generation_count  BIGINT DEFAULT 0,
  export_count      BIGINT DEFAULT 0,
  
  -- Timestamps
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tools_slug ON tools(slug);
CREATE INDEX idx_tools_category ON tools(category_id);
CREATE INDEX idx_tools_active ON tools(is_active) WHERE is_active = true;
```

### 2.2 Categories

```sql
CREATE TABLE categories (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug          VARCHAR(100) UNIQUE NOT NULL,
  name          VARCHAR(200) NOT NULL,
  description   TEXT,
  icon          VARCHAR(50),
  sort_order    INTEGER DEFAULT 0,
  seo_config    JSONB,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.3 Tool Generations

```sql
CREATE TABLE tool_generations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id         UUID NOT NULL REFERENCES tools(id),
  user_id         UUID REFERENCES users(id),  -- NULL for anonymous
  session_id      VARCHAR(100) NOT NULL,       -- browser session
  
  -- Input/Output
  input_data      JSONB NOT NULL,              -- form inputs
  output_text     TEXT,                        -- generated content
  output_metadata JSONB,                       -- AI metadata (tokens, cost)
  
  -- AI Processing
  prompt_version  VARCHAR(20) NOT NULL,
  provider        VARCHAR(50) NOT NULL,        -- which AI provider used
  model           VARCHAR(100) NOT NULL,
  tokens_input    INTEGER,
  tokens_output   INTEGER,
  cost_usd        DECIMAL(10, 6),
  latency_ms      INTEGER,
  
  -- Status
  status          VARCHAR(20) NOT NULL DEFAULT 'pending',
  -- pending | processing | completed | failed | cached
  error_message   TEXT,
  cache_hit       BOOLEAN DEFAULT false,
  
  -- Timestamps
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  completed_at    TIMESTAMPTZ
);

CREATE INDEX idx_generations_tool ON tool_generations(tool_id);
CREATE INDEX idx_generations_user ON tool_generations(user_id);
CREATE INDEX idx_generations_session ON tool_generations(session_id);
CREATE INDEX idx_generations_status ON tool_generations(status);
CREATE INDEX idx_generations_created ON tool_generations(created_at DESC);
```

### 2.4 Exports

```sql
CREATE TABLE exports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generation_id   UUID NOT NULL REFERENCES tool_generations(id),
  user_id         UUID REFERENCES users(id),
  
  format          VARCHAR(10) NOT NULL,  -- pdf | docx
  file_key        VARCHAR(500),          -- S3 key
  file_url        VARCHAR(1000),         -- Signed URL
  file_size_bytes INTEGER,
  
  expires_at      TIMESTAMPTZ NOT NULL,  -- 24hr TTL
  downloaded      BOOLEAN DEFAULT false,
  download_count  INTEGER DEFAULT 0,
  
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_exports_generation ON exports(generation_id);
CREATE INDEX idx_exports_expires ON exports(expires_at);
```

### 2.5 Users

```sql
CREATE TABLE users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           VARCHAR(255) UNIQUE,
  email_verified  BOOLEAN DEFAULT false,
  password_hash   VARCHAR(255),           -- NULL for OAuth users
  
  -- Profile
  full_name       VARCHAR(200),
  avatar_url      VARCHAR(500),
  
  -- Auth
  google_id       VARCHAR(100) UNIQUE,
  
  -- Tier
  tier            VARCHAR(20) DEFAULT 'free',  -- free | premium | admin
  tier_expires_at TIMESTAMPTZ,
  
  -- Limits
  daily_generation_count    INTEGER DEFAULT 0,
  daily_generation_reset_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  last_active_at  TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_google ON users(google_id);
CREATE INDEX idx_users_tier ON users(tier);
```

### 2.6 SEO Pages

```sql
CREATE TABLE seo_pages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type       VARCHAR(30) NOT NULL,
  -- tool | state | longtail | article | comparison | glossary | faq_page
  
  tool_id         UUID REFERENCES tools(id),
  slug            VARCHAR(300) UNIQUE NOT NULL,
  url_path        VARCHAR(500) UNIQUE NOT NULL,
  
  -- SEO Data
  title           VARCHAR(200) NOT NULL,
  meta_description VARCHAR(300) NOT NULL,
  h1              VARCHAR(200) NOT NULL,
  
  -- Content
  content         TEXT,                     -- HTML/Markdown content
  content_hash    VARCHAR(64),              -- for change detection
  word_count      INTEGER,
  
  -- State-specific
  state_code      VARCHAR(2),               -- US state code
  state_name      VARCHAR(50),
  
  -- Schema
  schema_markup   JSONB,
  
  -- SEO Performance
  google_impressions  INTEGER DEFAULT 0,
  google_clicks       INTEGER DEFAULT 0,
  google_ctr          DECIMAL(5,2),
  google_position     DECIMAL(5,1),
  
  -- Status
  is_published    BOOLEAN DEFAULT false,
  is_indexed      BOOLEAN DEFAULT false,
  quality_score   INTEGER,                  -- 0-100 AI-assessed score
  
  -- Timestamps
  published_at    TIMESTAMPTZ,
  last_audited_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_seo_pages_slug ON seo_pages(slug);
CREATE INDEX idx_seo_pages_tool ON seo_pages(tool_id);
CREATE INDEX idx_seo_pages_type ON seo_pages(page_type);
CREATE INDEX idx_seo_pages_state ON seo_pages(state_code);
CREATE INDEX idx_seo_pages_published ON seo_pages(is_published) WHERE is_published = true;
```

### 2.7 FAQs

```sql
CREATE TABLE faqs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  seo_page_id     UUID NOT NULL REFERENCES seo_pages(id),
  tool_id         UUID REFERENCES tools(id),
  
  question        TEXT NOT NULL,
  answer          TEXT NOT NULL,
  
  sort_order      INTEGER DEFAULT 0,
  is_active       BOOLEAN DEFAULT true,
  
  -- SEO Performance
  impression_count INTEGER DEFAULT 0,
  click_count      INTEGER DEFAULT 0,
  
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_faqs_page ON faqs(seo_page_id);
CREATE INDEX idx_faqs_tool ON faqs(tool_id);
```

### 2.8 AI Prompts (Versioned)

```sql
CREATE TABLE ai_prompts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_id         UUID NOT NULL REFERENCES tools(id),
  version         VARCHAR(20) NOT NULL,
  
  system_prompt   TEXT NOT NULL,
  user_prompt_template TEXT NOT NULL,
  
  output_format   VARCHAR(20) NOT NULL,  -- text | json | markdown
  max_tokens      INTEGER NOT NULL,
  temperature     DECIMAL(3,2) NOT NULL,
  
  is_active       BOOLEAN DEFAULT true,
  performance_score DECIMAL(3,2),        -- quality score 0-1
  
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tool_id, version)
);
```

### 2.9 Analytics Events

```sql
CREATE TABLE analytics_events (
  id              BIGSERIAL PRIMARY KEY,
  event_type      VARCHAR(50) NOT NULL,
  -- page_view | tool_open | generation_start | generation_complete
  -- export | copy | share | cta_click | ad_impression | ad_click
  
  page_id         UUID REFERENCES seo_pages(id),
  tool_id         UUID REFERENCES tools(id),
  user_id         UUID REFERENCES users(id),
  session_id      VARCHAR(100),
  
  -- Event data
  properties      JSONB,
  
  -- Context
  referrer        VARCHAR(500),
  user_agent      VARCHAR(500),
  country         VARCHAR(2),
  
  created_at      TIMESTAMPTZ DEFAULT NOW()
) PARTITION BY RANGE (created_at);

-- Monthly partitions
CREATE TABLE analytics_events_2026_05 
  PARTITION OF analytics_events
  FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
```

### 2.10 Internal Links

```sql
CREATE TABLE internal_links (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_page_id  UUID NOT NULL REFERENCES seo_pages(id),
  target_page_id  UUID NOT NULL REFERENCES seo_pages(id),
  
  anchor_text     VARCHAR(200) NOT NULL,
  context         TEXT,
  position        VARCHAR(30),  -- body | related | faq | sidebar
  
  relevance_score DECIMAL(3,2),
  is_active       BOOLEAN DEFAULT true,
  
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(source_page_id, target_page_id, anchor_text)
);
```

---

## 3. Redis Cache Schema

```
# Tool result cache
ai:tool:{toolSlug}:v{version}:{inputHash}   → string (generated text, TTL: 1hr)

# Session rate limiting
ratelimit:gen:{sessionId}:hourly            → counter (TTL: 1hr)
ratelimit:gen:{userId}:daily                → counter (TTL: 24hr)

# Tool metadata cache
tool:meta:{slug}                            → JSON (TTL: 1hr)
tool:list:category:{categorySlug}           → JSON array (TTL: 30min)

# SEO page cache
seo:page:{urlPath}                          → JSON (TTL: 4hr)

# Queue metrics
queue:stats:{queueName}                     → JSON (live)
```

---

## 4. Database Indexes Strategy

### 4.1 Critical Indexes
- All `slug` and `url_path` columns: UNIQUE index
- `tool_generations.created_at`: DESC index (for recent lookups)
- `analytics_events`: partition by month + index on event_type

### 4.2 Partial Indexes
- `tools WHERE is_active = true`
- `seo_pages WHERE is_published = true`
- `users WHERE tier = 'premium'`

### 4.3 JSONB Indexes (GIN)
- `tools.form_schema` — for config queries
- `tool_generations.input_data` — for deduplication
- `analytics_events.properties` — for analytics queries

---

## 5. Database Optimization

- **Connection pooling**: PgBouncer (max 100 connections)
- **Read replicas**: 1 replica for analytics queries
- **Vacuum**: auto-vacuum configured for high-write tables
- **Archival**: analytics_events older than 2 years moved to cold storage
- **Backups**: pg_dump daily, WAL archiving continuous
