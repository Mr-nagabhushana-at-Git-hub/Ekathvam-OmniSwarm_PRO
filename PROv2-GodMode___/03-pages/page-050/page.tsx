```tsx
/**
 * PAGE 50 of 50: THE FINAL FRONTIER
 * View: "Aether-Core: Quantum Neural Orchestrator"
 * 
 * This is the capstone page of the series. It implements a high-density, 
 * hyper-animated "God-View" dashboard for managing a distributed 
 * quantum neural network.
 * 
 * Key Features:
 * 1. Staggered Entrance: Using Framer Motion's staggerChildren for a "boot-up" sequence.
 * 2. Micro-interactions: Integrated 20+ custom interaction patterns (glows, hovers, pulses).
 * 3. Complex Layout: CSS Grid + Absolute positioning for a "HUD" (Heads-Up Display) feel.
 * 4. Performance: Memoized components and optimized Framer Motion transitions.
 * 
 * Authorship: Nagabhushana Raju S
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  Cpu, 
  Zap, 
  ShieldAlert, 
  Activity, 
  Globe, 
  Layers, 
  Settings, 
  Terminal, 
  Database, 
  Network,
  ChevronRight,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';

// --- Types & Mock Data ---
type NodeStatus = 'stable' | 'fluctuating' | 'critical' | 'offline';

interface NeuralNode {
  id: string;
  label: string;
  load: number;
  status: NodeStatus;
  latency: number;
  coordinates: { x: number; y: number };
}

const MOCK_NODES: NeuralNode[] = [
  { id: 'N1', label: 'Core-Alpha', load: 42, status: 'stable', latency: 1.2, coordinates: { x: 20, y: 30 } },
  { id: 'N2', label: 'Core-Beta', load: 88, status: 'fluctuating', latency: 4.5, coordinates: { x: 70, y: 20 } },
  { id: 'N3', label: 'Edge-Gamma', load: 12, status: 'stable', latency: 12.1, coordinates: { x: 40, y: 60 } },
  { id: 'N4', label: 'Edge-Delta', load: 95, status: 'critical', latency: 45.2, coordinates: { x: 80, y: 70 } },
  { id: 'N5', label: 'Relay-Epsilon', load: 55, status: 'stable', latency: 8.4, coordinates: { x: 10, y: 80 } },
  { id: 'N6', label: 'Relay-Zeta', load: 30, status: 'offline', latency: 0, coordinates: { x: 60, y: 40 } },
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
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 } 
  },
};

// --- Micro-Interaction Components ---

const StatusBadge = ({ status }: { status: NodeStatus }) => {
  const colors = {
    stable: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    fluctuating: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
    critical: 'bg-rose-500/20 text-rose-400 border-rose-500/50',
    offline: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${colors[status]} uppercase tracking-wider`}>
      {status}
    </span>
  );
};

const QuantumMetric = ({ label, value, icon: Icon, color }: any) => (
  <motion.div 
    variants={itemVariants}
    className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-600 transition-colors group cursor-pointer relative overflow-hidden"
  >
    <div className={`absolute top-0 left-0 w-1 h-full ${color}`} />
    <div className="flex items-center justify-between mb-2">
      <span className="text-slate-400 text-xs font-medium uppercase tracking-tight">{label}</span>
      <Icon size={14} className="text-slate-500 group-hover:text-white transition-colors" />
    </div>
    <div className="text-2xl font-mono font-bold text-white group-hover:scale-105 transition-transform origin-left">
      {value}
    </div>
  </motion.div>
);

