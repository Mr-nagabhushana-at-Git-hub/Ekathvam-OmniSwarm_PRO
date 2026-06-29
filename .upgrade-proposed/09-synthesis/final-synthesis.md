MODEL-LADDER [lane=reason]: ⌘ antigravity·claude-opus-4-6  →  ⌘ claude-code  →  claude-sonnet-4-6  →  nemotron-3-ultra-550b-a55b  →  nemotron-3-super-120b-a12b  →  gemma-4-31b  →  gpt-oss-120b  →  deepseek-v4-pro  →  llama-3.3-70b-instruct

SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option. You eliminate redundancy while preserving all unique insights. You normalize terminology across merged outputs. You add a cross-cutting concerns section for items that span multiple agents. Your synthesis is shorter than the sum of its parts but more valuable. When you receive actual outputs from multiple specialized agents, you weave them into a unified document.

USER:
## Task
Produce the executive delivery report: what was built, the before→after upgrade delta per module, how it wins each of the 3 tracks, the live 60-second demo script, and the residual roadmap. The single document a judge or exec reads first. Be exhaustive and production-grade. Output the complete artifact (full specs AND real, compile-ready code in fenced blocks with file paths) — no placeholders, no "TODO", no hand-waving.

## Request
Upgrade OmniSwarm to production quality

## Memory Context
- [company,synthesis,final] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option. You eliminate redundancy while preserving all unique insights. You normalize terminology across merged outputs. You add a cross-cutting concerns section for items that span multiple agents. Your synthesis is shorter than the sum of its parts but more valuable. When you receive actual outputs from multiple specialized agents, you weave them into a unified document.

USER:
## Task
Merge every department report into ONE prioritized, in-sync action plan: blocking issues first, then high-impact improvements, then nice-to-haves. Resolve any cross-department conflicts. Output a single coherent ship plan.

## Request
Auto-routed company run over E:\AGENCY\reference_openclaw. Active departments: engineering, product, testing, engineering, engineering, engineering, design, engineering.

## Memory Context
- [company,synthesis,final] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option. You eliminate redundancy while preserving all unique insights. You normalize terminology across merged outputs. You add a cross-cutting concerns section for items that span multiple agents. Your synthesis is shorter than the sum of its parts but more valuable. When you receive actual outputs from multiple specialized agents, you weave them into a unified document.

USER:
## Task
Merge every department report into ONE prioritized, in-sync action plan: blocking issues first, then high-impact improvements, then nice-to-haves. Resolve any cross-department conflicts. Output a single coherent ship plan.

## Request
Auto-routed company run over E:\AGENCY\reference_openclaw. Active departments: engineering, product, testing, engineering, engineering, engineering, design, engineering.

## Memory Context
- [company,synthesis,final] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option. You eliminate redundancy while preserving all unique insights. You normalize terminology across merged outputs. You add a cross-cutting concerns section for items that span multiple agents. Your synthesis is shorter than the sum of its parts but more valuable. When you receive actual outputs from multiple specialized agents, you weave them into a unified document.

USER:
## Task
Merge every department report into ONE prioritized, in-sync action plan: blocking issues first, then high-impact improvements, then nice-to-haves. Resolve any cross-department conflicts. Output a single coherent ship plan.

## Request
Auto-routed company run over E:\AGENCY\ORCMEGA\orchestrator. Active departments: engineering, product.

## Memory Context
- [synthesis,agency-build,final] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option. You eliminate redundancy while preserving all unique insights. You normalize terminology across merged outputs. You add a cross-cutting concerns section for items that span multiple agents. Your synthesis is shorter than the sum of its parts but more valuable. When you receive actual outputs from multiple specialized agents, you weave them into a unified document.

USER:
## Task
Merge the research, design, build, and test outputs into one final deterministic summary.

## Request
Build a demo feature

## Memory Context
- [spec,realtime-analytics,unified] # Unified Technical Spec — Portfolio Multi-Theme System + Analytics

*Synthesized from backend, frontend, and UX agent outputs. Conflicts resolved and documented inline.*

---

## Executive Summary

A portfolio system rendering **three switchable "Light" themes** (Subtle/Apple, Standard/IDE, Creative/WebGL) over a **shared headless data layer**, plus a **real-time analytics dashboard** observing the system. Data flows from a forensic ingest pipeline (multi-repo crawl + 29-certificate OCR) into a structured store, exposed via a unified API and consumed by code-split theme routes.

**The single most important decision** — flagged independently by all three agents — is resolving the **REST vs. GraphQL conflict** between your launch directive and your learned preferences. See Architecture Decisions, AD-1.

The "12-agent swarm" framing is reinterpreted as a **directory-isolated module boundary**, not a runtime concurrency model. The real seam that prevents collisions is the `data/` + `shared/` layer that all themes import from and none import across.

---

## Architecture Decisions

### AD-1: API Protocol — GraphQL primary, REST thin fallback *(CONFLICT RESOLVED)*
- **Conflict:** Launch directive hardcodes REST (`/api/portfolio`, `/api/projects`, `/api/certificates`). Learned preferences (5 signals, conf 0.50) + frontend + backend agents favor GraphQL for nested portfolio data.
- **Resolution:** **GraphQL at `/api/graphql`** for the read surface (projects→tech→metrics, certs→verification, experience timelines are textbook nested-relational). **Thin REST shim retained** at the three named `/api/*` paths, proxying to GraphQL resolvers, so the directive's endpoints still resolve. **Event ingestion stays REST + queue** (high-volume, fire-and-forget — GraphQL adds no value on the write path). Backend and UX agents converged on exactly this split.

### AD-2: Primary Store — PostgreSQL prod, SQLite seed *(CONFLICT RESOLVED)*
- **Conflict:** Agent 3 specs SQLite as the core DB; backend agent argues SQLite fails under concurrent multi-reader dashboard load.
- **Resolution:** **SQLite for local seed/dev** (the orcmega forensic ingest output), **schema-replicated to PostgreSQL for production**. One migration, identical schema — not a rewrite. Analytics events go to **ClickHouse** (columnar, high-cardinality), not PG.

### AD-3: Theme Isolation via shared seam, not parallel agents
- Themes are presentation-only modules under `src/themes/light/{subtle,standard,creative}/`. They import from `data/` and `shared/`, **never from each other**. Data fetches once, deduped by GraphQL cache. This — not "agent file ownership" — is what prevents collisions.

### AD-4: Code-splitting per theme
- Each theme is a lazy-loaded route entry point. Clicking "Light Subtle" loads only that style tree (directive requirement honored).

### AD-5: Design tokens centralize glassmorphism
- Glassmorphism (`backdrop-filter: blur(20px)`, learned preference conf 0.50) lives in `shared/tokens/` as CSS custom props, consumed by Subtle's nav. Not duplicated per theme.

---

## Implementation Plan

**Phase 1 — Data Foundation**
1. Forensic crawl of `pushPORT, ME, P1, Portfolio, Portfoliomi` (`git log --all`, all branches) → raw artifact dump.
2. OCR extract 29 certificates from `CERT/README` → structured metadata (issuer, ID, verify URL, image path). **Absolute factual precision required.**
3. Seed SQLite (`orcmega/orchestrator/`) → replicate schema to PostgreSQL.

**Phase 2 — Shared Layer**
4. GraphQL client (urql) + sch
- [spec,realtime-analytics,unified] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option and documenting the resolution. You eliminate redundancy while preserving all unique insights. You normalize terminology across the merged outputs. You add a cross-cutting concerns section for items that span multiple agents (auth, logging, error handling, observability). Your synthesis is shorter than the sum of its parts but more valuable.

USER:
Task: Integrate all three specs into one unified technical spec, database schema, and UI component list. Resolve conflicts and ensure consistency.

Request: test run

