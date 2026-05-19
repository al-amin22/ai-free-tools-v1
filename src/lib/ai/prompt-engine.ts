import { query } from '@/lib/db'
import { buildDynamicPrompt, selectABVariant, cleanAIOutput } from './prompt-builder'
import { callAI } from './index'
import { withRetry, type ValidationConfig } from './validator'

export async function generateWithPrompt(
  toolId: string,
  inputs: Record<string, string>,
  sessionId: string
): Promise<{
  output: string
  provider: string
  validationScore: number
  attempts: number
}> {
  const rows = await query<any>(
    `SELECT
       t.system_prompt,
       t.user_prompt_template,
       t.prompt_a,
       t.prompt_b,
       t.ab_test_active,
       t.temperature,
       t.max_tokens,
       t.min_output_length,
       t.required_elements,
       t.forbidden_phrases,
       t.ai_model,
       c.slug AS category
     FROM tools t
     JOIN categories c ON t.category_id = c.id
     WHERE t.id = $1`,
    [toolId]
  )

  if (!rows[0]) throw new Error(`Tool ${toolId} not found`)
  const tool = rows[0]

  const variant = tool.ab_test_active
    ? selectABVariant(toolId, sessionId)
    : 'a'
  const promptTemplate =
    variant === 'b' && tool.prompt_b
      ? tool.prompt_b
      : tool.prompt_a ?? tool.user_prompt_template

  const userPrompt = buildDynamicPrompt(promptTemplate, inputs)

  const validationConfig: ValidationConfig = {
    minOutputLength: tool.min_output_length ?? 300,
    requiredElements: tool.required_elements ?? [],
    forbiddenPhrases: tool.forbidden_phrases ?? [],
    category: tool.category,
  }

  const result = await withRetry(
    async () => {
      const aiResult = await callAI(tool.system_prompt, userPrompt, {
        model: tool.ai_model,
        temperature: tool.temperature,
        maxTokens: tool.max_tokens,
        category: tool.category,
        isLongForm: (tool.min_output_length ?? 0) > 400,
      })
      return {
        output: cleanAIOutput(aiResult.output),
        provider: aiResult.provider,
      }
    },
    validationConfig,
    3
  )

  return result
}
