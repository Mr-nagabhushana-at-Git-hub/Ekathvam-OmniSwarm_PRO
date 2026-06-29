<thinking>
The user wants a final executive launch script and a detailed mounting guide for the "PROv2-GodMode" Next.js app, which is the frontend for the ORCMEGA system. 

Key constraints and context:
1.  **The Product**: ORCMEGA (Unified Agent-OS).
2.  **The Stack**: Next.js, Framer Motion (highly animated), FastAPI (Python), Rust Kernel (N-API), SQLite FTS5/PostgreSQL.
3.  **The Scale**: 50 animated pages, 20 core components.
4.  **The History**: A previous build failed due to a "single-shot" approach. The solution is a phased, fail-fast build (`rust` -> `ts` -> `python`).
5.  **The Goal**: A "GodMode" UI that visualizes "Cerebras Speed" (3000 tok/s) and multi-agent swarms.

Plan:
1.  **Executive Launch Script**: A high-level narrative for a demo/launch, focusing on the "Cerebras Speed" and "Agent Swarm" primitives.
2.  **Mounting Guide**: Technical instructions on how to deploy/run the PROv2-GodMode app, specifically handling the complex tri-toolchain (Cargo, pnpm, pip).
3.  **UI Architecture**: Mapping the 50 pages and 20 components into a coherent structure.
4.  **Implementation Details**: Providing the actual `start.mjs` and `build.mjs` logic to ensure the "fail-fast" requirement is met.
</thinking>

# ORCMEGA: PROv2-GodMode Executive Launch & Deployment Suite

This document serves as the final synthesis for the **ORCMEGA** launch. It transforms the technical scaffold into a high-stakes executive presentation and a deterministic deployment manual.

---

## Part 1: Executive Launch Script
**Theme:** *The End of the Spinner.*
**Objective:** Demonstrate that "Cerebras Speed" (3000 tok/s) isn't just a metric—it's a new UX primitive that enables live, interactive multi-agent swarms.

| Time | Visual | Narrative / Script |
| :--- | :--- | :--- |
| **0:00** | **The Void.** Black screen. A single, pulsing white cursor. | "For years, AI has been a conversation with a slow-typing ghost. We wait for the spinner. We wait for the block." |
| **0:10** | **The Ignition.** Sudden burst of glassmorphism. The `AgentForest` component blooms in 4K. | "Welcome to ORCMEGA. We didn't just build an orchestrator; we built a nervous system for intelligence." |
| **0:25** | **The Speed Race.** Split screen: Standard GPU vs. Cerebras. Same prompt. | "Watch the left: the industry standard. Now watch the right. 3,000 tokens per second. The result isn't 'delivered'—it's instantaneous." |
| **0:45** | **The Swarm.** The UI shifts to the `SwarmView`. 12 agents spawn in a DAG, lines of light connecting them. | "This is GodMode. A planner decomposes the task, spawns a specialized swarm, and synthesizes the answer in 3 seconds. Not 3 minutes." |
| **1:10** | **The Brain.** Transition to the `MemoryVault` (SQLite FTS5). High-speed filtering of 10k+ entries. | "Every decision, every failure, every insight is indexed in the Unified Brain. The system doesn't just remember; it evolves." |
| **1:30** | **The Close.** Logo resolve. "ORCMEGA: Intelligence at the speed of thought." | "The era of the spinner is over. The era of the swarm is here." |

---

## Part 2: Mounting the PROv2-GodMode App

Because this system utilizes a **tri-toolchain (Rust $\rightarrow$ TS $\rightarrow$ Python)**, a standard `npm run dev` will fail. You must use the phased orchestration layer.

### 1. Prerequisites
- **OS**: Windows 11 (C:\AGENCY\...)
- **Toolchains**: 
    - `Rust` (latest stable) + `napi-rs` CLI
    - `Node.js` (v20+) + `pnpm`
    - `Python` (3.11+) + `pip` / `venv`

### 2. The Deterministic Mount Sequence
Do not run these manually. Use the provided `scripts/build.mjs` to ensure the **Rust native addons** are compiled before the **TS SDK** attempts to import them.

