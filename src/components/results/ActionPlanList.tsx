import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  Gauge, 
  Sparkles,
  Award,
  Filter,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ActionRecommendation } from '../../types/calculator';
import { useCalculator } from '../../context/CalculatorContext';

interface ActionPlanListProps {
  recommendations: ActionRecommendation[];
}

type FilterTab = 'all' | 'quick-wins' | 'high-impact' | 'committed';

export const ActionPlanList: React.FC<ActionPlanListProps> = ({ recommendations }) => {
  const { committedActionIds, toggleCommitAction, totalCommittedSavings } = useCalculator();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const handleToggleCommit = (rec: ActionRecommendation) => {
    const isNowCommitted = !committedActionIds.includes(rec.id);
    toggleCommitAction(rec.id);

    if (isNowCommitted) {
      // Fire celebratory confetti burst
      try {
        confetti({
          particleCount: 65,
          spread: 65,
          origin: { y: 0.7 },
          colors: ['#10b981', '#34d399', '#06b6d4', '#f59e0b', '#8b5cf6']
        });
      } catch {}
    }
  };

  const filteredRecommendations = (recommendations || []).filter(rec => {
    if (activeFilter === 'committed') {
      return committedActionIds.includes(rec.id);
    }
    if (activeFilter === 'quick-wins') {
      return (
        rec.difficulty?.toLowerCase().includes('easy') || 
        rec.timeframe?.toLowerCase().includes('immediate') ||
        rec.timeframe?.toLowerCase().includes('week') ||
        rec.timeframe?.toLowerCase().includes('month')
      );
    }
    if (activeFilter === 'high-impact') {
      return (rec.potentialReductionTonnes || 0) >= 0.4;
    }
    return true;
  });

  const totalPossibleSavings = (recommendations || []).reduce(
    (acc, curr) => acc + (curr.potentialReductionTonnes || 0), 
    0
  );

  const commitmentPercent = totalPossibleSavings > 0 
    ? Math.min(100, Math.round((totalCommittedSavings / totalPossibleSavings) * 100))
    : 0;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#08100c]/90 border border-slate-200 dark:border-emerald-500/30 p-6 sm:p-8 shadow-xl dark:shadow-2xl backdrop-blur-md transition-colors">
      
      {/* Header with committed progress tracker */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 mb-6 border-b border-slate-200 dark:border-emerald-950/70">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized Decarbonization Roadmap</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            Targeted Action Recommendations
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 mt-1 max-w-xl">
            Ranked by highest return on effort based on your lifestyle profile and regional grid parameters.
          </p>
        </div>

        {/* Committed Savings Callout Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-500/40 shrink-0 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-sm shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-600 dark:text-zinc-400 font-semibold">
                Committed Abatement
              </div>
              <div className="text-lg sm:text-xl font-extrabold font-mono text-emerald-700 dark:text-emerald-300">
                -{totalCommittedSavings.toFixed(2)} <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">t CO₂e / yr</span>
              </div>
            </div>
          </div>

          <div className="sm:border-l border-emerald-200 dark:border-emerald-800/80 sm:pl-4 min-w-[140px]">
            <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-zinc-400 mb-1">
              <span>Progress</span>
              <span className="font-bold text-emerald-700 dark:text-emerald-400">{committedActionIds.length}/{recommendations?.length || 0} ({commitmentPercent}%)</span>
            </div>
            <div className="w-full h-2 rounded-full bg-emerald-200/60 dark:bg-emerald-950 overflow-hidden">
              <div 
                className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                style={{ width: `${commitmentPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 mr-1 font-medium">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter:</span>
        </div>

        <button
          type="button"
          onClick={() => setActiveFilter('all')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeFilter === 'all'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-zinc-800'
          }`}
        >
          All Opportunities ({recommendations?.length || 0})
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('quick-wins')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeFilter === 'quick-wins'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-zinc-800'
          }`}
        >
          Quick Wins (&lt; 1 Mo)
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('high-impact')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeFilter === 'high-impact'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-zinc-800'
          }`}
        >
          High Impact (&ge; 0.4t)
        </button>

        <button
          type="button"
          onClick={() => setActiveFilter('committed')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
            activeFilter === 'committed'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-zinc-900/60 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-zinc-800'
          }`}
        >
          Committed ({committedActionIds.length})
        </button>
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-4">
        {filteredRecommendations.length === 0 ? (
          <div className="p-8 rounded-2xl bg-slate-50 dark:bg-[#050a07] border border-slate-200 dark:border-zinc-800 text-center text-sm text-slate-500 dark:text-zinc-400">
            No recommendations match the active filter. Try selecting "All Opportunities".
          </div>
        ) : (
          filteredRecommendations.map((rec, index) => {
            const isCommitted = committedActionIds.includes(rec.id);

            return (
              <div
                key={rec.id}
                className={`p-5 sm:p-6 rounded-2xl border transition-all duration-300 ${
                  isCommitted
                    ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/40'
                    : 'bg-white dark:bg-[#050a07] border-slate-200 dark:border-emerald-950/70 hover:border-emerald-400/60 shadow-xs hover:shadow-sm'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left: Action Info */}
                  <div className="space-y-2.5 max-w-2xl">
                    
                    {/* Badges row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        #{index + 1}
                      </span>
                      <span className="text-slate-300 dark:text-zinc-600">•</span>
                      <span className="text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-500/30">
                        {rec.badge}
                      </span>
                      
                      <span className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-zinc-400 font-mono">
                        <Gauge className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
                        <span>{rec.difficulty}</span>
                      </span>

                      <span className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-zinc-400 font-mono">
                        <DollarSign className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
                        <span>{rec.cost}</span>
                      </span>

                      <span className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-zinc-400 font-mono">
                        <Clock className="w-3 h-3 text-slate-400 dark:text-zinc-500" />
                        <span>{rec.timeframe}</span>
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="text-base sm:text-lg font-bold font-heading text-slate-900 dark:text-white leading-snug">
                      {rec.title}
                    </h4>

                    {/* Explanation */}
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">
                      {rec.explanation}
                    </p>
                  </div>

                  {/* Right: Reduction Value & Action Commit Button */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-200 dark:border-emerald-950/60">
                    <div className="text-left sm:text-right">
                      <div className="text-[10px] uppercase font-mono text-slate-500 dark:text-zinc-400">Potential Abatement</div>
                      <div className="text-lg sm:text-xl font-extrabold font-mono text-emerald-600 dark:text-emerald-400 flex items-center sm:justify-end gap-1">
                        <TrendingDown className="w-4 h-4" />
                        <span>~{(rec.potentialReductionTonnes || 0).toFixed(2)} t</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleToggleCommit(rec)}
                      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer active:scale-95 shadow-xs ${
                        isCommitted
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20 shadow-md'
                          : 'bg-slate-100 hover:bg-emerald-50 dark:bg-zinc-900 dark:hover:bg-emerald-950 text-slate-700 hover:text-emerald-700 dark:text-zinc-300 dark:hover:text-emerald-300 border border-slate-300 dark:border-zinc-700/60'
                      }`}
                    >
                      {isCommitted ? (
                        <>
                          <Check className="w-4 h-4 stroke-[3]" />
                          <span>Action Committed</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4" />
                          <span>Commit to Action</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
