<thinking>
The objective is to implement the "OmniSwarm PROv1" design system. This is a high-end, "Agentic OS" visual system that must communicate extreme velocity (Cerebras 3000 tok/s) and premium aesthetics (Obsidian Glass).

**Key Architectural Decisions:**
1.  **Styling**: Tailwind v4 CSS-first approach. I will use a global CSS file for design tokens using OKLCH for perceptual uniformity and high-saturation neon accents.
2.  **Layout**: A Triptych "Command Center" layout:
    -   **Nexus (Left)**: Navigation and Agent Directory.
    -   **Forge (Center)**: The main execution canvas.
    -   **Telemetry (Right)**: High-fidelity performance HUD.
3.  **Motion**: `motion/react` (Framer Motion) for all state transitions, specifically using spring physics to avoid the "robotic" feel of linear animations.
4.  **Accessibility**: WCAG 2.1 AA. High contrast for telemetry, ARIA roles for the live DAG, and keyboard-accessible navigation.

**Component Breakdown:**
-   `tokens.css`: The source of truth for the Obsidian theme.
-   `Layout.tsx`: The Triptych shell.
-   `SpeedHUD.tsx`: The signature velocity gauge.
-   `SwarmGraph.tsx`: The live agent interaction visualizer (DAG).
-   `AgentNode.tsx`: Individual agent primitives.
-   `NexusPanel.tsx`: The left-hand navigation.
</thinking>

### 1. Design Tokens & Theme
This file establishes the "Obsidian Glass" aesthetic. I am using OKLCH to ensure that the neon accents (Indigo, Emerald) maintain their vibrancy without shifting hue when transparency is applied.

`src/styles/tokens.css`
```css
@import "tailwindcss";
@import "tw-animate-css";

:root {
  /* --- Obsidian Palette (Base) --- */
  /* Deep, slightly blue-tinted blacks for maximum depth */
  --bg-obsidian: oklch(0.12 0.01 260);       
  --panel-obsidian: oklch(0.18 0.02 260 / 60%); 
  --border-obsidian: oklch(0.25 0.02 260 / 30%); 
  --surface-obsidian: oklch(0.22 0.02 260 / 40%); 

  /* --- Hyper-Velocity Accents (OKLCH) --- */
  /* Perceptually uniform neon colors */
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
  /* Color Mapping */
  --color-obsidian-bg: var(--bg-obsidian);
  --color-obsidian-panel: var(--panel-obsidian);
  --color-obsidian-border: var(--border-obsidian);
  --color-obsidian-surface: var(--surface-obsidian);
  
  --color-accent-logic: var(--accent-logic);
  --color-accent-success: var(--accent-success);
  --color-accent-warning: var(--accent-warning);
  --color-accent-error: var(--accent-error);

  /* Shadows */
  --shadow-glow-logic: var(--glow-logic);
  --shadow-glow-success: var(--glow-success);

  /* Custom Animations */
  --animate-pulse-slow: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  --animate-flow: flow 2s linear infinite;

  @keyframes flow {
    from { stroke-dashoffset: 20; }
    to { stroke-dashoffset: 0; }
  }
}

/* Global Reset for Obsidian OS */
body {
  background-color: var(--bg-obsidian);
  color: oklch(0.98 0 0);
  font-family: var(--font-sans);
  -webkit-font-smoothing: antialiased;
}

.glass-panel {
  background: var(--panel-obsidian);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-obsidian);
  border-radius: var(--radius-os);
}
```

### 2. The Command Center Layout
The Triptych layout ensures that navigation, execution, and telemetry are logically separated but visually unified.

`src/components/layout/CommandCenter.tsx`
```tsx
"use client";

import React from "react";
import { motion } from "motion/react";
import { NexusPanel } from "../layout/NexusPanel";
import { TelemetryWing } from "../layout/TelemetryWing";
import { ForgeCanvas } from "../layout/ForgeCanvas";

export const CommandCenter: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-obsidian-bg text-zinc-100">
      {/* Left: The Nexus */}
      <aside className="w-[280px] h-full border-r border-obsidian-border flex-shrink-0">
        <NexusPanel />
      </aside>

      {/* Center: The Forge */}
      <main className="flex-1 h-full relative overflow-hidden">
        <ForgeCanvas>
          {children}
        </ForgeCanvas>
      </main>

      {/* Right: The Telemetry Wing */}
      <aside className="w-[320px] h-full border-l border-obsidian-border flex-shrink-0">
        <TelemetryWing />
      </aside>
    </div>
  );
};
```

