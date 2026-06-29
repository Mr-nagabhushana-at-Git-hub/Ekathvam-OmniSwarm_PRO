<thinking>
The objective is to create **Page 18 of 50** of a high-fidelity, animated Next.js UI.
The specific requirement for Page 18 is a "unique, highly detailed view" utilizing 20 micro-interaction components and focusing on `staggerChildren` entrance animations using Framer Motion.

**Theme Selection: "Chronos-Nexus: Temporal Event Orchestrator"**
I will build a "Temporal Event Orchestrator". This is a high-density timeline and event management system for a futuristic project management or simulation tool. It will feature a complex "Event Stream" (vertical timeline), a "Quantum State" monitor, and a "Temporal Node" editor.

**Architectural Plan:**
1.  **Layout**: A three-column layout.
    -   Left: Navigation/Filter panel (Temporal Zones).
    -   Center: The main Event Stream (The "Nexus").
    -   Right: Node Inspector (Detailed properties of the selected event).
2.  **Animations**:
    -   `staggerChildren` for the initial load of the timeline nodes.
    -   `layout` animations for switching between event details.
    -   `whileHover` and `whileTap` for all interactive elements.
    -   Entrance animations for the side panels.
3.  **Micro-interactions**:
    -   Custom-animated sliders for "Time Scrubbing".
    -   Glowing status indicators (Pulse animations).
    -   Interactive "Node" connectors (SVG paths that animate on hover).
    -   Glassmorphism panels with backdrop-blur.
4.  **Technical Stack**: Next.js, Tailwind CSS, Framer Motion, Lucide React.

**Component Breakdown**:
-   `TemporalLayout`: The main wrapper.
-   `ZoneNavigator`: Left sidebar with staggered list items.
-   `EventNexus`: The central timeline with `staggerChildren` nodes.
-   `NodeInspector`: Right panel with detailed metrics and controls.
-   `QuantumMetric`: A small, highly animated data widget.
-   `TimeScrubber`: A custom range input with motion feedback.

**Detailed Animation Logic**:
-   `container`: `{ hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } }`
-   `item`: `{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }`
-   `layoutId`: Used for the "Active Node" highlight to slide smoothly between events.
</thinking>

```tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Clock, 
  Zap, 
  Shield, 
  Activity, 
  ChevronRight, 
  Settings, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowUpRight, 
  Cpu, 
  Layers, 
  AlertCircle,
  RefreshCw
} from 'lucide-react';

// --- Types ---
interface TemporalEvent {
  id: string;
  timestamp: string;
  title: string;
  status: 'stable' | 'flux' | 'critical';
  energy: number;
  category: 'Neural' | 'Quantum' | 'Physical';
  description: string;
  metrics: {
    latency: string;
    stability: string;
    load: string;
  };
}

// --- Mock Data ---
const MOCK_EVENTS: TemporalEvent[] = [
  {
    id: 'ev-1',
    timestamp: 'T-0.004s',
    title: 'Neural Sync Initiation',
    status: 'stable',
    energy: 42,
    category: 'Neural',
    description: 'Initial synchronization of the primary neural bridge. All nodes reporting nominal latency.',
    metrics: { latency: '1.2ms', stability: '99.8%', load: '12%' }
  },
  {
    id: 'ev-2',
    timestamp: 'T-0.012s',
    title: 'Quantum Flux Spike',
    status: 'flux',
    energy: 89,
    category: 'Quantum',
    description: 'Unexpected variance detected in the 4th dimension manifold. Corrective measures deployed.',
    metrics: { latency: '4.5ms', stability: '72.1%', load: '88%' }
  },
  {
    id: 'ev-3',
    timestamp: 'T-0.025s',
    title: 'Physical Layer Breach',
    status: 'critical',
    energy: 12,
    category: 'Physical',
    description: 'Containment field failure in Sector 7. Immediate evacuation of quantum assets required.',
    metrics: { latency: '12.1ms', stability: '31.4%', load: '94%' }
  },
  {
    id: 'ev-4',
    timestamp: 'T-0.041s',
    title: 'Memory Reconstitution',
    status: 'stable',
    energy: 67,
    category: 'Neural',
    description: 'Successful recovery of fragmented data packets from the void-state buffer.',
    metrics: { latency: '2.1ms', stability: '94.2%', load: '45%' }
  },
  {
    id: 'ev-5',
    timestamp: 'T-0.058s',
    title: 'Entanglement Loop',
    status: 'flux',
    energy: 55,
    category: 'Quantum',
    description: 'Recursive entanglement detected between Node A and Node B. Loop stabilization in progress.',
    metrics: { latency: '0.8ms', stability: '88.9%', load: '61%' }
  },
];

const ZONES = [
  { id: 'z1', name: 'Alpha Sector', color: 'text-blue-400', glow: 'shadow-blue-500/20' },
  { id: 'z2', name: 'Beta Void', color: 'text-purple-400', glow: 'shadow-purple-500/20' },
  { id: 'z3', name: 'Gamma Core', color: 'text-emerald-400', glow: 'shadow-emerald-500/20' },
  { id: 'z4', name: 'Delta Rim', color: 'text-amber-400', glow: 'shadow-amber-500/20' },
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: { 
    opacity: 1, 
    y: 0, 
    scale: 1, 
    transition: { type: 'spring', stiffness: 300, damping: 24 } 
  },
};

// --- Sub-Components ---

const StatusBadge = ({ status }: { status: TemporalEvent['status'] }) => {
  const config = {
    stable: { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', label: 'Stable' },
    flux: { color: 'bg-amber-500/10 text-amber-400 border-amber-500/20', label: 'Flux' },
    critical: { color: 'bg-red-500/10 text-red-400 border-red-500/20', label: 'Critical' },
  };
  const { color, label } = config[status];

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${color} flex items-center gap-1.5`}>
      <motion.div 
        animate={{ opacity: [0.4, 1, 0.4] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className={`w-1 h-1 rounded-full bg-current`} 
      />
      {label}
    </span>
  );
};

