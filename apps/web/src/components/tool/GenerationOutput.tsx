'use client';

import { useState, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { GenerationStatus } from '@aifreetools/ui-components';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

interface Props {
  status: GenerationStatus;
  output: string;
  error?: string;
  toolName: string;
  generationId?: string;
}

export function GenerationOutput({ status, output, error, toolName, generationId }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState('');
  const [copyLabel, setCopyLabel] = useState('Copy');

  const displayContent = isEditing ? editedContent : output;

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(displayContent);
    setCopyLabel('Copied!');
    setTimeout(() => setCopyLabel('Copy'), 2000);
  }, [displayContent]);

  const handleEditToggle = useCallback(() => {
    if (!isEditing) {
      setEditedContent(output);
    }
    setIsEditing((v) => !v);
  }, [isEditing, output]);

  const handleDownloadMd = useCallback(() => {
    const blob = new Blob([displayContent], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${toolName.replace(/\s+/g, '-').toLowerCase()}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  }, [displayContent, toolName]);

  const handleDownloadPdf = useCallback(async () => {
    if (!generationId) {
      // Client-side fallback: open print dialog
      const w = window.open('', '_blank');
      if (w) {
        w.document.write(`<html><head><title>${toolName}</title><style>
          body{font-family:Georgia,serif;max-width:750px;margin:40px auto;font-size:14px;line-height:1.6;color:#111}
          h1{font-size:22px;border-bottom:2px solid #333;padding-bottom:8px}
          h2{font-size:18px;margin-top:24px}h3{font-size:16px}
          pre{background:#f5f5f5;padding:12px;border-radius:4px;font-size:12px}
          hr{border:none;border-top:1px solid #ccc;margin:20px 0}
        </style></head><body>${markdownToHtml(displayContent)}</body></html>`);
        w.document.close();
        w.print();
      }
      return;
    }
    const res = await fetch(`${API_URL}/export/${generationId}/pdf`);
    if (res.ok) {
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${toolName.replace(/\s+/g, '-').toLowerCase()}.pdf`;
      a.click();
      URL.revokeObjectURL(a.href);
    }
  }, [generationId, displayContent, toolName]);

  const handleDownloadDocx = useCallback(async () => {
    if (!generationId) return;
    const res = await fetch(`${API_URL}/export/${generationId}/docx`);
    if (res.ok) {
      const blob = await res.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${toolName.replace(/\s+/g, '-').toLowerCase()}.docx`;
      a.click();
      URL.revokeObjectURL(a.href);
    }
  }, [generationId, toolName]);

  if (status === 'idle') {
    return (
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 min-h-[320px] flex items-center justify-center">
        <div>
          <p className="text-5xl mb-4">✨</p>
          <p className="font-semibold text-gray-600">Your {toolName} will appear here</p>
          <p className="text-sm mt-2">Fill out the form and click Generate</p>
        </div>
      </div>
    );
  }

  if (status === 'generating') {
    return (
      <div className="border rounded-xl p-8 text-center min-h-[320px] flex items-center justify-center bg-blue-50 border-blue-100">
        <div>
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-blue-700 font-semibold">Generating your document...</p>
          <p className="text-blue-500 text-sm mt-2">This usually takes 5–15 seconds</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="border border-red-200 bg-red-50 rounded-xl p-6 min-h-[320px] flex flex-col justify-center">
        <p className="text-red-600 font-semibold mb-2">⚠️ Generation failed</p>
        <p className="text-red-500 text-sm">{error ?? 'An unexpected error occurred. Please try again.'}</p>
        <p className="text-red-400 text-xs mt-4">Tip: Check your internet connection and try again.</p>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-gray-700">Generated Document</span>
          {status === 'streaming' && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full animate-pulse">
              Streaming...
            </span>
          )}
        </div>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={handleEditToggle}
            className={`text-xs px-3 py-1.5 rounded border transition-colors ${
              isEditing
                ? 'bg-green-600 text-white border-green-600 hover:bg-green-700'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {isEditing ? '✓ Done Editing' : '✏️ Edit'}
          </button>
          <button
            onClick={() => void handleCopy()}
            className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors"
          >
            {copyLabel}
          </button>
          <button
            onClick={handleDownloadMd}
            className="text-xs bg-white border border-gray-200 text-gray-600 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors"
          >
            .MD
          </button>
          <button
            onClick={() => void handleDownloadPdf()}
            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
          >
            PDF
          </button>
          {generationId && (
            <button
              onClick={() => void handleDownloadDocx()}
              className="text-xs bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition-colors"
            >
              DOCX
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      {isEditing ? (
        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
          className="w-full p-6 font-mono text-sm leading-relaxed min-h-[400px] max-h-[700px] resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 border-0"
          spellCheck
        />
      ) : (
        <div
          className={`p-6 prose prose-sm max-w-none prose-headings:font-bold prose-a:text-blue-600 min-h-[320px] max-h-[700px] overflow-y-auto ${
            status === 'streaming' ? 'streaming-cursor' : ''
          }`}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>
        </div>
      )}

      <div className="bg-gray-50 border-t border-gray-100 px-4 py-2">
        <p className="text-xs text-gray-400">
          ⚠️ AI-generated content — review before legal or financial use.
        </p>
      </div>
    </div>
  );
}

function markdownToHtml(md: string): string {
  return md
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^---$/gm, '<hr>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/^(.+)$/gm, (line) =>
      line.startsWith('<') ? line : `<p>${line}</p>`
    );
}