### 3. The SpeedHUD (Signature Velocity Gauge)
This component is the visual heart of the Cerebras experience, turning raw TPS numbers into a cinematic gauge.

`src/components/ui/SpeedHUD.tsx`
```tsx
"use client";

import React from "react";
import { motion } from "motion/react";
import { Activity, Zap } from "lucide-react";

interface SpeedHUDProps {
  tps: number;
  ttft: number;
  isActive: boolean;
}

export const SpeedHUD: React.FC<SpeedHUDProps> = ({ tps, ttft, isActive }) => {
  // Dynamic color based on velocity tiers
  const velocityColor = tps > 2000 ? "text-accent-success" : "text-accent-logic";
  const strokeColor = tps > 2000 ? "stroke-accent-success" : "stroke-accent-logic";

  return (
    <div className="glass-panel p-6 flex flex-col gap-6 shadow-glow-logic/10">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-2">
          <Activity size={14} className="text-accent-logic" /> Velocity Telemetry
        </h3>
        {isActive && (
          <span className="flex h-2 w-2 rounded-full bg-accent-success animate-pulse shadow-glow-success" />
        )}
      </div>

      <div className="relative flex flex-col items-center justify-center py-4">
        {/* SVG Gauge */}
        <svg className="w-40 h-40 transform -rotate-90" aria-hidden="true">
          <circle 
            cx="80" cy="80" r="70" 
            className="stroke-obsidian-border fill-none" 
            strokeWidth="12" 
          />
          <motion.circle 
            cx="80" cy="80" r="70" 
            className={`fill-none ${strokeColor}`} 
            strokeWidth="12" 
            strokeLinecap="round"
            initial={{ strokeDasharray: "0 440" }}
            animate={{ strokeDasharray: `${Math.min((tps / 3000) * 440, 440)} 440` }}
            transition={{ type: "spring", stiffness: 60, damping: 12 }}
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span 
            key={tps}
            initial={{ opacity: 0.8, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-4xl font-mono font-bold ${velocityColor}`}
          >
            {tps.toLocaleString()}
          </motion.span>
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-tighter">tokens / sec</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-obsidian-surface border border-obsidian-border">
          <span className="text-[10px] font-mono text-zinc-500 block mb-1">TTFT</span>
          <span className="text-sm font-mono font-medium text-zinc-200">{ttft}ms</span>
        </div>
        <div className="p-3 rounded-lg bg-obsidian-surface border border-obsidian-border">
          <span className="text-[10px] font-mono text-zinc-500 block mb-1">Latency</span>
          <span className="text-sm font-mono font-medium text-zinc-200">~{Math.round(ttft/10)}ms</span>
        </div>
      </div>
    </div>
  );
};
```

### 4. The Swarm Graph (Live DAG)
Visualizes the agent orchestration. Edges "flow" when data is being streamed between agents.

`src/components/ui/SwarmGraph.tsx`
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
  status: 'idle' | 'active' | 'complete';
}

interface Edge {
  from: string;
  to: string;
  active: boolean;
}

interface SwarmGraphProps {
  nodes: Node[];
  edges: Edge[];
}

export const SwarmGraph: React.FC<SwarmGraphProps> = ({ nodes, edges }) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="0" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="var(--border-obsidian)" />
          </marker>
        </defs>
        
        {edges.map((edge, i) => {
          const fromNode = nodes.find(n => n.id === edge.from);
          const toNode = nodes.find(n => n.id === edge.to);
          if (!fromNode || !toNode) return null;

          return (
            <motion.path
              key={`edge-${i}`}
              d={`M ${fromNode.x} ${fromNode.y} L ${toNode.x} ${toNode.y}`}
              stroke={edge.active ? "var(--accent-logic)" : "var(--border-obsidian)"}
              strokeWidth={edge.active ? 2 : 1}
              fill="none"
              markerEnd="url(#arrowhead)"
              className={edge.active ? "animate-flow" : ""}
              strokeDasharray={edge.active ? "4 2" : "0"}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          );
        })}
      </svg>

      {nodes.map((node) => (
        <motion.div
          key={node.id}
          className="absolute flex items-center justify-center w-12 h-12 rounded-full glass-panel cursor-pointer group"
          style={{ left: node.x - 24, top: node.y - 24 }}
          whileHover={{ scale: 1.1 }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className={`absolute inset-0 rounded-full blur-md transition-opacity duration-500 ${
            node.status === 'active' ? 'bg-accent-logic/40 opacity-100' : 'opacity-0'
          }`} />
          <span className="relative z-10 text-xl">{node.emoji}</span>
          
          {/* Tooltip */}
          <div className="absolute top-full mt-2 px-2 py-1 rounded bg-zinc-900 text-[10px] font-mono text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            {node.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};
```

