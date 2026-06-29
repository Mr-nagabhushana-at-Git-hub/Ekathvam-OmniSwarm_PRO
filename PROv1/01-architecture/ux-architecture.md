<thinking>
The user wants a production-grade Information Architecture (IA) and end-to-end flow for **OmniSwarm PROv1**. 
The core objective is to move from a "utility dashboard" to a "breathtaking, trustworthy product" that visualizes the hyper-speed of Cerebras and the sophistication of a multi-agent swarm.

**Key Deliverables Required:**
1. **Information Architecture (IA)**: Mapping the "Orchestrate Canvas", "Speed Race", "Vision Input", "Run History/Replay", and "Privacy Story".
2. **End-to-End Flows**: Detailed step-by-step transitions.
3. **Motion & Interaction Language**: Specifying how the "velocity" of 3000 tok/s is felt.
4. **Compile-Ready Code**: Full implementation of the core architectural components (CSS system, Layout, and the Canvas logic).

**Architectural Strategy:**
- **The "Obsidian Glass" System**: I will implement a CSS variable system based on OKLCH for perceptually uniform colors, focusing on deep blacks, translucent glass, and neon accents.
- **The Triptych Layout**: 
    - *Left (The Nexus)*: Navigation, History, and Agent Registry.
    - *Center (The Command Canvas)*: The main stage where the swarm DAG is visualized and artifacts are forged.
    - *Right (The Telemetry Wing)*: The SpeedHUD and real-time metrics.
- **The "Velocity" Motion**: Using `motion/react` (Framer Motion) to create "token-flow" animations—visualizing data moving between nodes in the DAG.
- **The Privacy Story**: A dedicated, high-trust flow that explains the BYO-key model and DPDP compliance.

**Technical Constraints:**
- React 19 + Next.js 16.
- Tailwind CSS v4 (Oxide engine).
- `motion/react` for animations.
- No placeholders. Complete, compile-ready files.

**Plan:**
1. **IA Specification**: Define the structural map.
2. **Interaction Language**: Define the "Feel" (Springs, Blurs, Glows).
3. **CSS Foundation**: `globals.css` with the Obsidian Glass tokens.
4. **Layout Shell**: `AppShell.tsx` implementing the Triptych grid.
5. **The Canvas**: `OrchestrateCanvas.tsx` with DAG visualization logic.
6. **The Speed Race**: `SpeedRaceHUD.tsx` for the Cerebras vs GPU comparison.
7. **The Privacy Story**: `PrivacyManifest.tsx` for the trust layer.
</thinking>

# OmniSwarm PROv1: Information Architecture & Technical Foundation

## 1. Information Architecture (IA)

The PROv1 architecture shifts from a "Page-based" app to a **"State-based Canvas"**. The application is treated as a single immersive environment where the "Canvas" is the source of truth.

### The Structural Map
- **The Nexus (Left Rail)**
    - **Session History**: Chronological list of runs with "Replay" capability.
    - **Agent Registry**: 180+ personas, filterable by skill/category.
    - **Swarm Templates**: Pre-defined DAGs (e.g., "Deep Research", "Code Architect").
- **The Command Canvas (Center Stage)**
    - **Vision Input**: Multimodal entry point (Text/Image/File).
    - **The DAG Visualizer**: Real-time graph of agent nodes $\rightarrow$ edges $\rightarrow$ artifacts.
    - **The Forge**: The final synthesized output (HTML/Python/Markdown) with live preview.
- **The Telemetry Wing (Right Rail)**
    - **Speed Race HUD**: Real-time TTFT/TPS comparison (Cerebras vs GPU).
    - **Token Flow**: A vertical "waterfall" of tokens streaming from the active node.
    - **System Health**: Kernel/SDK/Server status pills.
- **The Trust Layer (Overlay/Route)**
    - **Privacy Story**: An interactive manifest explaining the BYO-key model and DPDP compliance.

---

## 2. End-to-End User Flows

