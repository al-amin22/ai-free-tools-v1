import { query, queryOne } from '@/lib/db'
import { callAI } from './index'
import { cleanAIOutput, countWords } from './prompt-builder'
import { getCache, setCache, generateKey } from '@/lib/cache'

// 10 angles yang rotasi, tidak boleh repeat dalam 30 hari
export const ARTICLE_ANGLES = [
  'complete-guide',
  'how-to-step-by-step',
  'common-mistakes',
  'state-specific',
  'comparison',
  'beginner-guide',
  'advanced-strategies',
  'case-study',
  'faq-driven',
  'industry-specific',
] as const

export type ArticleAngle = typeof ARTICLE_ANGLES[number]

// Mapping angle ke instruksi spesifik
const ANGLE_INSTRUCTIONS: Record<ArticleAngle, string> = {
  'complete-guide':
    'Write as a comprehensive A-Z guide. Cover everything a beginner to advanced US user needs to know. Include definition, when to use, how to create, legal requirements, tips, and common questions.',
  'how-to-step-by-step':
    'Write as a practical step-by-step tutorial. Number every step clearly. Include what to do, why it matters, and what to avoid at each step. Focus on actionable instructions.',
  'common-mistakes':
    'Write about the most common mistakes US businesses and individuals make with this topic. For each mistake: describe what it is, why people make it, real consequences, and how to avoid it.',
  'state-specific':
    'Write about how requirements and best practices vary across US states. Focus on major states: California, Texas, Florida, New York. Include state-specific laws, requirements, and examples.',
  'comparison':
    'Write a comparison article. Compare this tool/document type with similar alternatives. Include when to use each, pros and cons, cost comparison, and a recommendation matrix.',
  'beginner-guide':
    'Write for someone who has never heard of this topic. Explain everything from scratch. Use simple language, real examples, and avoid legal jargon. Include a glossary of terms.',
  'advanced-strategies':
    'Write for experienced US professionals who want to optimize their use of this. Include advanced tactics, negotiation strategies, legal nuances, and professional best practices.',
  'case-study':
    'Write using realistic US business scenarios. Present 3 different case studies showing how different types of US businesses use this. Include what worked, what did not, and lessons learned.',
  'faq-driven':
    'Structure the entire article around the most frequently asked questions US people have about this topic. Answer each question thoroughly. Base questions on what people actually search on Google.',
  'industry-specific':
    'Write about how this applies specifically to a US industry. Choose the most relevant industry based on the keyword. Include industry-specific requirements, examples, and terminology.',
}

// Get angle yang belum dipakai untuk tool ini dalam 30 hari
export async function getNextAngle(toolId: string): Promise<ArticleAngle> {
  const rows = await query<{ angle: string }>(
    `SELECT angle FROM article_angles_used
     WHERE tool_id = $1
       AND used_at > NOW() - INTERVAL '30 days'`,
    [toolId]
  )

  const usedAngles = new Set(rows.map((r) => r.angle))
  const availableAngles = ARTICLE_ANGLES.filter((a) => !usedAngles.has(a))

  if (availableAngles.length === 0) {
    // Semua sudah dipakai dalam 30 hari — reset dengan yang paling lama
    const oldest = await queryOne<{ angle: string }>(
      `SELECT angle FROM article_angles_used
       WHERE tool_id = $1
       ORDER BY used_at ASC LIMIT 1`,
      [toolId]
    )
    return (oldest?.angle as ArticleAngle) ?? 'complete-guide'
  }

  return availableAngles[0]
}

// Get trending keywords dari cache atau generate baru
export async function getTrendingKeywords(
  toolId: string,
  primaryKeyword: string
): Promise<string[]> {
  const cacheKey = generateKey('trends', primaryKeyword)
  const cached = getCache<string[]>(cacheKey)
  if (cached) return cached

  // Fetch dari trend_cache table
  const rows = await query<{ related_queries: any; rising_queries: any }>(
    `SELECT related_queries, rising_queries
     FROM trend_cache
     WHERE keyword = $1
       AND geo = 'US'
       AND expires_at > NOW()
     LIMIT 1`,
    [primaryKeyword]
  )

  if (rows[0]) {
    const related = rows[0].related_queries ?? []
    const rising = rows[0].rising_queries ?? []
    const keywords = [
      ...rising.map((q: any) => q.query ?? q),
      ...related.map((q: any) => q.query ?? q),
    ].slice(0, 10)

    setCache(cacheKey, keywords, 3600 * 6)
    return keywords
  }

  // Fallback: return secondary keywords dari tool
  const tool = await queryOne<{ secondary_keywords: string[] }>(
    'SELECT secondary_keywords FROM tools WHERE id = $1',
    [toolId]
  )
  return tool?.secondary_keywords ?? []
}

// Get recent article titles untuk anti-duplikasi
export async function getRecentArticleTitles(
  toolId: string,
  limit = 10
): Promise<string[]> {
  const rows = await query<{ title: string }>(
    `SELECT title FROM articles
     WHERE tool_id = $1
       AND created_at > NOW() - INTERVAL '60 days'
     ORDER BY created_at DESC
     LIMIT $2`,
    [toolId, limit]
  )
  return rows.map((r) => r.title)
}

