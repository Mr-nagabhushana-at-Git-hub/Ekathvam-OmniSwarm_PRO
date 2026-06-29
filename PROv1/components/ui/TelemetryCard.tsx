// components/ui/TelemetryCard.tsx
"use client";

import React from "react";

interface TelemetryCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

export const TelemetryCard: React.FC<TelemetryCardProps> = ({ label, value, icon }) => {
  return (
    <div className="p-3 rounded-2xl bg-zinc-900/40 border border-zinc-800/50 flex flex-col gap-1">
      <div className="flex items-center gap-1.5 text-zinc-500">
        {icon}
        <span className="text-[10px] font-mono uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-lg font-mono font-bold text-zinc-200">
        {value}
      </div>
    </div>
  );
};