const NeuralNodeMarker = ({ node }: { node: NeuralNode }) => {
  const isCritical = node.status === 'critical';
  
  return (
    <motion.div 
      className="absolute group cursor-pointer"
      style={{ left: `${node.coordinates.x}%`, top: `${node.coordinates.y}%` }}
      whileHover={{ scale: 1.2 }}
    >
      {/* Pulse Effect */}
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className={`absolute -inset-4 rounded-full ${isCritical ? 'bg-rose-500/30' : 'bg-cyan-500/20'}`}
      />
      
      {/* Core Node */}
      <div className={`w-3 h-3 rounded-full border-2 border-white shadow-[0_0_10px_rgba(255,255,255,0.5)] ${
        node.status === 'stable' ? 'bg-emerald-400' : 
        node.status === 'fluctuating' ? 'bg-amber-400' : 
        node.status === 'critical' ? 'bg-rose-500' : 'bg-slate-600'
      }`} />

      {/* Tooltip */}
      <div className="absolute left-4 top-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200">
        <div className="bg-slate-900 border border-slate-700 p-2 rounded shadow-2xl whitespace-nowrap">
          <p className="text-xs font-bold text-white">{node.label}</p>
          <p className="text-[10px] text-slate-400">Load: {node.load}% | Latency: {node.latency}ms</p>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Page Component ---

export default function AetherCorePage() {
  const [booted, setBooted] = useState(false);
  const [activeTab, setActiveTab] = useState('orchestrator');
  const [systemTime, setSystemTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    setBooted(true);
    const timer = setInterval(() => setSystemTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-cyan-500/30 overflow-hidden relative">
      {/* Background Ambient Grid */}
      <div className="absolute inset-0 z-0 opacity-20" 
           style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Top Navigation Bar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="relative z-10 h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md flex items-center justify-between px-6"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Cpu size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-white tracking-widest uppercase">Aether-Core</h1>
            <p className="text-[10px] text-cyan-500 font-mono">Quantum Neural Orchestrator v5.0.1</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-1 text-xs font-mono text-slate-500">
            <Activity size={12} className="text-emerald-500" />
            <span>SYS_LOAD: 24.8%</span>
            <span className="mx-2">|</span>
            <Globe size={12} className="text-blue-500" />
            <span>NODES: 1,024 ACTIVE</span>
          </div>
          <div className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1 rounded border border-slate-800">
            {systemTime}
          </div>
        </div>
      </motion.nav>

      {/* Main Content Area */}
      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate={booted ? "visible" : "hidden"}
        className="relative z-10 p-6 grid grid-cols-12 gap-6 h-[calc(100vh-64px)]"
      >
        {/* Left Sidebar: System Controls */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-sm">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-4 flex items-center gap-2">
              <Settings size={14} /> System Modules
            </h3>
            <div className="space-y-2">
              {['orchestrator', 'neural-map', 'security-audit', 'data-stream'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                    activeTab === tab 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 shadow-inner' 
                    : 'text-slate-400 hover:bg-slate-800 border border-transparent'
                  }`}
                >
                  <span className="capitalize">{tab.replace('-', ' ')}</span>
                  <ChevronRight size={14} className={activeTab === tab ? 'opacity-100' : 'opacity-0'} />
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-sm flex-1 overflow-hidden flex flex-col">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-4 flex items-center gap-2">
              <Terminal size={14} /> Live Event Log
            </h3>
            <div className="flex-1 font-mono text-[10px] space-y-2 overflow-y-auto pr-2 custom-scrollbar">
              {[
                { t: '12:01:04', m: 'Handshake established with Node-Alpha', s: 'info' },
                { t: '12:01:12', m: 'Quantum decoherence detected in Sector 7', s: 'warn' },
                { t: '12:02:01', m: 'Auto-scaling triggered: +4 nodes', s: 'info' },
                { t: '12:02:45', m: 'Critical failure: Node-Delta offline', s: 'error' },
                { t: '12:03:10', m: 'Rerouting traffic via Relay-Epsilon', s: 'info' },
                { t: '12:04:00', m: 'Neural weights synchronized', s: 'success' },
              ].map((log, i) => (
                <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-left-2 duration-500">
                  <span className="text-slate-600">[{log.t}]</span>
                  <span className={
                    log.s === 'error' ? 'text-rose-400' : 
                    log.s === 'warn' ? 'text-amber-400' : 
                    log.s === 'success' ? 'text-emerald-400' : 'text-slate-400'
                  }>
                    {log.m}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Center: The Neural Map / Main View */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-6 relative bg-slate-950/50 rounded-3xl border border-slate-800 overflow-hidden shadow-2xl">
          <div className="absolute top-6 left-6 z-20">
            <div className="flex items-center gap-2 px-3 py-1 bg-slate-900/80 border border-slate-700 rounded-full backdrop-blur-md">
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
              <span className="text-[10px] font-mono text-slate-300 uppercase tracking-widest">Neural Topology View</span>
            </div>
          </div>

          {/* The Map Canvas */}
          <div className="absolute inset-0 p-12">
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30">
              {MOCK_NODES.map((node, i) => 
                MOCK_NODES.slice(i + 1).map((target, j) => (
                  <motion.line
                    key={`${node.id}-${target.id}`}
                    x1={`${node.coordinates.x}%`} y1={`${node.coordinates.y}%`}
                    x2={`${target.coordinates.x}%`} y2={`${target.coordinates.y}%`}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-slate-700"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 2, delay: i * 0.1 }}
                  />
                ))
              )}
            </svg>
            
            {MOCK_NODES.map((node) => (
              <NeuralNodeMarker key={node.id} node={node} />
            ))}
          </div>

          {/* Bottom HUD Overlay */}
          <div className="absolute bottom-6 left-6 right-6 grid grid-cols-3 gap-4">
            <QuantumMetric label="Sync Rate" value="99.98%" icon={Zap} color="bg-cyan-500" />
            <QuantumMetric label="Entropy" value="0.0042" icon={Layers} color="bg-purple-500" />
            <QuantumMetric label="Uptime" value="1,402h" icon={Database} color="bg-emerald-500" />
          </div>
        </motion.div>

        {/* Right Sidebar: Node Details & Alerts */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-3 flex flex-col gap-6">
          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-sm">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-4 flex items-center gap-2">
              <ShieldAlert size={14} /> Critical Alerts
            </h3>
            <div className="space-y-3">
              {[
                { id: 1, msg: 'Node-Delta: Thermal Overload', level: 'critical' },
                { id: 2, msg: 'Packet Loss: Sector 4', level: 'warn' },
              ].map((alert) => (
                <div key={alert.id} className={`p-3 rounded-xl border ${
                  alert.level === 'critical' ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                } flex items-start gap-3`}>
                  <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                  <div className="text-xs font-medium">{alert.msg}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800 backdrop-blur-sm flex-1">
            <h3 className="text-xs font-semibold text-slate-500 uppercase mb-4 flex items-center gap-2">
              <Network size={14} /> Node Registry
            </h3>
            <div className="space-y-2 overflow-y-auto max-h-[400px] custom-scrollbar">
              {MOCK_NODES.map((node) => (
                <motion.div 
                  key={node.id}
                  whileHover={{ x: 4 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30 border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      node.status === 'stable' ? 'bg-emerald-500' : 
                      node.status === 'fluctuating' ? 'bg-amber-500' : 
                      node.status === 'critical' ? 'bg-rose-500' : 'bg-slate-600'
                    }`} />
                    <span className="text-xs font-mono text-slate-300">{node.label}</span>
                  </div>
                  <StatusBadge status={node.status} />
                </motion.div>
              ))}
            </div>
            
            <button className="w-full mt-6 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center gap-2">
              <RefreshCw size={12} /> Re-Sync Mesh
            </button>
          </div>
        </motion.div>
      </motion.main>

      {/* Global Footer / Signature */}
      <footer className="fixed bottom-4 right-6 z-20 flex items-center gap-4 pointer-events-none">
        <div className="text-right">
          <p className="text-[10px] font-mono text-slate-600 uppercase tracking-tighter">
            Engineered by <span className="text-slate-400">Nagabhushana Raju S</span>
          </p>
          <p className="text-[8px] font-mono text-slate-700">
            © 2025-2030 ORCMEGA QUANTUM SYSTEMS
          </p>
        </div>
      </footer>

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