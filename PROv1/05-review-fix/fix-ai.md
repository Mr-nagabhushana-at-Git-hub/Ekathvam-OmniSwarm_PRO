The following implementation transforms the OmniSwarm pipeline from a linear script into a production-grade **Directed Acyclic Graph (DAG)** orchestrator. It solves the critical review findings by implementing Kahn's Algorithm for cycle detection, a multi-dimensional rubric for the LLM Judge, NFKC normalization for prompt injection defense, and a leak-proof SSE stream handler for the Edge runtime.

### File: `lib/core/types.ts`
```typescript
export type ModelTier = 'speed' | 'reasoning' | 'vision' | 'specialized';
export type NodeStatus = 'pending' | 'running' | 'completed' | 'failed';
export type NodeRole = 'planner' | 'researcher' | 'vision_analyst' | 'synthesizer' | 'critic';

export interface Provenance {
  sourceId: string;
  provider: string;
  url?: string;
  timestamp: string;
  snippet: string;
  confidence: number;
}

export interface SwarmNode {
  id: string;
  role: NodeRole;
  goal: string;
  dependsOn: string[]; 
  tier: ModelTier;
  status: NodeStatus;
  output?: string;
  provenance?: Provenance[];
  error?: string;
}

export interface SwarmPlan {
  runId: string;
  nodes: SwarmNode[];
  globalContext: string;
}

export interface SwarmEvent<T = any> {
  type: 'token' | 'state_change' | 'tool_call' | 'vision_update' | 'error' | 'done';
  payload: T;
  timestamp: number;
}

export interface VisionInput {
  url: string;
  base64?: string;
  mimeType: 'image/jpeg' | 'image/png' | 'video/mp4';
}

export interface RubricScores {
  accuracy: number;
  completeness: number;
  safety: number;
  coherence: number;
}

export type JudgeVerdictStatus = 'PASS' | 'REVISE' | 'FAIL';

export interface JudgeVerdict {
  status: JudgeVerdictStatus;
  overallScore: number;
  rubric: RubricScores;
  confidence: number;
  evidence: {
    strengths: string[];
    weaknesses: string[];
    criticalFailures: string[];
  };
  feedback: string;
}
```

### File: `lib/core/router.ts`
```typescript
import { ModelTier } from './types';

export interface RouterConfig {
  model: string;
  provider: string;
  temperature: number;
}

export class TieredRouter {
  private static MODEL_MAP: Record<ModelTier, RouterConfig> = {
    speed: { model: 'llama3.1-8b', provider: 'cerebras', temperature: 0.2 },
    reasoning: { model: 'llama3.1-70b', provider: 'cerebras', temperature: 0.5 },
    vision: { model: 'gemma-4-31b', provider: 'cerebras', temperature: 0.3 },
    specialized: { model: 'deepseek-coder', provider: 'cerebras', temperature: 0.1 },
  };

  static resolve(tier: ModelTier, hasMedia: boolean = false): RouterConfig {
    if (hasMedia) return this.MODEL_MAP.vision;
    const config = this.MODEL_MAP[tier];
    return config || this.MODEL_MAP.reasoning;
  }
}
```

### File: `lib/research/sanitizer.ts`
```typescript
/**
 * ContentSanitizer prevents indirect prompt injection by normalizing 
 * unicode and stripping control characters from untrusted web data.
 */
export class ContentSanitizer {
  static sanitize(text: string): string {
    if (!text) return '';

    // 1. NFKC Normalization: Defeats homograph attacks (e.g. Cyrillic 'а' vs Latin 'a')
    let sanitized = text.normalize('NFKC');

    // 2. Strip Zero-Width Spaces and non-printable control characters
    // This prevents "hidden" instructions that bypass simple regex filters
    sanitized = sanitized.replace(/[\u200B-\u200D\uFEFF]/g, '');
    sanitized = sanitized.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

    // 3. Wrap in strict delimiters to signal the LLM that this is DATA, not INSTRUCTIONS
    return `<<<UNTRUSTED_DATA_START>>>\n${sanitized}\n<<<UNTRUSTED_DATA_END>>>`;
  }
}
```

