import Groq from 'groq-sdk'

const client = new Groq({ apiKey: process.env.GROQ_API_KEY })

const MODEL_MAP: Record<string, string> = {
  'groq-8b': 'llama3-8b-8192',
  'groq-70b': 'llama3-70b-8192',
  groq: 'llama3-70b-8192',
}

export interface ProviderResult {
  output: string
  tokens: number
  latency: number
  provider: string
}

export async function callGroq(
  systemPrompt: string,
  userPrompt: string,
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
  } = {}
): Promise<ProviderResult> {
  const start = Date.now()
  const model = MODEL_MAP[options.model ?? 'groq-70b'] ?? 'llama3-70b-8192'

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 30000)

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: options.temperature ?? 0.5,
      max_tokens: options.maxTokens ?? 2000,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    })
    clearTimeout(timeout)
    return {
      output: completion.choices[0]?.message?.content ?? '',
      tokens: completion.usage?.total_tokens ?? 0,
      latency: Date.now() - start,
      provider: 'groq',
    }
  } catch (error: any) {
    clearTimeout(timeout)
    throw new Error(`Groq failed: ${error.message}`)
  }
}
