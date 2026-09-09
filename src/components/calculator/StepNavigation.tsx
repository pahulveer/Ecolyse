import React from 'react';
import { motion } from 'framer-motion';
import { Check, Home, Car, Plane, Utensils, ShoppingBag, Recycle, Leaf } from 'lucide-react';
import { CALCULATOR_STEPS } from '../../data/questions';
import { springPop, springSmooth } from '../common/MotionPrimitives';
import { playSelectSound } from '../../utils/soundEffects';
import { useTheme } from '../../context/ThemeContext';

interface StepNavigationProps {
  currentStepIndex: number;
  onSelectStep: (stepIndex: number) => void;
}

const STEP_ICONS = [Home, Car, Plane, Utensils, ShoppingBag, Recycle, Leaf];

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStepIndex,
  onSelectStep,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const progressPercent = ((currentStepIndex + 1) / CALCULATOR_STEPS.length) * 100;

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      {/* Top Header & Ticker */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springSmooth}
        className="flex items-center justify-between mb-3 px-1 text-xs"
      >
        <div className="flex items-center gap-2">
          <span className="font-mono text-emerald-400 font-semibold uppercase tracking-wider">
            STEP 0{currentStepIndex + 1} OF 07
          </span>
          <span className="text-zinc-500">•</span>
          <span className="font-medium text-zinc-300">
            {CALCULATOR_STEPS[currentStepIndex]?.title}
          </span>
        </div>
        <span className="font-mono text-xs text-zinc-400">
          {Math.round(progressPercent)}% Complete
        </span>
      </motion.div>

      {/* Smooth continuous progress bar track — spring-animated fill */}
      <div className="h-1.5 w-full bg-emerald-950/60 rounded-full overflow-hidden mb-6 border border-emerald-900/30">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
          animate={{ width: `${progressPercent}%` }}
          transition={{ type: 'spring', stiffness: 140, damping: 22 }}
        />
      </div>

      {/* Step Pills Navigation Bar */}
      <div className="hidden sm:grid grid-cols-7 gap-2">
        {CALCULATOR_STEPS.map((step, idx) => {
          const Icon = STEP_ICONS[idx] || Home;
          const isCurrent = idx === currentStepIndex;
          const isCompleted = idx < currentStepIndex;

          return (
            <motion.button
              key={step.category}
              onClick={() => {
                playSelectSound();
                onSelectStep(idx);
              }}
              whileHover={{
                scale: 1.08,
                y: -4,
                boxShadow: isCurrent
                  ? '0 12px 28px -4px rgba(52,211,153,0.45)'
                  : '0 10px 24px -4px rgba(16,185,129,0.25)',
              }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              className={`relative flex flex-col items-center p-2.5 rounded-xl border transition-all duration-200 text-center group ${
                isLight
                  ? isCurrent
                    ? 'bg-emerald-50 border-emerald-500 shadow-sm text-emerald-800 ring-2 ring-emerald-500/20'
                    : isCompleted
                      ? 'bg-white border-emerald-200 text-slate-700 hover:border-emerald-400 hover:bg-emerald-50/40'
                      : 'bg-white/70 border-slate-200 text-slate-400 hover:border-slate-300 hover:text-slate-600'
                  : isCurrent
                    ? 'bg-gradient-to-b from-emerald-950/80 to-[#09150f] border-emerald-400 shadow-md shadow-emerald-950 text-emerald-300 ring-2 ring-emerald-400/40'
                    : isCompleted
                      ? 'bg-[#0a120e]/80 border-emerald-900/50 text-zinc-300 hover:border-emerald-600/60 hover:bg-emerald-950/30'
                      : 'bg-[#070c09]/50 border-zinc-800/60 text-zinc-500 hover:border-emerald-800/40 hover:text-zinc-300'
              }`}
            >
              {/* Step indicator circle */}
              <motion.div
                animate={
                  isLight
                    ? isCurrent
                      ? { backgroundColor: '#059669', color: '#ffffff', scale: 1.1 }
                      : isCompleted
                        ? { backgroundColor: '#dcfce7', color: '#047857', scale: 1 }
                        : { backgroundColor: '#f1f5f9', color: '#64748b', scale: 1 }
                    : isCurrent
                      ? { backgroundColor: 'rgb(52 211 153)', color: 'rgb(5 13 8)', scale: 1.1 }
                      : isCompleted
                        ? { backgroundColor: 'rgb(16 29 21)', color: '#34d399', scale: 1 }
                        : { scale: 1 }
                }
                transition={springSmooth}
                className={`w-7 h-7 rounded-lg flex items-center justify-center mb-1 text-xs font-mono font-bold ${
                  isLight
                    ? isCurrent
                      ? 'text-white'
                      : isCompleted
                        ? 'text-emerald-700'
                        : 'text-slate-500'
                    : isCurrent
                      ? 'text-carbon-950 font-bold'
                      : isCompleted
                        ? 'text-emerald-400'
                        : 'bg-zinc-900 text-zinc-500 group-hover:text-zinc-400'
                }`}
              >
                {isCompleted ? (
                  <motion.span
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={springPop}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                  </motion.span>
                ) : (
                  <Icon className="w-3.5 h-3.5" />
                )}
              </motion.div>

              <span className="text-[11px] font-medium truncate w-full tracking-tight">
                {step.shortLabel}
              </span>

              {/* Active underline indicator */}
              {isCurrent && (
                <motion.div
                  layoutId="step-active-indicator"
                  className="absolute -bottom-0.5 left-2 right-2 h-0.5 bg-emerald-500 rounded-full"
                  transition={springSmooth}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Mobile Step Compact Dots */}
      <div className="flex sm:hidden justify-between items-center px-1">
        {CALCULATOR_STEPS.map((step, idx) => {
          const isCurrent = idx === currentStepIndex;
          const isCompleted = idx < currentStepIndex;
          return (
            <motion.button
              key={step.category}
              onClick={() => onSelectStep(idx)}
              whileTap={{ scale: 0.85 }}
              className="p-1"
              aria-label={`Go to step ${idx + 1}`}
            >
              <motion.div
                animate={{
                  width: isCurrent ? 32 : 10,
                  backgroundColor: isLight
                    ? isCurrent
                      ? '#059669'
                      : isCompleted
                        ? '#86efac'
                        : '#cbd5e1'
                    : isCurrent
                      ? 'rgb(52 211 153)'
                      : isCompleted
                        ? 'rgb(16 185 129 / 0.5)'
                        : 'rgb(39 39 42)',
                }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
                className="h-2.5 rounded-full"
              />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};
