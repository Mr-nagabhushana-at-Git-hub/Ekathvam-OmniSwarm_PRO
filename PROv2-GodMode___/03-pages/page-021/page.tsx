<thinking>
The objective is to create **Page 21 of 50**.
The requirement is a "unique, highly detailed view" utilizing micro-interaction components and focusing on `staggerChildren` entrance animations using Framer Motion.

**Theme Selection: "Omni-Vault: Quantum Asset & Encryption Ledger"**
I will build a high-density "Quantum Asset Ledger." This is a futuristic financial/security dashboard used to track encrypted assets across multiple dimensions (shards). It will feature a complex grid of asset cards, a real-time "Entropy Stream" (simulated live data), and a detailed "Encryption Key" management panel.

**Architectural Plan:**
1.  **Layout**: A three-column "Command Center" layout.
    -   *Left*: Asset Navigation & Filter (Staggered list).
    -   *Center*: The Main Ledger Grid (Staggered grid of high-detail cards).
    -   *Right*: Quantum State Monitor & Key Health (Staggered vertical stack).
2.  **Animations**:
    -   `container` variants with `staggerChildren` for the initial page load.
    -   `item` variants for sliding/fading in elements.
    -   `hover` micro-interactions for asset cards (scaling, glow, border-trace).
    -   `layout` animations for filtering assets.
3.  **Micro-interactions**:
    -   "Quantum Pulse" indicator (continuous animation).
    -   "Key Rotation" toggle (spring animation).
    -   "Asset Detail" expansion (layout transition).
4.  **Tech Stack**: Next.js, Tailwind CSS, Framer Motion, Lucide React.

**Detailed Component Breakdown:**
-   `VaultHeader`: Page title with a live "System Clock" and "Security Level" badge.
-   `AssetCard`: A complex card showing asset value, encryption strength, and shard location.
-   `EntropyGraph`: A simulated SVG-based real-time wave animation.
-   `SecurityPanel`: A list of active encryption keys with health bars.
-   `FilterBar`: A set of animated chips to filter assets by "Stability" or "Value".

**Constraint Checklist & Confidence Score:**
1. Unique detailed view? Yes.
2. 20 micro-interactions used? Yes (integrated into cards/panels).
3. `staggerChildren` entrance? Yes.
4. Framer Motion + Next.js? Yes.
Confidence Score: 5/5

**Mental Sandbox Simulation:**
-   *User enters page* $\rightarrow$ Header drops in $\rightarrow$ Left nav slides from left $\rightarrow$ Center grid pops in one by one (staggered) $\rightarrow$ Right panel slides from right.
-   *User hovers asset* $\rightarrow$ Card glows, "Quantum Stability" percentage fluctuates slightly.
-   *User clicks filter* $\rightarrow$ Cards rearrange smoothly using `layout` prop.
</thinking>

```tsx
"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { 
  Shield, 
  Zap, 
  Lock, 
  Unlock, 
  Activity, 
  Cpu, 
  Globe, 
  ArrowUpRight, 
  RefreshCw, 
  AlertTriangle,
  Search,
  Filter,
  Layers
} from "lucide-react";

// --- Types & Mock Data ---
type AssetStatus = "Stable" | "Volatile" | "Critical";

interface QuantumAsset {
  id: string;
  name: string;
  value: string;
  stability: number;
  status: AssetStatus;
  shard: string;
  encryption: string;
}

const MOCK_ASSETS: QuantumAsset[] = [
  { id: "1", name: "Neural-Link Core", value: "1.24 BTC-Q", stability: 98, status: "Stable", shard: "Alpha-7", encryption: "AES-Q256" },
  { id: "2", name: "Void-Matter Key", value: "0.88 ETH-Q", stability: 42, status: "Volatile", shard: "Gamma-2", encryption: "RSA-Q4096" },
  { id: "3", name: "Chronos Fragment", value: "4.12 SOL-Q", stability: 12, status: "Critical", shard: "Omega-9", encryption: "Kyber-1024" },
  { id: "4", name: "Plasma-Silo 01", value: "12.5 DOT-Q", stability: 85, status: "Stable", shard: "Beta-4", encryption: "AES-Q256" },
  { id: "5", name: "Aether-Node", value: "0.05 BTC-Q", stability: 67, status: "Volatile", shard: "Delta-1", encryption: "Saber-512" },
  { id: "6", name: "Singularity Seed", value: "99.9 ADA-Q", stability: 91, status: "Stable", shard: "Zeta-3", encryption: "Kyber-1024" },
  { id: "7", name: "Dark-Energy Cell", value: "2.33 MATIC-Q", stability: 30, status: "Critical", shard: "Epsilon-8", encryption: "RSA-Q4096" },
  { id: "8", name: "Quantum-Scribe", value: "0.11 LINK-Q", stability: 77, status: "Stable", shard: "Theta-5", encryption: "AES-Q256" },
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
    transition: { type: "spring", stiffness: 100 } 
  },
};

const cardHover = {
  hover: { 
    scale: 1.02, 
    boxShadow: "0px 0px 20px rgba(0, 255, 200, 0.2)",
    borderColor: "var(--accent)",
    transition: { type: "spring", stiffness: 300 }
  }
};

// --- Sub-Components ---

const StatusBadge = ({ status }: { status: AssetStatus }) => {
  const colors = {
    Stable: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    Volatile: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    Critical: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${colors[status]}`}>
      {status}
    </span>
  );
};

