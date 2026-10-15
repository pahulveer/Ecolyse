import React, { useMemo } from 'react';
import { 
  Sliders, 
  RotateCcw, 
  TrendingDown, 
  Car, 
  Zap, 
  Utensils, 
  Plane, 
  Trash2, 
  ShoppingBag,
  Sparkles
} from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import { calculateSimulatedFootprint } from '../../utils/calculationEngine';
import { playSliderSound, playToggleSound } from '../../utils/soundEffects';

interface PresetConfig {
  id: string;
  name: string;
  icon: string;
  description: string;
  overrides: {
    reduceCarTravelPercent: number;
    cleanElectricityPercent: number;
    dietShiftPlantShare: number;
    reduceFlightsCount: number;
    eliminateFoodWaste: boolean;
    buySecondHandPercent: number;
  };
}

const PRESETS: PresetConfig[] = [
  {
    id: 'metro',
    name: 'Metro Commuter',
    icon: 'Car',
    description: 'Switch 60% of driving to public metro/transit and take trains for regional trips',
    overrides: {
      reduceCarTravelPercent: 60,
      cleanElectricityPercent: 0,
      dietShiftPlantShare: 0,
      reduceFlightsCount: 1,
      eliminateFoodWaste: false,
      buySecondHandPercent: 0,
    }
  },
  {
    id: 'solar',
    name: 'Solar Powerhouse',
    icon: 'Zap',
    description: 'Adopt 100% rooftop solar under PM Surya Ghar Muft Bijli Yojana',
    overrides: {
      reduceCarTravelPercent: 0,
      cleanElectricityPercent: 100,
      dietShiftPlantShare: 0,
      reduceFlightsCount: 0,
      eliminateFoodWaste: false,
      buySecondHandPercent: 0,
    }
  },
  {
    id: 'plant',
    name: 'Plant Forward',
    icon: 'Utensils',
    description: 'Embrace a plant-rich diet with millets & zero kitchen food waste',
    overrides: {
      reduceCarTravelPercent: 0,
      cleanElectricityPercent: 0,
      dietShiftPlantShare: 50,
      reduceFlightsCount: 0,
      eliminateFoodWaste: true,
      buySecondHandPercent: 0,
    }
  },
  {
    id: 'paris',
    name: '1.5°C Paris Pledge',
    icon: 'Leaf',
    description: 'Maximum ambition across transit, renewable solar, circular goods & diet',
    overrides: {
      reduceCarTravelPercent: 60,
      cleanElectricityPercent: 100,
      dietShiftPlantShare: 50,
      reduceFlightsCount: 2,
      eliminateFoodWaste: true,
      buySecondHandPercent: 60,
    }
  }
];

