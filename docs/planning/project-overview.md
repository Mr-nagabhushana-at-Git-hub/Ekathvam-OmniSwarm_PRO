# Project Overview — Ekathvam-OmniSwarm (OmniSwarm by Ekathvam) — a dual/"Twin Engine" multi-agent orchestrator

## What we are building
Ekathvam-OmniSwarm is a dual-architecture ("Twin Engine") multi-agent orchestrator built on Gemma 4 31B inference served through the Cerebras Cloud API. Engine A is a production Next.js/React/Tailwind web app deployed on Vercel with an Edge serverless backend (app/api/swarm/route.ts). Engine B is a self-contained Google Colab notebook with a Gradio UI that any judge can run by pasting their own provider key. Both engines run the identical orchestration pipeline — Plan → Research (tool-augmented) → Parallel role-specialized swarm → Synthesize → Critic⇄Refiner loop → VM/sandbox code-extract — and expose a live latency HUD (Time-to-First-Token + output tokens/sec) with a side-by-side Cerebras-vs-GPU comparison. The product is engineered to satisfy all three Gemma 4 hackathon tracks simultaneously: Multiverse Agents (real multi-agent + multimodal coordination), Enterprise Impact (secure, scalable, deployable), and People's Choice (a visually compelling, shareable demo). A standout differentiator is the privacy layer: keys are never stored server-side; a dual-encrypted TEE / defence-in-depth model plus a one-click "Delete My Data" flow operationalize 'no-store / no-sell / no-train' in line with India's data-protection rules.

## Why
Enterprises and developers want agentic AI that is fast, multimodal, and trustworthy, but today's offerings force three bad trade-offs: (1) Latency — chained multi-agent pipelines are unusably slow on GPU inference, so interactive 'swarm' UX is impractical. (2) Trust — using hosted LLMs means pasting keys into backends that may log, store, or train on user data, which is a non-starter for regulated enterprises and now conflicts with India's data-protection rules. (3) Reproducibility — most agent demos are unverifiable black boxes that judges cannot independently run. Ekathvam-OmniSwarm solves all three: Cerebras delivers 300+ tok/s so a 4–5 node swarm completes in seconds; a no-backend-storage key model plus a TEE/defence-in-depth privacy layer guarantees data never persists or leaks to provider training; and a paste-your-own-key Colab notebook makes the entire pipeline independently reproducible by any judge in minutes.

## Who it is for
- **Technical / AI-Engineer Judge**: Downloads the Colab notebook, pastes their own Cerebras key, and verifies the swarm runs reproducibly. Cares about real multi-agent coordination, tool use, code quality, and the measured speed advantage.
- **Product Judge / VC**: Evaluates the Vercel web app for polish, clarity of value, multimodal depth, and the privacy differentiator. Watches the 60s video and judges whether it feels like a real product.
- **Enterprise Judge / CISO-minded Reviewer**: Assesses production readiness, scalability, security architecture, and the no-store/no-sell/no-train guarantees against regulatory (India DPDP) expectations.
- **Enterprise End-User (Analyst/Operator)**: Runs real workloads — enterprise search, multimodal RAG, incident response, knowledge synthesis — and needs fast, trustworthy, auditable agent output.
- **Developer / Twitter-X Community**: Discovers the project organically, runs the Colab in minutes, and shares the speed + privacy story. Drives People's Choice impressions through authentic excitement.

## Top goals
- Ship a single orchestration core that runs identically across Engine A (Vercel/Next.js Edge) and Engine B (Colab/Gradio).
- Implement a real, dynamic multi-agent pipeline: Plan → Research(tools) → Parallel swarm(2–5 role-specialized nodes) → Synthesize → Critic⇄Refiner loop → code-extract/run.
- Build the structured skill-agents-mapped worker 100% from scratch (no agent framework dependency): typed skill registry, role→skill binding, deterministic dispatch.
- Demonstrate a measurable Cerebras speed advantage with a live TTFT + tokens/sec HUD and a side-by-side latency comparison against a GPU-based provider.
- Use Gemma 4 31B multimodally and meaningfully across text, images, and video inputs.

## Key decisions (from kickoff)
- Key is never persisted server-side: hold it in a React context + sessionStorage (not localStorage), inject it per-request as a custom header to app/api/swarm/route.ts which forwards to Cerebras and never logs it — and show a visible "Key lives in this tab only · cleared on close" badge plus a one-click "Delete my data" that wipes sessionStorage, IndexedDB, and aborts in-flight fetches.
- Stream the whole swarm over the Edge route as SSE/ReadableStream and drive the UI off a single useReducer event store (events: token, node_start, node_done, tool_call, critic_round) — never poll; this is what makes the Plan→Research→parallel-swarm→Critic⇄Refiner pipeline render live and is the demo's wow factor.
- Build the swarm as a live React Flow (or custom SVG) DAG where each role node (analyst/risk/strategist/builder) lights up as its tokens stream and edges animate on handoff — the planner's dynamic 2–5 node choice should visibly add nodes to the canvas at runtime, since "watch the swarm assemble itself" is the 60-second video's hook.
- Make the Cerebras-vs-GPU latency race a first-class component: two synchronized columns firing the same prompt, each showing a live TTFT readout and a tokens/sec gauge climbing past 300 — animate it so the Cerebras side finishes while the GPU side is still streaming, because that single shot wins Speed-in-Action across all three tracks.
- Keep multimodal input dead simple — a drag-drop dropzone that base64-encodes images/video frames client-side and attaches them to the swarm request (never uploads to our storage), with a model/provider switcher and a key-status pill in a persistent top bar so judges can paste, verify, and run without ever leaving the page.
- Single shared orchestration contract: define the swarm pipeline (Plan→Research→parallel roles→Synthesize→Critic⇄Refiner→code-extract) as one provider-agnostic JSON state schema so Engine A (TS Edge) and Engine B (Colab Python) are behaviorally identical — judges who diff the two must see the same graph, not two reimplementations that drift.
- BYO-key must be a stateless pass-through, not a stored secret: the key lives only in the browser, is sent per-request over TLS to app/api/swarm, held in a request-scoped variable, never written to logs/KV/env/Vercel storage — add a visible "0 bytes persisted" assertion and a request that returns the in-memory key set as empty to prove it.
- Be honest about the "TEE": a Vercel serverless/edge function is NOT a hardware TEE — don't claim one. Ship what's actually defensible: client-side WebCrypto envelope-encryption of prompts+key, ephemeral in-memory-only processing, no-retention headers, and a real "Delete Everything" that wipes localStorage/IndexedDB + sends provider-side delete calls; frame it as zero-retention + defence-in-depth, not fake attestation.

## Existing codebase
`C:\AGENT\references-INITIAL-info,code,details` — 
Stack observed: 

## Definition of done
- Judges paste their own key into the Colab notebook and the full multi-agent pipeline runs reproducibly end-to-end.
- Live HUD shows Cerebras at 300+ tok/s with a clear, fair side-by-side latency win over a GPU provider.
- Gemma 4 31B is used meaningfully across text, images, and video in at least one demo scenario.
- Code-level audit confirms zero server-side storage of keys, prompts, outputs, or media.
- 'Delete My Data' returns a verifiable confirmation and post-check shows zero retained user data.
- The Vercel app reads as a production-ready, secure, scalable enterprise product.
- ≤60s demo video clearly shows swarm coordination + Cerebras speed + side-by-side comparison with no sensitive info visible.
- Strong organic Twitter/X impressions and engagement (no paid promotion).
- Product credibly satisfies all three tracks: Multiverse Agents, Enterprise Impact, and People's Choice.