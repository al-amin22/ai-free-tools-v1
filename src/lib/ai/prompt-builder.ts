export function buildDynamicPrompt(
  template: string,
  inputs: Record<string, string>
): string {
  let result = template
  for (const [key, value] of Object.entries(inputs)) {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g')
    result = result.replace(regex, (value ?? '').trim() || '[NOT PROVIDED]')
  }
  const unreplaced = result.match(/\{\{[^}]+\}\}/g)
  if (unreplaced?.length) {
    console.warn('[PROMPT BUILDER] Unreplaced variables:', unreplaced)
  }
  return result
}

export function cleanAIOutput(output: string): string {
  return output
    .replace(
      /^(Here is|I've generated|Below is|Certainly[,!]?|Sure[,!]?|Of course[,!]?|I'd be happy to|As requested|I have created).+?\n/gim,
      ''
    )
    .replace(
      /\n(Note:|Please note:|Important note:|Disclaimer:|I hope this|Feel free to).+?(\n|$)/gis,
      ''
    )
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function selectABVariant(
  toolId: string,
  sessionId: string
): 'a' | 'b' {
  const combined = toolId + sessionId
  const hash = Array.from(combined).reduce(
    (acc, char) => acc + char.charCodeAt(0),
    0
  )
  return hash % 2 === 0 ? 'a' : 'b'
}

export function countWords(text: string): number {
  return text
    .replace(/<[^>]*>/g, ' ')
    .split(/\s+/)
    .filter(Boolean).length
}
