export * from './constants';
export * from './tools/category-1-legal';
export * from './tools/category-2-realestate';
export * from './tools/category-3-hr';
export * from './tools/category-4-finance';
export * from './tools/category-5-business';
export * from './tools/category-6-copywriting';
export * from './tools/category-7-bonus';

import { CATEGORY_1_TOOLS } from './tools/category-1-legal';
import { CATEGORY_2_TOOLS } from './tools/category-2-realestate';
import { CATEGORY_3_TOOLS } from './tools/category-3-hr';
import { CATEGORY_4_TOOLS } from './tools/category-4-finance';
import { CATEGORY_5_TOOLS } from './tools/category-5-business';
import { CATEGORY_6_TOOLS } from './tools/category-6-copywriting';
import { CATEGORY_7_TOOLS } from './tools/category-7-bonus';
import type { ToolConfig } from '@aifreetools/shared-types';

export const ALL_TOOLS: ToolConfig[] = [
  ...CATEGORY_1_TOOLS,
  ...CATEGORY_2_TOOLS,
  ...CATEGORY_3_TOOLS,
  ...CATEGORY_4_TOOLS,
  ...CATEGORY_5_TOOLS,
  ...CATEGORY_6_TOOLS,
  ...CATEGORY_7_TOOLS,
];

export const TOOL_MAP: Record<string, ToolConfig> = Object.fromEntries(
  ALL_TOOLS.map((tool) => [tool.id, tool])
);

export const TOOLS_BY_CATEGORY: Record<string, ToolConfig[]> = ALL_TOOLS.reduce(
  (acc, tool) => {
    const cat = tool.category;
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(tool);
    return acc;
  },
  {} as Record<string, ToolConfig[]>
);

export function getToolById(id: string): ToolConfig | undefined {
  return TOOL_MAP[id];
}

export function getToolsByCategory(category: string): ToolConfig[] {
  return TOOLS_BY_CATEGORY[category] ?? [];
}

export function searchTools(query: string): ToolConfig[] {
  const q = query.toLowerCase();
  return ALL_TOOLS.filter(
    (tool) =>
      tool.id.includes(q) ||
      tool.name.toLowerCase().includes(q) ||
      tool.description.toLowerCase().includes(q) ||
      tool.category.toLowerCase().includes(q)
  );
}
