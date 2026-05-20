import { Controller, Get, Param, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ExportService } from './export.service';

@Controller('export')
export class ExportController {
  constructor(private readonly exportService: ExportService) {}

  @Get(':generationId/txt')
  async exportTxt(@Param('generationId') id: string, @Res() res: Response) {
    const { content, filename } = await this.exportService.exportAsText(id);
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(content);
  }

  @Get(':generationId/md')
  async exportMd(@Param('generationId') id: string, @Res() res: Response) {
    const { content, filename } = await this.exportService.exportAsMarkdown(id);
    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(content);
  }

  @Get(':generationId/pdf')
  async exportPdf(@Param('generationId') id: string, @Res() res: Response) {
    const { buffer, filename } = await this.exportService.exportAsPdf(id);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  }

  @Get(':generationId/docx')
  async exportDocx(@Param('generationId') id: string, @Res() res: Response) {
    const { buffer, filename } = await this.exportService.exportAsDocx(id);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', buffer.length);
    res.send(buffer);
  }
}
