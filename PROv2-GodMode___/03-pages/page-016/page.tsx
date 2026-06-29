<thinking>
The objective is to create **Page 16 of 50** of a high-fidelity, animated Next.js UI.
The specific requirement for Page 16 is a "unique, highly detailed view" utilizing 20 micro-interaction components and focusing on `staggerChildren` entrance animations using Framer Motion.

**Theme Selection: "Omni-Vault: Quantum Asset Ledger"**
I will build a high-density "Quantum Asset Ledger". This is a financial/resource management view for a futuristic entity. It will feature a complex grid of assets, real-time "quantum flux" indicators, a detailed inspection panel, and a series of micro-interactions for managing high-value digital assets.

**Architectural Plan:**
1.  **Layout**: A three-column architecture.
    - *Left*: Asset Categories & Filters (Collapsible/Animated).
    - *Center*: The Quantum Grid (Virtual-like list of assets with staggered entrance).
    - *Right*: Asset Detail Inspector (Slide-in panel with deep-dive metrics).
2.  **Framer Motion Strategy**:
    - `variants` for `staggerChildren` to create a "waterfall" loading effect for the asset cards.
    - `layoutId` for seamless transitions between the grid view and the detailed inspector.
    - `AnimatePresence` for smooth mounting/unmounting of the detail panel.
3.  **Micro-Interactions (The 20 Components)**:
    - *Hover Effects*: Glow borders, scale-up cards, magnetic buttons.
    - *State Changes*: Toggle switches for "Quantum Locking", progress bars for "Syncing", pulsing status dots.
    - *Feedback*: Haptic-like scale animations on click, tooltip fades, shimmering loading states.
    - *Navigation*: Tab sliding underlines, accordion expansions.
4.  **Technical Stack**: Next.js, Tailwind CSS, Framer Motion, Lucide React.

**Detailed Component Breakdown**:
- `VaultHeader`: Animated title with a "scanning" line effect.
- `AssetGrid`: The main container using `staggerChildren`.
- `AssetCard`: Individual items with hover-triggered "data-leak" animations.
- `QuantumMetric`: A small, animated sparkline/gauge component.
- `InspectorPanel`: A high-detail view with nested staggered animations for metadata.
- `ActionToolbar`: A floating set of tools with magnetic attraction.

**Constraints Check**:
- Pixel-perfect? Yes, using a strict dark-mode palette with accent glows.
- Responsive? Yes, grid adjusts from 1 to 3 columns.
- Performance? Using `memo` and optimized Framer Motion transitions.
- Accessibility? Semantic HTML and ARIA labels for the complex grid.
</thinking>

```tsx
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Shield, 
  Zap, 
  Cpu, 
  Database, 
  Lock, 
  Unlock, 
  ArrowRight, 
  Search, 
  Filter, 
  MoreVertical, 
  Activity, 
  Layers, 
  Globe, 
  RefreshCw,
  ChevronRight,
  AlertCircle
} from 'lucide-react';

// --- Types & Mock Data ---
type AssetStatus = 'stable' | 'fluctuating' | 'critical' | 'locked';

interface QuantumAsset {
  id: string;
  name: string;
  type: 'Neural-Link' | 'Data-Shard' | 'Core-Node' | 'Void-Key';
  value: string;
  status: AssetStatus;
  flux: number; // 0 to 100
  lastSync: string;
  securityLevel: number;
}

const MOCK_ASSETS: QuantumAsset[] = [
  { id: 'QA-001', name: 'Aether Core', type: 'Core-Node', value: '1.24 BTC-Q', status: 'stable', flux: 12, lastSync: '2ms ago', securityLevel: 5 },
  { id: 'QA-002', name: 'Neural Mesh', type: 'Neural-Link', value: '0.88 ETH-Q', status: 'fluctuating', flux: 45, lastSync: '14ms ago', securityLevel: 3 },
  { id: 'QA-003', name: 'Void Fragment', type: 'Void-Key', value: '500 SOL-Q', status: 'critical', flux: 89, lastSync: '1s ago', securityLevel: 1 },
  { id: 'QA-004', name: 'Chronos Shard', type: 'Data-Shard', value: '2.11 BTC-Q', status: 'locked', flux: 0, lastSync: '1h ago', securityLevel: 5 },
  { id: 'QA-005', name: 'Soma Link', type: 'Neural-Link', value: '0.45 ETH-Q', status: 'stable', flux: 5, lastSync: '5ms ago', securityLevel: 4 },
  { id: 'QA-006', name: 'Omega Node', type: 'Core-Node', value: '10.0 BTC-Q', status: 'fluctuating', flux: 32, lastSync: '12ms ago', securityLevel: 5 },
  { id: 'QA-007', name: 'Ghost Archive', type: 'Data-Shard', value: '1.12 ETH-Q', status: 'stable', flux: 18, lastSync: '8ms ago', securityLevel: 2 },
  { id: 'QA-008', name: 'Nebula Key', type: 'Void-Key', value: '250 SOL-Q', status: 'critical', flux: 77, lastSync: '2s ago', securityLevel: 1 },
  { id: 'QA-009', name: 'Psi-Buffer', type: 'Neural-Link', value: '0.12 ETH-Q', status: 'stable', flux: 2, lastSync: '1ms ago', securityLevel: 3 },
  { id: 'QA-010', name: 'Titan Core', type: 'Core-Node', value: '5.5 BTC-Q', status: 'locked', flux: 0, lastSync: '12h ago', securityLevel: 5 },
  { id: 'QA-011', name: 'Echo Shard', type: 'Data-Shard', value: '0.99 ETH-Q', status: 'fluctuating', flux: 56, lastSync: '4ms ago', securityLevel: 4 },
  { id: 'QA-012', name: 'Zenith Key', type: 'Void-Key', value: '1000 SOL-Q', status: 'stable', flux: 11, lastSync: '10ms ago', securityLevel: 5 },
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
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 } 
  },
};

const panelVariants = {
  hidden: { x: '100%' },
  visible: { 
    x: 0, 
    transition: { type: 'spring', damping: 25, stiffness: 200 } 
  },
  exit: { x: '100%', transition: { ease: 'easeInOut', duration: 0.3 } }
};

// --- Micro-Interaction Components ---

const StatusBadge = ({ status }: { status: AssetStatus }) => {
  const config = {
    stable: { color: 'text-emerald-400 bg-emerald-400/10', label: 'STABLE', glow: 'shadow-[0_0_8px_rgba(52,211,153,0.3)]' },
    fluctuating: { color: 'text-amber-400 bg-amber-400/10', label: 'FLUX', glow: 'shadow-[0_0_8px_rgba(251,191,36,0.3)]' },
    critical: { color: 'text-rose-400 bg-rose-400/10', label: 'CRIT', glow: 'shadow-[0_0_8px_rgba(244,63,94,0.3)]' },
    locked: { color: 'text-slate-400 bg-slate-400/10', label: 'LOCKED', glow: '' },
  };

  const { color, label, glow } = config[status];

  return (
    <div className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${color} ${glow} flex items-center gap-1.5`}>
      <motion.div 
        animate={{ opacity: [0.4, 1, 0.4] }} 
        transition={{ repeat: Infinity, duration: 2 }}
        className="w-1 h-1 rounded-full bg-current" 
      />
      {label}
    </div>
  );
};

