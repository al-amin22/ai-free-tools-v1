import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  Headers,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import type { Response } from 'express';
import { ToolsService } from './tools.service';
import { GenerateToolDto } from './dto/generate-tool.dto';

@Controller('tools')
export class ToolsController {
  constructor(private readonly toolsService: ToolsService) {}

  @Get()
  listTools() {
    return this.toolsService.getAllTools().map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      category: t.category,
    }));
  }

  @Get(':toolId')
  getTool(@Param('toolId') toolId: string) {
    return this.toolsService.getToolById(toolId);
  }

  @Post(':toolId/generate')
  @Throttle({ default: { limit: 10, ttl: 3600_000 } })
  @HttpCode(HttpStatus.OK)
  async generate(
    @Param('toolId') toolId: string,
    @Body() dto: GenerateToolDto,
    @Headers('accept') accept: string,
    @Headers('x-session-id') sessionId: string | undefined,
    @Res() res: Response
  ) {
    const wantsStream = accept?.includes('text/event-stream');

    if (wantsStream) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.flushHeaders();

      for await (const chunk of this.toolsService.generateStream(toolId, dto.inputs, sessionId)) {
        res.write(`data: ${JSON.stringify(chunk)}\n\n`);
      }

      res.write('data: [DONE]\n\n');
      res.end();
      return;
    }

    const result = await this.toolsService.generate(toolId, dto.inputs, sessionId);
    res.json(result);
  }
}
