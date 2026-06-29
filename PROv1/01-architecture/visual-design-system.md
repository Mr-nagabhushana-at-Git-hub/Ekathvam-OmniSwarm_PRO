<thinking>
The objective is to deliver a production-grade visual design system for **OmniSwarm PROv1**. 
This is not just a "skin" but a comprehensive interface specification for an "Agentic OS" that must visualize the extreme velocity of Cerebras (3000 tok/s) while maintaining the high-end "Obsidian Glass" aesthetic of Nousastra.

**Key Design Challenges:**
1. **Visualizing Velocity**: Standard text streaming is too slow for 3000 tok/s. I need "velocity primitives"—glow pulses, particle flows, and high-frequency telemetry updates.
2. **Dark-First Aesthetic**: Moving from `zinc-950` (flat) to `Obsidian` (layered). This requires a sophisticated use of `backdrop-blur`, `inset-shadows`, and `oklch` colors for perceptual uniformity.
3. **Component Anatomy**: The "Command Canvas" requires a triptych layout that handles high-density data without feeling cluttered.

**Implementation Strategy:**
- **Tokens**: Use OKLCH for the color system to ensure high contrast and vibrant accents.
- **Motion**: Use `motion/react` (Framer Motion) for layout morphing and state transitions.
- **Architecture**: A CSS-first token system that integrates with Tailwind v4 `@theme`.
- **Signature Moments**: 
    - *Live Swarm Graph*: A DAG visualization where edges "pulse" based on token flow.
    - *Speed Gauges*: High-fidelity telemetry that looks like a racing HUD.

**Deliverables:**
1. `tokens.css`: The complete design token system.
2. `components/ui/SwarmCanvas.tsx`: The main layout shell.
3. `components/ui/SpeedHUD.tsx`: The signature velocity gauge.
4. `components/ui/SwarmGraph.tsx`: The live agent interaction visualizer.
</thinking>

# OmniSwarm PROv1: Visual Design System Specification

## 1. Design Philosophy: "The Obsidian OS"
The PROv1 aesthetic moves away from "Dashboard" and toward "Command Center." It is characterized by **Depth, Velocity, and Precision**.

- **Depth**: Layers of translucent obsidian glass. No hard borders; instead, use `1px` semi-transparent strokes and `inset` shadows to create a "carved" look.
- **Velocity**: Visual cues that mirror Cerebras' speed. Instead of linear progress bars, use "energy pulses" and high-frequency sparklines.
- **Precision**: Monospaced typography for all telemetry, high-contrast accent colors for state changes, and pixel-perfect alignment on an 8px grid.

---

## 2. Design Tokens (Production-Grade)

I am using **OKLCH** for colors to ensure that the "Neon" accents remain perceptually consistent across different brightness levels.

### `src/styles/tokens.css`
```css
@import "tailwindcss";
@import "tw-animate-css";

:root {
  /* --- Obsidian Palette (Base) --- */
  --bg-obsidian: oklch(0.12 0.01 260);       /* Deepest base */
  --panel-obsidian: oklch(0.18 0.02 260 / 60%); /* Glass panel */
  --border-obsidian: oklch(0.25 0.02 260 / 30%); /* Subtle edge */
  --surface-obsidian: oklch(0.22 0.02 260 / 40%); /* Inner surface */

  /* --- Hyper-Velocity Accents --- */
  --accent-logic: oklch(0.65 0.22 260);      /* Electric Indigo */
  --accent-success: oklch(0.75 0.18 150);    /* Neon Emerald */
  --accent-warning: oklch(0.80 0.15 85);     /* Cyber Amber */
  --accent-error: oklch(0.60 0.20 25);       /* Plasma Red */
  
  /* --- Glows (Box-Shadows) --- */
  --glow-logic: 0 0 20px oklch(0.65 0.22 260 / 30%);
  --glow-success: 0 0 20px oklch(0.75 0.18 150 / 30%);

  /* --- Typography --- */
  --font-sans: 'Inter', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', monospace;
  
  /* --- Spacing & Radius --- */
  --radius-os: 12px;
  --space-unit: 4px;
}

@theme inline {
  /* Colors */
  --color-obsidian-bg: var(--bg-obsidian);
  --color-obsidian-panel: var(--panel-obsidian);
  --color-obsidian-border: var(--border-obsidian);
  --color-obsidian-surface: var(--obsidian-surface);
  
  --color-accent-logic: var(--accent-logic);
  --color-accent-success: var(--accent-success);
  --color-accent-warning: var(--accent-warning);
  --color-accent-error: var(--accent-error);

  /* Shadows */
  --shadow-glow-logic: var(--glow-logic);
  --shadow-glow-success: var(--glow-success);

  /* Animation */
  --animate-pulse-slow: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  --animate-flow: flow 2s linear infinite;

  @keyframes flow {
    from { stroke-dashoffset: 20; }
    to { stroke-dashoffset: 0; }
  }
}
```