```bash
# 1. Clone and Enter Root
cd C:\AGENCY\PRODUCTS\orcmega

# 2. Install JS Dependencies
pnpm install

# 3. Execute Phased Build (The "Fail-Fast" Guard)
# This runs: Rust Crates -> TS Packages -> Python Environment
node scripts/build.mjs

# 4. Launch Unified Process
# This starts: FastAPI (Port 8000) + Next.js (Port 3000) + Rust Sidecar
pnpm start
```

### 3. The `start.mjs` Logic (Internal)
The system uses a managed subprocess model to prevent "zombie" kernels.
```javascript
// scripts/start.mjs snippet
import { spawn } from 'child_process';

const processes = [
  { name: 'Backend', cmd: 'python', args: ['-m', 'orcmega.server'] },
  { name: 'Frontend', cmd: 'pnpm', args: ['--filter', 'dashboard', 'dev'] }
];

processes.forEach(p => {
  const proc = spawn(p.cmd, p.args, { stdio: 'inherit', shell: true });
  proc.on('exit', (code) => {
    console.error(`CRITICAL: ${p.name} exited with code ${code}. Shutting down swarm.`);
    process.exit(code);
  });
});
```

---

## Part 3: UI Architecture (50 Pages / 20 Components)

The PROv2-GodMode UI is split into **6 Functional Domains**. Each page uses `framer-motion` for layout transitions (AnimatePresence) and `lucide-react` for iconography.

### The 20 Core Components (The "Atomic" Layer)
| Component | Purpose | Animation Primitive |
| :--- | :--- | :--- |
| `AgentForest` | Visualizes agent hierarchy/connections | SVG Path Morphing + Spring |
| `TokenStream` | High-speed text rendering (3k tok/s) | Staggered Opacity + Slide-up |
| `GlassPanel` | The primary container (Blur 20px) | Hover-scale + Border-glow |
| `BrainNode` | Individual memory entry in the vault | LayoutId (Shared Element Transition) |
| `SwarmDAG` | Directed Acyclic Graph of task flow | Edge-pulse + Node-pop |
| `LatencyHUD` | Real-time TTFT and tok/s counter | Number-ticker (Rapid) |
| `CommandBar` | Global `Cmd+K` interface | Scale-in + Backdrop-blur |
| `SkillCard` | Interactive skill capability toggle | Flip-card / 3D Rotate |
| `LogConsole` | Multiplexed SSE execution stream | Vertical-scroll + Color-fade |
| `StatusOrb` | System health (Ready/Degraded/Error) | Radial-gradient pulse |
| *(+10 others: Nav, Footer, Modal, Tooltip, etc.)* | | |

### The 50 Page Map (The "Experience" Layer)
| Domain | Page Count | Key Pages | UX Focus |
| :--- | :--- | :--- | :--- |
| **Command Center** | 10 | `/dashboard`, `/swarm/live`, `/console` | High-density data, real-time updates. |
| **The Brain** | 10 | `/brain/search`, `/brain/vault`, `/brain/learnings` | FTS5 search, memory clustering. |
| **Agent Registry** | 10 | `/agents/all`, `/agents/:id`, `/agents/spawn` | Persona management, skill mapping. |
| **Workflow Lab** | 10 | `/workflows/edit`, `/workflows/run`, `/workflows/history` | DAG construction, execution tracing. |
| **System Health** | 5 | `/status`, `/metrics`, `/logs` | Latency tracking, resource usage. |
| **Admin/Settings** | 5 | `/settings/api`, `/settings/auth`, `/settings/theme` | Config management, theme switching. |

---

## Part 4: Final Technical Guardrails (ADR Summary)

- **Build Order**: `Rust` $\rightarrow$ `TS` $\rightarrow$ `Python`. Any failure in Rust blocks the rest.
- **API Protocol**: REST for the dashboard $\rightarrow$ FastAPI $\rightarrow$ Rust Kernel.
- **Memory**: SQLite FTS5 is the source of truth. PostgreSQL is an optional mirror for production.
- **UI State**: Every page must implement the **5-State Pattern**: `Loading` $\rightarrow$ `Empty` $\rightarrow$ `Ready` $\rightarrow$ `Error` $\rightarrow$ `Degraded`.