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
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import { calculateSimulatedFootprint } from '../../utils/calculationEngine';
import { playSliderSound, playToggleSound } from '../../utils/soundEffects';

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

  return (
    <div className="rounded-3xl bg-gradient-to-b from-[#0e1b15] to-[#070e0a] border border-emerald-500/30 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-emerald-950/70">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
            <Sliders className="w-3.5 h-3.5" />
            <span>Interactive Behavioral Simulator</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
            What if you changed one thing?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 mt-1 max-w-xl">
            Simulate real-time behavioral and technology pivots to observe your hypothetical decarbonization trajectory.
          </p>
        </div>

        {hasAdjustments && (
          <button
            type="button"
            onClick={resetWhatIfOverrides}
            className="self-start sm:self-center flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-white bg-zinc-900/60 border border-zinc-700/60 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Sliders</span>
          </button>
        )}
      </div>

      {/* Live Twin Footprint Comparison Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-2xl bg-[#050a07] border border-emerald-500/40 mb-8 items-center text-center">
        
        {/* 1. Baseline */}
        <div className="p-2">
          <div className="text-[11px] font-mono text-zinc-400 uppercase">Current Footprint</div>
          <div className="text-3xl font-extrabold font-mono text-zinc-300 mt-1">
            {calculationResult.totalTonnes} <span className="text-xs font-normal text-zinc-400">t</span>
          </div>
          <div className="text-[10px] text-zinc-400 font-mono mt-0.5">Calculated baseline</div>
        </div>

        {/* Arrow / Reduction callout */}
        <div className="p-2 flex flex-col items-center justify-center border-y sm:border-y-0 sm:border-x border-emerald-950/60 py-3 sm:py-0">
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 uppercase font-mono">
            <TrendingDown className="w-4 h-4 text-emerald-400" />
            <span>Abatement Potential</span>
          </div>
          <div className="text-2xl font-black font-mono text-emerald-300 mt-0.5">
            -{simulation.reductionTonnes} t CO₂e
          </div>
          <div className="text-xs font-medium text-emerald-400/80">
            ↓ {simulation.reductionPercentage}% overall cut
          </div>
        </div>

        {/* 2. Simulated Footprint */}
        <div className="p-2">
          <div className="text-[11px] font-mono text-emerald-400 uppercase font-semibold">
            Simulated Footprint
          </div>
          <div className="text-4xl font-extrabold font-mono text-white mt-1 glow-text-emerald">
            {simulation.simulatedTotal} <span className="text-xs font-normal text-zinc-400">t</span>
          </div>
          <div className="text-[10px] text-teal-300 font-mono mt-0.5">
            {simulation.simulatedTotal <= 2.1 ? '✓ Within Paris 1.5°C Ceiling' : `~${(simulation.simulatedTotal - 2.1).toFixed(1)}t above 2030 target`}
          </div>
        </div>

      </div>

      {/* Interactive Levers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Lever 1: Reduce car commuting / Switch to EV or Metro */}
        <div className="p-4 rounded-2xl bg-[#09130e] border border-emerald-950/70 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
              <Car className="w-4 h-4 text-emerald-400" />
              <span>Shift car commute to Metro or EV 2-Wheeler</span>
            </div>
            <span className="font-mono text-xs font-bold text-emerald-400">
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
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
            <span>0% (no change)</span>
            <span>-30% (Metro / EV 2 days)</span>
            <span>-60% (regular Metro)</span>
          </div>
        </div>

        {/* Lever 2: Rooftop Solar PM Surya Ghar */}
        <div className="p-4 rounded-2xl bg-[#09130e] border border-emerald-950/70 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
              <Zap className="w-4 h-4 text-teal-400" />
              <span>Install PM Surya Ghar Rooftop Solar</span>
            </div>
            <span className="font-mono text-xs font-bold text-teal-400">
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
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
            <span>Grid coal mix</span>
            <span>50% solar offset</span>
            <span>100% solar net-zero</span>
          </div>
        </div>

        {/* Lever 3: Plant-forward diet shift */}
        <div className="p-4 rounded-2xl bg-[#09130e] border border-emerald-950/70 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
              <Utensils className="w-4 h-4 text-amber-400" />
              <span>Shift towards Pure Veg & Millets</span>
            </div>
            <span className="font-mono text-xs font-bold text-amber-400">
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
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
            <span>Current</span>
            <span>2 Veg Days</span>
            <span>Eggetarian</span>
            <span>Pure Veg</span>
          </div>
        </div>

        {/* Lever 4: Choose Vande Bharat / Train */}
        <div className="p-4 rounded-2xl bg-[#09130e] border border-emerald-950/70 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
              <Plane className="w-4 h-4 text-cyan-400" />
              <span>Choose Vande Bharat / Train over regional flights</span>
            </div>
            <span className="font-mono text-xs font-bold text-cyan-400">
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
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
            <span>0 (no change)</span>
            <span>-1 flight (Train)</span>
            <span>-2 flights</span>
            <span>-4 flights</span>
          </div>
        </div>

        {/* Lever 5: Kabadiwala & zero kitchen waste */}
        <div className="p-4 rounded-2xl bg-[#09130e] border border-emerald-950/70 flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
              <Trash2 className="w-4 h-4 text-emerald-400" />
              <span>Zero Kitchen Waste & Doorstep Kabadiwala</span>
            </div>
            <p className="text-xs text-zinc-400">
              Recycle dry raddi/boxes and compost kitchen peels to eliminate methane.
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
              whatIfOverrides.eliminateFoodWaste ? 'bg-emerald-500' : 'bg-zinc-800'
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
        <div className="p-4 rounded-2xl bg-[#09130e] border border-emerald-950/70 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-zinc-200">
              <ShoppingBag className="w-4 h-4 text-purple-400" />
              <span>Buy Refurbished Devices & Avoid Fast Deliveries</span>
            </div>
            <span className="font-mono text-xs font-bold text-purple-400">
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
          />
          <div className="flex justify-between text-[10px] font-mono text-zinc-400">
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
