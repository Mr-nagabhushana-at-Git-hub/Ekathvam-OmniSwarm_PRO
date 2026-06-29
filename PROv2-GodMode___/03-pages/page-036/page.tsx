<thinking>
The objective is to create **Page 36 of 50** of a high-fidelity, animated Next.js UI.
The requirement is a "unique, highly detailed view" utilizing micro-interaction components and focusing on `staggerChildren` entrance animations using Framer Motion.

**Theme Selection: "Aether-Net: Neural Network Topology & Latency Mapper"**
I will build a "Neural Network Topology Mapper." This is a high-density technical view used by AI Infrastructure Engineers to visualize the physical and logical connections between GPU clusters, HBM (High Bandwidth Memory) saturation, and inter-node latency.

**Architectural Plan:**
1.  **Visual Concept**: A dark-mode, "cyber-grid" aesthetic. The page will feature a central interactive topology map (simulated with SVG/Framer Motion) surrounded by real-time telemetry panels.
2.  **Micro-Interactions**:
    *   *Pulse Indicators*: For active data streams.
    *   *Hover-Reveal Tooltips*: Detailed node specs on hover.
    *   *Slide-over Detail Panels*: Deep dive into specific cluster health.
    *   *Animated Progress Rings*: For memory/compute saturation.
3.  **Framer Motion Strategy**:
    *   `staggerChildren`: The entire dashboard will load in a sequence: Header $\rightarrow$ Main Map $\rightarrow$ Side Panels $\rightarrow$ Bottom Telemetry.
    *   `layoutId`: For seamless transitions when selecting a node.
    *   `animatePresence`: For smooth entry/exit of detail overlays.
4.  **Technical Stack**: Next.js, Tailwind CSS, Framer Motion, Lucide React.

**Component Breakdown**:
*   `TopologyMap`: The central SVG-based visualization of nodes and edges.
*   `ClusterMetricCard`: A high-density card showing GPU temp, power, and utilization.
*   `LatencyMatrix`: A heat-map style grid showing ms latency between nodes.
*   `NodeInspector`: A slide-out panel for detailed configuration.
*   `SystemStatusHeader`: A top bar with global health indicators.

**Detailed Implementation Steps**:
*   Define a `container` variant with `staggerChildren: 0.1`.
*   Define `item` variants for `opacity: 0, y: 20` $\rightarrow$ `opacity: 1, y: 0`.
*   Implement a "Live Stream" animation for the edges of the topology map using `stroke-dasharray`.
*   Ensure the layout is responsive and follows the "Agent-OS" design language (dark backgrounds, accent glows).
</thinking>

```tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  Cpu, 
  Activity, 
  Zap, 
  ShieldAlert, 
  Network, 
  Maximize2, 
  Settings, 
  Search, 
  ChevronRight, 
  Database, 
  Wind,
  AlertTriangle,
  Info
} from 'lucide-react';

// --- Types & Mock Data ---
interface NodeData {
  id: string;
  label: string;
  type: 'compute' | 'storage' | 'gateway';
  status: 'healthy' | 'warning' | 'critical';
  load: number;
  temp: number;
  latency: number;
  x: number;
  y: number;
}

const NODES: NodeData[] = [
  { id: 'n1', label: 'H100-Cluster-A', type: 'compute', status: 'healthy', load: 42, temp: 62, latency: 1.2, x: 200, y: 150 },
  { id: 'n2', label: 'H100-Cluster-B', type: 'compute', status: 'healthy', load: 88, temp: 78, latency: 1.1, x: 400, y: 100 },
  { id: 'n3', label: 'NVMe-Vault-01', type: 'storage', status: 'warning', load: 92, temp: 45, latency: 4.5, x: 300, y: 300 },
  { id: 'n4', label: 'Edge-Gateway-01', type: 'gateway', status: 'healthy', load: 12, temp: 38, latency: 12.4, x: 100, y: 400 },
  { id: 'n5', label: 'H100-Cluster-C', type: 'compute', status: 'critical', load: 99, temp: 94, latency: 2.8, x: 500, y: 350 },
  { id: 'n6', label: 'NVMe-Vault-02', type: 'storage', status: 'healthy', load: 31, temp: 41, latency: 3.2, x: 600, y: 200 },
];

const EDGES = [
  { from: 'n1', to: 'n2' }, { from: 'n1', to: 'n3' }, { from: 'n2', to: 'n3' },
  { from: 'n3', to: 'n4' }, { from: 'n3', to: 'n5' }, { from: 'n5', to: 'n6' },
  { from: 'n2', to: 'n6' }, { from: 'n4', to: 'n1' },
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
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 } 
  },
};

// --- Micro-Components ---

const StatusBadge = ({ status }: { status: NodeData['status'] }) => {
  const colors = {
    healthy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
    critical: 'bg-rose-500/20 text-rose-400 border-rose-500/50',
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${colors[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};

const MetricRing = ({ value, color }: { value: number; color: string }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-10 h-10 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="20" cy="20" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-800" />
        <motion.circle 
          cx="20" cy="20" r={radius} stroke={color} strokeWidth="3" fill="transparent" 
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[8px] font-bold">{value}%</span>
    </div>
  );
};

// --- Main Page Component ---

export default function AetherNetTopology() {
  const [selectedNode, setSelectedNode] = useState<NodeData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <motion.div 
      className="min-h-screen bg-[#0a0a0c] text-slate-300 p-6 font-sans selection:bg-indigo-500/30"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* Header Section */}
      <motion.header 
        variants={itemVariants}
        className="flex items-center justify-between mb-8 bg-slate-900/40 p-4 rounded-2xl border border-slate-800 backdrop-blur-md"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
            <Network size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Aether-Net Topology</h1>
            <p className="text-xs text-slate-500 font-mono">Neural Infrastructure Mapper v4.0.2</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-4 px-4 py-2 bg-black/40 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono">Global Latency: 1.4ms</span>
            </div>
            <div className="w-px h-4 bg-slate-800" />
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-xs font-mono">Active Nodes: 1,204</span>
            </div>
          </div>
          
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search cluster..." 
              className="bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-64 transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <button className="p-2 hover:bg-slate-800 rounded-xl transition-colors text-slate-400">
            <Settings size={20} />
          </button>
        </div>
      </motion.header>

      <div className="grid grid-cols-12 gap-6 h-[calc(100vh-160px)]">
        
        {/* Left Telemetry Panel */}
        <motion.aside 
          variants={itemVariants}
          className="col-span-3 flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar"
        >
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <Activity size={14} /> Cluster Health
            </h2>
            <span className="text-[10px] font-mono text-indigo-400 cursor-pointer hover:underline">View All</span>
          </div>

          {NODES.map((node) => (
            <motion.div 
              key={node.id}
              whileHover={{ x: 4 }}
              onClick={() => setSelectedNode(node)}
              className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                selectedNode?.id === node.id 
                ? 'bg-indigo-500/10 border-indigo-500/50 shadow-[0_0_20px_rgba(99,102,241,0.1)]' 
                : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="text-sm font-medium text-white">{node.label}</h3>
                  <p className="text-[10px] font-mono text-slate-500">{node.type.toUpperCase()}</p>
                </div>
                <StatusBadge status={node.status} />
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col items-center p-2 bg-black/30 rounded-lg border border-slate-800/50">
                  <MetricRing value={node.load} color="#6366f1" />
                  <span className="text-[8px] mt-1 text-slate-500">LOAD</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-black/30 rounded-lg border border-slate-800/50">
                  <MetricRing value={node.temp} color={node.temp > 80 ? '#f43f5e' : '#10b981'} />
                  <span className="text-[8px] mt-1 text-slate-500">TEMP</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-black/30 rounded-lg border border-slate-800/50">
                  <div className="text-xs font-mono text-indigo-300 mt-2">{node.latency}ms</div>
                  <span className="text-[8px] mt-1 text-slate-500">LATENCY</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.aside>

        {/* Central Topology Map */}
        <motion.main 
          variants={itemVariants}
          className="col-span-6 relative bg-slate-900/20 rounded-3xl border border-slate-800 overflow-hidden group"
        >
          {/* Grid Background */}
          <div className="absolute inset-0 opacity-20" 
               style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
          
          <div className="absolute top-4 right-4 flex gap-2">
            <button className="p-2 bg-black/60 backdrop-blur-md border border-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
              <Maximize2 size={16} />
            </button>
          </div>

          <svg className="w-full h-full" viewBox="0 0 800 600">
            {/* Connection Lines */}
            {EDGES.map((edge, i) => {
              const fromNode = NODES.find(n => n.id === edge.from)!;
              const toNode = NODES.find(n => n.id === edge.to)!;
              return (
                <g key={`edge-${i}`}>
                  <line 
                    x1={fromNode.x} y1={fromNode.y} x2={toNode.x} y2={toNode.y} 
                    stroke="#1e293b" strokeWidth="2" 
                  />
                  <motion.circle 
                    r="3" fill="#6366f1"
                    initial={{ offset: 0 }}
                    animate={{ 
                      cx: [fromNode.x, toNode.x], 
                      cy: [fromNode.y, toNode.y] 
                    }}
                    transition={{ 
                      duration: 2 + Math.random() * 2, 
                      repeat: Infinity, 
                      ease: "linear",
                      delay: i * 0.5 
                    }}
                  />
                </g>
              );
            })}

            {/* Nodes */}
            {NODES.map((node) => (
              <motion.g 
                key={node.id} 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer"
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              >
                <circle 
                  cx={node.x} cy={node.y} r="24" 
                  className={`transition-colors duration-500 ${
                    selectedNode?.id === node.id ? 'fill-indigo-500' : 'fill-slate-800'
                  }`} 
                  stroke={node.status === 'critical' ? '#f43f5e' : node.status === 'warning' ? '#f59e0b' : '#6366f1'}
                  strokeWidth="3"
                />
                <text 
                  x={node.x} y={node.y + 40} 
                  textAnchor="middle" 
                  className="fill-slate-400 text-[10px] font-mono pointer-events-none"
                >
                  {node.label}
                </text>
                {node.status === 'critical' && (
                  <motion.circle 
                    cx={node.x} cy={node.y} r="30" 
                    stroke="#f43f5e" strokeWidth="2" fill="none"
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1.2, opacity: 0 }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                )}
              </motion.g>
            ))}
          </svg>
        </motion.main>

        {/* Right Inspector Panel */}
        <motion.aside 
          variants={itemVariants}
          className="col-span-3 flex flex-col gap-6"
        >
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div 
                key={selectedNode.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 backdrop-blur-xl h-full flex flex-col"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-bold text-white">Node Inspector</h2>
                  <button 
                    onClick={() => setSelectedNode(null)}
                    className="p-1 hover:bg-slate-800 rounded-md text-slate-500"
                  >
                    <Maximize2 size={14} className="rotate-45" />
                  </button>
                </div>

                <div className="space-y-6 flex-1">
                  <div className="p-4 bg-black/40 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-indigo-500/20 rounded-lg text-indigo-400">
                        <Cpu size={18} />
                      </div>
                      <span className="text-sm font-medium">Hardware Specs</span>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Architecture</span>
                        <span className="text-slate-300 font-mono">Hopper H100 SXM5</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">VRAM</span>
                        <span className="text-slate-300 font-mono">80GB HBM3</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Interconnect</span>
                        <span className="text-slate-300 font-mono">NVLink 4.0</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-black/40 rounded-2xl border border-slate-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-500/20 rounded-lg text-amber-400">
                        <Zap size={18} />
                      </div>
                      <span className="text-sm font-medium">Real-time Telemetry</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-slate-500">Compute Load</span>
                          <span className="text-slate-300">{selectedNode.load}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${selectedNode.load}%` }}
                            className={`h-full ${selectedNode.load > 90 ? 'bg-rose-500' : 'bg-indigo-500'}`} 
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-slate-500">Thermal State</span>
                          <span className="text-slate-300">{selectedNode.temp}°C</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(selectedNode.temp / 100) * 100}%` }}
                            className={`h-full ${selectedNode.temp > 80 ? 'bg-rose-500' : 'bg-emerald-500'}`} 
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                    <div className="flex items-center gap-3 text-rose-400 mb-2">
                      <AlertTriangle size={16} />
                      <span className="text-xs font-bold uppercase">System Alert</span>
                    </div>
                    <p className="text-[11px] text-rose-300/80 leading-relaxed">
                      {selectedNode.status === 'critical' 
                        ? "Critical thermal throttling detected. Immediate cooling intervention required." 
                        : selectedNode.status === 'warning' 
                        ? "Memory saturation approaching threshold. Consider load balancing." 
                        : "All systems nominal. Operating within optimal parameters."}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button className="py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-medium transition-colors">
                    Rebalance Load
                  </button>
                  <button className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-medium transition-colors">
                    Diagnostics
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full border-2 border-dashed border-slate-800 rounded-3xl flex flex-col items-center justify-center p-8 text-center"
              >
                <div className="p-4 bg-slate-900 rounded-full text-slate-600 mb-4">
                  <Info size={32} />
                </div>
                <h3 className="text-slate-400 font-medium mb-2">No Node Selected</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Select a cluster node from the map or the health panel to inspect detailed telemetry.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.aside>
      </div>

      {/* Bottom Global Status Bar */}
      <motion.footer 
        variants={itemVariants}
        className="mt-6 grid grid-cols-4 gap-4"
      >
        {[
          { label: 'Network Throughput', value: '1.2 Pbps', icon: Zap, color: 'text-amber-400' },
          { label: 'Avg. Node Temp', value: '54.2°C', icon: Wind, color: 'text-emerald-400' },
          { label: 'Storage I/O', value: '450 GB/s', icon: Database, color: 'text-indigo-400' },
          { label: 'Security Status', value: 'Hardened', icon: ShieldAlert, color: 'text-rose-400' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -2 }}
            className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl flex items-center gap-4"
          >
            <div className={`p-2 rounded-lg bg-black/40 ${stat.color}`}>
              <stat.icon size={18} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-mono">{stat.label}</p>
              <p className="text-sm font-bold text-white">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </motion.footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #1e293b;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #334155;
        }
      `}</style>
    </motion.div>
  );
}
```