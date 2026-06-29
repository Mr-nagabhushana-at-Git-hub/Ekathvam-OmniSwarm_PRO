<thinking>
The objective is to create **Page 40 of 50** of a high-fidelity, animated Next.js UI.
The requirement is a "unique, highly detailed view" utilizing micro-interaction components and focusing on `staggerChildren` entrance animations using Framer Motion.

**Theme Selection: "Omni-Vault: Quantum Encryption & Key Shard Management"**
I will build a "Quantum Key Management System (KMS)". This is a high-security, high-density dashboard used by security architects to manage "Key Shards" (distributed secrets), monitor entropy levels, and manage the lifecycle of quantum-resistant encryption keys.

**Architectural Plan:**
1.  **Layout**: A "Command Center" style layout with a dark, high-contrast aesthetic.
2.  **Key Components**:
    *   **Entropy Monitor**: A real-time visualization of system randomness.
    *   **Shard Map**: A grid of distributed key shards across global regions.
    *   **Key Lifecycle Timeline**: A vertical progression of key rotation events.
    *   **Security Audit Feed**: A streaming log of access attempts.
3.  **Animations**:
    *   `staggerChildren` for the initial dashboard load.
    *   `layoutId` for switching between key details.
    *   `animatePresence` for shard status updates.
    *   Micro-interactions: Hover-glows, pulse effects for "active" shards, and slide-in panels.
4.  **Technical Stack**: Next.js, Tailwind CSS, Framer Motion, Lucide React.

**Detailed Component Breakdown**:
- `VaultHeader`: Top bar with system status and global security level.
- `EntropyGauge`: A custom SVG-based gauge that animates based on "randomness" levels.
- `ShardGrid`: A responsive grid of `ShardCard` components.
- `ShardCard`: Individual key fragment status with health indicators.
- `AuditLog`: A scrolling list of security events.
- `KeyDetailsPanel`: A slide-over panel for deep-diving into a specific key's metadata.

**Framer Motion Strategy**:
- `container`: `variants={{ visible: { transition: { staggerChildren: 0.1 } } }}`
- `item`: `variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}`
- `pulse`: Continuous animation for "Live" indicators.
</thinking>

```tsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { 
  Shield, 
  Key, 
  Zap, 
  Globe, 
  Lock, 
  Unlock, 
  AlertTriangle, 
  Activity, 
  RefreshCw, 
  Search,
  ChevronRight,
  Cpu,
  Database,
  Fingerprint
} from 'lucide-react';

// --- Types ---
interface Shard {
  id: string;
  region: string;
  status: 'healthy' | 'degraded' | 'offline';
  latency: number;
  entropy: number;
  lastSync: string;
}

interface AuditEvent {
  id: string;
  timestamp: string;
  action: string;
  user: string;
  status: 'success' | 'failed' | 'warning';
}

// --- Mock Data ---
const MOCK_SHARDS: Shard[] = [
  { id: 'SH-01', region: 'US-East (Virginia)', status: 'healthy', latency: 12, entropy: 99.8, lastSync: '2s ago' },
  { id: 'SH-02', region: 'EU-West (Ireland)', status: 'healthy', latency: 45, entropy: 98.2, lastSync: '5s ago' },
  { id: 'SH-03', region: 'AP-South (Mumbai)', status: 'degraded', latency: 180, entropy: 82.1, lastSync: '12s ago' },
  { id: 'SH-04', region: 'SA-East (São Paulo)', status: 'healthy', latency: 110, entropy: 97.5, lastSync: '1s ago' },
  { id: 'SH-05', region: 'US-West (Oregon)', status: 'offline', latency: 0, entropy: 0, lastSync: '1h ago' },
  { id: 'SH-06', region: 'EU-Central (Frankfurt)', status: 'healthy', latency: 32, entropy: 99.1, lastSync: '3s ago' },
  { id: 'SH-07', region: 'AP-North (Tokyo)', status: 'healthy', latency: 140, entropy: 96.4, lastSync: '8s ago' },
  { id: 'SH-08', region: 'AU-East (Sydney)', status: 'healthy', latency: 210, entropy: 98.9, lastSync: '15s ago' },
];

const MOCK_EVENTS: AuditEvent[] = [
  { id: 'EV-101', timestamp: '14:20:01', action: 'Key Rotation Initiated', user: 'admin_root', status: 'success' },
  { id: 'EV-102', timestamp: '14:21:15', action: 'Unauthorized Access Attempt', user: 'unknown_ip', status: 'failed' },
  { id: 'EV-103', timestamp: '14:22:40', action: 'Shard Sync Failure (SH-03)', user: 'system', status: 'warning' },
  { id: 'EV-104', timestamp: '14:25:10', action: 'Entropy Threshold Reached', user: 'system', status: 'success' },
  { id: 'EV-105', timestamp: '14:28:00', action: 'Policy Update: AES-GCM-256', user: 'sec_lead', status: 'success' },
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
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  visible: { 
    opacity: 1, 
    y: 0, 
    scale: 1,
    transition: { type: 'spring', stiffness: 100, damping: 15 } 
  },
};

// --- Sub-Components ---

const StatusBadge = ({ status }: { status: Shard['status'] }) => {
  const colors = {
    healthy: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    degraded: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    offline: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono border ${colors[status]}`}>
      {status.toUpperCase()}
    </span>
  );
};

