# Adversarial Architecture Review: OmniSwarm PROv1

## Executive Summary
The proposed OmniSwarm PROv1 architecture is a high-ambition "Agentic OS" that successfully decouples the **Control Plane** (Vercel Edge) from the **Compute Plane** (gVisor/Firecracker). The integration of Cerebras' hyper-velocity inference with a zero-knowledge persistence layer and a "Triptych" UI creates a compelling product vision.

However, the architecture currently suffers from **"The Orchestration Gap"**: while the UI and the Sandbox are well-defined, the actual DAG execution logic in the `OmniOrchestrator` is too linear. It lacks a robust state-machine for handling asynchronous compute callbacks, leading to potential deadlocks or "zombie" sandbox instances. Additionally, the Zero-Knowledge (ZK) claim is fragile; if the `MasterKey` is derived solely from a password without a server-side salt/pepper, it is vulnerable to offline rainbow table attacks.

**Overall Assessment:** **Request Changes**. The vision is production-grade, but the orchestration state-machine and the ZK key-derivation must be hardened before merge.

---

## 🔴 Blocking Issues (Must Fix)

### 1. Orchestration Deadlock & State Race
**Location:** `lib/core/orchestrator.ts` (The `while(true)` loop)
**Issue:** The orchestrator uses a polling loop (`await new Promise(res => setTimeout(res, 1000))`) to wait for async compute nodes. In a high-concurrency environment, this creates a race condition between the Colab Bridge webhook and the Edge polling loop. If the webhook updates Redis *after* the poll but *before* the next cycle, latency spikes. More critically, if a compute node fails without updating its status to `failed`, the swarm deadlocks indefinitely.
**Fix:** Replace polling with an **Event-Driven Architecture**.
- Implement a Redis Pub/Sub or Upstash Workflow.
- The `Colab Bridge` should publish a `node_completed` event.
- The `OmniOrchestrator` should be a stateless function triggered by these events, rather than a long-running loop on the Edge (which will hit Vercel's execution limits).

### 2. ZK Key Derivation Vulnerability
**Location:** `data-architecture` (Encryption Flow)
**Issue:** The spec states: `User password → Argon2id → MasterKey`. If the salt is client-side or static, an attacker with a DB leak can brute-force the `MasterKey` offline.
**Fix:** Implement **Server-Assisted Key Derivation**.
- The server must provide a unique, random `user_salt` upon authentication.
- `MasterKey = Argon2id(password, user_salt + server_pepper)`.
- This ensures that even with a DB leak, the attacker cannot derive the `MasterKey` without the `server_pepper` (stored in a secure KMS/Env var).

### 3. Sandbox Resource Exhaustion (DoS)
**Location:** `lib/core/security/sandbox.ts`
**Issue:** The `SandboxManager` uses `exec` to call `runsc`. There is no limit on the number of concurrent sandboxes per user. A malicious user could trigger 100 parallel "compute" nodes, exhausting the host's PID limit or memory, crashing the Compute Plane.
**Fix:** Implement a **Semaphore/Queue** at the `SandboxManager` level.
- Use a Redis-backed counter to limit concurrent sandboxes per `user_id` (e.g., max 3).
- Implement a `PriorityQueue` for compute tasks.

---

## 🟡 High-Priority Improvements

### 1. The "Tombstone" API is a Mock
**Location:** `app/api/delete-data/route.ts`
**Issue:** The current implementation returns a string but doesn't execute a hard delete. For DPDP/GDPR compliance, "Right to Erasure" must be a physical deletion of the `users` and `run_events` rows.
**Suggestion:** Implement a `HardDeleteService` that performs a cascading delete and writes a signed, immutable receipt to the `audit_log` before returning the tombstone.

### 2. Fragile Web-Search Provenance
**Location:** `lib/core/tools.ts`
**Issue:** The `web_search` tool returns a mock string. In production, LLMs often "hallucinate" citations if the provenance is just a string.
**Suggestion:** Use **Structured Citations**. The tool should return an array of `Source` objects. The `Synthesizer` must be prompted to use `[[1]]` style markers that map directly to the `Provenance` array in the final JSON artifact.

### 3. Edge Runtime Timeout
**Location:** `app/api/swarm/route.ts`
**Issue:** Vercel Edge functions have a strict execution limit. A complex swarm with 10+ nodes and a "Critic Loop" will likely time out before the final synthesis is complete.
**Suggestion:** Shift the `OmniOrchestrator` to a **Background Job** (e.g., Inngest or Upstash Workflow). The API route should return a `run_id` immediately, and the UI should listen via SSE/WebSockets for state updates.

---

## 🟢 Positive Patterns Noted

- **Twin-Engine Decoupling**: The separation of the "Fast-Path" (Cerebras) and "Slow-Path" (Sandbox) is an elite architectural move. It prevents the UI from freezing during heavy compute.
- **Obsidian Glass Design System**: The use of `OKLCH` and `backdrop-blur` creates a high-end, professional aesthetic that moves the product from "tool" to "experience."
- **SSRF Guard**: The "DNS-first" validation (Resolve $\rightarrow$ Validate $\rightarrow$ Connect) is the industry gold standard for preventing DNS rebinding attacks.
- **Triptych Layout**: The IA is logically sound; separating the Nexus, Forge, and Telemetry Wing reduces cognitive load for the user.

---

## 🛠️ Final Merge Recommendation

**Status: 🛑 BLOCK**

**Reasoning:** The architecture is 90% there, but the **Orchestration Loop** and **ZK Key Derivation** are critical security and stability holes. Merging now would result in a system that deadlocks under load and fails a professional security audit.

**Required Changes for Approval:**
1. [ ] Replace `while(true)` polling in `orchestrator.ts` with an event-driven trigger.
2. [ ] Update the ZK flow to include a server-side salt/pepper for `MasterKey` derivation.
3. [ ] Add a concurrency limit (Semaphore) to the `SandboxManager`.
4. [ ] Transition the `/swarm` route from a synchronous request to an asynchronous job pattern.