---

## 3. Component Inventory & Anatomy

### A. The Command Canvas (Layout Shell)
**Anatomy**: Triptych Grid.
- **Left (The Nexus)**: `280px`. Navigation, Agent Directory, Session History.
- **Center (The Forge)**: `1fr`. The main workspace. Zoomable canvas for the Swarm Graph and the final Artifact.
- **Right (The Telemetry Wing)**: `320px`. Real-time SpeedHUD, Token-Flow graphs, and System Health.

### B. The SpeedHUD (Signature Moment)
**Anatomy**: 
- **Primary Gauge**: A semi-circular arc showing current TPS (Tokens Per Second).
- **Sparkline**: A high-frequency line chart showing TTFT (Time to First Token) over the last 60 seconds.
- **Velocity Badge**: A pulsing indicator that changes color based on the "Speed Tier" (e.g., >2000 tok/s = Emerald Glow).

### C. The Swarm Graph (Signature Moment)
**Anatomy**:
- **Nodes**: Glass circles with agent emojis.
- **Edges**: SVG paths with `stroke-dasharray`. When an agent is "streaming" to another, the edge animates using the `--animate-flow` keyframe.
- **Glow-State**: Active nodes emit a `box-shadow` using `--glow-logic`.

---

## 4. Production Implementation

### `src/components/ui/SpeedHUD.tsx`
```tsx
"use client";

import React from "react";
import { motion } from "motion/react";
import { Zap, Activity } from "lucide-react";

interface SpeedHUDProps {
  tps: number;
  ttft: number;
  isActive: boolean;
}

export function SpeedHUD({ tps, ttft, isActive }: SpeedHUDProps) {
  const velocityColor = tps > 2000 ? "text-accent-success" : "text-accent-logic";
  
  return (
    <div className="flex flex-col gap-6 p-4 rounded-2xl bg-obsidian-panel border border-obsidian-border backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <Activity size={14} /> Telemetry
        </h3>
        {isActive && (
          <span className="flex h-2 w-2 rounded-full bg-accent-success animate-pulse" />
        )}
      </div>

      <div className="relative flex flex-col items-center justify-center py-8">
        {/* Circular Gauge Background */}
        <svg className="w-32 h-32 transform -rotate-90">
          <circle 
            cx="64" cy="64" r="58" 
            className="stroke-obsidian-border fill-none" 
            strokeWidth="8" 
          />
          <motion.circle 
            cx="64" cy="64" r="58" 
            className={`fill-none stroke-current ${velocityColor}`} 
            strokeWidth="8" 
            strokeLinecap="round"
            initial={{ strokeDasharray: "0 364" }}
            animate={{ strokeDasharray: `${(tps / 3000) * 364} 364` }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-mono font-bold ${velocityColor}`}>
            {tps.toLocaleString()}
          </span>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">tok/s</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 rounded-lg bg-obsidian-surface border border-obsidian-border">
          <span className="text-[10px] font-mono text-zinc-500 block mb-1">TTFT</span>
          <span className="text-sm font-mono font-medium text-zinc-200">{ttft}ms</span>
        </div>
        <div className="p-3 rounded-lg bg-obsidian-surface border border-obsidian-border">
          <span className="text-[10px] font-mono text-zinc-500 block mb-1">Latency</span>
          <span className="text-sm font-mono font-medium text-zinc-200">Low</span>
        </div>
      </div>
    </div>
  );
}
```

### `src/components/ui/SwarmGraph.tsx`
```tsx
"use client";

import React from "react";
import { motion } from "motion/react";

interface Node {
  id: string;
  label: string;
  emoji: string;
  x: number;
  y: number;
  status: 'idle' | 'active' | 'completed';
}

interface Edge {
  from: string;
  to: string;
  active: boolean;
}