const QuantumMetric = ({ label, value, icon: Icon }: { label: string, value: string, icon: any }) => (
  <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3 group hover:bg-white/10 transition-colors cursor-default">
    <div className="p-2 rounded-lg bg-white/5 text-white/40 group-hover:text-white transition-colors">
      <Icon size={14} />
    </div>
    <div>
      <p className="text-[10px] text-white/40 uppercase tracking-wider font-medium">{label}</p>
      <p className="text-sm font-mono text-white/90">{value}</p>
    </div>
  </div>
);

// --- Main Page Component ---

export default function ChronosNexusPage() {
  const [selectedEvent, setSelectedEvent] = useState<TemporalEvent>(MOCK_EVENTS[0]);
  const [timeScale, setTimeScale] = useState(1.0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white selection:bg-blue-500/30 font-sans overflow-hidden flex">
      {/* --- Left Sidebar: Zone Navigator --- */}
      <motion.aside 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-72 border-r border-white/10 bg-[#0d0d10] flex flex-col"
      >
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <Clock size={18} className="text-white" />
          </div>
          <h1 className="font-bold tracking-tight text-lg">Chronos<span className="text-blue-500">Nexus</span></h1>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-6">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-4 px-2">Temporal Zones</p>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-2"
            >
              {ZONES.map((zone) => (
                <motion.div 
                  key={zone.id}
                  variants={itemVariants}
                  whileHover={{ x: 4 }}
                  className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all hover:bg-white/5 border border-transparent hover:border-white/10 ${zone.glow}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full bg-current ${zone.color}`} />
                    <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">{zone.name}</span>
                  </div>
                  <ChevronRight size={14} className="text-white/20 group-hover:text-white/50 transition-colors" />
                </motion.div>
              ))}
            </motion.div>
          </div>

          <div className="pt-6 border-t border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold mb-4 px-2">System Controls</p>
            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
                <Settings size={16} /> Configuration
              </button>
              <button className="w-full flex items-center gap-3 p-3 rounded-xl text-sm text-white/60 hover:text-white hover:bg-white/5 transition-all">
                <Shield size={16} /> Security Layer
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-white/5 bg-black/20">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[10px] text-white/40 font-mono">TIME_SCALE: {timeScale.toFixed(2)}x</span>
            <RefreshCw 
              size={12} 
              className={`text-blue-400 cursor-pointer hover:rotate-180 transition-transform duration-500 ${isRefreshing ? 'animate-spin' : ''}`} 
              onClick={handleRefresh}
            />
          </div>
          <input 
            type="range" 
            min="0.1" 
            max="5.0" 
            step="0.1" 
            value={timeScale} 
            onChange={(e) => setTimeScale(parseFloat(e.target.value))}
            className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
        </div>
      </motion.aside>

      {/* --- Center: Event Nexus --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-gradient-to-b from-[#0a0a0c] to-[#121218]">
        {/* Header */}
        <header className="h-20 border-b border-white/10 flex items-center justify-between px-8 z-10 bg-[#0a0a0c]/80 backdrop-blur-md">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative w-full">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
              <input 
                placeholder="Search temporal events..." 
                className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 ring-blue-500/20 transition-all"
              />
            </div>
            <button className="p-2 rounded-full bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors">
              <Filter size={16} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
              <Activity size={12} />
              <span>LIVE_STREAM: ACTIVE</span>
            </div>
          </div>
        </header>

        {/* Timeline Area */}
        <div className="flex-1 overflow-y-auto p-8 relative custom-scrollbar">
          {/* Background Grid Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-20" 
               style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} />
          
          <div className="max-w-3xl mx-auto relative">
            {/* Central Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-12"
            >
              {MOCK_EVENTS.map((event, idx) => (
                <motion.div 
                  key={event.id}
                  variants={itemVariants}
                  layout
                  onClick={() => setSelectedEvent(event)}
                  className={`relative pl-16 group cursor-pointer transition-all ${selectedEvent.id === event.id ? 'opacity-100' : 'opacity-60 hover:opacity-100'}`}
                >
                  {/* Timeline Node */}
                  <div className="absolute left-6 top-1 -translate-x-1/2 z-10">
                    <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                      selectedEvent.id === event.id 
                        ? 'bg-blue-500 border-blue-300 scale-125 shadow-[0_0_15px_rgba(59,130,246,0.5)]' 
                        : 'bg-[#0a0a0c] border-white/30 group-hover:border-white/60'
                    }`} />
                  </div>

                  {/* Event Card */}
                  <div className={`relative p-5 rounded-2xl border transition-all duration-300 ${
                    selectedEvent.id === event.id 
                      ? 'bg-white/10 border-blue-500/50 shadow-2xl shadow-blue-500/10' 
                      : 'bg-white/5 border-white/10 hover:bg-white/[0.08] hover:border-white/20'
                  }`}>
                    {selectedEvent.id === event.id && (
                      <motion.div 
                        layoutId="active-glow"
                        className="absolute -inset-px rounded-2xl bg-blue-500/20 blur-sm -z-10"
                      />
                    )}
                    
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-white/40">{event.timestamp}</span>
                        <StatusBadge status={event.status} />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-white/30">ENERGY: {event.energy}kW</span>
                        <MoreHorizontal size={14} className="text-white/30" />
                      </div>
                    </div>

                    <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                      {event.title}
                      {selectedEvent.id === event.id && <ArrowUpRight size={16} className="text-blue-400" />}
                    </h3>
                    <p className="text-sm text-white/50 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </main>

      {/* --- Right Sidebar: Node Inspector --- */}
      <motion.aside 
        initial={{ x: 300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className="w-96 border-l border-white/10 bg-[#0d0d10] flex flex-col"
      >
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h2 className="font-bold text-lg">Node Inspector</h2>
          <div className="p-2 rounded-lg bg-white/5 text-white/40 hover:text-white transition-colors cursor-pointer">
            <Settings size={16} />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div 
            key={selectedEvent.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 overflow-y-auto p-6 space-y-8"
          >
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                <div className="p-2 rounded-lg bg-blue-500 text-white">
                  {selectedEvent.category === 'Neural' && <Cpu size={18} />}
                  {selectedEvent.category === 'Quantum' && <Zap size={18} />}
                  {selectedEvent.category === 'Physical' && <Layers size={18} />}
                </div>
                <div>
                  <p className="text-[10px] text-blue-400 uppercase font-bold tracking-tighter">Category</p>
                  <p className="text-sm font-semibold">{selectedEvent.category} Node</p>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold">{selectedEvent.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="space-y-4">
              <p className="text-[10px] uppercase tracking-widest text-white/30 font-bold px-1">Telemetry Data</p>
              <div className="grid grid-cols-1 gap-3">
                <QuantumMetric 
                  label="Latency" 
                  value={selectedEvent.metrics.latency} 
                  icon={Activity} 
                />
                <QuantumMetric 
                  label="Stability" 
                  value={selectedEvent.metrics.stability} 
                  icon={Shield} 
                />
                <QuantumMetric 
                  label="System Load" 
                  value={selectedEvent.metrics.load} 
                  icon={Cpu} 
                />
              </div>
            </div>

            {/* Warning/Alert Box */}
            {selectedEvent.status === 'critical' && (
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex gap-3"
              >
                <AlertCircle className="text-red-400 shrink-0" size={20} />
                <p className="text-xs text-red-200/70 leading-relaxed">
                  Critical instability detected. Node requires immediate recalibration to prevent temporal collapse.
                </p>
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="pt-6 space-y-3">
              <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                Recalibrate Node
              </button>
              <button className="w-full py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-semibold text-sm border border-white/10 transition-all active:scale-95">
                Export Telemetry
              </button>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="p-6 border-t border-white/5 bg-black/40">
          <div className="flex items-center justify-between text-[10px] font-mono text-white/30">
            <span>NODE_ID: {selectedEvent.id.toUpperCase()}</span>
            <span>VER: 4.0.12-BETA</span>
          </div>
        </div>
      </motion.aside>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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