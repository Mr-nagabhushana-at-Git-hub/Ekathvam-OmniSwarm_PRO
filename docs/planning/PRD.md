# Product Requirements Document — Ekathvam-OmniSwarm (OmniSwarm by Ekathvam) — a dual/"Twin Engine" multi-agent orchestrator

> Authored by the ORCMEGA CEO engine. Source: existing codebase at `C:\AGENT\references-INITIAL-info,code,details`.

## 1. Overview
Ekathvam-OmniSwarm is a dual-architecture ("Twin Engine") multi-agent orchestrator built on Gemma 4 31B inference served through the Cerebras Cloud API. Engine A is a production Next.js/React/Tailwind web app deployed on Vercel with an Edge serverless backend (app/api/swarm/route.ts). Engine B is a self-contained Google Colab notebook with a Gradio UI that any judge can run by pasting their own provider key. Both engines run the identical orchestration pipeline — Plan → Research (tool-augmented) → Parallel role-specialized swarm → Synthesize → Critic⇄Refiner loop → VM/sandbox code-extract — and expose a live latency HUD (Time-to-First-Token + output tokens/sec) with a side-by-side Cerebras-vs-GPU comparison. The product is engineered to satisfy all three Gemma 4 hackathon tracks simultaneously: Multiverse Agents (real multi-agent + multimodal coordination), Enterprise Impact (secure, scalable, deployable), and People's Choice (a visually compelling, shareable demo). A standout differentiator is the privacy layer: keys are never stored server-side; a dual-encrypted TEE / defence-in-depth model plus a one-click "Delete My Data" flow operationalize 'no-store / no-sell / no-train' in line with India's data-protection rules.

## 2. Problem
Enterprises and developers want agentic AI that is fast, multimodal, and trustworthy, but today's offerings force three bad trade-offs: (1) Latency — chained multi-agent pipelines are unusably slow on GPU inference, so interactive 'swarm' UX is impractical. (2) Trust — using hosted LLMs means pasting keys into backends that may log, store, or train on user data, which is a non-starter for regulated enterprises and now conflicts with India's data-protection rules. (3) Reproducibility — most agent demos are unverifiable black boxes that judges cannot independently run. Ekathvam-OmniSwarm solves all three: Cerebras delivers 300+ tok/s so a 4–5 node swarm completes in seconds; a no-backend-storage key model plus a TEE/defence-in-depth privacy layer guarantees data never persists or leaks to provider training; and a paste-your-own-key Colab notebook makes the entire pipeline independently reproducible by any judge in minutes.

## 3. Goals
- Ship a single orchestration core that runs identically across Engine A (Vercel/Next.js Edge) and Engine B (Colab/Gradio).
- Implement a real, dynamic multi-agent pipeline: Plan → Research(tools) → Parallel swarm(2–5 role-specialized nodes) → Synthesize → Critic⇄Refiner loop → code-extract/run.
- Build the structured skill-agents-mapped worker 100% from scratch (no agent framework dependency): typed skill registry, role→skill binding, deterministic dispatch.
- Demonstrate a measurable Cerebras speed advantage with a live TTFT + tokens/sec HUD and a side-by-side latency comparison against a GPU-based provider.
- Use Gemma 4 31B multimodally and meaningfully across text, images, and video inputs.
- Enforce zero backend key/data storage: user pastes their own key in the UI; provide a dual-encrypted TEE + defence-in-depth model and a working 'Delete My Data' flow.
- Make the Colab notebook reproducible end-to-end so technical judges paste a key and watch the swarm run.
- Produce a ≤60s demo video showing swarm coordination, Cerebras speed, and the side-by-side latency win — with no sensitive on-screen info.
- Drive organic Twitter/X impressions through a compelling, authentic showcase (no paid promotion).

## 4. Non-Goals
- Building or storing a hosted user-account/auth system that retains personal data (conflicts with the no-store privacy stance).
- Persisting provider API keys or user prompts/outputs in any server database or log sink.
- Shipping a generic agent framework or competing with LangChain/CrewAI as a library — the worker is purpose-built.
- Fine-tuning or hosting Gemma 4 31B weights ourselves; inference is via Cerebras Cloud API only.
- Paid social amplification or any non-organic reach tactics.
- Native mobile apps or offline/on-device inference.
- A formal hardware-attested TEE (e.g., SGX/SEV) certification — we implement a software TEE-equivalent (ephemeral, encrypted, zero-retention) and clearly label it as such.
- Creating redundant README/feature-update markdown files in the main build folder.

