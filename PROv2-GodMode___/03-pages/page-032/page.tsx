<thinking>
The objective is to create **Page 32 of 50** of a high-fidelity, animated Next.js UI.
The requirement is a "unique, highly detailed view" utilizing micro-interaction components and focusing on `staggerChildren` entrance animations using Framer Motion.

**Theme Selection: "Chronos-Vault: Temporal Asset Management & Audit Ledger"**
I will build a "Temporal Asset Management" view. This is a high-density financial/security dashboard used for tracking high-value digital assets across multiple time-locked vaults. It's a "Cyber-Bank" style interface with a heavy focus on audit trails, security clearances, and asset state transitions.

**Key UI Elements:**
1.  **Vault Grid**: A set of "Vault" cards showing asset health, lock status, and current value.
2.  **Temporal Ledger**: A high-density list of transactions with "time-travel" scrubbing capabilities.
3.  **Security Clearance Matrix**: A visual representation of who has access to which vault.
4.  **Asset Distribution Radar**: A custom SVG-based visualization of asset allocation.
5.  **Action Command Center**: A floating micro-interaction panel for executing vault operations.

**Animation Strategy:**
- **Container**: `staggerChildren` to bring in the layout pieces sequentially.
- **Cards**: `scale` and `opacity` fade-ins.
- **Ledger Rows**: Slide-in from the right with a slight bounce.
- **Micro-interactions**: Hover-triggered glow effects, layout transitions using `layoutId` for detail views.

**Technical Stack:**
- Next.js 14 (App Router)
- Framer Motion (for all animations)
- Tailwind CSS (for styling)
- Lucide React (for iconography)
- TypeScript (for strict typing)
</thinking>

```tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Unlock, 
  Clock, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Zap, 
  Activity,
  Key,
  Eye,
  AlertTriangle
} from 'lucide-react';

// --- Types ---
interface Vault {
  id: string;
  name: string;
  status: 'Locked' | 'Unlocked' | 'Pending';
  value: string;
  change: number;
  securityLevel: number;
  lastAccessed: string;
}

interface LedgerEntry {
  id: string;
  asset: string;
  action: 'Deposit' | 'Withdrawal' | 'Transfer';
  amount: string;
  timestamp: string;
  status: 'Confirmed' | 'Pending' | 'Flagged';
  operator: string;
}

// --- Mock Data ---
const VAULTS: Vault[] = [
  { id: 'v1', name: 'Omega Prime', status: 'Locked', value: '1,240.50 ETH', change: 2.4, securityLevel: 5, lastAccessed: '2m ago' },
  { id: 'v2', name: 'Siren-7', status: 'Unlocked', value: '45,000 BTC', change: -1.2, securityLevel: 4, lastAccessed: '14m ago' },
  { id: 'v3', name: 'Void-Core', status: 'Pending', value: '890,000 USDC', change: 0.0, securityLevel: 5, lastAccessed: '1h ago' },
  { id: 'v4', name: 'Aether-Link', status: 'Locked', value: '12,400 SOL', change: 15.8, securityLevel: 3, lastAccessed: '5h ago' },
];

const LEDGER: LedgerEntry[] = [
  { id: 'l1', asset: 'ETH', action: 'Deposit', amount: '12.5', timestamp: '10:42:01', status: 'Confirmed', operator: 'Admin_01' },
  { id: 'l2', asset: 'BTC', action: 'Withdrawal', amount: '0.45', timestamp: '10:38:12', status: 'Confirmed', operator: 'System_Auto' },
  { id: 'l3', asset: 'USDC', action: 'Transfer', amount: '50,000', timestamp: '10:30:00', status: 'Flagged', operator: 'User_X9' },
  { id: 'l4', asset: 'SOL', action: 'Deposit', amount: '1,200', timestamp: '09:15:44', status: 'Pending', operator: 'Admin_02' },
  { id: 'l5', asset: 'ETH', action: 'Transfer', amount: '2.1', timestamp: '08:00:12', status: 'Confirmed', operator: 'Admin_01' },
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

// --- Components ---

const VaultCard = ({ vault }: { vault: Vault }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      variants={itemVariants}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 hover:border-indigo-500/50 transition-colors cursor-pointer overflow-hidden"
    >
      {/* Background Glow */}
      <AnimatePresence>
        {isHovered && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/10 blur-3xl rounded-full"
          />
        )}
      </AnimatePresence>

      <div className="flex justify-between items-start mb-6">
        <div className="p-2 rounded-lg bg-zinc-800 text-indigo-400 group-hover:text-indigo-300 transition-colors">
          {vault.status === 'Locked' ? <Lock size={20} /> : <Unlock size={20} />}
        </div>
        <div className="flex items-center gap-1 text-xs font-mono text-zinc-500">
          <Shield size={12} />
          <span>LVL {vault.securityLevel}</span>
        </div>
      </div>

      <h3 className="text-zinc-400 text-sm font-medium mb-1">{vault.name}</h3>
      <div className="text-2xl font-bold text-white mb-4 font-mono">{vault.value}</div>

      <div className="flex justify-between items-center">
        <div className={`flex items-center gap-1 text-xs font-medium ${vault.change >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
          {vault.change >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownLeft size={14} />}
          {Math.abs(vault.change)}%
        </div>
        <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-wider">
          Last: {vault.lastAccessed}
        </div>
      </div>
    </motion.div>
  );
};

