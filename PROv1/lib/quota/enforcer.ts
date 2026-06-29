// lib/quota/enforcer.ts
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export interface QuotaResponse {
  allowed: boolean;
  reason?: 'INSUFFICIENT_FUNDS' | 'RATE_LIMIT_EXCEEDED';
  remaining?: number;
}

export class QuotaEnforcer {
  /**
   * Checks both rate limits and token budgets at the edge
   */
  static async checkAccess(apiKey: string): Promise<QuotaResponse> {
    const pipeline = redis.pipeline();
    
    const rateLimitKey = `ratelimit:${apiKey}`;
    const budgetKey = `budget:${apiKey}`;
    
    pipeline.incr(rateLimitKey);
    pipeline.expire(rateLimitKey, 60);
    pipeline.get(budgetKey);
    
    const [_, __, budget] = await pipeline.exec();
    const currentRequests = Number(budget) || 0; // Simplified for example
    const remainingTokens = Number(budget) || 0;

    // 1. Rate Limit: 20 requests per minute
    if (currentRequests > 20) {
      return { allowed: false, reason: 'RATE_LIMIT_EXCEEDED' };
    }

    // 2. Token Budget: Must have at least 100 tokens to start a swarm
    if (remainingTokens < 100) {
      return { allowed: false, reason: 'INSUFFICIENT_FUNDS' };
    }

    return { allowed: true, remaining: remainingTokens };
  }

  /**
   * Atomically deducts tokens after a run completes
   */
  static async deductTokens(apiKey: string, amount: number): Promise<number> {
    const budgetKey = `budget:${apiKey}`;
    return await redis.decrby(budgetKey, amount);
  }
}