## 5. Users & Personas
- **Technical / AI-Engineer Judge**: Downloads the Colab notebook, pastes their own Cerebras key, and verifies the swarm runs reproducibly. Cares about real multi-agent coordination, tool use, code quality, and the measured speed advantage.
- **Product Judge / VC**: Evaluates the Vercel web app for polish, clarity of value, multimodal depth, and the privacy differentiator. Watches the 60s video and judges whether it feels like a real product.
- **Enterprise Judge / CISO-minded Reviewer**: Assesses production readiness, scalability, security architecture, and the no-store/no-sell/no-train guarantees against regulatory (India DPDP) expectations.
- **Enterprise End-User (Analyst/Operator)**: Runs real workloads — enterprise search, multimodal RAG, incident response, knowledge synthesis — and needs fast, trustworthy, auditable agent output.
- **Developer / Twitter-X Community**: Discovers the project organically, runs the Colab in minutes, and shares the speed + privacy story. Drives People's Choice impressions through authentic excitement.

## 6. Core Features

### Twin-Engine Orchestration Core
A single provider-agnostic orchestration pipeline (UniversalLLM abstraction) shared in behavior across Engine A (TypeScript, Vercel Edge) and Engine B (Python, Colab). Stages: Plan → Research(tools) → Parallel swarm → Synthesize → Critic⇄Refiner → code-extract.
**Acceptance criteria:**
- [ ] The same input produces structurally equivalent stage outputs in both engines.
- [ ] Each stage emits a streamed telemetry event (stage name, node id, tokens, ms).
- [ ] A failed node is isolated and the run continues with remaining nodes.
- [ ] Pipeline completes a 4-node run end-to-end in under 15s on Cerebras for a standard prompt.

### Dynamic Role-Specialized Swarm
The planner inspects the task and selects 2–5 worker nodes, each bound to a role (analyst / risk / strategist / builder). Nodes run in parallel, then a synthesizer merges their outputs.
**Acceptance criteria:**
- [ ] Planner returns a JSON plan specifying node count (2–5) and per-node role + subtask.
- [ ] Nodes execute concurrently (Promise.all in TS / asyncio.gather in Python).
- [ ] Synthesizer output cites which node contributed which insight.
- [ ] Worker count visibly changes across tasks of differing complexity.

### Structured Skill-Agents-Mapped Worker (from scratch)
A hand-built worker with a typed skill registry, explicit role→skill bindings, and deterministic dispatch — no external agent framework. Each skill is a pure function/tool returning text so it is provider-agnostic.
**Acceptance criteria:**
- [ ] Skill registry lists every skill with name, input schema, and handler.
- [ ] Each role declares which skills it may invoke; dispatch rejects unauthorized skill calls.
- [ ] Adding a new skill requires only registering it (no orchestrator edits).
- [ ] Worker passes unit tests for dispatch, authorization, and error isolation.

### Tool-Augmented Researcher
A Researcher node that can call real tools: live web search (DuckDuckGo, no key), run-python (sandbox/VM), and a system-diagnostic tool. Tool results are fed back into the swarm.
**Acceptance criteria:**
- [ ] Web search returns live results and they are quoted in downstream synthesis.
- [ ] run-python executes extracted code in an isolated sandbox and returns stdout/stderr.
- [ ] Tools can be toggled on/off from the UI.
- [ ] A tool failure degrades gracefully without aborting the run.

### Multimodal Gemma 4 31B Intelligence
Meaningful multimodal use: text reasoning, image understanding (e.g., diagram/screenshot/chart analysis), and video understanding (keyframe/transcript-based reasoning) routed through Gemma 4 31B.
**Acceptance criteria:**
- [ ] User can upload an image and the swarm reasons over its content in the output.
- [ ] User can supply a video (or frames) and the swarm produces a grounded summary/analysis.
- [ ] Multimodal inputs are encoded per the Cerebras/Gemma request format and validated.
- [ ] A demo scenario exercises text+image+video in one run.

