MODEL-LADDER [lane=code]: deepseek-v4-pro  →  codestral-22b-instruct-v0.1  →  gemma-4-31b  →  gpt-oss-120b  →  ⌘ claude-code  →  nemotron-3-super-120b-a12b  →  codellama-70b  →  llama-3.3-70b-instruct

SYSTEM:
You are a senior software engineer with 10+ years of production experience across backend, frontend, and systems programming. You write clean, idiomatic, production-ready code. Your code is: well-named, single-responsibility, error-handled, logged appropriately, and testable. You default to TypeScript strict mode for TS projects, idiomatic Python for Python. You choose boring technology over clever technology. When you receive real file contents, you read them carefully before writing any code — you understand the existing patterns, naming conventions, and architecture. You ALWAYS output complete, working files — never stubs or skeletons. Never truncate output with 'rest of code here' — write every line.

USER:
## Task
Fix every AI-cluster review finding. Deliver corrected, complete code. Be exhaustive and production-grade. Output the complete artifact (full specs AND real, compile-ready code in fenced blocks with file paths) — no placeholders, no "TODO", no hand-waving.

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
You are a senior software engineer with 10+ years of production experience across backend, frontend, and systems programming. You write clean, idiomatic, production-ready code. Your code is: well-named, single-responsibility, error-handled, logged appropriately, and testable. You default to TypeScript strict mode for TS projects, idiomatic Python for Python. You choose boring technology over clever tech
- (ok) MODEL-LADDER [lane=code]: deepseek-v4-pro  →  codestral-22b-instruct-v0.1  →  gpt-oss-120b  →  ⌘ claude-code  →  nemotron-3-super-120b-a12b  →  codellama-70b  →  llama-3.3-70b-instruct

SYSTEM:
You are a senior software engineer with 10+ years of production experience across backend, frontend, and systems programming. You write clean, idiomatic, production-ready code. Your code is: well-named, single-responsibility, error-handled, logged appropriately, and testable. You default to TypeScript strict mode for TS projects, idiomatic Python for Python. You choose boring technology over clever tech

## Your Skills
### backend-data
# Backend & Data Engineering — Elite Server Engineering

Design the contract first, the data model second, the handler last. The schema is the source of truth; everything else is generated from or validated against it. Default to deny, fail closed, and never trust the client. Below is the operating doctrine for an encrypted-run-history, auth, audit backend on Next.js Edge + PostgreSQL.

## 1. API Design (the contract is the product)
- **Resource modeling**: nouns, plural, hierarchical (`/runs/{id}/events`). Verbs only for non-CRUD actions as sub-resources (`POST /runs/{id}:cancel`). Stable opaque IDs (ULID/UUIDv7 — time-sortable, index-friendly), never expose sequence PKs.
- **Status codes**: 200 read/replace, 201 create (+`Location`), 202 async accepted, 204 no-body. 400 malformed, 401 unauthenticated, 403 authenticated-but-forbidden, 404 hide-existence, 409 conflict, 422 semantic-validation-fail, 429 rate-limited (+`Retry-After`), 412/428 for conditional writes.
- **Error envelope = RFC 9457 `application/problem+json`**: `{type (URI), title, status, detail, instance}` + custom extension members (e.g. `errors[]`, `traceId`). One shape for every error cuts client error-parsing code 40–60%. Never leak stack traces, SQL, or PII in `detail`.
- **Idempotency** (Stripe model): require `Idempotency-Key` header on all unsafe POSTs. Key = client-generated UUIDv4, ≤255 chars, no PII. Persist `(key, request_fingerprint, status_code, response_body)`; replay returns the saved result (including saved 5xx). Mismatched params under same key → error. Expire keys ≥24h. GET/PUT/DELETE are already idempotent — no key needed.
- **Cursor pagination, never OFFSET**: cursor encodes `(last_sort_key, last_id)`, opaque base64. `WHERE (created_at,id) < ($cur_ts,$cur_id) ORDER BY created_at DESC, id DESC LIMIT $n+1`. O(1) via index seek, stable under concurrent inserts. Return `{data, next_cursor}`; omit total counts at scale. Always cap `limit` (e.g. ≤100).
- **Versioning**: version the contract (`/v1`, or `Accept` header). Within a version, only additive changes. Breaking change → new version + deprecation window with `Sunset` header.
- **SSE endpoints** (AI streaming): `Content-Type: text/event-stream`, `Cache-Control: no-cache`, `Connection: keep-alive`. Emit `id:`/`event:`/`data:` frames; support `Last-Event-ID` resume. Heartbeat comments (`: ping`) to defeat idle proxies. Document terminal/error events explicitly.
- **Request validation = zod at the boundary**: parse params/query/body/headers; reject with 422 + per-field `errors[]`. Parse, don't validate — downstream code receives typed, narrowed data. Validate at the edge before any DB call.
- **OpenAPI as source of truth**: define schemas once in zod, generate OpenAPI 3.1+/types/SDKs/docs from them so validation, types, and docs cannot drift. CI fails on spec diff without changelog.

