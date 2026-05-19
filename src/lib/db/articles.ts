import { query, queryOne } from '@/lib/db'
import type { Article } from '@/types/database'

export async function getPublishedArticles(
  limit = 12,
  offset = 0
): Promise<Article[]> {
  return query<Article>(
    `SELECT a.*,
       c.slug AS category_slug
     FROM articles a
     LEFT JOIN categories c ON a.category_id = c.id
     WHERE a.status = 'published'
     ORDER BY a.published_at DESC
     LIMIT $1 OFFSET $2`,
    [limit, offset]
  )
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  return queryOne<Article>(
    `SELECT a.*,
       c.slug AS category_slug
     FROM articles a
     LEFT JOIN categories c ON a.category_id = c.id
     WHERE a.slug = $1 AND a.status = 'published'`,
    [slug]
  )
}

export async function getArticlesByTool(
  toolId: string,
  limit = 5
): Promise<Article[]> {
  return query<Article>(
    `SELECT * FROM articles
     WHERE tool_id = $1 AND status = 'published'
     ORDER BY published_at DESC
     LIMIT $2`,
    [toolId, limit]
  )
}