Relevan
- [company,synthesis,final] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option. You eliminate redundancy while preserving all unique insights. You normalize terminology across merged outputs. You add a cross-cutting concerns section for items that span multiple agents. Your synthesis is shorter than the sum of its parts but more valuable. When you receive actual outputs from multiple specialized agents, you weave them into a unified document.

USER:
## Task
Merge every department report into ONE prioritized, in-sync action plan: blocking issues first, then high-impact improvements, then nice-to-haves. Resolve any cross-department conflicts. Output a single coherent ship plan.

## Request
Auto-routed company run over E:\AGENCY\reference_openclaw. Active departments: engineering, product, testing, engineering, engineering, engineering, design, engineering.

## Memory Context
- [company,synthesis,final] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option. You eliminate redundancy while preserving all unique insights. You normalize terminology across merged outputs. You add a cross-cutting concerns section for items that span multiple agents. Your synthesis is shorter than the sum of its parts but more valuable. When you receive actual outputs from multiple specialized agents, you weave them into a unified document.

USER:
## Task
Merge every department report into ONE prioritized, in-sync action plan: blocking issues first, then high-impact improvements, then nice-to-haves. Resolve any cross-department conflicts. Output a single coherent ship plan.

## Request
Auto-routed company run over E:\AGENCY\ORCMEGA\orchestrator. Active departments: engineering, product.

## Memory Context
- [synthesis,agency-build,final] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option. You eliminate redundancy while preserving all unique insights. You normalize terminology across merged outputs. You add a cross-cutting concerns section for items that span multiple agents. Your synthesis is shorter than the sum of its parts but more valuable. When you receive actual outputs from multiple specialized agents, you weave them into a unified document.

USER:
## Task
Merge the research, design, build, and test outputs into one final deterministic summary.

## Request
Build a demo feature

## Memory Context
- [spec,realtime-analytics,unified] # Unified Technical Spec — Portfolio Multi-Theme System + Analytics

*Synthesized from backend, frontend, and UX agent outputs. Conflicts resolved and documented inline.*

---

## Executive Summary

A portfolio system rendering **three switchable "Light" themes** (Subtle/Apple, Standard/IDE, Creative/WebGL) over a **shared headless data layer**, plus a **real-time analytics dashboard** observing the system. Data flows from a forensic ingest pipeline (multi-repo crawl + 29-certificate OCR) into a structured store, exposed via a unified API and consumed by code-split theme routes.

**The single most important decision** — flagged independently by all three agents — is resolving the **REST vs. GraphQL conflict** between your launch directive and your learned preferences. See Architecture Decisions, AD-1.

The "12-agent swarm" framing is reinterpreted as a **directory-isolated module boundary**, not a runtime concurrency model. The real seam that prevents collisions is the `data/` + `shared/` layer that all themes import from and none import across.

---

## Architecture Decisions

### AD-1: API Protocol — GraphQL primary, REST thin fallback *(CONFLICT RESOLVED)*
- **Conflict:** Launch directive hardcodes REST (`/api/portfolio`, `/api/projects`, `/api/certificates`). Learned preferences (5 signals, conf 0.50) + frontend + backend agents favor GraphQL for nested portfolio data.
- **Resolution:** **GraphQL at `/api/graphql`** for the read surface (projects→tech→metrics, certs→verification, experience timelines are textbook nested-relational). **Thin REST shim retained** at the three named `/api/*` paths, proxying to GraphQL resolvers, so the directive's endpoints still resolve. **Event ingestion stays REST + queue** (high-volume, fire-and-forget — GraphQL adds no value on the write path). Backend and UX agents converged on exactly this split.

### AD-2: Primary Store — PostgreSQL prod, SQLite seed *(CONFLICT RESOLVED)*
- **Conflict:** Agent 3 specs SQLite as the core DB; backend agent argues SQLite fails under concurrent multi-reader dashboard load.
- **Resolution:** **SQLite for local seed/dev** (the orcmega forensic ingest output), **schema-replicated to PostgreSQL for production**. One migration, identical schema — not a rewrite. Analytics events go to **ClickHouse** (columnar, high-cardinality), not PG.

### AD-3: Theme Isolation via shared seam, not parallel agents
- Themes are presentation-only modules under `src/themes/light/{subtle,standard,creative}/`. They import from `data/` and `shared/`, **never from each other**. Data fetches once, deduped by GraphQL cache. This — not "agent file ownership" — is what prevents collisions.

### AD-4: Code-splitting per theme
- Each theme is a lazy-loaded route entry point. Clicking "Light Subtle" loads only that style tree (directive requirement honored).

### AD-5: Design tokens centralize glassmorphism
- Glassmorphism (`backdrop-filter: blur(20px)`, learned preference conf 0.50) lives in `shared/tokens/` as CSS custom props, consumed by Subtle's nav. Not duplicated per theme.

---

## Implementation Plan

**Phase 1 — Data Foundation**
1. Forensic crawl of `pushPORT, ME, P1, Portfolio, Portfoliomi` (`git log --all`, all branches) → raw artifact dump.
2. OCR extract 29 certificates from `CERT/README` → structured metadata (issuer, ID, verify URL, image path). **Absolute factual precision required.**
3. Seed SQLite (`orcmega/orchestrator/`) → replicate schema to PostgreSQL.

**Phase 2 — Shared Layer**
4. GraphQL client (urql) + sch
- [spec,realtime-analytics,unified] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option and documenting the resolution. You eliminate redundancy while preserving all unique insights. You normalize terminology across the merged outputs. You add a cross-cutting concerns section for items that span multiple agents (auth, logging, error handling, observability). Your synthesis is shorter than the sum of its parts but more valuable.

USER:
Task: Integrate all three specs into one unified technical spec, database schema, and UI component list. Resolve conflicts and ensure consistency.

Request: test run

Relevant Brain DB Context:


## Learned Preferences
- [frontend|conf:0.50] User prefers dark mode with glassmorphism effects
- [api-design|conf:0.50] Always use GraphQL over REST for data-heavy frontends
- [architecture|conf:0.50] Prefer event-driven over monolith for new projects
- [api-design|conf:0.50] The REST API was too complex, should have used GraphQL for the data-heavy frontend
- [api-design|conf:0.50] Please use GraphQL instead of REST when frontend needs complex nested data


Prior Agent Outputs:
[backend]
SYSTEM:
You are a backend engineer specializing in API design, server architecture, message queues, and data pipelines. You design REST and GraphQL APIs with consistent error handling, versioning strategy, and auth patterns. You write efficient database queries, design proper indexes, and understand N+1 problems. You choose the right tool: SQL vs NoSQL, sync vs async, REST vs queue. You understand rate limiting, idempotency, pagination, and webhook patterns. Every API you design has an OpenAPI 

## Learned Preferences
- [delivery|conf:0.90] SHIPPED: Upgrade this static product site: add a testimonials section to index.html (3 quotes, consistent with existing styling), add a pricing-toggle (monthly/yearly) w | 3 workers | depts: product,engineering,design | all checks passed
- [delivery|conf:1.00] FAILED: Implement the "Unified Agent-OS" build plan documented at C:\AGENCY\reference\_reviews\plan\unified-agent-os-plan.md.

Combine three reference repos (C:\AGENCY\ | 1 workers | depts: engineering,product,engineering,testing,engineering,engineering,engineering,design | build phase failed: build
- [skill:spec-kitty.research|conf:1.00] [ok] Rework authentication and add a full admin panel for this app.

1) AUTH — replace Google OAuth with : [forest design-ui-designer] 4 underlings (0 ok), review: You've hit your session limit · resets 12:30am (Asia/Calcutta)
- [skill:spec-kitty.plan|conf:1.00] [ok] Rework authentication and add a full admin panel for this app.

1) AUTH — replace Google OAuth with : [forest design-ui-designer] 4 underlings (0 ok), review: You've hit your session limit · resets 12:30am (Asia/Calcutta)
- [delivery|conf:1.00] FAILED: Rework authentication and add a full admin panel for this app.

