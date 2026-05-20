import { NextRequest } from 'next/server';
import { query } from '@/lib/db/pool';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function GET(request: NextRequest) {
  if (request.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const articles = await query<{ id: string; slug: string; title: string; meta_description: string | null; word_count: number | null }>(
      `SELECT id, slug, title, meta_description, word_count
       FROM articles WHERE status = 'published'
       ORDER BY published_at DESC LIMIT 50`
    );

    let passed = 0;
    let issues = 0;

    for (const article of articles) {
      const flags: string[] = [];
      if (!article.meta_description) flags.push('missing_meta_description');
      if ((article.word_count ?? 0) < 800) flags.push('short_content');
      if (article.title.length > 70) flags.push('title_too_long');

      const score = Math.max(0, 100 - flags.length * 20);

      await query(
        `INSERT INTO seo_audits (page_url, page_type, score, issues, checked_at)
         VALUES ($1, 'article', $2, $3, NOW())
         ON CONFLICT (page_url) DO UPDATE SET score = EXCLUDED.score, issues = EXCLUDED.issues, checked_at = NOW()`,
        [`/blog/${article.slug}`, score, JSON.stringify(flags)]
      );

      if (flags.length === 0) passed++;
      else issues++;
    }

    return Response.json({ success: true, audited: articles.length, passed, issues });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
