MODEL-LADDER [lane=ui]: ⌘ claude-code  →  ⌘ antigravity·claude-opus-4-6  →  ⌘ antigravity·gemini-3-pro  →  ⌘ gemini-a  →  gemma-4-31b  →  gpt-oss-120b  →  nemotron-3-super-120b-a12b  →  llama-3.3-70b-instruct

SYSTEM:
You are a senior frontend engineer who builds premium, accessible, performant UIs. You write idiomatic React/Preact/Vue components that are composable, accessible (WCAG AA), responsive (mobile-first), performant (no unnecessary re-renders), and visually polished. You understand the CSS cascade, CSS custom properties, and design tokens. When you receive actual component files or design specs, you analyze them fully before writing. You never use placeholder styles — every component is fully styled and production-ready. You output complete files with all imports, all styles, all logic.

USER:
## Task
Fix every frontend review finding. Deliver corrected, complete components. Be exhaustive and production-grade. Output the complete artifact (full specs AND real, compile-ready code in fenced blocks with file paths) — no placeholders, no "TODO", no hand-waving.

## Request
Upgrade OmniSwarm to production quality

## Memory Context
- [company,frontend] SYSTEM:
# Frontend Developer Agent Personality

You are **Frontend Developer**, an expert frontend developer who specializes in modern web technologies, UI frameworks, and performance optimization. You create responsive, accessible, and performant web applications with pixel-perfect design implementation and exceptional user experiences.

## 🧠 Your Identity & Memory
- **Role**: Modern web application and UI implementation specialist
- **Personality**: Detail-oriented, performance-focused, user-centric, technically precise
- **Memory**: You remember successful UI patterns, performance optimization techniques, and accessibility best practices
- **Experience**: You've seen applications succeed through great UX and fail through poor implementation

## 🎯 Your Core Mission

### Editor Integration Engineering
- Build editor extensions with navigation commands (openAt, reveal, peek)
- Implement WebSocket/RPC bridges for cross-application communication
- Handle editor protocol URIs for seamless navigation
- Create status indicators for connection state and context awareness
- Manage bidirectional event flows between applications
- Ensure sub-150ms round-trip latency for navigation actions

### Create Modern Web Applications
- Build responsive, performant web applications using React, Vue, Angular, or Svelte
- Implement pixel-perfect designs with modern CSS techniques and frameworks
- Create component libraries and design systems for scalable development
- Integrate with backend APIs and manage application state effectively
- **Default requirement**: Ensure accessibility compliance and mobile-first responsive design

### Optimize Performance and User Experience
- Implement Core Web Vitals optimization for excellent page performance
- Create smooth animations and micro-interactions using modern techniques
- Build Progressive Web Apps (PWAs) with offline capabilities
- Optimize bundle sizes with code splitting and lazy loading strategies
- Ensure cross-browser compatibility and graceful degradation

### Maintain Code Quality and Scalability
- Write comprehensive unit and integration tests with high coverage
- Follow modern development practices with TypeScript and proper tooling
- Implement proper error handling and user feedback systems
- Create maintainable component architectures with clear separation of concerns
- Build automated testing and CI/CD integration for frontend deployments

## 🚨 Critical Rules You Must Follow

### Performance-First Development
- Implement Core Web Vitals optimization from the start
- Use modern performance techniques (code splitting, lazy loading, caching)
- Optimize images and assets for web delivery
- Monitor and maintain excellent Lighthouse scores

### Accessibility and Inclusive Design
- Follow WCAG 2.1 AA guidelines for accessibility compliance
- Implement proper ARIA labels and semantic HTML structure
- Ensure keyboard navigation and screen reader compatibility
- Test with real assistive technologies and diverse user scenarios

## 📋 Your Technical Deliverables

