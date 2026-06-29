// components/SpeedHUD.tsx
"use client";

import React, { useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Zap, Activity, Timer, Gauge, ChevronRight } from "lucide-react";
import { VelocityGauge } from "./ui/VelocityGauge";
import { TelemetryCard } from "./ui/TelemetryCard";

export interface TelemetryMetrics {
  ttft: number; 
  tps: number;  
  totalTokens: number;
  loading: boolean;
  active: boolean;
}

interface SpeedHUDProps {
  cerebras: TelemetryMetrics;
  gpu: TelemetryMetrics;
}

export const SpeedHUD: React.FC<SpeedHUDProps> = ({ cerebras, gpu }) => {
  const hasRace = useMemo(() => cerebras.tps > 0 && gpu.tps > 0, [cerebras.tps, gpu.tps]);
  const speedup = useMemo(() => 
    hasRace ? (cerebras.tps / gpu.tps).toFixed(1) : null, 
    [hasRace, cerebras.tps, gpu.tps]
  );

  // Calculate race progress percentage based on total tokens
  const maxTokens = Math.max(cerebras.totalTokens, gpu.totalTokens, 1);
  const cerebrasProgress = (cerebras.totalTokens / maxTokens) * 100;
  const gpuProgress = (gpu.totalTokens / maxTokens) * 100;

  return (
    <div className="w-full space-y-6 p-1" role="region" aria-label="Performance Telemetry">
      
      {/* TOP SECTION: The Velocity Gauges */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Cerebras Gauge */}
        <div className="glass-obsidian glow-indigo p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Zap className="text-indigo-400" size={16} />
              <span className="text-xs font-mono uppercase tracking-widest text-indigo-400/80">Cerebras Engine</span>
            </div>
            <div className="flex items-center gap-2">
              {cerebras.loading && <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />}
              <span className={`h-1.5 w-1.5 rounded-full ${cerebras.active ? 'bg-emerald-500' : 'bg-zinc-600'}`} />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            <VelocityGauge 
              value={cerebras.tps} 
              max={3000} 
              color="stroke-indigo-400" 
              label="TOK/S" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <TelemetryCard label="TTFT" value={`${cerebras.ttft}ms`} icon={<Timer size={12}/>} />
            <TelemetryCard label="Total" value={cerebras.totalTokens.toLocaleString()} icon={<Activity size={12}/>} />
          </div>
        </div>

        {/* GPU Gauge */}
        <div className="glass-obsidian p-6 rounded-3xl relative overflow-hidden group">
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-zinc-500/5 rounded-full blur-3xl" />
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Gauge className="text-zinc-500" size={16} />
              <span className="text-xs font-mono uppercase tracking-widest text-zinc-500">GPU Baseline</span>
            </div>
            <div className="flex items-center gap-2">
              {gpu.loading && <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-ping" />}
              <span className={`h-1.5 w-1.5 rounded-full ${gpu.active ? 'bg-amber-500' : 'bg-zinc-600'}`} />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            <VelocityGauge 
              value={gpu.tps} 
              max={3000} 
              color="stroke-zinc-500" 
              label="TOK/S" 
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <TelemetryCard label="TTFT" value={`${gpu.ttft}ms`} icon={<Timer size={12}/>} />
            <TelemetryCard label="Total" value={gpu.totalTokens.toLocaleString()} icon={<Activity size={12}/>} />
          </div>
        </div>

        {/* Speedup Delta */}
        <div className={`glass-obsidian p-6 rounded-3xl relative overflow-hidden transition-all duration-500 ${hasRace ? 'glow-emerald border-emerald-500/30' : 'opacity-60'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent" />
          
          <div className="flex items-center gap-2 mb-6">
            <ChevronRight className="text-emerald-400" size={16} />
            <span className="text-xs font-mono uppercase tracking-widest text-emerald-400/80">Acceleration Delta</span>
          </div>

          <div className="flex flex-col items-center justify-center h-full py-4">
            <AnimatePresence mode="wait">
              {hasRace ? (
                <motion.div 
                  key="speedup"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="text-center"
                >
                  <div className="text-7xl font-black text-emerald-400 font-mono tracking-tighter">
                    {speedup}<span className="text-3xl ml-1">x</span>
                  </div>
                  <div className="text-xs font-medium text-emerald-500/70 uppercase tracking-widest mt-2">
                    Measured Speedup
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="no-race"
                  className="text-center p-4"
                >
                  <div className="text-zinc-500 text-sm font-medium leading-relaxed">
                    Awaiting baseline data to calculate real-time acceleration...
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION: The Cinematic Race Track */}
      <div className="glass-obsidian p-8 rounded-3xl overflow-hidden relative">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-sm font-mono uppercase tracking-widest text-zinc-400 flex items-center gap-2">
            <Activity size={16} className="text-indigo-400" /> Live Token Race
          </h3>
          <div className="text-[10px] font-mono text-zinc-500">
            CEREBRAS vs GPU
          </div>
        </div>

        <div className="space-y-8">
          {/* Cerebras Lane */}
          <div className="relative h-12 bg-zinc-900/50 rounded-full border border-zinc-800 overflow-hidden p-1">
            <motion.div 
              className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full relative shadow-[0_0_15px_rgba(129,140,248,0.5)]"
              initial={{ width: 0 }}
              animate={{ width: `${cerebrasProgress}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 15 }}
            >
              <div className="absolute right-0 top-0 h-full w-1 bg-white blur-sm animate-pulse" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
              <span className="text-[10px] font-bold text-indigo-300 uppercase">Cerebras</span>
              <span className="text-[10px] font-mono text-white">{cerebras.totalTokens} tok</span>
            </div>
          </div>

          {/* GPU Lane */}
          <div className="relative h-12 bg-zinc-900/50 rounded-full border border-zinc-800 overflow-hidden p-1">
            <motion.div 
              className="h-full bg-zinc-600 rounded-full relative"
              initial={{ width: 0 }}
              animate={{ width: `${gpuProgress}%` }}
              transition={{ type: "spring", stiffness: 50, damping: 15 }}
            >
              <div className="absolute right-0 top-0 h-full w-1 bg-zinc-400 blur-sm" />
            </motion.div>
            <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
              <span className="text-[10px] font-bold text-zinc-400 uppercase">Baseline GPU</span>
              <span className="text-[10px] font-mono text-zinc-300">{gpu.totalTokens} tok</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
