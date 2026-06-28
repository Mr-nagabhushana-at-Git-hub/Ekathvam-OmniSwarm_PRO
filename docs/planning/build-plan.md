# Build Plan — Ekathvam-OmniSwarm (OmniSwarm by Ekathvam) — a dual/"Twin Engine" multi-agent orchestrator

## Methodology
Agile, short iterations. Each milestone = one sprint: plan → build → review → test → demo. The build runs autonomously between the two human gates (final review, final UI test).

## Milestones
1. M0 — Repo + Twin-Engine scaffolding: Next.js/Vercel app skeleton + Colab notebook shell with UniversalLLM abstraction and Cerebras adapter.
2. M1 — Orchestration core: Plan → Research → Parallel swarm → Synthesize → Critic⇄Refiner implemented in both engines with shared behavior.
3. M2 — Structured skill-agents-mapped worker from scratch: typed skill registry, role→skill authorization, deterministic dispatch + unit tests.
4. M3 — Tools + multimodal: DuckDuckGo search, sandboxed run-python, diagnostics; Gemma 4 31B text+image+video paths wired and validated.
5. M4 — Speed HUD + side-by-side benchmark: live TTFT/tok/s and Cerebras-vs-GPU comparison in both engines.
6. M5 — Privacy layer: BYO-key zero-storage, dual-encrypted TEE-equivalent, security headers, and 'Delete My Data' with verifiable confirmation.
7. M6 — Polish + reproducibility: enterprise demo scenarios, UI polish, Colab verified working end-to-end with pasted key.
8. M7 — Demo + launch: ≤60s demo video (speed + side-by-side, no sensitive info), AGPLv3 license, organic X launch thread.

## Department workstreams

### Product
- [ ] Write the PRD for the Twin-Engine value proposition — define when users pick Engine A (Vercel/Next.js web) vs Engine B (Colab/Gradio PoC) and the side-by-side comparison UX
- [ ] Define acceptance criteria for the Cerebras Speed HUD: which latency/throughput/token metrics are surfaced and how Cerebras-vs-baseline comparison is scored
- [ ] Specify the Bring-Your-Own-Key onboarding flow and provider matrix (Cerebras, Gemini/google-genai, OpenAI, Anthropic, Groq) including key validation and fallback behavior
- [ ] Author user stories for the Critic ⇄ Refiner loop — define iteration caps, stop conditions, and what the user sees at each refinement pass
- [ ] Define the 'Delete My Data' + Zero Backend Storage product guarantee and the user-facing privacy promise tied to the TEE / Defence-in-Depth layer
- [ ] Prioritize the v1 feature set and cut line; map each feature to Engine A, Engine B, or both

### Design
- [ ] Design the Side-by-Side Comparison view (Engine A vs Engine B / Cerebras vs baseline) with synchronized streaming output panels
- [ ] Design the Cerebras Speed HUD — real-time tokens/sec, time-to-first-token, and cost overlays in the Tailwind UI
- [ ] Create the Dynamic Role-Specialized Swarm visualization showing live agent roles, hand-offs, and the Critic⇄Refiner loop state
- [ ] Design the Bring-Your-Own-Key settings panel with clear per-provider key entry, masked storage indicators, and 'keys never leave your browser' messaging
- [ ] Produce the multimodal input UX for Gemma 4 31B (text + image upload) and the Tool-Augmented Researcher results presentation
- [ ] Deliver responsive layouts, dark-mode tokens, and a Gradio UI style pass so Engine B visually mirrors Engine A

### Engineering
- [ ] Build the Vercel Edge Serverless backend app/api/swarm/route.ts in Node.js/TypeScript as the Engine A orchestration core
- [ ] Implement the Twin-Engine Orchestration Core and a shared UniversalLLM abstraction wrapping Cerebras, google-genai, openai, anthropic, and groq
- [ ] Implement the Dynamic Role-Specialized Swarm + the from-scratch Skill-Agents-Mapped Worker with the Critic ⇄ Refiner loop
- [ ] Build the Tool-Augmented Researcher using duckduckgo-search with tool-call routing and result injection back into the swarm
- [ ] Wire the Cerebras Cloud API streaming path (httpx/openai client) feeding the Speed HUD metrics, plus the side-by-side comparison runner
- [ ] Port/maintain the Engine B Colab PoC (supreme_omni_orchestrator.py / super_adaptive_agent_architecture.py) with nest_asyncio + Gradio so it reproduces Engine A behavior

