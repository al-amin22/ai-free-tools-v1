import { query, queryOne } from '@/lib/db'

export interface SEOCheck {
  name: string
  weight: number
  passed: boolean
  detail: string
}

export interface SEOAuditResult {
  score: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  passed: SEOCheck[]
  failed: SEOCheck[]
  autoFixed: string[]
  suggestions: string[]
}

function getGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A'
  if (score >= 80) return 'B'
  if (score >= 70) return 'C'
  if (score >= 60) return 'D'
  return 'F'
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function countWords(text: string): number {
  return text.split(/\s+/).filter(Boolean).length
}

export async function auditToolPage(
  toolId: string
): Promise<SEOAuditResult> {
  const tool = await queryOne<any>(
    `SELECT t.*, c.slug as category_slug
     FROM tools t JOIN categories c ON t.category_id = c.id
     WHERE t.id = $1`,
    [toolId]
  )

  if (!tool) {
    return {
      score: 0,
      grade: 'F',
      passed: [],
      failed: [{ name: 'tool_exists', weight: 100, passed: false, detail: 'Tool not found' }],
      autoFixed: [],
      suggestions: ['Tool record not found in database'],
    }
  }

  const checks: SEOCheck[] = []
  const autoFixed: string[] = []
  const suggestions: string[] = []

  // CHECK 1: Title length (weight 15)
  const titleLen = (tool.meta_title ?? '').length
  if (titleLen >= 50 && titleLen <= 60) {
    checks.push({ name: 'title_length', weight: 15, passed: true, detail: `Title is ${titleLen} chars (optimal 50-60)` })
  } else {
    checks.push({ name: 'title_length', weight: 15, passed: false, detail: `Title is ${titleLen} chars (need 50-60)` })
    if (titleLen > 60) {
      const trimmed = tool.meta_title.substring(0, 57) + '...'
      await query('UPDATE tools SET meta_title = $1 WHERE id = $2', [trimmed, toolId])
      autoFixed.push(`Trimmed meta_title from ${titleLen} to 60 chars`)
    } else {
      suggestions.push(`Expand meta_title to at least 50 characters. Current: "${tool.meta_title}"`)
    }
  }

  // CHECK 2: Meta description length (weight 15)
  const descLen = (tool.meta_description ?? '').length
  if (descLen >= 145 && descLen <= 155) {
    checks.push({ name: 'meta_desc_length', weight: 15, passed: true, detail: `Meta description is ${descLen} chars (optimal 145-155)` })
  } else {
    checks.push({ name: 'meta_desc_length', weight: 15, passed: false, detail: `Meta description is ${descLen} chars (need 145-155)` })
    if (descLen > 155) {
      const trimmed = tool.meta_description.substring(0, 152) + '...'
      await query('UPDATE tools SET meta_description = $1 WHERE id = $2', [trimmed, toolId])
      autoFixed.push(`Trimmed meta_description to 155 chars`)
    } else {
      suggestions.push(`Expand meta_description to 145-155 characters`)
    }
  }

  // CHECK 3: Keyword in title (weight 15)
  const keywordInTitle = tool.primary_keyword &&
    (tool.meta_title ?? '').toLowerCase().includes(tool.primary_keyword.toLowerCase())
  checks.push({
    name: 'keyword_in_title',
    weight: 15,
    passed: !!keywordInTitle,
    detail: keywordInTitle
      ? `Primary keyword "${tool.primary_keyword}" found in title`
      : `Primary keyword "${tool.primary_keyword}" NOT in title`,
  })
  if (!keywordInTitle) {
    suggestions.push(`Include primary keyword "${tool.primary_keyword}" in meta_title`)
  }

  // CHECK 4: FAQ count (weight 10)
  const faqCount = Array.isArray(tool.faqs) ? tool.faqs.length : 0
  checks.push({
    name: 'faq_count',
    weight: 10,
    passed: faqCount >= 7,
    detail: `Has ${faqCount} FAQs (minimum 7)`,
  })
  if (faqCount < 7) {
    suggestions.push(`Add ${7 - faqCount} more FAQs. Currently has ${faqCount}`)
  }

  // CHECK 5: Content section length (weight 10)
  const contentText = stripHtml(tool.content_section ?? '')
  const contentWords = countWords(contentText)
  checks.push({
    name: 'content_length',
    weight: 10,
    passed: contentWords >= 400,
    detail: `Content section has ${contentWords} words (minimum 400)`,
  })
  if (contentWords < 400) {
    suggestions.push(`Expand content_section to at least 400 words. Currently ${contentWords}`)
  }

  // CHECK 6: USA mentions (weight 10)
  const contentLower = contentText.toLowerCase()
  const usaMentions = (contentLower.match(/\bunited states\b|\bu\.s\.\b|\busa\b|\bus businesses\b|\bus companies\b/g) ?? []).length
  checks.push({
    name: 'usa_mentions',
    weight: 10,
    passed: usaMentions >= 2,
    detail: `USA mentioned ${usaMentions} times in content (minimum 2)`,
  })
  if (usaMentions < 2) {
    suggestions.push(`Add more USA/United States mentions to content_section`)
  }

  // CHECK 7: Schema ready (weight 10)
  const schemaReady = faqCount >= 5 &&
    Array.isArray(tool.how_it_works) &&
    tool.how_it_works.length === 3
  checks.push({
    name: 'schema_ready',
    weight: 10,
    passed: schemaReady,
    detail: schemaReady ? 'FAQPage and WebApplication schema data ready' : 'Schema data incomplete',
  })

  // CHECK 8: Related tools (weight 5)
  const relatedCount = Array.isArray(tool.related_tool_ids)
    ? tool.related_tool_ids.length
    : 0
  checks.push({
    name: 'related_tools',
    weight: 5,
    passed: relatedCount >= 3,
    detail: `Has ${relatedCount} related tools (minimum 3)`,
  })

  // CHECK 9: Keyword in description (weight 5)
  const keywordInDesc = tool.primary_keyword &&
    (tool.meta_description ?? '').toLowerCase().includes(tool.primary_keyword.toLowerCase())
  checks.push({
    name: 'keyword_in_description',
    weight: 5,
    passed: !!keywordInDesc,
    detail: keywordInDesc ? 'Keyword in meta description' : 'Keyword NOT in meta description',
  })

  // CHECK 10: Input fields (weight 5)
  const fieldCount = Array.isArray(tool.input_fields) ? tool.input_fields.length : 0
  checks.push({
    name: 'input_fields_count',
    weight: 5,
    passed: fieldCount >= 3,
    detail: `Has ${fieldCount} input fields (minimum 3)`,
  })

  const passedChecks = checks.filter((c) => c.passed)
  const failedChecks = checks.filter((c) => !c.passed)
  const score = passedChecks.reduce((sum, c) => sum + c.weight, 0)
  const grade = getGrade(score)

  // Save audit result
  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/tools/${tool.category_slug}/${tool.slug}`
  const previousAudit = await queryOne<{ score: number }>(
    'SELECT score FROM seo_audits WHERE page_type = $1 AND page_id = $2 ORDER BY audited_at DESC LIMIT 1',
    ['tool', toolId]
  )

  await query(
    `INSERT INTO seo_audits
     (page_type, page_id, page_url, score, previous_score, issues, suggestions, auto_fixed, passed_checks)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [
      'tool',
      toolId,
      pageUrl,
      score,
      previousAudit?.score ?? null,
      JSON.stringify(failedChecks),
      JSON.stringify(suggestions),
      JSON.stringify(autoFixed),
      JSON.stringify(passedChecks),
    ]
  )

  // Update tool with audit info
  await query(
    'UPDATE tools SET last_seo_audit = NOW(), last_seo_score = $1 WHERE id = $2',
    [score, toolId]
  )

  return { score, grade, passed: passedChecks, failed: failedChecks, autoFixed, suggestions }
}

