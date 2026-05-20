import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import OpenAI from 'openai';
import type { AIRequest, AIResponse, AIProvider } from '@aifreetools/shared-types';
import { createHash } from 'crypto';
import { InjectRedis } from './redis.decorator';
import type Redis from 'ioredis';

const CACHE_TTL_SECONDS = 3600;

@Injectable()
export class AIProviderRouter {
  private readonly logger = new Logger(AIProviderRouter.name);
  private readonly anthropic: Anthropic;
  private readonly openai: OpenAI;
  private readonly groq: OpenAI;

  constructor(
    private readonly config: ConfigService,
    @InjectRedis() private readonly redis: Redis
  ) {
    this.anthropic = new Anthropic({ apiKey: config.get('ANTHROPIC_API_KEY') });
    this.openai = new OpenAI({ apiKey: config.get('OPENAI_API_KEY') });
    this.groq = new OpenAI({
      apiKey: config.get('GROQ_API_KEY'),
      baseURL: 'https://api.groq.com/openai/v1',
    });
  }

  async generate(request: AIRequest): Promise<AIResponse> {
    const cacheKey = this.buildCacheKey(request);
    const cached = await this.redis.get(cacheKey);

    if (cached) {
      this.logger.log(`Cache hit: ${cacheKey}`);
      return { ...JSON.parse(cached) as AIResponse, cached: true };
    }

    const providers: AIProvider[] = ['claude', 'openai', 'groq'];
    let lastError: Error | null = null;

    for (const provider of providers) {
      try {
        const response = await this.callProvider(provider, request);
        await this.redis.setex(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(response));
        return response;
      } catch (err) {
        lastError = err as Error;
        this.logger.warn(`Provider ${provider} failed: ${lastError.message}`);
      }
    }

    throw lastError ?? new Error('All AI providers failed');
  }

  async *generateStream(request: AIRequest): AsyncGenerator<string> {
    const providers: AIProvider[] = ['claude', 'openai', 'groq'];
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

  private async callProvider(provider: AIProvider, request: AIRequest): Promise<AIResponse> {
    const model = this.getModel(provider);
    const messages = request.messages.filter((m) => m.role !== 'system');
    const systemMsg = request.messages.find((m) => m.role === 'system');

    if (provider === 'claude') {
      const res = await this.anthropic.messages.create({
        model,
        max_tokens: request.maxTokens ?? 4096,
        system: systemMsg?.content,
        messages: messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      });
      const content = res.content[0];
      const text = content?.type === 'text' ? content.text : '';
      return {
        content: text,
        provider,
        model,
        tokensUsed: res.usage.input_tokens + res.usage.output_tokens,
        cached: false,
      };
    }

    const client = provider === 'groq' ? this.groq : this.openai;
    const res = await client.chat.completions.create({
      model,
      max_tokens: request.maxTokens ?? 4096,
      messages: request.messages.map((m) => ({ role: m.role, content: m.content })),
    });

    return {
      content: res.choices[0]?.message?.content ?? '',
      provider,
      model,
      tokensUsed: res.usage?.total_tokens,
      cached: false,
    };
  }

  private async *streamProvider(provider: AIProvider, request: AIRequest): AsyncGenerator<string> {
    const model = this.getModel(provider);
    const messages = request.messages.filter((m) => m.role !== 'system');
    const systemMsg = request.messages.find((m) => m.role === 'system');

    if (provider === 'claude') {
      const stream = await this.anthropic.messages.stream({
        model,
        max_tokens: request.maxTokens ?? 4096,
        system: systemMsg?.content,
        messages: messages.map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content })),
      });

      for await (const chunk of stream) {
        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
          yield chunk.delta.text;
        }
      }
      return;
    }

    const client = provider === 'groq' ? this.groq : this.openai;
    const stream = await client.chat.completions.create({
      model,
      max_tokens: request.maxTokens ?? 4096,
      messages: request.messages.map((m) => ({ role: m.role, content: m.content })),
      stream: true,
    });

    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
  }

  private getModel(provider: AIProvider): string {
    const models: Record<AIProvider, string> = {
      claude: this.config.get('CLAUDE_MODEL', 'claude-haiku-4-5-20251001'),
      openai: this.config.get('OPENAI_MODEL', 'gpt-4o-mini'),
      groq: this.config.get('GROQ_MODEL', 'llama-3.1-8b-instant'),
      openclaw: this.config.get('OPENCLAW_MODEL', 'openclaw-v1'),
      mock: 'mock-model',
    };
    return models[provider] ?? models.claude;
  }

  private buildCacheKey(request: AIRequest): string {
    const hash = createHash('sha256')
      .update(JSON.stringify(request.messages))
      .digest('hex')
      .substring(0, 16);
    return `ai:gen:${hash}`;
  }
}
