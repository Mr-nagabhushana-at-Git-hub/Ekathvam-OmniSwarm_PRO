<thinking>
The objective is to create **Page 34 of 50** of a high-fidelity, animated Next.js UI.
The requirement is a "unique, highly detailed view" utilizing micro-interaction components and focusing on `staggerChildren` entrance animations using Framer Motion.

**Theme Selection: "Nebula-OS: Galactic Resource Orchestrator"**
I will build a "Galactic Resource Orchestrator" dashboard. This is a high-density administrative view for managing interstellar mining colonies, energy grids, and fleet deployments. It's a "Sci-Fi Command Center" style interface.

**Key UI Elements:**
1.  **Resource Grid**: A set of high-density cards showing colony health, energy output, and mineral yield.
2.  **Fleet Deployment Map**: A stylized visual representation of ship movements (simulated with SVG/Framer Motion).
3.  **System Log**: A real-time streaming terminal showing "interstellar events".
4.  **Control Panel**: A set of micro-interaction toggles for "Shields", "Warp Drive", and "Mining Drills".

**Animation Strategy:**
- **Container**: `staggerChildren` to bring in the header, then the main grid, then the side panels.
- **Items**: `y: 20` to `y: 0` with a spring transition for a "pop-in" effect.
- **Micro-interactions**: Hover-based glow effects, layout transitions when switching colony views.

**Technical Stack:**
- Next.js (App Router)
- Framer Motion (for all animations)
- Tailwind CSS (for styling)
- Lucide React (for iconography)
- TypeScript (for strict typing)
</thinking>

```tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Activity, 
  Cpu, 
  Zap, 
  Shield, 
  Rocket, 
  AlertTriangle, 
  Globe, 
  Settings, 
  Terminal, 
  ChevronRight, 
  Database,
  Wifi,
  Battery
} from 'lucide-react';

// --- Types ---
interface Colony {
  id: string;
  name: string;
  status: 'Optimal' | 'Warning' | 'Critical';
  energy: number;
  minerals: number;
  population: string;
  coords: string;
}

const COLONIES: Colony[] = [
  { id: '1', name: 'Nova Prime', status: 'Optimal', energy: 94, minerals: 1200, population: '1.2M', coords: 'Sector 7G' },
  { id: '2', name: 'Xylos-4', status: 'Warning', energy: 42, minerals: 850, population: '450K', coords: 'Sector 2A' },
  { id: '3', name: 'Aetheria', status: 'Optimal', energy: 88, minerals: 3100, population: '2.1M', coords: 'Sector 9C' },
  { id: '4', name: 'Void Reach', status: 'Critical', energy: 12, minerals: 400, population: '12K', coords: 'Sector 0X' },
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
    transition: { type: 'spring', stiffness: 100, damping: 12 } 
  },
};

// --- Micro-Interaction Components ---

const StatusBadge = ({ status }: { status: Colony['status'] }) => {
  const colors = {
    Optimal: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    Warning: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
    Critical: 'bg-rose-500/20 text-rose-400 border-rose-500/50',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${colors[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};

const ResourceMetric = ({ icon: Icon, label, value, unit, color }: any) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
    <div className={`p-2 rounded-md ${color} bg-opacity-20`}>
      <Icon size={16} className="text-white/80 group-hover:scale-110 transition-transform" />
    </div>
    <div>
      <p className="text-[10px] text-white/40 uppercase tracking-wider">{label}</p>
      <p className="text-sm font-mono font-bold text-white">{value}<span className="text-[10px] ml-1 text-white/50">{unit}</span></p>
    </div>
  </div>
);

const ControlToggle = ({ label, active = false }: { label: string, active?: boolean }) => {
  const [isOn, setIsOn] = useState(active);
  return (
    <div 
      onClick={() => setIsOn(!isOn)}
      className="flex items-center justify-between p-3 cursor-pointer rounded-lg border border-white/10 bg-white/5 hover:border-accent/50 transition-all group"
    >
      <span className="text-xs font-mono text-white/70 group-hover:text-white transition-colors">{label}</span>
      <div className={`w-8 h-4 rounded-full relative transition-colors ${isOn ? 'bg-accent' : 'bg-white/20'}`}>
        <motion.div 
          animate={{ x: isOn ? 16 : 2 }}
          className="absolute top-1 w-2 h-2 bg-white rounded-full"
        />
      </div>
    </div>
  );
};

// --- Main Page Component ---

export default function NebulaOSPage() {
  const [logs, setLogs] = useState<string[]>([]);
  const [activeColony, setActiveColony] = useState<string>('1');

  useEffect(() => {
    const messages = [
      "Initializing Quantum Link...",
      "Syncing with Nova Prime...",
      "Warning: Energy dip in Sector 0X",
      "Mining drone 442 returned with Platinum",
      "Shields calibrated to 98.4%",
      "Incoming transmission from Aetheria",
    ];
    
    let i = 0;
    const interval = setInterval(() => {
      setLogs(prev => [...prev.slice(-5), `[${new Date().toLocaleTimeString()}] ${messages[i % messages.length]}`]);
      i++;
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6 font-sans selection:bg-accent/30">
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto grid grid-cols-12 gap-6"
      >
        {/* Header Section */}
        <motion.header 
          variants={itemVariants}
          className="col-span-12 flex items-center justify-between mb-4 border-b border-white/10 pb-6"
        >
          <div>
            <h1 className="text-3xl font-black tracking-tighter flex items-center gap-3">
              <Globe className="text-accent" />
              NEBULA <span className="text-accent">OS</span>
            </h1>
            <p className="text-white/40 text-xs font-mono mt-1">Galactic Resource Orchestrator // v4.0.2-stable</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden md:block">
              <p className="text-[10px] text-white/40 font-mono">SYSTEM UPTIME</p>
              <p className="text-sm font-mono font-bold">1,242:12:04</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 cursor-pointer transition-colors">
              <Settings size={18} />
            </div>
          </div>
        </motion.header>

        {/* Left Column: Colony Grid */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {COLONIES.map((colony) => (
            <motion.div 
              key={colony.id}
              whileHover={{ scale: 1.02 }}
              onClick={() => setActiveColony(colony.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden group ${
                activeColony === colony.id 
                ? 'bg-white/10 border-accent shadow-[0_0_20px_rgba(var(--accent-rgb),0.2)]' 
                : 'bg-white/5 border-white/10 hover:border-white/30'
              }`}
            >
              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-accent/30 rounded-tr-2xl" />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">{colony.name}</h3>
                  <p className="text-[10px] font-mono text-white/40">{colony.coords}</p>
                </div>
                <StatusBadge status={colony.status} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <ResourceMetric icon={Zap} label="Energy" value={colony.energy} unit="%" color="bg-yellow-500" />
                <ResourceMetric icon={Database} label="Minerals" value={colony.minerals} unit="t" color="bg-blue-500" />
              </div>

              <div className="mt-4 flex items-center justify-between text-[10px] font-mono text-white/40">
                <span className="flex items-center gap-1"><Activity size={10} /> Pop: {colony.population}</span>
                <span className="group-hover:text-accent transition-colors flex items-center gap-1">
                  VIEW DETAILS <ChevronRight size={10} />
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Right Column: Control & Logs */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          
          {/* Control Panel */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
              <Cpu size={14} /> System Controls
            </h4>
            <div className="grid grid-cols-1 gap-3">
              <ControlToggle label="Quantum Shielding" active={true} />
              <ControlToggle label="Warp Drive Sync" active={false} />
              <ControlToggle label="Deep Core Mining" active={true} />
              <ControlToggle label="Atmospheric Filter" active={true} />
            </div>
          </div>

          {/* Terminal Log */}
          <div className="p-6 rounded-2xl bg-black/40 border border-white/10 flex-1 flex flex-col">
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4 flex items-center gap-2">
              <Terminal size={14} /> Event Stream
            </h4>
            <div className="font-mono text-[11px] space-y-2 overflow-hidden flex-1">
              <AnimatePresence mode="popLayout">
                {logs.map((log, idx) => (
                  <motion.div 
                    key={log}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    className="text-white/60 border-l-2 border-accent/30 pl-2 py-1"
                  >
                    {log}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Quick Stats Footer */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <Wifi size={14} className="mx-auto mb-1 text-accent" />
              <p className="text-[10px] text-white/40">Link</p>
              <p className="text-xs font-bold">Stable</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <Battery size={14} className="mx-auto mb-1 text-accent" />
              <p className="text-[10px] text-white/40">Core</p>
              <p className="text-xs font-bold">88%</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
              <AlertTriangle size={14} className="mx-auto mb-1 text-rose-500" />
              <p className="text-[10px] text-white/40">Alerts</p>
              <p className="text-xs font-bold">02</p>
            </div>
          </div>

        </motion.div>
      </motion.div>

      {/* Footer Signature */}
      <footer className="mt-12 text-center border-t border-white/5 pt-6">
        <p className="text-[10px] font-mono text-white/20 uppercase tracking-[0.2em]">
          Designed by Nagabhushana Raju S // ORCMEGA Systems
        </p>
      </footer>

      <style jsx global>{`
        :root {
          --accent: #00f2ff;
          --accent-rgb: 0, 242, 255;
        }
        .text-accent { color: var(--accent); }
        .bg-accent { background-color: var(--accent); }
        .border-accent { border-color: var(--accent); }
      `}</style>
    </div>
  );
}
```