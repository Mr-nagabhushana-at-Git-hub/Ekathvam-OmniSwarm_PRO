<thinking>
The objective is to implement the **Upgraded Planner** and **Multimodal VISION nodes** for the OmniSwarm PROv1 build. 

**Key Requirements:**
1.  **Upgraded Planner**: Move from a linear sequence to a **Dynamic DAG (Directed Acyclic Graph)**. The planner must emit a structured JSON plan that defines dependencies, roles, and model tiers.
2.  **Multimodal VISION Nodes**: Implement routing logic that detects image/video inputs and directs them to the `gemma-4-31b` (or equivalent vision-capable) model.
3.  **Swarm Integration**: The orchestrator must execute this DAG, handling parallel execution of independent nodes and sequential execution of dependent ones.
4.  **Production-Grade**: No placeholders. Full types, error handling, SSE streaming, and provenance tracking.

**Architectural Design:**
- **The Planner**: A specialized prompt that outputs a `SwarmPlan` (JSON). It decomposes the user request into `SwarmNodes`.
- **The Router**: A policy-based selector. If a node is marked as `vision_analyst` or the input contains media, it routes to the Vision tier.
- **The Executor**: A DAG resolver. It identifies "ready" nodes (those whose `dependsOn` are all `completed`), executes them in parallel using `Promise.all`, and updates the state.
- **The Vision Node**: Specifically handles base64 image data or URLs, formatting them for the multimodal API.
- **The Stream**: A `ReadableStream` that emits `SwarmEvent` objects (tokens, state changes, tool calls) to the frontend.

**File Structure:**
- `lib/core/types.ts`: Shared interfaces.
- `lib/core/router.ts`: Model selection logic.
- `lib/core/vision.ts`: Multimodal payload formatting.
- `lib/core/orchestrator.ts`: The DAG engine.
- `app/api/swarm/route.ts`: The Next.js SSE endpoint.
</thinking>

# OmniSwarm PROv1: Upgraded Planner & Multimodal Vision Implementation

This implementation replaces the linear pipeline with a **Dynamic DAG Orchestrator**. It introduces a specialized **Vision Routing Layer** that allows the swarm to "see" and analyze images/videos before synthesizing a final response.

## 1. Core Type Definitions
`lib/core/types.ts`

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

export interface SwarmEvent {
  type: 'token' | 'state_change' | 'tool_call' | 'vision_update' | 'error' | 'done';
  payload: any;
  timestamp: number;
}

export interface VisionInput {
  url: string;
  base64?: string;
  mimeType: 'image/jpeg' | 'image/png' | 'video/mp4';
}
```

## 2. Tiered Router & Vision Policy
`lib/core/router.ts`

```typescript
import { ModelTier } from './types';

export class TieredRouter {
  private static MODEL_MAP: Record<ModelTier, string> = {
    speed: 'gpt-oss-120b',      // Cerebras Ultra-Fast
    reasoning: 'gpt-oss-120b',  // Cerebras High-Reasoning
    vision: 'gemma-4-31b',      // Multimodal Vision
    specialized: 'zai-glm-4.7', // Coding/Math
  };

  static route(tier: ModelTier, hasMedia: boolean = false): { model: string, provider: string } {
    // Force Vision tier if media is present, regardless of requested tier
    if (hasMedia || tier === 'vision') {
      return { model: this.MODEL_MAP.vision, provider: 'cerebras' };
    }

    const model = this.MODEL_MAP[tier] || this.MODEL_MAP.reasoning;
    return { model, provider: 'cerebras' };
  }
}
```

## 3. Multimodal Vision Handler
`lib/core/vision.ts`

```typescript
import { VisionInput } from './types';

export class VisionHandler {
  /**
   * Formats raw media into the multimodal message format 
   * compatible with Gemma 4 / Cerebras Vision API.
   */
  static formatVisionPayload(prompt: string, media: VisionInput[]) {
    const content: any[] = [{ type: 'text', text: prompt }];

    for (const item of media) {
      if (item.base64) {
        content.push({
          type: 'image_url',
          image_url: { url: `data:${item.mimeType};base64,${item.base64}` }
        });
      } else if (item.url) {
        content.push({
          type: 'image_url',
          image_url: { url: item.url }
        });
      }
    }

    return content;
  }
}
```

## 4. The DAG Orchestrator
`lib/core/orchestrator.ts`

```typescript
import { Cerebras } from '@cerebras/cerebras_cloud_sdk';
import { TieredRouter } from './router';
import { VisionHandler } from './vision';
import { 
  SwarmPlan, SwarmNode, SwarmEvent, 
  VisionInput, NodeRole 
} from './types';

export class OmniOrchestrator {
  private client: Cerebras;

  constructor(apiKey: string) {
    this.client = new Cerebras({ apiKey });
  }

