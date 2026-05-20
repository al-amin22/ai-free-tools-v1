import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class AnalyticsService {
  private readonly logger = new Logger(AnalyticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async track(eventType: string, data?: {
    toolId?: string;
    sessionId?: string;
    userId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void> {
    try {
      await this.prisma.analyticsEvent.create({
        data: {
          eventType,
          toolId: data?.toolId,
          sessionId: data?.sessionId,
          userId: data?.userId,
          metadata: data?.metadata,
        },
      });
    } catch (err) {
      this.logger.error(`Failed to track event ${eventType}`, err);
    }
  }

  async getToolStats(toolId: string) {
    const [totalGenerations, successfulGenerations, cachedGenerations] = await Promise.all([
      this.prisma.toolGeneration.count({ where: { toolId } }),
      this.prisma.toolGeneration.count({ where: { toolId, status: 'COMPLETED' } }),
      this.prisma.toolGeneration.count({ where: { toolId, cached: true } }),
    ]);

    return { toolId, totalGenerations, successfulGenerations, cachedGenerations };
  }
}