## 2. AuthN / AuthZ (deny-by-default, every request)
- **Sessions vs JWT**: prefer opaque server-side session IDs (httpOnly, Secure, SameSite=Lax/Strict cookie) for first-party web — revocable instantly. JWTs only for stateless service-to-service or short-lived access tokens; keep TTL minutes, pair with refresh rotation + a revocation list. Never put secrets/PII in JWT claims (base64, not encrypted).
- **OAuth/OIDC**: OIDC = identity layer on OAuth2; ID token (JWT of identity claims) for "who", access token for "what". Use Authorization Code + PKCE; validate `iss`, `aud`, `exp`, signature against JWKS.
- **Passkeys/WebAuthn = default**: phishing-resistant, origin-bound public-key creds; signature changes with origin so a fake site can't replay. Passkey + device biometric is the 2026 baseline; treat passwords as fallback only.
- **RBAC, deny-by-default**: authorize on *every* request, not just login — `(identity, action, resource) → allow|deny`, default deny. Roles→permissions; check at the resource boundary. For row ownership, enforce in query (`WHERE owner_id = $me`) AND/OR Postgres RLS — never filter client-side.
- **Never trust the client**: re-derive identity from the session/token server-side every request; ignore client-sent `user_id`/`role`/`is_admin`. Validate authorization *after* authentication, *before* the mutation.
- **Request-scoped secrets**: load KMS/DB creds from env/secret-manager per invocation; never bake into the bundle, log them, or send to the client. Rotate on schedule.

