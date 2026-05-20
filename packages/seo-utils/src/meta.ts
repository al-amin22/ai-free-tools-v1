export interface MetaTags {
  title: string;
  description: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
  robots: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://aifreetools.com';
const DEFAULT_OG_IMAGE = `${BASE_URL}/og-default.png`;

export function buildToolMeta(params: {
  toolName: string;
  toolId: string;
  description: string;
  category: string;
  state?: string;
  stateName?: string;
}): MetaTags {
  const { toolName, toolId, description, state, stateName } = params;

  const statePrefix = stateName ? `${stateName} ` : '';
  const stateSuffix = stateName ? ` in ${stateName}` : '';

  const title = `Free ${statePrefix}${toolName} | AI-Powered${stateSuffix} — AIFreeTools`;
  const metaDescription =
    description.length > 155
      ? description.substring(0, 152) + '...'
      : description;

  const slug = state ? `/tools/${toolId}/${state.toLowerCase()}` : `/tools/${toolId}`;
  const canonical = `${BASE_URL}${slug}`;
  const ogImage = `${BASE_URL}/og/${toolId}${state ? `-${state.toLowerCase()}` : ''}.png`;

  return {
    title,
    description: metaDescription,
    canonical,
    ogTitle: title,
    ogDescription: metaDescription,
    ogImage: ogImage || DEFAULT_OG_IMAGE,
    ogUrl: canonical,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: metaDescription,
    twitterImage: ogImage || DEFAULT_OG_IMAGE,
    robots: 'index, follow',
  };
}

export function buildStaticPageMeta(params: {
  title: string;
  description: string;
  path: string;
}): MetaTags {
  const { title, description, path } = params;
  const canonical = `${BASE_URL}${path}`;
  const ogImage = DEFAULT_OG_IMAGE;

  return {
    title,
    description,
    canonical,
    ogTitle: title,
    ogDescription: description,
    ogImage,
    ogUrl: canonical,
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterTitle: title,
    twitterDescription: description,
    twitterImage: ogImage,
    robots: 'index, follow',
  };
}

export function truncateDescription(text: string, maxLength = 155): string {
  if (text.length <= maxLength) return text;
  const truncated = text.substring(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  return (lastSpace > 0 ? truncated.substring(0, lastSpace) : truncated) + '...';
}
