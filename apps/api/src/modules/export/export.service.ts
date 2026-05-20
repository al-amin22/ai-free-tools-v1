import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class ExportService {
  private readonly logger = new Logger(ExportService.name);

  constructor(private readonly prisma: PrismaService) {}

  async exportAsText(generationId: string): Promise<{ content: string; filename: string }> {
    const generation = await this.prisma.toolGeneration.findUnique({
      where: { id: generationId },
    });

    if (!generation?.output) {
      throw new NotFoundException(`Generation ${generationId} not found or has no output`);
    }

    const filename = `${generation.toolId}-${generationId.slice(0, 8)}.txt`;
    return { content: generation.output, filename };
  }

  async exportAsMarkdown(generationId: string): Promise<{ content: string; filename: string }> {
    const generation = await this.prisma.toolGeneration.findUnique({
      where: { id: generationId },
    });

    if (!generation?.output) {
      throw new NotFoundException(`Generation ${generationId} not found or has no output`);
    }

    const filename = `${generation.toolId}-${generationId.slice(0, 8)}.md`;
    return { content: generation.output, filename };
  }
}
