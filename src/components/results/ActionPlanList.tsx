import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  TrendingDown, 
  Clock, 
  DollarSign, 
  Gauge, 
  Sparkles,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { ActionRecommendation } from '../../types/calculator';
import { useCalculator } from '../../context/CalculatorContext';

interface ActionPlanListProps {
  recommendations: ActionRecommendation[];
}

export const ActionPlanList: React.FC<ActionPlanListProps> = ({ recommendations }) => {
  const { committedActionIds, toggleCommitAction, totalCommittedSavings } = useCalculator();

  const handleToggleCommit = (rec: ActionRecommendation) => {
    const isNowCommitted = !committedActionIds.includes(rec.id);
    toggleCommitAction(rec.id);

    if (isNowCommitted) {
      // Fire confetti burst
      try {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#10b981', '#34d399', '#06b6d4', '#f59e0b']
        });
      } catch {}
    }
  };

  return (
    <div className="rounded-3xl bg-[#08100c]/90 border border-emerald-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      
      {/* Header with committed progress tracker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-emerald-950/70">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Personalized Decarbonization Plan</span>
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            Your Top 5 Reduction Opportunities
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl">
            Prioritized specifically by highest return on effort based on your assessment answers.
          </p>
        </div>

        {/* Committed Savings Pill */}
        <div className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[10px] uppercase font-mono text-zinc-400">Total Committed Abatement</div>
            <div className="text-base font-extrabold font-mono text-emerald-300">
              -{totalCommittedSavings.toFixed(2)} <span className="text-xs font-normal text-zinc-400">t CO₂e / yr</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-4">
        {recommendations.map((rec, index) => {
          const isCommitted = committedActionIds.includes(rec.id);

          return (
            <div
              key={rec.id}
              className={`p-5 sm:p-6 rounded-2xl border transition-all duration-200 ${
                isCommitted
                  ? 'bg-emerald-950/40 border-emerald-400/80 shadow-lg shadow-emerald-950/50'
                  : 'bg-[#050a07] border-emerald-950/70 hover:border-emerald-800/60'
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Left: Info */}
                <div className="space-y-2 max-w-2xl">
                  
                  {/* Badges row */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-emerald-400">
                      0{index + 1}
                    </span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {rec.badge}
                    </span>
                    
                    <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                      <Gauge className="w-3 h-3 text-zinc-500" />
                      <span>{rec.difficulty}</span>
                    </span>

                    <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                      <DollarSign className="w-3 h-3 text-zinc-500" />
                      <span>{rec.cost}</span>
                    </span>

                    <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                      <Clock className="w-3 h-3 text-zinc-500" />
                      <span>{rec.timeframe}</span>
                    </span>
                  </div>

                  {/* Title */}
                  <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                    {rec.title}
                  </h4>

                  {/* Explanation */}
                  <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
                    {rec.explanation}
                  </p>
                </div>

                {/* Right: Reduction Value & Action Commit Button */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between gap-3 shrink-0 pt-3 sm:pt-0 border-t sm:border-t-0 border-emerald-950/60">
                  <div className="text-left sm:text-right">
                    <div className="text-[10px] uppercase font-mono text-zinc-400">Potential Reduction</div>
                    <div className="text-lg sm:text-xl font-extrabold font-mono text-emerald-400 flex items-center sm:justify-end gap-1">
                      <TrendingDown className="w-4 h-4" />
                      <span>~{rec.potentialReductionTonnes.toFixed(2)} t</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleCommit(rec)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
                      isCommitted
                        ? 'bg-emerald-400 text-carbon-950 shadow-md shadow-emerald-500/30'
                        : 'bg-zinc-900 hover:bg-emerald-950 text-zinc-300 hover:text-emerald-300 border border-zinc-700/60'
                    }`}
                  >
                    {isCommitted ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 fill-carbon-950 text-emerald-400" />
                        <span>Committed</span>
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
        })}
      </div>

    </div>
  );
};
