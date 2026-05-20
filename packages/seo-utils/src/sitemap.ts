export interface SitemapEntry {
  url: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://aifreetools.com';

export function buildToolSitemapEntries(
  toolIds: string[],
  stateCodes: string[]
): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  const today = new Date().toISOString().split('T')[0];

  for (const toolId of toolIds) {
    entries.push({
      url: `${BASE_URL}/tools/${toolId}`,
      lastmod: today,
      changefreq: 'weekly',
      priority: 0.8,
    });

    for (const stateCode of stateCodes) {
      entries.push({
        url: `${BASE_URL}/tools/${toolId}/${stateCode.toLowerCase()}`,
        lastmod: today,
        changefreq: 'monthly',
        priority: 0.6,
      });
    }
  }

  return entries;
}

export function buildStaticSitemapEntries(): SitemapEntry[] {
  const today = new Date().toISOString().split('T')[0];
  return [
    { url: BASE_URL, lastmod: today, changefreq: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/tools`, lastmod: today, changefreq: 'weekly', priority: 0.9 },
    { url: `${BASE_URL}/blog`, lastmod: today, changefreq: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/about`, lastmod: today, changefreq: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/contact`, lastmod: today, changefreq: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastmod: today, changefreq: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terms`, lastmod: today, changefreq: 'yearly', priority: 0.3 },
  ];
}

export function buildSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) => `  <url>
    <loc>${escapeXml(e.url)}</loc>
    ${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}
    ${e.changefreq ? `<changefreq>${e.changefreq}</changefreq>` : ''}
    ${e.priority !== undefined ? `<priority>${e.priority.toFixed(1)}</priority>` : ''}
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export function buildSitemapIndexXml(sitemapUrls: string[]): string {
  const today = new Date().toISOString();
  const sitemaps = sitemapUrls
    .map(
      (url) => `  <sitemap>
    <loc>${escapeXml(url)}</loc>
    <lastmod>${today}</lastmod>
  </sitemap>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps}
</sitemapindex>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