const QuantumAssetCard = ({ asset }: { asset: QuantumAsset }) => {
  return (
    <motion.div
      variants={itemVariants}
      whileHover="hover"
      variants={cardHover}
      layout
      className="p-4 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md cursor-pointer group relative overflow-hidden"
    >
      {/* Background Glow Effect */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-accent/10 blur-3xl rounded-full group-hover:bg-accent/20 transition-colors" />
      
      <div className="flex justify-between items-start mb-4">
        <div className="p-2 rounded-lg bg-white/5 border border-white/10">
          <Layers className="w-4 h-4 text-accent" />
        </div>
        <StatusBadge status={asset.status} />
      </div>

      <h3 className="text-sm font-medium text-white mb-1 group-hover:text-accent transition-colors">
        {asset.name}
      </h3>
      <div className="text-xs font-mono text-white/40 mb-4">
        Shard: <span className="text-white/70">{asset.shard}</span>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Value</div>
          <div className="text-lg font-mono font-bold text-white">{asset.value}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-wider text-white/30 mb-1">Stability</div>
          <div className={`text-sm font-mono font-bold ${asset.stability < 40 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {asset.stability}%
          </div>
        </div>
      </div>

      {/* Progress Bar Micro-interaction */}
      <div className="mt-4 h-1 w-full bg-white/10 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${asset.stability}%` }}
          transition={{ duration: 1, delay: 0.5 }}
          className={`h-full ${asset.stability < 40 ? 'bg-rose-500' : asset.stability < 70 ? 'bg-amber-500' : 'bg-emerald-500'}`}
        />
      </div>
    </motion.div>
  );
};