export function SwarmGraph({ nodes, edges }: { nodes: Node[], edges: Edge[] }) {
  return (
    <div className="relative w-full h-full bg-obsidian-bg overflow-hidden rounded-3xl border border-obsidian-border">
      <svg className="absolute inset-0 w-full h-full">
        {edges.map((edge, i) => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          return (
            <motion.path
              key={i}
              d={`M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`}
              stroke={edge.active ? "var(--accent-logic)" : "var(--border-obsidian)"}
              strokeWidth={edge.active ? "2" : "1"}
              fill="none"
              className={edge.active ? "animate-flow" : ""}
              strokeDasharray="5,5"
            />
          );
        })}
      </svg>

      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute flex items-center justify-center"
          style={{ left: node.x, top: node.y }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
        >
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center text-xl
            backdrop-blur-md border transition-all duration-500
            ${node.status === 'active' 
              ? "bg-accent-logic/20 border-accent-logic shadow-glow-logic" 
              : "bg-obsidian-panel border-obsidian-border"}
          `}>
            {node.emoji}
          </div>
          <span className="absolute -bottom-6 whitespace-nowrap text-[10px] font-mono text-zinc-400">
            {node.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
```

### `src/components/ui/SwarmCanvas.tsx` (The Shell)
```tsx
"use client";

import React from "react";
import { motion } from "motion/react";
import { SpeedHUD } from "./SpeedHUD";
import { SwarmGraph } from "./SwarmGraph";
import { LayoutDashboard, Terminal, Settings, Users } from "lucide-react";

export function SwarmCanvas() {
  return (
    <div className="flex h-screen w-full bg-obsidian-bg text-zinc-200 overflow-hidden p-4 gap-4">
      {/* LEFT: THE NEXUS */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 flex flex-col gap-4"
      >
        <div className="p-6 rounded-2xl bg-obsidian-panel border border-obsidian-border backdrop-blur-xl">
          <h1 className="text-xl font-bold tracking-tighter flex items-center gap-2">
            <div className="w-3 h-3 bg-accent-logic rounded-full" />
            OmniSwarm <span className="text-accent-logic">PRO</span>
          </h1>
        </div>

        <nav className="flex-1 p-2 rounded-2xl bg-obsidian-panel border border-obsidian-border backdrop-blur-xl flex flex-col gap-1">
          {[
            { icon: LayoutDashboard, label: "Canvas", active: true },
            { icon: Users, label: "Agent Forest", active: false },
            { icon: Terminal, label: "Console", active: false },
            { icon: Settings, label: "System", active: false },
          ].map((item) => (
            <button 
              key={item.label}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                item.active ? "bg-accent-logic text-white shadow-glow-logic" : "text-zinc-500 hover:bg-obsidian-surface hover:text-zinc-200"
              }`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>
      </motion.aside>

      {/* CENTER: THE FORGE */}
      <motion.main 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 relative rounded-3xl border border-obsidian-border overflow-hidden bg-obsidian-bg"
      >
        <SwarmGraph 
          nodes={[
            { id: '1', label: 'Planner', emoji: '🧠', x: 100, y: 100, status: 'completed' },
            { id: '2', label: 'Researcher A', emoji: '🔍', x: 300, y: 50, status: 'active' },
            { id: '3', label: 'Researcher B', emoji: '🌐', x: 300, y: 150, status: 'active' },
            { id: '4', label: 'Synthesizer', emoji: '🛠️', x: 500, y: 100, status: 'idle' },
          ]}
          edges={[
            { from: '1', to: '2', active: true },
            { from: '1', to: '3', active: true },
            { from: '2', to: '4', active: false },
            { from: '3', to: '4', active: false },
          ]}
        />
      </motion.main>

      {/* RIGHT: TELEMETRY WING */}
      <motion.aside 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 flex flex-col gap-4"
      >
        <SpeedHUD tps={2840} ttft={12} isActive={true} />
        
        <div className="flex-1 p-6 rounded-2xl bg-obsidian-panel border border-obsidian-border backdrop-blur-xl">
          <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 mb-4">Live Stream</h3>
          <div className="font-mono text-[11px] space-y-2 text-zinc-400">
            <p><span className="text-accent-success">[OK]</span> Planner initialized</p>
            <p><span className="text-accent-logic">[RUN]</span> Spawning Researcher A...</p>
            <p><span className="text-accent-logic">[RUN]</span> Spawning Researcher B...</p>
            <p className="animate-pulse text-zinc-200">_ streaming tokens...</p>
          </div>
        </div>
      </motion.aside>
    </div>
  );
}
```