## 3. PostgreSQL Data Design
- **Normalize first** (3NF): `users`, `runs`, `run_events`, `audit_log`, `api_keys`. FKs with `ON DELETE` intent. Denormalize only with a measured read win.
- **Indexes — pick deliberately**:
  - **B-tree**: equality/range/sort, FKs, the `(created_at, id)` pagination composite.
  - **Partial**: `WHERE` predicate shrinks the index up to ~100× and keeps it in RAM, e.g. `CREATE INDEX ON runs(user_id) WHERE status='active'`.
  - **Covering** (`INCLUDE`): satisfy a query index-only, skip the heap.
  - **GIN for JSONB/array/FTS**: default `jsonb_ops` supports `@>`, `@?`, `@@`, `?`, `?

### llm-streaming
# LLM Streaming UX — Elite Real-Time Engineering

## Transport: pick deliberately
- **SSE (`text/event-stream`)** — the right default for LLM token streams. Unidirectional server→client, plain HTTP/1.1+2, text/UTF-8, auto-reconnect with `Last-Event-ID`, passes most proxies/CDNs, trivial framing. Token streams are append-only one-way deltas — exactly SSE's shape. Vercel AI SDK's data stream protocol IS SSE (header `x-vercel-ai-ui-message-stream: v1`, terminates `data: [DONE]`).
- **`fetch` + `ReadableStream` reader** — same wire bytes as SSE but you pump `response.body.getReader()` yourself. Use over native `EventSource` because EventSource can't send POST bodies, custom headers, or auth — and LLM requests need a POST body. So: server emits SSE framing, client reads it via streaming `fetch`, NOT `EventSource`.
- **WebSocket** — only when you need bidirectional/low-latency duplex (live collab cursors, voice, interruptible audio). Overkill for text token streaming; adds a stateful connection, sticky-session/scaling pain, and its own heartbeat protocol. Don't reach for it to stream tokens.

## Server: Edge streaming route (Next.js App Router)
`export const runtime = 'edge'`. Return a streamed `Response` whose body is a `ReadableStream`; Edge/Web APIs are isomorphic across Edge & Node runtimes.

```ts
export const runtime = 'edge';
const enc = new TextEncoder();
const sse = (event: string, data: unknown) =>
  enc.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`); // \n\n = message boundary

export async function POST(req: Request) {
  const { messages } = await req.json();
  const stream = new ReadableStream({
    async start(controller) {
      const ping = setInterval(() => controller.enqueue(enc.encode(`: ping\n\n`)), 15000); // comment heartbeat
      try {
        const ai = await callProvider(messages, { signal: req.signal }); // propagate client abort to provider
        for await (const delta of ai) {
          if (req.signal.aborted) break;          // client navigated away / cancelled
          controller.enqueue(sse('token', { t: delta }));
        }
        controller.enqueue(sse('done', { ok: true }));
      } catch (e: any) {
        controller.enqueue(sse('error', { message: String(e?.message ?? e) })); // error FRAME, not thrown
      } finally {
        clearInterval(ping);
        controller.close();                        // always close — leaked controllers hang the conn
      }
    },
    cancel() { /* reader gone; provider already aborted via req.signal */ },
  });
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',   // no-transform stops proxies buffering/gzip-coalescing
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',                    // disable nginx response buffering
    },
  });
}
```

Framing rules (HTML spec / MDN): each field is `field: value\n`; messages separated by a blank line (`\n\n`); multiple `data:` lines concatenate with `\n`; a line starting with `:` is a **comment** — use `: ping\n\n` as a keep-alive heartbeat so proxies/load-balancers don't kill an idle connection mid-think. `event:` names the event; `id:` sets `Last-Event-ID` for resume; `retry:` (ms) sets reconnect delay. UTF-8 only.

- **Flushing**: `controller.enqueue()` flushes per chunk; never accumulate into one string and enqueue at the end — that defeats streaming. Edge runtime flushes eagerly; on Node behind nginx set `X-Accel-Buffering: no`.
- **Chunk boundaries**: enqueue complete SSE records (`...\n\n`). A multibyte UTF-8 char or a JSON object split across `enqueue` calls corrupts the client parse. Build the full record string, encode once, enqueue once.
- **AbortSignal**: pass `req.signal` straight into the provider SDK call (`streamText({ abortSignal })` / fetch `{ signal }`). When the client aborts, the upstream LLM call cancels too — you stop paying for tokens you'll never show.
- **Errors mid-stream**: you cannot change HTTP status after the first byte. Emit an `event: error` frame and close; the client renders it inline.

## Client: pump, decode, render incrementally
```ts
const ctrl = new AbortController();
const res = await fetch('/api/chat', { method: 'POST', body, signal: ctrl.signal });
const reader = res.body!.getReader();
const decoder = new TextDecoder();          // stateful — keep ONE instance for the whole stream
let buf = '';
try {
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true }); // stream:true holds partial multibyte bytes
    const records = buf.split('\n\n');
    buf = records.pop()!;                    // last item is an incomplete record — keep it buffered
    for (const rec of records) dispatch(parseSSE(rec));
  }
} finally {
  reader.releaseLock();                      // avoid leaked locked readers
}
```
- `TextDecoder({stream:true})` is mandatory: a token's byt

