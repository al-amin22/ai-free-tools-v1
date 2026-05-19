import { query, queryOne } from '@/lib/db'
import { getCache, setCache, generateKey } from '@/lib/cache'
import type { Tool } from '@/types/database'

const CACHE_TTL = 3600

export async function getAllTools(): Promise<Tool[]> {
  const cacheKey = generateKey('tools', 'all')
  const cached = getCache<Tool[]>(cacheKey)
  if (cached) return cached

  const rows = await query<Tool>(
    `SELECT t.*,
       c.slug AS category_slug,
       c.name AS category_name,
       c.color AS category_color
     FROM tools t
     LEFT JOIN categories c ON t.category_id = c.id
     WHERE t.status = 'published'
     ORDER BY t.keyword_volume DESC`
  )

  setCache(cacheKey, rows, CACHE_TTL)
  return rows
}

export async function getToolBySlug(slug: string): Promise<Tool | null> {
  const cacheKey = generateKey('tool', slug)
  const cached = getCache<Tool>(cacheKey)
  if (cached) return cached

  const tool = await queryOne<Tool>(
    `SELECT t.*,
       c.slug AS category_slug,
       c.name AS category_name,
       c.color AS category_color
     FROM tools t
     LEFT JOIN categories c ON t.category_id = c.id
     WHERE t.slug = $1 AND t.status = 'published'`,
    [slug]
  )

  if (tool) setCache(cacheKey, tool, CACHE_TTL)
  return tool
}

export async function getToolsByCategory(categorySlug: string): Promise<Tool[]> {
  const cacheKey = generateKey('tools', 'category', categorySlug)
  const cached = getCache<Tool[]>(cacheKey)
  if (cached) return cached

  const rows = await query<Tool>(
    `SELECT t.*,
       c.slug AS category_slug,
       c.name AS category_name,
       c.color AS category_color
     FROM tools t
     JOIN categories c ON t.category_id = c.id
     WHERE c.slug = $1 AND t.status = 'published'
     ORDER BY t.keyword_volume DESC`,
    [categorySlug]
  )

  setCache(cacheKey, rows, CACHE_TTL)
  return rows
}

export async function getFeaturedTools(limit = 6): Promise<Tool[]> {
  const cacheKey = generateKey('tools', 'featured', String(limit))
  const cached = getCache<Tool[]>(cacheKey)
  if (cached) return cached

  const rows = await query<Tool>(
    `SELECT t.*,
       c.slug AS category_slug,
       c.name AS category_name,
       c.color AS category_color
     FROM tools t
     LEFT JOIN categories c ON t.category_id = c.id
     WHERE t.status = 'published'
     ORDER BY t.keyword_volume DESC
     LIMIT $1`,
    [limit]
  )

  setCache(cacheKey, rows, CACHE_TTL)
  return rows
}

export async function getRelatedTools(ids: string[]): Promise<Tool[]> {
  if (!ids?.length) return []

  return query<Tool>(
    `SELECT t.*,
       c.slug AS category_slug,
       c.name AS category_name,
       c.color AS category_color
     FROM tools t
     LEFT JOIN categories c ON t.category_id = c.id
     WHERE t.id = ANY($1::uuid[])
       AND t.status = 'published'`,
    [ids]
  )
}

export async function incrementToolViews(toolId: string): Promise<void> {
  await query(
    'UPDATE tools SET total_views = total_views + 1 WHERE id = $1',
    [toolId]
  )
}
