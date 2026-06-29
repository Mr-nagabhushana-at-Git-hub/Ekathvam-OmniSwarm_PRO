<thinking>
The objective is to create a production-grade UX specification for "OmniSwarm PROv1". 
The system has two distinct surfaces:
1.  **Operator Console**: A high-density monitoring tool for the swarm operator (Nagabhushana) to manage 12 agents building a portfolio.
2.  **Portfolio Site**: A high-conversion, high-credibility public site for visitors (Recruiters, Engineers, VCs) with three switchable "Light" themes.

Key requirements:
- Define Personas (Technical Judge, Enterprise CISO, Product/VC Judge, Developer Community).
- Define Jobs-To-Be-Done (JTBD).
- Establish UX Benchmarks.
- Identify "Breathtaking" moments for People's Choice.
- Provide full specs and compile-ready code (no placeholders).

Plan:
1.  **Persona Mapping**: Map the requested personas to the specific surfaces and goals.
2.  **JTBD Framework**: Use the "When [situation], I want to [action], so that [outcome]" format.
3.  **UX Benchmarks**: Define quantitative and qualitative metrics (LCP, interaction latency, trust signals).
4.  **Breathtaking Moments**: Design the "wow" factors (e.g., the "Swarm Convergence" animation, the "Instant Theme Morph").
5.  **Implementation**: 
    - Create a `ThemeContext` for the instant theme swapping.
    - Create a `SwarmBoard` component for the operator.
    - Create a `TrustBar` for the portfolio.
    - Use Tailwind v4/React 19 patterns as per the system prompt.
</thinking>

# UX Specification: OmniSwarm PROv1 (Build System & Portfolio)

## 1. Persona & JTBD Matrix

| Persona | Surface | Primary Goal | Job-To-Be-Done (JTBD) | Pain Point |
| :--- | :--- | :--- | :--- | :--- |
| **Technical Judge** | Both | Verify architectural integrity | *"When reviewing the build, I want to see the exact file-system ownership of each agent, so I can verify no race conditions occurred."* | "Black box" agent behavior; lack of provenance. |
| **Enterprise CISO** | Portfolio | Validate security/privacy | *"When scanning the portfolio, I want to see a cryptographically signed 'Privacy Manifest', so I can trust the data handling aligns with DPDP/GDPR."* | Fear of leaked PII in agent-generated content. |
| **Product/VC Judge** | Portfolio | Assess market-fit/polish | *"When landing on the site, I want to see a 'Proof of Impact' matrix (metrics + certs) in < 5s, so I can quantify the candidate's value."* | Generic templates; "fluff" without evidence. |
| **Dev Community** | Portfolio | Inspect technical depth | *"When switching to 'Standard' theme, I want to interact with a real-data terminal, so I can verify the system is engineered, not hard-coded."* | Fake "terminal" animations that don't actually query data. |

---

## 2. UX Benchmarks (The "Beat" List)

To win "People's Choice" and Technical tracks, the UI must outperform these industry standards:

| Metric | Industry Standard | OmniSwarm Target | Implementation Strategy |
| :--- | :--- | :--- | :--- |
| **Theme Swap Latency** | 200ms - 500ms | **< 50ms** | CSS Variable injection + `layoutId` morphing. |
| **LCP (Largest Contentful Paint)** | < 2.5s | **< 1.2s** | Edge-cached SQLite snapshots + AVIF images. |
| **Operator Trust Gap** | Manual log checking | **Real-time Visual** | SSE-driven "Agent Heartbeat" grid. |
| **Credibility Time** | 30s (reading bio) | **< 5s** | "Trust Bar" with verified cert counts above the fold. |

---

## 3. "Breathtaking" Moments (People's Choice)

1.  **The Swarm Convergence**: In the Operator Console, as agents finish, their individual "directory nodes" physically slide and merge into a single "Production Build" sphere.
2.  **The Theme Morph**: When switching themes (Subtle $\rightarrow$ Creative), elements don't just change color; they use `layoutId` to morph shapes (e.g., a square card becomes a blob) seamlessly.
3.  **The Live Provenance Trace**: On the portfolio, hovering over a project reveals a "Built by Agent [X]" badge that, when clicked, shows the actual prompt and logic the agent used to generate that section.

---

## 4. Production Implementation

### File: `src/context/ThemeContext.tsx`
Handles the instant-swap logic for the three Light themes.

```tsx
"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type ThemeMode = "subtle" | "standard" | "creative";

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>("standard");

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute("data-theme", theme);
    // Sync with local storage for persistence
    localStorage.setItem("omniswarm-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
```

### File: `src/components/operator/SwarmBoard.tsx`
The high-density monitoring surface for the Operator.

