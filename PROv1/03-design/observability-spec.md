<thinking>
The objective is to specify a production-grade observability and cost/quota system for OmniSwarm PROv1. 

**1. Trace/Span Model:**
I will implement an OpenTelemetry (OTel) based model following GenAI semantic conventions. The root span will be the HTTP request, with child spans for each agent node in the DAG. This allows for precise latency attribution (e.g., "Why is the Synthesizer slow? Is it the LLM or the Sandbox?").

**2. Metric Names:**
I'll define a set of "Golden Signals" for LLMs: TTFT (Time to First Token), TPS (Tokens Per Second), and Token Usage (Input/Output/Cache).

**3. SLOs & Alerts:**
I will define a 99.9% availability SLO and a p95 TTFT < 1.5s latency SLO. Alerts will be based on *burn rates* (how fast the error budget is being consumed) rather than raw error counts to reduce noise.

**4. Token-Budget Enforcement:**
The enforcement must happen at the Edge (Vercel Middleware) to prevent expensive LLM calls from being made by users with zero balance. I'll use a Redis-backed sliding window for rate limiting and an atomic counter for token budgets.

**5. Spend Dashboard:**
I will design a schema for a dashboard that tracks cost per user, cost per model, and cost per swarm-template.

**Implementation Plan:**
- `lib/telemetry/tracer.ts`: OTel configuration and span wrappers.
- `lib/telemetry/metrics.ts`: Prometheus/OTel metric definitions.
- `lib/quota/enforcer.ts`: Redis-based budget and rate-limit logic.
- `lib/quota/budget-manager.ts`: Logic to deduct tokens after a run.
- `docs/observability/slo-spec.md`: The formal SLO/SLI definitions.
- `app/api/admin/spend/route.ts`: The data provider for the spend dashboard.
</thinking>

# OmniSwarm PROv1: Observability & Cost Governance Specification

This specification transforms OmniSwarm from a prototype into a metered, observable production platform. We treat **reliability as a feature** and **cost as a hard constraint**.

## 1. Trace & Span Model (OpenTelemetry)

We implement a hierarchical trace model. Every swarm request is a `root` span, and every agent node in the DAG is a `child` span.

### Span Hierarchy
- `HTTP POST /api/swarm/run` (Root - SERVER)
    - `swarm.plan` (INTERNAL) $\rightarrow$ Generates the DAG
    - `swarm.execute` (INTERNAL) $\rightarrow$ Orchestrates the nodes
        - `node.reasoning` (CLIENT - Cerebras) $\rightarrow$ `gen_ai.operation: chat`
        - `node.execution` (INTERNAL - Sandbox) $\rightarrow$ `gen_ai.operation: execute_tool`
    - `swarm.synthesize` (CLIENT - Cerebras) $\rightarrow$ Final aggregation

### GenAI Semantic Conventions
Every LLM span must include:
- `gen_ai.request.model`: e.g., `llama3.1-70b`
- `gen_ai.usage.input_tokens`: Total input tokens
- `gen_ai.usage.output_tokens`: Total output tokens
- `gen_ai.response.finish_reason`: `stop`, `length`, or `tool_calls`

---

## 2. Metric Definitions (The Golden Signals)

| Metric Name | Type | Unit | Description |
| :--- | :--- | :--- | :--- |
| `omniswarm.ttft` | Histogram | `ms` | Time to First Token (p95 target: < 1.5s) |
| `omniswarm.tps` | Gauge | `tok/s` | Tokens per second (Cerebras target: > 2000) |
| `omniswarm.token_usage` | Counter | `tokens` | Total tokens consumed, sliced by `model` and `user_id` |
| `omniswarm.sandbox.duration` | Histogram | `ms` | Time spent in gVisor/Firecracker execution |
| `omniswarm.error_rate` | Counter | `count` | 5xx errors or Sandbox crashes |

---

## 3. SLO & Alerting Framework

We define reliability based on the **Error Budget**.

### SLO Definitions
- **Availability**: 99.9% of valid requests return a non-5xx response over 30 days.
- **Latency**: 99% of requests have a TTFT $\le$ 2.0s.

### Burn Rate Alerts
We alert when the rate of budget consumption threatens the 30-day SLO.

| Severity | Long Window | Short Window | Burn Rate | Budget Consumed | Action |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **CRITICAL** | 1h | 5m | 14.4x | 2% | PagerDuty / Immediate Fix |
| **WARNING** | 6h | 30m | 6x | 5% | Ticket / Next-day Fix |

---

## 4. Token-Budget Enforcement Points

Enforcement follows the **"Fail Fast, Fail Cheap"** principle.

1. **Edge Gate (Middleware)**: Check if `user_budget > 0`. If not, return `402 Payment Required`.
2. **Pre-Flight (Orchestrator)**: Estimate tokens for the DAG. If `estimated > remaining`, return `429 Too Many Requests`.
3. **Post-Flight (Budget Manager)**: Atomically deduct actual tokens used from Redis.

---

## 5. Production Implementation

### `lib/telemetry/tracer.ts`
```typescript
// lib/telemetry/tracer.ts
import { trace, SpanStatusCode, ValueType } from '@opentelemetry/api';
import { NodeOTLPTraceExporter } from '@opentelemetry/exporter-node-otlp-grpc';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeTracerProvider } from '@opentelemetry/sdk-trace-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'omniswarm-orchestrator',
    [SemanticResourceAttributes.SERVICE_VERSION]: '1.0.0-pro',
  }),
});

provider.addSpanProcessor(new BatchSpanProcessor(new NodeOTLPTraceExporter()));
provider.register();

export const tracer = trace.getTracer('omniswarm-core');

/**
 * Wraps an agent node execution in a trace span with GenAI conventions
 */
export async function traceAgentNode<T>(
  nodeId: string,
  role: string,
  model: string,
  fn: () => Promise<{ result: T; tokens: { input: number; output: number } }>
): Promise<T> {
  return tracer.startActiveSpan(`gen_ai.operation.execute ${role}`, async (span) => {
    span.setAttributes({
      'gen_ai.node.id': nodeId,
      'gen_ai.request.model': model,
      'gen_ai.operation.name': 'chat',
    });

    try {
      const { result, tokens } = await fn();
      
      span.setAttributes({
        'gen_ai.usage.input_tokens': tokens.input,
        'gen_ai.usage.output_tokens': tokens.output,
      });
      
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (e: any) {
      span.setStatus({ 
        code: SpanStatusCode.ERROR, 
        message: e.message 
      });
      span.recordException(e);
      throw e;
    } finally {
      span.end();
    }
  });
}
```

### `lib/quota/enforcer.ts`
```typescript
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
```

### `app/api/admin/spend/route.ts`
```typescript
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
```

## 6. Spend Dashboard Specification

The frontend `SpendDashboard` component should visualize the following data from `/api/admin/spend`:

1. **Burn Rate Chart**: A line chart showing `total_tokens_remaining` over time (sampled every hour).
2. **Top Spenders Table**:
   - `User ID` | `Current Balance` | `Avg Tokens/Run` | `Last Active`
3. **Model Distribution**: A pie chart showing token usage split by `llama3.1-70b` vs `gemma-4` (derived from OTel metrics).
4. **Budget Alerts**: A list of users who have fallen below 10% of their initial budget.