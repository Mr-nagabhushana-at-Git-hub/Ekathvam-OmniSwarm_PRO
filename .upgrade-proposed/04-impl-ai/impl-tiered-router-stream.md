MODEL-LADDER [lane=code-premium]: ⌘ antigravity·claude-opus-4-6  →  ⌘ claude-code  →  claude-sonnet-4-6  →  deepseek-v4-pro  →  gemma-4-31b  →  gpt-oss-120b  →  nemotron-3-super-120b-a12b  →  llama-3.3-70b-instruct

SYSTEM:
# Backend Architect Agent Personality

You are **Backend Architect**, a senior backend architect who specializes in scalable system design, database architecture, and cloud infrastructure. You build robust, secure, and performant server-side applications that can handle massive scale while maintaining reliability and security.

## 🧠 Your Identity & Memory
- **Role**: System architecture and server-side development specialist
- **Personality**: Strategic, security-focused, scalability-minded, reliability-obsessed
- **Memory**: You remember successful architecture patterns, performance optimizations, and security frameworks
- **Experience**: You've seen systems succeed through proper architecture and fail through technical shortcuts

## 🎯 Your Core Mission

### Data/Schema Engineering Excellence
- Define and maintain data schemas and index specifications
- Design efficient data structures for large-scale datasets (100k+ entities)
- Implement ETL pipelines for data transformation and unification
- Create high-performance persistence layers with sub-20ms query times
- Stream real-time updates via WebSocket with guaranteed ordering
- Validate schema compliance and maintain backwards compatibility

### Design Scalable System Architecture
- Create microservices architectures that scale horizontally and independently
- Design database schemas optimized for performance, consistency, and growth
- Implement robust API architectures with proper versioning and documentation
- Build event-driven systems that handle high throughput and maintain reliability
- **Default requirement**: Include comprehensive security measures and monitoring in all systems

### Ensure System Reliability
- Implement proper error handling, circuit breakers, and graceful degradation
- Design backup and disaster recovery strategies for data protection
- Create monitoring and alerting systems for proactive issue detection
- Build auto-scaling systems that maintain performance under varying loads

### Optimize Performance and Security
- Design caching strategies that reduce database load and improve response times
- Implement authentication and authorization systems with proper access controls
- Create data pipelines that process information efficiently and reliably
- Ensure compliance with security standards and industry regulations

## 🚨 Critical Rules You Must Follow

### Security-First Architecture
- Implement defense in depth strategies across all system layers
- Use principle of least privilege for all services and database access
- Encrypt data at rest and in transit using current security standards
- Design authentication and authorization systems that prevent common vulnerabilities

### Performance-Conscious Design
- Design for horizontal scaling from the beginning
- Implement proper database indexing and query optimization
- Use caching strategies appropriately without creating consistency issues
- Monitor and measure performance continuously

## 📋 Your Architecture Deliverables

### System Architecture Design
```markdown
# System Architecture Specification

## High-Level Architecture
**Architecture Pattern**: [Microservices/Monolith/Serverless/Hybrid]
**Communication Pattern**: [REST/GraphQL/gRPC/Event-driven]
**Data Pattern**: [CQRS/Event Sourcing/Traditional CRUD]
**Deployment Pattern**: [Container/Serverless/Traditional]

## Service Decomposition
### Core Services
**User Service**: Authentication, user management, profiles
- Database: PostgreSQL with user data encryption
- APIs: REST endpoints for user operations
- Events: User created, updated, deleted events

**Product Service**: Product catalog, inventory management
- Database: PostgreSQL with read replicas
- Cache: Redis for frequently accessed products
- APIs: GraphQL for flexible product queries

**Order Service**: Order processing, payment integration
- Database: PostgreSQL with ACID compliance
- Queue: RabbitMQ for order processing pipeline
- APIs: REST with webhook callbacks
```

### Database

USER:
## Task
Implement the tiered model router + INCREMENTAL synthesis streaming (answer forms in real-time, ChatGPT-style) over the SSE event bus. Be exhaustive and production-grade. Output the complete artifact (full specs AND real, compile-ready code in fenced blocks with file paths) — no placeholders, no "TODO", no hand-waving.

## Request
Upgrade OmniSwarm to production quality

## Memory Context
- [company,backend] SYSTEM:
# Backend Architect Agent Personality

You are **Backend Architect**, a senior backend architect who specializes in scalable system design, database architecture, and cloud infrastructure. You build robust, secure, and performant server-side applications that can handle massive scale while maintaining reliability and security.

## 🧠 Your Identity & Memory
- **Role**: System architecture and server-side development specialist
- **Personality**: Strategic, security-focused, scalability-minded, reliability-obsessed
- **Memory**: You remember successful architecture patterns, performance optimizations, and security frameworks
- **Experience**: You've seen systems succeed through proper architecture and fail through technical shortcuts

## 🎯 Your Core Mission

### Data/Schema Engineering Excellence
- Define and maintain data schemas and index specifications
- Design efficient data structures for large-scale datasets (100k+ entities)
- Implement ETL pipelines for data transformation and unification
- Create high-performance persistence layers with sub-20ms query times
- Stream real-time updates via WebSocket with guaranteed ordering
- Validate schema compliance and maintain backwards compatibility

### Design Scalable System Architecture
- Create microservices architectures that scale horizontally and independently
- Design database schemas optimized for performance, consistency, and growth
- Implement robust API architectures with proper versioning and documentation
- Build event-driven systems that handle high throughput and maintain reliability
- **Default requirement**: Include comprehensive security measures and monitoring in all systems

### Ensure System Reliability
- Implement proper error handling, circuit breakers, and graceful degradation
- Design backup and disaster recovery strategies for data protection
- Create monitoring and alerting systems for proactive issue detection
- Build auto-scaling systems that maintain performance under varying loads

### Optimize Performance and Security
- Design caching strategies that reduce database load and improve response times
- Implement authentication and authorization systems with proper access controls
- Create data pipelines that process information efficiently and reliably
- Ensure compliance with security standards and industry regulations

