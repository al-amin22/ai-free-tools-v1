export type AnalyticsEventType =
  | 'page_view'
  | 'tool_open'
  | 'generation_start'
  | 'generation_complete'
  | 'generation_error'
  | 'export_start'
  | 'export_complete'
  | 'copy_output'
  | 'share'
  | 'cta_click'
  | 'ad_impression'
  | 'ad_click'
  | 'affiliate_click'
  | 'upsell_shown'
  | 'upsell_converted'
  | 'signup'
  | 'login'
  | 'search';

export interface AnalyticsEvent {
  eventType: AnalyticsEventType;
  pageId?: string;
  toolId?: string;
  userId?: string;
  sessionId: string;
  properties?: Record<string, unknown>;
  referrer?: string;
  country?: string;
  timestamp?: string;
}

export interface ToolStats {
  toolSlug: string;
  generationCount: number;
  exportCount: number;
  uniqueUsers: number;
  avgLatencyMs: number;
  avgRating?: number;
  period: 'day' | 'week' | 'month' | 'all';
}
