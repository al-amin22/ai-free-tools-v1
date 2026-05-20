import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ExportService } from './export.service';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get(':generationId/txt')
  async exportTxt(@Param('generationId') id: string, @Res() res: Response) {
    const { content, filename } = await this.exportService.exportAsText(id);
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(content);
  }

  @Get(':generationId/md')
  async exportMd(@Param('generationId') id: string, @Res() res: Response) {
    const { content, filename } = await this.exportService.exportAsMarkdown(id);
    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(content);
  }
}
