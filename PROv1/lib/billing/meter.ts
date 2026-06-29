// lib/billing/meter.ts
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

const PRICE_TABLE = {
  'gemma-4-31b': { input: 0.0000001, output: 0.0000003 },
  'gpt-oss-120b': { input: 0.000001, output: 0.000003 },
};

export class TokenMeter {
  async recordUsage(userId: string, model: string, inputTokens: number, outputTokens: number) {
    const pricing = PRICE_TABLE[model as keyof typeof PRICE_TABLE] || PRICE_TABLE['gemma-4-31b'];
    const cost = (inputTokens * pricing.input) + (outputTokens * pricing.output);
    
    // Atomically decrement budget in Redis
    await redis.incrbyfloat(`user:budget:${userId}`, -cost);
    
    // Log for audit trail
    await redis.lpush(`user:audit:${userId}`, JSON.stringify({
      timestamp: Date.now(),
      model,
      cost,
      tokens: inputTokens + outputTokens
    }));
  }
}
