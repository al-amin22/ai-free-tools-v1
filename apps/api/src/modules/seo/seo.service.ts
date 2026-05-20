import { Injectable, Logger } from '@nestjs/common';
import { ALL_TOOLS, US_STATES } from '@aifreetools/tool-configs';
import { buildToolMeta } from '@aifreetools/seo-utils';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class SeoService {
  private readonly logger = new Logger(SeoService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateToolSeoPages(): Promise<void> {
    this.logger.log(`Generating SEO pages for ${ALL_TOOLS.length} tools`);

    for (const tool of ALL_TOOLS) {
      const meta = buildToolMeta({
        toolName: tool.name,
        toolId: tool.id,
        description: tool.description,
        category: tool.category,
      });

      await this.prisma.seoPage.upsert({
        where: {
          toolId_stateCode_pageType: {
            toolId: tool.id,
            stateCode: null as unknown as string,
            pageType: 'TOOL',
          },
        },
        create: {
          toolId: tool.id,
          pageType: 'TOOL',
          title: meta.title,
          description: meta.description,
          published: true,
        },
        update: {
          title: meta.title,
          description: meta.description,
        },
      });

      for (const state of US_STATES) {
        const stateMeta = buildToolMeta({
          toolName: tool.name,
          toolId: tool.id,
          description: tool.description,
          category: tool.category,
          state: state.value,
          stateName: state.label,
        });

        await this.prisma.seoPage.upsert({
          where: {
            toolId_stateCode_pageType: {
              toolId: tool.id,
              stateCode: state.value,
              pageType: 'STATE',
            },
          },
          create: {
            toolId: tool.id,
            stateCode: state.value,
            pageType: 'STATE',
            title: stateMeta.title,
            description: stateMeta.description,
            published: true,
          },
          update: {
            title: stateMeta.title,
            description: stateMeta.description,
          },
        });
      }
    }

    this.logger.log('SEO page generation complete');
  }

  async getPublishedPages(toolId?: string) {
    return this.prisma.seoPage.findMany({
      where: { published: true, ...(toolId ? { toolId } : {}) },
      orderBy: [{ toolId: 'asc' }, { pageType: 'asc' }],
    });
  }
}
