export * from './system-prompts';
export * from './prompt-builder';
export * from './categories/legal.prompts';
export * from './categories/hr.prompts';
export * from './categories/finance.prompts';
export * from './categories/business.prompts';
export * from './categories/copywriting.prompts';

import { LEGAL_PROMPTS } from './categories/legal.prompts';
import { HR_PROMPTS } from './categories/hr.prompts';
import { FINANCE_PROMPTS } from './categories/finance.prompts';
import { BUSINESS_PROMPTS } from './categories/business.prompts';
import { COPYWRITING_PROMPTS } from './categories/copywriting.prompts';

export const ALL_PROMPTS = {
  ...LEGAL_PROMPTS,
  ...HR_PROMPTS,
  ...FINANCE_PROMPTS,
  ...BUSINESS_PROMPTS,
  ...COPYWRITING_PROMPTS,
} as const;

export type ToolPromptKey = keyof typeof ALL_PROMPTS;

export function getPromptForTool(toolId: string): { user: string } | undefined {
  return (ALL_PROMPTS as Record<string, { user: string }>)[toolId];
}