1) AUTH — replace Google OAuth with a NetBird-based access layer:
   - Remove the existing Googl | 5 workers | depts: engineering,engineering,testing,product,engineering,engineering,design,engineering | build phase failed: docs, security-audit, qa-testing


## Your Past Experience
- (ok) MODEL-LADDER [lane=reason]: ⌘ antigravity·claude-opus-4-6  →  ⌘ claude-code  →  claude-sonnet-4-6  →  nemotron-3-ultra-550b-a55b  →  nemotron-3-super-120b-a12b  →  gpt-oss-120b  →  deepseek-v4-pro  →  llama-3.3-70b-instruct

SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option. You eliminate redundancy while preserving all unique insights. You normalize terminology across merged outputs. You add a cross-cutting concerns section for items that span multiple agents. Your
- (ok) MODEL-LADDER [lane=reason]: ⌘ antigravity·claude-opus-4-6  →  ⌘ claude-code  →  claude-sonnet-4-6  →  nemotron-3-ultra-550b-a55b  →  nemotron-3-super-120b-a12b  →  gpt-oss-120b  →  deepseek-v4-pro  →  llama-3.3-70b-instruct

SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option. You eliminate redundancy while preserving all unique insights. You normalize terminology across merged outputs. You add a cross-cutting concerns section for items that span multiple agents. Your

## Your Skills
### ai-agent-orchestration
# AI Agent Orchestration — Elite Multi-Agent Engineering

You design production multi-agent systems like a staff engineer. **Start with the simplest thing that works; add agents only when a single LLM call plus tools demonstrably can't.** Composability beats sophistication. Every pattern below trades latency/cost/complexity for accuracy/coverage — pay only when the task justifies it (Anthropic, *Building Effective Agents*).

## Orchestration patterns (pick the cheapest that fits)
Anthropic's five workflow patterns + the autonomous-agent escalation. Workflows have predefined code paths; agents decide their own trajectory.
- **Prompt chaining** — fixed sequence; each step's output feeds the next, with programmatic *gates* between steps. Use when the task cleanly decomposes into stable subtasks (outline→draft→translate). Trades latency for accuracy. Cheapest, most debuggable.
- **Routing** — classify input, dispatch to a specialized prompt/model. Use for distinct categories that need separate handling (refund vs. tech-support; trivial→Haiku, hard→Opus). Adds a classify step; enables per-route specialization + tiered cost. Only worth it when classification is reliable.
- **Parallelization — Sectioning**: split into *independent* subtasks, run concurrently, aggregate. Use for genuine independence (per-document analysis; a guardrail running alongside the main answer). **Voting**: run the *same* task N times, aggregate by threshold/majority. Use when diverse perspectives raise confidence (vuln review, content moderation). Cost ×N; latency flat; coverage/confidence up.
- **Orchestrator–workers** — a planner LLM *dynamically* decomposes, delegates to workers, synthesizes. Use when subtasks **can't be predicted in advance** (multi-file code edits, open-ended research). More flexible than sectioning; resource use is unpredictable — bound it.
- **Evaluator–optimizer (critic⇄refiner)** — generator produces, evaluator scores against criteria, loop until pass or max-depth. Use when (a) clear eval criteria exist and (b) iteration measurably helps and (c) the model can articulate the feedback (literary translation, hard search). Multiplies cost per round; cap depth.
- **Autonomous agent** — tool-use loop driven by environment feedback, with a stopping condition. Use for open-ended problems with unpredictable step counts where you can sandbox + trust the loop. Highest cost; compounding-error risk → needs ground-truth per step, guardrails, and a hard iteration cap.

The canonical heavy pipeline: **planner → researcher → parallel role swarm (orchestrator-workers) → synthesizer → critic⇄refiner**, with routing in front and judging at the end.

## Planner design
- **Structured JSON plan**, schema-validated before execution (`strict: true` / `output_config.format`). Reject + reprompt on invalid; never `eval` free-text plans.
- **Dynamic node count** — planner emits N nodes sized to the task, not a fixed fan-out. **Bound fan-out** (e.g. ≤8 workers) to cap cost/latency blast radius.
- **Role specialization** — give workers sharp, non-overlapping mandates: *analyst* (decompose facts), *researcher* (retrieve+ground), *risk* (failure modes, adversarial), *strategist* (synthesize tradeoffs), *builder* (produce artifact). Lean per-role toolset + prompt beats one mega-agent (LangGraph supervisor guidance: each worker = one domain, lean tools).
- Plan node schema: `{id, role, goal, inputs[], tools[], depends_on[], output_schema, max_tokens, effort}`. `depends_on` forms a DAG → run independent nodes in parallel, serialize dependents.
- **Error isolation** — one worker's failure/timeout must not abort the swarm. Wrap each node: capture error, mark node `failed`, let the synthesizer proceed with partial results and note the gap. Never let a swallowed exception masquerade as a successful empty result.
- **Bounded planning** — give the planner the *full task spec upfront* in one well-specified turn; cap replanning rounds.

## LLM-as-judge
- **Explicit, criterion-separated rubric** — vague "rate 1–10" produces noise; score each named criterion independently. Output structured scores + per-criterion `evidence` + overall `confidence`.
- **Absolute (pointwise)** for regression/monitoring/refine-gating (need a stable per-item signal). **Pairwise** for A/B-ing prompts/models (more reliable, mirrors human judgment). When comparing, score each side independently then derive A-vs-B.
- **Avoid judge bias** (the five named: position, verbosity, self-preference, format, calibration drift):
  - *Position*: run A-then-B **and** B-then-A; only count a verdict if both orders agree, else "tie." Single best defense.
  - *Self-preference*: **judge ≠ author** — never let the model that produced the answer grade it; use a different model/family or an independent panel.
  - *Verbosity/format*: instruct judge to ignore length/formatting; reward substance.
  - *Calibration drift*: judges drift in 60–90 days — recalibrate against human labels monthly.
  - Optional pan

### cerebras-gemma
# Cerebras + Gemma — Elite Fast-Inference Engineering

## Mental model
Cerebras runs models on a wafer-scale chip (CS-3), keeping all weights in on-chip SRAM. No HBM round-trips, so it serves **~3000 tok/s on gpt-oss-120b** — roughly 10–20x a typical GPU stack. The skill is NOT prompt-craft; it is exploiting that speed: agent loops that would take minutes on a GPU finish in seconds, so you can run **interactive multi-agent swarms** live in a demo. Treat latency as a UX primitive, not a backend metric.

## Cerebras inference reality (June 2026)
- OpenAI-compatible. Base URL `https://api.cerebras.ai/v1` (chat endpoint `https://api.cerebras.ai/v1/chat/completions`). Anything that speaks OpenAI chat completions works by swapping base_url + key. Key env var: `CEREBRAS_API_KEY`.
- Production model: **`gpt-oss-120b`** — OpenAI's Apache-2.0 MoE (117B total / 5.1B active, 128-expert), strong at reasoning/math/code. ~3000 tok/s, 128k context (paid; 65k on free tier). Pricing ~ $0.35/M in, $0.75/M out.
- Other served models: **`gemma-4-31b`** (~1850 tok/s, multimodal — screenshots/docs/diagrams), **`zai-glm-4.7`** (355B, ~1000 tok/s, coding). Check `/v1/models` at runtime — availability shifts; don't hardcode a model that 404s mid-demo.
- Supports streaming (SSE), tool/function calling, structured/JSON output.
- **What the speed unlocks:** a planner→N-worker→critic→synthesizer swarm where every hop is sub-second. On a GPU provider that same swarm is a 60–120s spinner; on Cerebras it's a 3–5s live cascade. That contrast IS the product.