### Testing
- [ ] Write unit tests for the UniversalLLM provider adapters (Cerebras, Gemini, OpenAI, Anthropic, Groq) covering auth, streaming, and error mapping
- [ ] Add integration tests for the Critic⇄Refiner loop — verify convergence, iteration caps, and graceful stop on non-improvement
- [ ] Build E2E tests for the BYOK flow: invalid key handling, key never persisted server-side, and provider fallback
- [ ] Create a load/latency test harness validating Cerebras Speed HUD metrics and the side-by-side comparison accuracy
- [ ] Verify the Reproducible Colab Notebook (Engine B) runs end-to-end cleanly and produces output matching Engine A on a fixed prompt set
- [ ] Add multimodal regression tests for Gemma 4 31B text+image inputs

### Devops
- [ ] Configure Vercel deployment for the Next.js app with Edge Function runtime limits, timeouts, and region settings for app/api/swarm/route.ts
- [ ] Set up CI (lint, typecheck, test, build) gating PRs for both the web app and the Python PoC
- [ ] Manage secret/key handling so BYOK keys are runtime-only — confirm no provider keys are stored in env, logs, or Vercel storage
- [ ] Package the reproducible Colab notebook with pinned requirements (httpx, nest_asyncio, google-genai, openai, anthropic, groq, duckduckgo-search) and a one-click launch path
- [ ] Add observability for Cerebras API calls — latency, error rates, and rate-limit handling dashboards without logging payloads
- [ ] Implement the Zero Backend Storage posture in infra: stateless functions, no DB, ephemeral memory only

### Security
- [ ] Threat-model the Twin-Engine flow and document the Dual-Encrypted TEE + Defence-in-Depth privacy layer guarantees and trust boundaries
- [ ] Audit the BYOK path to ensure provider keys are never logged, cached, persisted, or sent to any backend store (enforce client-held / runtime-only)
- [ ] Implement and verify 'Delete My Data' + Zero Backend Storage — prove no residual user data after session end
- [ ] Add input sanitization and prompt-injection defenses for the Tool-Augmented Researcher (duckduckgo-search results re-entering the swarm)
- [ ] Review outbound calls to Cerebras and all LLM providers for TLS, SSRF protection, and egress allowlisting from the Edge Function
- [ ] Ensure AGPLv3 compliance review for all bundled dependencies and the network-use source-availability obligation

### Documentation
- [ ] Write the README covering Twin-Engine architecture, Engine A (Vercel) vs Engine B (Colab) setup, and the AGPLv3 license notice
- [ ] Document the BYOK setup guide per provider (Cerebras, Gemini, OpenAI, Anthropic, Groq) with key acquisition and validation steps
- [ ] Author the reproducible Colab notebook walkthrough for supreme_omni_orchestrator.py / super_adaptive_agent_architecture.py
- [ ] Write the privacy & security docs: TEE + Defence-in-Depth model, Zero Backend Storage, and the Delete My Data process
- [ ] Produce API/architecture docs for app/api/swarm/route.ts, the UniversalLLM classes, and the Critic⇄Refiner loop
- [ ] Create a user guide for the Speed HUD and Side-by-Side Comparison features

## Sequencing decisions
- Make the Cerebras-vs-GPU latency race a first-class component: two synchronized columns firing the same prompt, each showing a live TTFT readout and a tokens/sec gauge climbing past 300 — animate it so the Cerebras side finishes while the GPU side is still streaming, because that single shot wins Speed-in-Action across all three tracks.
- Measure latency client-side from the actual token stream (TTFT = first SSE chunk, tok/s = output tokens ÷ wall time) and run Cerebras vs a GPU provider on the same prompt concurrently for a true side-by-side — never hardcode "300+ tok/s"; show the live counter so the 60s demo proves it.

## Deployment — Vercel
- Deploy on **Vercel**. Frontend builds to the Vercel CDN/edge; backend logic runs as **Vercel Serverless / Edge Functions** under `api/` (no always-on server).
- Add `vercel.json` (routes, function runtimes, regions); set the framework preset + build/output settings in the project.
- All secrets via **Vercel Environment Variables** (Production/Preview/Development) — never committed. The user-supplied provider API key stays client-side / in-request, never persisted server-side (per the privacy model).
- Mind serverless limits: execution timeout, payload size, and cold starts — keep functions lean; stream long responses; offload heavy/stateful work.
- Every push → **Preview Deployment**; protected `main` → Production. Use Preview URLs for the demo.