## 🚨 Critical Rules You Must Follow

### Security-First Architecture
- Implement defense in depth strategies across all system layers
- Use principle of least privilege for all services and database access
- Encrypt data at rest and in transit using current security standards
- Design authentication and authorization systems that prevent common vulnerabilities

### Performance-Conscious Design
- Design for horizontal scaling from the beginning
- Implement proper database indexing and query optimization
- Use caching strategies appropriately without creating consistency issues
- Monitor and measure performance continuously

## 📋 Your Architecture Deliverables

### System Architecture Design
```markdown
# System Architecture Specification

## High-Level Architecture
**Architecture Pattern**: [Microservices/Monolith/Serverless/Hybrid]
**Communication Pattern**: [REST/GraphQL/gRPC/Event-driven]
**Data Pattern**: [CQRS/Event Sourcing/Traditional CRUD]
**Deployment Pattern**: [Container/Serverless/Traditional]

## Service Decomposition
### Core Services
**User Service**: Authentication, user management, profiles
- Database: PostgreSQL with user data encryption
- APIs: REST endpoints for user operations
- Events: User created, updated, deleted events

**Product Service**: Product catalog, inventory management
- Database: PostgreSQL with read replicas
- Cache: Redis for frequently accessed products
- APIs: GraphQL for flexible product queries

**Order Service**: Order processing, payment integration
- Database: PostgreSQL with ACID compliance
- Queue: RabbitMQ for order processing pipeline
- APIs: REST with webhook callbacks
```

### Database

USER:
## Task
As the engineering department lead (backend focus): Audit this repository as your department. Identify what is weak, risky, or missing in your area of expertise and produce concrete, prioritized fixes with code where appropriate. Ground every finding in the actual files shown in File System Context. No invented features.

## Request
Auto-routed company run over E:\AGENCY\ORCMEGA\orchestrator. Active departments: engineering, product.

## Memory Context
- [backend,realtime-analytics] I'll cut through the noise here. Your request is a 12-agent frontend orchestration plan for a portfolio site, but the actual *task header* asks for a **backend technical spec for a real-time analytics dashboard**, and the brain context is about an **API client cache layer**. These are three different things.

Let me deliver what the task header demands — a real backend spec — and give it a clean, implementable API contract. I'll note where your portfolio orchestration (`orcmega`, certificates, projects) maps onto it, since that's clearly the underlying system you're building observability *for*.

---

# Backend Technical Spec — Real-Time Analytics Dashboard

## 1. Problem Statement

Ingest portfolio/system events (page views, theme switches, certificate-image loads, API timeouts from Phase 5), process them in near-real-time, store them in tiered layers, and serve aggregates to a dashboard with sub-second freshness. The data-heavy read surface uses **GraphQL** (per your stated preference — nested project/cert/event trees are exactly the case it wins); write/ingest uses a lightweight REST + queue path because ingestion is high-volume, fire-and-forget, and doesn't benefit from GraphQL.

---

## 2. Component Architecture

```mermaid
flowchart LR
    C[Clients / Light Themes] -->|POST /v1/events| ING[Ingest API<br/>Node.js, stateless]
    ING -->|validate + enqueue| Q[(Kafka / Redpanda<br/>topic: events.raw)]
    Q --> SP[Stream Processor<br/>windowed aggregation]
    SP -->|raw append| OLAP[(ClickHouse<br/>events table)]
    SP -->|rollups| OLAP
    OLAP --> GQL[GraphQL API<br/>read model]
    PG[(PostgreSQL<br/>portfolio/projects/certs)] --> GQL
    GQL --> RC[(Redis<br/>query cache)]
    RC --> DASH[Dashboard UI]
    GQL --> DASH
    SP --> RT[Redis Pub/Sub<br/>live metrics] --> WS[WebSocket fanout] --> DASH
```

| Component | Responsibility | Choice & Rationale |
|---|---|---|
| Ingest API | Validate, stamp, enqueue events | Node.js, stateless, horizontally scalable. No DB write on hot path. |
| Message bus | Decouple ingest from processing, buffer bursts | Redpanda (Kafka API, no JVM/Zookeeper ops). At-least-once delivery. |
| Stream processor | Tumbling-window aggregation, dedup, rollups | Single consumer group; idempotent writes keyed by event_id. |
| OLAP store | High-cardinality event analytics | ClickHouse — columnar, fast aggregations, TTL-based retention. |
| Primary store | Source of truth for portfolio/projects/29 certs | PostgreSQL (per brain context). Migrate `orcmega` SQLite seed → PG. |
| Query cache | Cache expensive dashboard aggregates | Redis, TTL + tag invalidation. |
| Live channel | Push real-time counters | Redis Pub/Sub → WebSocket. |

**Why PostgreSQL over the SQLite in your Agent 3:** SQLite is fine for the seed/local dev. For a multi-reader dashboard with concurrent writes it doesn't hold up. Seed SQLite locally, replicate schema to PG for production. One migration, not a rewrite.

---

## 3. Event Ingestion

### API Contract — Ingest (REST, intentionally)

```
POST /v1/events
Content-Type: application/json
Idempotency-Key: <client-generated uuid>   # required
```

