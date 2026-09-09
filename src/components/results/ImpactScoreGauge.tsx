import React from 'react';
import { Award, Info, Car, Home, Utensils, ShoppingBag, Recycle } from 'lucide-react';
import type { CalculationResult } from '../../types/calculator';

interface ImpactScoreGaugeProps {
  result: CalculationResult;
}

export const ImpactScoreGauge: React.FC<ImpactScoreGaugeProps> = ({ result }) => {
  const score = result.impactScore;

  const scoreRating = 
    score >= 85 ? { text: 'Climate Leader (Near 1.5°C)', color: 'text-emerald-400', border: 'border-emerald-500' } :
    score >= 70 ? { text: 'Low Carbon Pioneer', color: 'text-teal-400', border: 'border-teal-500' } :
    score >= 50 ? { text: 'Moderate Western Impact', color: 'text-amber-400', border: 'border-amber-500' } :
    { text: 'High Carbon Intensity', color: 'text-red-400', border: 'border-red-500' };

  return (
    <div className="rounded-3xl bg-[#08110c]/90 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      
      {/* Title */}
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-emerald-950/70">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
            <Award className="w-3.5 h-3.5" />
            <span>Lifestyle Efficiency Index</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Personal Impact Score
          </h3>
        </div>

        {/* Big Overall Score Readout */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase text-zinc-400">Score Rating</div>
            <div className={`text-xs font-bold font-mono ${scoreRating.color}`}>
              {scoreRating.text}
            </div>
          </div>
          <div className="w-14 h-14 rounded-2xl bg-[#050a07] border border-emerald-500/40 flex items-center justify-center font-mono font-black text-2xl text-emerald-300">
            {score}
          </div>
        </div>
      </div>

      {/* Category Sub-scores Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {result.categoryList.slice(0, 6).map(cat => (
          <div
            key={cat.category}
            className="p-3.5 rounded-xl bg-[#050a07] border border-emerald-950/70 flex items-center justify-between"
          >
            <div>
              <div className="text-xs font-semibold text-zinc-200">{cat.label}</div>
              <div className="text-[11px] text-zinc-400 font-mono">{cat.tonnes} t CO₂e</div>
            </div>

            <div className="text-right">
              <span className="text-base font-extrabold font-mono text-emerald-400">
                {cat.score}
              </span>
              <span className="text-[10px] text-zinc-500 font-mono block">/ 100</span>
            </div>
          </div>
        ))}
      </div>

      {/* Required Educational Disclaimer */}
      <div className="mt-6 pt-4 border-t border-emerald-950/70 flex items-start gap-2 text-xs text-zinc-400 leading-relaxed">
        <Info className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <span>
          <strong>Academic Note:</strong> This Impact Profile score (0–100) is a project-defined educational index designed to illustrate comparative efficiency against 1.5°C targets. It is not an officially standardized global regulatory metric.
        </span>
      </div>

    </div>
  );
};
