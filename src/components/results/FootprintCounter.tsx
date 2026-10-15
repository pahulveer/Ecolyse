import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, TrendingUp, Target, Globe2, Flag, Car, Trees, Calendar, Scale } from 'lucide-react';
import type { CalculationResult } from '../../types/calculator';
import { springPop, springSmooth } from '../common/MotionPrimitives';
import { playSelectSound } from '../../utils/soundEffects';

interface FootprintCounterProps {
  result: CalculationResult;
}

type FootprintUnit = 'annual' | 'daily' | 'car_km' | 'trees';

export const FootprintCounter: React.FC<FootprintCounterProps> = ({ result }) => {
  const [displayedValue, setDisplayedValue] = useState(0);
  const [selectedUnit, setSelectedUnit] = useState<FootprintUnit>('annual');

  const totalTonnes = Number(result?.totalTonnes) || 0;

  useEffect(() => {
    let start = 0;
    const end = totalTonnes;
    const duration = 1200; // ms
    const steps = 40;
    const stepTime = duration / steps;
    const stepVal = end / steps;

    const timer = setInterval(() => {
      start += stepVal;
      if (start >= end) {
        setDisplayedValue(end);
        clearInterval(timer);
      } else {
        setDisplayedValue(Number(start.toFixed(2)));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [totalTonnes]);

  const vsIndia = Number(result?.benchmarkComparison?.vsIndiaPercentage) || 0;
  const isLowerThanIndia = vsIndia <= 0;

  // Computed metrics for intuitive unit toggles
  const dailyKg = ((displayedValue * 1000) / 365).toFixed(1);
  const carKm = Math.round((displayedValue * 1000) / 0.170).toLocaleString();
  const treesNeeded = Math.round(displayedValue / 0.022).toLocaleString();

  const units: { id: FootprintUnit; label: string; icon: React.ReactNode }[] = [
    { id: 'annual', label: 'Annual Tonnes', icon: <Scale className="w-3.5 h-3.5" /> },
    { id: 'daily', label: 'Daily kg', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'car_km', label: 'Car km Equivalent', icon: <Car className="w-3.5 h-3.5" /> },
    { id: 'trees', label: 'Trees Needed', icon: <Trees className="w-3.5 h-3.5" /> },
  ];

  return (
    <div className="rounded-3xl bg-white dark:bg-gradient-to-b dark:from-[#0e1a14] dark:to-[#070c09] border border-slate-200 dark:border-emerald-500/30 p-6 sm:p-8 shadow-xl dark:shadow-2xl relative overflow-hidden text-center transition-colors">
      
      {/* Subtle backdrop glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Eyebrow badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-400 text-xs font-mono mb-4 uppercase tracking-widest font-semibold">
        <span>INDIA CEA & IPCC CALIBRATED ASSESSMENT</span>
      </div>

      <h2 className="text-xs sm:text-sm font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-heading">
        YOUR ESTIMATED CARBON FOOTPRINT
      </h2>

      {/* Interactive Unit Toggles */}
      <div className="mt-3 inline-flex flex-wrap items-center justify-center gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-zinc-900/80 border border-slate-200 dark:border-zinc-800/80">
        {units.map((u) => {
          const isSelected = selectedUnit === u.id;
          return (
            <button
              key={u.id}
              onClick={() => {
                playSelectSound();
                setSelectedUnit(u.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isSelected
                  ? 'bg-white dark:bg-emerald-500 text-emerald-900 dark:text-carbon-950 shadow-sm dark:shadow-emerald-500/20'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
              }`}
            >
              {u.icon}
              <span>{u.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Counter Readout */}
      <div className="my-5 min-h-[100px] flex items-center justify-center">
        <AnimatePresence mode="wait">
          {selectedUnit === 'annual' && (
            <motion.div
              key="annual"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={springPop}
              className="flex items-baseline justify-center gap-2.5"
            >
              <span className="text-6xl sm:text-7xl lg:text-8xl font-black font-mono tracking-tight text-slate-900 dark:text-white dark:glow-text-emerald">
                {(Number(displayedValue) || 0).toFixed(1)}
              </span>
              <div className="text-left font-sans">
                <div className="text-base sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 leading-none">tonnes</div>
                <div className="text-xs text-slate-500 dark:text-zinc-400 font-mono">CO₂e / year</div>
              </div>
            </motion.div>
          )}

          {selectedUnit === 'daily' && (
            <motion.div
              key="daily"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={springPop}
              className="flex items-baseline justify-center gap-2.5"
            >
              <span className="text-6xl sm:text-7xl lg:text-8xl font-black font-mono tracking-tight text-slate-900 dark:text-white dark:glow-text-emerald">
                {dailyKg}
              </span>
              <div className="text-left font-sans">
                <div className="text-base sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 leading-none">kg</div>
                <div className="text-xs text-slate-500 dark:text-zinc-400 font-mono">CO₂e / day</div>
              </div>
            </motion.div>
          )}

          {selectedUnit === 'car_km' && (
            <motion.div
              key="car_km"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={springPop}
              className="flex items-baseline justify-center gap-2.5"
            >
              <span className="text-5xl sm:text-6xl lg:text-7xl font-black font-mono tracking-tight text-slate-900 dark:text-white dark:glow-text-emerald">
                {carKm}
              </span>
              <div className="text-left font-sans">
                <div className="text-base sm:text-xl font-bold text-teal-600 dark:text-teal-400 leading-none">km</div>
                <div className="text-xs text-slate-500 dark:text-zinc-400 font-mono">Petrol Car Eq.</div>
              </div>
            </motion.div>
          )}

          {selectedUnit === 'trees' && (
            <motion.div
              key="trees"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={springPop}
              className="flex items-baseline justify-center gap-2.5"
            >
              <span className="text-5xl sm:text-6xl lg:text-7xl font-black font-mono tracking-tight text-slate-900 dark:text-white dark:glow-text-emerald">
                ~{treesNeeded}
              </span>
              <div className="text-left font-sans">
                <div className="text-base sm:text-xl font-bold text-emerald-600 dark:text-emerald-400 leading-none">trees</div>
                <div className="text-xs text-slate-500 dark:text-zinc-400 font-mono">To sequester 1 yr</div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Comparison Pill */}
      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#09140f] border border-slate-200 dark:border-emerald-800/40 text-xs sm:text-sm font-medium mb-8">
        {isLowerThanIndia ? (
          <>
            <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-slate-700 dark:text-emerald-300">
              <strong className="text-emerald-700 dark:text-emerald-200">{Math.abs(vsIndia)}% lower</strong> than India National Average ({result?.benchmarkComparison?.indiaAverage ?? 1.9} t)
            </span>
          </>
        ) : (
          <>
            <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-slate-700 dark:text-amber-300">
              <strong className="text-amber-700 dark:text-amber-200">{vsIndia}% higher</strong> than India National Average ({result?.benchmarkComparison?.indiaAverage ?? 1.9} t)
            </span>
          </>
        )}
      </div>

      {/* Benchmark Comparisons Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-200 dark:border-emerald-950/80 text-left">
        
        {/* Benchmark 1: India National Average */}
        <motion.div 
          whileHover={{ y: -2 }}
          transition={springSmooth}
          className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-900/40 shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400 mb-1">
            <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-zinc-200">
              <Flag className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>India National Avg</span>
            </span>
            <span className="font-mono text-emerald-700 dark:text-emerald-300 font-bold text-sm">1.9 t</span>
          </div>
          <div className="text-xs text-slate-600 dark:text-zinc-400">
            {result.totalTonnes <= 1.9 ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">✓ Below India's per-capita baseline</span>
            ) : (
              <span>{(result.totalTonnes - 1.9).toFixed(1)} t above India baseline</span>
            )}
          </div>
        </motion.div>

        {/* Benchmark 2: Paris 2030 Target */}
        <motion.div 
          whileHover={{ y: -2 }}
          transition={springSmooth}
          className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-900/40 shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400 mb-1">
            <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-zinc-200">
              <Target className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Paris 2030 Ceiling</span>
            </span>
            <span className="font-mono text-teal-700 dark:text-teal-300 font-bold text-sm">2.1 t</span>
          </div>
          <div className="text-xs text-slate-600 dark:text-zinc-400">
            {result.totalTonnes <= 2.1 ? (
              <span className="text-emerald-700 dark:text-emerald-400 font-semibold">✓ Aligned with 1.5°C climate limit</span>
            ) : (
              <span>~{(result.totalTonnes - 2.1).toFixed(1)} t above 2030 target</span>
            )}
          </div>
        </motion.div>

        {/* Benchmark 3: Global & US Average */}
        <motion.div 
          whileHover={{ y: -2 }}
          transition={springSmooth}
          className="p-4 rounded-2xl bg-slate-50 dark:bg-emerald-950/20 border border-slate-200 dark:border-emerald-900/40 shadow-sm"
        >
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400 mb-1">
            <span className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-zinc-200">
              <Globe2 className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Global Average</span>
            </span>
            <span className="font-mono text-amber-700 dark:text-amber-300 font-bold text-sm">4.8 t</span>
          </div>
          <div className="text-xs text-slate-600 dark:text-zinc-400">
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
              {Math.max(0, Math.round(((4.8 - result.totalTonnes) / 4.8) * 100))}% lower than world average (US: 14.9 t)
            </span>
          </div>
        </motion.div>

      </div>

    </div>
  );
};
