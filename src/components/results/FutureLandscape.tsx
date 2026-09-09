import React from 'react';
import { Sparkles, ArrowDown, Leaf, Sun, Wind, Trees } from 'lucide-react';
import type { CalculationResult } from '../../types/calculator';

interface FutureLandscapeProps {
  currentTonnes: number;
  simulatedTonnes?: number;
}

export const FutureLandscape: React.FC<FutureLandscapeProps> = ({
  currentTonnes,
  simulatedTonnes,
}) => {
  // Target footprint with recommended changes:
  // Assumes realistic achievable 25-35% reduction from top actions
  const futureTonnes = simulatedTonnes !== undefined 
    ? simulatedTonnes 
    : Math.max(1.8, Number((currentTonnes * 0.72).toFixed(1)));

  const reduction = Math.max(0, Number((currentTonnes - futureTonnes).toFixed(1)));
  const healthPercent = Math.min(100, Math.max(15, Math.round((1 - (futureTonnes / 12)) * 100)));

  return (
    <div className="rounded-3xl bg-[#09130e]/90 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-md overflow-hidden relative">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-emerald-950/70">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Ecological Health Trajectory</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            Your Potential Footprint & Planetary Response
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl">
            Visualizing the ecological recovery when your lifestyle aligns closer with earth’s regenerative capacity.
          </p>
        </div>

        {/* 3-Step Trajectory Capsule */}
        <div className="flex items-center gap-2 bg-[#050a07] border border-emerald-500/30 px-3 py-2 rounded-2xl text-xs font-mono">
          <div>
            <span className="text-zinc-500 text-[10px] block">Current</span>
            <span className="font-bold text-zinc-300">{currentTonnes} t</span>
          </div>
          <ArrowDown className="w-3.5 h-3.5 text-emerald-400 -rotate-90" />
          <div>
            <span className="text-emerald-400 text-[10px] block">With Actions</span>
            <span className="font-bold text-emerald-300">{futureTonnes} t</span>
          </div>
          <div className="pl-2 border-l border-emerald-950/80">
            <span className="text-teal-400 text-[10px] block">Abated</span>
            <span className="font-bold text-teal-300">-{reduction} t</span>
          </div>
        </div>
      </div>

      {/* Visual Animated Landscape SVG Canvas */}
      <div className="relative w-full h-56 sm:h-64 rounded-2xl overflow-hidden border border-emerald-900/40 bg-gradient-to-b from-[#05140d] via-[#082015] to-[#0a281a]">
        
        {/* Sky Ambient Light */}
        <div 
          className="absolute inset-0 transition-opacity duration-1000 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 20%, rgba(52, 211, 153, ${healthPercent * 0.003}), transparent 70%)`
          }}
        />

        {/* Animated Sun / Celestial Glow */}
        <div 
          className="absolute top-6 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full blur-lg transition-all duration-700 pointer-events-none"
          style={{
            backgroundColor: healthPercent > 70 ? 'rgba(52, 211, 153, 0.4)' : 'rgba(245, 158, 11, 0.25)',
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
            fill={healthPercent > 65 ? '#0b261b' : '#142018'} 
            className="transition-colors duration-700"
          />

          {/* Mid Hills */}
          <path 
            d="M 0,140 Q 150,170 350,120 T 800,145 L 800,200 L 0,200 Z" 
            fill={healthPercent > 65 ? '#0e3324' : '#182920'} 
            className="transition-colors duration-700"
          />

          {/* Foreground Lush Emerald Hills */}
          <path 
            d="M 0,165 Q 250,130 500,160 T 800,150 L 800,200 L 0,200 Z" 
            fill={healthPercent > 65 ? '#10402d' : '#1e3328'} 
            className="transition-colors duration-700"
          />

          {/* Animated Wind Turbines on the ridge */}
          <g transform="translate(180, 70)" className="opacity-80">
            <line x1="0" y1="0" x2="0" y2="45" stroke="#34d399" strokeWidth="2" />
            <circle cx="0" cy="0" r="3" fill="#34d399" />
            <line x1="0" y1="0" x2="-18" y2="-12" stroke="#34d399" strokeWidth="1.5" className="animate-spin origin-center" style={{ transformOrigin: '0px 0px' }} />
            <line x1="0" y1="0" x2="18" y2="-12" stroke="#34d399" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="0" y2="20" stroke="#34d399" strokeWidth="1.5" />
          </g>

          <g transform="translate(580, 85)" className="opacity-80">
            <line x1="0" y1="0" x2="0" y2="50" stroke="#10b981" strokeWidth="2" />
            <circle cx="0" cy="0" r="3" fill="#10b981" />
            <line x1="0" y1="0" x2="16" y2="-10" stroke="#10b981" strokeWidth="1.5" />
            <line x1="0" y1="0" x2="-16" y2="-10" stroke="#10b981" strokeWidth="1.5" />
          </g>

          {/* Forest silhouettes on foreground */}
          {healthPercent > 50 && (
            <g fill="#164e37">
              <polygon points="120,165 128,140 136,165" />
              <polygon points="132,168 140,135 148,168" />
              <polygon points="380,155 388,130 396,155" />
              <polygon points="392,158 400,125 408,158" />
              <polygon points="680,165 688,142 696,165" />
            </g>
          )}
        </svg>

        {/* Overlay Telemetry Badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-[#060e0a]/80 backdrop-blur-md border border-emerald-500/30 px-3 py-1.5 rounded-xl text-xs font-mono text-emerald-300">
          <Leaf className="w-3.5 h-3.5 text-emerald-400" />
          <span>Ecosystem Regeneration Index: <strong>{healthPercent}%</strong></span>
        </div>

        <div className="absolute top-4 right-4 hidden sm:flex items-center gap-2 bg-[#060e0a]/80 backdrop-blur-md border border-teal-500/30 px-3 py-1.5 rounded-xl text-xs font-mono text-teal-300">
          <Trees className="w-3.5 h-3.5 text-teal-400" />
          <span>Equiv. to planting ~{Math.round(reduction * 45)} trees / year</span>
        </div>

      </div>

    </div>
  );
};
