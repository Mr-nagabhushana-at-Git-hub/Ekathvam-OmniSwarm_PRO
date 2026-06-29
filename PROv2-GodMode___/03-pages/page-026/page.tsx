<thinking>
The objective is to create **Page 26 of 50** of a high-fidelity, animated Next.js UI.
The requirement is a "unique, highly detailed view" utilizing 20 micro-interaction components and focusing on `staggerChildren` entrance animations using Framer Motion.

**Theme Selection: "Omni-Vault: Quantum Asset & Security Ledger"**
I will build a high-density "Security Ledger" dashboard. This view will act as a command center for managing encrypted assets, monitoring real-time security breaches, and auditing access logs. It's a mix of a financial ledger and a cybersecurity SOC (Security Operations Center) dashboard.

**Architectural Plan:**
1.  **Layout**: A multi-pane "Glassmorphism" layout.
    -   **Left Sidebar**: Asset Categories (Quantum, Bio-metric, Neural, Physical).
    -   **Center Main**: The "Ledger Stream" (a high-density list of transactions/accesses).
    -   **Right Panel**: "Asset Detail" (deep dive into a selected asset with health metrics).
    -   **Top Bar**: Global Security Status (Threat Level, System Integrity, Active Nodes).

2.  **Micro-Interactions (Integrating the 20 components logic):**
    -   **Hover-Glow Cards**: Assets that glow on hover.
    -   **Animated Progress Rings**: For "Integrity" and "Encryption Strength".
    -   **Pulse Indicators**: For "Live" security threats.
    -   **Slide-over Panels**: For detailed audit logs.
    -   **Magnetic Buttons**: For critical actions (e.g., "Lock All Assets").
    -   **Skeleton Loaders**: For initial data fetch simulation.
    -   **Spring-loaded Tabs**: For switching between "Ledger", "Map", and "Audit".
    -   **Number Tickers**: For real-time value updates.
    -   **Particle Background**: Subtle floating nodes in the background.
    -   **Custom Scrollbars**: Neon-themed thin scrollbars.
    -   **Tooltip Popovers**: Detailed metadata on hover.
    -   **Toggle Switches**: For "Stealth Mode" or "Auto-Lock".
    -   **Badge Animations**: Pulsing "Critical" or "Secure" badges.
    -   **Input Focus Glow**: Neon borders on search.
    -   **Card Flip/Expand**: Expanding asset details.
    -   **Loading Spinners**: Custom geometric loaders.
    -   **Toast Notifications**: For security alerts.
    -   **Drag-and-Drop Handles**: For reordering priority assets.
    -   **Modal Overlays**: For "Confirm Destruction" actions.
    -   **Breadcrumb Transitions**: Smooth path updates.

3.  **Framer Motion Strategy:**
    -   **Container**: `variants` with `staggerChildren: 0.1`.
    -   **Items**: `initial={{ opacity: 0, y: 20 }}`, `animate={{ opacity: 1, y: 0 }}`.
    -   **Layout Transitions**: `layout` prop for smooth resizing of panels.
    -   **AnimatePresence**: For switching between asset details.

4.  **Technical Stack**: Next.js, Tailwind CSS, Framer Motion, Lucide React, TypeScript.
</thinking>

```tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Activity, 
  Zap, 
  Search, 
  Bell, 
  Settings, 
  ChevronRight, 
  AlertTriangle, 
  Eye, 
  EyeOff, 
  MoreVertical, 
  ArrowUpRight, 
  Database, 
  Cpu, 
  Globe, 
  Fingerprint 
} from 'lucide-react';

// --- Types ---
type AssetStatus = 'Secure' | 'Warning' | 'Critical' | 'Locked';
type AssetType = 'Quantum' | 'Neural' | 'Biometric' | 'Physical';

interface Asset {
  id: string;
  name: string;
  type: AssetType;
  value: string;
  status: AssetStatus;
  integrity: number;
  lastAccessed: string;
  location: string;
}

// --- Mock Data ---
const MOCK_ASSETS: Asset[] = [
  { id: 'Q-01', name: 'Neural Core Alpha', type: 'Neural', value: '1.2 PB', status: 'Secure', integrity: 98, lastAccessed: '2m ago', location: 'Silo-7' },
  { id: 'Q-02', name: 'Quantum Key-Set', type: 'Quantum', value: '256-bit', status: 'Warning', integrity: 72, lastAccessed: '15m ago', location: 'Orbit-1' },
  { id: 'Q-03', name: 'Bio-Metric Hash', type: 'Biometric', value: '4.2 GB', status: 'Secure', integrity: 100, lastAccessed: '1h ago', location: 'Vault-A' },
  { id: 'Q-04', name: 'Physical Ledger', type: 'Physical', value: 'Hard-Copy', status: 'Critical', integrity: 45, lastAccessed: '5m ago', location: 'Silo-2' },
  { id: 'Q-05', name: 'Synapse Bridge', type: 'Neural', value: '800 TB', status: 'Locked', integrity: 91, lastAccessed: '1d ago', location: 'Silo-7' },
  { id: 'Q-06', name: 'Void-Sleeve', type: 'Quantum', value: 'Unknown', status: 'Secure', integrity: 88, lastAccessed: '12m ago', location: 'Orbit-4' },
];

// --- Animation Variants ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
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
    transition: { type: 'spring', stiffness: 300, damping: 24 } 
  },
};

// --- Micro-Components ---

const StatusBadge = ({ status }: { status: AssetStatus }) => {
  const colors = {
    Secure: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
    Warning: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
    Critical: 'bg-rose-500/20 text-rose-400 border-rose-500/50',
    Locked: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${colors[status]} flex items-center gap-1 w-fit`}>
      <span className={`w-1 h-1 rounded-full animate-pulse ${status === 'Secure' ? 'bg-emerald-400' : status === 'Warning' ? 'bg-amber-400' : 'bg-rose-400'}`} />
      {status}
    </span>
  );
};

