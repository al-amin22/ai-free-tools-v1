import { callGroq } from './providers/groq'
import { callGemini } from './providers/gemini'
import { query } from '@/lib/db'

export interface AIOptions {
  model?: string
  temperature?: number
  maxTokens?: number
  category?: string
  isLongForm?: boolean
}

export interface AIResult {
  output: string
  provider: string
  latency: number
  tokens: number
}

export async function callAI(
  systemPrompt: string,
  userPrompt: string,
  options: AIOptions = {}
): Promise<AIResult> {
  const forceGemini =
    options.isLongForm === true ||
    options.category === 'legal' ||
    options.category === 'real-estate' ||
    options.model?.startsWith('gemini')

  const providers = forceGemini
    ? [
        { fn: () => callGemini(systemPrompt, userPrompt, options), name: 'gemini' },
        { fn: () => callGroq(systemPrompt, userPrompt, options), name: 'groq' },
      ]
    : [
        { fn: () => callGroq(systemPrompt, userPrompt, options), name: 'groq' },
        { fn: () => callGemini(systemPrompt, userPrompt, options), name: 'gemini' },
      ]

  let lastError: Error | null = null

  for (const provider of providers) {
    try {
      const result = await provider.fn()
      await logAICall(provider.name, options.category ?? 'unknown', result.latency, true)
      return result
    } catch (err: any) {
      lastError = err
      console.error(`[AI] Provider ${provider.name} failed:`, err.message)
      await logAICall(provider.name, options.category ?? 'unknown', 0, false)
    }
  }

  throw lastError ?? new Error('All AI providers failed')
}

async function logAICall(
  provider: string,
  category: string,
  latency: number,
  success: boolean
) {
  try {
    await query(
      `INSERT INTO ai_jobs
       (job_type, job_name, status, input, duration_ms, provider, started_at, completed_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [
        'ai_generation',
        `${category}_tool`,
        success ? 'completed' : 'failed',
        JSON.stringify({ provider, category }),
        latency,
        provider,
      ]
    )
  } catch {
    // non-blocking log
  }
}

export { buildDynamicPrompt, cleanAIOutput, selectABVariant, countWords } from './prompt-builder'
export { validateOutput, withRetry } from './validator'
