export type AIProvider = 'openclaw' | 'claude' | 'openai' | 'groq' | 'mock';

export interface AIRequest {
  provider?: AIProvider;
  model?: string;
  messages: AIMessage[];
  maxTokens?: number;
  temperature?: number;
  stream?: boolean;
  responseFormat?: 'text' | 'json';
  toolSlug?: string;
  promptVersion?: string;
}

export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AIResponse {
  content: string;
  provider: AIProvider;
  model: string;
  tokensUsed?: number;
  cached: boolean;
}

export interface AIStreamChunk {
  delta: string;
  done: boolean;
}

export type AIManagerJobType =
  | 'seo_audit'
  | 'content_refresh'
  | 'faq_generation'
  | 'og_image_generation'
  | 'internal_link_optimization'
  | 'programmatic_page_generation'
  | 'keyword_ranking_check'
  | 'ad_placement_optimization';

export interface AIManagerJob {
  id: string;
  jobType: AIManagerJobType;
  targetId?: string;
  status: 'queued' | 'running' | 'completed' | 'failed';
  result?: unknown;
  error?: string;
  scheduledAt: string;
  startedAt?: string;
  completedAt?: string;
}
