export interface InputField {
  name: string
  label: string
  type:
    | 'text'
    | 'textarea'
    | 'select'
    | 'date'
    | 'number'
    | 'state_selector'
    | 'radio'
    | 'email'
  placeholder?: string
  required: boolean
  options?: Array<{ value: string; label: string }>
  rows?: number
  min?: number
  max?: number
  helpText?: string
}

export interface HowItWorksStep {
  step: number
  title: string
  description: string
}

export interface FAQ {
  question: string
  answer: string
}

export interface TOCItem {
  id: string
  title: string
  level: number
}

export interface Tool {
  id: string
  name: string
  slug: string
  tagline: string
  description: string
  category_id: string
  category_slug: string
  category_name: string
  category_color: string
  meta_title: string
  meta_description: string
  og_image: string
  keywords: string[]
  primary_keyword: string
  secondary_keywords: string[]
  keyword_volume: number
  keyword_difficulty: number
  current_ranking: number | null
  how_it_works: HowItWorksStep[]
  faqs: FAQ[]
  content_section: string
  input_fields: InputField[]
  output_type: string
  ai_model: string
  temperature: number
  max_tokens: number
  min_output_length: number
  required_elements: string[]
  forbidden_phrases: string[]
  system_prompt: string
  user_prompt_template: string
  prompt_version: number
  ab_test_active: boolean
  satisfaction_score: number
  total_uses: number
  total_views: number
  related_tool_ids: string[]
  supports_state_pages: boolean
  status: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  meta_title: string
  meta_description: string
  icon: string
  color: string
  rpm_min: number
  rpm_max: number
  sort_order: number
}

export interface Article {
  id: string
  title: string
  slug: string
  excerpt: string
  content_html: string
  word_count: number
  reading_time: number
  category_id: string
  tool_id: string
  category_slug?: string
  meta_title: string
  meta_description: string
  keywords: string[]
  primary_keyword: string
  toc: TOCItem[]
  faqs: FAQ[]
  related_tool_ids: string[]
  article_angle: string
  target_audience: string
  trend_based: boolean
  trend_keyword: string
  impressions: number
  clicks: number
  status: string
  published_at: string
  updated_at: string
}

export interface Keyword {
  id: string
  keyword: string
  volume: number
  difficulty: number
  cpc: number
  trend_direction: string
  trend_score: number
  tool_id: string
  current_ranking: number | null
  status: string
}

export interface SiteConfig {
  [key: string]: any
}