// Get recent article openings untuk anti-duplikasi
export async function getRecentOpenings(
  toolId: string,
  limit = 5
): Promise<string[]> {
  const rows = await query<{ excerpt: string }>(
    `SELECT excerpt FROM articles
     WHERE tool_id = $1
       AND created_at > NOW() - INTERVAL '30 days'
     ORDER BY created_at DESC
     LIMIT $2`,
    [toolId, limit]
  )
  return rows.map((r) => r.excerpt ?? '')
}

// Main article generation function
export interface GeneratedArticle {
  title: string
  metaTitle: string
  metaDescription: string
  slug: string
  contentHtml: string
  toc: Array<{ id: string; title: string; level: number }>
  faqs: Array<{ question: string; answer: string }>
  wordCount: number
  excerpt: string
  readingTime: number
  articleAngle: ArticleAngle
  primaryKeyword: string
  targetAudience: string
}

export async function generateUniqueArticle(
  toolId: string,
  toolName: string,
  toolSlug: string,
  categorySlug: string,
  primaryKeyword: string,
  keywordVolume: number
): Promise<GeneratedArticle> {

  // Step 1: Get next unused angle
  const angle = await getNextAngle(toolId)
  const angleInstruction = ANGLE_INSTRUCTIONS[angle]

  // Step 2: Get trending keywords for context
  const trendingKeywords = await getTrendingKeywords(toolId, primaryKeyword)
  const trendContext = trendingKeywords.length > 0
    ? `Currently trending related searches in the US: ${trendingKeywords.slice(0, 5).join(', ')}`
    : ''

  // Step 3: Get recent titles to avoid duplication
  const recentTitles = await getRecentArticleTitles(toolId)
  const recentOpenings = await getRecentOpenings(toolId)

  const recentTitlesContext = recentTitles.length > 0
    ? `DO NOT use these recently used titles or similar variations:\n${recentTitles.map(t => `- ${t}`).join('\n')}`
    : ''

  const recentOpeningsContext = recentOpenings.length > 0
    ? `DO NOT start your article with these recently used opening sentences or similar:\n${recentOpenings.map(o => `- "${o.substring(0, 100)}"`).join('\n')}`
    : ''

  // Step 4: Determine target audience based on angle
  const audienceMap: Record<ArticleAngle, string> = {
    'complete-guide': 'US small business owners and professionals',
    'how-to-step-by-step': 'US individuals taking action for first time',
    'common-mistakes': 'US professionals wanting to avoid costly errors',
    'state-specific': 'US residents in specific states seeking local compliance',
    'comparison': 'US decision-makers evaluating options',
    'beginner-guide': 'US beginners completely new to the topic',
    'advanced-strategies': 'Experienced US professionals wanting to optimize',
    'case-study': 'US business owners learning from real examples',
    'faq-driven': 'US users with specific questions searching on Google',
    'industry-specific': 'US professionals in a specific industry sector',
  }
  const targetAudience = audienceMap[angle]

  // Step 5: Build the generation system prompt
  const systemPrompt = `You are an elite SEO content writer and subject matter expert specializing in US business, legal, HR, and finance topics. You have written hundreds of articles that rank #1 on Google.com USA.

YOUR WRITING STANDARDS:
- Every article is 100% unique in angle, opening, structure, and examples
- American English spelling always (organize, recognize, color, labor)
- Target audience: ${targetAudience}
- Minimum 2000 words of substantive, valuable content
- Include real US laws, IRS guidelines, or state regulations where relevant
- Write like Forbes Small Business meets practical legal guide
- Every sentence must add value — no filler, no padding

SEO REQUIREMENTS:
- Target keyword "${primaryKeyword}" must appear in: title, first 100 words, 2-3 H2 headings, and conclusion
- Include related keywords naturally throughout: ${trendingKeywords.slice(0, 5).join(', ')}
- Mention "United States" or "US" naturally at least 4 times
- Include specific US states, regulations, or platforms when relevant
- Meta title: 55-60 characters exactly, include keyword and power word
- Meta description: 150-155 characters exactly, include keyword + benefit + USA

UNIQUENESS RULES:
${recentTitlesContext}
${recentOpeningsContext}
- Your opening paragraph MUST be fresh and different from any previous articles
- Use a different hook: surprising stat, common myth, real scenario, bold claim, or question
${trendContext}

ARTICLE ANGLE: ${angle.toUpperCase()}
${angleInstruction}`

  // Step 6: Build user prompt
  const userPrompt = `Write a comprehensive SEO article targeting: "${primaryKeyword}"

ARTICLE ANGLE: ${angle} — ${angleInstruction}

TARGET AUDIENCE: ${targetAudience}
RELATED FREE TOOL: ${toolName} — available at /tools/${categorySlug}/${toolSlug}

MANDATORY STRUCTURE:
1. Unique, attention-grabbing title (must include "${primaryKeyword}")
2. Compelling introduction (150 words, keyword in first 2 sentences, unique hook)
3. Table of Contents (list all H2 headings)
4. 5-6 substantive H2 sections (200-300 words each)
5. At least 2 H3 subsections per major H2
6. CTA Box after section 2: "Generate your free ${toolName} now — no sign up required →"
7. CTA Box after section 5: similar CTA
8. FAQ Section: 7 questions people actually search on Google about "${primaryKeyword}"
9. Conclusion (100 words with keyword and final CTA)

CONTENT REQUIREMENTS:
- Minimum 2000 words total
- Include at least 2 specific US laws, regulations, or IRS references
- Include 1-2 specific US state examples
- All examples must be realistic US business scenarios
- No generic content — everything must be specific and actionable

RETURN FORMAT — Valid JSON only, no markdown backticks:
{
  "title": "Full article title here",
  "metaTitle": "55-60 char meta title with keyword",
  "metaDescription": "150-155 char description with keyword + benefit + USA",
  "slug": "url-friendly-slug-here",
  "contentHtml": "<h2>Section Title</h2><p>Content here...</p>...",
  "toc": [{"id": "section-id", "title": "Section Title", "level": 2}],
  "faqs": [{"question": "Q here", "answer": "Detailed A here"}],
  "wordCount": 2100,
  "excerpt": "150-char compelling excerpt",
  "targetAudience": "${targetAudience}"
}`

  // Step 7: Generate with Gemini (best for long-form)
  const result = await callAI(systemPrompt, userPrompt, {
    model: 'gemini',
    temperature: 0.75,
    maxTokens: 6000,
    isLongForm: true,
  })

  // Step 8: Parse JSON response
  let parsed: any
  try {
    const cleaned = result.output
      .replace(/^```json\n?/i, '')
      .replace(/\n?```$/i, '')
      .trim()
    parsed = JSON.parse(cleaned)
  } catch (parseError) {
    console.error('[ARTICLE ENGINE] JSON parse failed:', result.output.substring(0, 200))
    throw new Error('Article generation returned invalid JSON')
  }

  // Step 9: Validate and enrich
  const wordCount = countWords(parsed.contentHtml ?? '')
  const readingTime = Math.ceil(wordCount / 200)

  // Step 10: Mark angle as used
  await query(
    `INSERT INTO article_angles_used (tool_id, angle, keyword_used, used_at)
     VALUES ($1, $2, $3, NOW())
     ON CONFLICT (tool_id, angle)
     DO UPDATE SET keyword_used = $3, used_at = NOW()`,
    [toolId, angle, primaryKeyword]
  )

  return {
    title: parsed.title ?? `Free ${toolName} — Complete Guide`,
    metaTitle: parsed.metaTitle ?? parsed.title?.substring(0, 60) ?? '',
    metaDescription: parsed.metaDescription ?? '',
    slug: parsed.slug ?? primaryKeyword.replace(/\s+/g, '-').toLowerCase(),
    contentHtml: parsed.contentHtml ?? '',
    toc: parsed.toc ?? [],
    faqs: parsed.faqs ?? [],
    wordCount,
    excerpt: parsed.excerpt ?? '',
    readingTime,
    articleAngle: angle,
    primaryKeyword,
    targetAudience: parsed.targetAudience ?? targetAudience,
  }
}

