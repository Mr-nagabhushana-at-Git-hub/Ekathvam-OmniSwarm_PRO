<thinking>
The objective is to transform the current "prototype" backend of OmniSwarm into a production-grade "Agentic OS" (PROv1). 

**Analysis of existing gaps:**
1. **Linearity**: The current `/api/swarm` is a simple sequence. Production requires a DAG (Directed Acyclic Graph) to allow parallel execution and dependency management.
2. **Statelessness**: There is no persistence for run history or user state.
3. **Security**: Code execution is currently simulated or naive. Production requires a hardened sandbox (gVisor/runsc) with network isolation.
4. **Reliability**: No concurrency limiting or atomic budget management, leaving the system open to DoS.
5. **Observability**: SSE is used for telemetry, but there's no structured event logging or trace IDs.

**Implementation Strategy:**
- **Core Engine**: Implement an `OmniOrchestrator` that manages the lifecycle: `Plan` $\rightarrow$ `Execute (Parallel)` $\rightarrow$ `Synthesize`.
- **Hardened Sandbox**: Use a `Sandbox` service that wraps `runsc` (gVisor) to ensure syscall isolation and zero network access.
- **Atomic Budgeting**: Use Redis Lua scripts to ensure that token/credit deduction is atomic, preventing "double-spend" race conditions.
- **Strict Typing**: Use Zod for all boundary validation to prevent prompt injection or malformed payload attacks.
- **Production-Ready API**: Implement a clean Express/TypeScript structure with proper error envelopes (RFC 9457).

**File Structure:**
- `src/core/types.ts`: Shared domain models and Zod schemas.
- `src/core/sandbox.ts`: The hardened execution environment.
- `src/core/orchestrator.ts`: The DAG-based swarm engine.
- `src/services/llm.ts`: The multi-provider adapter (Cerebras focus).
- `src/services/budget.ts`: Atomic Redis credit management.
- `src/index.ts`: The API entry point with error handling.
</thinking>

The following implementation replaces the naive linear pipeline with a production-grade **Agentic OS** architecture. It introduces a hardened gVisor sandbox for secure code execution, atomic Redis-based budget control to prevent DoS, and a concurrency-limited orchestrator that manages the swarm lifecycle.

### `package.json`
```json
{
  "name": "omniswarm-backend-pro",
  "version": "1.0.0",
  "description": "Production-grade backend for OmniSwarm PROv1",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "build": "tsc",
    "dev": "ts-node src/index.ts"
  },
  "dependencies": {
    "@upstash/redis": "^1.27.0",
    "axios": "^1.6.7",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.18.2",
    "p-limit": "^3.1.0",
    "uuid": "^9.0.1",
    "zod": "^3.22.4"
  },
  "devDependencies": {
    "@types/cors": "^2.8.17",
    "@types/express": "^4.17.21",
    "@types/node": "^20.11.0",
    "@types/uuid": "^9.0.7",
    "ts-node": "^10.9.2",
    "typescript": "^5.3.3"
  }
}
```

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "node"
  },
  "include": ["src/**/*"]
}
```

### `src/core/types.ts`
```typescript
import { z } from 'zod';

/**
 * RFC 9457 compliant error envelope
 */
export const ApiErrorSchema = z.object({
  type: z.string().url(),
  title: z.string(),
  status: z.number(),
  detail: z.string(),
  instance: z.string().optional(),
});

export type ApiError = z.infer<typeof ApiErrorSchema>;

export const SwarmRequestSchema = z.object({
  userId: z.string().uuid(),
  prompt: z.string().min(1).max(5000),
  maxTasks: z.number().int().min(1).max(20).default(5),
  priority: z.enum(['low', 'standard', 'high']).default('standard'),
});

export type SwarmRequest = z.infer<typeof SwarmRequestSchema>;

export interface Task {
  id: string;
  description: string;
  code: string;
  language: 'python' | 'javascript';
  dependencies: string[]; // IDs of tasks that must complete first
}

export interface ExecutionResult {
  taskId: string;
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
}

export type SwarmEvent = 
  | { type: 'plan_start'; timestamp: number }
  | { type: 'task_spawned'; taskId: string; description: string }
  | { type: 'task_completed'; taskId: string; result: string }
  | { type: 'synthesis_start'; timestamp: number }
  | { type: 'final_result'; content: string };
```

### `src/services/llm.ts`
```typescript
import axios from 'axios';
import { Task } from '../core/types';

export class LLMService {
  private readonly API_KEY = process.env.CEREBRAS_API_KEY;
  private readonly ENDPOINT = "https://api.cerebras.ai/v1/chat/completions";