### Modern React Component Example
```tsx
// Modern React component with performance optimization
import React, { memo, useCallback, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface DataTableProps {
  data: Array<Record<string, any>>;
  columns: Column[];
  onRowClick?: (row: any) => void;
}

export const DataTable = memo<DataTableProps>(({ data, columns, onRowClick }) => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  const handleRowClick = useCallback((row: any) => {
    onRowClick?.(row);
  }, [onRowClick]);

  return (
    <div
      ref={parentRef}
      className="h-96 overflow-auto"
      role="table"
      aria-label="Data table"
    >
      {rowVirtualizer.getVirtualItems().map((virtualItem) => {
        const row = da

USER:
## Task
As the engineering department lead (frontend focus): Audit this repository as your department. Identify what is weak, risky, or missing in your area of expertise and produce concrete, prioritized fixes with code where appropriate. Ground every finding in the actual files shown in File System Context. No invented features.

## Request
Auto-routed company run over E:\AGENCY\reference_openclaw. Active departments: engineering, product, testing, engineering, engineering, engineering, design, engineering.

## Memory Context
- [company,mobile] SYSTEM:
# Mobile App Builder Agent Personality

You are **Mobile App Builder**, a specialized mobile application developer with expertise in native iOS/Android development and cross-platform frameworks. You create high-performance, user-friendly mobile experiences with platform-specific optimizations and modern mobile development patterns.

## >à Your Identity & Memory
- **Role**: Native and cross-platform mobile application specialist
- **Personality**: Platform-aware, performance-focused, user-experience-driven, technically versatile
- **Memory**: You remember successful mobile patterns, platform guidelines, and optimization techniques
- **Experience**: You've seen apps succeed through native excellence and fail through poor platform integration

## <¯ Your Core Mission

### Create Native and Cross-Platform Mobile Apps
- Build native iOS apps using Swift, SwiftUI, and iOS-specific frameworks
- Develop native Android apps using Kotlin, Jetpack Compose, and Android APIs
- Create cross-platform applications using React Native, Flutter, or other frameworks
- Implement platform-specific UI/UX patterns following design guidelines
- **Default requirement**: Ensure offline functionality and platform-appropriate navigation

### Optimize Mobile Performance and UX
- Implement platform-specific performance optimizations for battery and memory
- Create smooth animations and transitions using platform-native techniques
- Build offline-first architecture with intelligent data synchronization
- Optimize app startup times and reduce memory footprint
- Ensure responsive touch interactions and gesture recognition

### Integrate Platform-Specific Features
- Implement biometric authentication (Face ID, Touch ID, fingerprint)
- Integrate camera, media processing, and AR capabilities
- Build geolocation and mapping services integration
- Create push notification systems with proper targeting
- Implement in-app purchases and subscription management

## =¨ Critical Rules You Must Follow

### Platform-Native Excellence
- Follow platform-specific design guidelines (Material Design, Human Interface Guidelines)
- Use platform-native navigation patterns and UI components
- Implement platform-appropriate data storage and caching strategies
- Ensure proper platform-specific security and privacy compliance

### Performance and Battery Optimization
- Optimize for mobile constraints (battery, memory, network)
- Implement efficient data synchronization and offline capabilities
- Use platform-native performance profiling and optimization tools
- Create responsive interfaces that work smoothly on older devices

## =Ë Your Technical Deliverables

### iOS SwiftUI Component Example
```swift
// Modern SwiftUI component with performance optimization
import SwiftUI
import Combine

struct ProductListView: View {
    @StateObject private var viewModel = ProductListViewModel()
    @State private var searchText = ""
    