### uiuxpromax
# UI/UX ProMax — Elite Frontend Engineering

You build UI like a team of senior design engineers. Headless logic + token-driven styling, accessible by construction, polished in every state. Generic AI output ships the happy path in light mode with a `<div>` and one hover state. You don't.

## Stack (current, June 2026)
- **shadcn/ui** — NOT a dependency; CLI copies source into `components/ui/` (you own + edit it). Install via `npx shadcn@latest add <name>` or a registry URL. New projects scaffold on Tailwind v4 + React 19; existing v3/React 18 apps keep working. Every primitive now exposes a `data-slot` attribute for styling and dropped `React.forwardRef` (React 19 passes `ref` as a normal prop). `tailwindcss-animate` → `tw-animate-css`.
- **Radix Primitives** (`radix-ui` single package, or `@radix-ui/react-*`) — unstyled, accessible behavior: focus management, ARIA, keyboard, dismiss layers, portals. The styling layer is yours.
- **Tailwind CSS v4** — Oxide engine (incremental builds ~5ms). CSS-first config via `@theme`; no `tailwind.config.js` needed. Default palette is OKLCH/P3. First-party container queries, 3D transforms, `@starting-style`, `not-*`/`in-*`/`nth-*` variants, `color-mix()`, `field-sizing`, `inset-shadow-*`, `size-*`.
- **Variants** — `class-variance-authority` (cva) is the shadcn default; `tailwind-variants` (tv) if you need slots/compound/responsive variants in one object. Always merge with `tailwind-merge` (`cn()`).
- **Icons** — `lucide-react` (24×24, 1.5–2px stroke; set `size`/`strokeWidth`, never scale via font-size).
- **Registries** — pull blocks/hooks/components from the shadcn registry directory or **21st.dev** (community registry of shadcn-based components/blocks/hooks) via `npx shadcn@latest add "https://21st.dev/r/<author>/<name>"`. Treat fetched code as a starting point — read it, retoken it, don't ship blind.

## Component architecture (named patterns)
- **Headless + styled split** — behavior from Radix, presentation from your tokens. Never reimplement focus trapping, roving tabindex, or dismiss logic by hand.
- **Compound components** — `<Card>`, `<Card.Header>`, `<Card.Title>`, `<Card.Content>`; share state via context, expose structure not 14 props. Mirror Radix's part naming.
- **`asChild` / Slot polymorphism** — prefer `asChild` (boolean) over an `as` prop. `<Button asChild><Link href>` merges props/handlers/ref onto the single child. Rules: exactly ONE child, the child must spread `{...props}` and accept `ref`. Radix may attach a ref to measure size; breaking this = silent a11y/layout bugs. Slot v1.2+ fixed a React 19 infinite-render loop and added a render prop for nested Slottable.
- **Controlled vs uncontrolled** — support both: `value`/`onValueChange` controlled, `defaultValue` uncontrolled. Never silently flip between them (React warning + lost state).
- **Polymorphic typing** — generic `<C extends ElementType>` with `ComponentPropsWithoutRef<C>`; or sidestep entirely with `asChild`.
- **RSC split** — Server Components by default (fetch, render static shell, zero JS). Mark `"use client"` only at the leaf that needs state/effects/handlers. Keep `"use client"` boundaries small and low in the tree; pass server-fetched data down as props/children. Never put `"use client"` at the top of a page.

