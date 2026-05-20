// ============================================================
// Tool Domain Types
// ============================================================

export type ToolCategory =
  | 'legal-documents'
  | 'real-estate'
  | 'hr-recruitment'
  | 'finance-tax'
  | 'small-business'
  | 'copywriting-content'
  | 'high-intent-legal';

export type FieldType =
  | 'text'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'radio'
  | 'checkbox'
  | 'number'
  | 'date'
  | 'toggle'
  | 'richtext'
  | 'currency'
  | 'percentage'
  | 'email'
  | 'phone'
  | 'address';

export interface FieldOption {
  value: string;
  label: string;
}

export interface FieldValidation {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: string;
  message?: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  description?: string;
  required?: boolean;
  validation?: FieldValidation;
  options?: FieldOption[];
  defaultValue?: unknown;
  // Conditional rendering
  showWhen?: {
    field: string;
    operator: 'equals' | 'notEquals' | 'includes' | 'notEmpty';
    value?: unknown;
  };
}

export interface FormGroup {
  id: string;
  title: string;
  description?: string;
  fieldIds: string[];
  collapsible?: boolean;
  defaultExpanded?: boolean;
}

export interface FormSchema {
  fields: FormField[];
  groups?: FormGroup[];
}

export interface PromptStep {
  id: string;
  role: 'system' | 'user' | 'assistant';
  template: string;
  dependsOn?: string;
  validatorName?: string;
}

export interface PromptConfig {
  version: string;
  steps: PromptStep[];
  outputFormat: 'text' | 'json' | 'markdown';
  maxTokens: number;
  temperature: number;
}

export interface ExportConfig {
  pdfTemplate: string;
  docxTemplate: string;
  fileNameTemplate: string;
  pageSize: 'letter' | 'a4' | 'legal';
  margins?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface ToolSEOConfig {
  titleTemplate: string;
  descriptionTemplate: string;
  primaryKeyword: string;
  keywords: string[];
  faqCount: number;
  generateStatePages: boolean;
  articleTopics: string[];
  relatedTools: string[];
  searchIntent: 'informational' | 'transactional' | 'commercial';
}

export interface MonetizationConfig {
  affiliatePartners: string[];
  adPlacements: ('header' | 'post-result' | 'sidebar' | 'in-content' | 'footer')[];
  leadGenCTA?: string;
  upsellTrigger?: 'export' | 'save' | 'copy';
}

export interface ToolConfig {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: ToolCategory;
  description: string;
  tagline: string;
  icon: string;
  sortOrder: number;
  isFeatured: boolean;
  formSchema: FormSchema;
  promptConfig: PromptConfig;
  exportConfig: ExportConfig;
  seoConfig: ToolSEOConfig;
  monetizationConfig: MonetizationConfig;
}

// Runtime types (from DB or API)
export interface Tool {
  id: string;
  slug: string;
  name: string;
  category: ToolCategory;
  description: string;
  generationCount: number;
  exportCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GenerationStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cached';

export interface ToolGeneration {
  id: string;
  toolId: string;
  toolSlug: string;
  status: GenerationStatus;
  output?: string;
  inputData: Record<string, unknown>;
  provider?: string;
  latencyMs?: number;
  tokensInput?: number;
  tokensOutput?: number;
  costUsd?: number;
  cacheHit: boolean;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

export interface GenerateToolRequest {
  inputs: Record<string, unknown>;
  stream?: boolean;
}

export interface GenerateToolResponse {
  generationId: string;
  output: string;
  metadata: {
    promptVersion: string;
    provider: string;
    latencyMs: number;
    tokensUsed: number;
    cached: boolean;
  };
}
