import { query, queryOne } from '@/lib/db'
import {
  generateUniqueArticle,
  saveArticle,
} from '@/lib/ai/article-engine'
import { auditArticle } from '@/lib/seo/seo-audit'

export const runtime = 'nodejs'
export const maxDuration = 300 // 5 menit untuk artikel panjang

async function logStart(jobName: string) {
  const rows = await query<{ id: string }>(
    `INSERT INTO ai_jobs (job_type, job_name, status, started_at)
     VALUES ('generate_article', $1, 'running', NOW())
     RETURNING id`,
    [jobName]
  )
  return rows[0]?.id ?? ''
}

async function logDone(jobId: string, output: any) {
  await query(
    `UPDATE ai_jobs
     SET status = 'completed', output = $1, completed_at = NOW(),
         duration_ms = EXTRACT(EPOCH FROM (NOW() - started_at)) * 1000
     WHERE id = $2`,
    [JSON.stringify(output), jobId]
  )
}

async function logFailed(jobId: string, error: string) {
  await query(
    `UPDATE ai_jobs
     SET status = 'failed', error = $1, completed_at = NOW()
     WHERE id = $2`,
    [error, jobId]
  )
}

export async function GET(request: Request) {
  // Verify cron secret
  const secret = request.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const jobId = await logStart('daily_article_generation')

  try {
    // Step 1: Get article gen config
    const configRow = await queryOne<{ value: any }>(
      "SELECT value FROM site_config WHERE key = 'article_gen_config'"
    )
    const config = configRow?.value ?? { daily_article_limit: 3 }

    // Step 2: Find tools that need articles most urgently
    // Priority: highest volume keywords WITHOUT articles today
    const candidates = await query<any>(
      `SELECT
         t.id,
         t.name,
         t.slug,
         t.primary_keyword,
         t.secondary_keywords,
         t.keyword_volume,
         t.category_id,
         c.slug AS category_slug,
         COUNT(a.id) AS total_articles,
         MAX(a.created_at) AS last_article_date
       FROM tools t
       JOIN categories c ON t.category_id = c.id
       LEFT JOIN articles a ON a.tool_id = t.id
         AND a.status = 'published'
       WHERE t.status = 'published'
       GROUP BY t.id, t.name, t.slug, t.primary_keyword,
                t.secondary_keywords, t.keyword_volume,
                t.category_id, c.slug
       HAVING
         MAX(a.created_at) IS NULL
         OR MAX(a.created_at) < NOW() - INTERVAL '7 days'
       ORDER BY t.keyword_volume DESC
       LIMIT $1`,
      [config.daily_article_limit ?? 3]
    )

    if (candidates.length === 0) {
      await logDone(jobId, { message: 'No tools need articles today', generated: 0 })
      return Response.json({
        success: true,
        message: 'No tools need articles today',
        generated: 0,
      })
    }

    const results = []

    for (const tool of candidates) {
      try {
        console.log(`[ARTICLE GEN] Generating for tool: ${tool.name}`)

        // Determine best keyword to target
        // Use trending keyword if available, else primary keyword
        const trendRow = await queryOne<{ keyword: string; trend_score: number }>(
          `SELECT keyword, trend_score
           FROM trend_cache
           WHERE keyword ILIKE $1
             OR keyword ILIKE $2
             AND geo = 'US'
             AND expires_at > NOW()
             AND trend_score >= 40
           ORDER BY trend_score DESC
           LIMIT 1`,
          [`%${tool.primary_keyword}%`, `%${tool.name.toLowerCase()}%`]
        )

        const targetKeyword = trendRow?.keyword ?? tool.primary_keyword
        const isTrendBased = !!trendRow

        // Generate the article
        const article = await generateUniqueArticle(
          tool.id,
          tool.name,
          tool.slug,
          tool.category_slug,
          targetKeyword,
          tool.keyword_volume
        )

        // Save to database
        const keywords = [
          targetKeyword,
          ...(tool.secondary_keywords ?? []).slice(0, 5),
        ]

        const articleId = await saveArticle(
          article,
          tool.id,
          tool.category_id,
          keywords,
          tool.keyword_volume
        )

        // Update trend_based flag if relevant
        if (isTrendBased && articleId) {
          await query(
            `UPDATE articles
             SET trend_based = true, trend_keyword = $1, trend_score = $2
             WHERE id = $3`,
            [trendRow!.keyword, trendRow!.trend_score, articleId]
          )
        }

        // Run SEO audit on new article
        if (articleId) {
          const auditResult = await auditArticle(articleId)
          console.log(
            `[ARTICLE GEN] Article "${article.title}" — SEO score: ${auditResult.score}`
          )
        }

        // Submit to Google Indexing API
        try {
          const articleUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${article.slug}`
          await fetch(
            `https://indexing.googleapis.com/v3/urlNotifications:publish`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${process.env.GOOGLE_INDEXING_API_KEY}`,
              },
              body: JSON.stringify({
                url: articleUrl,
                type: 'URL_UPDATED',
              }),
            }
          )
        } catch (indexError) {
          console.warn('[ARTICLE GEN] Google Indexing failed:', indexError)
        }

        // Update keyword record
        await query(
          `INSERT INTO keywords
           (keyword, volume, tool_id, article_id, category_id, status, source)
           VALUES ($1, $2, $3, $4, $5, 'tracking', 'ai_generated')
           ON CONFLICT (keyword)
           DO UPDATE SET
             article_id = EXCLUDED.article_id,
             tool_id = EXCLUDED.tool_id`,
          [
            targetKeyword,
            tool.keyword_volume,
            tool.id,
            articleId,
            tool.category_id,
          ]
        )

        results.push({
          tool: tool.name,
          keyword: targetKeyword,
          title: article.title,
          slug: article.slug,
          angle: article.articleAngle,
          wordCount: article.wordCount,
          trendBased: isTrendBased,
          articleId,
        })
      } catch (toolError: any) {
        console.error(
          `[ARTICLE GEN] Failed for tool ${tool.name}:`,
          toolError.message
        )
        results.push({
          tool: tool.name,
          error: toolError.message,
        })
      }
    }

    await logDone(jobId, { generated: results.length, results })

    return Response.json({
      success: true,
      generated: results.filter((r) => !r.error).length,
      failed: results.filter((r) => r.error).length,
      results,
    })
  } catch (error: any) {
    await logFailed(jobId, error.message)
    return Response.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