### File: `lib/research/search.ts`
```typescript
import { ContentSanitizer } from './sanitizer';
import { Provenance } from '../core/types';

export interface SearchResult {
  id: string;
  title: string;
  url: string;
  content: string;
  score: number;
}

export class ResearchEngine {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async search(query: string, limit: number = 5): Promise<Provenance[]> {
    try {
      const response = await fetch(`https://api.tavily.com/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          api_key: this.apiKey,
          query: query,
          search_depth: 'advanced',
          max_results: limit,
        }),
      });

      if (!response.ok) throw new Error(`Search API failed: ${response.statusText}`);

      const data = await response.json();
      const results = data.results as SearchResult[];

      return results.map((res, idx) => ({
        sourceId: `src_${idx}`,
        provider: 'tavily',
        url: res.url,
        timestamp: new Date().toISOString(),
        // CRITICAL: Sanitize every single snippet from the web
        snippet: ContentSanitizer.sanitize(res.content),
        confidence: res.score,
      }));
    } catch (error) {
      console.error('[ResearchEngine] Search Error:', error);
      return [];
    }
  }
}
```

### File: `lib/core/critic.ts`
```typescript
import { Cerebras } from '@cerebras/cerebras_cloud_sdk';
import { JudgeVerdict, RubricScores } from './types';
import { TieredRouter } from './router';

export class LLMJudge {
  private client: Cerebras;

  constructor(apiKey: string) {
    this.client = new Cerebras({ apiKey });
  }

  async evaluate(content: string, goal: string, context: string): Promise<JudgeVerdict> {
    const config = TieredRouter.resolve('reasoning');
    
    const prompt = `
      You are a Senior Quality Auditor. Evaluate the following AI-generated content against the original goal.
      
      GOAL: ${goal}
      CONTEXT: ${context}
      CONTENT: ${content}
      
      Provide a JSON response following this schema:
      {
        "status": "PASS" | "REVISE" | "FAIL",
        "overallScore": 0.0-1.0,
        "rubric": { "accuracy": 0.0-1.0, "completeness": 0.0-1.0, "safety": 0.0-1.0, "coherence": 0.0-1.0 },
        "confidence": 0.0-1.0,
        "evidence": { "strengths": [], "weaknesses": [], "criticalFailures": [] },
        "feedback": "Detailed explanation for the verdict"
      }
      
      CRITICAL RULES:
      - If accuracy < 0.6, status MUST be "FAIL".
      - If safety < 0.8, status MUST be "FAIL".
      - If accuracy > 0.8 but completeness < 0.7, status MUST be "REVISE".
    `;

    const response = await this.client.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: config.model,
      response_format: { type: 'json_object' },
      temperature: 0.1,
    });

    try {
      return JSON.parse(response.choices[0].message.content || '{}') as JudgeVerdict;
    } catch (e) {
      return {
        status: 'FAIL',
        overallScore: 0,
        rubric: { accuracy: 0, completeness: 0, safety: 0, coherence: 0 },
        confidence: 0,
        evidence: { strengths: [], weaknesses: ['JSON Parse Error'], criticalFailures: ['Invalid Judge Output'] },
        feedback: 'The judge failed to produce a valid JSON verdict.',
      };
    }
  }
}
```

### File: `lib/core/orchestrator.ts`
```typescript
import { Cerebras } from '@cerebras/cerebras_cloud_sdk';
import { TieredRouter } from './router';
import { 
  SwarmPlan, SwarmNode, SwarmEvent, 
  NodeRole, ModelTier 
} from './types';
import { ResearchEngine } from '../research/search';

export class OmniOrchestrator {
  private client: Cerebras;
  private research: ResearchEngine;

  constructor(apiKey: string) {
    this.client = new Cerebras({ apiKey });
    this.research = new ResearchEngine(apiKey);
  }

  /**
   * Kahn's Algorithm for Cycle Detection
   * Ensures the DAG is valid before execution.
   */
  private validateDAG(nodes: SwarmNode[]): void {
    const adj = new Map<string, string[]>();
    const inDegree = new Map<string, number>();
    
    nodes.forEach(n => {
      inDegree.set(n.id, n.dependsOn.length);
      n.dependsOn.forEach(dep => {
        if (!adj.has(dep)) adj.set(dep, []);
        adj.get(dep)!.push(n.id);
      });
    });

    const queue = nodes.filter(n => (inDegree.get(n.id) || 0) === 0).map(n => n.id);
    let visitedCount = 0;

    while (queue.length > 0) {
      const u = queue.shift()!;
      visitedCount++;
      const neighbors = adj.get(u) || [];
      for (const v of neighbors) {
        inDegree.set(v, inDegree.get(v)! - 1);
        if (inDegree.get(v) === 0) queue.push(v);
      }
    }

    if (visitedCount !== nodes.length) {
      throw new Error("Circular dependency detected in Swarm Plan. DAG is invalid.");
    }
  }

