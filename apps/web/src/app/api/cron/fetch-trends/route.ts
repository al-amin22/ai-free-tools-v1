import { NextRequest } from 'next/server';
import { query } from '@/lib/db/pool';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  if (request.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const tools = await query<{ primary_keyword: string }>(
      `SELECT primary_keyword FROM tools WHERE status = 'published' ORDER BY keyword_volume DESC LIMIT 30`
    );

    const keywords = tools.map((t) => t.primary_keyword).filter(Boolean);
    let fetched = 0;
    let errors = 0;

    for (const keyword of keywords) {
      try {
        const encoded = encodeURIComponent(keyword);
        const url = `https://trends.google.com/trends/api/explore?hl=en-US&tz=300&req=${encodeURIComponent(JSON.stringify({ comparisonItem: [{ keyword: encoded, geo: 'US', time: 'today 3-m' }], category: 0, property: '' }))}`;

        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
        let trendScore = 50;

        if (res.ok) {
          const text = await res.text();
          try {
            const json = JSON.parse(text.replace(/^\)\]\}',?\n/, ''));
            const timeline = json?.widgets?.[0]?.data?.timelineData ?? [];
            if (timeline.length > 0) {
              const recent = timeline.slice(-4);
              trendScore = Math.round(
                recent.reduce((s: number, d: { value?: number[] }) => s + (d.value?.[0] ?? 50), 0) / recent.length
              );
            }
          } catch { /* use default */ }

          await query(
            `INSERT INTO trend_cache (keyword, trend_score, related_queries, rising_queries, geo, fetched_at, expires_at)
             VALUES ($1, $2, '[]', '[]', 'US', NOW(), NOW() + INTERVAL '6 hours')
             ON CONFLICT (keyword, geo) DO UPDATE SET trend_score = EXCLUDED.trend_score, fetched_at = NOW(), expires_at = NOW() + INTERVAL '6 hours'`,
            [keyword, trendScore]
          );

          fetched++;
        }
      } catch { errors++; }

      await new Promise((r) => setTimeout(r, 500));
    }

    return Response.json({ success: true, fetched, errors, total: keywords.length });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
