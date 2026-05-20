'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { GenerationStatus } from '@aifreetools/ui-components';

interface Props {
  status: GenerationStatus;
  output: string;
  error?: string;
  toolName: string;
}

export function GenerationOutput({ status, output, error, toolName }: Props) {
  if (status === 'idle') {
    return (
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center text-gray-400 min-h-[300px] flex items-center justify-center">
        <div>
          <p className="text-4xl mb-3">✨</p>
          <p className="font-medium">Your {toolName} will appear here</p>
          <p className="text-sm mt-1">Fill out the form and click Generate</p>
        </div>
      </div>
    );
  }

  if (status === 'generating') {
    return (
      <div className="border rounded-xl p-8 text-center min-h-[300px] flex items-center justify-center">
        <div>
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Generating your document...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="border border-red-200 bg-red-50 rounded-xl p-6 min-h-[300px]">
        <p className="text-red-600 font-medium mb-2">Generation failed</p>
        <p className="text-red-500 text-sm">{error ?? 'An unexpected error occurred. Please try again.'}</p>
      </div>
    );
  }

  return (
    <div className="border rounded-xl overflow-hidden">
      <div className="bg-gray-50 border-b px-4 py-3 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700">Generated Document</span>
        <div className="flex gap-2">
          <button
            onClick={() => void navigator.clipboard.writeText(output)}
            className="text-xs bg-white border border-gray-200 px-3 py-1.5 rounded hover:bg-gray-50 transition-colors"
          >
            Copy
          </button>
          <button
            onClick={() => {
              const blob = new Blob([output], { type: 'text/markdown' });
              const a = document.createElement('a');
              a.href = URL.createObjectURL(blob);
              a.download = `${toolName.replace(/\s+/g, '-').toLowerCase()}.md`;
              a.click();
            }}
            className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 transition-colors"
          >
            Download
          </button>
        </div>
      </div>
      <div className={`p-6 prose prose-sm max-w-none min-h-[300px] max-h-[600px] overflow-y-auto ${status === 'streaming' ? 'streaming-cursor' : ''}`}>
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{output}</ReactMarkdown>
      </div>
    </div>
  );
}
