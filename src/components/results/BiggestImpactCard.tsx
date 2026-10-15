import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Sliders, Flame, Car, Plane, Home, Utensils, ShoppingBag, Recycle, Leaf, ArrowRight } from 'lucide-react';
import type { CalculationResult, CategoryKey } from '../../types/calculator';
import { springPop, springSmooth } from '../common/MotionPrimitives';
import { playSelectSound } from '../../utils/soundEffects';

interface BiggestImpactCardProps {
  biggestImpact: CalculationResult['biggestImpact'];
}

const CATEGORY_ICONS: Record<CategoryKey, React.ComponentType<{ className?: string }>> = {
  home: Home,
  transport: Car,
  travel: Plane,
  food: Utensils,
  shopping: ShoppingBag,
  waste: Recycle,
  lifestyle: Leaf,
};

export const BiggestImpactCard: React.FC<BiggestImpactCardProps> = ({ biggestImpact }) => {
  const safeImpact = biggestImpact || {
    category: 'home' as CategoryKey,
    label: 'Home & Electricity',
    insight: 'Grid electricity and air conditioning account for significant personal emissions.',
    percentage: 35,
    tonnes: 1.2
  };
  const IconComponent = CATEGORY_ICONS[safeImpact.category] || Flame;

  const handleSimulateScroll = () => {
    playSelectSound();
    const el = document.getElementById('what-if-simulator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <motion.div 
      whileHover={{ y: -3 }}
      transition={springSmooth}
      className="rounded-3xl bg-white dark:bg-gradient-to-br dark:from-[#121c16] dark:via-[#0b140f] dark:to-[#070c09] border border-slate-200 dark:border-emerald-500/40 p-6 sm:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden transition-colors"
    >
      
      {/* Background ambient corner glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        
        <div className="space-y-3 max-w-2xl text-left">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-amber-50 dark:bg-emerald-500/20 text-amber-600 dark:text-emerald-400 border border-amber-200 dark:border-emerald-500/30">
              <AlertCircle className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-700 dark:text-emerald-400">
              Primary Abatement Opportunity
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white flex items-center gap-3 font-heading">
            <IconComponent className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
            <span>{safeImpact.label}</span>
          </h3>

          <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed pt-1">
            {safeImpact.insight}
          </p>

          {/* Quick jump to simulator button */}
          <div className="pt-2">
            <motion.button
              type="button"
              onClick={handleSimulateScroll}
              whileHover={{ scale: 1.03, x: 2 }}
              whileTap={{ scale: 0.96 }}
              transition={springPop}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-500/40 transition-colors cursor-pointer shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Simulate Reductions in What-If Engine</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>

        {/* Big Percentage Badge */}
        <div className="self-stretch sm:self-center shrink-0 p-5 rounded-2xl bg-slate-50 dark:bg-[#060b08]/80 border border-slate-200 dark:border-emerald-500/30 text-center flex flex-col items-center justify-center min-w-[150px] shadow-sm">
          <span className="text-4xl sm:text-5xl font-black font-mono text-emerald-600 dark:text-emerald-400 leading-none">
            {safeImpact.percentage}%
          </span>
          <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400 uppercase mt-1">
            of total footprint
          </span>
          <span className="text-xs font-mono font-bold text-slate-800 dark:text-zinc-200 mt-0.5">
            {safeImpact.tonnes} t CO₂e / yr
          </span>
          
          <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-emerald-950/80 mt-3 overflow-hidden">
            <div 
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
              style={{ width: `${Math.min(100, safeImpact.percentage)}%` }}
            />
          </div>
        </div>

      </div>

    </motion.div>
  );
};
