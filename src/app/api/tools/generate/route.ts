import { z } from 'zod'
import { query, queryOne } from '@/lib/db'
import { checkRateLimit, hashIP, getClientIP } from '@/lib/rate-limit'
import { getCache, setCache, generateKey } from '@/lib/cache'
import { generateWithPrompt } from '@/lib/ai/prompt-engine'
import { cleanAIOutput } from '@/lib/ai/prompt-builder'

const GenerateSchema = z.object({
  toolId: z.string().uuid(),
  inputs: z.record(z.string(), z.string()),
})

export async function POST(request: Request) {
  try {
    // Parse dan validate input
    const body = await request.json()
    const parsed = GenerateSchema.safeParse(body)

    if (!parsed.success) {
      return Response.json(
        { error: 'Invalid request', details: parsed.error.issues },
        { status: 400 }
      )
    }

    const { toolId, inputs } = parsed.data

    // Rate limit check
    const isRegistered = request.cookies?.get?.('registered')?.value === 'true'
    const rateLimit = await checkRateLimit(request, isRegistered)

    if (!rateLimit.allowed) {
      return Response.json(
        {
          error: 'rate_limit',
          message: 'You have used your free generates for this hour',
          remaining: 0,
          resetIn: rateLimit.resetIn,
          limit: rateLimit.limit,
        },
        { status: 429 }
      )
    }

    // Fetch tool (verify it exists and is published)
    const tool = await queryOne<{ id: string; name: string; status: string }>(
      "SELECT id, name, status FROM tools WHERE id = $1 AND status = 'published'",
      [toolId]
    )

    if (!tool) {
      return Response.json({ error: 'Tool not found' }, { status: 404 })
    }

    // Cache check
    const cacheKey = generateKey('gen', toolId, JSON.stringify(inputs))
    const cached = getCache<string>(cacheKey)
    if (cached) {
      return Response.json({ output: cached, cached: true, provider: 'cache' })
    }

    // Generate AI output
    const sessionId = getClientIP(request) + Date.now()
    const start = Date.now()

    const { output, provider, validationScore, attempts } =
      await generateWithPrompt(toolId, inputs, sessionId)

    const responseTime = Date.now() - start
    const cleanedOutput = cleanAIOutput(output)

    // Cache result
    setCache(cacheKey, cleanedOutput, 3600)

    // Track usage
    const ipHash = hashIP(getClientIP(request))
    await query(
      `INSERT INTO tool_usage
       (tool_id, ip_hash, output_length, response_time_ms, ai_provider, validation_score)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [toolId, ipHash, cleanedOutput.length, responseTime, provider, validationScore]
    )

    // Increment uses
    await query(
      'UPDATE tools SET total_uses = total_uses + 1 WHERE id = $1',
      [toolId]
    )

    // Auto-save high quality outputs as examples
    if (validationScore >= 85 && attempts === 1) {
      await query(
        `INSERT INTO example_outputs
         (tool_id, output_content, input_used, quality_score, validation_score)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          toolId,
          cleanedOutput,
          JSON.stringify(inputs),
          validationScore,
          validationScore,
        ]
      ).catch(() => {}) // non-blocking
    }

    return Response.json({
      output: cleanedOutput,
      provider,
      validationScore,
      cached: false,
    })
  } catch (error: any) {
    console.error('[GENERATE API] Error:', error.message)
    return Response.json(
      { error: 'Generation failed. Please try again.' },
      { status: 500 }
    )
  }
}
