<thinking>
The objective is to create **Page 38 of 50** of a high-fidelity, animated Next.js UI.
The requirement is a "unique, highly detailed view" utilizing micro-interaction components and focusing on `staggerChildren` entrance animations using Framer Motion.

**Theme Selection: "Nebula-OS: Galactic Resource Orchestrator & Dyson Sphere Monitor"**
I will build a "Galactic Resource Orchestrator." This is a high-density industrial control panel for managing energy harvesting from stars, planetary terraforming progress, and interstellar fleet logistics. It's a "Sci-Fi Command Center" style interface.

**Key UI Elements:**
1.  **The Stellar Core (Central Visualization):** A complex, animated SVG/CSS representation of a Dyson Sphere in progress, with energy flow lines.
2.  **Resource Matrix (Grid):** A set of high-density data cards showing energy output, matter consumption, and stability indices.
3.  **Fleet Logistics Ledger (Table):** A detailed list of transport ships, their cargo, and destination coordinates.
4.  **System Health Terminal (Console):** A scrolling log of system events with color-coded severity.
5.  **Control Panel (Sidebar):** Interactive toggles for "Overclocking," "Containment," and "Emergency Venting."

**Animation Strategy:**
- **Container:** `staggerChildren` to sequence the appearance of the sidebar, the main core, the resource grid, and the footer.
- **Items:** `y: 20` to `y: 0` with a spring transition for a "lifting" effect.
- **Micro-interactions:** Hover-triggered glow effects, pulsing energy lines, and layout transitions when switching between "Sector Views."

**Technical Stack:**
- Next.js 14 (App Router)
- Framer Motion (for layout and entrance animations)
- Tailwind CSS (for the "Deep Space" aesthetic: dark backgrounds, neon accents, glassmorphism)
- Lucide React (for iconography)
- TypeScript (for strict typing of galactic data)
</thinking>

```tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, 
  ShieldAlert, 
  Cpu, 
  Globe, 
  Activity, 
  Layers, 
  ArrowUpRight, 
  Settings, 
  Terminal, 
  Database,
  Radio,
  Wind,
  AlertTriangle
} from 'lucide-react';

// --- Types ---
interface ResourceMetric {
  id: string;
  label: string;
  value: string;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
  color: string;
}

interface FleetShip {
  id: string;
  name: string;
  status: 'Transit' | 'Docked' | 'Mining';
  cargo: string;
  destination: string;
  eta: string;
}

// --- Mock Data ---
const METRICS: ResourceMetric[] = [
  { id: '1', label: 'Energy Output', value: '4.2 YottaWatts', trend: 'up', percentage: 88, color: 'text-cyan-400' },
  { id: '2', label: 'Matter Flux', value: '12.8 Tg/s', trend: 'down', percentage: 42, color: 'text-purple-400' },
  { id: '3', label: 'Core Stability', value: '99.98%', trend: 'stable', percentage: 99, color: 'text-emerald-400' },
  { id: '4', label: 'Thermal Load', value: '1.2M Kelvin', trend: 'up', percentage: 65, color: 'text-orange-400' },
];

const FLEET: FleetShip[] = [
  { id: 'S1', name: 'Void-Runner Alpha', status: 'Transit', cargo: 'He3 Isotopes', destination: 'Sector 7G', eta: '12.4 LY' },
  { id: 'S2', name: 'Titan-Hauler 09', status: 'Mining', cargo: 'Iron-Core', destination: 'Asteroid Belt B', eta: 'N/A' },
  { id: 'S3', name: 'Nebula-Scribe', status: 'Docked', cargo: 'Data-Cores', destination: 'Central Hub', eta: '0.0 LY' },
  { id: 'S4', name: 'Solar-Wisp', status: 'Transit', cargo: 'Plasma-Cells', destination: 'Outpost Omega', eta: '4.2 LY' },
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

// --- Sub-Components ---

const MetricCard = ({ metric }: { metric: ResourceMetric }) => (
  <motion.div 
    variants={itemVariants}
    whileHover={{ scale: 1.02, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
    className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 backdrop-blur-md flex flex-col gap-2 group cursor-pointer"
  >
    <div className="flex justify-between items-start">
      <span className="text-slate-400 text-xs font-mono uppercase tracking-wider">{metric.label}</span>
      <div className={`p-1 rounded ${metric.color} bg-current/10`}>
        {metric.trend === 'up' ? <ArrowUpRight size={12} /> : <Activity size={12} />}
      </div>
    </div>
    <div className={`text-2xl font-bold font-mono ${metric.color}`}>{metric.value}</div>
    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${metric.percentage}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className={`h-full ${metric.color.replace('text', 'bg')}`} 
      />
    </div>
  </motion.div>
);

const FleetRow = ({ ship }: { ship: FleetShip }) => (
  <motion.tr 
    variants={itemVariants}
    whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.3)' }}
    className="border-b border-slate-800/50 text-slate-300 font-mono text-sm"
  >
    <td className="p-3">{ship.name}</td>
    <td className="p-3">
      <span className={`px-2 py-1 rounded-full text-[10px] uppercase ${
        ship.status === 'Transit' ? 'bg-blue-500/20 text-blue-400' : 
        ship.status === 'Mining' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
      }`}>
        {ship.status}
      </span>
    </td>
    <td className="p-3 text-slate-500">{ship.cargo}</td>
    <td className="p-3">{ship.destination}</td>
    <td className="p-3 text-right font-bold text-cyan-400">{ship.eta}</td>
  </motion.tr>
);

const DysonCore = () => {
  return (
    <motion.div 
      variants={itemVariants}
      className="relative w-full aspect-square max-w-[500px] mx-auto flex items-center justify-center"
    >
      {/* Outer Ring */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-full h-full border-2 border-dashed border-cyan-500/30 rounded-full"
      />
      {/* Mid Ring */}
      <motion.div 
        animate={{ rotate: -360 }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute w-3/4 h-3/4 border-2 border-dotted border-purple-500/40 rounded-full"
      />
      {/* Inner Core */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 0 20px rgba(34, 211, 238, 0.4)", 
            "0 0 60px rgba(34, 211, 238, 0.8)", 
            "0 0 20px rgba(34, 211, 238, 0.4)"
          ]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="relative w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full z-10 flex items-center justify-center"
      >
        <Zap className="text-white" size={32} />
        {/* Orbiting Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              rotate: 360,
              scale: [1, 1.5, 1]
            }}
            transition={{ 
              rotate: { duration: 4 + i, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity }
            }}
            className="absolute w-full h-full"
          >
            <div className="w-2 h-2 bg-white rounded-full absolute top-0 left-1/2 -translate-x-1/2" />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

// --- Main Page ---

export default function NebulaOS() {
  const [activeSector, setActiveSector] = useState('Core');
  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const systemMessages = [
      "Initializing Dyson Sphere containment...",
      "Matter flux stabilized at 12.8 Tg/s",
      "Warning: Thermal load increasing in Sector 4",
      "Fleet S1 reporting He3 harvest success",
      "Quantum link established with Outpost Omega",
      "Core stability nominal: 99.98%",
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      setLogs(prev => [...prev.slice(-5), `[${new Date().toLocaleTimeString()}] ${systemMessages[i % systemMessages.length]}`]);
      i++;
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 font-sans selection:bg-cyan-500/30">
      {/* Background Ambient Glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-cyan-900/20 blur-[120px] rounded-full" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto grid grid-cols-12 gap-6"
      >
        {/* Header */}
        <motion.header 
          variants={itemVariants}
          className="col-span-12 flex justify-between items-end mb-4 border-b border-slate-800 pb-6"
        >
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3">
              <Globe className="text-cyan-400" />
              NEBULA<span className="text-cyan-400">OS</span>
            </h1>
            <p className="text-slate-500 font-mono text-sm">Galactic Resource Orchestrator // v4.0.2-stable</p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs font-mono text-slate-400">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              SYSTEMS ONLINE
            </div>
            <button className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan-500 transition-colors">
              <Settings size={18} />
            </button>
          </div>
        </motion.header>

        {/* Left Sidebar - Controls */}
        <motion.aside 
          variants={itemVariants}
          className="col-span-12 lg:col-span-3 flex flex-col gap-6"
        >
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Cpu size={14} /> Core Controls
            </h3>
            <div className="grid grid-cols-1 gap-3">
              {['Overclock', 'Containment', 'Vent Heat', 'Sync Nodes'].map((ctrl) => (
                <button 
                  key={ctrl}
                  className="group flex justify-between items-center p-3 rounded-lg bg-slate-800/50 border border-slate-700 hover:border-cyan-500 transition-all text-sm font-mono"
                >
                  <span>{ctrl}</span>
                  <div className="w-4 h-4 rounded-full border border-slate-600 group-hover:border-cyan-400 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl flex flex-col gap-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Terminal size={14} /> System Log
            </h3>
            <div className="font-mono text-[10px] space-y-2 h-40 overflow-hidden relative">
              <AnimatePresence mode="popLayout">
                {logs.map((log, idx) => (
                  <motion.div 
                    key={log}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="text-slate-400 border-l border-slate-700 pl-2"
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
              <div className="absolute bottom-0 left-0 w-full h-10 bg-gradient-to-t from-slate-900 to-transparent" />
            </div>
          </div>
        </motion.aside>

        {/* Center - Visualization */}
        <motion.main 
          variants={itemVariants}
          className="col-span-12 lg:col-span-6 flex flex-col gap-6"
        >
          <div className="p-8 rounded-3xl border border-slate-800 bg-slate-900/20 backdrop-blur-sm relative overflow-hidden group">
            <div className="absolute top-6 left-6 flex gap-2">
              {['Core', 'Sectors', 'Flux'].map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveSector(tab)}
                  className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
                    activeSector === tab ? 'bg-cyan-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <DysonCore />
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400"><Radio size={20} /></div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Signal Strength</div>
                  <div className="text-lg font-mono font-bold">94.2%</div>
                </div>
              </div>
              <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-4">
                <div className="p-2 rounded-lg bg-purple-500/20 text-purple-400"><Wind size={20} /></div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-bold">Solar Wind</div>
                  <div className="text-lg font-mono font-bold">12.1 km/s</div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {METRICS.map(m => <MetricCard key={m.id} metric={m} />)}
          </div>
        </motion.main>

        {/* Right Sidebar - Fleet & Data */}
        <motion.aside 
          variants={itemVariants}
          className="col-span-12 lg:col-span-3 flex flex-col gap-6"
        >
          <div className="p-5 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-xl flex flex-col gap-4 h-full">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
              <Database size={14} /> Fleet Logistics
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-[10px] text-slate-500 uppercase font-bold border-b border-slate-800">
                    <th className="p-3">Ship</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Cargo</th>
                    <th className="p-3">Dest</th>
                    <th className="p-3 text-right">ETA</th>
                  </tr>
                </thead>
                <tbody>
                  {FLEET.map(ship => <FleetRow key={ship.id} ship={ship} />)}
                </tbody>
              </table>
            </div>
            
            <div className="mt-auto p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex gap-3 items-start">
              <AlertTriangle className="text-amber-500 shrink-0" size={18} />
              <p className="text-[11px] text-amber-200/70 font-mono leading-relaxed">
                Warning: Sector 7G experiencing gravitational anomalies. Reroute fleet S1.
              </p>
            </div>
          </div>
        </motion.aside>
      </motion.div>

      {/* Footer Signature */}
      <footer className="mt-12 py-6 border-t border-slate-900 text-center">
        <p className="text-slate-600 text-[10px] font-mono uppercase tracking-widest">
          Designed by <span className="text-slate-400">Nagabhushana Raju S</span> // ORCMEGA Galactic Systems
        </p>
      </footer>
    </div>
  );
}
```