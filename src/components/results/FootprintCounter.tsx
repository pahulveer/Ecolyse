import React, { useState, useEffect } from 'react';
import { TrendingDown, TrendingUp, Target, Globe2, Flag } from 'lucide-react';
import type { CalculationResult } from '../../types/calculator';

interface FootprintCounterProps {
  result: CalculationResult;
}

export const FootprintCounter: React.FC<FootprintCounterProps> = ({ result }) => {
  const [displayedValue, setDisplayedValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = Number(result?.totalTonnes) || 0;
    const duration = 1200; // ms
    const steps = 40;
    const stepTime = duration / steps;
    const stepVal = end / steps;

    const timer = setInterval(() => {
      start += stepVal;
      if (start >= end) {
        setDisplayedValue(end);
        clearInterval(timer);
      } else {
        setDisplayedValue(Number(start.toFixed(2)));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [result?.totalTonnes]);

  const vsIndia = Number(result?.benchmarkComparison?.vsIndiaPercentage) || 0;
  const isLowerThanIndia = vsIndia <= 0;

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#0e1a14] to-[#070c09] border border-emerald-500/30 p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
      
      {/* Subtle backdrop glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Eyebrow badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 text-xs font-mono mb-4 uppercase tracking-widest">
        <span>INDIA CEA & IPCC CALIBRATED ASSESSMENT</span>
      </div>

      <h2 className="text-xs sm:text-sm font-semibold text-zinc-400 uppercase tracking-widest">
        YOUR ESTIMATED ANNUAL CARBON FOOTPRINT
      </h2>

      {/* Huge Counter Readout */}
      <div className="my-4 flex items-baseline justify-center gap-2">
        <span className="text-6xl sm:text-7xl lg:text-8xl font-black font-mono tracking-tight text-white glow-text-emerald">
          {(Number(displayedValue) || 0).toFixed(1)}
        </span>
        <div className="text-left font-sans">
          <div className="text-base sm:text-xl font-bold text-emerald-400 leading-none">tonnes</div>
          <div className="text-xs text-zinc-400 font-mono">CO₂e / year</div>
        </div>
      </div>

      {/* Comparison Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#09140f] border border-emerald-800/40 text-xs sm:text-sm font-medium mb-8">
        {isLowerThanIndia ? (
          <>
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-300">
              <strong className="text-emerald-200">{Math.abs(vsIndia)}% lower</strong> than India National Average ({result.benchmarkComparison.indiaAverage} t)
            </span>
          </>
        ) : (
          <>
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span className="text-amber-300">
              <strong className="text-amber-200">{vsIndia}% higher</strong> than India National Average ({result.benchmarkComparison.indiaAverage} t)
            </span>
          </>
        )}
      </div>

      {/* Benchmark Comparisons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-emerald-950/80 text-left">
        
        {/* Benchmark 1: India National Average */}
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Flag className="w-3.5 h-3.5 text-emerald-400" />
              <span>India National Avg</span>
            </span>
            <span className="font-mono text-emerald-300 font-bold">1.9 t</span>
          </div>
          <div className="text-xs text-zinc-400">
            {result.totalTonnes <= 1.9 ? (
              <span className="text-emerald-400 font-medium">✓ Below India's per-capita baseline</span>
            ) : (
              <span>{(result.totalTonnes - 1.9).toFixed(1)} t above India baseline</span>
            )}
          </div>
        </div>

        {/* Benchmark 2: Paris 2030 Target */}
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Target className="w-3.5 h-3.5 text-teal-400" />
              <span>Paris 2030 Ceiling</span>
            </span>
            <span className="font-mono text-teal-300 font-bold">2.1 t</span>
          </div>
          <div className="text-xs text-zinc-400">
            {result.totalTonnes <= 2.1 ? (
              <span className="text-emerald-400 font-medium">✓ Aligned with 1.5°C climate limit</span>
            ) : (
              <span>~{(result.totalTonnes - 2.1).toFixed(1)} t above 2030 target</span>
            )}
          </div>
        </div>

        {/* Benchmark 3: Global & US Average */}
        <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span className="flex items-center gap-1.5 font-medium">
              <Globe2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Global Average</span>
            </span>
            <span className="font-mono text-amber-300 font-bold">4.8 t</span>
          </div>
          <div className="text-xs text-zinc-400">
            <span className="text-emerald-400 font-medium">
              {Math.max(0, Math.round(((4.8 - result.totalTonnes) / 4.8) * 100))}% lower than world average (US: 14.9 t)
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
