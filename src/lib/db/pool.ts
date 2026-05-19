import { Pool, PoolClient } from 'pg'

const globalForPg = globalThis as unknown as { pgPool: Pool }

export const pool =
  globalForPg.pgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    ssl:
      process.env.NODE_ENV === 'production'
        ? { rejectUnauthorized: false }
        : false,
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPg.pgPool = pool
}

export async function query<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  const start = Date.now()
  try {
    const result = await pool.query(text, params)
    const duration = Date.now() - start
    if (duration > 1000) {
      console.warn('[DB SLOW QUERY]', {
        text: text.substring(0, 120),
        duration: `${duration}ms`,
      })
    }
    return result.rows as T[]
  } catch (error: any) {
    console.error('[DB ERROR]', {
      text: text.substring(0, 120),
      error: error.message,
    })
    throw new Error(`Database error: ${error.message}`)
  }
}

export async function queryOne<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const rows = await query<T>(text, params)
  return rows[0] ?? null
}

export async function queryExists(
  text: string,
  params?: any[]
): Promise<boolean> {
  const rows = await query(text, params)
  return rows.length > 0
}

export async function transaction<T>(
  fn: (client: PoolClient) => Promise<T>
): Promise<T> {
  const client = await pool.connect()
  try {
    await client.query('BEGIN')
    const result = await fn(client)
    await client.query('COMMIT')
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    throw error
  } finally {
    client.release()
  }
}