const IntegrityRing = ({ value }: { value: number }) => {
  const radius = 18;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center w-10 h-10">
      <svg className="w-full h-full transform -rotate-90">
        <circle cx="20" cy="20" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" className="text-slate-800" />
        <motion.circle 
          cx="20" cy="20" r={radius} stroke="currentColor" strokeWidth="3" fill="transparent" 
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={value > 80 ? "text-emerald-400" : value > 60 ? "text-amber-400" : "text-rose-400"}
        />
      </svg>
      <span className="absolute text-[8px] font-mono">{value}%</span>
    </div>
  );
};

export default function OmniVaultPage() {
  const [selectedId, setSelectedId] = useState<string>(MOCK_ASSETS[0].id);
  const [isStealthMode, setIsStealthMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedAsset = useMemo(() => 
    MOCK_ASSETS.find(a => a.id === selectedId) || MOCK_ASSETS[0], 
    [selectedId]
  );

  const filteredAssets = MOCK_ASSETS.filter(a => 
    a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen w-full flex overflow-hidden font-sans transition-colors duration-700 ${isStealthMode ? 'bg-black text-slate-500' : 'bg-[#0a0a0c] text-slate-200'}`}>
      
      {/* Background Ambient Effect */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-500/10 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay" />
      </div>

      {/* Left Sidebar: Navigation */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r border-slate-800/50 bg-black/40 backdrop-blur-xl flex flex-col z-10"
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.5)]">
            <Shield size={18} className="text-white" />
          </div>
          <h1 className="font-bold tracking-tighter text-lg">OMNI<span className="text-indigo-500">VAULT</span></h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {['Overview', 'Quantum Ledger', 'Neural Map', 'Audit Logs', 'Security Keys'].map((item, i) => (
            <motion.div
              key={item}
              whileHover={{ x: 4, backgroundColor: 'rgba(255,255,255,0.05)' }}
              className={`px-3 py-2 rounded-md cursor-pointer text-sm font-medium transition-colors ${i === 1 ? 'text-indigo-400 bg-indigo-500/10' : 'text-slate-400 hover:text-slate-200'}`}
            >
              {item}
            </motion.div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800/50 space-y-4">
          <div className="flex items-center justify-between text-xs font-mono text-slate-500">
            <span>STEALTH MODE</span>
            <button 
              onClick={() => setIsStealthMode(!isStealthMode)}
              className={`w-8 h-4 rounded-full relative transition-colors ${isStealthMode ? 'bg-indigo-600' : 'bg-slate-700'}`}
            >
              <motion.div 
                animate={{ x: isStealthMode ? 16 : 2 }}
                className="absolute top-1 w-2 h-2 bg-white rounded-full" 
              />
            </button>
          </div>
          <div className="flex items-center gap-3 p-2 rounded-lg bg-slate-900/50 border border-slate-800">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500" />
            <div className="flex-1 overflow-hidden">
              <p className="text-xs font-bold truncate">Admin_Root</p>
              <p className="text-[10px] text-slate-500 truncate">Level 5 Clearance</p>
            </div>
            <Settings size={14} className="text-slate-500 cursor-pointer hover:text-white" />
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10">
        
        {/* Top Header */}
        <header className="h-16 border-b border-slate-800/50 bg-black/20 backdrop-blur-md flex items-center justify-between px-8">
          <div className="flex items-center gap-4 w-1/3">
            <div className="relative w-full max-w-xs">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search assets, hashes, or nodes..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-800 rounded-full py-1.5 pl-9 pr-4 text-xs focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px] font-mono">
              <Activity size={12} className="animate-pulse" />
              THREAT LEVEL: ELEVATED
            </div>
            <div className="relative cursor-pointer group">
              <Bell size={18} className="text-slate-400 group-hover:text-white transition-colors" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-indigo-500 rounded-full border-2 border-black" />
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-12 gap-8"
          >
            
            {/* Left Column: Asset Ledger */}
            <div className="col-span-7 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight">Quantum Ledger</h2>
                  <p className="text-slate-500 text-sm">Real-time asset synchronization across 12 nodes.</p>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 rounded-md text-xs font-medium transition-colors">Filter</button>
                  <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-md text-xs font-medium transition-colors shadow-lg shadow-indigo-600/20">Export CSV</button>
                </div>
              </div>

              <div className="bg-black/40 border border-slate-800/50 rounded-2xl overflow-hidden backdrop-blur-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-slate-500 text-[10px] uppercase tracking-widest border-b border-slate-800/50">
                      <th className="px-6 py-4 font-medium">Asset ID</th>
                      <th className="px-6 py-4 font-medium">Name</th>
                      <th className="px-6 py-4 font-medium">Status</th>
                      <th className="px-6 py-4 font-medium">Integrity</th>
                      <th className="px-6 py-4 font-medium text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {filteredAssets.map((asset) => (
                        <motion.tr 
                          key={asset.id}
                          layout
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit={{ opacity: 0, scale: 0.9 }}
                          onClick={() => setSelectedId(asset.id)}
                          className={`group cursor-pointer transition-colors border-b border-slate-800/30 ${selectedId === asset.id ? 'bg-indigo-500/10' : 'hover:bg-white/[0.02]'}`}
                        >
                          <td className="px-6 py-4 font-mono text-xs text-slate-400">{asset.id}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 transition-colors">
                                {asset.type === 'Quantum' && <Zap size={14} />}
                                {asset.type === 'Neural' && <Cpu size={14} />}
                                {asset.type === 'Biometric' && <Fingerprint size={14} />}
                                {asset.type === 'Physical' && <Database size={14} />}
                              </div>
                              <span className="text-sm font-medium">{asset.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4"><StatusBadge status={asset.status} /></td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <IntegrityRing value={asset.integrity} />
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button className="p-1.5 rounded-md hover:bg-slate-700 text-slate-500 hover:text-white transition-all">
                              <MoreVertical size={14} />
                            </button>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Asset Detail Panel */}
            <div className="col-span-5">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={selectedId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-slate-900/40 border border-slate-800/50 rounded-3xl p-8 backdrop-blur-xl h-full relative overflow-hidden"
                >
                  {/* Decorative Background Element */}
                  <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full" />
                  
                  <div className="relative z-10 space-y-8">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-indigo-400 text-xs font-mono mb-2">
                          <Globe size={12} />
                          <span>NODE: {selectedAsset.location}</span>
                        </div>
                        <h3 className="text-3xl font-bold">{selectedAsset.name}</h3>
                        <p className="text-slate-500 text-sm">Asset ID: {selectedAsset.id} • {selectedAsset.type} Class</p>
                      </div>
                      <div className="p-3 bg-slate-800 rounded-2xl border border-slate-700 shadow-xl">
                        <Lock size={24} className={selectedAsset.status === 'Locked' ? 'text-indigo-400' : 'text-slate-500'} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Current Value</p>
                        <p className="text-xl font-mono font-bold text-indigo-400">{selectedAsset.value}</p>
                      </div>
                      <div className="p-4 rounded-2xl bg-black/40 border border-slate-800 space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest">Last Access</p>
                        <p className="text-xl font-mono font-bold">{selectedAsset.lastAccessed}</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Encryption Strength</span>
                        <span className="font-mono text-emerald-400">AES-Q-512</span>
                      </div>
                      <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '92%' }}
                          className="h-full bg-gradient-to-r from-indigo-600 to-emerald-500" 
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Security Actions</p>
                      <div className="grid grid-cols-2 gap-3">
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium transition-colors border border-slate-700"
                        >
                          <Unlock size={14} /> Unlock Asset
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex items-center justify-center gap-2 p-3 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 text-xs font-medium transition-colors border border-rose-500/30"
                        >
                          <AlertTriangle size={14} /> Purge Data
                        </motion.button>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-800/50">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Access Log</h4>
                        <ArrowUpRight size={14} className="text-slate-500 cursor-pointer hover:text-white" />
                      </div>
                      <div className="space-y-3">
                        {[
                          { user: 'Sys_Admin', action: 'Read', time: '2m ago', status: 'Success' },
                          { user: 'Neural_Link', action: 'Sync', time: '1h ago', status: 'Success' },
                          { user: 'Unknown_Ext', action: 'Attempt', time: '4h ago', status: 'Denied' },
                        ].map((log, i) => (
                          <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-black/20 border border-slate-800/50 text-[11px]">
                            <div className="flex items-center gap-3">
                              <span className="font-mono text-indigo-400">{log.user}</span>
                              <span className="text-slate-500">{log.action}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="text-slate-600">{log.time}</span>
                              <span className={log.status === 'Denied' ? 'text-rose-500' : 'text-emerald-500'}>{log.status}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </main>

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
          background: #4f46e5;
        }
      `}</style>
    </div>
  );
}
```