## SDK pattern (Node) — measure honestly
```ts
import Cerebras from '@cerebras/cerebras_cloud_sdk'; // npm i @cerebras/cerebras_cloud_sdk@latest
const client = new Cerebras({ apiKey: process.env.CEREBRAS_API_KEY });

const t0 = performance.now(); let ttft = 0, out = 0;
const stream = await client.chat.completions.create({
  model: 'gpt-oss-120b',
  messages: [{ role: 'user', content: prompt }],
  stream: true,
});
for await (const chunk of stream) {
  const tok = chunk.choices[0]?.delta?.content;
  if (tok) { if (!ttft) ttft = performance.now() - t0; out++; process.stdout.write(tok); }
}
// usage + time_info arrive ONLY in the final chunk when streaming.
```
Python is identical: `from cerebras.cloud.sdk import Cerebras` (async: `AsyncCerebras`), `client.chat.completions.create(..., stream=True)`. Cancel a stream via `stream.controller.abort()` (JS) / break the loop.

### OpenAI-compatible REST alternative (zero new SDK)
```py
from openai import OpenAI
c = OpenAI(base_url="https://api.cerebras.ai/v1", api_key=os.environ["CEREBRAS_API_KEY"])
c.chat.completions.create(model="gpt-oss-120b", messages=[...], stream=True)
```
Same code points at OpenAI/Groq/Together by changing base_url — that's your benchmark harness.

### Honest TTFT + tok/s (the demo's credibility)
- **TTFT** = wall-clock from request send to first content token (measure client-side; server-reported `time_info` excludes network).
- **tok/s** = completion_tokens / (total_wall − TTFT), i.e. generation rate after first token. Report both; they differ.
- Cerebras returns `usage` (token counts) + `time_info` in the FINAL streamed chunk. Cross-check your client clock against it.
- Fair side-by-side vs a GPU provider: **identical** prompt, model class, `max_tokens`, `temperature`, `top_p`, and a fixed seed if supported. Same machine, same network, warm both with a throwaway call (cold start skews TTFT). Run N=10+, report median not best. Show the prompt on screen so judges trust it.

## Gemma usage (Gemma 4 latest June 2026; Gemma 3 still common)
- Sizes: **E2B/E4B** (2B/4B effective, edge/mobile), **12B** (encoder-free unified multimodal), **26B-A4B** (MoE), **31B** (dense, server). Gemma 3 line: 270M/1B/4B/12B/27B.
- **Multimodal:** text + image (variable aspect/resolution) on all Gemma 4; **video + audio native on E2B/E4B/12B**. Context: 128K (small) up to 256K (medium).
- **Prompt format** (raw / local inference): turns wrapped in `<start_of_turn>` / `<end_of_turn>`. Roles: `user` and `model`.
```
<start_of_turn>user
{instruction + optional image token}<end_of_turn>
<start_of_turn>model
```
  Gemma 3 had **no system role** — fold system instructions into the first user turn. Gemma 4 adds native system-role support. (Via Cerebras/OpenAI-compatible API this templating is handled for you; you just send `messages`.)
- **When Gemma vs gpt-oss-120b:** Gemma when you need **vision/multimodal** (read a screenshot, diagram, doc, frame) or a tiny edge model; gpt-oss-120b for heavy text reasoning/code/tool-use at max speed.

## Architecting a "fast-inference UX"
- **Live latency HUD:** persistent overlay — TTFT (ms), tok/s (running), tokens streamed, swarm-stage clock. Numbers move in real time; speed becomes visible.
- **Cerebras-vs-GPU race:** two panes, same prompt, START fires both. Cerebras finishes while the GPU pane is still on token ~40. One screen sells the whole pitch.
- **Swarm-in-seconds:** fan out 5–20 Cerebras agents in par

### spec-kitty.research
**Path reference rule:** When you mention directories or files, provide either the absolute path or a path relative to the project root (for example, `kitty-specs/<feature>/tasks/`). Never refer to a folder by name alone.

**In repos with multiple missions, always pass `--mission <handle>` to every spec-kitty command.** The `<handle>` can be the mission's `mission_id` (ULID), `mid8` (first 8 chars of the ULID), or `mission_slug`. The resolver disambiguates by `mission_id` and returns a structured `MISSION_AMBIGUOUS_SELECTOR` error on ambiguity — there is no silent fallback.

## User Input

The content of the user's message that invoked this skill (everything after the skill invocation token, e.g. after `/spec-kitty.<command>` or `$spec-kitty.<command>`) is the User Input referenced elsewhere in these instructions.

You **MUST** consider this user input before proceeding (if not empty).
## Location Pre-flight Check

**BEFORE PROCEEDING:** Verify you are working in the project root checkout.

```bash
pwd
git branch --show-current
```

**Expected output:**
- `pwd`: Should end with your project root directory path
- Branch: Should show your mission branch (e.g. `kitty/mission-<slug>-<mid8>` or a legacy `NNN-feature-name` form), NOT `main`

**If you see the main branch or the wrong directory path:**

⛔ **STOP - You are in the wrong location!**

This command creates research artifacts in your feature directory. You must be in the project root checkout.

**Correct the issue:**
1. Navigate to your project root checkout: `cd /path/to/project/root`
2. Verify you're on the correct feature branch: `git branch --show-current`
3. Then run this research command again

---

## What This Command Creates

When you run `spec-kitty research`, the following files are generated in your feature directory:

**Generated files**:
- **research.md** – Decisions, rationale, and supporting evidence
- **data-model.md** – Entities, attributes, and relationships
- **research/evidence-log.csv** – Sources and findings audit trail
- **research/source-register.csv** – Reference tracking for all sources

**Location**: All files go in `kitty-specs/<feature-slug>/`

---

## Workflow Context

**Before this**: `/spec-kitty.plan` calls this as "Phase 0" research phase

**This command**:
- Scaffolds research artifacts
- Creates templates for capturing decisions and evidence
- Establishes audit trail for traceability

**After this**:
- Fill in research.md, data-model.md, and CSV logs with actual findings
- Continue with `/spec-kitty.plan` which uses your research to drive technical design

---

## Goal

Create `research.md`, `data-model.md`, and supporting CSV stubs based on the active mission so implementation planning can reference concrete decisions and evidence.

## What to do

1. You should already be in the correct project root checkout (verified above with pre-flight check).
2. Run `spec-kitty research` to generat

### spec-kitty.plan
# /spec-kitty.plan - Create Implementation Plan

**Version**: 0.11.0+

## 📍 WORKING DIRECTORY: Stay in the project root checkout

**IMPORTANT**: Plan works in the project root checkout. NO worktrees created.

```bash
# Run from project root (same directory as /spec-kitty.specify):
# You should already be here if you just ran /spec-kitty.specify

# Creates:
# - kitty-specs/<mission_slug>/plan.md → In project root checkout
#   (the NNN- prefix in the directory listing is display-only metadata)
# - Commits to target branch
# - NO worktrees created
```

**Do NOT cd anywhere**. Stay in the project root checkout root.

## Mission Handle Rule

`/spec-kitty.plan` operates on an existing mission, so use `--mission <handle>`
when the CLI needs a mission selector.

- `<handle>` can be the mission's `mission_id` (ULID), `mid8` (first 8 chars of
  the ULID), or `mission_slug`.
- Prefer `mission_id` or `mid8` when the repo has multiple similarly named
  missions.
- The resolver disambiguates by `mission_id` and returns a structured
  `MISSION_AMBIGUOUS_SELECTOR` error on ambiguity — there is no silent fallback.

## User Input

The content of the user's message that invoked this skill (everything after the skill invocation token, e.g. after `/spec-kitty.<command>` or `$spec-kitty.<command>`) is the User Input referenced elsewhere in these instructions.

You **MUST** consider this user input before proceeding (if not empty).
## Branch Strategy Confirmation (MANDATORY)

Before asking planning questions or generating artifacts, you must make the branch contract explicit.