export const WhatIfSimulator: React.FC = () => {
  const { 
    state, 
    calculationResult, 
    whatIfOverrides, 
    updateWhatIfOverride, 
    resetWhatIfOverrides 
  } = useCalculator();

  const simulation = useMemo(() => {
    return calculateSimulatedFootprint(state, whatIfOverrides);
  }, [state, whatIfOverrides]);

  const hasAdjustments = 
    whatIfOverrides.reduceCarTravelPercent > 0 ||
    whatIfOverrides.cleanElectricityPercent > 0 ||
    whatIfOverrides.dietShiftPlantShare > 0 ||
    whatIfOverrides.reduceFlightsCount > 0 ||
    whatIfOverrides.eliminateFoodWaste ||
    whatIfOverrides.buySecondHandPercent > 0;

  const applyPreset = (preset: PresetConfig) => {
    playToggleSound(true);
    Object.entries(preset.overrides).forEach(([key, val]) => {
      updateWhatIfOverride(key as keyof typeof preset.overrides, val as never);
    });
  };

  return (
    <div 
      id="what-if-simulator"
      className="scroll-mt-24 rounded-3xl bg-gradient-to-b from-slate-50 via-white to-emerald-50/20 dark:from-[#0e1b15] dark:to-[#070e0a] border border-slate-200 dark:border-emerald-500/30 p-6 sm:p-8 shadow-xl dark:shadow-2xl backdrop-blur-md transition-colors"
    >
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-200 dark:border-emerald-950/70">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 font-semibold">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Decarbonization Sandbox</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold font-heading text-slate-900 dark:text-white">
            What if you changed one thing?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-300 mt-1 max-w-xl">
            Simulate real-time lifestyle adjustments and technology pivots to observe your hypothetical emissions reduction trajectory.
          </p>
        </div>

        {hasAdjustments && (
          <button
            type="button"
            onClick={resetWhatIfOverrides}
            className="self-start sm:self-center flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-700/60 transition-all cursor-pointer shadow-xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Sliders</span>
          </button>
        )}
      </div>

      {/* Quick Pivot Presets */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2.5 px-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Scenario Presets:</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {PRESETS.map(preset => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className="p-3 rounded-2xl bg-white dark:bg-[#09130e] border border-slate-200 dark:border-emerald-950/70 hover:border-emerald-500/60 dark:hover:border-emerald-500/60 text-left transition-all cursor-pointer group shadow-xs hover:shadow-md"
            >
              <div className="flex items-center gap-2 font-bold text-xs text-slate-800 dark:text-zinc-200 group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                <span>{preset.name}</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-tight">
                {preset.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Live Twin Footprint Comparison Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-[#050a07] border border-slate-200 dark:border-emerald-500/40 mb-8 items-center text-center shadow-inner">
        
        {/* 1. Baseline */}
        <div className="p-2">
          <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-wider font-medium">Current Baseline</div>
          <div className="text-3xl font-extrabold font-mono text-slate-800 dark:text-zinc-300 mt-1">
            {calculationResult.totalTonnes} <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">t</span>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono mt-0.5">Calculated carbon load</div>
        </div>

        {/* 2. Abatement Callout */}
        <div className="p-2 flex flex-col items-center justify-center border-y sm:border-y-0 sm:border-x border-slate-200 dark:border-emerald-950/60 py-3 sm:py-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase font-mono tracking-wider">
            <TrendingDown className="w-4 h-4 text-emerald-500" />
            <span>Abatement Potential</span>
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-600 dark:text-emerald-300 mt-0.5">
            -{simulation.reductionTonnes} <span className="text-xs font-normal">t CO₂e</span>
          </div>
          <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md mt-1">
            ↓ {simulation.reductionPercentage}% reduction achieved
          </div>
        </div>

        {/* 3. Simulated Footprint */}
        <div className="p-2">
          <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 uppercase font-bold tracking-wider">
            Simulated Footprint
          </div>
          <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-900 dark:text-white mt-1">
            {simulation.simulatedTotal} <span className="text-xs font-normal text-slate-500 dark:text-zinc-400">t</span>
          </div>
          <div className="text-[11px] font-semibold text-emerald-700 dark:text-teal-300 font-mono mt-0.5">
            {simulation.simulatedTotal <= 2.1 ? '✓ Within Paris 1.5°C Ceiling' : `~${(simulation.simulatedTotal - 2.1).toFixed(1)}t above 2030 target`}
          </div>
        </div>

      </div>

      {/* Interactive Levers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Lever 1: Reduce car commuting */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#09130e] border border-slate-200 dark:border-emerald-950/70 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-sm font-bold text-slate-800 dark:text-zinc-200">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Car className="w-4 h-4" />
              </div>
              <span>Shift car commute to Metro or EV</span>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-1 rounded-md border border-emerald-200 dark:border-emerald-900/50">
              {whatIfOverrides.reduceCarTravelPercent}% cut
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={60}
            step={10}
            value={whatIfOverrides.reduceCarTravelPercent}
            onChange={e => {
              const val = Number(e.target.value);
              playSliderSound(val, 0, 60);
              updateWhatIfOverride('reduceCarTravelPercent', val);
            }}
            className="w-full accent-emerald-500 cursor-pointer h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-zinc-400">
            <span>0% (no change)</span>
            <span>-30% (Metro / EV 2 days)</span>
            <span>-60% (regular Metro)</span>
          </div>
        </div>

        {/* Lever 2: Rooftop Solar PM Surya Ghar */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#09130e] border border-slate-200 dark:border-emerald-950/70 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-sm font-bold text-slate-800 dark:text-zinc-200">
              <div className="p-2 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400">
                <Zap className="w-4 h-4" />
              </div>
              <span>Install PM Surya Ghar Rooftop Solar</span>
            </div>
            <span className="font-mono text-xs font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/50 px-2 py-1 rounded-md border border-teal-200 dark:border-teal-900/50">
              {whatIfOverrides.cleanElectricityPercent}% solar
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={100}
            step={25}
            value={whatIfOverrides.cleanElectricityPercent}
            onChange={e => {
              const val = Number(e.target.value);
              playSliderSound(val, 0, 100);
              updateWhatIfOverride('cleanElectricityPercent', val);
            }}
            className="w-full accent-teal-500 cursor-pointer h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-zinc-400">
            <span>Grid coal mix</span>
            <span>50% solar offset</span>
            <span>100% solar net-zero</span>
          </div>
        </div>

        {/* Lever 3: Plant-forward diet shift */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#09130e] border border-slate-200 dark:border-emerald-950/70 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-sm font-bold text-slate-800 dark:text-zinc-200">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
                <Utensils className="w-4 h-4" />
              </div>
              <span>Shift towards Pure Veg & Millets</span>
            </div>
            <span className="font-mono text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-1 rounded-md border border-amber-200 dark:border-amber-900/50">
              {whatIfOverrides.dietShiftPlantShare === 0 ? 'Current diet' :
               whatIfOverrides.dietShiftPlantShare <= 25 ? 'Eggetarian' : 'Pure Vegetarian'}
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={75}
            step={25}
            value={whatIfOverrides.dietShiftPlantShare}
            onChange={e => {
              const val = Number(e.target.value);
              playSliderSound(val, 0, 75);
              updateWhatIfOverride('dietShiftPlantShare', val);
            }}
            className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-zinc-400">
            <span>Current</span>
            <span>2 Veg Days</span>
            <span>Eggetarian</span>
            <span>Pure Veg</span>
          </div>
        </div>

        {/* Lever 4: Choose Vande Bharat / Train */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#09130e] border border-slate-200 dark:border-emerald-950/70 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-sm font-bold text-slate-800 dark:text-zinc-200">
              <div className="p-2 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400">
                <Plane className="w-4 h-4" />
              </div>
              <span>Choose Vande Bharat over short flights</span>
            </div>
            <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-950/50 px-2 py-1 rounded-md border border-cyan-200 dark:border-cyan-900/50">
              -{whatIfOverrides.reduceFlightsCount} flight(s)
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={4}
            step={1}
            value={whatIfOverrides.reduceFlightsCount}
            onChange={e => {
              const val = Number(e.target.value);
              playSliderSound(val, 0, 4);
              updateWhatIfOverride('reduceFlightsCount', val);
            }}
            className="w-full accent-cyan-500 cursor-pointer h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-zinc-400">
            <span>0 (no change)</span>
            <span>-1 flight (Train)</span>
            <span>-2 flights</span>
            <span>-4 flights</span>
          </div>
        </div>

        {/* Lever 5: Kabadiwala & zero kitchen waste */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#09130e] border border-slate-200 dark:border-emerald-950/70 flex items-center justify-between shadow-xs">
          <div className="space-y-1 pr-4">
            <div className="flex items-center gap-2.5 text-sm font-bold text-slate-800 dark:text-zinc-200">
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                <Trash2 className="w-4 h-4" />
              </div>
              <span>Zero Kitchen Waste & Doorstep Kabadiwala</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-zinc-400">
              Recycle dry raddi/boxes and compost kitchen peels to eliminate landfill methane emissions.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              const next = !whatIfOverrides.eliminateFoodWaste;
              playToggleSound(next);
              updateWhatIfOverride('eliminateFoodWaste', next);
            }}
            className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
              whatIfOverrides.eliminateFoodWaste ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-zinc-800'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                whatIfOverrides.eliminateFoodWaste ? 'translate-x-7' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Lever 6: Circular shopping / second-hand */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#09130e] border border-slate-200 dark:border-emerald-950/70 space-y-3 shadow-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 text-sm font-bold text-slate-800 dark:text-zinc-200">
              <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span>Buy Refurbished Devices & Circular Goods</span>
            </div>
            <span className="font-mono text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 px-2 py-1 rounded-md border border-purple-200 dark:border-purple-900/50">
              {whatIfOverrides.buySecondHandPercent}% reuse
            </span>
          </div>

          <input
            type="range"
            min={0}
            max={80}
            step={20}
            value={whatIfOverrides.buySecondHandPercent}
            onChange={e => {
              const val = Number(e.target.value);
              playSliderSound(val, 0, 80);
              updateWhatIfOverride('buySecondHandPercent', val);
            }}
            className="w-full accent-purple-500 cursor-pointer h-2 bg-slate-200 dark:bg-zinc-800 rounded-lg"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500 dark:text-zinc-400">
            <span>Current</span>
            <span>20% refurbished</span>
            <span>50% circular</span>
            <span>80% circular</span>
          </div>
        </div>

      </div>

    </div>
  );
};