### 5. Supporting Layout Components
Completing the Triptych with the Nexus and Telemetry shells.

`src/components/layout/NexusPanel.tsx`
```tsx
"use client";

import React from "react";
import { LayoutGrid, History, Settings, Users } from "lucide-react";

export const NexusPanel: React.FC = () => {
  const menuItems = [
    { icon: LayoutGrid, label: "Dashboard", active: true },
    { icon: Users, label: "Agent Forest", active: false },
    { icon: History, label: "Session History", active: false },
    { icon: Settings, label: "System Config", active: false },
  ];

  return (
    <div className="flex flex-col h-full p-4 gap-8">
      <div className="px-2 py-4">
        <h1 className="text-xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-6 h-6 bg-accent-logic rounded-sm rotate-45" />
          OmniSwarm <span className="text-accent-logic text-xs font-mono">PROv1</span>
        </h1>
      </div>

      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              item.active 
                ? "bg-accent-logic/10 text-accent-logic border border-accent-logic/20" 
                : "text-zinc-500 hover:text-zinc-200 hover:bg-obsidian-surface"
            }`}
          >
            <item.icon size={18} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 rounded-xl bg-obsidian-surface border border-obsidian-border">
        <p className="text-[10px] font-mono text-zinc-500 uppercase mb-2">System Status</p>
        <div className="flex items-center gap-2 text-xs text-accent-success">
          <div className="w-1.5 h-1.5 rounded-full bg-accent-success animate-pulse" />
          Cerebras Cluster Online
        </div>
      </div>
    </div>
  );
};
```

`src/components/layout/TelemetryWing.tsx`
```tsx
"use client";

import React from "react";
import { SpeedHUD } from "../ui/SpeedHUD";

export const TelemetryWing: React.FC = () => {
  return (
    <div className="flex flex-col h-full p-4 gap-4 overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xs font-mono uppercase tracking-widest text-zinc-500">Telemetry Wing</h2>
      </div>
      
      <SpeedHUD tps={2840} ttft={142} isActive={true} />
      
      <div className="glass-panel p-4 flex flex-col gap-3">
        <h3 className="text-[10px] font-mono uppercase text-zinc-500">Live Event Stream</h3>
        <div className="font-mono text-[11px] space-y-2 h-64 overflow-y-auto scrollbar-hide">
          <div className="text-zinc-400"><span className="text-accent-logic">[14:02:01]</span> Planner dispatched.</div>
          <div className="text-zinc-400"><span className="text-accent-logic">[14:02:02]</span> Research nodes spawned (x3).</div>
          <div className="text-accent-success"><span className="text-accent-logic">[14:02:03]</span> 1.2M tokens processed.</div>
          <div className="text-zinc-400"><span className="text-accent-logic">[14:02:04]</span> Synthesizer active.</div>
        </div>
      </div>
    </div>
  );
};
```

`src/components/layout/ForgeCanvas.tsx`
```tsx
"use client";

import React from "react";
import { SwarmGraph } from "../ui/SwarmGraph";

export const ForgeCanvas: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  // Mock data for the graph
  const nodes = [
    { id: 'p', label: 'Planner', emoji: '🧠', x: 100, y: 300, status: 'complete' },
    { id: 'r1', label: 'Researcher A', emoji: '🔍', x: 300, y: 150, status: 'active' },
    { id: 'r2', label: 'Researcher B', emoji: '🔍', x: 300, y: 300, status: 'active' },
    { id: 'r3', label: 'Researcher C', emoji: '🔍', x: 300, y: 450, status: 'active' },
    { id: 's', label: 'Synthesizer', emoji: '⚡', x: 500, y: 300, status: 'idle' },
  ];

  const edges = [
    { from: 'p', to: 'r1', active: true },
    { from: 'p', to: 'r2', active: true },
    { from: 'p', to: 'r3', active: true },
    { from: 'r1', to: 's', active: false },
    { from: 'r2', to: 's', active: false },
    { from: 'r3', to: 's', active: false },
  ];

  return (
    <div className="relative w-full h-full bg-obsidian-bg">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'radial-gradient(var(--border-obsidian) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
      
      <SwarmGraph nodes={nodes} edges={edges} />
      
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4">
        <div className="glass-panel p-4 min-h-[120px] shadow-2xl border-accent-logic/30">
          {children || (
            <div className="text-zinc-400 font-mono text-sm animate-pulse">
              Awaiting swarm dispatch...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
```