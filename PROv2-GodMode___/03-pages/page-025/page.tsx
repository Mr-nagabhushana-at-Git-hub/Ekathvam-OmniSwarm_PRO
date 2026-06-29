<thinking>
The objective is to create **Page 25 of 50** of a high-fidelity, animated Next.js UI.
The requirement is a "unique, highly detailed view" utilizing 20 micro-interaction components and focusing on `staggerChildren` entrance animations using Framer Motion.

**Theme Selection: "Omni-Vault: Quantum Asset & Security Orchestrator"**
I will build a "Quantum Asset & Security Orchestrator." This is a high-density security dashboard used by "Cyber-Architects" to manage encrypted assets, monitor real-time threat vectors, and orchestrate security protocols across a distributed network.

**Architectural Plan:**
1.  **Layout**: A complex grid system with a sidebar, a main "Command Center" (central visualization), and right-hand "Intelligence" panels.
2.  **Key Components**:
    *   `SecurityMatrix`: A grid of active security nodes with pulsing status indicators.
    *   `ThreatVectorGraph`: A real-time animated line/area chart showing attack attempts.
    *   `AssetVault`: A list of encrypted assets with "unlock" micro-interactions.
    *   `ProtocolConsole`: A terminal-like interface for executing security commands.
3.  **Animations**:
    *   `staggerChildren`: The entire page will load in a sequence: Sidebar $\rightarrow$ Header $\rightarrow$ Main Grid $\rightarrow$ Individual Widgets.
    *   `layoutId`: Smooth transitions when switching between "Overview" and "Deep Dive" modes.
    *   `AnimatePresence`: For alert notifications and modal overlays.
4.  **Micro-interactions**:
    *   Hover-triggered glow effects (using CSS variables from memory context).
    *   Spring-based scaling on card interactions.
    *   Progressive loading bars for "Decryption" simulations.

**Technical Stack**:
*   Next.js 14 (App Router)
*   Framer Motion (for all animations)
*   Tailwind CSS (for styling)
*   Lucide React (for iconography)
*   TypeScript (strict mode)

**Detailed Component Breakdown**:
*   `PageContainer`: The root motion component handling the `staggerChildren` orchestration.
*   `StatCard`: A reusable widget with a sparkline and a value that counts up.
*   `NodeGrid`: A 4x4 grid of "Security Nodes" that react to mouse proximity.
*   `ActivityFeed`: A scrolling list of security events with staggered entrance.
*   `ControlPanel`: A set of toggle switches and sliders for "Security Levels".

Let's implement.
</thinking>

```tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Activity, 
  Zap, 
  AlertTriangle, 
  Terminal, 
  Cpu, 
  Globe, 
  Search, 
  Bell, 
  Settings,
  ChevronRight,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';

// --- Types & Mock Data ---
type SecurityNode = {
  id: string;
  status: 'stable' | 'warning' | 'critical';
  load: number;
  label: string;
};

const MOCK_NODES: SecurityNode[] = Array.from({ length: 16 }).map((_, i) => ({
  id: `node-${i}`,
  status: i % 7 === 0 ? 'critical' : i % 3 === 0 ? 'warning' : 'stable',
  load: Math.floor(Math.random() * 100),
  label: `S-CORE ${100 + i}`,
}));

const SECURITY_EVENTS = [
  { id: 1, time: '12:04:21', msg: 'Quantum Tunneling detected in Sector 7', type: 'critical' },
  { id: 2, time: '12:05:10', msg: 'Handshake verified: Node-104', type: 'stable' },
  { id: 3, time: '12:06:45', msg: 'Brute force attempt blocked: IP 192.168.1.1', type: 'warning' },
  { id: 4, time: '12:08:02', msg: 'Encryption keys rotated successfully', type: 'stable' },
  { id: 5, time: '12:10:15', msg: 'Unauthorized access attempt: Vault-Alpha', type: 'critical' },
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
    transition: { type: 'spring', stiffness: 100 } 
  },
};

// --- Micro-Interaction Components ---

const StatusBadge = ({ status }: { status: SecurityNode['status'] }) => {
  const colors = {
    stable: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    warning: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
    critical: 'bg-rose-500/20 text-rose-400 border-rose-500/50',
  };

  return (
    <div className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${colors[status]}`}>
      {status.toUpperCase()}
    </div>
  );
};

