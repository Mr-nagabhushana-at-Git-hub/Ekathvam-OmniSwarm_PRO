<thinking>
The user wants "Page 13 of 50" of a highly animated Next.js UI.
The specific requirement for Page 13 is a "unique, highly detailed view" utilizing 20 micro-interaction components and focusing on `staggerChildren` entrance animations using Framer Motion.

**Plan:**
1.  **Theme Selection**: I will build a **"Cybernetic Asset Management System (CAMS)"**. This is a high-fidelity "Inventory & Resource" dashboard for a futuristic entity. It allows for a mix of data grids, status monitors, and detailed asset inspection views.
2.  **Micro-Interaction Suite**: I will implement a set of 20 micro-interactions integrated into the UI:
    -   *Hover Effects*: Glow borders, scale-up cards, magnetic buttons, shimmering text.
    -   *State Transitions*: Smooth layout shifts (layoutId), spring-loaded toggles, progress bar fills.
    -   *Feedback*: Haptic-like scale pulses on click, loading skeletons that shimmer, tooltips with spring entry.
    -   *Navigation*: Staggered list entries, sliding panels, fading overlays.
3.  **Animation Strategy**:
    -   `staggerChildren` for the main dashboard layout.
    -   `AnimatePresence` for switching between asset details.
    -   `layout` prop for seamless transitions between grid and detail views.
4.  **Technical Stack**: Next.js, Tailwind CSS, Framer Motion, Lucide React.
5.  **Architecture**:
    -   `Page13`: Main container.
    -   `AssetGrid`: The main list of assets with staggered entrance.
    -   `AssetDetailPanel`: A sliding side-panel for deep-dives.
    -   `MicroInteractionWrapper`: A set of reusable motion components.
</thinking>

```tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Cpu, 
  Shield, 
  Zap, 
  Activity, 
  Search, 
  Settings, 
  Bell, 
  ChevronRight, 
  Maximize2, 
  RefreshCw, 
  Lock, 
  Unlock, 
  AlertTriangle,
  Database,
  Globe,
  Layers
} from 'lucide-react';

// --- Types ---
interface Asset {
  id: string;
  name: string;
  type: 'Neural Core' | 'Quantum Link' | 'Shield Array' | 'Energy Cell';
  status: 'Optimal' | 'Degraded' | 'Critical' | 'Offline';
  load: number;
  health: number;
  lastSync: string;
  description: string;
}

const MOCK_ASSETS: Asset[] = [
  { id: 'NC-01', name: 'Aether-1 Core', type: 'Neural Core', status: 'Optimal', load: 42, health: 98, lastSync: '2ms ago', description: 'Primary cognitive processing unit for sector 7.' },
  { id: 'QL-04', name: 'Void-Link Alpha', type: 'Quantum Link', status: 'Degraded', load: 88, health: 64, lastSync: '14ms ago', description: 'Inter-dimensional data bridge. Experiencing packet loss.' },
  { id: 'SA-09', name: 'Aegis Perimeter', type: 'Shield Array', status: 'Optimal', load: 12, health: 100, lastSync: '5ms ago', description: 'External hull protection. All emitters active.' },
  { id: 'EC-12', name: 'Plasma Cell B', type: 'Energy Cell', status: 'Critical', load: 95, health: 21, lastSync: '1ms ago', description: 'Emergency power reserve. Immediate maintenance required.' },
  { id: 'NC-02', name: 'Chronos Core', type: 'Neural Core', status: 'Optimal', load: 31, health: 92, lastSync: '8ms ago', description: 'Temporal synchronization unit.' },
  { id: 'QL-07', name: 'Nebula Bridge', type: 'Quantum Link', status: 'Offline', load: 0, health: 0, lastSync: '1.2s ago', description: 'Deep space communication array. Signal lost.' },
  { id: 'SA-11', name: 'Ion Wall', type: 'Shield Array', status: 'Optimal', load: 25, health: 88, lastSync: '10ms ago', description: 'Secondary defense layer.' },
  { id: 'EC-01', name: 'Solar Siphon', type: 'Energy Cell', status: 'Optimal', load: 60, health: 95, lastSync: '3ms ago', description: 'Main energy collection array.' },
];

// --- Micro-Interaction Components ---

const MotionCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div 
    whileHover={{ y: -5, scale: 1.02, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)" }}
    whileTap={{ scale: 0.98 }}
    className={`bg-slate-900/50 backdrop-blur-md border border-slate-700/50 rounded-xl p-4 cursor-pointer transition-colors hover:border-cyan-500/50 ${className}`}
  >
    {children}
  </motion.div>
);

const StatusBadge = ({ status }: { status: Asset['status'] }) => {
  const colors = {
    Optimal: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Degraded: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    Critical: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Offline: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
  };
  return (
    <motion.span 
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${colors[status]}`}
    >
      {status}
    </motion.span>
  );
};

const ProgressBar = ({ value, color = "bg-cyan-500" }: { value: number, color?: string }) => (
  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
    <motion.div 
      initial={{ width: 0 }}
      animate={{ width: `${value}%` }}
      transition={{ duration: 1, ease: "easeOut" }}
      className={`h-full ${color}`}
    />
  </div>
);

const MagneticButton = ({ children, onClick }: { children: React.ReactNode, onClick?: () => void }) => (
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-700 transition-colors"
  >
    {children}
  </motion.button>
);

// --- Main Page Component ---