```tsx
"use client";

import React from "react";
import { motion } from "motion/react";
import { Activity, CheckCircle2, AlertCircle, FolderTree } from "lucide-react";

interface AgentStatus {
  id: string;
  name: string;
  status: "idle" | "working" | "completed" | "stalled";
  progress: number;
  lastFile: string;
  directory: string;
}

export function SwarmBoard({ agents }: { agents: AgentStatus[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6 bg-zinc-950">
      {agents.map((agent) => (
        <motion.div
          key={agent.id}
          layout
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className={`relative p-4 rounded-xl border transition-all duration-300 ${
            agent.status === "stalled" 
              ? "border-red-500 bg-red-500/10 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
              : "border-zinc-800 bg-zinc-900/50"
          }`}
        >
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-md ${
                agent.status === "working" ? "bg-indigo-500 animate-pulse" : "bg-zinc-700"
              }`}>
                <Activity size={14} className="text-white" />
              </div>
              <span className="text-xs font-bold text-zinc-200 uppercase tracking-tight">
                {agent.name}
              </span>
            </div>
            {agent.status === "completed" ? (
              <CheckCircle2 size={16} className="text-emerald-500" />
            ) : agent.status === "stalled" ? (
              <AlertCircle size={16} className="text-red-500" />
            ) : null}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-500">
              <FolderTree size={12} />
              <span className="truncate">{agent.directory}</span>
            </div>
            
            <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${agent.progress}%` }}
                className={`h-full ${
                  agent.status === "stalled" ? "bg-red-500" : "bg-indigo-500"
                }`}
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-[10px] font-mono text-zinc-400 truncate max-w-[100px]">
                {agent.lastFile}
              </span>
              <span className="text-[10px] font-bold text-zinc-500">
                {agent.progress}%
              </span>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
```

### File: `src/components/portfolio/TrustBar.tsx`
The "Credibility" component that wins the Recruiter/VC persona.

```tsx
"use client";

import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Award, Globe, Zap } from "lucide-react";

interface TrustMetric {
  label: string;
  value: string;
  icon: React.ReactNode;
}

const METRICS: TrustMetric[] = [
  { label: "Verified Certs", value: "29", icon: <Award size={16} /> },
  { label: "DPDP Compliant", value: "Yes", icon: <ShieldCheck size={16} /> },
  { label: "Global Reach", value: "12+", icon: <Globe size={16} /> },
  { label: "Build Speed", value: "400tps", icon: <Zap size={16} /> },
];

export function TrustBar() {
  return (
    <div className="flex flex-wrap justify-center gap-4 py-6 border-y border-zinc-200/50 bg-white/30 backdrop-blur-sm">
      {METRICS.map((m, i) => (
        <motion.div 
          key={m.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-zinc-200 shadow-sm"
        >
          <span className="text-indigo-600">{m.icon}</span>
          <span className="text-xs font-medium text-zinc-600">{m.label}:</span>
          <span className="text-xs font-bold text-zinc-900">{m.value}</span>
        </motion.div>
      ))}
    </div>
  );
}
```

### File: `src/styles/themes.css`
The token-driven CSS for the three Light themes.

```css
@import "tailwindcss";

/* Base Light Tokens */
:root {
  --radius-lg: 0.75rem;
  --font-sans: 'Inter', system-ui, sans-serif;
}

/* Theme: Subtle (Minimalist, High-end) */
[data-theme="subtle"] {
  --bg: oklch(0.98 0.01 200);
  --fg: oklch(0.2 0.02 200);
  --accent: oklch(0.6 0.1 200);
  --card-bg: oklch(1 0 0);
  --border: oklch(0.9 0.02 200);
  --shadow: 0 4px 20px rgba(0,0,0,0.03);
}

/* Theme: Standard (Professional, Tech-focused) */
[data-theme="standard"] {
  --bg: oklch(0.95 0.02 200);
  --fg: oklch(0.1 0.02 200);
  --accent: oklch(0.5 0.2 260);
  --card-bg: oklch(1 0 0);
  --border: oklch(0.85 0.03 200);
  --shadow: 0 2px 10px rgba(0,0,0,0.08);
}

/* Theme: Creative (Bold, Playful) */
[data-theme="creative"] {
  --bg: oklch(0.9 0.05 150);
  --fg: oklch(0.2 0.05 150);
  --accent: oklch(0.7 0.2 150);
  --card-bg: oklch(0.98 0.03 150);
  --border: oklch(0.7 0.1 150);
  --shadow: 8px 8px 0px oklch(0.4 0.1 150);
}

@theme inline {
  --color-background: var(--bg);
  --color-foreground: var(--fg);
  --color-accent: var(--accent);
  --color-card: var(--card-bg);
  --color-border: var(--border);
}
```