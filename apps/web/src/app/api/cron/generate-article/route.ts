import { NextRequest } from 'next/server';
import { query, queryOne } from '@/lib/db/pool';

export const runtime = 'nodejs';
export const maxDuration = 300;

const API_URL = process.env.INTERNAL_API_URL ?? 'http://localhost:3001/api';

async function logJob(jobName: string): Promise<string> {
  const rows = await query<{ id: string }>(
    `INSERT INTO ai_jobs (job_type, job_name, status, started_at) VALUES ('generate_article', $1, 'running', NOW()) RETURNING id`,
    [jobName]
  );
  return rows[0]?.id ?? '';
}

async function updateJob(id: string, status: string, output: unknown) {
  await query(
    `UPDATE ai_jobs SET status = $1, output = $2, completed_at = NOW(), duration_ms = EXTRACT(EPOCH FROM (NOW() - started_at)) * 1000 WHERE id = $3`,
    [status, JSON.stringify(output), id]
  );
}

export async function GET(request: NextRequest) {
  if (request.headers.get('x-cron-secret') !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const jobId = await logJob('daily_article_generation').catch(() => '');

  try {
    const configRow = await queryOne<{ value: { daily_article_limit?: number } }>(
      `SELECT value FROM site_config WHERE key = 'article_gen_config'`
    );
    const limit = configRow?.value?.daily_article_limit ?? 3;

    const candidates = await query<{
      id: string; name: string; slug: string; primary_keyword: string; category_id: string;
    }>(
      `SELECT t.id, t.name, t.slug, t.primary_keyword, t.category_id
       FROM tools t
       LEFT JOIN articles a ON a.tool_id = t.id AND a.status = 'published'
       WHERE t.status = 'published'
       GROUP BY t.id
       HAVING MAX(a.created_at) IS NULL OR MAX(a.created_at) < NOW() - INTERVAL '7 days'
       ORDER BY t.keyword_volume DESC
       LIMIT $1`,
      [limit]
    );

    if (candidates.length === 0) {
      await updateJob(jobId, 'completed', { message: 'No tools need articles today', generated: 0 });
      return Response.json({ success: true, generated: 0 });
    }

    const results: unknown[] = [];

    for (const tool of candidates) {
      try {
        const res = await fetch(`${API_URL}/articles/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'x-internal-secret': process.env.INTERNAL_SECRET ?? '' },
          body: JSON.stringify({ toolId: tool.id, toolName: tool.name, keyword: tool.primary_keyword }),
        });

        if (!res.ok) throw new Error(`API error ${res.status}`);
        const data = await res.json() as { slug?: string; title?: string };
        results.push({ tool: tool.name, ...data });
      } catch (err) {
        results.push({ tool: tool.name, error: (err as Error).message });
      }
    }

    const generated = (results as Array<{ error?: string }>).filter((r) => !r.error).length;
    await updateJob(jobId, 'completed', { generated, results });

    return Response.json({ success: true, generated, results });
  } catch (err) {
    await updateJob(jobId, 'failed', { error: (err as Error).message });
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
