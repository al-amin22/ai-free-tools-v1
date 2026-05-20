import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIRequest, AIResponse } from '@aifreetools/shared-types';
import { createHash } from 'crypto';
import { InjectRedis } from './redis.decorator';
import type Redis from 'ioredis';

const CACHE_TTL_SECONDS = 3600;
const MAX_RETRIES = 3;

type Provider = 'groq' | 'gemini';

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function withRetry<T>(fn: () => Promise<T>, maxRetries = MAX_RETRIES): Promise<T> {
  let lastErr: Error = new Error('Unknown error');
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err as Error;
      if (attempt < maxRetries) {
        await sleep(Math.pow(2, attempt - 1) * 600); // 600ms, 1.2s, 2.4s
      }
    }
  }
  throw lastErr;
}

@Injectable()
export class AIProviderRouter {
  private readonly logger = new Logger(AIProviderRouter.name);
  private readonly groq: OpenAI;
  private readonly gemini: GoogleGenerativeAI;

  constructor(
    private readonly config: ConfigService,
    @InjectRedis() private readonly redis: Redis
  ) {
    this.groq = new OpenAI({
      apiKey: config.get<string>('GROQ_API_KEY', ''),
      baseURL: 'https://api.groq.com/openai/v1',
    });
    this.gemini = new GoogleGenerativeAI(config.get<string>('GEMINI_API_KEY', ''));
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const cacheKey = this.buildCacheKey(request);

    const cached = await this.redis.get(cacheKey).catch(() => null);
    if (cached) {
      this.logger.debug(`Cache hit: ${cacheKey}`);
      return { ...(JSON.parse(cached) as AIResponse), cached: true };
    }

    const providers: Provider[] = ['groq', 'gemini'];
    let lastError: Error | null = null;

    for (const provider of providers) {
      try {
        const response = await withRetry(() => this.callProvider(provider, request));
        await this.redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(response)).catch(() => null);
        return response;
      } catch (err) {
        lastError = err as Error;
        this.logger.warn(`Provider ${provider} failed after retries: ${lastError.message}`);
      }
    }

    throw lastError ?? new Error('All AI providers failed');
  }

  async *generateStream(request: AIRequest): AsyncGenerator<string> {
    const providers: Provider[] = ['groq', 'gemini'];
    let lastError: Error | null = null;

    for (const provider of providers) {
      try {
        yield* this.streamProvider(provider, request);
        return;
      } catch (err) {
        lastError = err as Error;
        this.logger.warn(`Stream provider ${provider} failed: ${lastError.message}`);
      }
    }

    throw lastError ?? new Error('All AI stream providers failed');
  }

  private async callProvider(provider: Provider, request: AIRequest): Promise<AIResponse> {
    if (provider === 'groq') {
      return this.callGroq(request);
    }
    return this.callGemini(request);
  }

  private async callGroq(request: AIRequest): Promise<AIResponse> {
    const model = this.config.get<string>('GROQ_MODEL', 'llama-3.3-70b-versatile');
    const res = await this.groq.chat.completions.create({
      model,
      max_tokens: request.maxTokens ?? 4096,
      temperature: request.temperature ?? 0.2,
      messages: request.messages.map((m) => ({ role: m.role, content: m.content })),
    });

    return {
      content: res.choices[0]?.message?.content ?? '',
      provider: 'groq',
      model,
      tokensUsed: res.usage?.total_tokens,
      cached: false,
    };
  }

  private async callGemini(request: AIRequest): Promise<AIResponse> {
    const modelName = this.config.get<string>('GEMINI_MODEL', 'gemini-2.0-flash-exp');
    const systemMsg = request.messages.find((m) => m.role === 'system');
    const userMsgs = request.messages.filter((m) => m.role !== 'system');

    const model = this.gemini.getGenerativeModel({
      model: modelName,
      systemInstruction: systemMsg?.content,
    });

    const contents = userMsgs.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const result = await model.generateContent({
      contents,
      generationConfig: {
        maxOutputTokens: request.maxTokens ?? 4096,
        temperature: request.temperature ?? 0.2,
      },
    });

    const text = result.response.text();
    const usage = result.response.usageMetadata;

    return {
      content: text,
      provider: 'gemini',
      model: modelName,
      tokensUsed: (usage?.promptTokenCount ?? 0) + (usage?.candidatesTokenCount ?? 0),
      cached: false,
    };
  }

  private async *streamProvider(provider: Provider, request: AIRequest): AsyncGenerator<string> {
    if (provider === 'groq') {
      yield* this.streamGroq(request);
    } else {
      yield* this.streamGemini(request);
    }
  }

  private async *streamGroq(request: AIRequest): AsyncGenerator<string> {
    const model = this.config.get<string>('GROQ_MODEL', 'llama-3.3-70b-versatile');
    const stream = await this.groq.chat.completions.create({
      model,
      max_tokens: request.maxTokens ?? 4096,
      temperature: request.temperature ?? 0.2,
      messages: request.messages.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
  }

  private async *streamGemini(request: AIRequest): AsyncGenerator<string> {
    const modelName = this.config.get<string>('GEMINI_MODEL', 'gemini-2.0-flash-exp');
    const systemMsg = request.messages.find((m) => m.role === 'system');
    const userMsgs = request.messages.filter((m) => m.role !== 'system');

    const model = this.gemini.getGenerativeModel({
      model: modelName,
      systemInstruction: systemMsg?.content,
    });

    const contents = userMsgs.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const result = await model.generateContentStream({ contents });

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) yield text;
    }
  }

  private buildCacheKey(request: AIRequest): string {
    const hash = createHash('sha256')
      .update(JSON.stringify(request.messages))
      .digest('hex')
      .slice(0, 20);
    return `ai:gen:${hash}`;
  }
}
