import React from 'react';
import { Sparkles, ArrowRight, Leaf, Trees } from 'lucide-react';

interface FutureLandscapeProps {
  currentTonnes: number;
  simulatedTonnes?: number;
}

export const FutureLandscape: React.FC<FutureLandscapeProps> = ({
  currentTonnes,
  simulatedTonnes,
}) => {
  const safeCurrent = Number(currentTonnes) || 2.0;
  const futureTonnes = simulatedTonnes !== undefined 
    ? (Number(simulatedTonnes) || 1.8) 
    : Math.max(1.8, Number((safeCurrent * 0.72).toFixed(1)));

  const reduction = Math.max(0, Number((safeCurrent - futureTonnes).toFixed(1)));
  const healthPercent = Math.min(100, Math.max(15, Math.round((1 - (futureTonnes / 12)) * 100)));

  return (
    <div className="rounded-3xl bg-white dark:bg-[#09130e]/90 border border-slate-200 dark:border-emerald-500/30 p-6 sm:p-8 shadow-xl dark:shadow-2xl backdrop-blur-md overflow-hidden relative transition-colors">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-emerald-950/70">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ecological Recovery Horizon</span>
          </div>
          <h3 className="text-2xl font-extrabold font-heading text-slate-900 dark:text-white">
            Planetary Response & Natural Capital
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 mt-1 max-w-xl">
            Visualizing the environmental regeneration when your individual habits align with planetary biocapacity boundaries.
          </p>
        </div>

        {/* 3-Step Trajectory Capsule */}
        <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-[#050a07] border border-slate-200 dark:border-emerald-500/30 px-3.5 py-2 rounded-2xl text-xs font-mono shadow-xs">
          <div>
            <span className="text-slate-400 dark:text-zinc-500 text-[10px] block">Current</span>
            <span className="font-bold text-slate-700 dark:text-zinc-300">{currentTonnes} t</span>
          </div>
          <ArrowRight className="w-3.5 h-3.5 text-emerald-500" />
          <div>
            <span className="text-emerald-600 dark:text-emerald-400 text-[10px] block font-semibold">Decarbonized</span>
            <span className="font-bold text-emerald-700 dark:text-emerald-300">{futureTonnes} t</span>
          </div>
          <div className="pl-2 border-l border-slate-200 dark:border-emerald-950/80">
            <span className="text-teal-600 dark:text-teal-400 text-[10px] block font-semibold">Abated</span>
            <span className="font-bold text-teal-700 dark:text-teal-300">-{reduction} t</span>
          </div>
        </div>
      </div>

      {/* Visual Animated Landscape SVG Canvas */}
      <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-slate-200 dark:border-emerald-900/40 bg-gradient-to-b from-sky-100 via-emerald-50/50 to-emerald-100/60 dark:from-[#05140d] dark:via-[#082015] dark:to-[#0a281a]">
        
        {/* Sky Ambient Light */}
        <div 
          className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 20%, rgba(52, 211, 153, ${healthPercent * 0.003}), transparent 70%)`
          }}
        />

        {/* Celestial Sun Glow */}
        <div 
          className="absolute top-5 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full blur-xl transition-all duration-700 pointer-events-none"
          style={{
            backgroundColor: healthPercent > 70 ? 'rgba(52, 211, 153, 0.45)' : 'rgba(245, 158, 11, 0.3)',
            transform: `translate(-50%, ${Math.max(0, 100 - healthPercent) * 0.2}px)`
          }}
        />

        {/* SVG Rolling Green Hills & Modern Clean Energy Turbines */}
        <svg 
          className="absolute bottom-0 w-full h-44 object-cover" 
          viewBox="0 0 800 200" 
          preserveAspectRatio="none"
        >
          {/* Distant Hills */}
          <path 
            d="M 0,160 Q 200,90 450,140 T 800,120 L 800,200 L 0,200 Z" 
            className="transition-colors duration-700 fill-emerald-200/70 dark:fill-[#0b261b]"
          />

          {/* Mid Hills */}
          <path 
            d="M 0,140 Q 150,170 350,120 T 800,145 L 800,200 L 0,200 Z" 
            className="transition-colors duration-700 fill-emerald-400/50 dark:fill-[#0e3324]"
          />

          {/* Foreground Lush Emerald Hills */}
          <path 
            d="M 0,165 Q 250,130 500,160 T 800,150 L 800,200 L 0,200 Z" 
            className="transition-colors duration-700 fill-emerald-600/70 dark:fill-[#10402d]"
          />

          {/* Animated Wind Turbine 1 */}
          <g transform="translate(180, 70)" className="opacity-80">
            <line x1="0" y1="0" x2="0" y2="45" stroke="#10b981" strokeWidth="2" />
            <circle cx="0" cy="0" r="3" fill="#10b981" />
            <line x1="0" y1="0" x2="-18" y2="-12" stroke="#10b981" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="18" y2="-12" stroke="#10b981" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="0" y2="20" stroke="#10b981" strokeWidth="1.5" />
          </g>

          {/* Wind Turbine 2 */}
          <g transform="translate(580, 85)" className="opacity-80">
            <line x1="0" y1="0" x2="0" y2="50" stroke="#059669" strokeWidth="2" />
            <circle cx="0" cy="0" r="3" fill="#059669" />
            <line x1="0" y1="0" x2="16" y2="-10" stroke="#059669" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="-16" y2="-10" stroke="#059669" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="0" y2="18" stroke="#059669" strokeWidth="1.5" />
          </g>

          {/* Native Tree Silhouettes */}
          {healthPercent > 45 && (
            <g className="fill-emerald-800 dark:fill-[#164e37] opacity-90">
              <polygon points="120,165 128,140 136,165" />
              <polygon points="132,168 140,135 148,168" />
              <polygon points="380,155 388,130 396,155" />
              <polygon points="392,158 400,125 408,158" />
              <polygon points="680,165 688,142 696,165" />
            </g>
          )}
        </svg>

        {/* Overlay Telemetry Badge 1 */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-white/80 dark:bg-[#060e0a]/80 backdrop-blur-md border border-slate-200 dark:border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-800 dark:text-emerald-300 shadow-xs">
          <Leaf className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Biocapacity Alignment: <strong>{healthPercent}%</strong></span>
        </div>

        {/* Overlay Telemetry Badge 2 */}
        <div className="absolute top-4 right-4 hidden sm:flex items-center gap-2 bg-white/80 dark:bg-[#060e0a]/80 backdrop-blur-md border border-slate-200 dark:border-teal-500/30 px-3 py-1.5 rounded-xl text-xs font-mono text-teal-800 dark:text-teal-300 shadow-xs">
          <Trees className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
          <span>Equiv. to planting ~{Math.round(reduction * 45)} trees/yr</span>
        </div>

      </div>

    </div>
  );
};