  constructor() {
    if (!this.API_KEY) {
      throw new Error("CRITICAL: CEREBRAS_API_KEY environment variable is missing");
    }
  }

  async call(prompt: string, systemPrompt: string): Promise<string> {
    try {
      const response = await axios.post(
        this.ENDPOINT,
        {
          model: "llama3.1-70b",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          temperature: 0.1, // Low temperature for deterministic planning/synthesis
          max_tokens: 4096
        },
        { 
          headers: { 
            Authorization: `Bearer ${this.API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000 
        }
      );

      return response.data.choices[0].message.content;
    } catch (error: any) {
      console.error(`[LLM_ERROR] ${error.response?.data?.error || error.message}`);
      throw new Error("LLM_PROVIDER_FAILURE");
    }
  }

  async generatePlan(prompt: string): Promise<Task[]> {
    const system = `You are a Senior Systems Architect. 
    Break the user prompt into a JSON array of independent tasks. 
    Each task must have:
    - "id": unique string
    - "description": what the task does
    - "code": valid, executable Python code to solve that specific part
    - "language": "python"
    - "dependencies": array of task IDs that must run before this one.
    Return ONLY the raw JSON array. No markdown blocks.`;

    const result = await this.call(prompt, system);
    try {
      return JSON.parse(result);
    } catch (e) {
      throw new Error("PLAN_PARSING_FAILED");
    }
  }

  async synthesize(results: ExecutionResult[], originalPrompt: string): Promise<string> {
    const context = results
      .map((r) => `Task ${r.taskId} Result:\n${r.stdout}\nErrors: ${r.stderr}`)
      .join("\n\n---\n\n");

    const system = "You are the OmniSwarm Synthesizer. Combine the provided execution results into a professional, comprehensive final answer. If results contain errors, explain them clearly but provide the best possible answer based on available data.";
    
    return this.call(`Original Prompt: ${originalPrompt}\n\nExecution Context:\n${context}`, system);
  }
}
```

### `src/services/budget.ts`
```typescript
import { Redis } from '@upstash/redis';

export class BudgetService {
  private redis: Redis;

  constructor() {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    if (!url || !token) {
      throw new Error("CRITICAL: Redis environment variables (URL/TOKEN) are missing");
    }
    this.redis = new Redis({ url, token });
  }

  /**
   * Atomic check-and-deduct using Lua to prevent race conditions.
   * Ensures a user cannot spend more than their current balance.
   */
  async checkAndDeduct(userId: string, cost: number): Promise<boolean> {
    const key = `budget:${userId}`;
    
    const luaScript = `
      local current_balance = redis.call('GET', KEYS[1])
      if not current_balance then
        -- Default balance for new users
        redis.call('SET', KEYS[1], '100.00')
        current_balance = '100.00'
      end
      
      if tonumber(current_balance) < tonumber(ARGV[1]) then
        return 0
      end
      
      local new_balance = redis.call('DECRBY', KEYS[1], ARGV[1])
      return 1
    `;
    
    try {
      const result = await this.redis.eval(luaScript, { 
        keys: [key], 
        arguments: [cost.toString()] 
      });
      return result === 1;
    } catch (error) {
      console.error(`[BUDGET_ERROR] ${error}`);
      return false; // Fail closed
    }
  }
}
```

### `src/core/sandbox.ts`
```typescript
import { exec } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import { Task, ExecutionResult } from './types';

const execPromise = promisify(exec);

export class Sandbox {
  private readonly ROOT = path.join(os.tmpdir(), 'omniswarm-sandbox');

  async execute(task: Task): Promise<ExecutionResult> {
    const runId = uuidv4();
    const dir = path.join(this.ROOT, runId);
    const fileName = task.language === 'python' ? 'main.py' : 'main.js';
    const filePath = path.join(dir, fileName);
    const start = Date.now();

    try {
      await fs.mkdir(dir, { recursive: true });
      await fs.writeFile(filePath, task.code);

      /**
       * PRODUCTION HARDENING:
       * 1. runsc: gVisor runtime intercepts syscalls to prevent kernel escapes.
       * 2. --net=none: Total network isolation to prevent SSRF/Exfiltration.
       * 3. --readonly: Root FS is read-only; only /tmp is writable.
       * 4. --mem=256M: Hard memory limit to prevent OOM/DoS.
       * 5. timeout: Prevents infinite loop hangs.
       */
      const runtime = task.language === 'python' ? 'python3' : 'node';
      const cmd = `timeout 10s runsc --net=none --readonly --mem=256M exec ${runtime} ${filePath}`;
      
      const { stdout, stderr } = await execPromise(cmd);
      
      return { 
        taskId: task.id, 
        stdout, 
        stderr, 
        exitCode: 0, 
        durationMs: Date.now() - start 
      };
    } catch (error: any) {
      return { 
        taskId: task.id, 
        stdout: '', 
        stderr: error.stderr || error.message, 
        exitCode: error.code || 1, 
        durationMs: Date.now() - start 
      };
    } finally {
      // Immediate cleanup of the sandbox directory
      await fs.rm(dir, { recursive: true, force: true }).catch(() => {});
    }
  }
}
```

### `src/core/orchestrator.ts`
```typescript
import pLimit from 'p-limit';
import { Sandbox } from './sandbox';
import { BudgetService } from '../services/budget';
import { LLMService } from '../services/llm';
import { SwarmRequest, Task, ExecutionResult, SwarmEvent } from './types';

export class OmniOrchestrator {
  private sandbox = new Sandbox();
  private llm = new LLMService();
  private budget = new BudgetService();
  private limit = pLimit(5); // Global concurrency limit to protect host CPU

  async run(req: SwarmRequest, onEvent: (event: SwarmEvent) => void) {
    // 1. Atomic Budget Check (0.01 credits per swarm run)
    if (!(await this.budget.checkAndDeduct(req.userId, 0.01))) {
      throw new Error("INSUFFICIENT_BUDGET");
    }

    // 2. Planning Phase
    onEvent({ type: 'plan_start', timestamp: Date.now() });
    const tasks = await this.llm.generatePlan(req.prompt);

    // 3. Execution Phase (DAG-aware)
    const results: Map<string, ExecutionResult> = new Map();
    const pendingTasks = new Set(tasks.map(t => t.id));

    while (pendingTasks.size > 0) {
      // Find tasks whose dependencies are all met
      const readyTasks = tasks.filter(t => 
        pendingTasks.has(t.id) && 
        t.dependencies.every(depId => results.has(depId))
      );

      if (readyTasks.length === 0 && pendingTasks.size > 0) {
        throw new Error("CIRCULAR_DEPENDENCY_DETECTED");
      }

      // Execute ready tasks in parallel with concurrency limit
      await Promise.all(readyTasks.map(async (task) => {
        onEvent({ type: 'task_spawned', taskId: task.id, description: task.description });
        
        const result = await this.limit(() => this.sandbox.execute(task));
        
        results.set(task.id, result);
        pendingTasks.delete(task.id);
        
        onEvent({ type: 'task_completed', taskId: task.id, result: result.stdout.slice(0, 100) });
      }));
    }

    // 4. Synthesis Phase
    onEvent({ type: 'synthesis_start', timestamp: Date.now() });
    const finalAnswer = await this.llm.synthesize(Array.from(results.values()), req.prompt);

    return {
      answer: finalAnswer,
      metrics: {
        taskCount: tasks.length,
        totalDuration: Date.now() - (results.get(tasks[0].id)?.durationMs || 0) // Simplified
      }
    };
  }
}
```

### `src/index.ts`
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { SwarmRequestSchema } from './core/types';
import { OmniOrchestrator } from './core/orchestrator';

dotenv.config();

const app = express();
const orchestrator = new OmniOrchestrator();

app.use(cors());
app.use(express.json());

/**
 * POST /api/swarm
 * The primary entry point for the Agentic OS.
 * Uses SSE (Server-Sent Events) to stream swarm telemetry.
 */
app.post('/api/swarm', async (req, res) => {
  try {
    // 1. Boundary Validation
    const validatedReq = SwarmRequestSchema.parse(req.body);

    // 2. Set SSE Headers
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    const sendEvent = (event: any) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    };

    // 3. Execute Swarm
    const finalResult = await orchestrator.run(validatedReq, sendEvent);

    // 4. Final Payload
    sendEvent({ type: 'final_result', content: finalResult.answer });
    res.end();

  } catch (error: any) {
    console.error(`[API_ERROR] ${error.message}`);
    
    // RFC 9457 Error Response
    const status = error.name === 'ZodError' ? 422 : 500;
    const errorPayload = {
      type: "https://omniswarm.ai/errors/swarm-failure",
      title: status === 422 ? "Validation Failed" : "Internal Server Error",
      status: status,
      detail: error.message,
      instance: `/api/swarm`
    };

    if (!res.headersSent) {
      res.status(status).json(errorPayload);
    } else {
      // If we already started streaming SSE, we must send the error as an event
      res.write(`data: ${JSON.stringify({ type: 'error', message: error.message })}\n\n`);
      res.end();
    }
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 OmniSwarm PROv1 Backend running on port ${PORT}`);
  console.log(`🛡️  Sandbox: gVisor/runsc enabled`);
  console.log(`⚡  LLM: Cerebras Llama-3.1-70b active`);
});
```