export async function auditArticle(
  articleId: string
): Promise<SEOAuditResult> {
  const article = await queryOne<any>(
    'SELECT * FROM articles WHERE id = $1',
    [articleId]
  )

  if (!article) {
    return {
      score: 0,
      grade: 'F',
      passed: [],
      failed: [{ name: 'article_exists', weight: 100, passed: false, detail: 'Article not found' }],
      autoFixed: [],
      suggestions: [],
    }
  }

  const checks: SEOCheck[] = []
  const autoFixed: string[] = []
  const suggestions: string[] = []
  const contentText = stripHtml(article.content_html ?? '')
  const contentWords = countWords(contentText)
  const first100Words = contentText.split(/\s+/).slice(0, 100).join(' ')

  // 10 SEO checks untuk artikel
  const titleLen = (article.meta_title ?? '').length
  checks.push({ name: 'title_length', weight: 15, passed: titleLen >= 50 && titleLen <= 60, detail: `Title: ${titleLen} chars` })

  const descLen = (article.meta_description ?? '').length
  checks.push({ name: 'meta_desc_length', weight: 15, passed: descLen >= 145 && descLen <= 155, detail: `Description: ${descLen} chars` })

  const keyInTitle = article.primary_keyword &&
    (article.meta_title ?? '').toLowerCase().includes(article.primary_keyword.toLowerCase())
  checks.push({ name: 'keyword_in_title', weight: 15, passed: !!keyInTitle, detail: keyInTitle ? 'Keyword in title ✓' : 'Keyword NOT in title' })

  checks.push({ name: 'word_count', weight: 15, passed: contentWords >= 1800, detail: `Word count: ${contentWords} (min 1800)` })

  const keyInIntro = article.primary_keyword &&
    first100Words.toLowerCase().includes(article.primary_keyword.toLowerCase())
  checks.push({ name: 'keyword_in_intro', weight: 10, passed: !!keyInIntro, detail: keyInIntro ? 'Keyword in first 100 words ✓' : 'Keyword NOT in intro' })

  const h2Count = (article.content_html ?? '').split('<h2').length - 1
  checks.push({ name: 'h2_count', weight: 10, passed: h2Count >= 4, detail: `H2 headings: ${h2Count} (min 4)` })

  const faqCount = Array.isArray(article.faqs) ? article.faqs.length : 0
  checks.push({ name: 'faq_count', weight: 10, passed: faqCount >= 7, detail: `FAQs: ${faqCount} (min 7)` })

  const internalLinks = (article.content_html ?? '').split('href="/tools/').length - 1
  checks.push({ name: 'internal_links', weight: 5, passed: internalLinks >= 2, detail: `Internal tool links: ${internalLinks} (min 2)` })

  const usaMentions = (contentText.toLowerCase().match(/\bunited states\b|\bu\.s\.\b|\busa\b/g) ?? []).length
  checks.push({ name: 'usa_mentions', weight: 3, passed: usaMentions >= 3, detail: `USA mentions: ${usaMentions} (min 3)` })

  const hasCTA = (article.content_html ?? '').includes('href="/tools/')
  checks.push({ name: 'cta_present', weight: 2, passed: hasCTA, detail: hasCTA ? 'Tool CTA link present ✓' : 'No tool CTA link found' })

  const passedChecks = checks.filter((c) => c.passed)
  const failedChecks = checks.filter((c) => !c.passed)
  const score = passedChecks.reduce((sum, c) => sum + c.weight, 0)
  const grade = getGrade(score)

  // Save audit
  await query(
    `INSERT INTO seo_audits
     (page_type, page_id, page_url, score, issues, suggestions, passed_checks)
     VALUES ($1, $2, $3, $4, $5, $6, $7)`,
    [
      'article',
      articleId,
      `${process.env.NEXT_PUBLIC_SITE_URL}/blog/${article.slug}`,
      score,
      JSON.stringify(failedChecks),
      JSON.stringify(suggestions),
      JSON.stringify(passedChecks),
    ]
  )

  await query(
    'UPDATE articles SET last_seo_audit = NOW(), last_seo_score = $1 WHERE id = $2',
    [score, articleId]
  )

  return { score, grade, passed: passedChecks, failed: failedChecks, autoFixed, suggestions }
}

export async function runBulkSEOAudit(): Promise<{
  tools: number
  articles: number
  avgToolScore: number
  avgArticleScore: number
}> {
  const tools = await query<{ id: string }>(
    "SELECT id FROM tools WHERE status = 'published'"
  )
  const articles = await query<{ id: string }>(
    "SELECT id FROM articles WHERE status = 'published'"
  )

  let toolScoreSum = 0
  let articleScoreSum = 0

  for (const tool of tools) {
    const result = await auditToolPage(tool.id)
    toolScoreSum += result.score
  }

  for (const article of articles) {
    const result = await auditArticle(article.id)
    articleScoreSum += result.score
  }

  return {
    tools: tools.length,
    articles: articles.length,
    avgToolScore: tools.length > 0 ? Math.round(toolScoreSum / tools.length) : 0,
    avgArticleScore: articles.length > 0 ? Math.round(articleScoreSum / articles.length) : 0,
  }
}