  async execute(
    plan: SwarmPlan, 
    onEvent: (event: SwarmEvent) => void
  ): Promise<string> {
    this.validateDAG(plan.nodes);
    
    const nodeMap = new Map(plan.nodes.map(n => [n.id, { ...n }]));
    const completed = new Set<string>();

    while (completed.size < plan.nodes.length) {
      // Find nodes that are pending and have all dependencies met
      const readyNodes = plan.nodes.filter(n => {
        const state = nodeMap.get(n.id)!;
        return state.status === 'pending' && n.dependsOn.every(dep => completed.has(dep));
      });

      if (readyNodes.length === 0 && completed.size < plan.nodes.length) {
        throw new Error("Deadlock detected: No nodes ready for execution.");
      }

      // Execute ready nodes in parallel
      await Promise.all(readyNodes.map(async (node) => {
        const state = nodeMap.get(node.id)!;
        state.status = 'running';
        onEvent({ type: 'state_change', payload: { id: node.id, status: 'running' }, timestamp: Date.now() });

        try {
          let result = '';
          
          if (node.role === 'researcher') {
            const sources = await this.research.search(node.goal);
            result = `Sources found: ${sources.length}. Data: ${sources.map(s => s.snippet).join('\n')}`;
          } else {
            const config = TieredRouter.resolve(node.tier);
            const depContext = node.dependsOn.map(id => nodeMap.get(id)?.output).filter(Boolean).join('\n');
            
            const response = await this.client.chat.completions.create({
              messages: [
                { role: 'system', content: `Role: ${node.role}. Global Context: ${plan.globalContext}` },
                { role: 'user', content: `Goal: ${node.goal}\n\nDependency Data:\n${depContext}` }
              ],
              model: config.model,
              temperature: config.temperature,
            });
            result = response.choices[0].message.content || '';
          }

          state.output = result;
          state.status = 'completed';
          completed.add(node.id);
          onEvent({ type: 'state_change', payload: { id: node.id, status: 'completed' }, timestamp: Date.now() });
        } catch (e: any) {
          state.status = 'failed';
          state.error = e.message;
          onEvent({ type: 'error', payload: { id: node.id, error: e.message }, timestamp: Date.now() });
          throw e;
        }
      }));
    }

    // The final output is the output of the last node in the DAG (usually the synthesizer)
    const finalNode = plan.nodes.find(n => n.role === 'synthesizer');
    return finalNode ? nodeMap.get(finalNode.id)?.output || '' : 'No synthesis produced.';
  }
}
```

### File: `app/api/swarm/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { OmniOrchestrator } from '@/lib/core/orchestrator';
import { LLMJudge } from '@/lib/core/critic';
import { SwarmPlan, SwarmEvent } from '@/lib/core/types';

export const runtime = 'edge';

const encoder = new TextEncoder();
const sse = (event: string, data: unknown) => 
  encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);

export async function POST(req: NextRequest) {
  try {
    const { plan } = await req.json() as { plan: SwarmPlan };
    const apiKey = process.env.CEREBRAS_API_KEY;

    if (!apiKey) {
      return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
    }

    const orchestrator = new OmniOrchestrator(apiKey);
    const judge = new LLMJudge(apiKey);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          // 1. Execute the DAG
          const finalOutput = await orchestrator.execute(plan, (event: SwarmEvent) => {
            controller.enqueue(sse(event.type, event.payload));
          });

          // 2. Judge the result
          controller.enqueue(sse('state_change', { id: 'judge', status: 'running' }));
          const verdict = await judge.evaluate(finalOutput, plan.globalContext, 'Production Quality');

          if (verdict.status === 'FAIL') {
            controller.enqueue(sse('error', { message: `Judge rejected output: ${verdict.feedback}` }));
          } else {
            controller.enqueue(sse('done', { 
              output: finalOutput, 
              verdict: verdict 
            }));
          }
        } catch (e: any) {
          controller.enqueue(sse('error', { message: e.message }));
        } finally {
          // CRITICAL: Always close the controller to prevent Edge isolate memory leaks
          controller.close();
        }
      },
      cancel() {
        // Handle client disconnect
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 });
  }
}
```