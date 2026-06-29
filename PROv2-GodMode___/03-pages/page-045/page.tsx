<thinking>
The objective is to create **Page 45 of 50** of a high-fidelity, animated Next.js UI.
The requirement is a "unique, highly detailed view" utilizing micro-interaction components and focusing on `staggerChildren` entrance animations using Framer Motion.

**Theme Selection: "Aether-Net: Neural Network Topology & Node Orchestrator"**
I will build a "Neural Network Topology" view. This is a high-density technical interface used to monitor and configure a distributed AI agent swarm. It's a "Network Operations Center" (NOC) for AI, blending graph visualization, real-time telemetry, and node-level configuration.

**Architectural Plan:**
1.  **Layout**: A three-column "Command Center" layout.
    -   *Left Sidebar*: Node Directory (Filterable list of active agents).
    -   *Center Stage*: The Topology Map (An interactive, animated SVG/Canvas-like area showing node connections).
    -   *Right Panel*: Node Inspector (Detailed telemetry, resource usage, and configuration toggles).
2.  **Animations**:
    -   `staggerChildren`: The entire page will load in a sequence: Header $\rightarrow$ Sidebar $\rightarrow$ Topology Map $\rightarrow$ Inspector.
    -   `layoutId`: Smooth transitions when selecting different nodes in the network.
    -   `animatePresence`: For switching between "Topology View" and "List View".
3.  **Micro-interactions**:
    -   Pulsing "Heartbeat" indicators for active nodes.
    -   Flowing "Data Packets" (animated lines) between connected nodes.
    -   Hover-triggered "Glow" effects using CSS variables (`--accent-glow`).
4.  **Technical Stack**: Next.js, Tailwind CSS, Framer Motion, Lucide React.

**Detailed Component Breakdown:**
-   `TopologyMap`: The core visualizer. Uses a coordinate-based system to place nodes and draw SVG paths between them.
-   `NodeElement`: A specialized component for each agent node with a status ring and label.
-   `TelemetryCard`: A high-density data display for CPU/Memory/Latency of a specific node.
-   `ConnectionLine`: An SVG path with a `stroke-dasharray` animation to simulate data flow.
</thinking>