const EntropyGauge = ({ value }: { value: number }) => {
  return (
    <div className="relative w-full h-32 flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 100 50">
        <path 
          d="M 10 40 A 40 40 0 0 1 90 40" 
          fill="none" 
          stroke="currentColor" 
          className="text-slate-800" 
          strokeWidth="8" 
          strokeLinecap="round" 
        />
        <motion.path 
          d="M 10 40 A 40 40 0 0 1 90 40" 
          fill="none" 
          stroke="url(#gradient)" 
          strokeWidth="8" 
          strokeLinecap="round" 
          initial={{ pathLength: 0 }}
          animate={{ pathLength: value / 100 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-2">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-mono font-bold text-white"
        >
          {value}%
        </motion.span>
        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Entropy</span>
      </div>
    </div>
  );
};

const ShardCard = ({ shard, onClick }: { shard: Shard, onClick: () => void }) => {
  return (
    <motion.div 
      variants={itemVariants}
      whileHover={{ scale: 1.02, backgroundColor: 'rgba(30, 41, 59, 0.8)' }}
      onClick={onClick}
      className="p-4 rounded-xl border border-slate-800 bg-slate-900/50 cursor-pointer group relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
        <Globe size={16} className="text-slate-400" />
      </div>
      
      <div className="flex justify-between items-start mb-4">
        <div>
          <h4 className="text-xs font-mono text-slate-500">{shard.id}</h4>
          <p className="text-sm font-medium text-slate-200 truncate w-32">{shard.region}</p>
        </div>
        <StatusBadge status={shard.status} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase">Latency</span>
          <span className="text-sm font-mono text-slate-300">{shard.latency}ms</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[10px] text-slate-500 uppercase">Entropy</span>
          <span className="text-sm font-mono text-slate-300">{shard.entropy}%</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-800 flex justify-between items-center">
        <span className="text-[10px] text-slate-600">Sync: {shard.lastSync}</span>
        <motion.div 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className={`w-1.5 h-1.5 rounded-full ${shard.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'}`}
        />
      </div>
    </motion.div>
  );
};

// --- Main Page Component ---

export default function OmniVaultPage() {
  const [selectedShard, setSelectedShard] = useState<Shard | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [entropy, setEntropy] = useState(98.4);

  // Simulate real-time entropy fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setEntropy(prev => Math.min(100, Math.max(80, prev + (Math.random() * 2 - 1))));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const filteredShards = MOCK_SHARDS.filter(s => 
    s.region.toLowerCase().includes(searchQuery.toLowerCase()) || 
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0f1a] text-slate-300 p-6 font-sans selection:bg-blue-500/30">
      {/* Background Ambient Glow */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
      </div>

      {/* Header Section */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"
      >
        <div>
          <div className="flex items-center gap-2 text-blue-400 mb-1">
            <Shield size={18} />
            <span className="text-xs font-mono tracking-tighter uppercase">Quantum Security Layer v4.0.2</span>
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Omni-Vault <span className="text-slate-500 font-light">KMS</span></h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono">SYSTEM_STABLE</span>
          </div>
          <button className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors">
            <RefreshCw size={18} />
          </button>
        </div>
      </motion.header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-12 gap-6"
      >
        {/* Left Column: System Health & Metrics */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-3 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md">
            <h3 className="text-sm font-semibold text-slate-400 mb-6 flex items-center gap-2">
              <Activity size={16} /> System Entropy
            </h3>
            <EntropyGauge value={entropy} />
            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Quantum Noise</span>
                <span className="text-slate-300 font-mono">1.24 THz</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Key Rotation</span>
                <span className="text-slate-300 font-mono">Every 4h</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-500">Active Shards</span>
                <span className="text-slate-300 font-mono">7 / 8</span>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md">
            <h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center gap-2">
              <Lock size={16} /> Security Policy
            </h3>
            <div className="space-y-3">
              {[
                { label: 'Multi-Sig Auth', status: true },
                { label: 'Hardware HSM', status: true },
                { label: 'Geo-Fencing', status: false },
                { label: 'Zero-Knowledge', status: true },
              ].map((policy, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30">
                  <span className="text-xs text-slate-400">{policy.label}</span>
                  {policy.status ? (
                    <div className="text-emerald-500"><Shield size={14} /></div>
                  ) : (
                    <div className="text-slate-600"><Unlock size={14} /></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Middle Column: Shard Grid */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-6 space-y-6">
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input 
                type="text" 
                placeholder="Search shards or regions..." 
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <Database size={18} />
              </button>
              <button className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <Cpu size={18} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredShards.map((shard) => (
              <ShardCard 
                key={shard.id} 
                shard={shard} 
                onClick={() => setSelectedShard(shard)} 
              />
            ))}
          </div>
        </motion.div>

        {/* Right Column: Audit Log */}
        <motion.div variants={itemVariants} className="col-span-12 lg:col-span-3 space-y-6">
          <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md h-full flex flex-col">
            <h3 className="text-sm font-semibold text-slate-400 mb-6 flex items-center gap-2">
              <Fingerprint size={16} /> Audit Trail
            </h3>
            <div className="space-y-6 overflow-y-auto max-h-[600px] pr-2 custom-scrollbar">
              {MOCK_EVENTS.map((event) => (
                <div key={event.id} className="relative pl-6 border-l-2 border-slate-800 group">
                  <div className={`absolute left-[-5px] top-1 w-2 h-2 rounded-full ${
                    event.status === 'success' ? 'bg-emerald-500' : 
                    event.status === 'failed' ? 'bg-rose-500' : 'bg-amber-500'
                  }`} />
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-mono text-slate-500">{event.timestamp}</span>
                    <span className={`text-[10px] uppercase font-bold ${
                      event.status === 'success' ? 'text-emerald-500' : 
                      event.status === 'failed' ? 'text-rose-500' : 'text-amber-500'
                    }`}>{event.status}</span>
                  </div>
                  <p className="text-xs text-slate-300 group-hover:text-white transition-colors">{event.action}</p>
                  <p className="text-[10px] text-slate-500 mt-1">User: {event.user}</p>
                </div>
              ))}
            </div>
            <button className="mt-auto pt-6 text-center text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center justify-center gap-1">
              View Full Archive <ChevronRight size={12} />
            </button>
          </div>
        </motion.div>
      </motion.div>

      {/* Detail Slide-over Panel */}
      <AnimatePresence>
        {selectedShard && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedShard(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-800 z-50 p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-white">Shard Details</h2>
                <button 
                  onClick={() => setSelectedShard(null)}
                  className="p-2 rounded-full hover:bg-slate-800 text-slate-400 transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-8">
                <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-800/50 border border-slate-700">
                  <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                    <Key size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase">Shard Identifier</p>
                    <p className="text-lg font-mono font-bold text-white">{selectedShard.id}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50">
                    <p className="text-xs text-slate-500 mb-1">Region</p>
                    <p className="text-sm text-slate-200">{selectedShard.region}</p>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-800 bg-slate-950/50">
                    <p className="text-xs text-slate-500 mb-1">Status</p>
                    <StatusBadge status={selectedShard.status} />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-400 flex items-center gap-2">
                    <Zap size={16} /> Performance Metrics
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: 'Round Trip Time', value: `${selectedShard.latency}ms`, color: 'text-blue-400' },
                      { label: 'Entropy Density', value: `${selectedShard.entropy}%`, color: 'text-purple-400' },
                      { label: 'Packet Loss', value: '0.002%', color: 'text-emerald-400' },
                      { label: 'Sync Offset', value: '14ms', color: 'text-slate-400' },
                    ].map((metric, i) => (
                      <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-slate-800/30 border border-slate-800/50">
                        <span className="text-xs text-slate-500">{metric.label}</span>
                        <span className={`text-xs font-mono font-bold ${metric.color}`}>{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-8 space-y-3">
                  <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all active:scale-95 flex items-center justify-center gap-2">
                    <RefreshCw size={16} /> Force Resync Shard
                  </button>
                  <button className="w-full py-3 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 transition-all active:scale-95 flex items-center justify-center gap-2">
                    <AlertTriangle size={16} /> Decommission Shard
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

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