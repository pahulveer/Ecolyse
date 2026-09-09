import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Car, Utensils, Sparkles, TrendingDown, ArrowRight, Check } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { springSmooth, springPop } from '../common/MotionPrimitives';
import { useCalculator } from '../../context/CalculatorContext';

interface ActionLever {
  id: string;
  title: string;
  description: string;
  reductionKg: number;
  icon: React.ElementType;
  badge: string;
}

const ACTION_LEVERS: ActionLever[] = [
  {
    id: 'solar',
    title: 'Install 3kW Rooftop Solar',
    description: 'Offsets high-carbon grid power with clean localized photovoltaic generation.',
    reductionKg: 1420,
    icon: Zap,
    badge: '-1.42 t/yr'
  },
  {
    id: 'transit',
    title: 'Switch Commute to Metro / EV',
    description: 'Replaces single-occupancy petrol vehicle trips with electrified urban transit.',
    reductionKg: 980,
    icon: Car,
    badge: '-0.98 t/yr'
  },
  {
    id: 'diet',
    title: 'Adopt Plant-Rich Diet (5 days/wk)',
    description: 'Dramatically lowers enteric fermentation methane and agricultural land footprint.',
    reductionKg: 760,
    icon: Utensils,
    badge: '-0.76 t/yr'
  }
];

export const InstantImpactSimulator: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const { setView } = useCalculator();

  const [selectedLevers, setSelectedLevers] = useState<string[]>(['solar', 'transit']);

  const toggleLever = (id: string) => {
    setSelectedLevers(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const totalReductionKg = ACTION_LEVERS
    .filter(l => selectedLevers.includes(l.id))
    .reduce((sum, l) => sum + l.reductionKg, 0);

  const totalReductionTonnes = (totalReductionKg / 1000).toFixed(2);
  const percentOfAvgIndian = Math.min(100, Math.round((totalReductionKg / 2200) * 100));

  // Circle gauge math
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentOfAvgIndian / 100) * circumference;

  return (
    <div className={`p-8 sm:p-10 rounded-3xl border transition-all duration-300 relative overflow-hidden shadow-2xl ${
      isLight 
        ? 'bg-gradient-to-b from-white to-emerald-50/40 border-slate-200' 
        : 'bg-gradient-to-b from-[#091510] to-[#050c08] border-emerald-500/25'
    }`}>
      {/* Background ambient radial beam */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
        
        {/* Left column: Interactive Levers */}
        <div className="w-full lg:w-3/5 space-y-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-Time Decarbonization Sandbox</span>
            </div>
            <h3 className={`text-2xl sm:text-3xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Simulate Your Carbon Abatement
            </h3>
            <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
              Toggle high-leverage lifestyle shifts to see the real-world mass-balance reduction in your annual footprint.
            </p>
          </div>

          {/* Interactive Toggle Cards */}
          <div className="space-y-3">
            {ACTION_LEVERS.map((lever) => {
              const Icon = lever.icon;
              const isSelected = selectedLevers.includes(lever.id);

              return (
                <motion.button
                  key={lever.id}
                  onClick={() => toggleLever(lever.id)}
                  whileHover={{ scale: 1.015, x: 3 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springPop}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between gap-4 transition-all duration-200 ${
                    isSelected
                      ? isLight
                        ? 'bg-white border-emerald-500 shadow-md shadow-emerald-500/10'
                        : 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-500/10'
                      : isLight
                        ? 'bg-slate-50/80 border-slate-200 hover:border-slate-300 opacity-70'
                        : 'bg-[#060e0a] border-white/5 hover:border-white/10 opacity-70'
                  }`}
                >
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected
                        ? 'bg-emerald-500 text-carbon-950 font-bold'
                        : isLight ? 'bg-slate-200 text-slate-600' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                          {lever.title}
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                          isSelected 
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' 
                            : isLight ? 'bg-slate-200 text-slate-600' : 'bg-zinc-800 text-zinc-500'
                        }`}>
                          {lever.badge}
                        </span>
                      </div>
                      <p className={`text-xs mt-0.5 line-clamp-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                        {lever.description}
                      </p>
                    </div>
                  </div>

                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                    isSelected
                      ? 'bg-emerald-500 border-emerald-400 text-carbon-950'
                      : isLight ? 'border-slate-300 bg-transparent' : 'border-zinc-700 bg-transparent'
                  }`}>
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Right column: Dynamic 60FPS Kinetic Gauge & Counter */}
        <div className={`w-full lg:w-2/5 p-7 rounded-3xl border flex flex-col items-center text-center relative overflow-hidden group ${
          isLight ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#050e09] border-emerald-500/30 shadow-2xl'
        }`}>
          {/* Continuous traveling indicator beam */}
          <motion.div
            animate={{ x: ['-100%', '200%'] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none"
          />

          {/* Circular SVG Kinetic Meter */}
          <div className="relative w-44 h-44 flex items-center justify-center my-3">
            {/* 60fps orbiting kinetic particle around perimeter */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 5, ease: 'linear' }}
              className="absolute inset-0 pointer-events-none"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#34d399] absolute top-1 left-1/2 -translate-x-1/2" />
            </motion.div>

            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              {/* Track circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className={isLight ? 'stroke-slate-200' : 'stroke-zinc-800'}
                strokeWidth="10"
                fill="none"
              />
              {/* Dynamic animated reduction arc */}
              <motion.circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-emerald-400"
                strokeWidth="10"
                strokeLinecap="round"
                fill="none"
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                style={{
                  strokeDasharray: circumference,
                  filter: 'drop-shadow(0 0 8px rgba(52,211,153,0.5))'
                }}
              />
            </svg>

            {/* Center metric */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.div 
                key={totalReductionTonnes}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={springPop}
                className="font-mono text-3xl font-black text-emerald-400 tracking-tight"
              >
                -{totalReductionTonnes}
              </motion.div>
              <div className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
                isLight ? 'text-slate-500' : 'text-zinc-400'
              }`}>
                t CO₂e / year
              </div>
            </div>
          </div>

          <div className="space-y-1 mt-2">
            <div className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              {percentOfAvgIndian}% of Average Baseline
            </div>
            <p className={`text-xs max-w-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              Annual reduction relative to the 2.2 t per-capita national average.
            </p>
          </div>

          <motion.button
            onClick={() => {
              setView('calculator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            whileHover={{ scale: 1.04, y: -2 }}
            whileTap={{ scale: 0.96 }}
            transition={springPop}
            className="mt-6 w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30"
          >
            <span>Run Full 7-Category Audit</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>
        </div>

      </div>
    </div>
  );
};
