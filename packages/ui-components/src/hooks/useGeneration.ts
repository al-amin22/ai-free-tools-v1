'use client';

import { useState, useCallback, useRef } from 'react';
import type { GenerationState } from '../types';

export interface UseGenerationOptions {
  apiEndpoint: string;
}

export function useGeneration({ apiEndpoint }: UseGenerationOptions) {
  const [state, setState] = useState<GenerationState>({
    status: 'idle',
    output: '',
  });
  const abortRef = useRef<AbortController | null>(null);

  const generate = useCallback(
    async (toolId: string, inputs: Record<string, unknown>) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setState({ status: 'generating', output: '' });

      try {
        const response = await fetch(`${apiEndpoint}/tools/${toolId}/generate`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ inputs }),
          signal: controller.signal,
        });

        if (!response.ok) {
          const err = await response.json().catch(() => ({ message: 'Generation failed' }));
          throw new Error(err.message ?? 'Generation failed');
        }

        const contentType = response.headers.get('content-type') ?? '';

        if (contentType.includes('text/event-stream')) {
          setState((prev) => ({ ...prev, status: 'streaming' }));
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          let accumulated = '';

          while (reader) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            const lines = chunk.split('\n');

            for (const line of lines) {
              if (line.startsWith('data: ')) {
                const data = line.slice(6).trim();
                if (data === '[DONE]') continue;
                try {
                  const parsed = JSON.parse(data) as { content?: string; cached?: boolean; provider?: string; tokensUsed?: number };
                  if (parsed.content) {
                    accumulated += parsed.content;
                    setState((prev) => ({
                      ...prev,
                      output: accumulated,
                      cached: parsed.cached,
                      provider: parsed.provider,
                      tokensUsed: parsed.tokensUsed,
                    }));
                  }
                } catch {
                  // Non-JSON SSE lines are ignored
                }
              }
            }
          }

          setState((prev) => ({ ...prev, status: 'done' }));
        } else {
          const data = await response.json() as { output?: string; cached?: boolean; provider?: string; tokensUsed?: number };
          setState({
            status: 'done',
            output: data.output ?? '',
            cached: data.cached,
            provider: data.provider,
            tokensUsed: data.tokensUsed,
          });
        }
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
        setState({
          status: 'error',
          output: '',
          error: (err as Error).message,
        });
      }
    },
    [apiEndpoint]
  );

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setState({ status: 'idle', output: '' });
  }, []);

  return { ...state, generate, reset };
}