  /**
   * STEP 1: The Planner
   * Decomposes the prompt into a JSON DAG.
   */
  async plan(prompt: string, hasMedia: boolean): Promise<SwarmPlan> {
    const systemPrompt = `You are the OmniSwarm Architect. Decompose the user request into a Directed Acyclic Graph (DAG) of specialized agent nodes.
    
    ROLES:
    - researcher: Web search and data retrieval.
    - vision_analyst: Image/Video analysis (use if media is present).
    - synthesizer: Final aggregation and formatting.
    - critic: Quality control and fact-checking.

    OUTPUT FORMAT: Strict JSON.
    {
      "runId": "uuid",
      "globalContext": "summary of goal",
      "nodes": [
        { "id": "n1", "role": "researcher", "goal": "...", "dependsOn": [], "tier": "speed" },
        { "id": "n2", "role": "vision_analyst", "goal": "...", "dependsOn": [], "tier": "vision" },
        { "id": "n3", "role": "synthesizer", "goal": "...", "dependsOn": ["n1", "n2"], "tier": "reasoning" }
      ]
    }`;

    const response = await this.client.chat.completions.create({
      model: 'gpt-oss-120b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Task: ${prompt}. Media Present: ${hasMedia}` }
      ],
      response_format: { type: 'json_object' }
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  }

  /**
   * STEP 2: The DAG Executor
   * Executes nodes based on dependency resolution.
   */
  async execute(
    plan: SwarmPlan, 
    prompt: string, 
    media: VisionInput[], 
    onEvent: (event: SwarmEvent) => void
  ): Promise<string> {
    const nodes = [...plan.nodes];
    const completedNodes = new Set<string>();

    while (completedNodes.size < nodes.length) {
      // Find nodes that are pending and have all dependencies met
      const readyNodes = nodes.filter(n => 
        n.status === 'pending' && 
        n.dependsOn.every(depId => completedNodes.has(depId))
      );

      if (readyNodes.length === 0 && completedNodes.size < nodes.length) {
        throw new Error("Deadlock detected in Swarm DAG");
      }

      // Execute ready nodes in parallel
      await Promise.all(readyNodes.map(async (node) => {
        node.status = 'running';
        onEvent({ 
          type: 'state_change', 
          payload: { nodeId: node.id, status: 'running' }, 
          timestamp: Date.now() 
        });

        try {
          const { model } = TieredRouter.route(node.tier, node.role === 'vision_analyst');
          
          let messages: any[] = [];
          if (node.role === 'vision_analyst') {
            const visionContent = VisionHandler.formatVisionPayload(node.goal, media);
            messages = [{ role: 'user', content: visionContent }];
            onEvent({ type: 'vision_update', payload: { nodeId: node.id }, timestamp: Date.now() });
          } else {
            // Inject outputs of dependencies as context
            const context = node.dependsOn
              .map(id => nodes.find(n => n.id === id)?.output)
              .filter(Boolean)
              .join('\n\n');
            
            messages = [
              { role: 'system', content: `Role: ${node.role}. Goal: ${node.goal}` },
              { role: 'user', content: `Context:\n${context}\n\nOriginal Prompt: ${prompt}` }
            ];
          }

          const stream = await this.client.chat.completions.create({
            model,
            messages,
            stream: true,
          });

          let fullOutput = '';
          for await (const chunk of stream) {
            const token = chunk.choices[0]?.delta?.content;
            if (token) {
              fullOutput += token;
              onEvent({ type: 'token', payload: { nodeId: node.id, token }, timestamp: Date.now() });
            }
          }

          node.output = fullOutput;
          node.status = 'completed';
          completedNodes.add(node.id);
        } catch (e: any) {
          node.status = 'failed';
          node.error = e.message;
          onEvent({ type: 'error', payload: { nodeId: node.id, error: e.message }, timestamp: Date.now() });
        }
      }));
    }

    // Final synthesis is the output of the node with the 'synthesizer' role
    return nodes.find(n => n.role === 'synthesizer')?.output || "Synthesis failed.";
  }
}
```

## 5. Production SSE API Route
`app/api/swarm/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { OmniOrchestrator } from '@/lib/core/orchestrator';
import { VisionInput } from '@/lib/core/types';

export async function POST(req: NextRequest) {
  try {
    const { prompt, media } = await req.json();
    const mediaList: VisionInput[] = media || [];
    
    const orchestrator = new OmniOrchestrator(process.env.CEREBRAS_API_KEY!);

    const stream = new ReadableStream({
      async start(controller) {
        const encoder = new TextEncoder();
        const send = (event: any) => {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        };

        try {
          // 1. Planning Phase
          send({ type: 'state_change', payload: { stage: 'planning' }, timestamp: Date.now() });
          const plan = await orchestrator.plan(prompt, mediaList.length > 0);
          send({ type: 'state_change', payload: { stage: 'executing', plan }, timestamp: Date.now() });

          // 2. Execution Phase (DAG)
          const finalResult = await orchestrator.execute(
            plan, 
            prompt, 
            mediaList, 
            (event) => send(event)
          );

          send({ type: 'done', payload: { result: finalResult }, timestamp: Date.now() });
        } catch (error: any) {
          send({ type: 'error', payload: { message: error.message }, timestamp: Date.now() });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
```

### Implementation Summary
1.  **Dynamic Planning**: The `OmniOrchestrator.plan` method uses `gpt-oss-120b` to generate a JSON DAG. This allows the system to decide *on-the-fly* if it needs a vision analyst, multiple researchers, or a critic.
2.  **Vision Routing**: The `TieredRouter` and `VisionHandler` ensure that any node assigned the `vision_analyst` role is routed to `gemma-4-31b` and receives a properly formatted multimodal payload (base64/URL).
3.  **Parallel DAG Execution**: The `execute` loop uses a dependency-resolution strategy. It identifies all nodes whose `dependsOn` requirements are met and fires them concurrently using `Promise.all`, maximizing the 3000 tok/s throughput of Cerebras.
4.  **Real-time Telemetry**: The API route uses a `ReadableStream` to push fine-grained events (`vision_update`, `token`, `state_change`) to the UI, allowing the "Obsidian Glass" frontend to animate the swarm's progress.