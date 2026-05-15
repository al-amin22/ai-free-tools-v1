-- ============================================
-- AI FREE TOOLS USA — COMPLETE DATABASE SCHEMA
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- ============================================
-- TABLE 1: CATEGORIES
-- ============================================
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  meta_title VARCHAR(60),
  meta_description VARCHAR(155),
  icon VARCHAR(10),
  color VARCHAR(7),
  rpm_min INTEGER DEFAULT 0,
  rpm_max INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 2: TOOLS (core table)
-- ============================================
CREATE TABLE tools (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  tagline VARCHAR(200),
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,

  -- SEO (all dynamic from DB)
  meta_title VARCHAR(60),
  meta_description VARCHAR(155),
  og_image VARCHAR(255),
  keywords TEXT[],
  primary_keyword VARCHAR(200),
  secondary_keywords TEXT[],
  keyword_volume INTEGER DEFAULT 0,
  keyword_difficulty INTEGER DEFAULT 0,
  current_ranking INTEGER,
  previous_ranking INTEGER,

  -- Content (AI-generated, stored in DB)
  how_it_works JSONB DEFAULT '[]',
  faqs JSONB DEFAULT '[]',
  content_section TEXT,

  -- AI Config (DYNAMIC — update in DB, no redeploy needed)
  input_fields JSONB DEFAULT '[]',
  output_type VARCHAR(20) DEFAULT 'document',
  ai_model VARCHAR(30) DEFAULT 'groq-70b',
  temperature DECIMAL(3,2) DEFAULT 0.5,
  max_tokens INTEGER DEFAULT 2000,
  min_output_length INTEGER DEFAULT 300,
  required_elements TEXT[],
  forbidden_phrases TEXT[] DEFAULT ARRAY[
    'As an AI',
    'I cannot',
    'I am unable',
    'I apologize',
    'certainly here is',
    'of course here is',
    'I should note',
    'please note that I'
  ],

  -- Prompt system (DYNAMIC — fetched from DB every request)
  system_prompt TEXT,
  user_prompt_template TEXT,
  prompt_version INTEGER DEFAULT 1,
  prompt_a TEXT,
  prompt_b TEXT,
  ab_test_active BOOLEAN DEFAULT FALSE,
  ab_test_started_at TIMESTAMPTZ,

  -- Performance
  satisfaction_score DECIMAL(5,2) DEFAULT 100,
  total_uses INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,

  -- Relations
  related_tool_ids UUID[],

  -- State pages
  supports_state_pages BOOLEAN DEFAULT FALSE,

  status VARCHAR(20) DEFAULT 'published',
  published_at TIMESTAMPTZ DEFAULT NOW(),
  needs_update BOOLEAN DEFAULT FALSE,
  last_seo_audit TIMESTAMPTZ,
  last_seo_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 3: ARTICLES (AI-generated blog)
-- ============================================
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(200) NOT NULL,
  slug VARCHAR(200) UNIQUE NOT NULL,
  excerpt TEXT,
  content_html TEXT,
  word_count INTEGER DEFAULT 0,
  reading_time INTEGER DEFAULT 0,
  category_id UUID REFERENCES categories(id),
  tool_id UUID REFERENCES tools(id),

  -- SEO
  meta_title VARCHAR(60),
  meta_description VARCHAR(155),
  keywords TEXT[],
  primary_keyword VARCHAR(200),
  keyword_volume INTEGER DEFAULT 0,
  current_ranking INTEGER,
  previous_ranking INTEGER,

  -- Article structure
  toc JSONB DEFAULT '[]',
  faqs JSONB DEFAULT '[]',
  related_tool_ids UUID[],

  -- Article uniqueness tracking
  article_angle VARCHAR(50),
  target_audience VARCHAR(100),
  geographic_focus VARCHAR(50) DEFAULT 'United States',
  trend_based BOOLEAN DEFAULT FALSE,
  trend_keyword VARCHAR(200),
  trend_score INTEGER DEFAULT 0,

  -- Performance
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  avg_position DECIMAL(5,2),

  -- AI metadata
  ai_generated BOOLEAN DEFAULT TRUE,
  ai_model VARCHAR(30),
  generation_prompt_hash VARCHAR(64),
  last_ai_update TIMESTAMPTZ,
  needs_update BOOLEAN DEFAULT FALSE,
  update_reason TEXT,

  -- SEO audit
  last_seo_audit TIMESTAMPTZ,
  last_seo_score INTEGER,

  status VARCHAR(20) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 4: KEYWORDS
-- ============================================
CREATE TABLE keywords (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  keyword VARCHAR(200) NOT NULL UNIQUE,
  volume INTEGER DEFAULT 0,
  difficulty INTEGER DEFAULT 0,
  cpc DECIMAL(10,2),
  trend_direction VARCHAR(10) DEFAULT 'stable',
  trend_score INTEGER DEFAULT 0,
  category_id UUID REFERENCES categories(id),
  tool_id UUID REFERENCES tools(id),
  article_id UUID REFERENCES articles(id),
  current_ranking INTEGER,
  previous_ranking INTEGER,
  best_ranking INTEGER,
  trend_data JSONB DEFAULT '[]',
  status VARCHAR(20) DEFAULT 'tracking',
  last_checked TIMESTAMPTZ,
  source VARCHAR(50) DEFAULT 'manual',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 5: RANKING HISTORY
-- ============================================
CREATE TABLE ranking_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  keyword_id UUID REFERENCES keywords(id) ON DELETE CASCADE,
  position INTEGER,
  url TEXT,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr DECIMAL(5,4) DEFAULT 0,
  checked_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 6: SEO AUDITS
-- ============================================
CREATE TABLE seo_audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_type VARCHAR(20),
  page_id UUID,
  page_url TEXT,
  score INTEGER,
  previous_score INTEGER,
  issues JSONB DEFAULT '[]',
  suggestions JSONB DEFAULT '[]',
  auto_fixed JSONB DEFAULT '[]',
  passed_checks JSONB DEFAULT '[]',
  audited_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 7: AI JOBS LOG
-- ============================================
CREATE TABLE ai_jobs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_type VARCHAR(50) NOT NULL,
  job_name VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending',
  priority VARCHAR(10) DEFAULT 'normal',
  input JSONB,
  output JSONB,
  error TEXT,
  duration_ms INTEGER,
  tokens_used INTEGER,
  provider VARCHAR(20),
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 8: TOOL USAGE
-- ============================================
CREATE TABLE tool_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  ip_hash VARCHAR(64),
  country VARCHAR(2),
  prompt_variant VARCHAR(1) DEFAULT 'a',
  output_length INTEGER,
  response_time_ms INTEGER,
  ai_provider VARCHAR(20),
  validation_score INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 9: FEEDBACK
-- ============================================
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  rating VARCHAR(10) NOT NULL,
  reason VARCHAR(100),
  output_snippet TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 10: SUBSCRIBERS
-- ============================================
CREATE TABLE subscribers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  source VARCHAR(50) DEFAULT 'rate_limit',
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 11: EXAMPLE OUTPUTS
-- ============================================
CREATE TABLE example_outputs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  output_content TEXT NOT NULL,
  input_used JSONB,
  is_approved BOOLEAN DEFAULT FALSE,
  quality_score INTEGER,
  validation_score INTEGER,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 12: SITE CONFIG
-- ============================================
CREATE TABLE site_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  description TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 13: PERFORMANCE LOGS
-- ============================================
CREATE TABLE performance_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_url TEXT,
  lcp DECIMAL(10,2),
  cls DECIMAL(10,4),
  fid DECIMAL(10,2),
  ttfb DECIMAL(10,2),
  device_type VARCHAR(10),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 14: BACKLINK OPPORTUNITIES
-- ============================================
CREATE TABLE backlink_opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  platform VARCHAR(50),
  question_url TEXT,
  question_text TEXT,
  draft_answer TEXT,
  tool_id UUID REFERENCES tools(id),
  relevance_score INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 15: STATE PAGES
-- ============================================
CREATE TABLE state_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  state_name VARCHAR(50) NOT NULL,
  state_slug VARCHAR(50) NOT NULL,
  meta_title VARCHAR(60),
  meta_description VARCHAR(155),
  content_html TEXT,
  faqs JSONB DEFAULT '[]',
  state_law_reference TEXT,
  status VARCHAR(20) DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tool_id, state_slug)
);

