<thinking>
The objective is to create **Page 30 of 50** of a high-fidelity, animated Next.js UI.
The requirement is a "unique, highly detailed view" utilizing 20 micro-interaction components and focusing on `staggerChildren` entrance animations using Framer Motion.

**Theme Selection: "Aether-Net: Neural Network Topology & Latency Mapper"**
I will build a "Neural Network Topology & Latency Mapper." This is a high-density technical view used by AI infrastructure engineers to monitor the health, latency, and data-flow between distributed GPU clusters and model shards. It's a mix of a node-graph visualization, real-time telemetry, and a configuration panel.

**Key Features to Implement:**
1.  **Topology Canvas**: A simulated interactive graph of neural nodes (shards) with animated "data pulses" flowing between them.
2.  **Latency Heatmap**: A grid-based micro-interaction component showing inter-node communication delays.
3.  **Cluster Health Metrics**: High-density stats cards with staggered entrance animations.
4.  **Node Inspector**: A slide-over panel that appears when a node is selected, featuring detailed telemetry.
5.  **Global Control Bar**: A top-level navigation/filter bar with glassmorphism and micro-interactions.

**Technical Strategy:**
- **Framer Motion**: Use `variants` for `staggerChildren`. The container will trigger the sequence, and children (cards, nodes, list items) will slide/fade in.
- **Tailwind CSS**: Use a "Deep Space" theme (dark backgrounds, neon accents: `--accent`, `--accent-glow`).
- **TypeScript**: Strict typing for Node and Link interfaces.
- **Performance**: Use `memo` for the node components to prevent re-renders during pulse animations.
- **Accessibility**: ARIA roles for the canvas and keyboard navigation for the node list.

**Component Breakdown:**
- `TopologyCanvas`: The main visual area.
- `NodeElement`: Individual neural shards with pulse effects.
- `LatencyGrid`: A 10x10 grid of color-coded latency cells.
- `MetricCard`: Staggered stats (TFLOPS, Memory, Power).
- `NodeInspector`: Detail view for a specific shard.
- `ControlPanel`: Filters for "Region", "Model Version", and "Traffic Type".

**Animation Flow:**
1. Page Load $\rightarrow$ Background Fade In.
2. Header $\rightarrow$ Slide down from top.
3. Metric Cards $\rightarrow$ Staggered pop-up from bottom.
4. Topology Canvas $\rightarrow$ Scale up from center.
5. Latency Grid $\rightarrow$ Staggered "reveal" of cells.
</thinking>

```tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  Activity, 
  Cpu, 
  Zap, 
  Network, 
  Settings, 
  Search, 
  AlertTriangle, 
  ChevronRight, 
  Maximize2, 
  Layers,
  Database,
  Globe
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** 
 * UTILS 
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * TYPES
 */
interface NeuralNode {
  id: string;
  label: string;
  status: 'healthy' | 'warning' | 'critical';
  load: number; // 0-100
  latency: number; // ms
  coords: { x: number; y: number };
  type: 'compute' | 'memory' | 'gateway';
}

interface NodeLink {
  source: string;
  target: string;
  traffic: number; // 0-1
}

/**
 * MOCK DATA
 */
const MOCK_NODES: NeuralNode[] = [
  { id: 'n1', label: 'Shard-Alpha-01', status: 'healthy', load: 42, latency: 1.2, coords: { x: 150, y: 100 }, type: 'compute' },
  { id: 'n2', label: 'Shard-Alpha-02', status: 'healthy', load: 58, latency: 1.5, coords: { x: 300, y: 150 }, type: 'compute' },
  { id: 'n3', label: 'Shard-Beta-01', status: 'warning', load: 89, latency: 4.8, coords: { x: 100, y: 300 }, type: 'compute' },
  { id: 'n4', label: 'Shard-Beta-02', status: 'healthy', load: 31, latency: 2.1, coords: { x: 400, y: 350 }, type: 'compute' },
  { id: 'n5', label: 'Core-Gateway-01', status: 'healthy', load: 12, latency: 0.5, coords: { x: 250, y: 220 }, type: 'gateway' },
  { id: 'n6', label: 'Mem-Vault-01', status: 'critical', load: 95, latency: 12.4, coords: { x: 500, y: 100 }, type: 'memory' },
  { id: 'n7', label: 'Mem-Vault-02', status: 'healthy', load: 67, latency: 3.2, coords: { x: 550, y: 250 }, type: 'memory' },
];

const MOCK_LINKS: NodeLink[] = [
  { source: 'n1', target: 'n5', traffic: 0.8 },
  { source: 'n2', target: 'n5', traffic: 0.6 },
  { source: 'n3', target: 'n5', traffic: 0.9 },
  { source: 'n4', target: 'n5', traffic: 0.4 },
  { source: 'n5', target: 'n6', traffic: 0.7 },
  { source: 'n5', target: 'n7', traffic: 0.5 },
  { source: 'n1', target: 'n2', traffic: 0.3 },
];

/**
 * ANIMATION VARIANTS
 */
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

/**
 * MICRO-COMPONENTS
 */

const MetricCard = ({ icon: Icon, label, value, trend, color }: any) => (
  <motion.div 
    variants={itemVariants}
    className="relative overflow-hidden p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md group hover:border-white/20 transition-colors"
  >
    <div className={cn("absolute top-0 right-0 w-24 h-24 blur-3xl opacity-20 rounded-full", color)} />
    <div className="flex items-center gap-3 mb-3">
      <div className="p-2 rounded-lg bg-white/10 text-white/70 group-hover:text-white transition-colors">
        <Icon size={18} />
      </div>
      <span className="text-xs font-medium text-white/50 uppercase tracking-wider">{label}</span>
    </div>
    <div className="flex items-end justify-between">
      <h3 className="text-2xl font-bold text-white">{value}</h3>
      <span className={cn("text-xs font-bold px-2 py-1 rounded-full", trend > 0 ? "text-emerald-400 bg-emerald-400/10" : "text-rose-400 bg-rose-400/10")}>
        {trend > 0 ? '+' : ''}{trend}%
      </span>
    </div>
  </motion.div>
);

const LatencyCell = ({ value, index }: { value: number; index: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.01 }}
    className={cn(
      "w-full h-full rounded-sm transition-all duration-500",
      value < 2 ? "bg-emerald-500/40 hover:bg-emerald-400" : 
      value < 5 ? "bg-amber-500/40 hover:bg-amber-400" : "bg-rose-500/40 hover:bg-rose-400"
    )}
    title={`Latency: ${value}ms`}
  />
);

const NodeElement = ({ node, isSelected, onClick }: { node: NeuralNode; isSelected: boolean; onClick: () => void }) => {
  return (
    <motion.div
      layoutId={node.id}
      onClick={onClick}
      className={cn(
        "absolute cursor-pointer group z-10",
        "flex flex-col items-center justify-center transition-transform hover:scale-110"
      )}
      style={{ left: node.coords.x, top: node.coords.y }}
    >
      <div className={cn(
        "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300",
        isSelected ? "border-white scale-125 shadow-[0_0_20px_rgba(255,255,255,0.5)]" : "border-white/30",
        node.status === 'healthy' ? "text-emerald-400" : node.status === 'warning' ? "text-amber-400" : "text-rose-400"
      )}>
        {node.type === 'compute' && <Cpu size={20} />}
        {node.type === 'memory' && <Database size={20} />}
        {node.type === 'gateway' && <Globe size={20} />}
      </div>
      <span className="mt-2 text-[10px] font-mono text-white/60 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {node.label}
      </span>
      {node.status !== 'healthy' && (
        <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-rose-500 animate-ping" />
      )}
    </motion.div>
  );
};

/**
 * MAIN PAGE
 */
export default function AetherNetPage() {
  const [selectedNode, setSelectedNode] = useState<NeuralNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Generate a random latency grid
  const latencyGrid = useMemo(() => 
    Array.from({ length: 100 }, (_, i) => Math.random() * 15), 
  []);

  return (
    <div className="min-h-screen bg-[#050508] text-white font-sans selection:bg-white/20 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 h-screen flex flex-col p-6 gap-6"
      >
        {/* TOP NAVIGATION BAR */}
        <motion.header 
          variants={itemVariants}
          className="flex items-center justify-between p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-xl bg-white/10 text-white">
              <Network size={24} />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Aether-Net <span className="text-white/40 font-normal">Topology</span></h1>
              <p className="text-[10px] text-white/40 font-mono uppercase tracking-widest">Cluster: US-EAST-1 // Model: GPT-X-Omni</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search Shards..." 
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 ring-white/20 transition-all w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Settings size={20} />
            </button>
          </div>
        </motion.header>

        {/* MAIN CONTENT GRID */}
        <div className="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
          
          {/* LEFT PANEL: METRICS & LIST */}
          <motion.div 
            variants={itemVariants}
            className="col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar"
          >
            <div className="grid grid-cols-1 gap-4">
              <MetricCard icon={Zap} label="Total TFLOPS" value="1.2 Peta" trend={12.4} color="bg-blue-500" />
              <MetricCard icon={Activity} label="Avg Latency" value="2.4 ms" trend={-4.1} color="bg-emerald-500" />
              <MetricCard icon={Layers} label="Active Shards" value="1,024" trend={0} color="bg-purple-500" />
            </div>

            <div className="flex-1 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white/60">Node Registry</h2>
                <span className="text-[10px] bg-white/10 px-2 py-1 rounded text-white/40">{MOCK_NODES.length} Nodes</span>
              </div>
              <div className="space-y-2">
                {MOCK_NODES.filter(n => n.label.toLowerCase().includes(searchQuery.toLowerCase())).map((node) => (
                  <motion.div 
                    key={node.id}
                    whileHover={{ x: 4 }}
                    onClick={() => setSelectedNode(node)}
                    className={cn(
                      "p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between group",
                      selectedNode?.id === node.id 
                        ? "bg-white/10 border-white/30" 
                        : "bg-transparent border-white/5 hover:border-white/20"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        node.status === 'healthy' ? "bg-emerald-500" : node.status === 'warning' ? "bg-amber-500" : "bg-rose-500"
                      )} />
                      <span className="text-sm font-medium">{node.label}</span>
                    </div>
                    <ChevronRight size={14} className="text-white/20 group-hover:text-white transition-colors" />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* CENTER PANEL: TOPOLOGY CANVAS */}
          <motion.div 
            variants={itemVariants}
            className="col-span-6 relative rounded-3xl bg-white/[0.02] border border-white/10 overflow-hidden backdrop-blur-sm"
          >
            {/* Canvas Header */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
              <div className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[10px] font-mono flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                LIVE TOPOLOGY VIEW
              </div>
              <button className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                <Maximize2 size={14} />
              </button>
            </div>

            {/* SVG Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(255,255,255,0.1)" />
                  <stop offset="50%" stopColor="rgba(255,255,255,0.4)" />
                  <stop offset="100%" stopColor="rgba(255,255,255,0.1)" />
                </linearGradient>
              </defs>
              {MOCK_LINKS.map((link, i) => {
                const source = MOCK_NODES.find(n => n.id === link.source);
                const target = MOCK_NODES.find(n => n.id === link.target);
                if (!source || !target) return null;
                return (
                  <g key={i}>
                    <line 
                      x1={source.coords.x + 24} y1={source.coords.y + 24} 
                      x2={target.coords.x + 24} y2={target.coords.y + 24} 
                      stroke="url(#lineGrad)" strokeWidth="1" strokeDasharray="4 4"
                    />
                    {/* Animated Pulse */}
                    <motion.circle
                      r="2"
                      fill="white"
                      initial={{ offset: 0 }}
                      animate={{ offset: 1 }}
                      transition={{ duration: 2 / link.traffic, repeat: Infinity, ease: "linear" }}
                      style={{
                        offsetPath: `path('M ${source.coords.x + 24} ${source.coords.y + 24} L ${target.coords.x + 24} ${target.coords.y + 24}')`,
                        offsetDistance: '0%'
                      }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* Nodes */}
            {MOCK_NODES.map(node => (
              <NodeElement 
                key={node.id} 
                node={node} 
                isSelected={selectedNode?.id === node.id} 
                onClick={() => setSelectedNode(node)} 
              />
            ))}

            {/* Canvas Footer */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 px-6 py-3 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl text-[10px] font-mono text-white/40">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500" /> Healthy
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500" /> Warning
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-rose-500" /> Critical
              </div>
            </div>
          </motion.div>

          {/* RIGHT PANEL: INSPECTOR & HEATMAP */}
          <motion.div 
            variants={itemVariants}
            className="col-span-3 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar"
          >
            {/* Latency Heatmap */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white/60">Inter-Node Latency</h2>
                <Activity size={14} className="text-white/40" />
              </div>
              <div className="grid grid-cols-10 gap-1">
                {latencyGrid.map((val, i) => (
                  <LatencyCell key={i} value={val} index={i} />
                ))}
              </div>
              <div className="mt-4 flex justify-between text-[10px] font-mono text-white/30">
                <span>0ms</span>
                <span>5ms</span>
                <span>15ms+</span>
              </div>
            </div>

            {/* Node Inspector */}
            <AnimatePresence mode="wait">
              {selectedNode ? (
                <motion.div 
                  key={selectedNode.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex-1 p-6 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4">
                    <div className={cn(
                      "px-2 py-1 rounded text-[10px] font-bold uppercase",
                      selectedNode.status === 'healthy' ? "bg-emerald-500/20 text-emerald-400" : 
                      selectedNode.status === 'warning' ? "bg-amber-500/20 text-amber-400" : "bg-rose-500/20 text-rose-400"
                    )}>
                      {selectedNode.status}
                    </div>
                  </div>

                  <h2 className="text-xl font-bold mb-1">{selectedNode.label}</h2>
                  <p className="text-xs text-white/40 font-mono mb-6">ID: {selectedNode.id}_X99_PROD</p>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-white/60">Compute Load</span>
                        <span className="font-mono">{selectedNode.load}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${selectedNode.load}%` }}
                          className={cn(
                            "h-full transition-colors",
                            selectedNode.load > 80 ? "bg-rose-500" : selectedNode.load > 50 ? "bg-amber-500" : "bg-emerald-500"
                          )} 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <span className="block text-[10px] text-white/40 uppercase mb-1">Latency</span>
                        <span className="text-lg font-bold font-mono">{selectedNode.latency}ms</span>
                      </div>
                      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                        <span className="block text-[10px] text-white/40 uppercase mb-1">Temp</span>
                        <span className="text-lg font-bold font-mono">64°C</span>
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex gap-3 items-start">
                      <AlertTriangle size={16} className="text-rose-400 shrink-0 mt-0.5" />
                      <p className="text-xs text-rose-200/70 leading-relaxed">
                        {selectedNode.status === 'critical' 
                          ? "Critical memory pressure detected. Automatic shard migration recommended." 
                          : selectedNode.status === 'warning' 
                          ? "Latency spikes detected in inter-node communication." 
                          : "Node operating within nominal parameters."}
                      </p>
                    </div>

                    <button className="w-full py-3 rounded-xl bg-white text-black text-sm font-bold hover:bg-white/90 transition-colors flex items-center justify-center gap-2">
                      <Settings size={16} />
                      Reconfigure Shard
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="flex-1 p-8 rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center text-center gap-4">
                  <div className="p-4 rounded-full bg-white/5 text-white/20">
                    <Search size={32} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white/60">No Node Selected</p>
                    <p className="text-xs text-white/30">Select a shard from the registry or canvas to inspect telemetry.</p>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </motion.div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
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