import React from 'react';
import { ArrowRight, ShieldCheck, BarChart3 } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';

export const HeroBenchmarkCard: React.FC = () => {
  const { setView } = useCalculator();

  return (
    <div className="relative group max-w-sm w-full">
      {/* Ambient background glow */}
      <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-teal-500/20 via-emerald-500/20 to-teal-600/10 blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-500" />

      {/* Main Glass Card */}
      <div className="relative rounded-2xl bg-[#0a120e]/85 backdrop-blur-xl border border-emerald-500/30 p-6 shadow-2xl transition-all duration-300 group-hover:border-emerald-400/50">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-wider uppercase text-teal-400 font-semibold">
              National Benchmark
            </span>
          </div>
          <span className="text-[10px] text-zinc-400 font-mono px-2 py-0.5 rounded bg-emerald-950/50 border border-emerald-800/30">
            India Baseline
          </span>
        </div>

        {/* Core Benchmark Comparison Stats */}
        <div className="space-y-3">
          {/* India Per Capita */}
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/30 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-mono text-zinc-400">India Per Capita Avg</div>
              <div className="text-xs text-emerald-400 font-medium">59% below global average</div>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold font-mono text-white">1.9</span>
              <span className="text-[10px] text-zinc-400 ml-1 font-mono">t CO₂e</span>
            </div>
          </div>

          {/* Paris 1.5°C Ceiling */}
          <div className="p-2.5 rounded-xl bg-teal-950/40 border border-teal-800/30 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-mono text-zinc-400">Paris 2030 Ceiling</div>
              <div className="text-xs text-teal-300 font-medium">Individual sustainability cap</div>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold font-mono text-white">2.1</span>
              <span className="text-[10px] text-zinc-400 ml-1 font-mono">t CO₂e</span>
            </div>
          </div>

          {/* CEA Grid Emission Factor */}
          <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-800/20 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase font-mono text-zinc-400">CEA Grid Factor</div>
              <div className="text-xs text-emerald-300/80 font-medium">National Baseline v20</div>
            </div>
            <div className="text-right">
              <span className="text-xl font-bold font-mono text-white">716</span>
              <span className="text-[10px] text-zinc-400 ml-1 font-mono">g/kWh</span>
            </div>
          </div>
        </div>

        {/* Quick Context Action */}
        <div className="mt-4 pt-3 border-t border-emerald-950/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>CEA & IPCC Grounded</span>
          </div>
          <button
            onClick={() => {
              setView('climate_data');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-xs font-semibold text-teal-400 hover:text-teal-300 flex items-center gap-1 group/btn"
          >
            <span>Explore Data</span>
            <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </div>
  );
};
