import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { getToolById, ALL_TOOLS } from '@aifreetools/tool-configs';
import { buildPrompt } from '@aifreetools/ai-prompts';
import { SYSTEM_PROMPTS } from '@aifreetools/ai-prompts';
import type { ToolConfig } from '@aifreetools/shared-types';
import { AIProviderRouter } from '../../engines/ai/ai-provider-router';
import { PrismaService } from '../../database/prisma.service';
import { v4 as uuidv4 } from 'uuid';

const CATEGORY_SYSTEM_MAP: Record<string, keyof typeof SYSTEM_PROMPTS> = {
  legal: 'LEGAL',
  'real-estate': 'LEGAL',
  hr: 'HR',
  finance: 'FINANCE',
  business: 'BUSINESS',
  copywriting: 'COPYWRITING',
  bonus: 'LEGAL',
};

@Injectable()
export class ToolsService {
  private readonly logger = new Logger(ToolsService.name);

  constructor(
    private readonly aiRouter: AIProviderRouter,
    private readonly prisma: PrismaService
  ) {}

  getAllTools(): ToolConfig[] {
    return ALL_TOOLS;
  }

  getToolById(id: string): ToolConfig {
    const tool = getToolById(id);
    if (!tool) throw new NotFoundException(`Tool '${id}' not found`);
    return tool;
  }

  async generate(
    toolId: string,
    inputs: Record<string, unknown>,
    sessionId?: string
  ): Promise<{ output: string; generationId: string; cached: boolean; provider: string }> {
    const tool = this.getToolById(toolId);
    const sid = sessionId ?? uuidv4();

    const record = await this.prisma.toolGeneration.create({
      data: {
        toolId,
        sessionId: sid,
        inputs: inputs as Prisma.InputJsonValue,
        status: 'PROCESSING',
      },
    });

    try {
      const messages = this.buildMessages(tool, inputs);
      const response = await this.aiRouter.generate({ messages, maxTokens: 4096 });

      await this.prisma.toolGeneration.update({
        where: { id: record.id },
        data: {
          output: response.content,
          status: response.cached ? 'CACHED' : 'COMPLETED',
          provider: response.provider,
          tokensUsed: response.tokensUsed,
          cached: response.cached,
          completedAt: new Date(),
        },
      });

      return {
        output: response.content,
        generationId: record.id,
        cached: response.cached,
        provider: response.provider,
      };
    } catch (err) {
      await this.prisma.toolGeneration.update({
        where: { id: record.id },
        data: { status: 'FAILED', errorMessage: (err as Error).message },
      });
      throw err;
    }
  }

  async *generateStream(
    toolId: string,
    inputs: Record<string, unknown>,
    sessionId?: string
  ): AsyncGenerator<{ content?: string; done?: boolean; generationId?: string }> {
    const tool = this.getToolById(toolId);
    const sid = sessionId ?? uuidv4();

    const record = await this.prisma.toolGeneration.create({
      data: { toolId, sessionId: sid, inputs: inputs as Prisma.InputJsonValue, status: 'PROCESSING' },
    });

    yield { generationId: record.id };

    let fullOutput = '';
    try {
      const messages = this.buildMessages(tool, inputs);
      for await (const chunk of this.aiRouter.generateStream({ messages, maxTokens: 4096 })) {
        fullOutput += chunk;
        yield { content: chunk };
      }

      await this.prisma.toolGeneration.update({
        where: { id: record.id },
        data: { output: fullOutput, status: 'COMPLETED', completedAt: new Date() },
      });

      yield { done: true };
    } catch (err) {
      await this.prisma.toolGeneration.update({
        where: { id: record.id },
        data: { status: 'FAILED', errorMessage: (err as Error).message },
      });
      throw err;
    }
  }

  private buildMessages(tool: ToolConfig, inputs: Record<string, unknown>) {
    const systemKey = CATEGORY_SYSTEM_MAP[tool.category] ?? 'GENERAL';
    const systemPrompt = SYSTEM_PROMPTS[systemKey];

    const userStep = tool.promptConfig.steps[0];
    if (!userStep) throw new Error(`No prompt steps for tool ${tool.id}`);

    const userContent = buildPrompt(userStep.template, inputs as Record<string, unknown> & { state?: string; stateName?: string });

    return [
      { role: 'system' as const, content: systemPrompt },
      { role: 'user' as const, content: userContent },
    ];
  }
}