const FluxGauge = ({ value }: { value: number }) => (
  <div className="flex items-center gap-2 w-full max-w-[100px]">
    <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${value}%` }}
        className={`h-full ${value > 70 ? 'bg-rose-500' : value > 30 ? 'bg-amber-500' : 'bg-emerald-500'}`}
      />
    </div>
    <span className="text-[10px] font-mono text-slate-500">{value}%</span>
  </div>
);

const AssetCard = ({ asset, onClick }: { asset: QuantumAsset, onClick: () => void }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="group relative p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 cursor-pointer transition-colors overflow-hidden"
    >
      {/* Background Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/0 via-transparent to-indigo-500/0 group-hover:from-indigo-500/5 group-hover:to-purple-500/5 transition-all duration-500" />
      
      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div className="p-2 rounded-lg bg-slate-800 text-indigo-400 group-hover:text-white group-hover:bg-indigo-600 transition-all duration-300">
            {asset.type === 'Core-Node' && <Cpu size={18} />}
            {asset.type === 'Neural-Link' && <Zap size={18} />}
            {asset.type === 'Data-Shard' && <Database size={18} />}
            {asset.type === 'Void-Key' && <Shield size={18} />}
          </div>
          <StatusBadge status={asset.status} />
        </div>

        <div>
          <h3 className="text-sm font-medium text-slate-200 group-hover:text-white transition-colors">{asset.name}</h3>
          <p className="text-[10px] font-mono text-slate-500">{asset.id}</p>
        </div>

        <div className="flex items-center justify-between mt-2">
          <div className="text-xs font-mono text-indigo-300">{asset.value}</div>
          <FluxGauge value={asset.flux} />
        </div>
      </div>
    </motion.div>
  );
};

// --- Main Page Component ---

export default function QuantumVaultPage() {
  const [selectedAsset, setSelectedAsset] = useState<QuantumAsset | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const filteredAssets = useMemo(() => {
    return MOCK_ASSETS.filter(a => 
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      a.id.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-slate-300 font-sans selection:bg-indigo-500/30 overflow-hidden flex">
      
      {/* Left Sidebar: Navigation & Filters */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-64 border-r border-slate-800/60 bg-slate-900/20 backdrop-blur-xl p-6 flex flex-col gap-8 hidden lg:flex"
      >
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
            <Layers size={18} />
          </div>
          <span className="font-bold text-slate-100 tracking-tight">Omni-Vault</span>
        </div>

        <nav className="flex flex-col gap-1">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 px-2">Main Menu</p>
          {[
            { icon: Globe, label: 'Global Ledger', active: true },
            { icon: Shield, label: 'Security Hub', active: false },
            { icon: Activity, label: 'Flux Monitor', active: false },
            { icon: Database, label: 'Archive', active: false },
          ].map((item) => (
            <motion.div
              key={item.label}
              whileHover={{ x: 4 }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-all ${
                item.active ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              }`}
            >
              <item.icon size={16} />
              <span className="text-sm font-medium">{item.label}</span>
              {item.active && <motion.div layoutId="nav-indicator" className="ml-auto w-1 h-1 rounded-full bg-indigo-400" />}
            </motion.div>
          ))}
        </nav>

        <div className="mt-auto p-4 rounded-xl bg-indigo-500/5 border border-indigo-500/10">
          <div className="flex items-center gap-2 text-indigo-400 mb-2">
            <AlertCircle size={14} />
            <span className="text-[10px] font-bold uppercase">System Alert</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Quantum instability detected in Sector 7. Please lock critical assets.
          </p>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        
        {/* Header */}
        <header className="h-20 border-b border-slate-800/60 flex items-center justify-between px-8 backdrop-blur-md z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-full max-w-md group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={16} />
              <input 
                type="text" 
                placeholder="Search quantum assets..." 
                className="w-full bg-slate-900/50 border border-slate-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-full border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
            >
              <Filter size={18} />
            </motion.button>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-600/20"
            >
              <RefreshCw size={16} />
              Sync Vault
            </motion.button>
          </div>
        </header>

        {/* Asset Grid */}
        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-white tracking-tight">Quantum Ledger</h1>
                <p className="text-slate-500 text-sm mt-1">Managing {filteredAssets.length} active neural assets across 4 dimensions.</p>
              </div>
              <div className="flex gap-2">
                <div className="px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
                  LATENCY: 1.2ms
                </div>
                <div className="px-3 py-1 rounded-md bg-slate-800 border border-slate-700 text-[10px] font-mono text-slate-400">
                  UPTIME: 99.99%
                </div>
              </div>
            </div>

            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
            >
              {filteredAssets.map((asset) => (
                <AssetCard 
                  key={asset.id} 
                  asset={asset} 
                  onClick={() => setSelectedAsset(asset)} 
                />
              ))}
            </motion.div>

            {filteredAssets.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-slate-600">
                <Database size={48} className="mb-4 opacity-20" />
                <p>No assets found matching your query.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Right Inspector Panel */}
      <AnimatePresence>
        {selectedAsset && (
          <motion.div
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-[450px] border-l border-slate-800 bg-slate-900/80 backdrop-blur-2xl z-20 flex flex-col shadow-2xl"
          >
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
                  {selectedAsset.type === 'Core-Node' && <Cpu size={20} />}
                  {selectedAsset.type === 'Neural-Link' && <Zap size={20} />}
                  {selectedAsset.type === 'Data-Shard' && <Database size={20} />}
                  {selectedAsset.type === 'Void-Key' && <Shield size={20} />}
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white leading-tight">{selectedAsset.name}</h2>
                  <p className="text-xs font-mono text-slate-500">{selectedAsset.id}</p>
                </div>
              </div>
              <motion.button 
                whileHover={{ rotate: 90 }}
                onClick={() => setSelectedAsset(null)}
                className="p-2 rounded-full hover:bg-slate-800 text-slate-500 transition-all"
              >
                <MoreVertical size={20} />
              </motion.button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {/* Metric Grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Current Value', value: selectedAsset.value, icon: Zap, color: 'text-amber-400' },
                  { label: 'Security Level', value: `${selectedAsset.securityLevel}/5`, icon: Lock, color: 'text-emerald-400' },
                  { label: 'Quantum Flux', value: `${selectedAsset.flux}%`, icon: Activity, color: 'text-rose-400' },
                  { label: 'Last Sync', value: selectedAsset.lastSync, icon: RefreshCw, color: 'text-indigo-400' },
                ].map((metric, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + (i * 0.05) }}
                    key={metric.label} 
                    className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <metric.icon size={14} className={metric.color} />
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{metric.label}</span>
                    </div>
                    <div className="text-lg font-mono font-bold text-slate-200">{metric.value}</div>
                  </motion.div>
                ))}
              </div>

              {/* Detailed Analysis Section */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Layers size={14} />
                  Neural Topology Analysis
                </h3>
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Stability Index</span>
                    <span className="text-indigo-400 font-mono">0.9982 λ</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '99.8%' }}
                      className="h-full bg-indigo-500" 
                    />
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">Entropy Level</span>
                    <span className="text-rose-400 font-mono">0.0012 ξ</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '1.2%' }}
                      className="h-full bg-rose-500" 
                    />
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="space-y-3">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  <Unlock size={16} />
                  Unlock Asset
                </motion.button>
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl bg-slate-800 text-slate-300 font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 hover:bg-slate-700 transition-colors"
                >
                  <ArrowRight size={16} />
                  Transfer to Cold Storage
                </motion.button>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 bg-slate-900/50">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>ENCRYPTION: AES-Q-512</span>
                <span>NODE: 0x4F2...A91</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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