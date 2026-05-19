import { query } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { toolId, rating, reason } = await request.json()

    if (!toolId || !rating) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Save feedback
    await query(
      'INSERT INTO feedback (tool_id, rating, reason) VALUES ($1, $2, $3)',
      [toolId, rating, reason ?? null]
    )

    // Recalculate satisfaction score
    const stats = await query<{ positive: string; total: string }>(
      `SELECT
         COUNT(*) FILTER (WHERE rating = 'thumbs_up') AS positive,
         COUNT(*) AS total
       FROM feedback
       WHERE tool_id = $1`,
      [toolId]
    )

    const positive = parseInt(stats[0]?.positive ?? '0')
    const total = parseInt(stats[0]?.total ?? '0')
    const score = total > 0 ? Math.round((positive / total) * 100 * 100) / 100 : 100

    await query(
      'UPDATE tools SET satisfaction_score = $1 WHERE id = $2',
      [score, toolId]
    )

    return Response.json({ success: true })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