### Cerebras Speed HUD + Side-by-Side Comparison
A live latency counter showing Time-to-First-Token and output tokens/sec (target 300+), plus a one-click side-by-side benchmark running the same prompt on Cerebras vs a GPU provider.
**Acceptance criteria:**
- [ ] TTFT and tok/s update live during streaming.
- [ ] Side-by-side view shows both providers' TTFT and tok/s with a clear speedup ratio.
- [ ] Benchmark uses identical prompt/params for both providers.
- [ ] tok/s for Cerebras is demonstrably higher and rendered prominently for the demo.

### Critic ⇄ Refiner Loop
After synthesis, a Critic node scores the draft against the task and a Refiner revises it. Loop depth is user-configurable.
**Acceptance criteria:**
- [ ] Critic returns structured findings (issues + severity).
- [ ] Refiner produces an improved draft addressing each finding.
- [ ] Refinement depth control (e.g., 0–3) is honored.
- [ ] Loop terminates on convergence or max depth.

### Bring-Your-Own-Key, Zero Backend Storage
User fetches their own Cerebras/provider key and pastes it in the UI. The key is used only for the in-flight request and is never written to any server store or log.
**Acceptance criteria:**
- [ ] Key is held in memory/ephemeral request scope only; never persisted server-side.
- [ ] No log line, DB row, or analytics event contains the key or full prompt/output.
- [ ] Web engine forwards the key per-request from client to Edge function without storage.
- [ ] A code-level audit confirms zero key/data persistence paths.

### Dual-Encrypted TEE + Defence-in-Depth Privacy Layer
A software TEE-equivalent: client-side encryption of sensitive payload fields, in-transit TLS, ephemeral zero-retention processing, strict CSP/headers, and provider request flags requesting no-train/no-retain where supported. Clearly labeled as a software (not hardware-attested) TEE.
**Acceptance criteria:**
- [ ] Sensitive fields are encrypted client-side before leaving the browser where applicable.
- [ ] Edge function runs stateless with no persistence and scrubs payloads after response.
- [ ] Security headers (CSP, HSTS, no-store cache, referrer-policy) are enforced.
- [ ] Request includes provider flags to opt out of retention/training where the API supports it; behavior is documented honestly when it does not.

### Delete My Data
A one-click action that purges any client-side state (localStorage/session/cache/uploaded media) and issues delete signals for any transient artifacts, returning a verifiable confirmation.
**Acceptance criteria:**
- [ ] Clicking 'Delete My Data' clears all client storage and in-memory state.
- [ ] Any transient server-side artifact (e.g., temp upload) is deleted and confirmed.
- [ ] User receives an explicit, timestamped confirmation of deletion.
- [ ] Post-deletion, a status check shows zero retained user data.

### Reproducible Colab Notebook (Engine B)
A self-contained Colab notebook that installs deps, launches the Gradio UI, accepts a pasted key, and runs the full swarm — verified working in Colab.
**Acceptance criteria:**
- [ ] Fresh Colab runtime installs all deps and launches Gradio without manual fixes.
- [ ] Pasting a valid key and submitting a task runs the full pipeline to completion.
- [ ] The same telemetry/HUD (TTFT, tok/s) is shown in Gradio.
- [ ] Notebook contains no embedded secrets.

## 7. User Flows
- Technical judge (Engine B): Open Colab → Run All → paste Cerebras key → enter task (optionally attach image/video) → watch Plan/Research/Swarm/Synthesize/Critic stages stream with live TTFT + tok/s → read final synthesized output + extracted/executed code.
- Product judge (Engine A): Open Vercel app → paste key → enter prompt → see swarm graph animate per node → view side-by-side Cerebras vs GPU latency → review multimodal result.
- Enterprise reviewer: Run an enterprise scenario (multimodal RAG / incident triage) → inspect privacy panel (no-store, TEE, request flags) → click 'Delete My Data' → receive deletion confirmation.
- Speed comparison: Click 'Compare' → identical prompt dispatched to Cerebras and a GPU provider → side-by-side TTFT/tok/s with speedup ratio rendered for screen capture.
- Multimodal run: Upload image + short video + text question → swarm reasons across all modalities → grounded answer cites visual evidence.
- Developer/community: Click shared link → open Colab → run in minutes → capture the speed HUD → repost organically on X.
- Resilience path: A worker node or tool fails → run continues with remaining nodes → UI flags the degraded node without aborting.

