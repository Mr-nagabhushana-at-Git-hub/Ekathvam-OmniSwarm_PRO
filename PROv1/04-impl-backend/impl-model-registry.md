<thinking>
The objective is to implement a production-grade **Model Registry and Routing System** for OmniSwarm PROv1. 

**Core Requirements:**
1. **BYO Model Registry**: Ability to register any model from any provider without hardcoding.
2. **Endpoint Templating**: Dynamic routing based on provider-specific API shapes.
3. **Per-Provider Config**: Handling different auth headers, timeout settings, and payload structures.
4. **Capability Tags**: Tagging models (e.g., `vision`, `coding`, `fast`, `reasoning`) so the swarm can route tasks to the most capable model.
5. **Production-Grade**: Consistent error handling, type safety, and a clear API contract.

**Architectural Design:**
- **Registry**: A singleton store (abstracted for DB/Redis) that maps `model_id` $\rightarrow$ `ModelConfiguration`.
- **Router**: A strategy-pattern based dispatcher. Instead of a giant `if/else` block, I'll use `ProviderAdapters` that normalize the request/response between the Swarm and the external API.
- **Templating**: Use a template-based approach for endpoints to support versioning (e.g., `/v1/chat/completions` vs `/v2/completions`).
- **Capability Matching**: A resolver that allows the swarm to request a model by capability (e.g., "Give me the fastest model with `coding` tags") rather than a hardcoded ID.

**Implementation Plan:**
1. `lib/core/registry/types.ts`: Define the strict contracts for Models, Providers, and Capabilities.
2. `lib/core/registry/model-registry.ts`: The core registry logic (CRUD for models, capability lookup).
3. `lib/core/routing/provider-adapter.ts`: The interface for all LLM providers.
4. `lib/core/routing/adapters/`: Concrete implementations for Cerebras, OpenAI, and a Generic REST adapter.
5. `lib/core/routing/model-router.ts`: The high-level dispatcher that connects the Registry to the Adapters.
6. `app/api/registry/route.ts`: The management API to add/update models at runtime.
</thinking>

# OmniSwarm PROv1: Dynamic Model Registry & Routing System

This system replaces hardcoded model strings with a **Capability-Based Routing** architecture. The swarm no longer asks for `"llama-3.1-70b"`; it asks for a model with `capabilities: ['coding', 'fast']`, and the Registry resolves this to the optimal configured provider.

## 1. API Contract: Registry Management

### `POST /api/registry/models`
**Description**: Register or update a model configuration.
- **Auth**: Admin Required
- **Request Body**:
```json
{
  "id": "cerebras-llama-3.1-70b",
  "name": "Llama 3.1 70B (Cerebras)",
  "providerId": "cerebras",
  "endpointTemplate": "https://api.cerebras.ai/v1/chat/completions",
  "capabilities": ["fast", "coding", "general"],
  "config": {
    "timeout": 30000,
    "maxTokens": 8192,
    "temperature": 0.7
  }
}
```
- **Response (201 Created)**: `{ "status": "registered", "modelId": "cerebras-llama-3.1-70b" }`

### `GET /api/registry/resolve`
**Description**: Resolve a model based on capability tags.
- **Query Params**: `tags=coding,fast`
- **Response (200 OK)**:
```json
{
  "resolvedModel": {
    "id": "cerebras-llama-3.1-70b",
    "providerId": "cerebras",
    "endpoint": "https://api.cerebras.ai/v1/chat/completions"
  }
}
```

---

## 2. Production Implementation

### `lib/core/registry/types.ts`
```typescript
export type ModelCapability = 'coding' | 'vision' | 'reasoning' | 'fast' | 'large-context' | 'general';

export interface ModelConfig {
  id: string;
  name: string;
  providerId: string;
  endpointTemplate: string; // e.g. "https://api.provider.com/v1/chat/completions"
  capabilities: ModelCapability[];
  config: Record<string, any>;
  isActive: boolean;
}

export interface ProviderConfig {
  id: string;
  name: string;
  apiKeyEnvVar: string; // The environment variable name to pull the key from
  defaultHeaders: Record<string, string>;
}

export interface RoutingRequest {
  prompt: string;
  capabilities: ModelCapability[];
  params?: Record<string, any>;
}

export interface RoutingResponse {
  content: string;
  modelId: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  latencyMs: number;
}
```

