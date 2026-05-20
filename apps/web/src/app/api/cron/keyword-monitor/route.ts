import { NextRequest } from 'next/server';
import { query } from '@/lib/db/pool';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  if (request.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Check for high-trend keywords that don't yet have articles
    const gaps = await query<{ keyword: string; trend_score: number }>(
      `SELECT tc.keyword, tc.trend_score
       FROM trend_cache tc
       LEFT JOIN keywords k ON k.keyword = tc.keyword
       WHERE tc.trend_score >= 60
         AND tc.expires_at > NOW()
         AND k.id IS NULL
       ORDER BY tc.trend_score DESC
       LIMIT 20`
    );

    let inserted = 0;
    for (const gap of gaps) {
      await query(
        `INSERT INTO keywords (keyword, volume, status, source)
         VALUES ($1, $2, 'opportunity', 'trend_monitor')
         ON CONFLICT (keyword) DO NOTHING`,
        [gap.keyword, gap.trend_score * 100]
      );
      inserted++;
    }

    // Flag stale articles (>30 days, ranking dropped)
    await query(
      `UPDATE articles SET status = 'needs_refresh'
       WHERE status = 'published'
         AND published_at < NOW() - INTERVAL '30 days'
         AND word_count < 1000`
    );

    return Response.json({ success: true, keywordGaps: gaps.length, inserted });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