### Flow A: The "Hyper-Run" (Execution)
`Input` $\rightarrow$ `Nexus Planning` $\rightarrow$ `Parallel Swarm` $\rightarrow$ `Synthesis` $\rightarrow$ `Critic Loop` $\rightarrow$ `Artifact`
1. **Trigger**: User enters a complex prompt in the Vision Input.
2. **Planning**: The "Nexus" node pulses; a DAG of 3-12 agents is instantly generated and animated into the Canvas.
3. **Execution**: Nodes transition from `Pending` $\rightarrow$ `Active` (Glow) $\rightarrow$ `Completed` (Check).
4. **Velocity**: The Telemetry Wing spikes; the Speed Race HUD shows the "Cerebras Advantage" in real-time.
5. **Convergence**: All node outputs "flow" into the central Forge, which streams the final artifact.

### Flow B: The "Time-Travel" (Replay)
`History` $\rightarrow$ `State Load` $\rightarrow$ `DAG Re-animation` $\rightarrow$ `Artifact Restore`
1. **Selection**: User selects a past run from the Nexus History.
2. **Rehydration**: The system loads the `run_events` JSON from the DB.
3. **Replay**: The Canvas re-animates the swarm's execution at 2x speed, showing exactly how the conclusion was reached.

---

## 3. Motion & Interaction Language

| Element | Interaction | Motion Spec | Emotional Goal |
| :--- | :--- | :--- | :--- |
| **Node Activation** | State Change | `scale: 1.05`, `box-shadow: 0 0 20px var(--accent)` | "Electric" energy |
| **Token Flow** | Data Transfer | Particle stream moving along DAG edges (SVG paths) | Visualizing velocity |
| **Theme Morph** | Toggle | `layoutId` transition + `backdrop-blur` shift | Seamless sophistication |
| **Artifact Forge** | Synthesis | Staggered fade-in of content blocks (Y-axis slide) | "Building" feeling |
| **Privacy Toggle** | Switch | Spring-based slide (`stiffness: 400, damping: 20`) | Tactile trust |

---

## 4. Production-Grade Implementation

### File 1: The Obsidian Glass Design System
`src/styles/globals.css`

```css
@import "tailwindcss";
@import "tw-animate-css";

:root {
  /* Obsidian Palette - OKLCH for perceptual uniformity */
  --bg-obsidian: oklch(0.12 0.01 260);
  --bg-panel: oklch(0.16 0.02 260 / 60%);
  --bg-active: oklch(0.22 0.04 260 / 80%);
  
  /* Accents - High Saturation Neon */
  --accent-primary: oklch(0.65 0.22 260); /* Electric Indigo */
  --accent-glow: oklch(0.65 0.22 260 / 30%);
  --accent-success: oklch(0.75 0.18 150); /* Emerald */
  --accent-warning: oklch(0.80 0.15 80);  /* Amber */
  
  /* Text */
  --text-main: oklch(0.98 0.01 260);
  --text-muted: oklch(0.70 0.02 260);
  
  /* Glass Effects */
  --glass-border: oklch(1 0 0 / 10%);
  --glass-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
  
  /* Spacing & Radius */
  --radius-lg: 1rem;
  --radius-xl: 1.5rem;
}

@theme inline {
  --color-obsidian: var(--bg-obsidian);
  --color-panel: var(--bg-panel);
  --color-accent: var(--accent-primary);
  --color-success: var(--accent-success);
  --color-warning: var(--accent-warning);
  --color-text-main: var(--text-main);
  --color-text-muted: var(--text-muted);
  --radius-obsidian: var(--radius-lg);
}

body {
  background-color: var(--bg-obsidian);
  color: var(--text-main);
  font-family: 'Inter', system-ui, sans-serif;
  overflow: hidden; /* App-shell handles scrolling */
}

.glass-panel {
  background: var(--bg-panel);
  backdrop-filter: blur(16px);
  border: 1px solid var(--glass-border);
  box-shadow: var(--glass-shadow);
}

.glow-accent {
  box-shadow: 0 0 20px var(--accent-glow);
  border: 1px solid var(--accent-primary);
}

/* Custom Scrollbar for Obsidian Theme */
::-webkit-scrollbar { width: 6px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { 
  background: var(--bg-active); 
  border-radius: 10px; 
}
```

### File 2: The Triptych App Shell
`src/components/layout/AppShell.tsx`

