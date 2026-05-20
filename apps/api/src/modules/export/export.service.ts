import { Injectable, NotFoundException } from '@nestjs/common';
import PDFDocument from 'pdfkit';
import { Document, Paragraph, TextRun, HeadingLevel, AlignmentType, Packer, PageBreak } from 'docx';
import { PrismaService } from '../../database/prisma.service';

interface ParsedLine {
  type: 'h1' | 'h2' | 'h3' | 'body' | 'bold' | 'hr' | 'blank' | 'list';
  text: string;
}

function parseMarkdown(markdown: string): ParsedLine[] {
  const lines: ParsedLine[] = [];
  for (const raw of markdown.split('\n')) {
    const line = raw.trimEnd();
    if (line.startsWith('# ')) lines.push({ type: 'h1', text: line.slice(2) });
    else if (line.startsWith('## ')) lines.push({ type: 'h2', text: line.slice(3) });
    else if (line.startsWith('### ')) lines.push({ type: 'h3', text: line.slice(4) });
    else if (line.startsWith('**') && line.endsWith('**')) lines.push({ type: 'bold', text: line.slice(2, -2) });
    else if (line === '---' || line === '***') lines.push({ type: 'hr', text: '' });
    else if (line.startsWith('- ') || line.startsWith('* ')) lines.push({ type: 'list', text: line.slice(2) });
    else if (line.trim() === '') lines.push({ type: 'blank', text: '' });
    else lines.push({ type: 'body', text: line });
  }
  return lines;
}

function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`(.+?)`/g, '$1')
    .replace(/\[(.+?)\]\(.+?\)/g, '$1');
}

@Injectable()
export class ExportService {
  constructor(private readonly prisma: PrismaService) {}

  private async getGeneration(generationId: string) {
    const gen = await this.prisma.toolGeneration.findUnique({ where: { id: generationId } });
    if (!gen?.output) throw new NotFoundException(`Generation ${generationId} not found or has no output`);
    return gen;
  }

  async exportAsText(generationId: string): Promise<{ content: string; filename: string }> {
    const gen = await this.getGeneration(generationId);
    return {
      content: gen.output!,
      filename: `${gen.toolId}-${generationId.slice(0, 8)}.txt`,
    };
  }

  async exportAsMarkdown(generationId: string): Promise<{ content: string; filename: string }> {
    const gen = await this.getGeneration(generationId);
    return {
      content: gen.output!,
      filename: `${gen.toolId}-${generationId.slice(0, 8)}.md`,
    };
  }

