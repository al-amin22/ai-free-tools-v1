import { query } from '@/lib/db'

export const runtime = 'nodejs'

export async function GET(request: Request) {
  const secret = request.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Fetch Google Trends untuk keyword utama
    const configRow = await query(
      "SELECT value FROM site_config WHERE key = 'google_trends_config'"
    )
    const config = configRow[0]?.value ?? {}
    const categories = config.categories ?? []

    // Get all primary keywords dari tools
    const tools = await query<{ primary_keyword: string; keyword_volume: number }>(
      "SELECT primary_keyword, keyword_volume FROM tools WHERE status = 'published' ORDER BY keyword_volume DESC"
    )

    const keywords = [
      ...tools.map((t) => t.primary_keyword),
      ...categories,
    ].filter(Boolean).slice(0, 30)

    let fetched = 0
    let errors = 0

    for (const keyword of keywords) {
      try {
        // Google Trends API (unofficial via trends.google.com)
        const encodedKeyword = encodeURIComponent(keyword)
        const trendsUrl = `https://trends.google.com/trends/api/explore?hl=en-US&tz=300&req={"comparisonItem":[{"keyword":"${encodedKeyword}","geo":"US","time":"today 3-m"}],"category":0,"property":""}`

        const response = await fetch(trendsUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; TrendsFetcher/1.0)',
          },
        })

        if (response.ok) {
          const text = await response.text()
          // Google Trends prefixes response with ")]}',\n"
          const jsonStr = text.replace(/^\)\]\}'\\n/, '').replace(/^\)]\}',\n/, '')

          let trendScore = 50 // default
          let relatedQueries: any[] = []

          try {
            const data = JSON.parse(jsonStr)
            const timeline = data?.widgets?.[0]?.data?.timelineData ?? []
            if (timeline.length > 0) {
              const recent = timeline.slice(-4)
              trendScore = Math.round(
                recent.reduce((sum: number, d: any) => sum + (d.value?.[0] ?? 50), 0) / recent.length
              )
            }
          } catch {
            // Use default score if parse fails
          }

          // Upsert trend cache
          await query(
            `INSERT INTO trend_cache
             (keyword, trend_score, related_queries, rising_queries, geo, fetched_at, expires_at)
             VALUES ($1, $2, $3, $4, 'US', NOW(), NOW() + INTERVAL '6 hours')
             ON CONFLICT (keyword, geo)
             DO UPDATE SET
               trend_score = EXCLUDED.trend_score,
               fetched_at = NOW(),
               expires_at = NOW() + INTERVAL '6 hours'`,
            [keyword, trendScore, JSON.stringify(relatedQueries), JSON.stringify([])]
          )

          // Update keyword trend direction
          await query(
            `UPDATE keywords
             SET trend_score = $1,
                 trend_direction = CASE
                   WHEN $1 >= 70 THEN 'rising'
                   WHEN $1 >= 40 THEN 'stable'
                   ELSE 'falling'
                 END
             WHERE keyword = $2`,
            [trendScore, keyword]
          )

          fetched++
        }
      } catch (err) {
        errors++
      }

      // Rate limit: 500ms between requests
      await new Promise((r) => setTimeout(r, 500))
    }

    return Response.json({ success: true, fetched, errors, keywords: keywords.length })
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}
