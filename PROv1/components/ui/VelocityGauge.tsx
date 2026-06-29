// components/ui/VelocityGauge.tsx
"use client";

import React from "react";
import { motion } from "motion/react";

interface VelocityGaugeProps {
  value: number;
  max: number;
  color: string;
  label: string;
}

export const VelocityGauge: React.FC<VelocityGaugeProps> = ({ value, max, color, label }) => {
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min((value / max) * 100, 100);
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center">
      <svg className="w-40 h-40 transform -rotate-90">
        {/* Background Circle */}
        <circle 
          cx="80" cy="80" r={radius} 
          className="stroke-zinc-800 fill-none" 
          strokeWidth="12" 
        />
        {/* Progress Circle */}
        <motion.circle 
          cx="80" cy="80" r={radius} 
          className={`fill-none ${color}`} 
          strokeWidth="12" 
          strokeLinecap="round"
          initial={{ strokeDasharray: `${circumference} ${circumference}`, strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ type: "spring", stiffness: 60, damping: 12 }}
          style={{ strokeDasharray: `${circumference} ${circumference}` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span 
          key={value}
          initial={{ opacity: 0.8, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-4xl font-mono font-black text-white tracking-tighter"
        >
          {Math.round(value).toLocaleString()}
        </motion.span>
        <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{label}</span>
      </div>
    </div>
  );
};
