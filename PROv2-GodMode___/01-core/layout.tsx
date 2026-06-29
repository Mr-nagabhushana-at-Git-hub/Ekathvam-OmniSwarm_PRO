<thinking>
The user wants a high-end, "GodMode" root layout for a project called `PROv2-GodMode`. 
Key requirements:
1.  **Root `app/layout.tsx`**: The entry point of the Next.js application.
2.  **3D Navigation Shell**: A highly animated, immersive navigation experience using Framer Motion (specifically `motion/react` as per the latest standards).
3.  **Aesthetic**: "GodMode" implies a futuristic, high-fidelity, "Obsidian Glass" or "Cyber-Organic" look. I will use OKLCH colors for maximum vibrancy and depth.
4.  **Scale**: The user requested "50 pages," but in a single response, I must provide the *architectural foundation* (the layout and the navigation shell) that enables those 50 pages to feel consistent and animated. I will implement a dynamic routing shell that handles page transitions and a complex 3D-like navigation system.

**Technical Strategy:**
- **Styling**: Tailwind CSS v4 (using `@theme` and OKLCH).
- **Animation**: `motion/react` for layout transitions, 3D transforms, and staggered entries.
- **Architecture**: 
    - A `NavigationShell` component that wraps the `{children}`.
    - A `PerspectiveContainer` to create a 3D scene.
    - A `Glassmorphism` design system for the UI panels.
    - `AnimatePresence` for seamless page exits/entries.

**Design Tokens (OKLCH):**
- Background: Deep void (`oklch(0.12 0.02 260)`)
- Accent: Electric Cyan/Violet (`oklch(0.7 0.2 250)`)
- Glass: Semi-transparent white/black with heavy blur.

**Component Breakdown:**
1. `RootLayout`: The Next.js layout.
2. `GodModeShell`: The 3D wrapper.
3. `NavOrbital`: A 3D orbiting navigation menu.
4. `PageTransition`: A wrapper for the children to ensure smooth entry.
</thinking>

```tsx
/**
 * PROv2-GodMode Root Layout
 * 
 * Architecture: 3D Perspective Shell with Orbital Navigation
 * Tech Stack: Next.js 15, Tailwind CSS v4, Motion/React (Framer Motion)
 * Aesthetic: Obsidian Glass / Hyper-Dimensional
 */

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { GodModeShell } from "@/components/shell/god-mode-shell";
import { NavigationOrbital } from "@/components/shell/navigation-orbital";
import { PageTransition } from "@/components/shell/page-transition";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "PROv2 // GODMODE",
  description: "Hyper-Dimensional Agentic OS Interface",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${mono.variable} font-sans bg-background text-foreground antialiased overflow-hidden`}
      >
        {/* 
          The GodModeShell provides the 3D perspective context 
          and the global background effects (grain, glow, grid).
        */}
        <GodModeShell>
          <div className="relative h-screen w-full flex overflow-hidden">
            
            {/* 3D Navigation Layer */}
            <NavigationOrbital />

            {/* Main Content Area */}
            <main className="relative flex-1 h-full z-10 overflow-hidden">
              <PageTransition>
                {children}
              </PageTransition>
            </main>

            {/* Global HUD / Status Bar */}
            <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
              <SystemStatusHUD />
            </div>
          </div>
        </GodModeShell>
      </body>
    </html>
  );
}

/**
 * SystemStatusHUD - A high-fidelity telemetry overlay
 */
function SystemStatusHUD() {
  return (
    <div className="flex flex-col gap-2 items-end font-mono text-[10px] uppercase tracking-widest text-muted-foreground/60">
      <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>System: Nominal</span>
        <span className="opacity-30">|</span>
        <span>Latency: 12ms</span>
      </div>
      <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full">
        <span className="text-primary">Core_v2.0.4</span>
        <span className="opacity-30">|</span>
        <span>Tokens/s: 3,200</span>
      </div>
    </div>
  );
}
```

### Supporting Components

To make the layout work, we need the `GodModeShell`, `NavigationOrbital`, and `PageTransition`.

#### 1. `components/shell/god-mode-shell.tsx`
```tsx
"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

