import { NextRequest } from 'next/server';
import { query } from '@/lib/db/pool';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  if (request.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Get articles published in the last 7 days with no SEO audit score
    const unevaluated = await query<{ id: string; slug: string; title: string }>(
      `SELECT a.id, a.slug, a.title
       FROM articles a
       LEFT JOIN seo_audits sa ON sa.page_url = '/blog/' || a.slug
       WHERE a.status = 'published'
         AND a.published_at > NOW() - INTERVAL '7 days'
         AND sa.id IS NULL
       LIMIT 20`
    );

    let evaluated = 0;
    for (const article of unevaluated) {
      // Minimal content evaluation — full AI evaluation would use the NestJS API
      await query(
        `INSERT INTO seo_audits (page_url, page_type, score, issues, checked_at)
         VALUES ($1, 'article', 70, '["pending_deep_evaluation"]', NOW())
         ON CONFLICT (page_url) DO NOTHING`,
        [`/blog/${article.slug}`]
      );
      evaluated++;
    }

    return Response.json({ success: true, evaluated });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
