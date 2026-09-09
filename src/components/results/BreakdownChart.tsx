import React, { useState } from 'react';
import { 
  Home, Car, Plane, Utensils, ShoppingBag, Recycle, Leaf, Info, ChevronRight 
} from 'lucide-react';
import type { CalculationResult, CategoryResult, CategoryKey } from '../../types/calculator';

interface BreakdownChartProps {
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

export const BreakdownChart: React.FC<BreakdownChartProps> = ({ result }) => {
  const categoryList = result?.categoryList || [];
  const categories = result?.categories || ({} as Record<CategoryKey, CategoryResult>);

  const [selectedCategoryKey, setSelectedCategoryKey] = useState<CategoryKey>(
    categoryList[0]?.category || 'home'
  );

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

  return (
    <div className="rounded-3xl bg-[#09120e]/90 border border-emerald-500/20 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      
      {/* Title */}
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-emerald-950/60">
        <div>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Footprint Breakdown by Category
          </h3>
          <p className="text-xs text-zinc-400 mt-0.5">
            Hover or tap any sector to inspect specific upstream contributors and emission vectors.
          </p>
        </div>
        <span className="text-xs font-mono text-emerald-400 font-semibold px-2.5 py-1 rounded-md bg-emerald-950/50 border border-emerald-900/50">
          7 Categories
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left: Interactive SVG Donut Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72">
            <svg className="w-full h-full" viewBox="0 0 240 240">
              {/* Background Track */}
              <circle
                cx="120"
                cy="120"
                r="85"
                fill="none"
                stroke="rgba(16, 185, 129, 0.08)"
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
                    className="cursor-pointer transition-all duration-200 hover:opacity-90"
                    style={{
                      filter: isSelected ? `drop-shadow(0 0 8px ${seg.color}88)` : 'none'
                    }}
                    onMouseEnter={() => setSelectedCategoryKey(seg.category)}
                    onClick={() => setSelectedCategoryKey(seg.category)}
                  />
                );
              })}
            </svg>

            {/* Center Label in Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
              <IconComponent className="w-6 h-6 text-emerald-400 mb-1" />
              <div className="text-2xl font-extrabold font-mono text-white leading-none">
                {selectedCategory.percentage}%
              </div>
              <div className="text-xs font-medium text-emerald-300 truncate max-w-[120px] mt-0.5">
                {selectedCategory.label}
              </div>
              <div className="text-[10px] text-zinc-400 font-mono">
                {selectedCategory.tonnes} t CO₂e
              </div>
            </div>
          </div>

          <p className="text-[11px] text-zinc-400 mt-2 font-mono text-center">
            Tap a segment or category below to inspect
          </p>
        </div>

        {/* Right: Selected Category Deep-Dive Inspector */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Active Category Header Card */}
          <div className="p-4 rounded-2xl bg-[#0e1913] border border-emerald-500/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-carbon-950 font-bold"
                style={{ backgroundColor: selectedCategory.color }}
              >
                <IconComponent className="w-5 h-5 text-carbon-950" />
              </div>
              <div>
                <h4 className="text-base font-bold text-white">
                  {selectedCategory.label}
                </h4>
                <p className="text-xs text-zinc-400 font-mono">
                  {selectedCategory.tonnes} tonnes CO₂e • {selectedCategory.percentage}% of your total
                </p>
              </div>
            </div>

            <div className="text-right">
              <div className="text-[10px] uppercase font-mono text-zinc-400">Category Score</div>
              <div className="text-base font-bold font-mono text-emerald-300">
                {selectedCategory.score} / 100
              </div>
            </div>
          </div>

          {/* Sub-Contributors List */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-zinc-300 uppercase tracking-wider px-1">
              Primary Contributor Breakdown:
            </div>
            
            {(selectedCategory?.contributors || []).map(item => (
              <div
                key={item.name}
                className="p-3 rounded-xl bg-[#070c09] border border-emerald-950/70 flex items-center justify-between gap-3 text-xs"
              >
                <div className="min-w-0">
                  <div className="font-semibold text-zinc-200 truncate">{item.name}</div>
                  <div className="text-[11px] text-zinc-400 truncate">{item.description}</div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono font-bold text-emerald-400">
                    {item.tonnes > 0 ? `+${item.tonnes} t` : item.tonnes < 0 ? `${item.tonnes} t` : '0.0 t'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Category Selector Grid */}
          <div className="pt-3 border-t border-emerald-950/60">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {result.categoryList.map(cat => {
                const isSelected = selectedCategoryKey === cat.category;
                const CatIcon = CATEGORY_ICONS[cat.category] || Home;

                return (
                  <button
                    key={cat.category}
                    onClick={() => setSelectedCategoryKey(cat.category)}
                    className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-400 text-white'
                        : 'bg-[#070c09]/60 border-zinc-800/60 hover:bg-emerald-950/20 text-zinc-400'
                    }`}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full shrink-0" 
                      style={{ backgroundColor: cat.color }} 
                    />
                    <div className="truncate min-w-0">
                      <div className="text-[11px] font-medium truncate">{cat.label}</div>
                      <div className="text-[10px] font-mono text-zinc-400">{cat.tonnes}t ({cat.percentage}%)</div>
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