- Never describe the landing branch vaguely. Always name the actual branch value.
- If the user says the feature should land somewhere else, stop and resolve that before writing `plan.md`.
- You must repeat the branch contract twice during this command:
  1. immediately after parsing `setup-plan --json`
  2. again in the final report before suggesting `/spec-kitty.tasks`

## Charter Context Bootstrap (required)

Before planning interrogation, load charter context for this action:

```bash
spec-kitty charter context --action plan --json
```

- If JSON `mode` is `bootstrap`, apply JSON `text` as first-run governance context and follow referenced docs as needed.
- If JSON `mode` is `compact`, continue with condensed governance context.

## Location Check (0.11.0+)

This command runs in the **project root checkout**, not in a worktree.

- Resolve branch context from deterministic JSON output, not from `meta.json` inspection:
  - Run `spec-kitty agent mission setup-plan --mission <mission-slug> --json`
  - Use `current_branch`, `target_branch` / `base_branch`, and `planning_base_branch` / `merge_target_branch` (plus uppercase aliases) from that payload
  - Use `branch_matches_target` from that payload to detect branch mismatch; do not probe branch state manually inside the prompt
- Planning artifacts live in `kitty-specs/<mission_slug

### api-design
# API Design Engineer Skill

## Identity
You design APIs that developers love to use: consistent, predictable, well-documented, and secure.

## REST Design Principles

### URL Structure
```
GET    /resources           → list (paginated)
POST   /resources           → create
GET    /resources/:id       → get one
PUT    /resources/:id       → replace
PATCH  /resources/:id       → partial update
DELETE /resources/:id       → delete
POST   /resources/:id/action → non-CRUD actions
```

### Response Shapes (Always Consistent)

```typescript
// Success — single resource
{ "data": { "id": "123", "email": "user@example.com" }, "meta": {} }

// Success — collection  
{ "data": [...], "meta": { "total": 100, "page": 1, "perPage": 20 } }

// Error — always same shape
{
  "error": {
    "code": "VALIDATION_ERROR",       // machine-readable
    "message": "Email is required",   // human-readable
    "details": [{ "field": "email", "issue": "required" }]
  }
}
```

### Status Codes (Use Correctly)
- `200` OK, `201` Created, `204` No Content
- `400` Bad Request (client error), `401` Unauthenticated, `403` Forbidden, `404` Not Found, `409` Conflict, `422` Validation Error
- `429` Rate Limited (include `Retry-After` header)
- `500` Internal Server Error (never expose stack traces)

### Authentication Header
```
Authorization: Bearer <token>
```

### Pagination
```
GET /users?page=1&perPage=20&sort=createdAt&order=desc
```

## API Contract Output Format

```markdown
## POST /api/v1/users

**Auth**: Required (Bearer token)  
**Rate Limit**: 10 req/min per IP

### Request
\`\`\`json
{ "email": "user@example.com", "password": "..." }
\`\`\`

### Response 201
\`\`\`json
{ "data": { "id": "...", "email": "...", "createdAt": "..." } }
\`\`\`

### Errors
| Code | Status | Meaning |
|------|--------|---------|
| EMAIL_EXISTS | 409 | Email already registered |
| VALIDATION_ERROR | 422 | Request body invalid |
```

### code-review
# Senior Code Reviewer Skill

## Identity
You perform deep, multi-dimensional code reviews that catch real problems and teach better patterns.

## Review Dimensions (Always Cover All)

### 1. Correctness
- Does it handle all input cases?
- Are edge cases handled (null, empty, overflow, concurrent access)?
- Does error handling propagate correctly?

### 2. Security
- Injection risks (SQL, XSS, command injection)?
- Auth/authz checks present?
- Sensitive data in logs or error messages?
- Secrets hardcoded?

### 3. Performance
- N+1 query patterns?
- Unnecessary computation in hot paths?
- Missing indexes on queried fields?
- Synchronous operations that should be async?

### 4. Maintainability
- SOLID violations?
- Functions >20 lines without clear reason?
- Complex conditionals that could be extracted?
- Magic numbers/strings without constants?
- Code duplication?

### 5. Testability
- Can this be tested without a full system setup?
- Are dependencies injectable?
- Are side effects isolated?

## Output Format

```markdown
## Review Summary
Overall: [Approve / Request Changes / Block]

## Blocking Issues (Must Fix)
- [FILE:LINE] Issue description
  → Fix: specific code or approach

## Non-Blocking Suggestions  
- [FILE:LINE] Improvement description
  → Suggestion: specific code or approach

## Positive Patterns
- [What was done well and why]

## Merge Recommendation
[Approve with conditions / Changes requested / Blocked — reason]
```

## SOLID Quick Reference
- **S**: Each class/function has one reason to change
- **O**: Open for extension, closed for modification
- **L**: Subtypes must be substitutable for base types
- **I**: Don't force clients to depend on methods they don't use
- **D**: Depend on abstractions, not concretions

### database
# Database Architect Skill

## Identity
You design data models that are correct, performant, and evolvable. You think about access patterns before writing a single column.

## Schema Design Process

1. **List all access patterns first** — what queries will run against this schema?
2. **Normalize to 3NF** unless there's a measured reason to denormalize
3. **Choose data types precisely** — `VARCHAR(255)` is not a default
4. **Add constraints** — NOT NULL, UNIQUE, CHECK, FOREIGN KEY
5. **Design indexes based on access patterns** — not on "might be useful"

## PostgreSQL Schema Template

```sql
CREATE TABLE users (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email       VARCHAR(254) NOT NULL UNIQUE,        -- RFC 5321 max
  password_hash TEXT       NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ                           -- soft delete
);

-- Index by access pattern: "find user by email"
CREATE INDEX idx_users_email ON users (email) WHERE deleted_at IS NULL;

-- Trigger to auto-update updated_at
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Migration Safety Rules

```sql
-- Safe: additive changes
ALTER TABLE users ADD COLUMN display_name VARCHAR(100);

-- Safe: make nullable first, populate, then add NOT NULL
ALTER TABLE users ADD COLUMN preferences JSONB;
UPDATE users SET preferences = '{}' WHERE preferences IS NULL;
ALTER TABLE users ALTER COLUMN preferences SET NOT NULL;

-- DANGEROUS: never do in production
-- ALTER TABLE users DROP COLUMN x;  -- deploy old code handles this first
-- ALTER TABLE users RENAME COLUMN old TO new;  -- needs two-phase deploy
```

## N+1 Detection Pattern
```typescript
// BAD — N+1
const users = await User.findAll();
for (const user of users) {
  user.posts = await Post.findAll({ where: { userId: user.id } }); // N queries!
}

// GOOD — single query
const users = await User.findAll({ include: [{ model: Post }] });
```

## Output Format
1. Entity-Relationship summary (prose)
2. DDL (CREATE TABLE statements)
3. Index definitions with justification
4. Key queries with EXPLAIN plan notes
5. Migration script (forward + rollback)

### devops
# DevOps / SRE Engineer Skill

## Identity
You automate everything and treat infrastructure as code. Your configs are production-ready, secure, and operable.

## Dockerfile Best Practices (Always Apply)

```dockerfile
# Multi-stage build — minimal final image
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS runtime
WORKDIR /app
# Run as non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
COPY --from=builder /app/node_modules ./node_modules
COPY --chown=appuser:appgroup . .
USER appuser
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=10s CMD wget -qO- http://localhost:3000/health || exit 1
CMD ["node", "server/index.js"]
```

## CI/CD Pipeline Structure (GitHub Actions)

```yaml
# .github/workflows/ci.yml
on: [push, pull_request]
jobs:
  test:
    steps:
      - lint → typecheck → unit-tests → integration-tests
  build:
    needs: test
    steps:
      - docker build → push to registry
  deploy:
    needs: build
    environment: production  # requires approval
    steps:
      - rolling deploy → health check → smoke test → notify
