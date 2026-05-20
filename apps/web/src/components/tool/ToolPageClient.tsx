'use client';

import { useState } from 'react';
import type { ToolConfig } from '@aifreetools/shared-types';
import { DynamicForm } from '@/components/form/DynamicForm';
import { GenerationOutput } from '@/components/tool/GenerationOutput';
import { useGeneration } from '@aifreetools/ui-components';

interface State {
  value: string;
  label: string;
  code?: string;
}

interface Props {
  tool: ToolConfig;
  state?: State;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api';

export function ToolPageClient({ tool, state }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const { status, output, error, generationId, generate, reset } = useGeneration({ apiEndpoint: API_URL });

  async function handleSubmit(values: Record<string, unknown>) {
    setSubmitted(true);
    await generate(tool.id, {
      ...values,
      state: state?.value,
      stateName: state?.label,
    });
  }

  function handleReset() {
    reset();
    setSubmitted(false);
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <nav className="text-sm text-gray-500 mb-4">
          <a href="/" className="hover:text-blue-600">Home</a>
          {' / '}
          <a href="/tools" className="hover:text-blue-600">Tools</a>
          {' / '}
          {state && (
            <>
              <a href={`/tools/${tool.id}`} className="hover:text-blue-600">{tool.name}</a>
              {' / '}
              <span>{state.label}</span>
            </>
          )}
          {!state && <span>{tool.name}</span>}
        </nav>
        <h1 className="text-3xl font-bold text-gray-900">
          {state ? `${state.label} ${tool.name}` : tool.name}
        </h1>
        <p className="mt-2 text-gray-600 text-lg">{tool.description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <DynamicForm
            schema={tool.formSchema}
            defaultState={state?.value}
            onSubmit={handleSubmit}
            isSubmitting={status === 'generating' || status === 'streaming'}
            onReset={submitted ? handleReset : undefined}
          />
        </div>

        <div>
          <GenerationOutput
            status={status}
            output={output}
            error={error}
            toolName={tool.name}
            generationId={generationId}
          />
        </div>
      </div>

      {tool.seoConfig.faqs && tool.seoConfig.faqs.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {tool.seoConfig.faqs.map((faq, i) => (
              <details key={i} className="border rounded-lg p-4">
                <summary className="font-medium cursor-pointer">{faq.question}</summary>
                <p className="mt-2 text-gray-600 text-sm">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
