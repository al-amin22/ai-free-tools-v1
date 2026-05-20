import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { AIProviderRouter } from '../../engines/ai/ai-provider-router';
import { SYSTEM_PROMPTS } from '@aifreetools/ai-prompts';
import { getToolById } from '@aifreetools/tool-configs';

const ARTICLE_ANGLES = [
  'comprehensive-guide',
  'step-by-step-tutorial',
  'common-mistakes',
  'state-specific-laws',
  'cost-comparison',
  'when-you-need-it',
  'diy-vs-professional',
  'checklist',
  'faqs-answered',
  'case-study',
] as const;

function toSlug(text: string, suffix: string): string {
  return (
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 60) +
    '-' +
    suffix +
    '-' +
    Date.now().toString(36)
  );
}

function pickAngle(toolId: string, usedAngles: string[]): string {
  const available = ARTICLE_ANGLES.filter((a) => !usedAngles.includes(a));
  if (available.length === 0) return ARTICLE_ANGLES[Math.floor(Math.random() * ARTICLE_ANGLES.length)]!;
  const seed = toolId.charCodeAt(0) + Date.now();
  return available[seed % available.length]!;
}

function buildArticlePrompt(
  toolName: string,
  keyword: string,
  angle: string,
  stateName?: string
): string {
  const stateContext = stateName ? ` in ${stateName}` : ' in the United States';
  const angleGuide: Record<string, string> = {
    'comprehensive-guide': `Write a comprehensive, authoritative guide covering everything a US professional needs to know about ${keyword}${stateContext}.`,
    'step-by-step-tutorial': `Write a detailed step-by-step tutorial showing exactly how to create a ${toolName}${stateContext}. Include every step with practical tips.`,
    'common-mistakes': `Write an expert article exposing the 10 most costly mistakes people make with ${keyword}${stateContext} — and how to avoid each one.`,
    'state-specific-laws': `Write a detailed, authoritative guide to ${keyword} laws${stateContext}, covering key statutes, requirements, and how they differ from other states.`,
    'cost-comparison': `Write a thorough cost analysis of ${keyword}${stateContext} — attorney fees, DIY options, online tools, hidden costs, and when each option makes financial sense.`,
    'when-you-need-it': `Write a practical guide on exactly when a US professional or business owner needs a ${toolName}${stateContext} — with real-world scenarios for each situation.`,
    'diy-vs-professional': `Write an objective comparison: DIY ${keyword} vs. hiring a professional${stateContext}. Cover costs, risks, quality, and which option fits different situations.`,
    'checklist': `Write a comprehensive checklist and guide for ${keyword}${stateContext}. Include a downloadable-style checklist, explanations, and common pitfalls.`,
    'faqs-answered': `Write an in-depth FAQ article answering the 15 most common questions about ${keyword}${stateContext} — with detailed, accurate answers from a professional perspective.`,
    'case-study': `Write a detailed case study showing a real-world scenario where ${keyword}${stateContext} protected a business or individual — and the lessons learned.`,
  };

  const intro = angleGuide[angle] ?? `Write a comprehensive guide about ${keyword}${stateContext}.`;

  return `${intro}

Requirements:
- Target keyword: "${keyword}" (use naturally throughout)
- Word count: 1,200–1,800 words
- Structure: Use H2 and H3 headings for clear sections
- Include: introduction with hook, 4-6 main sections with substantive content, practical examples or scenarios, key takeaways or summary
- Tone: Professional, authoritative, helpful — like a knowledgeable US attorney or specialist writing for busy professionals
- SEO: Include the primary keyword in H1, first paragraph, at least 2 H2s, and conclusion
- Include a clear call-to-action at the end encouraging readers to use AI tools to generate their documents instantly
- Add a brief legal/professional disclaimer at the very end

IMPORTANT: Write in clean markdown format. Every section should provide genuine value — no filler content. Be specific with US state laws, IRS codes, federal regulations where relevant.`;
}

@Injectable()
export class ArticlesService {
  private readonly logger = new Logger(ArticlesService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly aiRouter: AIProviderRouter
  ) {}

  async generateAndSave(params: {
    toolId: string;
    toolName: string;
    keyword: string;
    stateName?: string;
    categoryId?: string;
  }): Promise<{ id: string; slug: string; title: string; wordCount: number }> {
    const tool = getToolById(params.toolId);

    // Get angles already used for this tool (last 30 days)
    const recentAngles = await this.prisma.$queryRaw<Array<{ angle_used: string }>>`
      SELECT angle_used FROM articles
      WHERE tool_id = ${params.toolId}
        AND created_at > NOW() - INTERVAL '30 days'
        AND angle_used IS NOT NULL
    `.catch(() => [] as Array<{ angle_used: string }>);

    const usedAngles = recentAngles.map((r) => r.angle_used).filter(Boolean);
    const angle = pickAngle(params.toolId, usedAngles);

    // Generate article content
    const systemPrompt = tool
      ? SYSTEM_PROMPTS[
          (['legal-documents', 'high-intent-legal'].includes(tool.category) ? 'LEGAL' :
           tool.category === 'hr-recruitment' ? 'HR' :
           tool.category === 'finance-tax' ? 'FINANCE' :
           tool.category === 'small-business' ? 'BUSINESS' :
           tool.category === 'copywriting-content' ? 'COPYWRITING' :
           tool.category === 'real-estate' ? 'REAL_ESTATE' : 'GENERAL')
        ]
      : SYSTEM_PROMPTS.GENERAL;

    const userPrompt = buildArticlePrompt(params.toolName, params.keyword, angle, params.stateName);

    this.logger.log(`Generating article for ${params.toolId} [angle: ${angle}]`);

    const response = await this.aiRouter.generate({
      messages: [
        { role: 'system', content: `${systemPrompt}\n\nYou are also an expert SEO content writer who creates engaging, deeply informative articles that rank #1 on Google. Every article you write is original, factually accurate, and provides genuine value that cannot be found by simply combining existing content.` },
        { role: 'user', content: userPrompt },
      ],
      maxTokens: 6000,
      temperature: 0.4,
    });

    const content = response.content;
    const wordCount = content.split(/\s+/).length;

    // Extract title from first H1 line
    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch?.[1] ?? `${params.toolName} Guide — ${params.keyword}`;

    // Generate excerpt (first 160 chars of first paragraph after H1)
    const excerptMatch = content.replace(/^#.+$/m, '').match(/([^#\n][^\n]{80,})/);
    const excerpt = excerptMatch?.[1]?.slice(0, 200) ?? title;

    const slug = toSlug(title, angle.slice(0, 8));

    // Save to articles table via raw SQL
    const rows = await this.prisma.$queryRaw<Array<{ id: string }>>`
      INSERT INTO articles (
        tool_id, category_id, title, slug, content, excerpt,
        meta_title, meta_description, status, angle_used,
        word_count, published_at, created_at, updated_at
      ) VALUES (
        ${params.toolId},
        ${params.categoryId ?? null},
        ${title},
        ${slug},
        ${content},
        ${excerpt},
        ${title.slice(0, 70)},
        ${excerpt.slice(0, 160)},
        'published',
        ${angle},
        ${wordCount},
        NOW(),
        NOW(),
        NOW()
      )
      ON CONFLICT (slug) DO UPDATE SET
        content = EXCLUDED.content,
        updated_at = NOW()
      RETURNING id
    `;

    const id = rows[0]?.id ?? '';
    this.logger.log(`Article saved: ${slug} (${wordCount} words)`);

    return { id, slug, title, wordCount };
  }
}
