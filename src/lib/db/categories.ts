import { query, queryOne } from '@/lib/db'
import { getCache, setCache, generateKey } from '@/lib/cache'
import type { Category } from '@/types/database'

export async function getAllCategories(): Promise<Category[]> {
  const cacheKey = generateKey('categories', 'all')
  const cached = getCache<Category[]>(cacheKey)
  if (cached) return cached

  const rows = await query<Category>(
    "SELECT * FROM categories WHERE status = 'published' ORDER BY sort_order ASC"
  )

  setCache(cacheKey, rows, 86400)
  return rows
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const cacheKey = generateKey('category', slug)
  const cached = getCache<Category>(cacheKey)
  if (cached) return cached

  const cat = await queryOne<Category>(
    "SELECT * FROM categories WHERE slug = $1 AND status = 'published'",
    [slug]
  )

  if (cat) setCache(cacheKey, cat, 86400)
  return cat
}