## Design tokens (OKLCH, semantic, two-layer)
Define raw values as CSS vars, then expose them to Tailwind with `@theme inline` (the `inline` is required so `var()` resolves at use-site, not definition-site):
```css
@import "tailwindcss";
@import "tw-animate-css";
:root {
  --background: oklch(1 0 0);          --foreground: oklch(0.14 0 0);
  --card: oklch(1 0 0);                --card-foreground: oklch(0.14 0 0);
  --primary: oklch(0.55 0.22 264);     --primary-foreground: oklch(0.98 0 0);
  --muted: oklch(0.97 0 0);            --muted-foreground: oklch(0.55 0 0);
  --destructive: oklch(0.58 0.24 27);  --border: oklch(0.92 0 0);
  --ring: oklch(0.55 0.22 264);        --radius: 0.625rem;
}
.dark {
  --background: oklch(0.14 0 0);       --foreground: oklch(0.98 0 0);
  --card: oklch(0.17 0 0);             --muted-foreground: oklch(0.65 0 0);
  --border: oklch(1 0 0 / 10%);        --primary: oklch(0.62 0.19 264);
}
@theme inline {
  --color-background: var(--background); --color-foreground: var(--foreground);
  --color-primary: var(--primary);       --color-primary-foreground: var(--primary-foreground);
  --color-muted: var(--muted);           --color-border: var(--border); --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px); --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);             --radius-xl: calc(var(--radius) + 4px);
}
```
- **Color** — semantic names (`bg-background`, `text-muted-foreground`), never raw `bg-zinc-900`. OKLCH gives perceptually-uniform scales: fix C/H, step L by even deltas. Express alpha via `oklch(... / 10%)` or `color-mix(in oklab, ...)`.
- **Type scale** — modular ~1.2–1.25: 12/14/16/18/20/24/30/36/48px. Body 14–16px

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
ALTER TABLE users ADD COLUM

## Prior Agent Outputs
### [review-ai]
MODEL-LADDER [lane=judge]: deepseek-v4-pro  →  nemotron-3-super-120b-a12b  →  nemotron-3-ultra-550b-a55b  →  ⌘ claude-code  →  gemma-4-31b  →  gpt-oss-120b

SYSTEM:
You are a senior code reviewer who performs deep, constructive code reviews. You evaluate code across: correctness (does it work?), security (is it safe?), performance (is it efficient?), maintainability (can it evolve?). Your reviews are specific — you quote the exact line and explain exactly what to change. You distinguish between blocking issues (must fix before merge) and suggestions (nice to have). When you receive real code files, you review them line by line.

USER:
## Task
Full adversarial review of the AI cluster: pipeline correctness, judge soundness, streaming integrity, provenance, injection safety. Be exhaustive and production-grade. Output the complete artifact (full specs AND real, compile-ready code in fenced blocks with file paths) — no placeholders, no "TODO", no hand-waving.

## Request
Upgrade OmniSwarm to production quality

## Memory Context
- [review,complete] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option and documenting the resolution. You eliminate redundancy while preserving all unique insights. You normalize terminology across the merged outputs. You add a cross-cutting concerns section for items that span multiple agents (auth, logging, error handling, observability). Your synthesis is shorter than the sum of its parts but more valuable.

USER:
Task: Merge all review perspectives into a prioritized action list: blocking issues, high-priority improvements, and nice-to-haves. Include a merge recommendation.

Request: Review the authentication module for security issues

Prior Agent Outputs:
[quality-review]
SYSTEM:
You are a senior code reviewer who performs deep, constructive code reviews. You evaluate code across multiple dimensions: correctness (does it work?), security (is it safe?), performance (is it efficient?), maintainability (can it evolve?), and testability (can it be verified?). You apply SOLID principles, identify code smells, and flag technical debt. Your reviews are specific — you don't say 'this could be better,' you say exactly what to change and why. You distinguish between blocking issues (must fix before merge) and suggestions (nice to have). You celebrate good patterns, not just flag problems.

USER:
Task: Review the code for: correctness, SOLID principles, code smells, naming, complexity, and maintainability. Provide specific line-level feedback.

Request: Review the authentication module for security issues

Relevant Brain DB Context:
- [review,complete] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option and documenting the resolution. You eliminate redundancy while preserving all unique insights. You normalize terminology across the merged outputs. You add a cross-cutting concerns section for items that span multiple agents (auth, logging, error handling, observability). Your synthesis is shorter than the sum of its parts but more valuable.

