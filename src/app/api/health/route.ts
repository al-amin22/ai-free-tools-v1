import { query } from '@/lib/db'

export async function GET() {
  try {
    const rows = await query<{ now: string; version: string }>(
      'SELECT NOW() as now, version() as version'
    )
    return Response.json({
      status: 'ok',
      database: 'connected',
      timestamp: rows[0]?.now,
      environment: process.env.NODE_ENV,
    })
  } catch (error: any) {
    return Response.json(
      { status: 'error', database: 'disconnected', error: error.message },
      { status: 500 }
    )
  }
}
