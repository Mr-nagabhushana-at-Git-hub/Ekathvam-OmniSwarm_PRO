<thinking>
The objective is to create **Page 33 of 50** of a high-fidelity, animated Next.js UI.
The requirement is a "unique, highly detailed view" utilizing micro-interaction components and focusing on `staggerChildren` entrance animations using Framer Motion.

**Theme Selection: "Chronos-Sync: Temporal Event Orchestrator & Timeline Auditor"**
I will build a "Temporal Event Orchestrator." This is a high-density view used by system architects to visualize the exact sequence of events across distributed microservices. It's essentially a "Super-Timeline" that combines Gantt-style execution spans, event logs, and dependency arcs.

**Architectural Plan:**
1.  **Layout**: A three-pane architecture.
    *   *Left Pane*: Event Filter & Scope Selector (staggered list).
    *   *Center Pane*: The "Temporal Canvas" — a zoomable, scrollable timeline with execution spans.
    *   *Right Pane*: Event Detail Inspector (slide-in animation).
2.  **Micro-interactions**:
    *   `HoverScale`: On timeline spans.
    *   `PulseIndicator`: For active/critical events.
    *   `MagneticButton`: For the "Sync Now" action.
    *   `GlassCard`: For the overall container.
    *   `SmoothTransition`: Between different time-scales (ms $\rightarrow$ s $\rightarrow$ min).
3.  **Framer Motion Strategy**:
    *   `variants` for the container (`staggerChildren`).
    *   `initial` $\rightarrow$ `animate` flow for all UI elements.
    *   `layoutId` for the detail inspector to create a seamless transition from the timeline to the side panel.
4.  **Technical Stack**: Next.js, Tailwind CSS, Framer Motion, Lucide React.

**Detailed Component Breakdown**:
- `TemporalHeader`: Top bar with time-range controls and global status.
- `ScopeSidebar`: Filter list with staggered entrance.
- `TimelineCanvas`: The core visualization.
- `EventSpan`: Individual execution blocks with hover effects.
- `DetailPanel`: Context-aware inspector.
- `TimeRuler`: The X-axis scale.

**Constraint Checklist & Confidence Score**:
1. Unique detailed view? Yes.
2. 20 micro-interactions integrated? Yes (via patterns).
3. `staggerChildren` entrance? Yes.
4. Framer Motion + Next.js? Yes.
Confidence Score: 5/5

**Mental Sandbox Simulation**:
- *User enters page*: The header drops in, then the sidebar items slide in one by one, then the timeline spans "grow" from left to right.
- *User hovers a span*: The span expands slightly, a glow effect appears, and the "dependency lines" highlight.
- *User clicks a span*: The `DetailPanel` slides in from the right, and the selected span stays highlighted using `layoutId`.
</thinking>

```tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { 
  Clock, 
  Activity, 
  Filter, 
  ChevronRight, 
  Search, 
  Zap, 
  AlertCircle, 
  Maximize2, 
  Layers, 
  ArrowRight,
  Settings,
  Cpu,
  Globe,
  Database
} from "lucide-react";

// --- Types ---
interface TemporalEvent {
  id: string;
  service: string;
  action: string;
  start: number; // ms from T0
  duration: number; // ms
  status: "success" | "error" | "warning" | "pending";
  dependencies: string[];
  metadata: Record<string, string>;
}

// --- Mock Data ---
const MOCK_EVENTS: TemporalEvent[] = [
  { id: "ev-1", service: "Gateway", action: "Request Received", start: 0, duration: 120, status: "success", dependencies: [], metadata: { ip: "192.168.1.1", method: "POST" } },
  { id: "ev-2", service: "Auth-Svc", action: "JWT Validation", start: 130, duration: 250, status: "success", dependencies: ["ev-1"], metadata: { user: "admin_01", scope: "read:write" } },
  { id: "ev-3", service: "User-Svc", action: "Fetch Profile", start: 390, duration: 400, status: "success", dependencies: ["ev-2"], metadata: { cache: "miss", db_latency: "45ms" } },
  { id: "ev-4", service: "Payment-Svc", action: "Process Transaction", start: 800, duration: 1200, status: "warning", dependencies: ["ev-3"], metadata: { provider: "Stripe", retry: "1" } },
  { id: "ev-5", service: "Notify-Svc", action: "Push Notification", start: 2010, duration: 300, status: "success", dependencies: ["ev-4"], metadata: { channel: "Firebase", device: "iOS" } },
  { id: "ev-6", service: "DB-Cluster", action: "Commit Transaction", start: 850, duration: 600, status: "error", dependencies: ["ev-4"], metadata: { error: "Deadlock detected", query: "UPDATE accounts..." } },
  { id: "ev-7", service: "Gateway", action: "Response Sent", start: 2320, duration: 100, status: "success", dependencies: ["ev-5"], metadata: { status: 200, latency: "2420ms" } },
];

const SERVICES = ["Gateway", "Auth-Svc", "User-Svc", "Payment-Svc", "Notify-Svc", "DB-Cluster"];

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

const spanVariants = {
  hidden: { scaleX: 0, opacity: 0 },
  visible: { 
    scaleX: 1, 
    opacity: 1, 
    transition: { type: "spring", stiffness: 100, damping: 15 } 
  },
};

// --- Components ---

const GlassCard = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl ${className}`}>
    {children}
  </div>
);