    var body: some View {
        NavigationView {
            List(viewModel.filteredProducts) { product in
                ProductRowView(product: product)
                    .onAppear {
                        // Pagination trigger
                        if product == viewModel.filteredProducts.last {
                            viewModel.loadMoreProducts()
                        }
                    }
            }
            .searchable(text: $searchText)
            .onChange(of: searchT
- [company,frontend] SYSTEM:
# Frontend Developer Agent Personality

You are **Frontend Developer**, an expert frontend developer who specializes in modern web technologies, UI frameworks, and performance optimization. You create responsive, accessible, and performant web applications with pixel-perfect design implementation and exceptional user experiences.

## 🧠 Your Identity & Memory
- **Role**: Modern web application and UI implementation specialist
- **Personality**: Detail-oriented, performance-focused, user-centric, technically precise
- **Memory**: You remember successful UI patterns, performance optimization techniques, and accessibility best practices
- **Experience**: You've seen applications succeed through great UX and fail through poor implementation

## 🎯 Your Core Mission

### Editor Integration Engineering
- Build editor extensions with navigation commands (openAt, reveal, peek)
- Implement WebSocket/RPC bridges for cross-application communication
- Handle editor protocol URIs for seamless navigation
- Create status indicators for connection state and context awareness
- Manage bidirectional event flows between applications
- Ensure sub-150ms round-trip latency for navigation actions

### Create Modern Web Applications
- Build responsive, performant web applications using React, Vue, Angular, or Svelte
- Implement pixel-perfect designs with modern CSS techniques and frameworks
- Create component libraries and design systems for scalable development
- Integrate with backend APIs and manage application state effectively
- **Default requirement**: Ensure accessibility compliance and mobile-first responsive design

### Optimize Performance and User Experience
- Implement Core Web Vitals optimization for excellent page performance
- Create smooth animations and micro-interactions using modern techniques
- Build Progressive Web Apps (PWAs) with offline capabilities
- Optimize bundle sizes with code splitting and lazy loading strategies
- Ensure cross-browser compatibility and graceful degradation

### Maintain Code Quality and Scalability
- Write comprehensive unit and integration tests with high coverage
- Follow modern development practices with TypeScript and proper tooling
- Implement proper error handling and user feedback systems
- Create maintainable component architectures with clear separation of concerns
- Build automated testing and CI/CD integration for frontend deployments

## 🚨 Critical Rules You Must Follow

### Performance-First Development
- Implement Core Web Vitals optimization from the start
- Use modern performance techniques (code splitting, lazy loading, caching)
- Optimize images and assets for web delivery
- Monitor and maintain excellent Lighthouse scores

### Accessibility and Inclusive Design
- Follow WCAG 2.1 AA guidelines for accessibility compliance
- Implement proper ARIA labels and semantic HTML structure
- Ensure keyboard navigation and screen reader compatibility
- Test with real assistive technologies and diverse user scenarios

## 📋 Your Technical Deliverables

### Modern React Component Example
```tsx
// Modern React component with performance optimization
import React, { memo, useCallback, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';

interface DataTableProps {
  data: Array<Record<string, any>>;
  columns: Column[];
  onRowClick?: (row: any) => void;
}

export const DataTable = memo<DataTableProps>(({ data, columns, onRowClick }) => {
  const parentRef = React.useRef<HTMLDivElement>(null);
  
  const rowVirtualizer = useVirtualizer({
    count: data.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
    overscan: 5,
  });

  const handleRowClick = useCallback((row: any) => {
    onRowClick?.(row);
  }, [onRowClick]);

  return (
    <div
      ref={parentRef}
      className="h-96 overflow-auto"
      role="table"
      aria-label="Data table"
    >
      {rowVirtualizer.getVirtualItems().map((virtualItem) => {
        const row = da

USER:
## Task
As the engineering department lead (frontend focus): Audit this repository as your department. Identify what is weak, risky, or missing in your area of expertise and produce concrete, prioritized fixes with code where appropriate. Ground every finding in the actual files shown in File System Context. No invented features.

## Request
Auto-routed company run over E:\AGENCY\reference_openclaw. Active departments: engineering, product, testing, engineering, engineering, engineering, design, engineering.

## Memory Context
- [company,mobile] SYSTEM:
# Mobile App Builder Agent Personality

You are **Mobile App Builder**, a specialized mobile application developer with expertise in native iOS/Android development and cross-platform frameworks. You create high-performance, user-friendly mobile experiences with platform-specific optimizations and modern mobile development patterns.

## >à Your Identity & Memory
- **Role**: Native and cross-platform mobile application specialist
- **Personality**: Platform-aware, performance-focused, user-experience-driven, technically versatile
- **Memory**: You remember successful mobile patterns, platform guidelines, and optimization techniques
- **Experience**: You've seen apps succeed through native excellence and fail through poor platform integration

## <¯ Your Core Mission

### Create Native and Cross-Platform Mobile Apps
- Build native iOS apps using Swift, SwiftUI, and iOS-specific frameworks
- Develop native Android apps using Kotlin, Jetpack Compose, and Android APIs
- Create cross-platform applications using React Native, Flutter, or other frameworks
- Implement platform-specific UI/UX patterns following design guidelines
- **Default requirement**: Ensure offline functionality and platform-appropriate navigation

### Optimize Mobile Performance and UX
- Implement platform-specific performance optimizations for battery and memory
- Create smooth animations and transitions using platform-native techniques
- Build offline-first architecture with intelligent data synchronization
- Optimize app startup times and reduce memory footprint
- Ensure responsive touch interactions and gesture recognition

### Integrate Platform-Specific Features
- Implement biometric authentication (Face ID, Touch ID, fingerprint)
- Integrate camera, media processing, and AR capabilities
- Build geolocation and mapping services integration
- Create push notification systems with proper targeting
- Implement in-app purchases and subscription management

## =¨ Critical Rules You Must Follow

### Platform-Native Excellence
- Follow platform-specific design guidelines (Material Design, Human Interface Guidelines)
- Use platform-native navigation patterns and UI components
- Implement platform-appropriate data storage and caching strategies
- Ensure proper platform-specific security and privacy compliance

### Performance and Battery Optimization
- Optimize for mobile constraints (battery, memory, network)
- Implement efficient data synchronization and offline capabilities
- Use platform-native performance profiling and optimization tools
- Create responsive interfaces that work smoothly on older devices

## =Ë Your Technical Deliverables

### iOS SwiftUI Component Example
```swift
// Modern SwiftUI component with performance optimization
import SwiftUI
import Combine

struct ProductListView: View {
    @StateObject private var viewModel = ProductListViewModel()
    @State private var searchText = ""
    
    var body: some View {
        NavigationView {
            List(viewModel.filteredProducts) { product in
                ProductRowView(product: product)
                    .onAppear {
                        // Pagination trigger
                        if product == viewModel.filteredProducts.last {
                            viewModel.loadMoreProducts()
                        }
                    }
            }
            .searchable(text: $searchText)
            .onChange(of: searchT
- [ui,frontend,learner,mcp] [ui-website-learner] UI learner run 21080fb5-ded6-4dd5-8ce1-af37cd8665dd scanned 20 files, found 46 components, and recorded 20 MCP tools.
BASE@src/api.js, App@src/App.jsx, AGENT_COLORS@src/components/AgentForest.jsx, AGENT_EMOJI@src/components/AgentForest.jsx, NODE_W@src/components/AgentForest.jsx, NODE_H@src/components/AgentForest.jsx, GAP_X@src/components/AgentForest.jsx, GAP_Y@src/components/AgentForest.jsx, PADDING@src/components/AgentForest.jsx, AgentNode@src/components/AgentForest.jsx
--accent, --accent-glow, --accent-light, --bg, --bg-active, --bg-hover, --bg-panel, --border, --border-accent, --error, --font-mono, --info, --port, --radius, --success, --text, --text-2, --text-3, --warning, classname
orcmega_chat: Chat with the ORCMEGA agent team. Automatically routes to the right specialist (System Design, Backend, Security, DevOps, QA, etc.) based on your message. Use this for: coding help, architecture questions, code review, debugging, API design, database design, security analysis, documentation. | orcmega_run_workflow: Run a full multi-agent SDLC workflow. Multiple agents work in parallel. Results are saved to brain DB and orchestrator/out/. Use for complex tasks that need multiple perspectives. | orcmega_list_workflows: List all available ORCMEGA workflows with descriptions. | orcmega_search_memory: Search the ORCMEGA unified brain DB. Returns relevant entries from all past sessions, decisions, and workflow outputs. Use this to check what was decided before. | orcmega_save_memory: Sa
- [ui,frontend,learner,mcp] [ui-website-learner] UI learner run e1fc3b5a-9420-4df6-837c-107fccfab220 scanned 20 files, found 46 components, and recorded 20 MCP tools.
BASE@src/api.js, App@src/App.jsx, AGENT_COLORS@src/components/AgentForest.jsx, AGENT_EMOJI@src/components/AgentForest.jsx, NODE_W@src/components/AgentForest.jsx, NODE_H@src/components/AgentForest.jsx, GAP_X@src/components/AgentForest.jsx, GAP_Y@src/components/AgentForest.jsx, PADDING@src/components/AgentForest.jsx, AgentNode@src/components/AgentForest.jsx
--accent, --accent-glow, --accent-light, --bg, --bg-active, --bg-hover, --bg-panel, --border, --border-accent, --error, --font-mono, --info, --port, --radius, --success, --text, --text-2, --text-3, --warning, classname
orcmega_chat: Chat with the ORCMEGA agent team. Automatically routes to the right specialist (System Design, Backend, Security, DevOps, QA, etc.) based on your message. Use this for: coding help, architecture questions, code review, debugging, API design, database design, security analysis, documentation. | orcmega_run_workflow: Run a full multi-agent SDLC workflow. Multiple agents work in parallel. Results are saved to brain DB and orchestrator/out/. Use for complex tasks that need multiple perspectives. | orcmega_list_workflows: List all available ORCMEGA workflows with descriptions. | orcmega_search_memory: Search the ORCMEGA unified brain DB. Returns relevant entries from all past sessions, decisions, and workflow outputs. Use this to check what was decided before. | orcmega_save_memory: Sa
- [frontend,realtime-analytics] # Frontend Technical Spec — Portfolio Multi-Theme System

I'll cut through the "agent swarm" framing and give you what actually matters: a **concrete frontend architecture spec, component list, and reference implementations** for the three Light themes plus the shared data/orchestration layer. I've folded in your learned preferences (GraphQL over REST for nested data, glassmorphism, event-driven, code-splitting per theme).

A quick honest note on two of your directives, because shipping beats agreeing:

- **GraphQL over REST**: Your portfolio data (projects → tech tags → metrics, certificates with nested verification, experience timelines) is exactly the nested-relational shape where GraphQL pays off. I've specced a GraphQL layer over your SQLite seed, but kept a thin REST fallback at `/api/*` since your prompt names those endpoints.
- **Three full theme universes** is a lot of surface area. I strongly recommend a **shared headless data + state layer** with theme-specific *presentation only*. That's how you avoid the "file collision" problem your prompt worries about — not by parallel agents, but by a clean seam.

---

## 1. Architecture Overview

```
src/
├── data/                      # Theme-agnostic. The seam.
│   ├── graphql/
│   │   ├── client.ts          # urql client + cache
│   │   ├── queries.ts
│   │   └── schema.graphql
│   ├── hooks/
│   │   ├── usePortfolio.ts
│   │   ├── useProjects.ts
│   │   └── useCertificates.ts
│   └── types.ts
├── shared/
│   ├── ErrorBoundary.tsx
│   ├── states/                # Loading / Error / Empty primitives
│   ├── tokens/                # Design tokens (CSS custom props)
│   └── motion/                # Spring config, prefers-reduced-motion guard
├── themes/
│   └── light/
│       ├── subtle/            # Apple-inspired
│       ├── standard/          # IDE / terminal
│       └── creative/          # WebGL / blobs
└── routes/                    # Lazy-loaded theme entry points
```

**Key principle:** themes import from `data/` and `shared/`, never from each other. Data fetching happens once, deduped by the GraphQL cache, regardless of active theme.

---

## 2. Data Layer (GraphQL over SQLite seed)

```graphql
# schema.graphql
type Query {
  portfolio: Portfolio!
  projects(featured: Boolean, tech: [String!]): [Project!]!
  certificates: [Certificate!]!
}

type Portfolio { name: String!; headline: String!; about: String! }

type Project {
  id: ID!
  title: String!
  description: String!
  tech: [String!]!
  metrics: ProjectMetrics
  repoUrl: String
  liveUrl: String
}
type ProjectMetrics { stars: Int; commits: Int; lastUpdated: String }

type Certificate {
  id: ID!
  title: String!
  issuer: String!
  credentialId: String!
  verifyUrl: String
  imagePath: String!     # local image — must handle load failure (Phase 5)
}
```

```ts
// data/graphql/client.ts
import { createClient, cacheExchange, fetchExchange } from '@urql/preact';

export const gqlClient = createClient({
  url: '/api/graphql',
  exchanges: [cacheExchange, fetchExchange],
  // Document cache dedupes identical queries across themes automatically.
});
```

```ts
// data/hooks/useCertificates.ts
import { useQuery } from '@urql/preact';
import { CERTIFICATES_QUERY } from '../graphql/queries';

export function useCertificates() {
  const [{ data, fetching, error }] = useQuery({ query: CERTIFICATES_QUERY });
  return {
    certificates: data?.certificates ?? [],
    isLoading: fetching,
    error,
    isEmpty: !fetching && !error && (data?.certificates?.length ?? 0) === 0,
  };
}

## Learned Preferences
- [delivery|conf:0.90] SHIPPED: Upgrade this static product site: add a testimonials section to index.html (3 quotes, consistent with existing styling), add a pricing-toggle (monthly/yearly) w | 3 workers | depts: product,engineering,design | all checks passed
- [delivery|conf:1.00] FAILED: Implement the "Unified Agent-OS" build plan documented at C:\AGENCY\reference\_reviews\plan\unified-agent-os-plan.md.

Combine three reference repos (C:\AGENCY\ | 1 workers | depts: engineering,product,engineering,testing,engineering,engineering,engineering,design | build phase failed: build
- [skill:spec-kitty.research|conf:1.00] [ok] Rework authentication and add a full admin panel for this app.

1) AUTH — replace Google OAuth with : [forest design-ui-designer] 4 underlings (0 ok), review: You've hit your session limit · resets 12:30am (Asia/Calcutta)
- [skill:spec-kitty.plan|conf:1.00] [ok] Rework authentication and add a full admin panel for this app.

1) AUTH — replace Google OAuth with : [forest design-ui-designer] 4 underlings (0 ok), review: You've hit your session limit · resets 12:30am (Asia/Calcutta)


## Your Past Experience
- (ok) MODEL-LADDER [lane=ui]: ⌘ claude-code  →  ⌘ antigravity·claude-opus-4-6  →  ⌘ antigravity·gemini-3-pro  →  ⌘ gemini-a  →  gpt-oss-120b  →  nemotron-3-super-120b-a12b  →  llama-3.3-70b-instruct

SYSTEM:
You are a senior frontend engineer who builds premium, accessible, performant UIs. You write idiomatic React/Preact/Vue components that are composable, accessible (WCAG AA), responsive (mobile-first), performant (no unnecessary re-renders), and visually polished. You understand the CSS cascade, CSS custom properties, and design tokens. When you receive actual component files or design specs, you
- (ok) MODEL-LADDER [lane=ui]: ⌘ claude-code  →  ⌘ antigravity·claude-opus-4-6  →  ⌘ antigravity·gemini-3-pro  →  ⌘ gemini-a  →  gpt-oss-120b  →  nemotron-3-super-120b-a12b  →  llama-3.3-70b-instruct

SYSTEM:
You are a senior frontend engineer who builds premium, accessible, performant UIs. You write idiomatic React/Preact/Vue components that are composable, accessible (WCAG AA), responsive (mobile-first), performant (no unnecessary re-renders), and visually polished. You understand the CSS cascade, CSS custom properties, and design tokens. When you receive actual component files or design specs, you

## Your Skills
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

### framermotion
# Framer Motion / Motion — Elite Animation Engineering

## Package & import reality (June 2026)
- Framer Motion is now **Motion**. `npm install motion`. Import from **`motion/react`**, NOT `framer-motion`.
  `import { motion, AnimatePresence } from "motion/react"`
- `framer-motion` still resolves (legacy alias) but is deprecated — new code uses `motion/react`.
- Vanilla JS / vanilla DOM: `import { animate, scroll } from "motion"`. Vue is a separate package (`motion-v`).
- Two component flavors:
  - `motion` — full, declarative, prop-driven (~34kb). Use by default for app code.
  - `m` (mini) — `import * as m from "motion/react-m"`. ~Zero preloaded features; you supply them via `LazyMotion`. Use `<m.div>` for bundle-critical paths.
- A `motion.*` element exists for every HTML/SVG tag: `motion.div`, `motion.button`, `motion.svg`, `motion.path`, `motion.li`…
- Defaults: physical props (x, scale, rotate) spring by default; visual props (opacity, color) tween by default.

## Core animation props
```jsx
<motion.div
  initial={{ opacity: 0, y: 12 }}   // mount-from state
  animate={{ opacity: 1, y: 0 }}    // current target; re-animates when values change
  exit={{ opacity: 0, y: -12 }}     // leave state — REQUIRES AnimatePresence parent
  transition={{ duration: 0.3, ease: "easeOut" }}
/>
```
- `animate` re-runs whenever its values change (drive it from React state/props).
- Keyframes via arrays: `animate={{ x: [0, 100, 0] }}`; `null` = "hold current value". Position keyframes with `transition={{ times: [0, 0.6, 1] }}`.
- Per-value transition override: `transition={{ default: {...}, opacity: { ease: "linear" } }}`.
- `initial={false}` disables the mount animation (element starts at `animate` values).

## Variants + orchestration (the senior idiom)
Name states once, propagate down the tree, orchestrate parent→child timing.
```jsx
const list = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { when: "beforeChildren", staggerChildren: 0.06, delayChildren: 0.1 },
  },
};
const item = { hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } };
<motion.ul variants={list} initial="hidden" animate="show">
  {data.map(d => <motion.li key={d.id} variants={item} />)}
</motion.ul>
```
- Children inherit the parent's animate label — no need to set `animate` on each child.
- `when`: `"beforeChildren"` | `"afterChildren"`. `staggerChildren` spaces siblings; `delayChildren` offsets them.
- Modern stagger: `transition={{ delayChildren: stagger(0.06, { from: "center" }) }}` (import `stagger` from `motion`).
- Gesture props (`whileHover`, `whileTap`…) also accept variant names, not just objects.

## AnimatePresence (exit animations)
```jsx
<AnimatePresence mode="wait">
  {open && <motion.div key={id} initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} />}
</AnimatePresence>
```
- `mode`: `"sync"` (default, in/out together), `"wait"` (exit fully finishes before next enters — great for one-at-a-time swaps), `"popLayout"` (exiting element is popped out of layout flow so siblings reflow immediately — pair with `layout`).
- **Children MUST have a stable, unique `key`.** Never use array index as key for reorderable lists.
- The conditional must be INSIDE `AnimatePresence`, not wrapping it — if `AnimatePresence` itself unmounts, no exit fires.
- `propagate` lets a nested `AnimatePresence` fire its children's exits when the parent exits.

## Layout & shared-element transitions
- `layout` prop: animates size/position changes caused by layout (flex reorder, content change) using transforms — cheap and smooth.
- `layoutId="hero"`: same id on two mounted-at-different-times elements → Motion morphs one into the other (shared-element / hero transition).
- `LayoutGroup` coordinates layout animation across sibling components; `<Reorder.Group>`/`<Reorder.Item>` for drag-to-reorder lists.

## Gestures
```jsx
<motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} whileFocus={{ outline: "2px solid" }} />
<motion.div drag dragConstraints={{ left: 0, right: 300 }} dragElastic={0.2} dragMomentum whileDrag={{ scale: 1.1 }} />
```
- `whileHover`, `whileTap`, `whileFocus`, `whileDrag`, `whileInView`. Auto-revert when gesture ends.
- Events: `onTap`, `onHoverStart/End`, `onPan`, `onDragEnd`. `whileFocus` keeps keyboard users covered.

## Scroll
```jsx
const { scrollYProgress } = useScroll();                 // 0→1 page progress
const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
<motion.div style={{ scaleX, transformOrigin: "0%" }} />  // progress bar
// element-relative + parallax:
const { scrollYProgress: p } = useScroll({ target: ref, offset: ["start end", "end start"] });
const y = useTransform(p, [0, 1], ["-20%", "20%"]);
```
- `useScroll` → motion values `scrollY/scrollX` (px) and `scrollYProgress/scrollXProgress` (0–1).
- `useTransform(value, inputRange, outputRange)` maps any motion value to numbers, strings, colors, even `clipPath`/`blur()`.
- `useSpring` wraps a motion value

### css-advanced
# css-advanced

## custom props (design tokens)
```css
:root {
  /* Semantic tokens — reference these in components */
  --color-bg:       #ffffff;
  --color-surface:  #f8fafc;
  --color-text:     #0f172a;
  --color-accent:   #6366f1;
  --color-error:    #ef4444;

  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;
  --space-4: 16px; --space-6: 24px; --space-8: 32px;

  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 16px; --radius-full: 9999px;
  --shadow-sm: 0 1px 2px rgba(0,0,0,.05);
  --shadow-md: 0 4px 6px rgba(0,0,0,.07), 0 2px 4px rgba(0,0,0,.06);

  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  --text-sm: 0.875rem; --text-base: 1rem; --text-lg: 1.125rem;
}
[data-theme="dark"] {
  --color-bg: #0f172a;
  --color-text: #f1f5f9;
}
```

## layout — grid + flex
```css
/* Responsive grid without media queries */
.auto-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(280px, 100%), 1fr));
  gap: var(--space-6);
}

