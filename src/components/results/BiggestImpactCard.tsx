import React from 'react';
import { AlertCircle, ArrowUpRight, Flame, Car, Plane, Home, Utensils, ShoppingBag, Recycle, Leaf } from 'lucide-react';
import type { CalculationResult, CategoryKey } from '../../types/calculator';

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
  const IconComponent = CATEGORY_ICONS[biggestImpact.category] || Flame;

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#121c16] via-[#0b140f] to-[#070c09] border border-emerald-500/40 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
      
      {/* Background ambient corner glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <AlertCircle className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-emerald-400">
              Primary Abatement Opportunity
            </span>
          </div>

          <h3 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <IconComponent className="w-7 h-7 text-emerald-400" />
            <span>{biggestImpact.label}</span>
          </h3>

          <p className="text-sm text-zinc-300 leading-relaxed pt-1">
            {biggestImpact.insight}
          </p>
        </div>

        {/* Big Percentage Badge */}
        <div className="self-stretch sm:self-center shrink-0 p-5 rounded-2xl bg-[#060b08]/80 border border-emerald-500/30 text-center flex flex-col items-center justify-center min-w-[140px]">
          <span className="text-4xl sm:text-5xl font-black font-mono text-emerald-400 leading-none">
            {biggestImpact.percentage}%
          </span>
          <span className="text-[11px] font-medium text-zinc-400 uppercase mt-1">
            of total footprint
          </span>
          <span className="text-xs font-mono font-bold text-zinc-200 mt-0.5">
            {biggestImpact.tonnes} t CO₂e / yr
          </span>
        </div>

      </div>

    </div>
  );
};