export default function CyberAssetPage() {
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const filteredAssets = MOCK_ASSETS.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-200 p-6 font-sans selection:bg-cyan-500/30">
      {/* Header Section */}
      <motion.header 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <motion.h1 
            className="text-3xl font-bold tracking-tighter text-white flex items-center gap-3"
            initial={{ x: -20 }}
            animate={{ x: 0 }}
          >
            <Layers className="text-cyan-500" />
            CAMS <span className="text-slate-500 font-light">v4.0.2</span>
          </motion.h1>
          <p className="text-slate-400 text-sm mt-1">Cybernetic Asset Management System // Sector 7</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-cyan-400 transition-colors" />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="bg-slate-900 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/50 transition-all w-64"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <MagneticButton onClick={handleRefresh}>
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </MagneticButton>
          <MagneticButton>
            <Bell className="w-4 h-4" />
          </MagneticButton>
          <MagneticButton>
            <Settings className="w-4 h-4" />
          </MagneticButton>
        </div>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Asset Grid */}
        <motion.div 
          className="lg:col-span-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredAssets.map((asset) => (
                <motion.div 
                  key={asset.id} 
                  variants={itemVariants} 
                  layoutId={`card-${asset.id}`}
                >
                  <MotionCard 
                    onClick={() => setSelectedAsset(asset)}
                    className={selectedAsset?.id === asset.id ? "border-cyan-500 ring-1 ring-cyan-500/50" : ""}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="p-2 bg-slate-800 rounded-lg text-cyan-400">
                        {asset.type === 'Neural Core' && <Cpu size={20} />}
                        {asset.type === 'Quantum Link' && <Globe size={20} />}
                        {asset.type === 'Shield Array' && <Shield size={20} />}
                        {asset.type === 'Energy Cell' && <Zap size={20} />}
                      </div>
                      <StatusBadge status={asset.status} />
                    </div>
                    
                    <h3 className="font-semibold text-white mb-1">{asset.name}</h3>
                    <p className="text-xs text-slate-500 mb-4">{asset.id} • {asset.type}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-400 mb-1">
                          <span>System Load</span>
                          <span>{asset.load}%</span>
                        </div>
                        <ProgressBar value={asset.load} color={asset.load > 80 ? 'bg-rose-500' : 'bg-cyan-500'} />
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] uppercase tracking-widest text-slate-400 mb-1">
                          <span>Integrity</span>
                          <span>{asset.health}%</span>
                        </div>
                        <ProgressBar value={asset.health} color={asset.health < 40 ? 'bg-rose-500' : 'bg-emerald-500'} />
                      </div>
                    </div>
                  </MotionCard>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Detail Panel */}
        <div className="lg:col-span-4">
          <AnimatePresence mode="wait">
            {selectedAsset ? (
              <motion.div
                key="detail-panel"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 rounded-2xl p-6 sticky top-6"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-white">Asset Details</h2>
                  <MagneticButton onClick={() => setSelectedAsset(null)}>
                    <Maximize2 className="w-4 h-4" />
                  </MagneticButton>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                    <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-lg">
                      {selectedAsset.type === 'Neural Core' && <Cpu size={24} />}
                      {selectedAsset.type === 'Quantum Link' && <Globe size={24} />}
                      {selectedAsset.type === 'Shield Array' && <Shield size={24} />}
                      {selectedAsset.type === 'Energy Cell' && <Zap size={24} />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{selectedAsset.name}</h3>
                      <p className="text-sm text-slate-400">{selectedAsset.id}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <p className="text-[10px] uppercase text-slate-500 mb-1">Status</p>
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                          selectedAsset.status === 'Optimal' ? 'bg-emerald-500' : 
                          selectedAsset.status === 'Degraded' ? 'bg-amber-500' : 'bg-rose-500'
                        }`} />
                        <span className="text-sm font-medium">{selectedAsset.status}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-slate-800/30 rounded-lg border border-slate-700/50">
                      <p className="text-[10px] uppercase text-slate-500 mb-1">Last Sync</p>
                      <span className="text-sm font-medium">{selectedAsset.lastSync}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase text-slate-500 mb-2">Technical Description</p>
                    <p className="text-sm text-slate-300 leading-relaxed bg-slate-950/50 p-3 rounded-lg border border-slate-800">
                      {selectedAsset.description}
                    </p>
                  </div>

                  <div className="space-y-3 pt-4">
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={16} />
                      Re-calibrate System
                    </motion.button>
                    <motion.button 
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <Lock size={16} />
                      Lock Asset
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="empty-panel"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-slate-800 rounded-2xl text-slate-600"
              >
                <div className="p-4 bg-slate-900 rounded-full mb-4">
                  <Activity size={32} />
                </div>
                <p className="text-sm font-medium">Select an asset from the grid to view detailed telemetry and control systems.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Status Bar */}
      <motion.footer 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-md border-t border-slate-800 px-6 py-2 flex items-center justify-between text-[10px] uppercase tracking-widest text-slate-500"
      >
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span>System Online</span>
          </div>
          <div className="flex items-center gap-2">
            <Database size={12} />
            <span>DB: Connected</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <span>Latency: 14ms</span>
          <span>Uptime: 1,242h 12m</span>
          <span className="text-cyan-500 font-bold">Auth: Admin_Root</span>
        </div>
      </motion.footer>

      {/* Global Background Effects */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>
    </div>
  );
}
```