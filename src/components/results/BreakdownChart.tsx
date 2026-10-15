import React, { useState } from 'react';
import { 
  Home, Car, Plane, Utensils, ShoppingBag, Recycle, Leaf, 
  PieChart as PieIcon, BarChart3, TrendingUp
} from 'lucide-react';
import type { CalculationResult, CategoryResult, CategoryKey } from '../../types/calculator';

interface BreakdownChartProps {
  result: CalculationResult;
}

const CATEGORY_ICONS: Record<CategoryKey, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  home: Home,
  transport: Car,
  travel: Plane,
  food: Utensils,
  shopping: ShoppingBag,
  waste: Recycle,
  lifestyle: Leaf,
};

export const BreakdownChart: React.FC<BreakdownChartProps> = ({ result }) => {
  const categoryList = result?.categoryList || [];
  const categories = result?.categories || ({} as Record<CategoryKey, CategoryResult>);

  const [selectedCategoryKey, setSelectedCategoryKey] = useState<CategoryKey>(
    categoryList[0]?.category || 'home'
  );
  const [viewMode, setViewMode] = useState<'donut' | 'bars'>('donut');

  const defaultCategory: CategoryResult = categoryList[0] || {
    category: 'home' as CategoryKey,
    label: 'Home & Electricity',
    icon: 'Home',
    tonnes: 0,
    percentage: 0,
    score: 100,
    color: '#10b981',
    contributors: []
  };

  const selectedCategory: CategoryResult = categories[selectedCategoryKey] || defaultCategory;
  const IconComponent = CATEGORY_ICONS[selectedCategory?.category] || Home;

  // Compute SVG Donut segments
  const total = Math.max(0.01, Number(result?.totalTonnes) || 0.01);
  let accumulatedAngle = 0;

  const segments = categoryList.map(cat => {
    const fraction = (Number(cat.tonnes) || 0) / total;
    const angle = fraction * 360;
    const startAngle = accumulatedAngle;
    accumulatedAngle += angle;

    return {
      category: cat.category,
      label: cat.label,
      tonnes: cat.tonnes,
      percentage: cat.percentage,
      color: cat.color,
      startAngle,
      angle,
      endAngle: startAngle + angle,
    };
  });

  // SVG arc path helper
  const describeArc = (x: number, y: number, radius: number, startAngle: number, endAngle: number) => {
    if (isNaN(startAngle) || isNaN(endAngle) || endAngle <= startAngle) return '';
    const startRad = ((startAngle - 90) * Math.PI) / 180.0;
    const endRad = ((endAngle - 90) * Math.PI) / 180.0;

    const x1 = x + radius * Math.cos(startRad);
    const y1 = y + radius * Math.sin(startRad);
    const x2 = x + radius * Math.cos(endRad);
    const y2 = y + radius * Math.sin(endRad);

    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
  };

  const maxCategoryTonnes = Math.max(...categoryList.map(c => c.tonnes), 0.1);

  return (
    <div className="rounded-3xl bg-white dark:bg-[#09120e]/90 border border-slate-200 dark:border-emerald-500/20 p-6 sm:p-8 shadow-xl dark:shadow-2xl backdrop-blur-md transition-colors">
      
      {/* Title & View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200 dark:border-emerald-950/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-white tracking-tight">
              Emission Breakdown by Sector
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
            Explore your footprint distribution and drill down into granular sub-contributors.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="inline-flex p-1 rounded-xl bg-slate-100 dark:bg-emerald-950/60 border border-slate-200 dark:border-emerald-900/50">
            <button
              onClick={() => setViewMode('donut')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                viewMode === 'donut'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Donut Distribution View"
            >
              <PieIcon className="w-3.5 h-3.5" />
              <span>Donut</span>
            </button>
            <button
              onClick={() => setViewMode('bars')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all ${
                viewMode === 'bars'
                  ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Ranked Bar View"
            >
              <BarChart3 className="w-3.5 h-3.5" />
              <span>Ranked Bars</span>
            </button>
          </div>
          <span className="hidden sm:inline-flex text-xs font-mono text-emerald-700 dark:text-emerald-400 font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-900/50">
            {categoryList.length} Sectors
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Visual Chart (Donut or Bars) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center pt-2">
          {viewMode === 'donut' ? (
            <div className="relative w-64 h-64 sm:w-72 sm:h-72">
              <svg className="w-full h-full" viewBox="0 0 240 240">
                {/* Background Track */}
                <circle
                  cx="120"
                  cy="120"
                  r="85"
                  fill="none"
                  stroke="currentColor"
                  className="text-slate-100 dark:text-emerald-950/40"
                  strokeWidth="28"
                />

                {/* Segments */}
                {segments.map(seg => {
                  if (seg.angle <= 0.5) return null;
                  const isSelected = selectedCategoryKey === seg.category;
                  const endAngle = Math.max(seg.startAngle + 0.5, seg.startAngle + seg.angle - (seg.angle > 3 ? 1.5 : 0));
                  const arcPath = describeArc(120, 120, 85, seg.startAngle, Math.min(seg.endAngle, endAngle));
                  if (!arcPath) return null;

                  return (
                    <path
                      key={seg.category}
                      d={arcPath}
                      fill="none"
                      stroke={seg.color}
                      strokeWidth={isSelected ? 34 : 26}
                      strokeLinecap="round"
                      className="cursor-pointer transition-all duration-300 hover:opacity-90"
                      style={{
                        filter: isSelected ? `drop-shadow(0 0 10px ${seg.color}99)` : 'none'
                      }}
                      onMouseEnter={() => setSelectedCategoryKey(seg.category)}
                      onClick={() => setSelectedCategoryKey(seg.category)}
                    />
                  );
                })}
              </svg>

              {/* Center Readout in Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center mb-1 text-white shadow-md transition-transform scale-105"
                  style={{ backgroundColor: selectedCategory.color }}
                >
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="text-2xl font-extrabold font-mono text-slate-900 dark:text-white leading-none">
                  {selectedCategory.percentage}%
                </div>
                <div className="text-xs font-semibold text-slate-700 dark:text-emerald-300 truncate max-w-[130px] mt-1">
                  {selectedCategory.label}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">
                  {selectedCategory.tonnes} t CO₂e
                </div>
              </div>
            </div>
          ) : (
            /* Ranked Bar Chart View */
            <div className="w-full space-y-3 px-1 py-2">
              {categoryList.map(cat => {
                const isSelected = selectedCategoryKey === cat.category;
                const CatIcon = CATEGORY_ICONS[cat.category] || Home;
                const barWidth = Math.max(4, Math.round((cat.tonnes / maxCategoryTonnes) * 100));

                return (
                  <button
                    key={cat.category}
                    onClick={() => setSelectedCategoryKey(cat.category)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 border-emerald-500 shadow-md ring-1 ring-emerald-500/50'
                        : 'bg-slate-50/70 dark:bg-[#070c09]/60 border-slate-200 dark:border-zinc-800/80 hover:bg-slate-100 dark:hover:bg-emerald-950/30'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-zinc-200">
                        <CatIcon className="w-3.5 h-3.5" style={{ color: cat.color }} />
                        <span>{cat.label}</span>
                      </div>
                      <span className="font-mono font-bold text-slate-800 dark:text-emerald-400">
                        {cat.tonnes} t ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-zinc-800 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${barWidth}%`,
                          backgroundColor: cat.color,
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-3 font-mono text-center">
            Interactive: Click any slice or sector to inspect sub-factors
          </p>
        </div>

        {/* Right Column: Selected Category Inspector */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Active Category Header Card */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-[#0e1913] border border-slate-200 dark:border-emerald-500/40 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3.5">
              <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-md font-bold shrink-0"
                style={{ backgroundColor: selectedCategory.color }}
              >
                <IconComponent className="w-6 h-6 text-white" />
              </div>
              <div>
                <h4 className="text-base font-bold font-heading text-slate-900 dark:text-white">
                  {selectedCategory.label}
                </h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400 font-mono mt-0.5">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{selectedCategory.tonnes} tonnes</span> CO₂e • <span className="font-bold">{selectedCategory.percentage}%</span> of total footprint
                </p>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-[10px] uppercase font-mono tracking-wider text-slate-500 dark:text-zinc-400">Sustainability Score</div>
              <div className="text-lg font-extrabold font-mono text-emerald-600 dark:text-emerald-300">
                {selectedCategory.score} <span className="text-xs text-slate-400 font-normal">/ 100</span>
              </div>
            </div>
          </div>

          {/* Sub-Contributors List */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider px-1">
              <span className="flex items-center gap-1.5">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
                Granular Factor Breakdown
              </span>
              <span className="text-[11px] font-mono text-slate-400 normal-case font-normal">
                {selectedCategory?.contributors?.length || 0} upstream drivers
              </span>
            </div>
            
            {(!selectedCategory?.contributors || selectedCategory.contributors.length === 0) ? (
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#070c09] border border-slate-200 dark:border-emerald-950/70 text-xs text-slate-500 text-center">
                No individual sub-factors recorded for this category.
              </div>
            ) : (
              selectedCategory.contributors.map(item => {
                const itemPercent = selectedCategory.tonnes > 0
                  ? Math.min(100, Math.max(0, Math.round((item.tonnes / selectedCategory.tonnes) * 100)))
                  : 0;

                return (
                  <div
                    key={item.name}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#070c09] border border-slate-200 dark:border-emerald-950/70 flex flex-col gap-1.5 text-xs transition-colors hover:border-emerald-400/40"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-800 dark:text-zinc-200 truncate">{item.name}</div>
                        <div className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">{item.description}</div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="font-mono font-bold text-emerald-700 dark:text-emerald-400">
                          {item.tonnes > 0 ? `+${item.tonnes} t` : item.tonnes < 0 ? `${item.tonnes} t` : '0.0 t'}
                        </span>
                        <div className="text-[10px] font-mono text-slate-400">
                          {itemPercent}% of sector
                        </div>
                      </div>
                    </div>

                    {/* Contributor relative sub-progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-zinc-800/80 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${itemPercent}%`,
                          backgroundColor: selectedCategory.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Sector Selector Grid */}
          <div className="pt-3 border-t border-slate-200 dark:border-emerald-950/60">
            <div className="text-xs font-semibold text-slate-500 dark:text-zinc-400 mb-2 px-1">
              Select Sector to Inspect:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {result.categoryList.map(cat => {
                const isSelected = selectedCategoryKey === cat.category;
                const CatIcon = CATEGORY_ICONS[cat.category] || Home;

                return (
                  <button
                    key={cat.category}
                    onClick={() => setSelectedCategoryKey(cat.category)}
                    className={`flex items-center gap-2 p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-100 dark:bg-emerald-950/80 border-emerald-500 dark:border-emerald-400 text-slate-900 dark:text-white shadow-sm ring-1 ring-emerald-500'
                        : 'bg-slate-50 dark:bg-[#070c09]/60 border-slate-200 dark:border-zinc-800/60 hover:bg-slate-100 dark:hover:bg-emerald-950/30 text-slate-600 dark:text-zinc-400'
                    }`}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs" 
                      style={{ backgroundColor: cat.color }} 
                    />
                    <div className="truncate min-w-0">
                      <div className="text-[11px] font-semibold truncate">{cat.label}</div>
                      <div className="text-[10px] font-mono opacity-80">{cat.tonnes}t ({cat.percentage}%)</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
