// app/api/admin/spend/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Redis } from '@upstash/redis';

const redis = Redis.fromEnv();

export async function GET(req: NextRequest) {
  try {
    // In production, this would be filtered by a super-admin role
    const keys = await redis.keys('budget:*');
    const spendData = await Promise.all(
      keys.map(async (key) => {
        const balance = await redis.get(key);
        const userId = key.replace('budget:', '');
        return { userId, balance };
      })
    );

    // Calculate total platform burn
    const totalTokensRemaining = spendData.reduce((acc, curr) => acc + (Number(curr.balance) || 0), 0);

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      platform_metrics: {
        total_users: spendData.length,
        total_tokens_remaining: totalTokensRemaining,
      },
      user_breakdown: spendData,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
