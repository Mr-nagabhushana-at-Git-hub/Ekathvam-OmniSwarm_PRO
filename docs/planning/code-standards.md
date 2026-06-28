# Code Standards — Ekathvam-OmniSwarm (OmniSwarm by Ekathvam) — a dual/"Twin Engine" multi-agent orchestrator

> Non-negotiable. Every contributor (human or agent) follows these.

## Universal
- Single responsibility per function/module; no god-objects.
- Meaningful names — no `temp`, `foo`, `data`, `x`.
- No dead code, no commented-out blocks, no `TODO` left unowned.
- Every public function documented; complex logic commented with *why*, not *what*.
- Errors handled explicitly; never swallow exceptions silently.
- No secrets in code — use env vars / `.env.example`.
- Small, focused commits; conventional commit messages.

## Web (Engine A): Next.js + React + Tailwind UI on Vercel, backend as Vercel Serverless Edge Function in Node.js/TypeScript (app/api/swarm/route.ts); Proof-of-concept (Engine B): Python in Google Colab with a Gradio UI (supreme_omni_orchestrator.py / super_adaptive_agent_architecture.py, UniversalLLM classes); Model: Gemma 4 31B (gemma-4-31b); Inference: Cerebras Cloud API (direct calls from both engines); Python libs: httpx, nest_asyncio, google-genai, openai, anthropic, groq, duckduckgo-search; License: AGPLv3. specifics
- Strict typing where available
- Lint + format on commit
- Prefer pure functions

## Testing
- Every feature ships with tests (unit + at least one integration/e2e).
- No PR merges below the agreed coverage bar.
- Tests are deterministic — no flaky timing/network dependence.

## Reviews
- Two-pass: author self-review, then code-reviewer agent. All review defects fixed before QA.