  async exportAsPdf(generationId: string): Promise<{ buffer: Buffer; filename: string }> {
    const gen = await this.getGeneration(generationId);
    const lines = parseMarkdown(gen.output!);
    const filename = `${gen.toolId}-${generationId.slice(0, 8)}.pdf`;

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 72, right: 72, bottom: 72, left: 72 },
        info: { Title: gen.toolId, Author: 'AIFreeTools.com' },
      });

      const chunks: Buffer[] = [];
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve({ buffer: Buffer.concat(chunks), filename }));
      doc.on('error', reject);

      let firstH1 = true;

      for (const line of lines) {
        const text = stripInlineMarkdown(line.text);
        switch (line.type) {
          case 'h1':
            if (!firstH1) doc.moveDown(0.5);
            doc.font('Helvetica-Bold').fontSize(18).fillColor('#1a1a2e').text(text, { align: 'center' });
            doc.moveDown(0.3);
            doc.moveTo(doc.page.margins.left, doc.y)
               .lineTo(doc.page.width - doc.page.margins.right, doc.y)
               .strokeColor('#3b82f6').lineWidth(1.5).stroke();
            doc.moveDown(0.5);
            firstH1 = false;
            break;
          case 'h2':
            doc.moveDown(0.4);
            doc.font('Helvetica-Bold').fontSize(14).fillColor('#1e3a5f').text(text);
            doc.moveDown(0.2);
            break;
          case 'h3':
            doc.moveDown(0.3);
            doc.font('Helvetica-Bold').fontSize(12).fillColor('#374151').text(text);
            doc.moveDown(0.1);
            break;
          case 'bold':
            doc.font('Helvetica-Bold').fontSize(11).fillColor('#111827').text(text);
            doc.moveDown(0.2);
            break;
          case 'hr':
            doc.moveDown(0.3);
            doc.moveTo(doc.page.margins.left, doc.y)
               .lineTo(doc.page.width - doc.page.margins.right, doc.y)
               .strokeColor('#e5e7eb').lineWidth(1).stroke();
            doc.moveDown(0.3);
            break;
          case 'list':
            doc.font('Helvetica').fontSize(10.5).fillColor('#374151')
               .text(`• ${stripInlineMarkdown(text)}`, { indent: 12, lineGap: 2 });
            break;
          case 'blank':
            doc.moveDown(0.25);
            break;
          case 'body':
            doc.font('Helvetica').fontSize(10.5).fillColor('#374151')
               .text(stripInlineMarkdown(text), { lineGap: 3, paragraphGap: 4 });
            break;
        }
      }

      // Footer
      const range = doc.bufferedPageRange();
      for (let i = range.start; i < range.start + range.count; i++) {
        doc.switchToPage(i);
        doc.font('Helvetica').fontSize(8).fillColor('#9ca3af')
           .text(
             `Generated by AIFreeTools.com — AI-generated content for informational purposes only | Page ${i + 1} of ${range.count}`,
             doc.page.margins.left,
             doc.page.height - 40,
             { align: 'center', width: doc.page.width - doc.page.margins.left - doc.page.margins.right }
           );
      }

      doc.end();
    });
  }

  async exportAsDocx(generationId: string): Promise<{ buffer: Buffer; filename: string }> {
    const gen = await this.getGeneration(generationId);
    const lines = parseMarkdown(gen.output!);
    const filename = `${gen.toolId}-${generationId.slice(0, 8)}.docx`;

    const children: Paragraph[] = [];

    for (const line of lines) {
      const text = stripInlineMarkdown(line.text);
      switch (line.type) {
        case 'h1':
          children.push(
            new Paragraph({
              text,
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { before: 240, after: 120 },
            })
          );
          break;
        case 'h2':
          children.push(
            new Paragraph({
              text,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 200, after: 80 },
            })
          );
          break;
        case 'h3':
          children.push(
            new Paragraph({
              text,
              heading: HeadingLevel.HEADING_3,
              spacing: { before: 160, after: 60 },
            })
          );
          break;
        case 'bold':
          children.push(
            new Paragraph({
              children: [new TextRun({ text, bold: true, size: 24 })],
              spacing: { before: 80, after: 40 },
            })
          );
          break;
        case 'list':
          children.push(
            new Paragraph({
              children: [new TextRun({ text: `• ${stripInlineMarkdown(text)}`, size: 22 })],
              indent: { left: 360 },
              spacing: { before: 40, after: 40 },
            })
          );
          break;
        case 'hr':
          children.push(new Paragraph({ text: '', spacing: { before: 120, after: 120 }, border: { bottom: { color: '#e5e7eb', size: 6, space: 1, style: 'single' } } }));
          break;
        case 'blank':
          children.push(new Paragraph({ text: '', spacing: { before: 60, after: 60 } }));
          break;
        case 'body':
          if (text.trim()) {
            children.push(
              new Paragraph({
                children: [new TextRun({ text: stripInlineMarkdown(text), size: 22 })],
                spacing: { before: 60, after: 60 },
              })
            );
          }
          break;
      }
    }

    // Disclaimer footer paragraph
    children.push(new Paragraph({ children: [new PageBreak()] }));
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: 'Generated by AIFreeTools.com — AI-generated content for informational purposes only. Review with a licensed professional before use.',
            color: '9CA3AF',
            size: 16,
          }),
        ],
        alignment: AlignmentType.CENTER,
      })
    );

    const document = new Document({
      creator: 'AIFreeTools.com',
      title: gen.toolId,
      description: 'AI-generated document',
      sections: [
        {
          properties: {
            page: { margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
          },
          children,
        },
      ],
    });

    const buffer = await Packer.toBuffer(document);
    return { buffer, filename };
  }
}
