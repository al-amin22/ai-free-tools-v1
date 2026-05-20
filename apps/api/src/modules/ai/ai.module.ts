import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { AIProviderRouter } from '../../engines/ai/ai-provider-router';
import { REDIS_CLIENT } from '../../engines/ai/redis.decorator';

@Module({
  providers: [
    {
      provide: REDIS_CLIENT,
      inject: [ConfigService],
      useFactory: (config: ConfigService) =>
        new Redis({
          host: config.get('REDIS_HOST', 'localhost'),
          port: Number(config.get('REDIS_PORT', 6379)),
          password: config.get('REDIS_PASSWORD'),
          lazyConnect: true,
        }),
    },
    AIProviderRouter,
  ],
  exports: [AIProviderRouter, REDIS_CLIENT],
})
export class AIModule {}
