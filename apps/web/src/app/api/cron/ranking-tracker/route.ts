import { NextRequest } from 'next/server';
import { query } from '@/lib/db/pool';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  if (request.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://aifreetools.com';
    const apiKey = process.env.GOOGLE_SEARCH_CONSOLE_KEY;

    // Fetch impressions/clicks from Search Console if API key available
    if (apiKey) {
      const today = new Date().toISOString().split('T')[0]!;
      const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString().split('T')[0]!;

      const res = await fetch(
        `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            startDate: thirtyDaysAgo,
            endDate: today,
            dimensions: ['query', 'page'],
            rowLimit: 100,
          }),
        }
      );

      if (res.ok) {
        const data = await res.json() as { rows?: Array<{ keys: string[]; position: number; clicks: number; impressions: number }> };
        const rows = data.rows ?? [];

        for (const row of rows) {
          const [keyword, page] = row.keys;
          if (!keyword || !page) continue;
          await query(
            `INSERT INTO search_console_data (keyword, page_url, position, clicks, impressions, recorded_date)
             VALUES ($1, $2, $3, $4, $5, $6)
             ON CONFLICT (keyword, page_url, recorded_date)
             DO UPDATE SET position = EXCLUDED.position, clicks = EXCLUDED.clicks, impressions = EXCLUDED.impressions`,
            [keyword, page, row.position, row.clicks, row.impressions, today]
          );
        }

        return Response.json({ success: true, tracked: rows.length });
      }
    }

    return Response.json({ success: true, tracked: 0, message: 'No API key configured' });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
