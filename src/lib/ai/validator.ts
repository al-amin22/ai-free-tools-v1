export interface ValidationResult {
  valid: boolean
  score: number
  passed: string[]
  failed: string[]
  missing: string[]
  reason?: string
}

export interface ValidationConfig {
  minOutputLength: number
  requiredElements: string[]
  forbiddenPhrases: string[]
  category: string
}

export function validateOutput(
  output: string,
  config: ValidationConfig
): ValidationResult {
  const passed: string[] = []
  const failed: string[] = []
  const missing: string[] = []
  let score = 0

  // CHECK 1: Word count (weight 25)
  const wordCount = output
    .split(/\s+/)
    .filter(Boolean).length
  if (wordCount >= config.minOutputLength) {
    passed.push(`length_ok (${wordCount} words)`)
    score += 25
  } else if (wordCount >= config.minOutputLength * 0.7) {
    passed.push(`length_partial (${wordCount} words)`)
    score += 12
    failed.push(`length_short: ${wordCount}/${config.minOutputLength} words`)
  } else {
    failed.push(`length_fail: ${wordCount}/${config.minOutputLength} words`)
  }

  // CHECK 2: Forbidden phrases (weight 25)
  const foundForbidden = config.forbiddenPhrases.filter((phrase) =>
    output.toLowerCase().includes(phrase.toLowerCase())
  )
  if (foundForbidden.length === 0) {
    passed.push('no_forbidden_phrases')
    score += 25
  } else {
    failed.push(`forbidden: "${foundForbidden[0]}"`)
  }

  // CHECK 3: Required elements (weight 25)
  if (config.requiredElements.length === 0) {
    passed.push('no_required_elements_check')
    score += 25
  } else {
    const found = config.requiredElements.filter((el) =>
      output.toLowerCase().includes(el.toLowerCase())
    )
    const notFound = config.requiredElements.filter(
      (el) => !output.toLowerCase().includes(el.toLowerCase())
    )
    const ratio = found.length / config.requiredElements.length
    score += Math.round(ratio * 25)
    if (ratio >= 0.75) {
      passed.push(`required_elements: ${found.length}/${config.requiredElements.length}`)
    } else {
      failed.push(`missing_elements: ${notFound.slice(0, 3).join(', ')}`)
      missing.push(...notFound)
    }
  }

  // CHECK 4: No unfilled placeholders (weight 15)
  const placeholders = output.match(/\[.{1,40}\]|\{\{.{1,40}\}\}/g)
  if (!placeholders) {
    passed.push('no_placeholders')
    score += 15
  } else {
    failed.push(`unfilled_placeholders: ${placeholders.slice(0, 3).join(', ')}`)
  }

  // CHECK 5: Structure (weight 10)
  const paragraphs = output.split(/\n\n+/).filter((p) => p.trim().length > 30)
  if (paragraphs.length >= 2) {
    passed.push(`good_structure: ${paragraphs.length} paragraphs`)
    score += 10
  } else {
    failed.push('poor_structure: too few paragraphs')
  }

  const valid = score >= 65
  const reason = failed[0]

  return { valid, score, passed, failed, missing, reason }
}

export async function withRetry(
  generateFn: () => Promise<{ output: string; provider: string }>,
  config: ValidationConfig,
  maxRetries = 3
): Promise<{
  output: string
  provider: string
  validationScore: number
  attempts: number
}> {
  let lastResult = { output: '', provider: 'unknown' }
  let lastScore = 0

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      lastResult = await generateFn()
      const validation = validateOutput(lastResult.output, config)
      lastScore = validation.score

      if (validation.valid) {
        return {
          ...lastResult,
          validationScore: validation.score,
          attempts: attempt,
        }
      }

      console.warn(
        `[VALIDATOR] Attempt ${attempt}/${maxRetries} failed:`,
        validation.reason
      )
    } catch (err: any) {
      console.error(`[VALIDATOR] Generation error attempt ${attempt}:`, err.message)
    }
  }

  console.warn('[VALIDATOR] All retries failed, returning last result')
  return { ...lastResult, validationScore: lastScore, attempts: maxRetries }
}
