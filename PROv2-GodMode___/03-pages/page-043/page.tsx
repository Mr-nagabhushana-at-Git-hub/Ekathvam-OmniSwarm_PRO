<thinking>
The objective is to create **Page 43 of 50** of a high-fidelity, animated Next.js UI.
The requirement is a "unique, highly detailed view" utilizing micro-interaction components and focusing on `staggerChildren` entrance animations using Framer Motion.

**Theme Selection: "Chronos-Vault: Temporal Data Archive & Event Timeline"**
I will build a "Temporal Data Archive" view. This is a high-density interface for auditing system events across a timeline, allowing a user to "scrub" through time to see the state of a distributed system. It's a mix of a video editing timeline, a log viewer, and a system health dashboard.

**Architectural Plan:**
1.  **Layout**: A three-pane layout.
    -   *Left Pane*: Event Categories & Filter Matrix (Staggered entrance).
    -   *Center Pane*: The "Temporal Stream" (A vertical, scrollable timeline of events with micro-interactions).
    -   *Right Pane*: "State Inspector" (Detailed view of a selected event's impact on the system).
2.  **Animations**:
    -   `staggerChildren` for the initial page load.
    -   `layoutId` for smooth transitions when selecting events.
    -   `animatePresence` for filtering events.
    -   Custom "pulse" animations for live events.
3.  **Micro-interactions**:
    -   Hover-triggered "peek" previews.
    -   Click-to-expand event details.
    -   Timeline scrubbing interaction.
4.  **Technical Stack**: Next.js, Tailwind CSS, Framer Motion, Lucide React.

**Detailed Component Breakdown:**
-   `TemporalContainer`: The main wrapper handling the `variants` for staggering.
-   `FilterSidebar`: A list of system modules (Auth, Kernel, Network, DB) with toggle switches.
-   `TimelineStream`: The core feed of events, using `AnimatePresence` for filtering.
-   `EventNode`: Individual event cards with status indicators and timestamps.
-   `StateInspector`: A detailed panel showing "Before" and "After" state diffs.

**Visual Style**:
-   Dark mode "Obsidian" theme.
-   Accent colors: `--accent` (Cyan/Electric Blue) for system events, `--warning` (Amber) for alerts, `--error` (Crimson) for failures.
-   Glassmorphism for the Inspector panel.
</thinking>

```tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { 
  Clock, 
  Filter, 
  Search, 
  ChevronRight, 
  Activity, 
  ShieldAlert, 
  Database, 
  Cpu, 
  Globe, 
  Zap,
  ArrowRight,
  Maximize2,
  X
} from "lucide-react";

// --- Types ---
type EventSeverity = "info" | "warning" | "error" | "critical";

interface SystemEvent {
  id: string;
  timestamp: string;
  module: "Kernel" | "Network" | "Auth" | "Database" | "API";
  message: string;
  severity: EventSeverity;
  payload: Record<string, any>;
  duration: string;
}

// --- Mock Data ---
const MOCK_EVENTS: SystemEvent[] = [
  {
    id: "evt-1",
    timestamp: "2025-05-12T14:20:01.004Z",
    module: "Kernel",
    message: "Memory page fault at 0x004F2A",
    severity: "warning",
    payload: { address: "0x004F2A", process: "sys_init", core: 2 },
    duration: "12ms",
  },
  {
    id: "evt-2",
    timestamp: "2025-05-12T14:20:05.112Z",
    module: "Auth",
    message: "Unauthorized access attempt: User_882",
    severity: "error",
    payload: { ip: "192.168.1.45", attempt: 3, geo: "Unknown" },
    duration: "45ms",
  },
  {
    id: "evt-3",
    timestamp: "2025-05-12T14:20:10.882Z",
    module: "Database",
    message: "Query optimization triggered: idx_user_email",
    severity: "info",
    payload: { query_time: "450ms", optimized_time: "12ms" },
    duration: "2ms",
  },
  {
    id: "evt-4",
    timestamp: "2025-05-12T14:21:00.001Z",
    module: "Network",
    message: "Packet loss detected on eth0 (0.4%)",
    severity: "warning",
    payload: { interface: "eth0", loss_rate: "0.4%", latency: "120ms" },
    duration: "100ms",
  },
  {
    id: "evt-5",
    timestamp: "2025-05-12T14:22:15.443Z",
    module: "API",
    message: "Rate limit exceeded for API_KEY_X92",
    severity: "critical",
    payload: { key_id: "X92", limit: 1000, current: 1001 },
    duration: "5ms",
  },
  {
    id: "evt-6",
    timestamp: "2025-05-12T14:23:01.112Z",
    module: "Kernel",
    message: "CPU Thermal Throttling active",
    severity: "critical",
    payload: { temp: "98C", threshold: "95C", core: "All" },
    duration: "1ms",
  },
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 300, damping: 24 } 
  },
};

// --- Sub-Components ---

const SeverityBadge = ({ severity }: { severity: EventSeverity }) => {
  const colors = {
    info: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    warning: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    error: "bg-red-500/10 text-red-400 border-red-500/20",
    critical: "bg-purple-500/10 text-purple-400 border-purple-500/20 animate-pulse",
  };

  return (
    <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full border ${colors[severity]}`}>
      {severity}
    </span>
  );
};