-- ============================================
-- TABLE 16: PROMPT VERSIONS
-- ============================================
CREATE TABLE prompt_versions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  system_prompt TEXT,
  user_prompt_template TEXT,
  change_reason TEXT,
  avg_validation_score DECIMAL(5,2),
  avg_satisfaction DECIMAL(5,2),
  total_uses INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TABLE 17: ARTICLE ANGLES USED
-- ============================================
CREATE TABLE article_angles_used (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tool_id UUID REFERENCES tools(id) ON DELETE CASCADE,
  angle VARCHAR(50) NOT NULL,
  keyword_used VARCHAR(200),
  article_id UUID REFERENCES articles(id),
  used_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tool_id, angle)
);

-- ============================================
-- TABLE 18: TREND DATA CACHE
-- ============================================
CREATE TABLE trend_cache (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  keyword VARCHAR(200) NOT NULL,
  trend_score INTEGER DEFAULT 0,
  related_queries JSONB DEFAULT '[]',
  rising_queries JSONB DEFAULT '[]',
  geo VARCHAR(10) DEFAULT 'US',
  fetched_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + INTERVAL '24 hours',
  UNIQUE(keyword, geo)
);

-- ============================================
-- TABLE 19: GOOGLE SEARCH CONSOLE DATA
-- ============================================
CREATE TABLE search_console_data (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  keyword VARCHAR(200),
  page_url TEXT,
  position DECIMAL(5,2),
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr DECIMAL(5,4) DEFAULT 0,
  country VARCHAR(5) DEFAULT 'USA',
  date_range VARCHAR(20),
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_tools_slug ON tools(slug);
CREATE INDEX idx_tools_category ON tools(category_id);
CREATE INDEX idx_tools_status ON tools(status);
CREATE INDEX idx_tools_volume ON tools(keyword_volume DESC);
CREATE INDEX idx_tools_ranking ON tools(current_ranking);
CREATE INDEX idx_tools_needs_update ON tools(needs_update)
  WHERE needs_update = true;
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_keyword ON articles(primary_keyword);
CREATE INDEX idx_articles_tool ON articles(tool_id);
CREATE INDEX idx_articles_angle ON articles(article_angle);
CREATE INDEX idx_articles_needs_update ON articles(needs_update)
  WHERE needs_update = true;
CREATE INDEX idx_keywords_keyword ON keywords(keyword);
CREATE INDEX idx_keywords_tool ON keywords(tool_id);
CREATE INDEX idx_keywords_status ON keywords(status);
CREATE INDEX idx_keywords_volume ON keywords(volume DESC);
CREATE INDEX idx_tool_usage_ip ON tool_usage(ip_hash, created_at);
CREATE INDEX idx_tool_usage_tool ON tool_usage(tool_id, created_at);
CREATE INDEX idx_ranking_history_keyword
  ON ranking_history(keyword_id, checked_at);
CREATE INDEX idx_feedback_tool ON feedback(tool_id, created_at);
CREATE INDEX idx_ai_jobs_type_status ON ai_jobs(job_type, status);
CREATE INDEX idx_ai_jobs_created ON ai_jobs(created_at DESC);
CREATE INDEX idx_seo_audits_page ON seo_audits(page_type, page_id);
CREATE INDEX idx_trend_cache_keyword ON trend_cache(keyword, geo);
CREATE INDEX idx_trend_cache_expires ON trend_cache(expires_at);
CREATE INDEX idx_article_angles_tool ON article_angles_used(tool_id);
CREATE INDEX idx_search_console_keyword
  ON search_console_data(keyword, fetched_at);

-- ============================================
-- AUTO-UPDATE TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_categories_updated_at
  BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tools_updated_at
  BEFORE UPDATE ON tools
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