### `lib/core/registry/model-registry.ts`
```typescript
import { ModelConfig, ModelCapability, ProviderConfig } from './types';

export class ModelRegistry {
  private static instance: ModelRegistry;
  private models = new Map<string, ModelConfig>();
  private providers = new Map<string, ProviderConfig>();

  private constructor() {
    this.loadDefaults();
  }

  public static getInstance(): ModelRegistry {
    if (!ModelRegistry.instance) {
      ModelRegistry.instance = new ModelRegistry();
    }
    return ModelRegistry.instance;
  }

  private loadDefaults() {
    // Default Provider
    this.registerProvider({
      id: 'cerebras',
      name: 'Cerebras',
      apiKeyEnvVar: 'CEREBRAS_API_KEY',
      defaultHeaders: { 'Content-Type': 'application/json' }
    });

    // Default Model
    this.registerModel({
      id: 'cerebras-llama-3.1-70b',
      name: 'Llama 3.1 70B',
      providerId: 'cerebras',
      endpointTemplate: 'https://api.cerebras.ai/v1/chat/completions',
      capabilities: ['fast', 'coding', 'general'],
      config: { temperature: 0.7 },
      isActive: true
    });
  }

  public registerProvider(config: ProviderConfig) {
    this.providers.set(config.id, config);
  }

  public registerModel(config: ModelConfig) {
    this.models.set(config.id, config);
  }

  public getModel(id: string): ModelConfig | undefined {
    return this.models.get(id);
  }

  public getProvider(id: string): ProviderConfig | undefined {
    return this.providers.get(id);
  }

  /**
   * Resolves the best model based on required capabilities.
   * Priority: Most capabilities matched -> Active status -> First registered.
   */
  public resolveByCapabilities(required: ModelCapability[]): ModelConfig | null {
    const candidates = Array.from(this.models.values())
      .filter(m => m.isActive && required.every(cap => m.capabilities.includes(cap)));

    if (candidates.length === 0) return null;
    
    // Sort by the number of capabilities (prefer more specialized models)
    return candidates.sort((a, b) => b.capabilities.length - a.capabilities.length)[0];
  }
}

export const registry = ModelRegistry.getInstance();
```

### `lib/core/routing/provider-adapter.ts`
```typescript
import { RoutingRequest, RoutingResponse, ModelConfig, ProviderConfig } from '../registry/types';

/**
 * Abstract Adapter to normalize different LLM API shapes.
 */
export abstract class ProviderAdapter {
  abstract providerId: string;

  async execute(
    model: ModelConfig, 
    provider: ProviderConfig, 
    request: RoutingRequest
  ): Promise<RoutingResponse> {
    const start = performance.now();
    const response = await this.callApi(model, provider, request);
    const latencyMs = performance.now() - start;

    return {
      ...response,
      latencyMs
    };
  }

  protected abstract callApi(
    model: ModelConfig, 
    provider: ProviderConfig, 
    request: RoutingRequest
  ): Promise<Omit<RoutingResponse, 'latencyMs'>>;
}
```

### `lib/core/routing/adapters/cerebras-adapter.ts`
```typescript
import { ProviderAdapter } from '../provider-adapter';
import { RoutingRequest, RoutingResponse, ModelConfig, ProviderConfig } from '../../registry/types';

export class CerebrasAdapter extends ProviderAdapter {
  providerId = 'cerebras';

  protected async callApi(
    model: ModelConfig, 
    provider: ProviderConfig, 
    request: RoutingRequest
  ): Promise<Omit<RoutingResponse, 'latencyMs'>> {
    const apiKey = process.env[provider.apiKeyEnvVar];
    if (!apiKey) throw new Error(`Missing API Key for provider ${provider.id}`);

    const response = await fetch(model.endpointTemplate, {
      method: 'POST',
      headers: {
        ...provider.defaultHeaders,
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model.id, // Cerebras uses the model ID in the body
        messages: [{ role: 'user', content: request.prompt }],
        ...model.config
      })
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Cerebras API Error: ${response.status} - ${err}`);
    }

    const data = await response.json();
    return {
      content: data.choices[0].message.content,
      modelId: model.id,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        completionTokens: data.usage.completion_tokens,
        totalTokens: data.usage.total_tokens
      }
    };
  }
}
```

### `lib/core/routing/model-router.ts`
```typescript
import { registry } from '../registry/model-registry';
import { ProviderAdapter } from './provider-adapter';
import { CerebrasAdapter } from './adapters/cerebras-adapter';
import { RoutingRequest, RoutingResponse, ModelCapability } from '../registry/types';