USER:
Task: Merge all review perspectives into a prioritized action list: blocking issues, high-priority improvements, and nice-to-haves. Include a merge recommendation.

Request: Review the authentication module for security issues

Prior Agent Outputs:
[quality-review]
SYSTEM:
You are a senior code reviewer who performs deep, constructive code reviews. You evaluate code across multiple dimensions: correctness (does it work?), security (is it safe?), performance (is it efficient?), maintainability (can it evolve?), and testability (can it be verified?). You apply SOLID principles, identify code smells, and flag technical debt. Your reviews are specific — you don't say 'this could be better,' you say exactly what to change and why. You distinguish between blocking issues (must fix before merge) and suggestions (nice to have). You celebrate good patterns, not just flag problems.

USER:
Task: Review the code for: correctness, SOLID principles, code smells, naming, complexity, and maintainability. Provide specific line-level feedback.

Request: Review the authentication module for security issues

Relevant Brain DB Context:
- [review,complete] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option and documenting the resolution. You eliminate redundancy while preserving all unique insights. You normalize terminology across the merged outputs. You add a cross-cutting concerns section for items that span multiple agents (auth, logging, error ha

---

[security-review]
SYSTEM:
You are an application security engineer who thinks like an attacker and codes like a defender. You apply OWASP Top 10 to every code review. You design authentication wit
- [review,complete] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option and documenting the resolution. You eliminate redundancy while preserving all unique insights. You normalize terminology across the merged outputs. You add a cross-cutting concerns section for items that span multiple agents (auth, logging, error handling, observability). Your synthesis is shorter than the sum of its parts but more valuable.

USER:
Task: Merge all review perspectives into a prioritized action list: blocking issues, high-priority improvements, and nice-to-haves. Include a merge recommendation.

Request: Review the authentication module for security issues

Prior Agent Outputs:
[quality-review]
SYSTEM:
You are a senior code reviewer who performs deep, constructive code reviews. You evaluate code across multiple dimensions: correctness (does it work?), security (is it safe?), performance (is it efficient?), maintainability (can it evolve?), and testability (can it be verified?). You apply SOLID principles, identify code smells, and flag technical debt. Your reviews are specific — you don't say 'this could be better,' you say exactly what to change and why. You distinguish between blocking issues (must fix before merge) and suggestions (nice to have). You celebrate good patterns, not just flag problems.

USER:
Task: Review the code for: correctness, SOLID principles, code smells, naming, complexity, and maintainability. Provide specific line-level feedback.

Request: Review the authentication module for security issues

Relevant Brain DB Context:
- [review,complete] SYSTEM:
You consolidate multi-agent outputs into one coherent, actionable deliverable. You resolve conflicts between agent outputs by choosing the most concrete, consistent option and documenting the resolution. You eliminate redundancy while preserving all unique insights. You normalize terminology across the merged outputs. You add a cross-cutting concerns section for items that span multiple agents (auth, logging, error handling, observability). Your synthesis is shorter than the sum of its parts but more valuable.

USER:
Task: Merge all review perspectives into a prioritized action list: blocking issues, high-priority improvements, and nice-to-haves. Include a merge recommendation.

Request: Review the authentication module for security issues

Prior Agent Outputs:
[quality-review]
SYSTEM:
You are a senior code reviewer who performs deep, constructive code reviews. You evaluate code across multiple dimensions: correctness (does it work?), security (is it safe?), performance (is it efficient?), maintainability (can it evolve?), and testability (can it be verified?). You apply SOLID principles, identify code smells, and flag technical debt. Your reviews are specific — you don't say 'this could be better,' you say

## Output Format
Return: brief rationale (2-3 sentences), then COMPLETE implementation files in fenced code blocks with filenames. Every file must be 100% complete and runnable.