import { query, queryOne } from '@/lib/db'
import { getCache, setCache, generateKey } from '@/lib/cache'

export async function getSiteConfig(): Promise<Record<string, any>> {
  const cacheKey = generateKey('site_config', 'all')
  const cached = getCache<Record<string, any>>(cacheKey)
  if (cached) return cached

  const rows = await query<{ key: string; value: any }>(
    'SELECT key, value FROM site_config'
  )

  const config = Object.fromEntries(rows.map((r) => [r.key, r.value]))
  setCache(cacheKey, config, 3600)
  return config
}

export async function getConfigValue(key: string): Promise<any> {
  const cacheKey = generateKey('config', key)
  const cached = getCache<any>(cacheKey)
  if (cached) return cached

  const row = await queryOne<{ value: any }>(
    'SELECT value FROM site_config WHERE key = $1',
    [key]
  )

  if (row?.value) setCache(cacheKey, row.value, 3600)
  return row?.value ?? null
}

export async function updateConfig(key: string, value: any): Promise<void> {
  await query(
    `INSERT INTO site_config (key, value)
     VALUES ($1, $2)
     ON CONFLICT (key)
     DO UPDATE SET value = $2, updated_at = NOW()`,
    [key, JSON.stringify(value)]
  )
}