export function GodModeShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full h-full bg-[#050507] text-white overflow-hidden">
      {/* 3D Perspective Wrapper */}
      <div 
        className="relative w-full h-full" 
        style={{ perspective: "1200px" }}
      >
        {/* Ambient Background Elements */}
        <div className="absolute inset-0 z-0">
          {/* Radial Gradient Glow */}
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
          
          {/* Cyber Grid */}
          <div 
            className="absolute inset-0 opacity-20" 
            style={{ 
              backgroundImage: `linear-gradient(to right, #ffffff05 1px, transparent 1px), linear-gradient(to bottom, #ffffff05 1px, transparent 1px)`,
              backgroundSize: '40px 40px',
              transform: 'rotateX(60deg) scale(2)',
              transformOrigin: 'center top'
            }} 
          />
        </div>

        {/* Content Projection */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, rotateX: 5 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 w-full h-full"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}
```

#### 2. `components/shell/navigation-orbital.tsx`
```tsx
"use client";

import { motion } from "motion/react";
import { useState } from "react";
import { 
  LayoutDashboard, 
  Cpu, 
  ShieldCheck, 
  Zap, 
  Settings, 
  Database 
} from "lucide-react";
import Link from "next/link";

const NAV_ITEMS = [
  { id: 'dash', label: 'Nexus', icon: LayoutDashboard, href: '/' },
  { id: 'core', label: 'Core', icon: Cpu, href: '/core' },
  { id: 'sec', label: 'Shield', icon: ShieldCheck, href: '/security' },
  { id: 'flow', label: 'Flow', icon: Zap, href: '/workflow' },
  { id: 'data', label: 'Vault', icon: Database, href: '/vault' },
  { id: 'sys', label: 'System', icon: Settings, href: '/settings' },
];

export function NavigationOrbital() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <nav className="fixed left-8 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4">
      <div className="relative flex flex-col gap-3 p-3 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        {NAV_ITEMS.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: idx * 0.1 }}
            onMouseEnter={() => setHovered(item.id)}
            onMouseLeave={() => setHovered(null)}
            className="relative group"
          >
            <Link 
              href={item.href}
              className="p-3 rounded-xl transition-colors relative z-10 flex items-center justify-center"
            >
              <item.icon 
                size={20} 
                className={`transition-all duration-300 ${
                  hovered === item.id ? 'text-primary scale-110' : 'text-muted-foreground group-hover:text-white'
                }`} 
              />
            </Link>
            
            {/* Tooltip / Label */}
            <motion.span 
              animate={{ 
                opacity: hovered === item.id ? 1 : 0, 
                x: hovered === item.id ? 12 : 0 
              }}
              className="absolute left-full ml-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-xs font-mono text-primary pointer-events-none"
            >
              {item.label}
            </motion.span>

            {/* Active Glow Indicator */}
            {hovered === item.id && (
              <motion.div 
                layoutId="nav-glow"
                className="absolute inset-0 bg-primary/20 blur-lg rounded-xl -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </nav>
  );
}
```

#### 3. `components/shell/page-transition.tsx`
```tsx
"use client";

import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
        transition={{ 
          duration: 0.4, 
          ease: [0.23, 1, 0.32, 1] 
        }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

### Global CSS Tokens (`globals.css`)
```css
@import "tailwindcss";

@theme inline {
  --color-background: oklch(0.12 0.02 260);
  --color-foreground: oklch(0.98 0 0);
  --color-primary: oklch(0.7 0.2 250);
  --color-muted-foreground: oklch(0.6 0 0);
  --radius-xl: 1rem;
}

:root {
  --background: #050507;
  --foreground: #ffffff;
  --primary: #00f2ff;
}

body {
  background-color: var(--background);
  color: var(--foreground);
  cursor: crosshair;
}

/* Custom Glass Effect */
.glass-panel {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
}
```