const LedgerRow = ({ entry }: { entry: LedgerEntry }) => {
  return (
    <motion.tr 
      variants={itemVariants}
      whileHover={{ backgroundColor: 'rgba(24, 24, 27, 0.8)', x: 5 }}
      className="border-b border-zinc-800/50 text-sm group transition-colors"
    >
      <td className="py-4 px-4 font-mono text-zinc-500">{entry.timestamp}</td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500" />
          <span className="text-zinc-200 font-medium">{entry.asset}</span>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
          entry.action === 'Deposit' ? 'bg-emerald-500/10 text-emerald-400' : 
          entry.action === 'Withdrawal' ? 'bg-rose-500/10 text-rose-400' : 'bg-blue-500/10 text-blue-400'
        }`}>
          {entry.action}
        </span>
      </td>
      <td className="py-4 px-4 font-mono text-white">{entry.amount}</td>
      <td className="py-4 px-4">
        <span className={`text-xs ${
          entry.status === 'Confirmed' ? 'text-zinc-400' : 
          entry.status === 'Pending' ? 'text-amber-400' : 'text-rose-500 font-bold'
        }`}>
          {entry.status}
        </span>
      </td>
      <td className="py-4 px-4 text-zinc-500 font-mono text-xs">{entry.operator}</td>
      <td className="py-4 px-4 text-right">
        <button className="p-1 text-zinc-600 hover:text-white transition-colors">
          <MoreHorizontal size={16} />
        </button>
      </td>
    </motion.tr>
  );
};

export default function ChronosVaultPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-black text-zinc-300 p-6 font-sans selection:bg-indigo-500/30">
      {/* Header Section */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10"
      >
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Clock size={24} />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Chronos Vault</h1>
          </div>
          <p className="text-zinc-500 text-sm max-w-md">
            Temporal Asset Management System. Monitoring 4 active vaults across 12 quantum shards.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
            <input 
              type="text" 
              placeholder="Search assets..." 
              className="bg-zinc-900 border border-zinc-800 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500 transition-all w-64"
            />
          </div>
          <button className="p-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 hover:text-white transition-colors">
            <Filter size={20} />
          </button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full text-sm font-semibold transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20">
            <Zap size={16} />
            Execute Transfer
          </button>
        </div>
      </motion.header>

      {/* Main Content Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-12 gap-6"
      >
        {/* Left Column: Vaults & Stats */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-4">
            {VAULTS.map(vault => (
              <VaultCard key={vault.id} vault={vault} />
            ))}
          </motion.div>

          <motion.div 
            variants={itemVariants}
            className="p-6 rounded-2xl bg-zinc-900/30 border border-zinc-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Activity size={16} className="text-indigo-400" />
                System Health
              </h3>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">STABLE</span>
            </div>
            
            <div className="space-y-4">
              {[
                { label: 'Latency', value: '12ms', color: 'bg-indigo-500' },
                { label: 'Throughput', value: '4.2 GB/s', color: 'bg-blue-500' },
                { label: 'Sync Rate', value: '99.9%', color: 'bg-emerald-500' },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-zinc-500">{stat.label}</span>
                    <span className="text-zinc-300 font-mono">{stat.value}</span>
                  </div>
                  <div className="h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '70%' }}
                      transition={{ duration: 1, delay: 0.5 + (i * 0.2) }}
                      className={`h-full ${stat.color}`} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right Column: Ledger & Details */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <motion.div 
            variants={itemVariants}
            className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden"
          >
            <div className="p-6 border-b border-zinc-800 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="text-lg font-bold text-white">Temporal Ledger</h3>
                <div className="flex bg-black p-1 rounded-lg border border-zinc-800">
                  {['overview', 'audit', 'security'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 text-xs rounded-md transition-all ${
                        activeTab === tab ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                LIVE FEED
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-xs font-mono text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
                    <th className="py-4 px-4 font-medium">Timestamp</th>
                    <th className="py-4 px-4 font-medium">Asset</th>
                    <th className="py-4 px-4 font-medium">Action</th>
                    <th className="py-4 px-4 font-medium">Amount</th>
                    <th className="py-4 px-4 font-medium">Status</th>
                    <th className="py-4 px-4 font-medium">Operator</th>
                    <th className="py-4 px-4 font-medium text-right"></th>
                  </tr>
                </thead>
                <motion.tbody 
                  initial="hidden"
                  animate="visible"
                  variants={containerVariants}
                >
                  {LEDGER.map(entry => (
                    <LedgerRow key={entry.id} entry={entry} />
                  ))}
                </motion.tbody>
              </table>
            </div>
          </motion.div>

          {/* Bottom Detail Panel */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center gap-4 group hover:border-indigo-500/50 transition-all cursor-pointer">
              <div className="p-3 bg-zinc-800 rounded-xl text-indigo-400 group-hover:scale-110 transition-transform">
                <Key size={20} />
              </div>
              <div>
                <div className="text-xs text-zinc-500">Access Keys</div>
                <div className="text-sm font-bold text-white">4 Active / 2 Rotated</div>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center gap-4 group hover:border-indigo-500/50 transition-all cursor-pointer">
              <div className="p-3 bg-zinc-800 rounded-xl text-amber-400 group-hover:scale-110 transition-transform">
                <AlertTriangle size={20} />
              </div>
              <div>
                <div className="text-xs text-zinc-500">Security Alerts</div>
                <div className="text-sm font-bold text-white">1 Flagged Transaction</div>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-zinc-900/50 border border-zinc-800 flex items-center gap-4 group hover:border-indigo-500/50 transition-all cursor-pointer">
              <div className="p-3 bg-zinc-800 rounded-xl text-emerald-400 group-hover:scale-110 transition-transform">
                <Eye size={20} />
              </div>
              <div>
                <div className="text-xs text-zinc-500">Audit Logs</div>
                <div className="text-sm font-bold text-white">View Full History</div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Command Center (Micro-interaction) */}
      <motion.div 
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: 'spring' }}
        className="fixed bottom-8 right-8"
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
          <button className="relative p-4 bg-black border border-zinc-800 rounded-full text-white shadow-2xl hover:scale-110 transition-transform">
            <Zap size={28} className="text-indigo-400" />
          </button>
          
          {/* Tooltip/Menu */}
          <div className="absolute bottom-full right-0 mb-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all translate-y-2 group-hover:translate-y-0">
            <div className="bg-zinc-900 border border-zinc-800 p-2 rounded-2xl shadow-2xl w-48">
              <div className="p-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest border-b border-zinc-800 mb-2">Quick Actions</div>
              <button className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2">
                <Lock size={14} /> Lock All Vaults
              </button>
              <button className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2">
                <Unlock size={14} /> Emergency Unlock
              </button>
              <button className="w-full text-left px-3 py-2 text-xs text-zinc-300 hover:bg-zinc-800 rounded-lg transition-colors flex items-center gap-2">
                <Activity size={14} /> Run Audit Scan
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
```