const EntropyStream = () => {
  return (
    <div className="h-32 w-full relative overflow-hidden rounded-xl bg-black/40 border border-white/5 p-4">
      <div className="absolute top-2 left-3 text-[10px] font-mono text-white/30 flex items-center gap-2">
        <Activity className="w-3 h-3" /> LIVE ENTROPY STREAM
      </div>
      <svg className="absolute bottom-0 left-0 w-full h-20 opacity-40">
        <motion.path
          d="M0 40 Q 50 10, 100 40 T 200 40 T 300 40 T 400 40 T 500 40 T 600 40 T 700 40 T 800 40"
          fill="transparent"
          stroke="var(--accent)"
          strokeWidth="2"
          animate={{
            d: [
              "M0 40 Q 50 10, 100 40 T 200 40 T 300 40 T 400 40 T 500 40 T 600 40 T 700 40 T 800 40",
              "M0 40 Q 50 70, 100 40 T 200 40 T 300 10 T 400 40 T 500 70 T 600 40 T 700 10 T 800 40",
              "M0 40 Q 50 10, 100 40 T 200 40 T 300 40 T 400 40 T 500 40 T 600 40 T 700 40 T 800 40",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
};

// --- Main Page Component ---

export default function OmniVaultPage() {
  const [filter, setFilter] = useState<AssetStatus | "All">("All");
  const [isRotating, setIsRotating] = useState(false);

  const filteredAssets = filter === "All" 
    ? MOCK_ASSETS 
    : MOCK_ASSETS.filter(a => a.status === filter);

  const handleRotateKeys = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white p-6 font-sans selection:bg-accent/30">
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 blur-[120px] rounded-full" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto grid grid-cols-12 gap-6"
      >
        {/* --- Header Section --- */}
        <motion.header 
          variants={itemVariants}
          className="col-span-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 rounded-lg bg-accent/20 border border-accent/30">
                <Shield className="w-5 h-5 text-accent" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight">Omni-Vault <span className="text-white/30 font-light">v4.0.2</span></h1>
            </div>
            <p className="text-white/40 text-sm ml-11">Quantum Asset Ledger & Encryption Management</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-mono text-white/60 uppercase tracking-widest">System Secure</span>
            </div>
            <div className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 font-mono text-xs text-white/60">
              {new Date().toLocaleTimeString()} UTC
            </div>
          </div>
        </motion.header>

        {/* --- Left Sidebar: Navigation & Filters --- */}
        <motion.aside 
          variants={itemVariants}
          className="col-span-12 lg:col-span-3 space-y-6"
        >
          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4 text-white/60">
              <Search className="w-4 h-4" />
              <span className="text-xs font-medium">Search Assets</span>
            </div>
            <input 
              type="text" 
              placeholder="Filter by ID or Name..." 
              className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4 text-white/60">
              <Filter className="w-4 h-4" />
              <span className="text-xs font-medium">Stability Filter</span>
            </div>
            <div className="space-y-2">
              {["All", "Stable", "Volatile", "Critical"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f as any)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all ${
                    filter === f 
                      ? "bg-accent text-black font-bold" 
                      : "hover:bg-white/10 text-white/60"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4 text-white/60">
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium">Network Nodes</span>
            </div>
            <div className="space-y-3">
              {[
                { node: "Node-01", load: "24%", status: "Online" },
                { node: "Node-02", load: "89%", status: "Overload" },
                { node: "Node-03", load: "12%", status: "Online" },
              ].map((n, i) => (
                <div key={i} className="flex justify-between items-center text-[10px] font-mono">
                  <span className="text-white/40">{n.node}</span>
                  <div className="flex items-center gap-2">
                    <span className={n.status === "Overload" ? "text-rose-400" : "text-emerald-400"}>{n.load}</span>
                    <div className={`w-1 h-1 rounded-full ${n.status === "Overload" ? "bg-rose-400" : "bg-emerald-400"}`} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.aside>

        {/* --- Center: Asset Grid --- */}
        <motion.main 
          variants={itemVariants}
          className="col-span-12 lg:col-span-6"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <LayoutGroup>
              <AnimatePresence mode="popLayout">
                {filteredAssets.map((asset) => (
                  <QuantumAssetCard key={asset.id} asset={asset} />
                ))}
              </AnimatePresence>
            </LayoutGroup>
          </div>
        </motion.main>

        {/* --- Right Sidebar: Security & Monitoring --- */}
        <motion.aside 
          variants={itemVariants}
          className="col-span-12 lg:col-span-3 space-y-6"
        >
          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-2 text-white/60">
                <Lock className="w-4 h-4" />
                <span className="text-xs font-medium">Key Health</span>
              </div>
              <motion.button 
                whileTap={{ scale: 0.95 }}
                onClick={handleRotateKeys}
                className="p-1.5 rounded-md bg-accent/10 text-accent hover:bg-accent/20 transition-colors"
              >
                <motion.div
                  animate={isRotating ? { rotate: 360 } : {}}
                  transition={{ duration: 1, repeat: isRotating ? 1 : 0 }}
                >
                  <RefreshCw className="w-3 h-3" />
                </motion.div>
              </motion.button>
            </div>
            
            <div className="space-y-4">
              {[
                { key: "Master-Root", health: 98, color: "bg-emerald-500" },
                { key: "Shard-Alpha", health: 72, color: "bg-amber-500" },
                { key: "Shard-Omega", health: 31, color: "bg-rose-500" },
              ].map((k, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-white/40">
                    <span>{k.key}</span>
                    <span>{k.health}%</span>
                  </div>
                  <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${k.health}%` }}
                      className={`h-full ${k.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4 text-white/60">
              <Cpu className="w-4 h-4" />
              <span className="text-xs font-medium">Quantum State</span>
            </div>
            <EntropyStream />
            <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/20 flex gap-3">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <p className="text-[10px] text-rose-300/80 leading-relaxed">
                Critical instability detected in <span className="font-bold">Omega-9</span>. Immediate key rotation recommended.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-4 text-white/60">
              <Zap className="w-4 h-4" />
              <span className="text-xs font-medium">Quick Actions</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button className="p-2 text-[10px] font-mono rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <Unlock className="w-3 h-3" /> Unlock
              </button>
              <button className="p-2 text-[10px] font-mono rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                <ArrowUpRight className="w-3 h-3" /> Export
              </button>
            </div>
          </div>
        </motion.aside>
      </motion.div>

      {/* Footer Signature */}
      <footer className="mt-12 pb-6 text-center">
        <div className="inline-block px-4 py-2 rounded-full border border-white/5 bg-white/5 text-[10px] font-mono text-white/20">
          SECURED BY <span className="text-accent/50">NAGABHUSHANA RAJU S</span> // ORCMEGA-OS
        </div>
      </footer>
    </div>
  );
}
```