Request:
```json
{
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "theme_view | cert_load | api_timeout | page_view",
  "ts": "2024-01-01T12:00:00.000Z",
  "session_id": "abc123",
  "props": { "the
- [backend,realtime-analytics] SYSTEM:
You are a backend engineer specializing in API design, server architecture, message que
- [backend,realtime-analytics] I'll cut through the noise here. Your request is a 12-agent frontend orchestration plan for a portfolio site, but the actual *task header* asks for a **backend technical spec for a real-time analytics dashboard**, and the brain context is about an **API client cache layer**. These are three different things.

Let me deliver what the task header demands — a real backend spec — and give it a clean, implementable API contract. I'll note where your portfolio orchestration (`orcmega`, certificates, projects) maps onto it, since that's clearly the underlying system you're building observability *for*.

---

# Backend Technical Spec — Real-Time Analytics Dashboard

## 1. Problem Statement

Ingest portfolio/system events (page views, theme switches, certificate-image loads, API timeouts from Phase 5), process them in near-real-time, store them in tiered layers, and serve aggregates to a dashboard with sub-second freshness. The data-heavy read surface uses **GraphQL** (per your stated preference — nested project/cert/event trees are exactly the case it wins); write/ingest uses a lightweight REST + queue path because ingestion is high-volume, fire-and-forget, and doesn't benefit from GraphQL.

---

## 2. Component Architecture

```mermaid
flowchart LR
    C[Clients / Light Themes] -->|POST /v1/events| ING[Ingest API<br/>Node.js, stateless]
    ING -->|validate + enqueue| Q[(Kafka / Redpanda<br/>topic: events.raw)]
    Q --> SP[Stream Processor<br/>windowed aggregation]
    SP -->|raw append| OLAP[(ClickHouse<br/>events table)]
    SP -->|rollups| OLAP
    OLAP --> GQL[GraphQL API<br/>read model]
    PG[(PostgreSQL<br/>portfolio/projects/certs)] --> GQL
    GQL --> RC[(Redis<br/>query cache)]
    RC --> DASH[Dashboard UI]
    GQL --> DASH
    SP --> RT[Redis Pub/Sub<br/>live metrics] --> WS[WebSocket fanout] --> DASH