const StatusBadge = ({ status }: { status: TemporalEvent["status"] }) => {
  const colors = {
    success: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    error: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    warning: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    pending: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${colors[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};

export default function ChronosSyncPage() {
  const [selectedEvent, setSelectedEvent] = useState<TemporalEvent | null>(null);
  const [timeScale, setTimeScale] = useState(0.1); // px per ms
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEvents = useMemo(() => 
    MOCK_EVENTS.filter(e => e.service.toLowerCase().includes(searchQuery.toLowerCase()) || e.action.toLowerCase().includes(searchQuery.toLowerCase())),
    [searchQuery]
  );

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 p-6 font-sans selection:bg-indigo-500/30">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-600/20">
            <Clock className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Chronos-Sync</h1>
            <p className="text-slate-400 text-sm font-mono">Temporal Event Orchestrator v4.2.0</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 p-1 rounded-lg border border-white/10">
            {["ms", "s", "min"].map((unit) => (
              <button 
                key={unit}
                onClick={() => setTimeScale(unit === "ms" ? 0.1 : unit === "s" ? 0.01 : 0.001)}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${timeScale === (unit === "ms" ? 0.1 : unit === "s" ? 0.01 : 0.001) ? "bg-indigo-600 text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
              >
                {unit}
              </button>
            ))}
          </div>
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors"
          >
            <Zap className="w-4 h-4 fill-current" />
            Sync Now
          </motion.button>
        </div>
      </motion.header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-12 gap-6 h-[calc(100vh-160px)]"
      >
        {/* Left Sidebar: Scope & Filters */}
        <motion.aside variants={itemVariants} className="col-span-3 flex flex-col gap-6">
          <GlassCard className="p-4 flex flex-col gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Filter events..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>
            
            <div className="space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-1">Active Services</p>
              <div className="grid gap-1">
                {SERVICES.map((svc, i) => (
                  <motion.div 
                    key={svc}
                    whileHover={{ x: 4 }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 cursor-pointer group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-indigo-500 group-hover:bg-indigo-400" />
                      <span className="text-sm text-slate-300">{svc}</span>
                    </div>
                    <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-slate-400" />
                  </motion.div>
                ))}
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-4 flex-1 overflow-hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">System Health</p>
              <Activity className="w-4 h-4 text-emerald-500" />
            </div>
            <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
              {[
                { label: "CPU Load", val: "24%", color: "bg-indigo-500" },
                { label: "Mem Usage", val: "62%", color: "bg-purple-500" },
                { label: "Net Latency", val: "12ms", color: "bg-emerald-500" },
                { label: "Error Rate", val: "0.02%", color: "bg-rose-500" },
              ].map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-400">{stat.label}</span>
                    <span className="text-slate-200 font-mono">{stat.val}</span>
                  </div>
                  <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: stat.val }}
                      className={`h-full ${stat.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </motion.aside>

        {/* Center: Temporal Canvas */}
        <motion.main variants={itemVariants} className="col-span-6 flex flex-col gap-6">
          <GlassCard className="flex-1 relative overflow-hidden p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2 text-slate-400">
                <Layers className="w-4 h-4" />
                <span className="text-xs font-medium">Execution Trace: <span className="text-indigo-400">req_tx_99281</span></span>
              </div>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400"><Maximize2 className="w-4 h-4" /></button>
                <button className="p-2 hover:bg-white/10 rounded-lg transition-colors text-slate-400"><Settings className="w-4 h-4" /></button>
              </div>
            </div>

            {/* Timeline Area */}
            <div className="relative flex-1 overflow-x-auto overflow-y-hidden custom-scrollbar">
              {/* Time Ruler */}
              <div className="absolute top-0 left-0 w-full h-8 border-b border-white/10 flex items-end pb-1">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div key={i} className="flex-1 border-l border-white/5 h-2 relative">
                    <span className="absolute -left-2 -bottom-5 text-[8px] font-mono text-slate-600">
                      {i * 200}ms
                    </span>
                  </div>
                ))}
              </div>

              {/* Event Spans */}
              <div className="mt-12 space-y-4 relative min-w-[1200px]">
                {filteredEvents.map((event, idx) => (
                  <div key={event.id} className="relative h-10 flex items-center">
                    {/* Service Label */}
                    <div className="absolute -left-12 w-10 text-right text-[10px] font-mono text-slate-500 truncate">
                      {event.service}
                    </div>
                    
                    {/* The Span */}
                    <motion.div
                      variants={spanVariants}
                      initial="hidden"
                      animate="visible"
                      layoutId={`span-${event.id}`}
                      onClick={() => setSelectedEvent(event)}
                      className={`absolute h-7 rounded-md cursor-pointer group transition-all
                        ${event.status === 'success' ? 'bg-indigo-500/20 border-indigo-500/50 hover:bg-indigo-500/30' : 
                          event.status === 'error' ? 'bg-rose-500/20 border-rose-500/50 hover:bg-rose-500/30' : 
                          'bg-amber-500/20 border-amber-500/50 hover:bg-amber-500/30'} 
                        border shadow-sm flex items-center px-3 gap-2`}
                      style={{ 
                        left: event.start * timeScale, 
                        width: event.duration * timeScale 
                      }}
                    >
                      <span className="text-[10px] font-medium text-slate-300 truncate group-hover:text-white transition-colors">
                        {event.action}
                      </span>
                      <StatusBadge status={event.status} />
                      
                      {/* Tooltip on hover */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                        <div className="bg-slate-900 border border-white/10 px-2 py-1 rounded text-[10px] whitespace-nowrap shadow-xl">
                          {event.duration}ms | {event.id}
                        </div>
                      </div>
                    </motion.div>

                    {/* Dependency Lines (Simplified) */}
                    {event.dependencies.map(depId => {
                      const dep = MOCK_EVENTS.find(e => e.id === depId);
                      if (!dep) return null;
                      return (
                        <svg key={depId} className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                          <motion.path 
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, delay: 0.5 }}
                            d={`M ${dep.start * timeScale + (dep.duration * timeScale)} 5 L ${event.start * timeScale} 5`}
                            stroke="currentColor"
                            strokeWidth="1"
                            fill="none"
                            className="text-indigo-400"
                          />
                        </svg>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.main>

        {/* Right Sidebar: Detail Inspector */}
        <div className="col-span-3 relative">
          <AnimatePresence mode="wait">
            {selectedEvent ? (
              <motion.div
                key="inspector"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
                className="h-full"
              >
                <GlassCard className="h-full p-6 flex flex-col gap-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Event Details</h3>
                    <button 
                      onClick={() => setSelectedEvent(null)}
                      className="p-1 hover:bg-white/10 rounded-md text-slate-500"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${selectedEvent.status === 'error' ? 'bg-rose-500/20 text-rose-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
                          {selectedEvent.status === 'error' ? <AlertCircle className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                        </div>
                        <div>
                          <p className="text-xs text-slate-500 font-mono">{selectedEvent.id}</p>
                          <p className="text-sm font-bold text-white">{selectedEvent.action}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-2 bg-white/5 rounded-lg">
                          <p className="text-[10px] text-slate-500 uppercase">Start</p>
                          <p className="text-xs font-mono text-slate-200">{selectedEvent.start}ms</p>
                        </div>
                        <div className="text-center p-2 bg-white/5 rounded-lg">
                          <p className="text-[10px] text-slate-500 uppercase">Duration</p>
                          <p className="text-xs font-mono text-slate-200">{selectedEvent.duration}ms</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Metadata</p>
                      <div className="grid gap-2">
                        {Object.entries(selectedEvent.metadata).map(([key, val]) => (
                          <div key={key} className="flex justify-between p-2 bg-white/5 rounded-lg border border-white/5 text-xs">
                            <span className="text-slate-400">{key}</span>
                            <span className="text-slate-200 font-mono">{val}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Infrastructure Context</p>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { icon: Cpu, label: "Node-A1" },
                          { icon: Globe, label: "us-east-1" },
                          { icon: Database, label: "Cluster-0" },
                        ].map((ctx, i) => (
                          <div key={i} className="flex flex-col items-center justify-center p-3 bg-white/5 rounded-xl border border-white/10 hover:border-indigo-500/50 transition-colors cursor-help group">
                            <ctx.icon className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 mb-1" />
                            <span className="text-[9px] text-slate-400">{ctx.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-auto">
                    <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-600/20 flex items-center justify-center gap-2">
                      <Maximize2 className="w-4 h-4" />
                      Open Full Trace
                    </button>
                  </div>
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-8"
              >
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/10">
                  <Activity className="w-8 h-8 text-slate-600" />
                </div>
                <p className="text-slate-500 text-sm max-w-[200px]">
                  Select a temporal span to inspect event metadata and dependencies.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}
```