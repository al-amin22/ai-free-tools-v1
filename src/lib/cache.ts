interface CacheEntry<T> {
  value: T
  expiresAt: number
}

const store = new Map<string, CacheEntry<any>>()

export function setCache<T>(
  key: string,
  value: T,
  ttlSeconds: number
): void {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000,
  })
}

export function getCache<T>(key: string): T | null {
  const entry = store.get(key)
  if (!entry) return null
  if (entry.expiresAt < Date.now()) {
    store.delete(key)
    return null
  }
  return entry.value as T
}

export function invalidateCache(key: string): void {
  store.delete(key)
}

export function invalidatePattern(pattern: string): void {
  for (const key of store.keys()) {
    if (key.includes(pattern)) store.delete(key)
  }
}

export function generateKey(...parts: string[]): string {
  return parts.filter(Boolean).join(':')
}

export function getCacheStats(): { size: number; keys: string[] } {
  return {
    size: store.size,
    keys: Array.from(store.keys()),
  }
}

setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.expiresAt < now) store.delete(key)
  }
}, 5 * 60 * 1000)
