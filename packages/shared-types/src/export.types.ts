export type ExportFormat = 'pdf' | 'docx';
export type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'expired';

export interface ExportRequest {
  generationId: string;
  format: ExportFormat;
  options?: ExportOptions;
}

export interface ExportOptions {
  watermark?: boolean;
  fontSize?: number;
  pageSize?: 'letter' | 'a4' | 'legal';
  includeHeader?: boolean;
  includeFooter?: boolean;
}

export interface ExportResult {
  exportId: string;
  downloadUrl: string;
  expiresAt: string;
  fileSizeBytes: number;
  format: ExportFormat;
}
