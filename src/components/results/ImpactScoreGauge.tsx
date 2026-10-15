import { Award, Info, Home, Car, Plane, Utensils, ShoppingBag, Recycle, Leaf } from 'lucide-react';
import type { CalculationResult, CategoryKey } from '../../types/calculator';

interface ImpactScoreGaugeProps {
  result: CalculationResult;
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

export const ImpactScoreGauge: React.FC<ImpactScoreGaugeProps> = ({ result }) => {
  const score = Math.max(0, Math.min(100, Math.round(result.impactScore)));

  const scoreRating = 
    score >= 85 ? { text: 'Climate Champion (Near 1.5°C)', color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-950/60', border: 'border-emerald-300 dark:border-emerald-500/50' } :
    score >= 70 ? { text: 'Low Carbon Pioneer', color: 'text-teal-600 dark:text-teal-400', bg: 'bg-teal-100 dark:bg-teal-950/60', border: 'border-teal-300 dark:border-teal-500/50' } :
    score >= 50 ? { text: 'Moderate Impact', color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-950/60', border: 'border-amber-300 dark:border-amber-500/50' } :
    { text: 'High Carbon Intensity', color: 'text-rose-600 dark:text-rose-400', bg: 'bg-rose-100 dark:bg-rose-950/60', border: 'border-rose-300 dark:border-rose-500/50' };

  // Gauge calculations for semi-circle arc (180 degrees)
  const radius = 60;
  const strokeWidth = 10;
  const circumference = Math.PI * radius; // Half-circle circumference
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="rounded-3xl bg-white dark:bg-[#08110c]/90 border border-slate-200 dark:border-emerald-500/30 p-6 sm:p-8 shadow-xl dark:shadow-2xl backdrop-blur-md transition-colors">
      
      {/* Title & Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 mb-6 border-b border-slate-200 dark:border-emerald-950/70">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Lifestyle Decarbonization Index</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Personal Sustainability Rating
          </h3>
        </div>

        {/* Big Overall Score Readout with Semi-gauge */}
        <div className="flex items-center gap-4">
          <div className="relative w-28 h-16 flex items-end justify-center overflow-hidden">
            <svg className="w-28 h-28 transform -rotate-90 origin-bottom" viewBox="0 0 140 140">
              {/* Background Arc */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="currentColor"
                className="text-slate-200 dark:text-zinc-800"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset="0"
              />
              {/* Active Progress Arc */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke="url(#scoreGradient)"
                strokeWidth={strokeWidth}
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#ef4444" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            {/* Score Center Text */}
            <div className="absolute bottom-0 inset-x-0 flex flex-col items-center leading-none">
              <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">{score}</span>
              <span className="text-[10px] font-mono text-slate-400">/ 100</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] font-mono uppercase tracking-wider text-slate-500 dark:text-zinc-400">Index Tier</div>
            <div className={`text-xs font-bold font-mono px-2.5 py-1 rounded-lg border ${scoreRating.bg} ${scoreRating.color} ${scoreRating.border} mt-0.5 inline-block`}>
              {scoreRating.text}
            </div>
          </div>
        </div>
      </div>

      {/* Category Sub-scores Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {result.categoryList.slice(0, 6).map(cat => {
          const CatIcon = CATEGORY_ICONS[cat.category] || Home;

          return (
            <div
              key={cat.category}
              className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#050a07] border border-slate-200 dark:border-emerald-950/70 flex flex-col justify-between gap-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white"
                    style={{ backgroundColor: cat.color }}
                  >
                    <CatIcon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate">{cat.label}</span>
                </div>

                <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                  {cat.score}<span className="text-[10px] font-normal text-slate-400">/100</span>
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${cat.score}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>

              <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-zinc-400">
                <span>{cat.tonnes} t CO₂e</span>
                <span>{cat.percentage}% of footprint</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Educational Disclaimer */}
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-emerald-950/70 flex items-start gap-2.5 text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
        <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
        <span>
          <strong>Methodological Note:</strong> This Impact Rating (0–100) measures alignment with IPCC 1.5°C lifestyle carbon budgets (2.1t per capita ceiling by 2030). High scores reflect low operational reliance on fossil fuels, regional mass-transit adoption, and high electrical efficiency.
        </span>
      </div>

    </div>
  );
};
