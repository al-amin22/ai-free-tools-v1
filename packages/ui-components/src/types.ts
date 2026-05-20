export interface SelectOption {
  value: string;
  label: string;
}

export interface FormFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  disabled?: boolean;
}

export interface ToolCardProps {
  id: string;
  name: string;
  description: string;
  category: string;
  icon?: string;
  href: string;
  badge?: string;
}

export type GenerationStatus = 'idle' | 'generating' | 'streaming' | 'done' | 'error';

export interface GenerationState {
  status: GenerationStatus;
  output: string;
  error?: string;
  tokensUsed?: number;
  provider?: string;
  cached?: boolean;
}