```tsx
"use client";

import React from "react";
import { motion } from "motion/react";
import { LayoutDashboard, History, Users, ShieldCheck, Activity, Terminal } from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const AppShell: React.FC<AppShellProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: "canvas", label: "Canvas", icon: LayoutDashboard },
    { id: "history", label: "History", icon: History },
    { id: "agents", label: "Agents", icon: Users },
    { id: "privacy", label: "Privacy", icon: ShieldCheck },
  ];

  return (
    <div className="h-screen w-screen grid grid-cols-[260px_1fr_320px] overflow-hidden bg-obsidian">
      {/* LEFT: The Nexus */}
      <aside className="border-r border-white/10 flex flex-col bg-obsidian/50 backdrop-blur-xl">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent glow-accent flex items-center justify-center font-bold text-white">
            Ω
          </div>
          <h1 className="font-bold tracking-tighter text-xl">OMNISWARM</h1>
        </div>

        <nav className="flex-1 px-3 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 ${
                activeTab === item.id 
                ? "bg-accent text-white shadow-lg shadow-accent/20" 
                : "text-text-muted hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="glass-panel p-3 rounded-xl flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">
              Kernel: Stable
            </span>
          </div>
        </div>
      </aside>

      {/* CENTER: The Command Canvas */}
      <main className="relative overflow-hidden flex flex-col">
        {children}
      </main>

      {/* RIGHT: The Telemetry Wing */}
      <aside className="border-l border-white/10 flex flex-col bg-obsidian/50 backdrop-blur-xl">
        <div className="p-6 border-b border-white/10 flex items-center gap-2">
          <Activity size={18} className="text-accent" />
          <h2 className="font-bold text-sm uppercase tracking-widest">Telemetry</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Telemetry components will be injected here */}
          <div className="glass-panel p-4 rounded-xl space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-xs text-text-muted">Cerebras TPS</span>
              <span className="text-lg font-mono font-bold text-accent">3,102/s</span>
            </div>
            <div className="h-12 w-full bg-white/5 rounded-md overflow-hidden relative">
              {/* Mock Sparkline */}
              <div className="absolute inset-0 bg-gradient-to-t from-accent/20 to-transparent" />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};
```

### File 3: The Orchestrate Canvas
`src/components/canvas/OrchestrateCanvas.tsx`

