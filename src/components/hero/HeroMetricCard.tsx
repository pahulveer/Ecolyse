import React, { useState, useEffect } from 'react';
import { TrendingDown, Activity, CheckCircle2 } from 'lucide-react';

export const HeroMetricCard: React.FC = () => {
  const [displayedValue, setDisplayedValue] = useState(0);

  useEffect(() => {
    // Smooth initial count-up animation
    const target = 2.4;
    let current = 0;
    const increment = 0.05;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayedValue(target);
        clearInterval(interval);
      } else {
        setDisplayedValue(Number(current.toFixed(1)));
      }
    }, 28);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative group max-w-sm w-full">
      {/* Ambient background glow */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-600/10 blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Main Glass Card */}
      <div className="relative rounded-2xl bg-[#0a120e]/85 backdrop-blur-xl border border-emerald-500/30 p-6 shadow-2xl transition-all duration-300 group-hover:border-emerald-400/50">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-mono tracking-wider uppercase text-emerald-400 font-semibold">
              Live Impact Telemetry
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-800/30">
            IPCC AR6 Calibrated
          </span>
        </div>

        {/* Circular SVG & Big Number Display */}
        <div className="flex items-center gap-5">
          {/* Animated Circular Progress Gauge */}
          <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background Track */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(16, 185, 129, 0.15)"
                strokeWidth="7"
              />
              {/* Paris 1.5°C ceiling indicator marker */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="rgba(6, 182, 212, 0.4)"
                strokeWidth="7"
                strokeDasharray="45 205"
                strokeDashoffset="0"
              />
              {/* Active Value Arc */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="url(#emerald-gradient)"
                strokeWidth="7"
                strokeDasharray="165 251"
                strokeDashoffset="0"
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="emerald-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#34d399" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            
            {/* Center Icon */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
              <span className="text-[10px] uppercase font-mono text-emerald-300/70">Target</span>
              <span className="text-xs font-bold text-teal-300 font-mono">2.1t</span>
            </div>
          </div>

          {/* Value Readout */}
          <div className="space-y-1">
            <div className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
              Example Baseline
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-4xl font-extrabold text-white font-mono tracking-tight">
                {displayedValue.toFixed(1)}
              </span>
              <span className="text-xs text-emerald-400 font-semibold uppercase">
                t CO₂e / yr
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Near Paris 2030 Ceiling (2.1 t)</span>
            </div>
          </div>
        </div>

        {/* Micro Contributors Bar */}
        <div className="mt-5 pt-4 border-t border-emerald-950/60 space-y-2">
          <div className="flex justify-between text-[11px] text-zinc-400">
            <span>Modal Distribution</span>
            <span className="text-emerald-400">7 Categories</span>
          </div>
          <div className="h-2 w-full rounded-full bg-emerald-950/60 flex overflow-hidden p-0.5 gap-0.5">
            <div className="h-full rounded-sm bg-emerald-400 w-[42%]" title="Transport (42%)" />
            <div className="h-full rounded-sm bg-teal-400 w-[27%]" title="Home Energy (27%)" />
            <div className="h-full rounded-sm bg-amber-400 w-[18%]" title="Food & Diet (18%)" />
            <div className="h-full rounded-sm bg-purple-400 w-[8%]" title="Goods (8%)" />
            <div className="h-full rounded-sm bg-emerald-600 w-[5%]" title="Waste (5%)" />
          </div>
          <div className="flex justify-between text-[10px] text-zinc-400 pt-0.5">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Transport 42%</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-teal-400" /> Energy 27%</span>
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Food 18%</span>
          </div>
        </div>

        {/* Telemetry Status Footer */}
        <div className="mt-4 pt-3 border-t border-emerald-950/60 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5 font-mono text-[10px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Scope 1-3 Boundary</span>
          </div>
          <span className="font-mono text-[10px] text-zinc-500">Live Dynamic Model</span>
        </div>

      </div>
    </div>
  );
};
