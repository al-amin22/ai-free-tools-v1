import { query, queryOne } from './pool';

export interface Article {
  id: string;
  tool_id: string | null;
  category_id: string | null;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  meta_title: string | null;
  meta_description: string | null;
  status: 'draft' | 'published' | 'archived';
  angle_used: string | null;
  word_count: number | null;
  published_at: string | null;
  created_at: string;
  category_slug: string | null;
}

export async function getPublishedArticles(limit = 12, offset = 0): Promise<Article[]> {
  return query<Article>(
    `SELECT a.*, c.slug AS category_slug
     FROM articles a
     LEFT JOIN categories c ON a.category_id = c.id
     WHERE a.status = 'published'
     ORDER BY a.published_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return queryOne<Article>(
    `SELECT a.*, c.slug AS category_slug
     FROM articles a
     LEFT JOIN categories c ON a.category_id = c.id
     WHERE a.slug = $1 AND a.status = 'published'`,
    [slug]
  );
}

export async function getArticlesByTool(toolId: string, limit = 5): Promise<Article[]> {
  return query<Article>(
    `SELECT * FROM articles
     WHERE tool_id = $1 AND status = 'published'
     ORDER BY published_at DESC
     LIMIT $2`,
    [toolId, limit]
  );
}

export async function countPublishedArticles(): Promise<number> {
  const rows = await query<{ count: string }>(
    `SELECT COUNT(*) AS count FROM articles WHERE status = 'published'`
  );
  return parseInt(rows[0]?.count ?? '0', 10);
}