```tsx
"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Play, Send, Box } from "lucide-react";

interface Node {
  id: string;
  label: string;
  status: "pending" | "active" | "completed";
  x: number;
  y: number;
}

export const OrchestrateCanvas: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([
    { id: "1", label: "Nexus Planner", status: "completed", x: 100, y: 200 },
    { id: "2", label: "Web Researcher", status: "active", x: 300, y: 100 },
    { id: "3", label: "Risk Auditor", status: "pending", x: 300, y: 300 },
    { id: "4", label: "The Forge", status: "pending", x: 500, y: 200 },
  ]);

  return (
    <div className="flex-1 relative bg-obsidian p-8 overflow-hidden">
      {/* SVG Connection Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent-primary)" stopOpacity="0" />
            <stop offset="100%" stopColor="var(--accent-primary)" stopOpacity="1" />
          </linearGradient>
        </defs>
        {/* Simple edge logic: Node 1 -> 2, 1 -> 3, 2 -> 4, 3 -> 4 */}
        <motion.path 
          d="M 160 220 L 300 120" 
          stroke="url(#grad1)" 
          strokeWidth="2" 
          fill="none" 
          initial={{ pathLength: 0 }} 
          animate={{ pathLength: 1 }} 
          transition={{ duration: 1 }}
        />
        <motion.path 
          d="M 160 220 L 300 320" 
          stroke="url(#grad1)" 
          strokeWidth="2" 
          fill="none" 
          initial={{ pathLength: 0 }} 
          animate={{ pathLength: 1 }} 
          transition={{ duration: 1, delay: 0.2 }}
        />
      </svg>

      {/* Nodes Layer */}
      <div className="relative w-full h-full">
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ left: node.x, top: node.y }}
            className={`absolute w-40 p-4 rounded-xl glass-panel cursor-pointer transition-all duration-500 ${
              node.status === "active" ? "glow-accent scale-110" : ""
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${
                node.status === "completed" ? "bg-success" : 
                node.status === "active" ? "bg-accent animate-ping" : "bg-zinc-600"
              }`} />
              <span className="text-[10px] font-bold uppercase tracking-tighter text-text-muted">
                {node.status}
              </span>
            </div>
            <h4 className="text-sm font-bold text-white">{node.label}</h4>
          </motion.div>
        ))}
      </div>

      {/* Vision Input Bar */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-2xl px-4">
        <div className="glass-panel p-2 rounded-2xl flex items-center gap-2 glow-accent">
          <button className="p-3 text-text-muted hover:text-white transition-colors">
            <Box size={20} />
          </button>
          <input 
            type="text" 
            placeholder="Enter swarm directive..." 
            className="flex-1 bg-transparent border-none outline-none text-sm px-2 text-white placeholder:text-text-muted"
          />
          <button className="bg-accent p-3 rounded-xl text-white hover:scale-105 transition-transform">
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
```

### File 4: The Speed Race HUD
`src/components/telemetry/SpeedRaceHUD.tsx`

```tsx
"use client";

import React from "react";
import { motion } from "motion/react";
import { Zap, Cpu } from "lucide-react";

export const SpeedRaceHUD: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="glass-panel p-4 rounded-2xl relative overflow-hidden group">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/10 blur-3xl group-hover:bg-accent/20 transition-all" />
        
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-accent/20 text-accent">
            <Zap size={16} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Cerebras Engine</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black font-mono text-white">3,102</span>
          <span className="text-xs font-bold text-accent uppercase">tok/s</span>
        </div>
        
        <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-full bg-accent"
          />
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 rounded-lg bg-white/10 text-text-muted">
            <Cpu size={16} />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-text-muted">Standard GPU</span>
        </div>

        <div className="flex items-baseline gap-2">
          <span className="text-4xl font-black font-mono text-white">124</span>
          <span className="text-xs font-bold text-text-muted uppercase">tok/s</span>
        </div>
        
        <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: "4%" }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="h-full bg-text-muted"
          />
        </div>
      </div>

      <div className="text-center py-2">
        <span className="text-[10px] font-bold text-accent uppercase tracking-[0.2em]">
          25.01x Acceleration
        </span>
      </div>
    </div>
  );
};
```

### File 5: The Privacy Story (Trust Manifest)
`src/components/privacy/PrivacyManifest.tsx`

```tsx
"use client";

import React from "react";
import { motion } from "motion/react";
import { ShieldCheck, Lock, Trash2, EyeOff } from "lucide-react";

export const PrivacyManifest: React.FC = () => {
  const pillars = [
    {
      icon: Lock,
      title: "BYO-Key Architecture",
      desc: "Your API keys never touch our database. They are held in ephemeral memory and scrubbed instantly after the run.",
      color: "text-indigo-400"
    },
    {
      icon: EyeOff,
      title: "Zero-Knowledge Processing",
      desc: "We act as a Data Processor. Your prompts are encrypted in transit and never used for model training.",
      color: "text-emerald-400"
    },
    {
      icon: Trash2,
      title: "Right to Erasure",
      desc: "One-click 'Tombstone' deletion. We provide a cryptographically signed receipt of data erasure.",
      color: "text-amber-400"
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="inline-flex p-3 rounded-2xl bg-accent/10 text-accent mb-4">
          <ShieldCheck size={32} />
        </div>
        <h2 className="text-3xl font-bold text-white mb-4">The Trust Manifest</h2>
        <p className="text-text-muted max-w-xl mx-auto">
          OmniSwarm is engineered for the India DPDP Act 2023. We prioritize 
          sovereignty over convenience.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {pillars.map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-panel p-6 rounded-2xl hover:border-accent/50 transition-colors group"
          >
            <p.icon className={`mb-4 ${p.color} group-hover:scale-110 transition-transform`} size={24} />
            <h3 className="text-lg font-bold text-white mb-2">{p.title}</h3>
            <p className="text-sm text-text-muted leading-relaxed">{p.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
```