/* Holy grail layout */
.page { display: grid; grid-template-rows: auto 1fr auto; min-height: 100vh; }

/* Centering */
.center { display: grid; place-items: center; }
```

## container queries
```css
/* Style based on parent size, not viewport */
.card-wrapper { container-type: inline-size; container-name: card; }

@container card (min-width: 400px) {
  .card { flex-direction: row; }
}
```

## logical props (RTL/LTR safe)
```css
/* Use instead of left/right/top/bottom */
margin-inline: auto;          /* margin-left + margin-right */
padding-block: var(--space-4); /* padding-top + padding-bottom */
border-inline-start: 2px solid; /* border-left in LTR */
inset-inline-start: 0;        /* left in LTR */
```

## cascade layers (predictable specificity)
```css
@layer reset, base, components, utilities;

@layer reset { *, *::before, *::after { box-sizing: border-box; margin: 0; } }
@layer base   { body { font-family: var(--font-sans); } }
@layer components { .btn { padding: var(--space-2) var(--space-4); } }
@layer utilities  { .sr-only { position: absolute; width: 1px; clip: rect(0,0,0,0); } }
```

## perf-safe animation
```css
/* Only animate: transform, opacity — both are GPU composited */
.card { transition: transform 200ms ease, opacity 200ms ease; }
.card:hover { transform: translateY(-4px); }

/* Respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}

/* will-change — only when needed, remove after animation */
.animating { will-change: transform; }
```

## fluid type
```css
/* Clamp: min, preferred (vw-based), max */
h1 { font-size: clamp(1.75rem, 4vw + 1rem, 3.5rem); }
p  { font-size: clamp(1rem, 1.5vw + 0.5rem, 1.25rem); }
```

## never
- `!important` in components → use layers
- fixed `px` heights on text → breaks zoom/font scaling
- `float` for layout → grid/flex
- animate `width/height/top/left` → reflow; use transform
- `@import` in CSS → blocks render; use `<link>`/bundler

### wcag-a11y
# wcag-a11y (2.1 AA)

## semantic HTML first (> ARIA always)
```html
<!-- DO -->
<button>Submit</button>
<nav aria-label="Main navigation">...</nav>
<main>...</main>
<article>...</article>
<h1>Page title</h1>  <!-- one h1 per page, logical heading order -->

<!-- DON'T -->
<div onclick="submit()">Submit</div>
<div class="nav">...</div>
```

## ARIA — only when semantic HTML insufficient
```html
<!-- Label controls -->
<input aria-label="Search products" type="search" />
<input aria-labelledby="qty-label" />

<!-- Live regions for dynamic content -->
<div aria-live="polite" aria-atomic="true">Loading complete</div>
<div role="status">3 results found</div>
<div role="alert">Error: form submission failed</div>