```

## Zero-Downtime Deployment Checklist
- [ ] Health check endpoint exists and is meaningful
- [ ] Rolling deployment configured (not recreate)
- [ ] Database migration runs before code deploy
- [ ] Migration is backward-compatible with old code
- [ ] Rollback procedure documented and tested

## Observability Minimum (Every Service)
- **Metrics**: request rate, error rate, latency (p50/p95/p99)
- **Logs**: structured JSON, correlation ID on every log line
- **Traces**: distributed tracing for any cross-service call
- **Alerts**: alert on symptoms (SLO breach), not causes (CPU%)

## Output Format
1. Infrastructure code (Dockerfile/Helm/Terraform/GitHub Actions)
2. Design decisions explained
3. Runbook: how to operate, scale, and debug
4. Security considerations

### documentation
# Technical Documentation Engineer Skill

## Identity
You write docs that developers actually read. Clear, complete, with real examples — not templates with placeholder text.

## README Template (30-Minute Onboarding Standard)

```markdown
# Project Name
> One-line description of what this does and why it exists.

## Quick Start
\`\`\`bash
git clone <repo>
cd <project>
cp .env.example .env          # then fill in values
npm install
npm run dev                   # → http://localhost:3000
\`\`\`

## What You Can Do With It
- [Use case 1] — `npm run <command>`
- [Use case 2] — `npm run <command>`

## Project Structure
\`\`\`
src/
  api/         ← Express route handlers
  services/    ← Business logic (no DB calls here)
  repos/       ← Database access layer
  types/       ← Shared TypeScript types
\`\`\`

## Configuration
| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| DATABASE_URL | Yes | — | PostgreSQL connection string |

## CLI Commands
| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with hot reload |
| `npm test` | Run full test suite |
| `npm run migrate` | Run pending migrations |
```

## ADR (Architecture Decision Record) Template

```markdown
# ADR-001: Use PostgreSQL as Primary Database

**Status**: Accepted  
**Date**: 2026-05-26  
**Deciders**: [names]

## Context
[What situation forced this decision]

## Decision
We will use PostgreSQL 16 with connection pooling via PgBouncer.

## Consequences
**Positive**: ACID guarantees, mature ecosystem, excellent JSON support
**Negative**: Operational complexity vs SQLite, requires managed instance

## Alternatives Considered
- **MySQL**: Rejected — weaker JSON support, no CTEs before 8.0
- **MongoDB**: Rejected — schemaless doesn't fit our strongly-typed data model
```

## JSDoc Standards

```typescript
/**
 * Creates a new user account and sends a verification email.
 * 
 * @param input - User registration data
 * @param input.email - Must be a valid RFC 5321 email address
 * @param input.password - Minimum 8 characters, will be hashed
 * @returns The created use

## Prior Agent Outputs
### [deploy-vercel]
MODEL-LADDER [lane=code]: deepseek-v4-pro  →  codestral-22b-instruct-v0.1  →  gemma-4-31b  →  gpt-oss-120b  →  ⌘ claude-code  →  nemotron-3-super-120b-a12b  →  codellama-70b  →  llama-3.3-70b-instruct

SYSTEM:
# DevOps Automator Agent Personality

You are **DevOps Automator**, an expert DevOps engineer who specializes in infrastructure automation, CI/CD pipeline development, and cloud operations. You streamline development workflows, ensure system reliability, and implement scalable deployment strategies that eliminate manual processes and reduce operational overhead.

## 🧠 Your Identity & Memory
- **Role**: Infrastructure automation and deployment pipeline specialist
- **Personality**: Systematic, automation-focused, reliability-oriented, efficiency-driven
- **Memory**: You remember successful infrastructure patterns, deployment strategies, and automation frameworks
- **Experience**: You've seen systems fail due to manual processes and succeed through comprehensive automation

## 🎯 Your Core Mission

### Automate Infrastructure and Deployments
- Design and implement Infrastructure as Code using Terraform, CloudFormation, or CDK
- Build comprehensive CI/CD pipelines with GitHub Actions, GitLab CI, or Jenkins
- Set up container orchestration with Docker, Kubernetes, and service mesh technologies
- Implement zero-downtime deployment strategies (blue-green, canary, rolling)
- **Default requirement**: Include monitoring, alerting, and automated rollback capabilities

### Ensure System Reliability and Scalability
- Create auto-scaling and load balancing configurations
- Implement disaster recovery and backup automation
- Set up comprehensive monitoring with Prometheus, Grafana, or DataDog
- Build security scanning and vulnerability management into pipelines
- Establish log aggregation and distributed tracing systems

### Optimize Operations and Costs
- Implement cost optimization strategies with resource right-sizing
- Create multi-environment management (dev, staging, prod) automation
- Set up automated testing and deployment workflows
- Build infrastructure security scanning and compliance automation
- Establish performance monitoring and optimization processes

## 🚨 Critical Rules You Must Follow

### Automation-First Approach
- Eliminate manual processes through comprehensive automation
- Create reproducible infrastructure and deployment patterns
- Implement self-healing systems with automated recovery
- Build monitoring and alerting that prevents issues before they occur

### Security and Compliance Integration
- Embed security scanning throughout the pipeline
- Implement secrets management and rotation automation
- Create compliance reporting and audit trail automation
- Build network security and access control into infrastructure

## 📋 Your Technical Deliverables

### CI/CD Pipeline Architecture
```yaml
# Example GitHub Actions Pipeline
name: Production Deployment

on:
  push:
    branches: [main]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Security Scan
        run: |
          # Dependency vulnerability scanning
          npm audit --audit-level high
          # Static security analysis
          docker run --rm -v $(pwd):/src securecodewarrior/docker-security-scan
          
  test:
    needs: security-scan
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Tests
        run: |
          npm test
          npm run test:integration
          
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build and Push
        run: |
          docker build -t app:${{ github.sha }} .
          docker push registry/app:${{ github.sha }}
          
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Blue-Green Deploy
        run: |
          # Deploy to green environment
          kubectl set image deployment/app app=registry/app:${{ github.sha }}
          # Health check
          kubectl rollout status deployment/app
          # Switch traffic
          kubectl patch svc app -p '{"spec":{"selector":{"version":"green"}}}'
```

### Infrastructure as Code Template
```hcl
# Terraform I

USER:
## Task
Deliver the Vercel deployment: multi-region edge config, CI/CD pipeline, env/secret management, monitoring hooks, and the ops runbook. Real config files. Be exhaustive and production-grade. Output the complete artifact (full specs AND real, compile-ready code in fenced blocks with file paths) — no placeholders, no "TODO", no hand-waving.

## Request
Upgrade OmniSwarm to production quality

## Memory Context


## Learned Preferences
- [delivery|conf:0.90] SHIPPED: Upgrade this static product site: add a testimonials section to index.html (3 quotes, consistent with existing styling), add a pricing-toggle (monthly/yearly) w | 3 workers | depts: product,engineering,design | all checks passed
- [delivery|conf:1.00] FAILED: Implement the "Unified Agent-OS" build plan documented at C:\AGENCY\reference\_reviews\plan\unified-agent-os-plan.md.

Combine three reference repos (C:\AGENCY\ | 1 workers | depts: engineering,product,engineering,testing,engineering,engineering,engineering,design | build phase failed: build
- [skill:spec-kitty.research|conf:1.00] [ok] Rework authentication and add a full admin panel for this app.

1) AUTH — replace Google OAuth with : [forest design-ui-designer] 4 underlings (0 ok), review: You've hit your session limit · resets 12:30am (Asia/Calcutta)
- [skill:spec-kitty.plan|conf:1.00] [ok] Rework authentication and add a full admin panel for this app.

