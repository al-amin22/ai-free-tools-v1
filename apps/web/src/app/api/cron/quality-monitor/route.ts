import { NextRequest } from 'next/server';
import { query } from '@/lib/db/pool';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  if (request.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Flag articles below quality threshold
    const lowQuality = await query<{ id: string; title: string; word_count: number | null }>(
      `SELECT id, title, word_count FROM articles
       WHERE status = 'published'
         AND (word_count IS NULL OR word_count < 500)
       LIMIT 20`
    );

    for (const article of lowQuality) {
      await query(
        `UPDATE articles SET status = 'needs_refresh' WHERE id = $1`,
        [article.id]
      );
    }

    // Log performance metrics
    const stats = await query<{ count: string }>(
      `SELECT COUNT(*) AS count FROM articles WHERE status = 'published'`
    );

    await query(
      `INSERT INTO performance_logs (metric_name, metric_value, recorded_at)
       VALUES ('published_article_count', $1, NOW())`,
      [parseInt(stats[0]?.count ?? '0', 10)]
    );

    return Response.json({ success: true, flagged: lowQuality.length });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