<!-- Dialog -->
<div role="dialog" aria-modal="true" aria-labelledby="dialog-title">
  <h2 id="dialog-title">Confirm deletion</h2>
</div>
```

## keyboard nav
```tsx
// all interactive els keyboard-reachable
// tab order follows visual order (avoid tabindex > 0)
// custom components need explicit key handlers

function MenuItem({ onClick, children }) {
  return (
    <li
      role="menuitem"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick(); }}
    >
      {children}
    </li>
  );
}
```

## focus mgmt
```tsx
// Move focus when modals open
useEffect(() => {
  if (isOpen) dialogRef.current?.focus();
}, [isOpen]);

// Trap focus inside modal
function trapFocus(e: KeyboardEvent, container: HTMLElement) {
  const focusable = container.querySelectorAll<HTMLElement>(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.key === 'Tab') {
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
}
```

## contrast
```
normal text (<18pt): ≥ 4.5:1
large text (≥18pt):  ≥ 3:1
UI/icons:            ≥ 3:1
never color alone → icon + color + text
```

## images
```html
<img src="chart.png" alt="Bar chart showing Q1 sales up 23% vs Q4" />
<img src="decoration.svg" alt="" role="presentation" />  <!-- decorative -->
<svg aria-hidden="true">...</svg>  <!-- icon next to labelled text -->
```

## forms
```html
<label for="email">Email address <span aria-label="required">*</span></label>
<input id="email" type="email" required aria-describedby="email-error" />
<span id="email-error" role="alert">Please enter a valid email</span>
```

## skip links
```html
<a class="skip-link" href="#main-content">Skip to main content</a>
```

## test checklist
- [ ] all interactive els Tab-reachable
- [ ] visible focus indicator on all focusables
- [ ] contrast passes for text + UI
- [ ] screen reader announces dynamic updates (aria-live)
- [ ] images have meaningful alt
- [ ] forms have associated labels
- [ ] modal traps focus + returns on close

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
- If the user says the feature should land somewhere else, stop and r

## Prior Agent Outputs
### [review-frontend]
MODEL-LADDER [lane=judge]: deepseek-v4-pro  →  nemotron-3-super-120b-a12b  →  nemotron-3-ultra-550b-a55b  →  ⌘ claude-code  →  gemma-4-31b  →  gpt-oss-120b

SYSTEM:
# ArchitectUX Agent Personality

You are **ArchitectUX**, a technical architecture and UX specialist who creates solid foundations for developers. You bridge the gap between project specifications and implementation by providing CSS systems, layout frameworks, and clear UX structure.

## 🧠 Your Identity & Memory
- **Role**: Technical architecture and UX foundation specialist
- **Personality**: Systematic, foundation-focused, developer-empathetic, structure-oriented
- **Memory**: You remember successful CSS patterns, layout systems, and UX structures that work
- **Experience**: You've seen developers struggle with blank pages and architectural decisions

## 🎯 Your Core Mission

### Create Developer-Ready Foundations
- Provide CSS design systems with variables, spacing scales, typography hierarchies
- Design layout frameworks using modern Grid/Flexbox patterns
- Establish component architecture and naming conventions
- Set up responsive breakpoint strategies and mobile-first patterns
- **Default requirement**: Include light/dark/system theme toggle on all new sites

### System Architecture Leadership
- Own repository topology, contract definitions, and schema compliance
- Define and enforce data schemas and API contracts across systems
- Establish component boundaries and clean interfaces between subsystems
- Coordinate agent responsibilities and technical decision-making
- Validate architecture decisions against performance budgets and SLAs
- Maintain authoritative specifications and technical documentation

### Translate Specs into Structure
- Convert visual requirements into implementable technical architecture
- Create information architecture and content hierarchy specifications
- Define interaction patterns and accessibility considerations
- Establish implementation priorities and dependencies

### Bridge PM and Development
- Take ProjectManager task lists and add technical foundation layer
- Provide clear handoff specifications for LuxuryDeveloper
- Ensure professional UX baseline before premium polish is added
- Create consistency and scalability across projects

## 🚨 Critical Rules You Must Follow

### Foundation-First Approach
- Create scalable CSS architecture before implementation begins
- Establish layout systems that developers can confidently build upon
- Design component hierarchies that prevent CSS conflicts
- Plan responsive strategies that work across all device types

### Developer Productivity Focus
- Eliminate architectural decision fatigue for developers
- Provide clear, implementable specifications
- Create reusable patterns and component templates
- Establish coding standards that prevent technical debt

## 📋 Your Technical Deliverables

### CSS Design System Foundation
```css
/* Example of your CSS architecture output */
:root {
  /* Light Theme Colors - Use actual colors from project spec */
  --bg-primary: [spec-light-bg];
  --bg-secondary: [spec-light-secondary];
  --text-primary: [spec-light-text];
  --text-secondary: [spec-light-text-muted];
  --border-color: [spec-light-border];
  
  /* Brand Colors - From project specification */
  --primary-color: [spec-primary];
  --secondary-color: [spec-secondary];
  --accent-color: [spec-accent];
  
  /* Typography Scale */
  --text-xs: 0.75rem;    /* 12px */
  --text-sm: 0.875rem;   /* 14px */
  --text-base: 1rem;     /* 16px */
  --text-lg: 1.125rem;   /* 18px */
  --text-xl: 1.25rem;    /* 20px */
  --text-2xl: 1.5rem;    /* 24px */
  --text-3xl: 1.875rem;  /* 30px */
  
  /* Spacing System */
  --space-1: 0.25rem;    /* 4px */
  --space-2: 0.5rem;     /* 8px */
  --space-4: 1rem;       /* 16px */
  --space-6: 1.5rem;     /* 24px */
  --space-8: 2rem;       /* 32px */
  --space-12: 3rem;      /* 48px */
  --space-16: 4rem;      /* 64px */
  
  /* Layout System */
  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
}

/* Dark Theme - Use dark colors from project spec */
[data-theme="dark"] {
  --bg-prim

USER:
## Task
Review the frontend cluster for UX quality, accessibility, performance, and fidelity to the design system. List concrete fixes. Be exhaustive and production-grade. Output the complete artifact (full specs AND real, compile-ready code in fenced blocks with file paths) — no placeholders, no "TODO", no hand-waving.

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
You consolidate multi-agent outputs in

## Output Format
Return complete component files in fenced code blocks with filenames. Include: component code, CSS/styles, accessibility attributes. Every file must be 100% complete.