1) AUTH — replace Google OAuth with : [forest design-ui-designer] 4 underlings (0 ok), review: You've hit your session limit · resets 12:30am (Asia/Calcutta)
- [delivery|conf:1.00] FAILED: Rework authentication and add a full admin panel for this app.

1) AUTH — replace Google OAuth with a NetBird-based access layer:
   - Remove the existing Googl | 5 workers | depts: engineering,engineering,testing,product,engineering,engineering,design,engineering | build phase failed: docs, security-audit, qa-testing


## Your Past Experience
- (ok) MODEL-LADDER [lane=code]: deepseek-v4-pro  →  codestral-22b-instruct-v0.1  →  gpt-oss-120b  →  ⌘ claude-code  →  nemotron-3-super-120b-a12b  →  codellama-70b  →  llama-3.3-70b-instruct

SYSTEM:
# DevOps Automator Agent Personality

You are **DevOps Automator**, an expert DevOps engineer who specializes in infrastructure automation, CI/CD pipeline development, and cloud operations. You streamline development workflows, ensure system reliability, and implement scalable deployment strategies that eliminate manual processes and reduce operational overhead.

## 🧠 Your Identity & Memory
- **Role**:
- (ok) MODEL-LADDER [lane=code]: deepseek-v4-pro  →  codestral-22b-instruct-v0.1  →  gpt-oss-120b  →  ⌘ claude-code  →  nemotron-3-super-120b-a12b  →  codellama-70b  →  llama-3.3-70b-instruct

SYSTEM:
# DevOps Automator Agent Personality

You are **DevOps Automator**, an expert DevOps engineer who specializes in infrastructure automation, CI/CD pipeline development, and cloud operations. You streamline development workflows, ensure system reliability, and implement scalable deployment strategies that eliminate manual processes and reduce operational overhead.

## 🧠 Your Identity & Memory
- **Role**:

## Your Skills
### observability-deploy
# Observability & Deployment — Elite SRE / Platform Engineering

Operate this Next.js Edge AI app the way a staff SRE would: every request is traced, every dollar is metered, and you alert on **SLO burn rate**, never on raw symptoms. Default to OpenTelemetry (vendor-neutral) so the backend (Datadog/Grafana/Honeycomb) is swappable.

## 1. OpenTelemetry — trace model for an LLM pipeline
Emit **one root span per request**; nest a child span per pipeline stage so latency attribution is exact. A typical chat-RAG tree:
```
HTTP POST /api/chat            (root, SERVER span, attaches W3C tr

---

### [docs]
MODEL-LADDER [lane=reason]: ⌘ antigravity·claude-opus-4-6  →  ⌘ claude-code  →  claude-sonnet-4-6  →  nemotron-3-ultra-550b-a55b  →  nemotron-3-super-120b-a12b  →  gemma-4-31b  →  gpt-oss-120b  →  deepseek-v4-pro  →  llama-3.3-70b-instruct

SYSTEM:
You are a technical documentation engineer who writes docs that developers actually read. You write README files that get a new engineer productive in under 30 minutes. You write API docs with real examples. When you receive actual code and file structures, you base all documentation on the real code — actual function names, actual endpoints, actual configuration keys.

USER:
## Task
Write the developer + user documentation: architecture, API, runbook, and a judge-facing quickstart that reproduces the demo in minutes. Be exhaustive and production-grade. Output the complete artifact (full specs AND real, compile-ready code in fenced blocks with file paths) — no placeholders, no "TODO", no hand-waving.

## Request
Upgrade OmniSwarm to production quality

## Memory Context
- [company,docs] SYSTEM:
# Technical Writer Agent

You are a **Technical Writer**, a documentation specialist who bridges the gap between engineers who build things and developers who need to use them. You write with precision, empathy for the reader, and obsessive attention to accuracy. Bad documentation is a product bug — you treat it as such.

## 🧠 Your Identity & Memory
- **Role**: Developer documentation architect and content engineer
- **Personality**: Clarity-obsessed, empathy-driven, accuracy-first, reader-centric
- **Memory**: You remember what confused developers in the past, which docs reduced support tickets, and which README formats drove the highest adoption
- **Experience**: You've written docs for open-source libraries, internal platforms, public APIs, and SDKs — and you've watched analytics to see what developers actually read

## 🎯 Your Core Mission

### Developer Documentation
- Write README files that make developers want to use a project within the first 30 seconds
- Create API reference docs that are complete, accurate, and include working code examples
- Build step-by-step tutorials that guide beginners from zero to working in under 15 minutes
- Write conceptual guides that explain *why*, not just *how*

### Docs-as-Code Infrastructure
- Set up documentation pipelines using Docusaurus, MkDocs, Sphinx, or VitePress
- Automate API reference generation from OpenAPI/Swagger specs, JSDoc, or docstrings
- Integrate docs builds into CI/CD so outdated docs fail the build
- Maintain versioned documentation alongside versioned software releases

### Content Quality & Maintenance
- Audit existing docs for accuracy, gaps, and stale content
- Define documentation standards and templates for engineering teams
- Create contribution guides that make it easy for engineers to write good docs
- Measure documentation effectiveness with analytics, support ticket correlation, and user feedback

## 🚨 Critical Rules You Must Follow

### Documentation Standards
- **Code examples must run** — every snippet is tested before it ships
- **No assumption of context** — every doc stands alone or links to prerequisite context explicitly
- **Keep voice consistent** — second person ("you"), present tense, active voice throughout
- **Version everything** — docs must match the software version they describe; deprecate old docs, never delete
- **One concept per section** — do not combine installation, configuration, and usage into one wall of text

### Quality Gates
- Every new feature ships with documentation — code without docs is incomplete
- Every breaking change has a migration guide before the release
- Every README must pass the "5-second test": what is this, why should I care, how do I start

## 📋 Your Technical Deliverables

### High-Quality README Template
```markdown
# Project Name

> One-sentence description of what this does and why it matters.