```tsx
"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { 
  Activity, 
  Cpu, 
  Zap, 
  Shield, 
  Network, 
  Settings, 
  Search, 
  ChevronRight, 
  AlertCircle, 
  Terminal,
  Maximize2,
  RefreshCw
} from "lucide-react";

// --- Types & Mock Data ---

interface AgentNode {
  id: string;
  name: string;
  role: "Orchestrator" | "Worker" | "Guardian" | "Analyst";
  status: "online" | "idle" | "warning" | "offline";
  load: number; // 0-100
  latency: number; // ms
  coords: { x: number; y: number };
  connections: string[];
}

const MOCK_NODES: AgentNode[] = [
  { id: "n1", name: "Core-Alpha", role: "Orchestrator", status: "online", load: 42, latency: 12, coords: { x: 400, y: 300 }, connections: ["n2", "n3", "n4"] },
  { id: "n2", name: "Sentry-01", role: "Guardian", status: "online", load: 15, latency: 24, coords: { x: 200, y: 150 }, connections: ["n1"] },
  { id: "n3", name: "Logic-Beta", role: "Worker", status: "warning", load: 88, latency: 45, coords: { x: 600, y: 150 }, connections: ["n1", "n5"] },
  { id: "n4", name: "Query-Gamma", role: "Analyst", status: "online", load: 31, latency: 18, coords: { x: 400, y: 500 }, connections: ["n1", "n6"] },
  { id: "n5", name: "Compute-01", role: "Worker", status: "online", load: 62, latency: 30, coords: { x: 750, y: 250 }, connections: ["n3"] },
  { id: "n6", name: "Vault-Omega", role: "Guardian", status: "idle", load: 5, latency: 10, coords: { x: 250, y: 450 }, connections: ["n4"] },
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

const StatusBadge = ({ status }: { status: AgentNode["status"] }) => {
  const colors = {
    online: "bg-emerald-500 shadow-[0_0_8px_#10b981]",
    idle: "bg-blue-500 shadow-[0_0_8px_#3b82f6]",
    warning: "bg-amber-500 shadow-[0_0_8px_#f59e0b]",
    offline: "bg-rose-500 shadow-[0_0_8px_#f43f5e]",
  };
  return <div className={`w-2 h-2 rounded-full ${colors[status]}`} />;
};

const ConnectionLine = ({ start, end, active }: { start: { x: number, y: number }, end: { x: number, y: number }, active: boolean }) => {
  return (
    <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible">
      <motion.path
        d={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
        stroke={active ? "var(--accent)" : "rgba(255,255,255,0.1)"}
        strokeWidth={active ? 2 : 1}
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
      {active && (
        <motion.circle
          r="3"
          fill="var(--accent-light)"
          initial={{ offset: 0 }}
          animate={{ 
            cx: [start.x, end.x], 
            cy: [start.y, end.y] 
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            ease: "linear" 
          }}
        />
      )}
    </svg>
  );
};

// --- Main Page Component ---

export default function NeuralTopologyPage() {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(MOCK_NODES[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAutoScaling, setIsAutoScaling] = useState(true);

  const selectedNode = useMemo(() => 
    MOCK_NODES.find(n => n.id === selectedNodeId), 
    [selectedNodeId]
  );

  const filteredNodes = MOCK_NODES.filter(n => 
    n.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <motion.div 
      className="min-h-screen bg-[#0a0a0c] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-hidden flex flex-col"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* --- Top Navigation Bar --- */}
      <motion.header 
        variants={itemVariants}
        className="h-16 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between px-6 z-50"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-indigo-500/10 rounded-lg border border-indigo-500/20">
            <Network className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-tight">AETHER-NET <span className="text-indigo-400 ml-2 font-mono text-xs">v4.0.2-stable</span></h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Neural Topology Orchestrator</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
            <Activity className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-slate-400">System Health: <span className="text-emerald-400">99.9%</span></span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.header>

      <div className="flex-1 flex overflow-hidden relative">
        
        {/* --- Left Sidebar: Node Directory --- */}
        <motion.aside 
          variants={itemVariants}
          className="w-80 border-r border-white/10 bg-black/20 backdrop-blur-sm flex flex-col z-40"
        >
          <div className="p-4 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Filter nodes..." 
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-2 space-y-1">
            {filteredNodes.map((node) => (
              <motion.button
                key={node.id}
                whileHover={{ x: 4 }}
                onClick={() => setSelectedNodeId(node.id)}
                className={`w-full flex items-center justify-between p-3 rounded-lg transition-all group ${
                  selectedNodeId === node.id 
                    ? "bg-indigo-500/10 border border-indigo-500/30 text-white" 
                    : "hover:bg-white/5 border border-transparent text-slate-400"
                }`}
              >
                <div className="flex items-center gap-3">
                  <StatusBadge status={node.status} />
                  <div className="text-left">
                    <div className="text-xs font-medium">{node.name}</div>
                    <div className="text-[10px] opacity-50">{node.role}</div>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform ${selectedNodeId === node.id ? "rotate-90" : "opacity-0 group-hover:opacity-100"}`} />
              </motion.button>
            ))}
          </div>

          <div className="p-4 border-t border-white/10 bg-black/40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase text-slate-500 font-bold">Global Load</span>
              <span className="text-[10px] font-mono text-indigo-400">42.5%</span>
            </div>
            <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-indigo-500" 
                initial={{ width: 0 }} 
                animate={{ width: "42.5%" }} 
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </motion.aside>

        {/* --- Center Stage: Topology Map --- */}
        <motion.main 
          variants={itemVariants}
          className="flex-1 relative bg-[radial-gradient(circle_at_center,#1a1a2e_0%,#0a0a0c_100%)] overflow-hidden cursor-grab active:cursor-grabbing"
        >
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20" 
               style={{ backgroundImage: 'linear-gradient(#ffffff05 1px, transparent 1px), linear-gradient(90deg, #ffffff05 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
          />

          {/* Connection Lines */}
          <div className="absolute inset-0">
            {MOCK_NODES.map(node => 
              node.connections.map(connId => {
                const target = MOCK_NODES.find(n => n.id === connId);
                if (!target) return null;
                return (
                  <ConnectionLine 
                    key={`${node.id}-${connId}`} 
                    start={node.coords} 
                    end={target.coords} 
                    active={selectedNodeId === node.id || selectedNodeId === connId} 
                  />
                );
              })
            )}
          </div>

          {/* Nodes */}
          {MOCK_NODES.map((node) => (
            <motion.div
              key={node.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => setSelectedNodeId(node.id)}
              className="absolute group cursor-pointer"
              style={{ left: node.coords.x, top: node.coords.y }}
            >
              <div className="relative -translate-x-1/2 -translate-y-1/2">
                {/* Node Ring */}
                <div className={`w-12 h-12 rounded-full border-2 transition-all duration-500 flex items-center justify-center ${
                  selectedNodeId === node.id 
                    ? "border-indigo-400 shadow-[0_0_20px_rgba(129,140,248,0.5)] scale-110" 
                    : "border-white/20 group-hover:border-white/50"
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    selectedNodeId === node.id ? "bg-indigo-500 text-white" : "bg-white/10 text-slate-400"
                  }`}>
                    {node.name[0]}
                  </div>
                </div>

                {/* Label */}
                <div className="absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-center pointer-events-none">
                  <div className="text-[10px] font-bold text-white opacity-80">{node.name}</div>
                  <div className="text-[8px] text-slate-500 uppercase tracking-tighter">{node.role}</div>
                </div>

                {/* Status Indicator */}
                <div className="absolute -top-1 -right-1">
                  <StatusBadge status={node.status} />
                </div>
              </div>
            </motion.div>
          ))}

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-2">
            <button className="p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all hover:bg-black/80">
              <Maximize2 className="w-4 h-4" />
            </button>
            <button className="p-3 bg-black/60 backdrop-blur-md border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all hover:bg-black/80">
              <Terminal className="w-4 h-4" />
            </button>
          </div>
        </motion.main>

        {/* --- Right Panel: Node Inspector --- */}
        <AnimatePresence mode="wait">
          {selectedNode && (
            <motion.aside 
              key={selectedNode.id}
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-96 border-l border-white/10 bg-black/40 backdrop-blur-xl flex flex-col z-40"
            >
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-bold text-white">{selectedNode.name}</h2>
                  <div className="px-2 py-1 bg-white/5 rounded text-[10px] font-mono text-slate-400 border border-white/10">
                    ID: {selectedNode.id}
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Shield className="w-3 h-3" />
                  <span>Security Level: <span className="text-indigo-400">Tier-1 Encrypted</span></span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Telemetry Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Cpu className="w-3 h-3" />
                      <span className="text-[10px] uppercase font-bold">CPU Load</span>
                    </div>
                    <div className="text-2xl font-mono text-white">{selectedNode.load}%</div>
                    <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        className={`h-full ${selectedNode.load > 80 ? 'bg-amber-500' : 'bg-indigo-500'}`} 
                        initial={{ width: 0 }} 
                        animate={{ width: `${selectedNode.load}%` }} 
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Zap className="w-3 h-3" />
                      <span className="text-[10px] uppercase font-bold">Latency</span>
                    </div>
                    <div className="text-2xl font-mono text-white">{selectedNode.latency}ms</div>
                    <div className="text-[10px] text-emerald-400">Optimal Range</div>
                  </div>
                </div>

                {/* Configuration Section */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Node Configuration</h3>
                  <div className="space-y-3">
                    {[
                      { label: "Auto-Scaling", value: isAutoScaling },
                      { label: "Priority Routing", value: true },
                      { label: "Shadow Mode", value: false },
                      { label: "Kernel Isolation", value: true },
                    ].map((cfg, i) => (
                      <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10 group hover:border-indigo-500/30 transition-all">
                        <span className="text-xs text-slate-300">{cfg.label}</span>
                        <button 
                          onClick={() => { if(i === 0) setIsAutoScaling(!isAutoScaling) }}
                          className={`w-8 h-4 rounded-full transition-colors relative ${cfg.value ? 'bg-indigo-500' : 'bg-slate-700'}`}
                        >
                          <motion.div 
                            className="absolute top-1 w-2 h-2 bg-white rounded-full" 
                            animate={{ x: cfg.value ? 18 : 2 }}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Log Terminal */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Event Stream</h3>
                  <div className="p-3 bg-black rounded-xl border border-white/10 font-mono text-[10px] h-40 overflow-y-auto space-y-1 text-slate-500">
                    <div className="text-indigo-400">[SYS] Initializing handshake...</div>
                    <div className="text-emerald-400">[OK] Connection established with Core-Alpha</div>
                    <div className="text-slate-400">[INFO] Packet flow: 1.2GB/s</div>
                    <div className="text-amber-400">[WARN] High memory pressure detected</div>
                    <div className="text-slate-400">[INFO] Re-routing via Sentry-01...</div>
                    <div className="text-indigo-400">[SYS] Heartbeat signal received</div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-white/10 bg-black/60">
                <button className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2">
                  <RefreshCw className="w-3 h-3" />
                  Re-Synchronize Node
                </button>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>
      </div>

      {/* --- Footer Status Bar --- */}
      <motion.footer 
        variants={itemVariants}
        className="h-8 border-t border-white/10 bg-black flex items-center justify-between px-4 text-[10px] font-mono text-slate-500"
      >
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            NET_STABLE
          </span>
          <span>UPTIME: 142:12:04</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-indigo-400">ORCMEGA_CORE_OS</span>
          <span>LATENCY: 14ms</span>
        </div>
      </motion.footer>
    </motion.div>
  );
}
```