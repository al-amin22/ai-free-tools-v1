import type { MetadataRoute } from 'next';
import { ALL_TOOLS } from '@aifreetools/tool-configs';
import { US_STATES } from '@aifreetools/tool-configs';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://aifreetools.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const today = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: today, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/tools`, lastModified: today, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastModified: today, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastModified: today, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const toolRoutes: MetadataRoute.Sitemap = ALL_TOOLS.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.id}`,
    lastModified: today,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  const stateRoutes: MetadataRoute.Sitemap = ALL_TOOLS.flatMap((tool) =>
    US_STATES.map((state) => ({
      url: `${BASE_URL}/tools/${tool.id}/${state.value.toLowerCase()}`,
      lastModified: today,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }))
  );

  return [...staticRoutes, ...toolRoutes, ...stateRoutes];
}