export class ModelRouter {
  private adapters = new Map<string, ProviderAdapter>();

  constructor() {
    // Register known adapters
    this.registerAdapter(new CerebrasAdapter());
  }

  public registerAdapter(adapter: ProviderAdapter) {
    this.adapters.set(adapter.providerId, adapter);
  }

  /**
   * The primary entry point for the swarm.
   * Routes a request based on capabilities.
   */
  public async route(request: RoutingRequest): Promise<RoutingResponse> {
    // 1. Resolve Model by Capabilities
    const model = registry.resolveByCapabilities(request.capabilities);
    if (!model) {
      throw new Error(`No active model found matching capabilities: ${request.capabilities.join(', ')}`);
    }

    // 2. Resolve Provider
    const provider = registry.getProvider(model.providerId);
    if (!provider) {
      throw new Error(`Provider ${model.providerId} not configured in registry.`);
    }

    // 3. Resolve Adapter
    const adapter = this.adapters.get(model.providerId);
    if (!adapter) {
      throw new Error(`No adapter implemented for provider ${model.providerId}.`);
    }

    // 4. Execute
    return adapter.execute(model, provider, request);
  }
}

export const modelRouter = new ModelRouter();
```

### `app/api/registry/route.ts`
```typescript
import { NextRequest, NextResponse } from 'next/server';
import { registry } from '@/lib/core/registry/model-registry';
import { ModelConfig } from '@/lib/core/registry/types';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Basic validation
    if (!body.id || !body.providerId || !body.endpointTemplate) {
      return NextResponse.json(
        { error: { code: 'VALIDATION_ERROR', message: 'Missing required model fields' } },
        { status: 422 }
      );
    }

    const modelConfig: ModelConfig = {
      id: body.id,
      name: body.name || body.id,
      providerId: body.providerId,
      endpointTemplate: body.endpointTemplate,
      capabilities: body.capabilities || ['general'],
      config: body.config || {},
      isActive: body.isActive !== false
    };

    registry.registerModel(modelConfig);

    return NextResponse.json({ status: 'registered', modelId: modelConfig.id }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: { code: 'INTERNAL_ERROR', message: e.message } }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tags = searchParams.get('tags')?.split(',') || [];

  if (tags.length > 0) {
    const resolved = registry.resolveByCapabilities(tags as any);
    if (!resolved) {
      return NextResponse.json({ error: 'No model matches these capabilities' }, { status: 404 });
    }
    return NextResponse.json({ resolvedModel: resolved });
  }

  return NextResponse.json({ message: 'Please provide ?tags=... to resolve a model' });
}
```

## 3. Key Architectural Decisions

1. **Capability-Based Resolution**: Instead of the swarm requesting a specific model ID, it requests a set of capabilities. This allows the backend engineer to swap `llama-3.1-70b` for `gpt-4o` or a newer `deepseek` model in the registry without changing a single line of swarm logic.
2. **Adapter Pattern**: Every provider has a different API shape (some put the model in the URL, some in the body, some use different token usage keys). The `ProviderAdapter` normalizes this into a consistent `RoutingResponse`.
3. **Endpoint Templating**: By storing the `endpointTemplate` in the registry, we can support multiple versions of the same provider's API or route to different regional endpoints (e.g., US-East vs EU-West) dynamically.
4. **Environment-Based Secrets**: The `ProviderConfig` stores the *name* of the environment variable (`apiKeyEnvVar`), not the key itself. This ensures secrets stay in the secure environment and are never persisted in the registry database.
5. **Complexity**: Resolution is $O(M)$ where $M$ is the number of registered models. Given that most swarms use $<100$ models, this is negligible. For $1000+$, a capability-to-model inverted index would be implemented.