// Save generated article to database
export async function saveArticle(
  article: GeneratedArticle,
  toolId: string,
  categoryId: string,
  keywords: string[],
  keywordVolume: number
): Promise<string> {
  const rows = await query<{ id: string }>(
    `INSERT INTO articles (
       title, slug, excerpt, content_html, word_count, reading_time,
       category_id, tool_id, meta_title, meta_description,
       keywords, primary_keyword, keyword_volume,
       toc, faqs, related_tool_ids,
       article_angle, target_audience, geographic_focus,
       ai_generated, ai_model, last_ai_update,
       status, published_at
     ) VALUES (
       $1, $2, $3, $4, $5, $6,
       $7, $8, $9, $10,
       $11, $12, $13,
       $14, $15, ARRAY[$8]::uuid[],
       $16, $17, 'United States',
       true, 'gemini-flash', NOW(),
       'published', NOW()
     )
     ON CONFLICT (slug) DO UPDATE SET
       content_html = EXCLUDED.content_html,
       word_count = EXCLUDED.word_count,
       last_ai_update = NOW(),
       needs_update = false,
       updated_at = NOW()
     RETURNING id`,
    [
      article.title,
      article.slug,
      article.excerpt,
      article.contentHtml,
      article.wordCount,
      article.readingTime,
      categoryId,
      toolId,
      article.metaTitle,
      article.metaDescription,
      keywords,
      article.primaryKeyword,
      keywordVolume,
      JSON.stringify(article.toc),
      JSON.stringify(article.faqs),
      article.articleAngle,
      article.targetAudience,
    ]
  )

  return rows[0]?.id ?? ''
}