const SecurityNodeCard = ({ node }: { node: SecurityNode }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ scale: 1.05, zIndex: 10 }}
      className="relative group p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md cursor-pointer overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-accent/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
          <Cpu size={16} className="text-accent" />
        </div>
        <StatusBadge status={node.status} />
      </div>

      <div className="space-y-1">
        <h4 className="text-xs font-mono text-white/60">{node.label}</h4>
        <div className="flex items-end gap-2">
          <span className="text-lg font-bold text-white">{node.load}%</span>
          <span className="text-[10px] text-white/40 mb-1">LOAD</span>
        </div>
      </div>

      {/* Micro-interaction: Progress bar that fills on hover */}
      <div className="mt-3 h-1 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${node.load}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          className={`h-full ${node.status === 'critical' ? 'bg-rose-500' : node.status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'}`}
        />
      </div>
    </motion.div>
  );
};

const AssetRow = ({ asset, index }: { asset: any, index: number }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <motion.div 
      variants={itemVariants}
      className="group flex items-center justify-between p-3 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-all cursor-pointer"
    >
      <div className="flex items-center gap-4">
        <div className="p-2 rounded-md bg-white/5 text-white/40 group-hover:text-accent transition-colors">
          <Lock size={14} />
        </div>
        <div>
          <p className="text-sm font-medium text-white/90">{asset.name}</p>
          <p className="text-[10px] font-mono text-white/40">{asset.id}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsVisible(!isVisible)}
          className="p-2 rounded-md hover:bg-white/10 text-white/40 hover:text-white transition-all"
        >
          {isVisible ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
        <div className="text-right">
          <p className={`text-xs font-mono ${isVisible ? 'text-accent' : 'text-white/40'}`}>
            {isVisible ? asset.key : '••••••••••••'}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Page Component ---

export default function OmniVaultPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = () => {
    setIsScanning(true);
    setTimeout(() => setIsScanning(false), 3000);
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen bg-[#0a0a0c] text-white p-6 font-sans selection:bg-accent/30"
    >
      {/* Header Section */}
      <motion.header 
        variants={itemVariants}
        className="flex justify-between items-center mb-8"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-accent shadow-[0_0_20px_rgba(var(--accent-rgb),0.4)]">
            <Shield size={24} className="text-black" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Omni-Vault <span className="text-accent font-mono text-sm ml-2">v4.0.2</span></h1>
            <p className="text-white/40 text-xs">Quantum Asset & Security Orchestrator</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-white/60">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            SYSTEMS NOMINAL
          </div>
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60">
            <Bell size={20} />
          </button>
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-white/60">
            <Settings size={20} />
          </button>
        </div>
      </motion.header>

      <div className="grid grid-cols-12 gap-6">
        
        {/* Left Sidebar: Navigation & Controls */}
        <motion.aside 
          variants={itemVariants}
          className="col-span-3 space-y-6"
        >
          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4 px-2">Main Navigation</h3>
            <nav className="space-y-1">
              {['Overview', 'Asset Vault', 'Threat Map', 'Audit Logs', 'Network Config'].map((item) => (
                <button
                  key={item}
                  onClick={() => setActiveTab(item.toLowerCase())}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                    activeTab === item.toLowerCase() 
                    ? 'bg-accent text-black font-semibold' 
                    : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item}
                  <ChevronRight size={14} className={activeTab === item.toLowerCase() ? 'opacity-100' : 'opacity-0'} />
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4 px-2">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">System Health</h3>
              <RefreshCw size={12} className={`text-white/40 ${isScanning ? 'animate-spin' : ''}`} />
            </div>
            <div className="space-y-4">
              {[
                { label: 'CPU Cluster', val: 42, color: 'bg-blue-500' },
                { label: 'Memory Pool', val: 78, color: 'bg-purple-500' },
                { label: 'Net Latency', val: 12, color: 'bg-emerald-500' },
              ].map((stat) => (
                <div key={stat.label} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-mono">
                    <span className="text-white/60">{stat.label}</span>
                    <span className="text-white">{stat.val}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.val}%` }}
                      className={`h-full ${stat.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
            <button 
              onClick={handleScan}
              disabled={isScanning}
              className="w-full mt-6 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold transition-all border border-white/10 disabled:opacity-50"
            >
              {isScanning ? 'SCANNING...' : 'RUN DIAGNOSTICS'}
            </button>
          </div>
        </motion.aside>

        {/* Center: Main Command Center */}
        <motion.main 
          variants={itemVariants}
          className="col-span-6 space-y-6"
        >
          {/* Top Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Active Threats', val: '03', icon: AlertTriangle, color: 'text-rose-400' },
              { label: 'Encrypted Assets', val: '1,284', icon: Lock, color: 'text-accent' },
              { label: 'Network Uptime', val: '99.9%', icon: Activity, color: 'text-emerald-400' },
            ].map((stat, i) => (
              <motion.div 
                key={stat.label}
                whileHover={{ y: -5 }}
                className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm"
              >
                <div className="flex justify-between items-start mb-2">
                  <stat.icon size={18} className={stat.color} />
                  <span className="text-[10px] font-mono text-white/30">LIVE</span>
                </div>
                <p className="text-2xl font-bold">{stat.val}</p>
                <p className="text-xs text-white/40">{stat.label}</p>
              </motion.div>
            ))}
          </div>

          {/* Node Matrix */}
          <div className="p-6 rounded-3xl border border-white/10 bg-white/[0.02] relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-lg font-bold">Security Node Matrix</h2>
                <p className="text-xs text-white/40">Real-time distribution of quantum shards</p>
              </div>
              <div className="flex gap-2">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 text-[10px] text-white/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Stable
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-white/5 text-[10px] text-white/60">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500" /> Critical
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {MOCK_NODES.map((node) => (
                <SecurityNodeCard key={node.id} node={node} />
              ))}
            </div>
          </div>

          {/* Terminal Console */}
          <div className="p-4 rounded-2xl border border-white/10 bg-black/50 font-mono text-xs">
            <div className="flex items-center gap-2 mb-3 pb-3 border-b border-white/10">
              <Terminal size={14} className="text-accent" />
              <span className="text-white/60">System Console</span>
              <div className="ml-auto flex gap-1.5">
                <div className="w-2 h-2 rounded-full bg-rose-500/50" />
                <div className="w-2 h-2 rounded-full bg-amber-500/50" />
                <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
              </div>
            </div>
            <div className="space-y-1 h-32 overflow-y-auto scrollbar-hide">
              <p className="text-emerald-400">[OK] Initializing Quantum Handshake...</p>
              <p className="text-white/60">[INFO] Connecting to Node-S102...</p>
              <p className="text-white/60">[INFO] Connecting to Node-S105...</p>
              <p className="text-rose-400">[WARN] Latency spike detected in Sector 4</p>
              <p className="text-white/60">[INFO] Re-routing traffic via Node-S110...</p>
              <p className="text-accent animate-pulse">_ Waiting for input...</p>
            </div>
          </div>
        </motion.main>

        {/* Right Sidebar: Intelligence & Assets */}
        <motion.aside 
          variants={itemVariants}
          className="col-span-3 space-y-6"
        >
          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Threat Intelligence</h3>
              <Zap size={14} className="text-accent" />
            </div>
            <div className="space-y-3">
              {SECURITY_EVENTS.map((event) => (
                <div 
                  key={event.id} 
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-white/20 transition-all group"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className={`text-[10px] font-mono ${
                      event.type === 'critical' ? 'text-rose-400' : 
                      event.type === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {event.type.toUpperCase()}
                    </span>
                    <span className="text-[10px] text-white/30">{event.time}</span>
                  </div>
                  <p className="text-xs text-white/70 group-hover:text-white transition-colors">{event.msg}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Vault Access</h3>
              <Search size={14} className="text-white/40" />
            </div>
            <div className="space-y-1">
              {[
                { name: 'Master Root Key', id: 'KEY-001-ALPHA', key: 'qx7-992-p01-zxz' },
                { name: 'Neural Bridge Token', id: 'KEY-042-BETA', key: 'nn2-110-m99-aaa' },
                { name: 'S-Core Admin Pass', id: 'KEY-109-GAMMA', key: 'ss1-443-k22-bbb' },
                { name: 'Quantum Seed', id: 'KEY-882-DELTA', key: 'qq0-001-v11-ccc' },
              ].map((asset, i) => (
                <AssetRow key={asset.id} asset={asset} index={i} />
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-accent/30 bg-accent/5 relative overflow-hidden group cursor-pointer">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe size={100} />
            </div>
            <h4 className="text-sm font-bold mb-1">Global Network Map</h4>
            <p className="text-[10px] text-white/50 mb-3">View all distributed nodes in 3D space</p>
            <div className="flex items-center gap-2 text-accent text-xs font-bold">
              LAUNCH MAP <ChevronRight size={12} />
            </div>
          </div>
        </motion.aside>

      </div>

      {/* Footer / Signature */}
      <footer className="mt-12 pt-6 border-t border-white/10 flex justify-between items-center text-white/30 text-[10px] font-mono">
        <div className="flex gap-4">
          <span>© 2025-2030 Nagabhushana Raju S</span>
          <span>ORCMEGA-AI INFRASTRUCTURE</span>
        </div>
        <div className="flex gap-4">
          <a href="https://www.mr-nagabhushanaraju-s.engineer" className="hover:text-accent transition-colors">PORTFOLIO</a>
          <a href="https://github.com/Mr-nagabhushana-at-Git-hub" className="hover:text-accent transition-colors">GITHUB</a>
        </div>
      </footer>
    </motion.div>
  );
}
```