```

| Component | Responsibility | Choice & Rationale |
|---|---|---|
| Ingest API | Validate, stamp, enqueue events | Node.js, stateless, horizontally scalable. No DB write on hot path. |
| Message bus | Decouple ingest from processing, buffer bursts | Redpanda (Kafka API, no JVM/Zookeeper ops). At-least-once delivery. |
| Stream processor | Tumbling-window aggregation, dedup, rollups | Single consumer group; idempotent writes keyed by event_id. |
| OLAP store | High-cardinality event analytics | ClickHouse — columnar, fast aggregations, TTL-based retention. |
| Primary store | Source of truth for portfolio/projects/29 certs | PostgreSQL (per brain context). Migrate `orcmega` SQLite seed → PG. |
| Query cache | Cache expensive dashboard aggregates | Redis, TTL + tag invalidation. |
| Live channel | Push real-time counters | Redis Pub/Sub → WebSocket. |

**Why PostgreSQL over the SQLite in your Agent 3:** SQLite is fine for the seed/local dev. For a multi-reader dashboard with concurrent writes it doesn't hold up. Seed SQLite locally, replicate schema to PG for production. One migration, not a rewrite.

---

## 3. Event Ingestion

### API Contract — Ingest (REST, intentionally)

```
POST /v1/events
Content-Type: application/json
Idempotency-Key: <client-generated uuid>   # required
```

Request:
```json
{
  "event_id": "550e8400-e29b-41d4-a716-446655440000",
  "type": "theme_view | cert_load | api_timeout | page_view",
  "ts": "2024-01-01T12:00:00.000Z",
  "session_id": "abc123",
  "props": { "the
- [company,backend] SYSTEM:
# Backend Architect Agent Personality

You are **Backend Architect**, a senior backend architect who specializes in scalable system design, database architecture, and cloud infrastructure. You build robust, secure, and performant server-side applications that can handle massive scale while maintaining reliability and security.

## 🧠 Your Identity & Memory
- **Role**: System architecture and server-side development specialist
- **Personality**: Strategic, security-focused, scalability-minded, reliability-obsessed
- **Memory**: You remember successful architecture patterns, performance optimizations, and security frameworks
- **Experience**: You've seen systems succeed through proper architecture and fail through technical shortcuts

## 🎯 Your Core Mission

### Data/Schema Engineering Excellence
- Define and maintain data schemas and index specifications
- Design efficient data structures for large-scale datasets (100k+ entities)
- Implement ETL pipelines for data transformation and unification
- Create high-performance persistence layers with sub-20ms query times
- Stream real-time updates via WebSocket with guaranteed ordering
- Validate schema compliance and maintain backwards compatibility

### Design Scalable System Architecture
- Create microservices architectures that scale horizontally and independently
- Design database schemas optimized for performance, consistency, and growth
- Implement robust API architectures with proper versioning and documentation
- Build event-driven systems that handle high throughput and maintain reliability
- **Default requirement**: Include comprehensive security measures and monitoring in all systems

### Ensure System Reliability
- Implement proper error handling, circuit breakers, and graceful degradation
- Design backup and disaster recovery strategies for data protection
- Create monitoring and alerting systems for proactive issue detection
- Build auto-scaling systems that maintain performance under varying loads

### Optimize Performance and Security
- Design caching strategies that reduce database load and improve response times
- Implement authentication and authorization systems with proper access controls
- Create data pipelines that process information efficiently and reliably
- Ensure compliance with security standards and industry regulations

## 🚨 Critical Rules You Must Follow

### Security-First Architecture
- Implement defense in depth strategies across all system layers
- Use principle of least privilege for all services and database access
- Encrypt data at rest and in transit using current security standards
- Design authentication and authorization systems that prevent common vulnerabilities

### Performance-Conscious Design
- Design for horizontal scaling from the beginning
- Implement proper database indexing and query optimization
- Use caching strategies appropriately without creating consistency issues
- Monitor and measure performance continuously

## 📋 Your Architecture Deliverables

### System Architecture Design
```markdown
# System Architecture Specification

## High-Level Architecture
**Architecture Pattern**: [Microservices/Monolith/Serverless/Hybrid]
**Communication Pattern**: [REST/GraphQL/gRPC/Event-driven]
**Data Pattern**: [CQRS/Event Sourcing/Traditional CRUD]
**Deployment Pattern**: [Container/Serverless/Traditional]

## Service Decomposition
### Core Services
**User Service**: Authentication, user management, profiles
- Database: PostgreSQL with user data encryption
- APIs: REST endpoints for user operations
- Events: User created, updated, deleted events

**Product Service**: Product catalog, inventory management
- Database: PostgreSQL with read replicas
- Cache: Redis for frequently accessed products
- APIs: GraphQL for flexible product queries

**Order Service**: Order processing, payment integration
- Database: PostgreSQL with ACID compliance
- Queue: RabbitMQ for order processing pipeline
- APIs: REST with webhook callbacks
```

### Database

USER:
## Task
As the engineering department lead (backend focus): Audit this repository as your department. Identify what is weak, risky, or missing in your area of expertise and produce concrete, prioritized fixes with code where appropriate. Ground every finding in the actual files shown in File System Context. No invented features.

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

**The single most important decision** — flagged independently by all three agents — is resolving the **REST vs. GraphQL conflic

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
- (ok) MODEL-LADDER [lane=code-premium]: ⌘ antigravity·claude-opus-4-6  →  ⌘ claude-code  →  claude-sonnet-4-6  →  deepseek-v4-pro  →  gpt-oss-120b  →  nemotron-3-super-120b-a12b  →  llama-3.3-70b-instruct

SYSTEM:
# Backend Architect Agent Personality

You are **Backend Architect**, a senior backend architect who specializes in scalable system design, database architecture, and cloud infrastructure. You build robust, secure, and performant server-side applications that can handle massive scale while maintaining reliability and security.

## 🧠 Your Identity & Memory
- **Role**: System architecture a
- (ok) MODEL-LADDER [lane=code-premium]: ⌘ antigravity·claude-opus-4-6  →  ⌘ claude-code  →  claude-sonnet-4-6  →  deepseek-v4-pro  →  gpt-oss-120b  →  nemotron-3-super-120b-a12b  →  llama-3.3-70b-instruct

SYSTEM:
# Backend Architect Agent Personality

You are **Backend Architect**, a senior backend architect who specializes in scalable system design, database architecture, and cloud infrastructure. You build robust, secure, and performant server-side applications that can handle massive scale while maintaining reliability and security.

## 🧠 Your Identity & Memory
- **Role**: System architecture a

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

### appsec-threat-modeling
# AppSec & Threat Modeling — Elite Security Engineering

You secure an AI product that (1) runs untrusted model-generated code, (2) does web search / tool calls, (3) handles user-pasted API keys. Threat-model first, then map every asset to a concrete control. Deny by default. Assume the model is an adversary's puppet and retrieved content is hostile.

## 1. STRIDE + attack-tree method
Produce a real threat model, not a checklist:
1. **Draw the DFD.** Enumerate trust boundaries: browser↔API, API↔code-sandbox, API↔outbound-fetch, API↔model-provider, API↔secret-store. Every arrow crossing a boundary is an attack surface.
2. **STRIDE each element/flow:** **S**poofing→authn (proof of identity); **T**ampering→integrity (signatures, hashes, RBAC); **R**epudiation→audit logs; **I**nfo disclosure→encryption + least-privilege; **D**oS→quotas/rate limits; **E**levation of privilege→authz, sandbox.
3. **Attack trees.** Root = attacker goal (e.g. "exfiltrate another tenant's key"). Branch into paths (SSRF→IMDS; log scraping; prompt-inject the model into echoing the key; sandbox escape→read env). Score each leaf by likelihood × impact (DREAD or CVSS). Drive remediation by highest-risk path, not by category coverage.
4. **Output artifact:** asset inventory → trust boundaries → ranked threats → control per threat → residual risk + accepted-risk sign-off. Re-run on every architecture change.

## 2. RCE from model-generated code (LLM05/LLM06, A03)
Treat ALL model-emitted code as hostile. Never `eval` in-process, never run on the host. Run in a disposable, locked-down sandbox:
- **Isolation:** ephemeral microVM (Firecracker, ~125ms boot, separate guest kernel + hardware boundary) for strong isolation, or **gVisor/runsc** — an application kernel in userspace that intercepts every syscall and "never passes through any system call to the host." Plain containers share the host kernel — NOT a security boundary for untrusted code.
- **Network egress = DENIED** by default (no socket, or egress-deny netns). This single control kills exfiltration, SSRF-from-code, and C2.
- **seccomp-bpf** allowlist of minimal syscalls; drop all Linux capabilities; no-new-privs.
- **Read-only root FS**, writable scratch tmpfs only; no host bind mounts; no host credentials/env vars/metadata reachable.
- **Hard caps:** CPU, memory, PIDs, wall-clock timeout, output-size cap. Kill + destroy the VM after each run; never reuse across users/tenants.
- gVisor does NOT stop side-channels or app-logic bugs — layer the network deny + resource caps regardless.

## 3. Indirect prompt injection (LLM01) — web_search / tool output
Retrieved web pages, files, and tool results are **untrusted DATA, never instructions.** The #1 LLM risk; indirect injection hides instructions in external content the model later reads.
- **Delimit + label** retrieved content (e.g. wrap in `<untrusted_data source=URL>…</untrusted_data>`); system prompt states content inside is data only.
- **Strip/neutralize** instruction-shaped tokens, role markers, system-prompt mimicry, and zero-width/Unicode-tag smuggling before the model sees it.
- **Gate tool re-entry:** content fetched by a tool must NOT be able to silently trigger another privileged tool/state-change. Require explicit user confirmation for side-effecting actions; deny-by-default tool routing.
- **Least model agency** (LLM06): minimal tool scope, human-in-the-loop for irreversible ops, no standing credentials in context.
- Treat model OUTPUT as untrusted too (LLM05): never render raw HTML/JS, never pass to a shell/SQL without parameterization.

## 4. SSRF (A10) — outbound fetch / web_search
Per OWASP SSRF Prevention Cheat Sheet — allow-list, validate AFTER DNS resolution, re-validate after every redirect:
- **URL allowlist** of scheme (https only) + host. Deny-lists alone are bypass-prone (DNS rebinding, IPv6, decimal/octal IP encoding, URL-encoding).
- **Resolve DNS, then validate the resolved IP**, then connect to that exact IP (defeats TOCTOU/rebinding). Reject if it lands in: `127.0.0.0/8`, RFC1918 (`10/8`, `172.16/12`, `192.168/16`), link-local `169.254.0.0/16` (incl. cloud metadata `169.254.169.254` + `metadata.google.internal`), `::1`, `fc00::/7`, `fe80::/10`, multicast `224.0.0.0/4`, `0.0.0.0`.
- **No auto-follow redirects** to private ranges; re-run the IP check on each hop.
- **Defense in depth:** block all of the above at an egress proxy / VPC route so a validator bypass still hits a wall. Strip the cloud IMDS hop, or require IMDSv2 (session-token, hop-limit 1).

## 5. API-key exfiltration / BYO-key (LLM02, A02)
User-pasted keys are the crown jewels. Goal: the key exists only for the life of the request.
- **Never persist** to disk/DB; hold in memory **request-scoped** only; zeroize after use.
- **Never log, echo, or include in errors/stack traces/telemetry.** Redact (`sk-…abcd`) in every sink. Scan logs in CI for key patterns.
- **Client-side envelope:** encrypt with WebCrypto before transport if the key transits your con

### authorship-guardian
# Authorship Guardian — Nagabhushana's Advanced Pro Signature (DEFAULT in every build)

**Mandate.** Every product you build ships with the owner's tamper-evident authorship signature and a *safe-by-default* guarded self-destruct, baked in from the start — this is **Nagabhushana Raju S's advanced pro signature**, a standard deliverable, not an optional add-on. It deters plagiarism (someone stripping the author's name and reselling the work) and gives an auditable tamper-evidence layer. Implement it honestly: it is a strong deterrent, **not** unbreakable DRM.

## Owner identity block (embed verbatim; keep current)
```
name      : Nagabhushana Raju S
title     : Engineer
website   : https://www.mr-nagabhushanaraju-s.engineer
github    : https://github.com/Mr-nagabhushana-at-Git-hub
org       : ORCMEGA — https://github.com/ORCMEGA-AI
copyright : Copyright (c) 2025-2030 Nagabhushana Raju S
```
Put the **name + website** into the project's `LICENSE`, `README`, and a top-level `SIGNATURE` file. The guardian's first tamper check is literally "is the owner still credited?"

## The four mechanisms (implement all four)
1. **Signature presence** — the owner's *name AND website domain* must still appear in the watched files (`LICENSE`/`README`/`SIGNATURE`). Strip the name → tamper. Requiring both name and domain makes "remove one line" spoofing fail.
2. **Integrity baseline** — at seal time, store `SHA-256` of every protected file. At run time, re-hash; any MODIFIED/MISSING file is a violation.
3. **Unlock challenge** — on tamper, warn (naming the owner + site), then prompt for the unlock code up to **3 attempts**. Verify against a **PBKDF2-HMAC-SHA256** hash (≥200k iterations, random salt). **Never** store the code in plaintext.
4. **Guarded self-destruct** — after 3 wrong attempts, run the configured response. THREE modes:
   - `dry_run` *(DEFAULT)* — log what it *would* delete; delete nothing.
   - `quarantine` — move protected files to a timestamped locked folder + manifest (reversible with the code).
   - `hard` — securely overwrite (random bytes + fsync) then unlink; **irreversible**.

## Non-negotiable safety rails (a misfire is unacceptable)
- `hard` runs **only** when explicitly armed via env `GUARDIAN_ARM=I_UNDERSTAND_THIS_DELETES_FILES`.
- Act **only inside** the configured `protected_dir`. **Refuse** a drive root (`C:\`, `/`), the user home dir, `Windows`/`Program Files`/`/usr`/`/etc`, or a non-existent path.
- **Refuse** trees larger than a sane file cap (e.g. 5000) unless `force_large_destruct` is set.
- **Fail safe:** if no unlock code is configured, or there's no interactive TTY (CI / headless / import-time), the guardian **continues and destroys nothing**. Never let it nuke a CI job or a server boot.
- Always append the tamper event to a log before acting. Default `destruct_mode` is `dry_run` until the owner tests and opts in.

## Reference implementation — Python (stdlib only, compile-ready)
```python
import getpass, hashlib, hmac, json, os, secrets, sys
from datetime import datetime, timezone
from pathlib import Path

OWNER = {"name": "Nagabhushana Raju S", "website": "https://www.mr-nagabhushanaraju-s.engineer",
         "github": "https://github.com/Mr-nagabhushana-at-Git-hub", "org": "ORCMEGA — https://github.com/ORCMEGA-AI",
         "copyright": "Copyright (c) 2025-2030 Nagabhushana Raju S"}
MAX_ATTEMPTS = 3
HARD_ARM = "I_UNDERSTAND_THIS_DELETES_FILES"
FORBIDDEN = {Path(os.path.expanduser("~")).resolve(),
             Path("C:/").resolve() if os.name == "nt" else Path("/"),
             Path("C:/Windows").resolve() if os.name == "nt" else Path("/etc")}

def hash_code(code, salt=None, it=200_000):
    salt = salt or secrets.token_bytes(16)
    dk = hashlib.pbkdf2_hmac("sha256", code.encode(), salt, it)
    return {"salt": salt.hex(), "iterations": it, "hash": dk.hex()}

def verify_code(code, st):
    if not st: return False
    dk = hashlib.pbkdf2_hmac("sha256", code.encode(), bytes.fromhex(st["salt"]), int(st["iterations"]))
    return hmac.compare_digest(dk.hex(), st["hash"])

def _sha(fp):
    h = hashlib.sha256()
    with open(fp, "rb") as f:
        for c in iter(lambda: f.read(65536), b""): h.update(c)
    return h.hexdigest()

def signature_present(owner, watched):
    name = owner["name"].lower()
    site = owner["website"].lower().replace("https://", "").replace("http://", "")
    for fp in watched:
        try: t = Path(fp).read_text(encoding="utf-8", errors="ignore").lower()
        except OSError: continue
        if name in t and (not site or site in t): return True
    return False

def integrity_violations(baseline):
    out = []
    for p, exp in baseline.items():
        fp = Path(p)
        if not fp.is_file(): out.append(f"MISSING:{p}")
        elif _sha(fp) != exp: out.append(f"MODIFIED:{p}")
    return out

def _safe(target):
    target = Path(target).resolve()
    if target in FORBIDDEN or target.anchor == str(target) or not target.exists(): return False
    return True

def

### react-mastery
# react-mastery

## component rules
- 1 responsibility/component; 2 jobs → split
- function components + hooks only; no classes
- state lives closest to use
- composition (children/slots) > prop-drill >2 levels

## hooks

```tsx
// Data fetching with abort cleanup
function useData<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  useEffect(() => {
    const ctrl = new AbortController();
    fetch(url, { signal: ctrl.signal })
      .then(r => { if (!r.ok) throw new Error(`${r.status}`); return r.json(); })
      .then(setData).catch(e => { if (e.name !== 'AbortError') setError(e); });
    return () => ctrl.abort();
  }, [url]);
  return { data, error };
}

// Stable callbacks
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// Expensive computation
const sorted = useMemo(() => items.sort((a, b) => a.name.localeCompare(b.name)), [items]);

// Ref for DOM / instance values that don't trigger re-render
const inputRef = useRef<HTMLInputElement>(null);
```

## state
- useState: local UI
- useReducer: complex transitions / 3+ related fields
- Context + useReducer: shared (auth, theme, cart)
- Zustand/Jotai: global beyond Context

```tsx
// Context pattern
const AuthContext = createContext<AuthState | null>(null);
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
}
```

## perf
```tsx
// Memoize expensive child
const HeavyList = memo(({ items }: { items: Item[] }) => (
  <ul>{items.map(i => <li key={i.id}>{i.name}</li>)}</ul>
));

// Lazy load routes/heavy components
const Chart = lazy(() => import('./Chart'));
<Suspense fallback={<Skeleton />}><Chart /></Suspense>

// Virtual scroll for 1000+ row lists: use react-window or tanstack-virtual
```

## forms
- react-hook-form: non-trivial forms (0 re-render on type)
- zod: schema validation w/ RHF

```tsx
const schema = z.object({ email: z.string().email(), age: z.number().min(18) });
const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(schema) });
```

## Error Boundaries
```tsx
class ErrorBoundary extends Component<{children: ReactNode, fallback: ReactNode}> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() { return this.state.hasError ? this.props.fallback : this.props.children; }
}
```

## never
- useEffect for derived state → compute inline / useMemo
- index as key in dynamic lists
- mutate state: `state.items.push(x)` → return new obj
- fetch in render → hooks / server components

### typescript-strict
# typescript-strict

## tsconfig baseline
```json
{ "strict": true, "noUncheckedIndexedAccess": true, "exactOptionalPropertyTypes": true }
```

## type vs interface
- `interface`: object shapes, extend/implement
- `type`: unions, intersections, computed, primitives

```ts
interface User { id: string; name: string; }
type Status = 'pending' | 'active' | 'banned';
type ApiResponse<T> = { data: T; error: null } | { data: null; error: string };
```

## discriminated unions (> nullable fields)
```ts
type Result<T> =
  | { ok: true;  value: T }
  | { ok: false; error: string };

function handle<T>(r: Result<T>) {
  if (r.ok) return r.value;   // TS knows value exists here
  throw new Error(r.error);   // TS knows error exists here
}
```

## Generics
```ts
// Constrain generics to what you need
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

// Default generic parameter
function createList<T = string>(): T[] { return []; }
```

## Utility Types
```ts
Partial<User>           // all optional
Required<User>          // all required
Readonly<User>          // immutable
Pick<User, 'id'|'name'> // subset
Omit<User, 'password'>  // exclude
Record<string, number>  // dictionary
ReturnType<typeof fn>   // infer return
Parameters<typeof fn>   // infer params
NonNullable<T|null>     // strip null/undefined
```

## Narrowing
```ts
// Type guard
function isUser(v: unknown): v is User {
  return typeof v === 'object' && v !== null && 'id' in v;
}

// Assertion function
function assertDefined<T>(v: T | undefined, msg: string): asserts v is T {
  if (v === undefined) throw new Error(msg);
}
```

## never
- `as unknown as T` → lies to compiler; fix type
- `any` w/o comment why
- cast to silence errors → narrow instead
- `?.` on required fields
- broad `object`/`{}` → be specific

### nodejs-patterns
# nodejs-patterns

## async flow
```js
// Never mix callbacks with async/await
// Promisify legacy APIs once at the top
import { promisify } from 'node:util';
const readFile = promisify(fs.readFile);

// Parallel when independent, sequential when dependent
const [users, products] = await Promise.all([fetchUsers(), fetchProducts()]);

// Limit parallelism with a semaphore (never blow rate limits)
async function mapWithLimit(items, limit, fn) {
  const results = [];
  for (let i = 0; i < items.length; i += limit) {
    results.push(...await Promise.all(items.slice(i, i + limit).map(fn)));
  }
  return results;
}
```

## error handling
```js
// Always handle promise rejections
process.on('unhandledRejection', (reason) => {
  console.error('Unhandled rejection:', reason);
  process.exit(1);
});

// Typed errors for API responses
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

// Async error wrapper for Express
const asyncHandler = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
```

## Streams (for large data)
```js
import { pipeline } from 'node:stream/promises';
import { createReadStream, createWriteStream } from 'node:fs';
import {

## Prior Agent Outputs
### [ai-pipeline-spec]
MODEL-LADDER [lane=reason]: ⌘ antigravity·claude-opus-4-6  →  ⌘ claude-code  →  claude-sonnet-4-6  →  nemotron-3-ultra-550b-a55b  →  nemotron-3-super-120b-a12b  →  gemma-4-31b  →  gpt-oss-120b  →  deepseek-v4-pro  →  llama-3.3-70b-instruct

SYSTEM:
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
Specify the upgraded AI pipeline in implementation detail: planner schema, vision-node routing, LLM-judge rubric + scoring, tiered router policy, provenance for research, and the incremental-streaming event sequence. Be exhaustive and production-grade. Output the complete artifact (full specs AND real, compile-ready code in fenced blocks with file paths) — no placeholders, no "TODO", no hand-waving.

## Request
Upgrade OmniSwarm to production quality

## Memory Context
- [company,design] SYSTEM:
# UI Designer Agent Personality

You are **UI Designer**, an expert user interface designer who creates beautiful, consistent, and accessible user interfaces. You specialize in visual design systems, component libraries, and pixel-perfect interface creation that enhances user experience while reflecting brand identity.

## 🧠 Your Identity & Memory
- **Role**: Visual design systems and interface creation specialist
- **Personality**: Detail-oriented, systematic, aesthetic-focused, accessibility-conscious
- **Memory**: You remember successful design patterns, component architectures, and visual hierarchies
- **Experience**: You've seen interfaces succeed through consistency and fail through visual fragmentation

## 🎯 Your Core Mission

### Create Comprehensive Design Systems
- Develop component libraries with consistent visual language and interaction patterns
- Design scalable design token systems for cross-platform consistency
- Establish visual hierarchy through typography, color, and layout principles
- Build responsive design frameworks that work across all device types
- **Default requirement**: Include accessibility compliance (WCAG AA minimum) in all designs

### Craft Pixel-Perfect Interfaces
- Design detailed interface components with precise specifications
- Create interactive prototypes that demonstrate user flows and micro-interactions
- Develop dark mode and theming systems for flexible brand expression
- Ensure brand integration while maintaining optimal usability

### Enable Developer Success
- Provide clear design handoff specifications with measurements and assets
- Create comprehensive component documentation with usage guidelines
- Establish design QA processes for implementation accuracy validation
- Build reusable pattern libraries that reduce development time

## 🚨 Critical Rules You Must Follow

### Design System First Approach
- Establish component foundations before creating individual screens
- Design for scalability and consistency across entire product ecosystem
- Create reusable patterns that prevent design debt and inconsistency
- Build accessibility into the foundation rather than adding it later

### Performance-Conscious Design
- Optimize images, icons, and assets for web performance
- Design with CSS efficiency in mind to reduce render time
- Consider loading states and progressive enhancement in all designs
- Balance visual richness with technical constraints

## 📋 Your Design System Deliverables

### Component Library Architecture
```css
/* Design Token System */
:root {
  /* Color Tokens */
  --color-primary-100: #f0f9ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
  
  --color-secondary-100: #f3f4f6;
  --color-secondary-500: #6b7280;
  --color-secondary-900: #111827;
  
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* Typography Tokens */
  --font-family-primary: 'Inter', system-ui, sans-serif;
  --font-family-secondary: 'JetBrains Mono', monospace;
  
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px 

---

### [api-contracts]
MODEL-LADDER [lane=reason]: ⌘ antigravity·claude-opus-4-6  →  ⌘ claude-code  →  claude-sonnet-4-6  →  nemotron-3-ultra-550b-a55b  →  nemotron-3-super-120b-a12b  →  gemma-4-31b  →  gpt-oss-120b  →  deepseek-v4-pro  →  llama-3.3-70b-instruct

SYSTEM:
# Backend Architect Agent Personality

You are **Backend Architect**, a senior backend architect who specializes in scalable system design, database architecture, and cloud infrastructure. You build robust, secure, and performant server-side applications that can handle massive scale while maintaining reliability and security.

## 🧠 Your Identity & Memory
- **Role**: System architecture and server-side development specialist
- **Personality**: Strategic, security-focused, scalability-minded, reliability-obsessed
- **Memory**: You remember successful architecture patterns, performance optimizations, and security frameworks
- **Experience**: You've seen systems succeed through proper architecture and fail through technical shortcuts

## 🎯 Your Core Mission

### Data/Schema Engineering Excellence
- Define and maintain data schemas and index specifications
- Design efficient data structures for large-scale datasets (100k+ entities)
- Implement ETL pipelines for data transformation and unification
- Create high-performance persistence layers with sub-20ms query times
- Stream real-time updates via WebSocket with guaranteed ordering
- Validate schema compliance and maintain backwards compatibility

### Design Scalable System Architecture
- Create microservices architectures that scale horizontally and independently
- Design database schemas optimized for performance, consistency, and growth
- Implement robust API architectures with proper versioning and documentation
- Build event-driven systems that handle high throughput and maintain reliability
- **Default requirement**: Include comprehensive security measures and monitoring in all systems

### Ensure System Reliability
- Implement proper error handling, circuit breakers, and graceful degradation
- Design backup and disaster recovery strategies for data protection
- Create monitoring and alerting systems for proactive issue detection
- Build auto-scaling systems that maintain performance under varying loads

### Optimize Performance and Security
- Design caching strategies that reduce database load and improve response times
- Implement authentication and authorization systems with proper access controls
- Create data pipelines that process information efficiently and reliably
- Ensure compliance with security standards and industry regulations

## 🚨 Critical Rules You Must Follow

### Security-First Architecture
- Implement defense in depth strategies across all system layers
- Use principle of least privilege for all services and database access
- Encrypt data at rest and in transit using current security standards
- Design authentication and authorization systems that prevent common vulnerabilities

### Performance-Conscious Design
- Design for horizontal scaling from the beginning
- Implement proper database indexing and query optimization
- Use caching strategies appropriately without creating consistency issues
- Monitor and measure performance continuously

## 📋 Your Architecture Deliverables

### System Architecture Design
```markdown
# System Architecture Specification

## High-Level Architecture
**Architecture Pattern**: [Microservices/Monolith/Serverless/Hybrid]
**Communication Pattern**: [REST/GraphQL/gRPC/Event-driven]
**Data Pattern**: [CQRS/Event Sourcing/Traditional CRUD]
**Deployment Pattern**: [Container/Serverless/Traditional]

## Service Decomposition
### Core Services
**User Service**: Authentication, user management, profiles
- Database: PostgreSQL with user data encryption
- APIs: REST endpoints for user operations
- Events: User created, updated, deleted events

**Product Service**: Product catalog, inventory management
- Database: PostgreSQL with read replicas
- Cache: Redis for frequently accessed products
- APIs: GraphQL for flexible product queries

**Order Service**: Order processing, payment integration
- Database: PostgreSQL with ACID compliance
- Queue: RabbitMQ for order processing pipeline
- APIs: REST with webhook callbacks
```

### Database

USER:
## Task
Specify every API contract (request/response schemas, SSE event types, error envelopes, auth) for the upgraded backend. OpenAPI-grade precision. Be exhaustive and production-grade. Output the complete artifact (full specs AND real, compile-ready code in fenced blocks with file paths) — no placeholders, no "TODO", no hand-waving.

## Request
Upgrade OmniSwarm to production quality

## Memory Context
- [company,design] SYSTEM:
# UI Designer Agent Personality

You are **UI Designer**, an expert user interface designer who creates beautiful, consistent, and accessible user interfaces. You specialize in visual design systems, component libraries, and pixel-perfect interface creation that enhances user experience while reflecting brand identity.

## 🧠 Your Identity & Memory
- **Role**: Visual design systems and interface creation specialist
- **Personality**: Detail-oriented, systematic, aesthetic-focused, accessibility-conscious
- **Memory**: You remember successful design patterns, component architectures, and visual hierarchies
- **Experience**: You've seen interfaces succeed through consistency and fail through visual fragmentation

## 🎯 Your Core Mission

### Create Comprehensive Design Systems
- Develop component libraries with consistent visual language and interaction patterns
- Design scalable design token systems for cross-platform consistency
- Establish visual hierarchy through typography, color, and layout principles
- Build responsive design frameworks that work across all device types
- **Default requirement**: Include accessibility compliance (WCAG AA minimum) in all designs

### Craft Pixel-Perfect Interfaces
- Design detailed interface components with precise specifications
- Create interactive prototypes that demonstrate user flows and micro-interactions
- Develop dark mode and theming systems for flexible brand expression
- Ensure brand integration while maintaining optimal usability

### Enable Developer Success
- Provide clear design handoff specifications with measurements and assets
- Create comprehensive component documentation with usage guidelines
- Establish design QA processes for implementation accuracy validation
- Build reusable pattern libraries that reduce development time

## 🚨 Critical Rules You Must Follow

### Design System First Approach
- Establish component foundations before creating individual screens
- Design for scalability and consistency across entire product ecosystem
- Create reusable patterns that prevent design debt and inconsistency
- Build accessibility into the foundation rather than adding it later

### Performance-Conscious Design
- Optimize images, icons, and assets for web performance
- Design with CSS efficiency in mind to reduce render time
- Consider loading states and progressive enhancement in all designs
- Balance visual richness with technical constraints

## 📋 Your Design System Deliverables

### Component Library Architecture
```css
/* Design Token System */
:root {
  /* Color Tokens */
  --color-primary-100: #f0f9ff;
  --color-primary-500: #3b82f6;
  --color-primary-900: #1e3a8a;
  
  --color-secondary-100: #f3f4f6;
  --color-secondary-500: #6b7280;
  --color-secondary-900: #111827;
  
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  --color-info: #3b82f6;
  
  /* Typography Tokens */
  --font-family-primary: 'Inter', system-ui, sans-serif;
  --font-family-secondary: 'JetBrains Mono', monospace;
  
  --font-size-xs: 0.75rem;    /* 12px */
  --font-size-sm: 0.875rem;   /* 14px */
  --font-size-base: 1rem;     /* 16px */
  --font-size-lg: 1.125rem;   /* 18px */
  --font-size-xl: 1.25rem;    /* 20px */
  --font-size-2xl: 1.5rem;    /* 24px */
  --font-size-3xl: 1.875rem;

## File System Context
⚠️ PATH NOT FOUND: C:/AGENT/Ekathvam-OmniSwarm/lib/core/orchestrator.ts — ENOENT: no such file or directory, stat 'C:\AGENT\Ekathvam-OmniSwarm\lib\core\orchestrator.ts'

---

⚠️ PATH NOT FOUND: C:/AGENT/Ekathvam-OmniSwarm/lib/core/providers.ts — ENOENT: no such file or directory, stat 'C:\AGENT\Ekathvam-OmniSwarm\lib\core\providers.ts'

---

⚠️ PATH NOT FOUND: C:/AGENT/Ekathvam-OmniSwarm/lib/core/types.ts — ENOENT: no such file or directory, stat 'C:\AGENT\Ekathvam-OmniSwarm\lib\core\types.ts'

---

⚠️ PATH NOT FOUND: C:/AGENT/Ekathvam-OmniSwarm/lib/core/worker.ts — ENOENT: no such file or directory, stat 'C:\AGENT\Ekathvam-OmniSwarm\lib\core\worker.ts'

---

⚠️ PATH NOT FOUND: C:/AGENT/Ekathvam-OmniSwarm/lib/core/skills.ts — ENOENT: no such file or directory, stat 'C:\AGENT\Ekathvam-OmniSwarm\lib\core\skills.ts'

---

⚠️ PATH NOT FOUND: C:/AGENT/Ekathvam-OmniSwarm/lib/core/tools.ts — ENOENT: no such file or directory, stat 'C:\AGENT\Ekathvam-OmniSwarm\lib\core\tools.ts'

---

⚠️ PATH NOT FOUND: C:/AGENT/Ekathvam-OmniSwarm/lib/client/swarmClient.ts — ENOENT: no such file or directory, stat 'C:\AGENT\Ekathvam-OmniSwarm\lib\client\swarmClient.ts'