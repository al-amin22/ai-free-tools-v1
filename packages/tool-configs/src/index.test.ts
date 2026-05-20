import { describe, it, expect } from 'vitest';
import { ALL_TOOLS, TOOL_MAP, getToolById, searchTools, TOOLS_BY_CATEGORY } from './index';

describe('tool-configs', () => {
  it('exports exactly 65 tools', () => {
    expect(ALL_TOOLS.length).toBe(65);
  });

  it('TOOL_MAP has 65 entries', () => {
    expect(Object.keys(TOOL_MAP).length).toBe(65);
  });

  it('every tool has required fields', () => {
    for (const tool of ALL_TOOLS) {
      expect(tool.id).toBeTruthy();
      expect(tool.name).toBeTruthy();
      expect(tool.description).toBeTruthy();
      expect(tool.category).toBeTruthy();
      expect(tool.formSchema).toBeTruthy();
      expect(tool.promptConfig).toBeTruthy();
    }
  });

  it('getToolById returns correct tool', () => {
    const tool = getToolById('nda-generator');
    expect(tool?.id).toBe('nda-generator');
    expect(tool?.name).toBe('Free NDA Generator');
  });

  it('getToolById returns undefined for unknown id', () => {
    expect(getToolById('does-not-exist')).toBeUndefined();
  });

  it('searchTools finds tools by name', () => {
    const results = searchTools('nda');
    expect(results.length).toBeGreaterThan(0);
  });

  it('TOOLS_BY_CATEGORY has 7 categories', () => {
    expect(Object.keys(TOOLS_BY_CATEGORY).length).toBe(7);
  });
});
