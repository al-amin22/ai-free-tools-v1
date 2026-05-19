-- ============================================
-- SEED: CATEGORIES (6 categories)
-- ============================================
INSERT INTO categories
(name, slug, description, meta_title, meta_description,
icon, color, rpm_min, rpm_max, sort_order)
VALUES

(
  'Legal Documents',
  'legal',
  'Free AI-powered legal document generators for US businesses and professionals. Create NDAs, contracts, cease and desist letters, lease agreements, and more in seconds. No lawyer needed for standard documents.',
  'Free Legal Document Generators — AI Powered',
  'Generate professional legal documents for US businesses free. NDA, contracts, agreements instantly. AI attorney-trained, no sign up required.',
  '⚖️', '#DC2626', 50, 80, 1
),

(
  'Real Estate',
  'real-estate',
  'Free AI real estate tools for US landlords, agents, and buyers. Generate lease agreements, eviction notices, offer letters, ROI calculators, and all property documents instantly.',
  'Free Real Estate Document Generators — AI Tools',
  'Generate lease agreements, eviction notices, real estate documents free. AI tools for US landlords and agents. No sign up required.',
  '🏠', '#EA580C', 40, 70, 2
),

(
  'HR & Recruitment',
  'hr',
  'Free AI HR tools for US businesses. Generate job descriptions, performance reviews, offer letters, resignation letters, PIPs, and all HR documents instantly. No HR department needed.',
  'Free HR Document Generators — AI Powered Tools',
  'Generate job descriptions, performance reviews, offer letters free. AI HR tools for US businesses and managers. No sign up required.',
  '👥', '#CA8A04', 25, 50, 3
),

(
  'Finance & Tax',
  'finance',
  'Free AI finance tools for US freelancers and small businesses. Calculate taxes, generate invoices, plan budgets, track expenses, and analyze financials. IRS-aware calculations.',
  'Free Finance & Tax Tools — AI Calculators & Generators',
  'Free invoice generator, tax calculator, budget planner for US freelancers. AI-powered, IRS-compliant calculations. No sign up required.',
  '💰', '#16A34A', 50, 100, 4
),

(
  'Small Business',
  'business',
  'Free AI business tools for US entrepreneurs and small business owners. Generate business plans, proposals, SOPs, cold emails, Google review responses, and essential business documents.',
  'Free Small Business Tools — AI Powered Generators',
  'Generate business plans, proposals, SOPs free. AI tools for US small business owners and entrepreneurs. No sign up required.',
  '🚀', '#2563EB', 20, 40, 5
),

(
  'Copywriting & Content',
  'content',
  'Free AI writing tools for US professionals and job seekers. Generate cover letters, resume summaries, LinkedIn profiles, product descriptions, email subject lines, and marketing copy.',
  'Free AI Writing & Copywriting Tools — No Sign Up',
  'Generate cover letters, product descriptions, LinkedIn profiles free. AI writing tools for US professionals and job seekers. No sign up.',
  '✍️', '#9333EA', 15, 30, 6
);

-- ============================================
-- SEED: SITE CONFIG
-- ============================================
INSERT INTO site_config (key, value, description) VALUES

('adsense_config',
'{
  "publisher_id": "",
  "slots": {
    "leaderboard": "",
    "rectangle": "",
    "in_article": "",
    "sidebar": ""
  },
  "auto_ads": true,
  "placement_rules": {
    "legal": ["top", "sidebar", "below_output", "in_content", "bottom"],
    "finance": ["top", "sidebar", "below_output", "in_content", "bottom"],
    "real_estate": ["top", "sidebar", "in_content", "bottom"],
    "hr": ["top", "in_content", "bottom"],
    "business": ["top", "in_content", "bottom"],
    "content": ["top", "below_output", "bottom"]
  }
}',
'Google AdSense configuration and placement rules'),

('seo_config',
'{
  "site_name": "AI Free Tools",
  "site_url": "https://yourdomain.com",
  "default_og_image": "/og-default.png",
  "hreflang": "en-us",
  "target_country": "US",
  "geo_region": "US",
  "geo_placename": "United States",
  "google_verification": "",
  "bing_verification": ""
}',
'Global SEO and geo-targeting settings'),

('rate_limit_config',
'{
  "anonymous_per_hour": 5,
  "registered_per_hour": 20,
  "window_hours": 1,
  "soft_limit_message": "You have used your 5 free generates today",
  "upgrade_message": "Sign up free to get 20 generates per hour"
}',
'Rate limiting configuration'),

('ai_config',
'{
  "primary_provider": "groq",
  "fallback_provider": "gemini",
  "last_resort_provider": "together",
  "max_retries": 3,
  "retry_on_validation_fail": true,
  "validation_min_score": 65,
  "auto_save_good_outputs": true,
  "good_output_threshold": 85
}',
'AI provider and quality configuration'),

('quality_thresholds',
'{
  "min_satisfaction_score": 85,
  "min_validation_score": 70,
  "alert_below": 80,
  "auto_pause_below": 60,
  "review_after_negative_feedback": 3
}',
'Quality control thresholds'),

('seo_audit_config',
'{
  "run_frequency_hours": 168,
  "min_score_alert": 70,
  "auto_fix_enabled": true,
  "checks": [
    "title_length",
    "meta_description_length",
    "keyword_in_title",
    "faq_count",
    "content_length",
    "usa_mentions",
    "schema_ready",
    "related_tools_count",
    "keyword_in_description",
    "input_fields_count"
  ]
}',
'SEO audit configuration'),

('article_gen_config',
'{
  "min_word_count": 2000,
  "target_word_count": 2200,
  "min_faq_count": 7,
  "auto_publish": true,
  "submit_to_google": true,
  "daily_article_limit": 3,
  "trend_threshold_score": 40,
  "anti_duplication_check": true,
  "angle_rotation_days": 30,
  "available_angles": [
    "complete-guide",
    "how-to-step-by-step",
    "common-mistakes",
    "state-specific",
    "comparison",
    "beginner-guide",
    "advanced-strategies",
    "case-study",
    "faq-driven",
    "industry-specific"
  ]
}',
'Article generation configuration'),

('google_trends_config',
'{
  "geo": "US",
  "fetch_frequency_hours": 6,
  "keywords_per_fetch": 20,
  "min_trend_score": 40,
  "categories": [
    "legal documents",
    "business contracts",
    "hr tools",
    "tax calculator",
    "invoice generator",
    "cover letter",
    "lease agreement",
    "nda template"
  ]
}',
'Google Trends monitoring configuration'),

('us_states_config',
'{
  "priority_states": [
    {"name": "California", "slug": "california", "abbr": "CA", "population": 39000000},
    {"name": "Texas", "slug": "texas", "abbr": "TX", "population": 30000000},
    {"name": "Florida", "slug": "florida", "abbr": "FL", "population": 22000000},
    {"name": "New York", "slug": "new-york", "abbr": "NY", "population": 20000000},
    {"name": "Pennsylvania", "slug": "pennsylvania", "abbr": "PA", "population": 13000000},
    {"name": "Illinois", "slug": "illinois", "abbr": "IL", "population": 12500000},
    {"name": "Ohio", "slug": "ohio", "abbr": "OH", "population": 11800000},
    {"name": "Georgia", "slug": "georgia", "abbr": "GA", "population": 10900000},
    {"name": "North Carolina", "slug": "north-carolina", "abbr": "NC", "population": 10600000},
    {"name": "Michigan", "slug": "michigan", "abbr": "MI", "population": 10000000}
  ]
}',
'US states configuration for state-specific pages');