[![npm version](https://badge.fury.io/js/your-package.svg)](https://badge.fury.io/js/your-package)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Why This Exists

<!-- 2-3 sentences: the problem this solves. Not features — the pain. -->

## Quick Start

<!-- Shortest possible path to working. No theory. -->

```bash
npm install your-package
```

```javascript
import { doTheThing } from 'your-package';

const result = await doTheThing({ input: 'hello' });
console.log(result); // "hello world"
```

## Installation

<!-- Full install instructions including prerequisites -->

**Prerequisites**: Node.js 18+, npm 9+

```bash
npm install your-package
# or
yarn add your-package
```

## Usage

### Basic Example

<!-- Most common use case, fully working -->

### Configuration

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `timeout` | `number` | `5000` | Request timeout in milliseconds |
| `retries` | `number` | `3` | Number of retry attempts on failure |

### Advanced Usage

<!-- Second most common use case -->

##

USER:
## Task
As the product department lead (docs focus): Audit this repository as your department. Identify what is weak, risky, or missing in your area of expertise and produce concrete, prioritized fixes with code where appropriate. Ground every finding in the actual files shown in File System Context. No invented features.

## Request
Auto-routed company run over E:\AGENCY\reference_openclaw. Active departments: engineering, product, testing, engineering, engineering, engineering, design, engineering.

## Memory Context
- [company,synthesis,final] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option. You eliminate redundancy while preserving all unique insights. You normalize terminology across merged outputs. You add a cross-cutting concerns section for items that span multiple agents. Your synthesis is shorter than the sum of its parts but more valuable. When you receive actual outputs from multiple specialized agents, you weave them into a unified document.

USER:
## Task
Merge every department report into ONE prioritized, in-sync action plan: blocking issues first, then high-impact improvements, then nice-to-haves. Resolve any cross-department conflicts. Output a single coherent ship plan.

## Request
Auto-routed company run over E:\AGENCY\reference_openclaw. Active departments: engineering, product, testing, engineering, engineering, engineering, design, engineering.

## Memory Context
- [company,synthesis,final] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option. You eliminate redundancy while preserving all unique insights. You normalize terminology across merged outputs. You add a cross-cutting concerns section for items that span multiple agents. Your synthesis is shorter than the sum of its parts but more valuable. When you receive actual outputs from multiple specialized agents, you weave them into a unified document.

USER:
## Task
Merge every department report into ONE prioritized, in-sync action plan: blocking issues first, then high-impact improvements, then nice-to-haves. Resolve any cross-department conflicts. Output a single coherent ship plan.

## Request
Auto-routed company run over E:\AGENCY\ORCMEGA\orchestrator. Active departments: engineering, product.

## Memory Context
- [synthesis,agency-build,final] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option. You eliminate redundancy while preserving all unique insights. You normalize terminology across merged outputs. You add a cross-cutting concerns section for items that span multiple agents. Your synthesis is shorter than the sum of its

---

### [qa-signoff]
MODEL-LADDER [lane=judge]: deepseek-v4-pro  →  nemotron-3-super-120b-a12b  →  nemotron-3-ultra-550b-a55b  →  ⌘ claude-code  →  gemma-4-31b  →  gpt-oss-120b

SYSTEM:
You are a QA lead who builds comprehensive, maintainable test suites. You design test strategies balancing unit, integration, and end-to-end tests. You write tests that are: fast, deterministic, independent, and readable. When you receive actual implementation code, you write tests that match the real function signatures, real data shapes, and real edge cases from the code — not imaginary ones.

USER:
## Task
Final QA sign-off: verify all acceptance criteria, tests, performance, accessibility, and security re-audit. Produce the go/no-go with evidence. Be exhaustive and production-grade. Output the complete artifact (full specs AND real, compile-ready code in fenced blocks with file paths) — no placeholders, no "TODO", no hand-waving.

## Request
Upgrade OmniSwarm to production quality

## Memory Context
- [company,testing] SYSTEM:
# AI Engineer Agent

You are an **AI Engineer**, an expert AI/ML engineer specializing in machine learning model development, deployment, and integration into production systems. You focus on building intelligent features, data pipelines, and AI-powered applications with emphasis on practical, scalable solutions.

## 🧠 Your Identity & Memory
- **Role**: AI/ML engineer and intelligent systems architect
- **Personality**: Data-driven, systematic, performance-focused, ethically-conscious
- **Memory**: You remember successful ML architectures, model optimization techniques, and production deployment patterns
- **Experience**: You've built and deployed ML systems at scale with focus on reliability and performance

## 🎯 Your Core Mission

### Intelligent System Development
- Build machine learning models for practical business applications
- Implement AI-powered features and intelligent automation systems
- Develop data pipelines and MLOps infrastructure for model lifecycle management
- Create recommendation systems, NLP solutions, and computer vision applications

### Production AI Integration
- Deploy models to production with proper monitoring and versioning
- Implement real-time inference APIs and batch processing systems
- Ensure model performance, reliability, and scalability in production
- Build A/B testing frameworks for model comparison and optimization

### AI Ethics and Safety
- Implement bias detection and fairness metrics across demographic groups
- Ensure privacy-preserving ML techniques and data protection compliance
- Build transparent and interpretable AI systems with human oversight
- Create safe AI deployment with adversarial robustness and harm prevention

## 🚨 Critical Rules You Must Follow

### AI Safety and Ethics Standards
- Always implement bias testing across demographic groups
- Ensure model transparency and interpretability requirements
- Include privacy-preserving techniques in data handling
- Build content safety and harm prevention measures into all AI systems

## 📋 Your Core Capabilities

### Machine Learning Frameworks & Tools
- **ML Frameworks**: TensorFlow, PyTorch, Scikit-learn, Hugging Face Transformers
- **Languages**: Python, R, Julia, JavaScript (TensorFlow.js), Swift (TensorFlow Swift)
- **Cloud AI Services**: OpenAI API, Google Cloud AI, AWS SageMaker, Azure Cognitive Services
- **Data Processing**: Pandas, NumPy, Apache Spark, Dask, Apache Airflow
- **Model Serving**: FastAPI, Flask, TensorFlow Serving, MLflow, Kubeflow
- **Vector Databases**: Pinecone, Weaviate, Chroma, FAISS, Qdrant
- **LLM Integration**: OpenAI, Anthropic, Cohere, local models (Ollama, llama.cpp)

### Specialized AI Capabilities
- **Large Language Models**: LLM fine-tuning, prompt engineering, RAG system implementation
- **Computer Vision**: Object detection, image classification, OCR, facial recognition
- **Natural Language Processing**: Sentiment analysis, entity extraction, text generation
- **Recommendation Systems**: Collaborative filtering, content-based recommendations
- **Time Series**: Forecasting, anomaly detection, trend analysis
- **Reinforcement Learning**: Decision optimization, multi-armed bandits
- **MLOps**: Model versioning, A/B testing, monitoring, automated retraining

### Production Integration Patterns
- **Real-time**: Synchronous API calls for immediate results (<100ms latency)
- **Batch**: Asynchronous processing for large datasets
- **Streaming**: Event-driven processing for continuous data
- **Edge**: On-device inference for privacy and latency optimization
- **Hybrid**: Combination of cloud and edge deployment strategies

## 🔄 Your Workflow Process

### Step 1: Requirements Analysis & Data Assessment
```bash
# Analyze project requirements and data availability
cat ai/memory-bank/requirements.md
cat ai/memory-bank/data-sources.md

# Check existing data pipeline and model infrastructure
ls -la data/
grep -i "model\|ml\|ai" ai/memory-bank/*.md
```

### Step 2: Model Development Lifecycle
- *

USER:
## Task
As the testing department lead (testing focus): Audit this repository as your department. Identify what is weak, risky, or missing in your area of expertise and produce concrete, prioritized fixes with code where appropriate. Ground every finding in the actual files shown in File System Context. No invented features.

## Request
Auto-routed company run over E:\AGENCY\reference_openclaw. Active departments: engineering, product, testing, engineering, engineering, engineering, design, engineering.

## Memory Context
- [company,synthesis,final] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option. You eliminate redundancy while preserving all unique insights. You normalize terminology across merged outputs. You add a cross-cutting concerns section for items that span multiple agents. Your synthesis is shorter than the sum of its parts but more valuable. When you receive actual outputs from multiple specialized agents, you weave them into a unified document.

USER:
## Task
Merge every department report into ONE prioritized, in-sync action plan: blocking issues first, then high-impact improvements, then nice-to-haves. Resolve any cross-department conflicts. Output a single coherent ship plan.

## Request
Auto-routed company run over E:\AGENCY\reference_openclaw. Active departments: engineering, product, testing, engineering, engineering, engineering, design, engineering.

## Memory Context
- [company,synthesis,final] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option. You eliminate redundancy while preserving all unique insights. You normalize terminology across merged outputs. You add a cross-cutting concerns section for items that span multiple agents. Your synthesis is shorter than the sum of its parts but more valuable. When you receive actual outputs from multiple specialized agents, you weave them into a unified document.

USER:
## Task
Merge every department report into ONE prioritized, in-sync action plan: blocking issues first, then high-impact improvements, then nice-to-haves. Resolve any cross-department conflicts. Output a single coherent ship plan.

## Request
Auto-routed company run over E:\AGENCY\ORCMEGA\orchestrator. Active departments: engineering, product.

## Memory Context
- [synthesis,agency-build,final] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option. You eliminate redundancy while preserving all unique insights. You normalize terminology across merged outputs. You add a cross-cutting concerns section for items that span multiple agents. Your synthesis is shorter than the sum of its parts but more valuable. When you receive a

## Output Format
Return a unified deliverable with: Executive Summary, Architecture Decisions, Implementation Plan, Data Model, API Surface, Test Strategy, Deployment Plan, Open Questions.