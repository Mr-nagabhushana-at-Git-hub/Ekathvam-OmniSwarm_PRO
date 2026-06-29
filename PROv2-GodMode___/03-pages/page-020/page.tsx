<thinking>
The objective is to create **Page 20 of 50** of a high-fidelity, animated Next.js UI.
The specific requirement for Page 20 is a "unique, highly detailed view" utilizing 20 micro-interaction components and focusing on `staggerChildren` entrance animations using Framer Motion.

**Theme Selection: "Aether-Core: Neural Network Topology & Health Monitor"**
I will build a "Neural Network Topology Monitor". This is a high-density technical dashboard used to monitor the health, latency, and throughput of a distributed AI agent swarm.

**Architectural Plan:**
1.  **Layout**: A "Command Center" style layout with a central visualization area and surrounding telemetry panels.
2.  **Entrance Animation**: Use a `variants` object with `staggerChildren` to animate the panels appearing one by one (Top Bar $\rightarrow$ Left Sidebar $\rightarrow$ Main View $\rightarrow$ Right Telemetry $\rightarrow$ Bottom Logs).
3.  **Micro-interactions**:
    *   **Hover-glow cards**: Cards that illuminate based on mouse position.
    *   **Pulse indicators**: Real-time health pings.
    *   **Interactive Node Graph**: A simulated network map where nodes react to hover.
    *   **Animated Progress Rings**: For resource utilization (CPU/GPU/VRAM).
    *   **Live Log Stream**: A scrolling terminal with staggered text entry.
    *   **Toggle Switches**: For "Simulation Mode" vs "Live Mode".
4.  **Technical Stack**: Next.js, Tailwind CSS, Framer Motion, Lucide React.

**Component Breakdown:**
- `NeuralTopology`: The central SVG/Canvas-like visualization of the agent network.
- `TelemetryCard`: A reusable wrapper for metrics with entrance animations.
- `HealthMetric`: A circular progress indicator with a glow effect.
- `AgentLog`: A terminal-style feed of system events.
- `ControlPanel`: A set of high-fidelity switches and sliders.

**Animation Strategy:**
- `container`: `hidden` $\rightarrow$ `visible` (staggerChildren: 0.1s).
- `item`: `opacity: 0, y: 20` $\rightarrow$ `opacity: 1, y: 0`.
- `layout`: Use `layoutId` for seamless transitions between "Overview" and "Detailed" node views.
</thinking>

```tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Activity, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  AlertTriangle, 
  Terminal, 
  Network, 
  Settings, 
  Maximize2, 
  RefreshCw,
  ChevronRight,
  Database,
  Layers
} from 'lucide-react';

// --- Types ---
interface NodeData {
  id: string;
  label: string;
  status: 'healthy' | 'warning' | 'critical';
  load: number;
  latency: number;
  connections: string[];
}

// --- Mock Data ---
const MOCK_NODES: NodeData[] = [
  { id: 'n1', label: 'Core-Orchestrator', status: 'healthy', load: 42, latency: 12, connections: ['n2', 'n3', 'n4'] },
  { id: 'n2', label: 'Semantic-Parser', status: 'healthy', load: 68, latency: 24, connections: ['n1', 'n5'] },
  { id: 'n3', label: 'Memory-Vault', status: 'warning', load: 89, latency: 45, connections: ['n1', 'n6'] },
  { id: 'n4', label: 'Logic-Engine', status: 'healthy', load: 31, latency: 18, connections: ['n1', 'n7'] },
  { id: 'n5', label: 'API-Gateway', status: 'healthy', load: 15, latency: 8, connections: ['n2'] },
  { id: 'n6', label: 'Vector-Index', status: 'critical', load: 94, latency: 112, connections: ['n3'] },
  { id: 'n7', label: 'Safety-Guard', status: 'healthy', load: 22, latency: 14, connections: ['n4'] },
];

// --- Animation Variants ---
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
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 } 
  },
};

// --- Micro-Components ---

const HealthRing = ({ value, status }: { value: number; status: NodeData['status'] }) => {
  const color = {
    healthy: 'stroke-emerald-500',
    warning: 'stroke-amber-500',
    critical: 'stroke-rose-500',
  }[status];

  return (
    <div className="relative w-16 h-16 flex items-center justify-center">
      <svg className="w-full h-full transform -rotate-90">
        <circle
          cx="32" cy="32" r="28"
          className="stroke-slate-800 fill-none"
          strokeWidth="4"
        />
        <motion.circle
          cx="32" cy="32" r="28"
          className={`${color} fill-none`}
          strokeWidth="4"
          strokeDasharray="175.9"
          initial={{ strokeDashoffset: 175.9 }}
          animate={{ strokeDashoffset: 175.9 - (175.9 * value) / 100 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          strokeLinecap="round"
        />
      </svg>
      <span className="absolute text-[10px] font-mono font-bold text-slate-300">{value}%</span>
    </div>
  );
};

const TelemetryCard = ({ title, icon: Icon, children, delay = 0 }: any) => (
  <motion.div 
    variants={itemVariants}
    whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
    className="bg-slate-900/50 border border-slate-800 p-4 rounded-xl backdrop-blur-md relative overflow-hidden group"
  >
    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="flex items-center gap-3 mb-4">
      <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
        <Icon size={18} />
      </div>
      <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">{title}</h3>
    </div>
    {children}
  </motion.div>
);

const LogEntry = ({ text, type, index }: { text: string; type: 'info' | 'warn' | 'err'; index: number }) => {
  const colors = {
    info: 'text-indigo-400',
    warn: 'text-amber-400',
    err: 'text-rose-400',
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className="flex gap-3 py-1 font-mono text-xs border-b border-slate-800/50 last:border-0"
    >
      <span className="text-slate-600">[{new Date().toLocaleTimeString()}]</span>
      <span className={`${colors[type]} font-bold`}>[{type.toUpperCase()}]</span>
      <span className="text-slate-300">{text}</span>
    </motion.div>
  );
};

// --- Main Page Component ---

export default function AetherCorePage() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [simMode, setSimMode] = useState(true);

  const activeNode = useMemo(() => 
    MOCK_NODES.find(n => n.id === selectedNode), 
    [selectedNode]
  );

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200 p-6 font-sans selection:bg-indigo-500/30">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-900/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-[1600px] mx-auto grid grid-cols-12 gap-6 h-full"
      >
        {/* --- Header --- */}
        <motion.header 
          variants={itemVariants}
          className="col-span-12 flex items-center justify-between bg-slate-900/40 border border-slate-800 p-4 rounded-2xl backdrop-blur-xl"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.4)]">
              <Network className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white">AETHER-CORE <span className="text-indigo-400 ml-2 text-xs font-mono bg-indigo-500/10 px-2 py-1 rounded border border-indigo-500/20">v4.0.2-STABLE</span></h1>
              <p className="text-xs text-slate-500 font-mono">Neural Topology & Swarm Health Monitor</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3 bg-slate-950/50 p-1 rounded-lg border border-slate-800">
              <button 
                onClick={() => setSimMode(true)}
                className={`px-3 py-1 text-xs rounded-md transition-all ${simMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                SIMULATION
              </button>
              <button 
                onClick={() => setSimMode(false)}
                className={`px-3 py-1 text-xs rounded-md transition-all ${!simMode ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
              >
                LIVE-FEED
              </button>
            </div>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><Settings size={20} /></button>
              <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors"><RefreshCw size={20} /></button>
            </div>
          </div>
        </motion.header>

        {/* --- Left Panel: Global Metrics --- */}
        <motion.aside variants={itemVariants} className="col-span-3 flex flex-col gap-6">
          <TelemetryCard title="System Load" icon={Cpu}>
            <div className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-3xl font-mono font-bold text-white">64.2%</span>
                <span className="text-emerald-400 text-xs font-mono mb-1">↓ 2.1%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '64.2%' }}
                  className="h-full bg-gradient-to-r from-indigo-600 to-blue-400"
                />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div className="p-2 bg-slate-800/50 rounded border border-slate-700/50">
                  <p className="text-[10px] text-slate-500 uppercase">VRAM</p>
                  <p className="text-sm font-mono text-slate-300">12.4 / 24 GB</p>
                </div>
                <div className="p-2 bg-slate-800/50 rounded border border-slate-700/50">
                  <p className="text-[10px] text-slate-500 uppercase">TFLOPS</p>
                  <p className="text-sm font-mono text-slate-300">142.8</p>
                </div>
              </div>
            </div>
          </TelemetryCard>

          <TelemetryCard title="Network Health" icon={Activity}>
            <div className="flex items-center justify-between gap-4">
              <HealthRing value={98} status="healthy" />
              <div className="flex-1 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Packet Loss</span>
                  <span className="text-slate-300 font-mono">0.001%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Avg Latency</span>
                  <span className="text-slate-300 font-mono">14ms</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-500">Throughput</span>
                  <span className="text-slate-300 font-mono">8.2 Gbps</span>
                </div>
              </div>
            </div>
          </TelemetryCard>

          <TelemetryCard title="Security Layer" icon={ShieldCheck}>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                <span className="text-xs text-emerald-400">Firewall Active</span>
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              </div>
              <div className="flex items-center justify-between p-2 bg-indigo-500/5 border border-indigo-500/20 rounded-lg">
                <span className="text-xs text-indigo-400">Encryption AES-256</span>
                <ShieldCheck size={14} className="text-indigo-400" />
              </div>
              <div className="flex items-center justify-between p-2 bg-slate-800/50 border border-slate-700 rounded-lg">
                <span className="text-xs text-slate-400">Intrusion Detection</span>
                <span className="text-[10px] font-mono text-slate-500">SCANNING...</span>
              </div>
            </div>
          </TelemetryCard>
        </motion.aside>

        {/* --- Center Panel: Topology Map --- */}
        <motion.main 
          variants={itemVariants} 
          className="col-span-6 relative bg-slate-900/30 border border-slate-800 rounded-3xl overflow-hidden min-h-[600px] group"
        >
          <div className="absolute top-6 left-6 z-20 flex items-center gap-3">
            <div className="px-3 py-1 bg-slate-950/80 border border-slate-700 rounded-full text-[10px] font-mono text-slate-400 flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-ping" />
              LIVE TOPOLOGY MAP
            </div>
            <button className="p-1.5 bg-slate-950/80 border border-slate-700 rounded-full text-slate-400 hover:text-white transition-colors">
              <Maximize2 size={14} />
            </button>
          </div>

          {/* SVG Network Visualization */}
          <svg className="w-full h-full absolute inset-0 pointer-events-none">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            {/* Connections */}
            {MOCK_NODES.map(node => 
              node.connections.map(connId => {
                const target = MOCK_NODES.find(n => n.id === connId);
                if (!target) return null;
                
                // Simple coordinate mapping for demo
                const startX = (parseInt(node.id.slice(1)) * 100) % 600 + 100;
                const startY = (parseInt(node.id.slice(1)) * 70) % 400 + 100;
                const endX = (parseInt(target.id.slice(1)) * 100) % 600 + 100;
                const endY = (parseInt(target.id.slice(1)) * 70) % 400 + 100;

                return (
                  <motion.line
                    key={`${node.id}-${target.id}`}
                    x1={startX} y1={startY} x2={endX} y2={endY}
                    stroke="currentColor"
                    className="text-slate-800"
                    strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                );
              })
            )}
          </svg>

          {/* Interactive Nodes */}
          <div className="absolute inset-0 p-12 grid grid-cols-3 gap-12 items-center justify-items-center">
            {MOCK_NODES.map((node, idx) => (
              <motion.div
                key={node.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.8 + (idx * 0.1) }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setSelectedNode(node.id)}
                className={`
                  relative cursor-pointer p-4 rounded-2xl border transition-all duration-300
                  ${selectedNode === node.id 
                    ? 'bg-indigo-500/20 border-indigo-400 shadow-[0_0_30px_rgba(79,70,229,0.3)]' 
                    : 'bg-slate-900/80 border-slate-700 hover:border-slate-500'}
                `}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    node.status === 'healthy' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 
                    node.status === 'warning' ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]' : 
                    'bg-rose-500 shadow-[0_0_8px_#f43f5e]'
                  }`} />
                  <span className="text-xs font-mono font-medium text-slate-300">{node.label}</span>
                </div>
                
                {/* Tooltip-like detail on hover */}
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  className="absolute -bottom-12 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-950 border border-slate-800 px-2 py-1 rounded text-[10px] font-mono text-slate-400 pointer-events-none"
                >
                  LOAD: {node.load}% | LAT: {node.latency}ms
                </motion.div>
              </motion.div>
            ))}
          </div>

          {/* Node Detail Overlay */}
          <AnimatePresence>
            {activeNode && (
              <motion.div 
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 100 }}
                className="absolute right-6 top-24 bottom-6 w-72 bg-slate-950/90 border border-indigo-500/30 backdrop-blur-2xl rounded-2xl p-6 shadow-2xl z-30"
              >
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-lg font-bold text-white">{activeNode.label}</h2>
                  <button 
                    onClick={() => setSelectedNode(null)}
                    className="p-1 hover:bg-slate-800 rounded text-slate-500"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500 uppercase tracking-widest">Status</span>
                    <span className={`text-xs font-bold uppercase ${
                      activeNode.status === 'healthy' ? 'text-emerald-400' : 
                      activeNode.status === 'warning' ? 'text-amber-400' : 'text-rose-400'
                    }`}>
                      {activeNode.status}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Resource Load</span>
                      <span className="text-slate-300 font-mono">{activeNode.load}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${activeNode.load}%` }}
                        className={`h-full ${
                          activeNode.status === 'healthy' ? 'bg-emerald-500' : 
                          activeNode.status === 'warning' ? 'bg-amber-500' : 'bg-rose-500'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-slate-500 uppercase mb-1">Latency</p>
                      <p className="text-sm font-mono text-white">{activeNode.latency}ms</p>
                    </div>
                    <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                      <p className="text-[10px] text-slate-500 uppercase mb-1">Uptime</p>
                      <p className="text-sm font-mono text-white">99.99%</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-800">
                    <p className="text-[10px] text-slate-500 uppercase mb-3">Active Connections</p>
                    <div className="flex flex-wrap gap-2">
                      {activeNode.connections.map(conn => (
                        <span key={conn} className="px-2 py-1 bg-slate-800 rounded text-[10px] font-mono text-slate-400 border border-slate-700">
                          {conn}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.main>

        {/* --- Right Panel: Telemetry & Logs --- */}
        <motion.aside variants={itemVariants} className="col-span-3 flex flex-col gap-6">
          <TelemetryCard title="Resource Distribution" icon={Layers}>
            <div className="space-y-4">
              {[
                { label: 'Compute', val: 72, color: 'bg-indigo-500' },
                { label: 'Memory', val: 45, color: 'bg-blue-500' },
                { label: 'I/O Bandwidth', val: 88, color: 'bg-purple-500' },
              ].map((item, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] uppercase text-slate-500">
                    <span>{item.label}</span>
                    <span>{item.val}%</span>
                  </div>
                  <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.val}%` }}
                      transition={{ delay: 1 + (i * 0.1) }}
                      className={`h-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </TelemetryCard>

          <TelemetryCard title="System Event Log" icon={Terminal}>
            <div className="h-64 overflow-y-auto pr-2 space-y-1 custom-scrollbar">
              <LogEntry index={0} type="info" text="Initializing Aether-Core kernel..." />
              <LogEntry index={1} type="info" text="Establishing neural handshake with Node-1..." />
              <LogEntry index={2} type="info" text="Handshake successful. Latency: 12ms" />
              <LogEntry index={3} type="warn" text="Node-3 reporting high memory pressure" />
              <LogEntry index={4} type="err" text="Vector-Index timeout on query 0xAF32" />
              <LogEntry index={5} type="info" text="Auto-scaling instance in region US-EAST-1" />
              <LogEntry index={6} type="info" text="Heartbeat signal received from all nodes" />
              <LogEntry index={7} type="warn" text="Unexpected jitter detected in Logic-Engine" />
            </div>
          </TelemetryCard>

          <TelemetryCard title="Quick Actions" icon={Zap}>
            <div className="grid grid-cols-1 gap-2">
              <button className="flex items-center justify-between p-2 bg-slate-800 hover:bg-indigo-600 rounded-lg text-xs transition-all group">
                <span className="text-slate-400 group-hover:text-white">Purge Cache</span>
                <Database size={14} className="text-slate-500 group-hover:text-white" />
              </button>
              <button className="flex items-center justify-between p-2 bg-slate-800 hover:bg-rose-600 rounded-lg text-xs transition-all group">
                <span className="text-slate-400 group-hover:text-white">Emergency Stop</span>
                <AlertTriangle size={14} className="text-slate-500 group-hover:text-white" />
              </button>
              <button className="flex items-center justify-between p-2 bg-slate-800 hover:bg-emerald-600 rounded-lg text-xs transition-all group">
                <span className="text-slate-400 group-hover:text-white">Optimize Routing</span>
                <Zap size={14} className="text-slate-500 group-hover:text-white" />
              </button>
            </div>
          </TelemetryCard>
        </motion.aside>
      </motion.div>

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
    </div>
  );
}
```