const ModuleIcon = ({ module }: { module: string }) => {
  switch (module) {
    case "Kernel": return <Cpu size={14} />;
    case "Network": return <Globe size={14} />;
    case "Auth": return <ShieldAlert size={14} />;
    case "Database": return <Database size={14} />;
    case "API": return <Zap size={14} />;
    default: return <Activity size={14} />;
  }
};

export default function ChronosVault() {
  const [selectedEvent, setSelectedEvent] = useState<SystemEvent | null>(null);
  const [filter, setFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = useMemo(() => {
    return MOCK_EVENTS.filter(evt => {
      const matchesFilter = filter === "All" || evt.module === filter;
      const matchesSearch = evt.message.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-300 font-sans selection:bg-cyan-500/30 overflow-hidden flex flex-col">
      {/* --- Top Navigation Bar --- */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="h-16 border-b border-white/5 bg-black/40 backdrop-blur-xl flex items-center justify-between px-6 z-50"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center text-black shadow-[0_0_15px_rgba(6,182,212,0.5)]">
            <Clock size={18} strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">CHRONOS-VAULT</h1>
            <p className="text-[10px] text-slate-500 font-mono uppercase">Temporal Event Orchestrator v4.3</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-cyan-400 transition-colors" size={14} />
            <input 
              type="text" 
              placeholder="Search events..." 
              className="bg-white/5 border border-white/10 rounded-full py-1.5 pl-9 pr-4 text-xs w-64 focus:outline-none focus:border-cyan-500/50 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            LIVE STREAM ACTIVE
          </div>
        </div>
      </motion.header>

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 flex overflow-hidden"
      >
        {/* --- Left Sidebar: Filters --- */}
        <motion.aside 
          variants={itemVariants}
          className="w-64 border-r border-white/5 bg-black/20 p-6 flex flex-col gap-8"
        >
          <div>
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4 block">System Modules</label>
            <div className="space-y-1">
              {["All", "Kernel", "Network", "Auth", "Database", "API"].map((mod) => (
                <button
                  key={mod}
                  onClick={() => setFilter(mod)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-xs transition-all group ${
                    filter === mod 
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {mod !== "All" && <ModuleIcon module={mod} />}
                    {mod}
                  </div>
                  <ChevronRight size={12} className={`transition-transform ${filter === mod ? "rotate-90" : ""}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-auto p-4 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 border border-white/5">
            <div className="flex items-center gap-2 text-cyan-400 mb-2">
              <Activity size={14} />
              <span className="text-[11px] font-bold uppercase">System Health</span>
            </div>
            <div className="space-y-3">
              <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "84%" }}
                  className="h-full bg-cyan-500" 
                />
              </div>
              <p className="text-[10px] text-slate-500 leading-relaxed">
                All nodes operational. Latency average: <span className="text-slate-300">14ms</span>
              </p>
            </div>
          </div>
        </motion.aside>

        {/* --- Center: Timeline Stream --- */}
        <motion.section 
          variants={itemVariants}
          className="flex-1 overflow-y-auto p-8 relative bg-[radial-gradient(circle_at_center,rgba(15,15,20,1)_0%,rgba(10,10,12,1)_100%)]"
        >
          <div className="max-w-3xl mx-auto relative">
            {/* Timeline Vertical Line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent" />

            <div className="space-y-6">
              <AnimatePresence mode="popLayout">
                {filteredEvents.map((evt, idx) => (
                  <motion.div
                    key={evt.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => setSelectedEvent(evt)}
                    className={`relative pl-12 group cursor-pointer ${selectedEvent?.id === evt.id ? "z-10" : ""}`}
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-2.5 top-5 w-3 h-3 rounded-full border-2 border-[#0a0a0c] transition-all duration-300 ${
                      selectedEvent?.id === evt.id ? "bg-cyan-400 scale-150 shadow-[0_0_10px_rgba(34,211,238,0.8)]" : "bg-slate-600 group-hover:bg-slate-400"
                    }`} />

                    <div className={`p-4 rounded-xl border transition-all duration-300 ${
                      selectedEvent?.id === evt.id 
                      ? "bg-white/10 border-cyan-500/50 shadow-2xl shadow-cyan-500/10" 
                      : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/[0.07]"
                    }`}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-1.5 rounded bg-black/40 text-slate-400">
                            <ModuleIcon module={evt.module} />
                          </div>
                          <span className="text-[11px] font-mono text-slate-500">{evt.timestamp.split('T')[1].replace('Z', '')}</span>
                        </div>
                        <SeverityBadge severity={evt.severity} />
                      </div>
                      
                      <h3 className={`text-sm font-medium transition-colors ${selectedEvent?.id === evt.id ? "text-white" : "text-slate-300"}`}>
                        {evt.message}
                      </h3>
                      
                      <div className="mt-3 flex items-center justify-between">
                        <div className="flex gap-2">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-500 border border-white/5">
                            {evt.module}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-500 border border-white/5">
                            {evt.duration}
                          </span>
                        </div>
                        <motion.div 
                          animate={{ x: selectedEvent?.id === evt.id ? 5 : 0 }}
                          className="text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <ArrowRight size={14} />
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.section>

        {/* --- Right: State Inspector --- */}
        <motion.aside 
          variants={itemVariants}
          className="w-96 border-l border-white/5 bg-black/40 backdrop-blur-2xl p-6 overflow-y-auto"
        >
          <AnimatePresence mode="wait">
            {selectedEvent ? (
              <motion.div
                key={selectedEvent.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="h-full flex flex-col"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Event Inspector</h2>
                  <button 
                    onClick={() => setSelectedEvent(null)}
                    className="p-1 hover:bg-white/10 rounded-md text-slate-500 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <div className="flex items-center gap-2 text-cyan-400 mb-3">
                      <Maximize2 size={14} />
                      <span className="text-[11px] font-bold uppercase">Payload Analysis</span>
                    </div>
                    <div className="font-mono text-[11px] space-y-2">
                      {Object.entries(selectedEvent.payload).map(([key, val]) => (
                        <div key={key} className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-slate-500">{key}</span>
                          <span className="text-slate-300">{String(val)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Temporal Impact</label>
                    <div className="relative p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-black border border-white/10 overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 opacity-20">
                        <Activity size={40} />
                      </div>
                      <div className="relative z-10 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-slate-500" />
                          <span className="text-[11px] text-slate-400">Pre-Event State: Stable</span>
                        </div>
                        <div className="flex justify-center">
                          <div className="w-px h-4 bg-gradient-to-b from-slate-500 to-cyan-500" />
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-cyan-500 shadow-[0_0_5px_rgba(6,182,212,1)]" />
                          <span className="text-[11px] text-cyan-400 font-medium">Post-Event State: {selectedEvent.severity === 'critical' ? 'Degraded' : 'Modified'}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-6">
                    <button className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition-all shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 group">
                      Rollback to this State
                      <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-8"
              >
                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-slate-600 mb-4 border border-white/10">
                  <Filter size={24} />
                </div>
                <h3 className="text-sm font-medium text-slate-400 mb-2">No Event Selected</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Select a temporal node from the stream to inspect its system payload and state impact.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>
      </motion.main>

      {/* --- Footer Status Bar --- */}
      <footer className="h-8 border-t border-white/5 bg-black flex items-center justify-between px-4 text-[10px] font-mono text-slate-500">
        <div className="flex items-center gap-4">
          <span>UTC: {new Date().toISOString()}</span>
          <span className="w-1 h-1 rounded-full bg-slate-700" />
          <span>MEM_USAGE: 4.2GB / 16GB</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-cyan-500/70">SESS_ID: 0x882_T_VAULT</span>
          <span className="text-slate-700">© 2025 ORCMEGA</span>
        </div>
      </footer>
    </div>
  );
}
```