## 8. Tech Stack
- Engine A frontend: Next.js (App Router) + React + TypeScript + Tailwind CSS on Vercel
- Engine A backend: Vercel Edge/Serverless Function (Node.js/TypeScript) at app/api/swarm/route.ts with streaming responses
- Engine B: Python in Google Colab + Gradio UI (supreme_omni_orchestrator.py / super_adaptive_agent_architecture.py, UniversalLLM classes)
- Model: Gemma 4 31B (gemma-4-31b)
- Inference: Cerebras Cloud API (direct calls from both engines), plus a GPU provider for comparison
- Provider adapters: openai, anthropic, groq, google-genai (provider-agnostic UniversalLLM)
- Python libs: httpx, nest_asyncio, duckduckgo-search, asyncio
- Tools: DuckDuckGo web search, sandboxed run-python (Colab VM / isolated process), system-diagnostic
- Security: client-side WebCrypto encryption, TLS, strict CSP/security headers, stateless Edge runtime
- License: AGPLv3

## 9. Success Criteria
- Judges paste their own key into the Colab notebook and the full multi-agent pipeline runs reproducibly end-to-end.
- Live HUD shows Cerebras at 300+ tok/s with a clear, fair side-by-side latency win over a GPU provider.
- Gemma 4 31B is used meaningfully across text, images, and video in at least one demo scenario.
- Code-level audit confirms zero server-side storage of keys, prompts, outputs, or media.
- 'Delete My Data' returns a verifiable confirmation and post-check shows zero retained user data.
- The Vercel app reads as a production-ready, secure, scalable enterprise product.
- ≤60s demo video clearly shows swarm coordination + Cerebras speed + side-by-side comparison with no sensitive info visible.
- Strong organic Twitter/X impressions and engagement (no paid promotion).
- Product credibly satisfies all three tracks: Multiverse Agents, Enterprise Impact, and People's Choice.

## 10. Constraints
API key must NOT be stored in the backend — user fetches and pastes it in the UI; do not store, sell, or allow provider training on user data (align with new Indian govt data rules) — enforce via dual-encrypted TEE + defence-in-depth + delete-my-data; product must support all 3 hackathon tracks; demo video max 60s, must show Cerebras speed and a side-by-side GPU comparison, with no sensitive info (notifications, tabs, keys, emails, credentials) visible; People's Choice reach must be organic only (no paid promotion); avoid creating README.md / feature-update / redundant .md files in the main coding folder (save tokens) — focus on deep research + engineered implementation; ORCMEGA plans in C:\AGENT\ORCMEGA-plan,info,docs and creates a new folder for the actual build; references live in C:\AG

## 11. Risks
- Cerebras/Gemma 4 31B API access, rate limits, or model availability could block the speed demo — mitigate with provider-agnostic adapters and graceful backoff.
- GPU-provider comparison could be seen as unfair (different params) — mitigate by enforcing identical prompt/params and disclosing methodology.
- Multimodal video support may be limited by the API's input format — mitigate with keyframe/transcript-based handling and a clearly defined supported path.
- 'Software TEE' could be misread as hardware-attested — mitigate by labeling it a software TEE-equivalent and stating honestly what providers do/don't guarantee on retention/training.
- BYO-key zero-storage UX may confuse some judges — mitigate with clear in-UI guidance on fetching and pasting a key.
- Maintaining behavioral parity across two engines (TS + Python) risks drift — mitigate with shared schemas, golden-output tests, and a single spec for the pipeline.
- Sandboxed run-python is a security surface — mitigate with strict isolation, resource/time limits, and no host access.
- Organic-only reach is unpredictable for People's Choice — mitigate with a high-quality, genuinely novel demo and reproducible Colab that invites sharing.
- 60s video constraint risks omitting key features — mitigate with a tight script prioritizing swarm + speed + side-by-side.
