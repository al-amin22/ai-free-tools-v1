import { createHash } from 'crypto'
import { query } from '@/lib/db'
import { getCache, setCache, generateKey } from '@/lib/cache'

export function hashIP(ip: string): string {
  return createHash('sha256')
    .update(ip + 'aifreetools_2026_salt')
    .digest('hex')
    .substring(0, 32)
}

export function getClientIP(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0].trim()
  const realIP = request.headers.get('x-real-ip')
  if (realIP) return realIP.trim()
  const cfIP = request.headers.get('cf-connecting-ip')
  if (cfIP) return cfIP.trim()
  return '0.0.0.0'
}

export async function checkRateLimit(
  request: Request,
  isRegistered = false
): Promise<{
  allowed: boolean
  remaining: number
  resetIn: number
  limit: number
  used: number
}> {
  const cacheKey = generateKey('rl_config')
  let config = getCache<any>(cacheKey)

  if (!config) {
    const rows = await query(
      "SELECT value FROM site_config WHERE key = 'rate_limit_config'"
    )
    config = rows[0]?.value ?? {
      anonymous_per_hour: 5,
      registered_per_hour: 20,
    }
    setCache(cacheKey, config, 3600)
  }

  const limit = isRegistered
    ? config.registered_per_hour
    : config.anonymous_per_hour

  const ip = getClientIP(request)
  const ipHash = hashIP(ip)

  const rows = await query<{ count: string }>(
    `SELECT COUNT(*) as count
     FROM tool_usage
     WHERE ip_hash = $1
       AND created_at > NOW() - INTERVAL '1 hour'`,
    [ipHash]
  )

  const used = parseInt(rows[0]?.count ?? '0', 10)
  const allowed = used < limit
  const remaining = Math.max(0, limit - used)

  return { allowed, remaining, resetIn: 3600, limit, used }
}
