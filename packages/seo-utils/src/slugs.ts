export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function buildToolUrl(toolId: string, stateCode?: string): string {
  const base = `/tools/${toolId}`;
  return stateCode ? `${base}/${stateCode.toLowerCase()}` : base;
}

export function buildBlogUrl(slug: string): string {
  return `/blog/${slug}`;
}

export function buildCategoryUrl(categorySlug: string): string {
  return `/tools/category/${categorySlug}`;
}

export function parseToolUrl(pathname: string): { toolId: string; stateCode?: string } | null {
  const match = pathname.match(/^\/tools\/([^/]+)(?:\/([a-z]{2}))?$/);
  if (!match) return null;
  return {
    toolId: match[1],
    stateCode: match[2]?.toUpperCase(),
  };
}

export function getStatePagePaths(toolIds: string[], stateCodes: string[]): string[] {
  return toolIds.flatMap((toolId) =>
    stateCodes.map((code) => buildToolUrl(toolId, code))
  );
}

export function buildLongTailUrl(toolId: string, variant: string): string {
  return `/tools/${toolId}/${toSlug(variant)}`;
}
