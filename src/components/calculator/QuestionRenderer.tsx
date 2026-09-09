import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, Building2, Home, Sparkles, Wind, Flame, Zap, Droplets,
  BatteryCharging, Cpu, Fuel, Gauge, Train, Bus, Bike, Footprints,
  User, Users, Users2, Armchair, Layers, Crown, Beef, Drumstick,
  Fish, Salad, Sprout, Leaf, CheckCircle2, HelpCircle, AlertTriangle,
  ShieldCheck, Calendar, ShoppingBag, Trash2, Check, CheckCheck,
  Package, Smile, Slash, Cat, Dog, Laptop, Tv, Server, Minus, Plus
} from 'lucide-react';
import type { QuestionDefinition } from '../../data/questions';
import { TooltipExplainer } from './TooltipExplainer';
import { playSelectSound, playToggleSound, playSliderSound } from '../../utils/soundEffects';
import { springPop, springSmooth } from '../common/MotionPrimitives';
import { useTheme } from '../../context/ThemeContext';

interface QuestionRendererProps {
  question: QuestionDefinition;
  value: any;
  onChange: (newValue: any) => void;
}

// Icon mapping helper
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Building, Building2, Home, Sparkles, Wind, Flame, Zap, Droplets,
  BatteryCharging, Cpu, Fuel, Gauge, Train, Bus, Bike, Footprints,
  User, Users, Users2, Armchair, Layers, Crown, Beef, Drumstick,
  Fish, Salad, Sprout, Leaf, CheckCircle2, HelpCircle, AlertTriangle,
  ShieldCheck, Calendar, ShoppingBag, Trash2, Check, CheckCheck,
  Package, Smile, Slash, Cat, Dog, Laptop, Tv, Server
};

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  value,
  onChange,
}) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <motion.div
      whileHover={{ scale: 1.005, y: -1 }}
      transition={springSmooth}
      className={`rounded-2xl p-5 sm:p-6 transition-all duration-200 ${
        isLight
          ? 'bg-white border border-slate-200 shadow-sm hover:border-emerald-500/40 hover:shadow-md'
          : 'bg-[#09110d]/80 border border-emerald-950/70 shadow-lg hover:border-emerald-900/60'
      }`}
    >
      
      {/* Question Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className={`text-base sm:text-lg font-bold leading-snug ${
              isLight ? 'text-slate-900' : 'text-zinc-100'
            }`}>
              {question.title}
            </h3>
            {question.scienceTooltip && (
              <TooltipExplainer 
                heading={question.scienceTooltip.heading}
                explanation={question.scienceTooltip.explanation}
                source={question.scienceTooltip.source}
              />
            )}
          </div>
          {question.subtitle && (
            <p className={`text-xs sm:text-sm mt-1 leading-relaxed ${
              isLight ? 'text-slate-600' : 'text-zinc-400'
            }`}>
              {question.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Input Control by Type */}
      <div className="mt-4">
        
        {/* 1. Cards Selector */}
        {question.type === 'cards' && question.options && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options.map((option, idx) => {
              const isSelected = value === option.value;
              const IconComponent = option.icon ? ICON_MAP[option.icon] : null;

              return (
                <motion.button
                  key={String(option.value)}
                  type="button"
                  onClick={() => {
                    playSelectSound();
                    onChange(option.value);
                  }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{
                    scale: 1.03,
                    y: -4,
                    boxShadow: isLight
                      ? isSelected
                        ? '0 12px 28px -4px rgba(5,150,105,0.25), 0 0 0 1px rgba(5,150,105,0.4)'
                        : '0 10px 24px -4px rgba(0,0,0,0.08), 0 0 0 1px rgba(226,232,240,0.8)'
                      : isSelected
                        ? '0 16px 36px -4px rgba(52,211,153,0.45), 0 0 20px 2px rgba(52,211,153,0.3)'
                        : '0 14px 30px -4px rgba(0,0,0,0.65), 0 0 16px 1px rgba(16,185,129,0.22)',
                  }}
                  whileTap={{ scale: 0.95 }}
                  transition={{
                    type: 'spring',
                    stiffness: 340,
                    damping: 24,
                    mass: 0.8,
                    delay: idx * 0.03,
                  }}
                  className={`relative flex items-start gap-3.5 p-4 rounded-xl border text-left group focus:outline-none transition-all duration-200 overflow-hidden ${
                    isLight
                      ? isSelected
                        ? 'bg-emerald-50/80 border-emerald-500 shadow-sm ring-2 ring-emerald-500/30'
                        : 'bg-white border-slate-200 hover:border-emerald-400 hover:bg-slate-50/70 text-slate-700'
                      : isSelected
                        ? 'bg-gradient-to-br from-emerald-950/85 via-[#081810]/95 to-emerald-900/40 border-emerald-400 shadow-lg shadow-emerald-950/80 ring-2 ring-emerald-400/50'
                        : 'bg-[#060b08]/80 border-emerald-950/70 hover:bg-gradient-to-br hover:from-[#0a1811] hover:to-[#050e09] hover:border-emerald-500/50 text-zinc-300'
                  }`}
                >
                  {/* Icon */}
                  {IconComponent && (
                    <motion.div
                      animate={isSelected ? { scale: [1, 1.25, 1], rotate: [0, -8, 8, 0] } : { scale: 1, rotate: 0 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                      className={`p-2.5 rounded-lg shrink-0 mt-0.5 transition-colors ${
                        isLight
                          ? isSelected
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-100 text-slate-500 group-hover:text-emerald-700 group-hover:bg-emerald-50'
                          : isSelected
                            ? 'bg-emerald-400 text-carbon-950 shadow-sm shadow-emerald-400/40'
                            : 'bg-zinc-900 text-zinc-400 group-hover:text-emerald-400 group-hover:bg-emerald-950/60'
                      }`}
                    >
                      <IconComponent className="w-4 h-4" />
                    </motion.div>
                  )}

                  {/* Text Details */}
                  <div className="flex-1 min-w-0 pr-6">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className={`text-sm font-semibold truncate ${
                        isLight
                          ? isSelected ? 'text-emerald-950 font-bold' : 'text-slate-800'
                          : isSelected ? 'text-white' : 'text-zinc-200'
                      }`}>
                        {option.label}
                      </span>
                      {option.badge && (
                        <span className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded border shrink-0 ${
                          isLight
                            ? 'bg-emerald-100/70 text-emerald-800 border-emerald-300 font-semibold'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        }`}>
                          {option.badge}
                        </span>
                      )}
                    </div>
                    {option.description && (
                      <p className={`text-xs mt-1 leading-normal ${
                        isLight
                          ? isSelected ? 'text-emerald-800' : 'text-slate-500'
                          : 'text-zinc-400'
                      }`}>
                        {option.description}
                      </p>
                    )}
                  </div>

                  {/* Selected checkmark badge in corner */}
                  <AnimatePresence>
                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0, rotate: -45, opacity: 0 }}
                        animate={{ scale: 1, rotate: 0, opacity: 1 }}
                        exit={{ scale: 0, rotate: 45, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 450, damping: 22 }}
                        className={`absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center shadow-md ${
                          isLight
                            ? 'bg-emerald-600 text-white'
                            : 'bg-emerald-400 text-carbon-950 shadow-emerald-500/40'
                        }`}
                      >
                        <Check className="w-3 h-3 stroke-[3]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })}
          </div>
        )}

        {/* 2. Interactive Range Slider */}
        {question.type === 'slider' && (
          <div className="space-y-4 max-w-xl">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-mono ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                Range: {question.min} - {question.max} {question.unit}
              </span>
              <motion.div
                key={value}
                initial={{ scale: 0.85, opacity: 0.6 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={springPop}
                className={`flex items-baseline gap-1 px-3 py-1 rounded-lg border ${
                  isLight
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-emerald-950/50 border-emerald-500/40'
                }`}
              >
                <span className={`text-lg font-bold font-mono ${isLight ? 'text-emerald-700' : 'text-emerald-300'}`}>
                  {value}
                </span>
                <span className={`text-xs font-medium ${isLight ? 'text-emerald-600' : 'text-emerald-400/80'}`}>
                  {question.unit}
                </span>
              </motion.div>
            </div>

            <input
              type="range"
              min={question.min ?? 0}
              max={question.max ?? 100}
              step={question.step ?? 1}
              value={value ?? question.min ?? 0}
              onChange={e => {
                const val = Number(e.target.value);
                playSliderSound(val, question.min ?? 0, question.max ?? 100);
                onChange(val);
              }}
              className="cursor-pointer"
            />

            <div className={`flex justify-between text-[11px] font-mono ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              <span>{question.min} {question.unit}</span>
              <span>{Math.round(((question.min ?? 0) + (question.max ?? 100)) / 2)} {question.unit}</span>
              <span>{question.max} {question.unit}</span>
            </div>
          </div>
        )}

        {/* 3. Number Counter Step Input */}
        {question.type === 'number' && (
          <div className="flex items-center gap-4 max-w-xs">
            <div className={`flex items-center gap-2 rounded-xl p-1.5 border ${
              isLight ? 'bg-slate-100 border-slate-200' : 'bg-[#060b08] border-emerald-900/50'
            }`}>
              <motion.button
                type="button"
                onClick={() => {
                  playSelectSound();
                  onChange(Math.max(question.min ?? 1, (Number(value) || 1) - 1));
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.85 }}
                transition={springPop}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 ${
                  isLight
                    ? 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 shadow-sm border border-slate-200'
                    : 'bg-zinc-900 hover:bg-emerald-950 hover:text-emerald-300 text-zinc-300'
                }`}
                disabled={value <= (question.min ?? 1)}
                aria-label="Decrease value"
              >
                <Minus className="w-3.5 h-3.5" />
              </motion.button>

              <motion.span
                key={value}
                initial={{ scale: 0.7, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={springPop}
                className={`w-12 text-center font-mono font-bold text-lg ${
                  isLight ? 'text-emerald-800' : 'text-emerald-300'
                }`}
              >
                {value}
              </motion.span>

              <motion.button
                type="button"
                onClick={() => {
                  playSelectSound();
                  onChange(Math.min(question.max ?? 10, (Number(value) || 1) + 1));
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.85 }}
                transition={springPop}
                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors disabled:opacity-30 ${
                  isLight
                    ? 'bg-white text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 shadow-sm border border-slate-200'
                    : 'bg-zinc-900 hover:bg-emerald-950 hover:text-emerald-300 text-zinc-300'
                }`}
                disabled={value >= (question.max ?? 10)}
                aria-label="Increase value"
              >
                <Plus className="w-3.5 h-3.5" />
              </motion.button>
            </div>

            <span className={`text-xs font-medium ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
              {question.unit}
            </span>
          </div>
        )}

        {/* 4. Binary Toggle Button */}
        {question.type === 'toggle' && (
          <div className="flex items-center gap-4">
            <motion.button
              type="button"
              onClick={() => {
                playToggleSound(!value);
                onChange(!value);
              }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              transition={{ type: 'spring', stiffness: 350, damping: 22 }}
              className={`relative inline-flex h-8 w-16 shrink-0 cursor-pointer rounded-full border-2 border-transparent focus:outline-none transition-all duration-300 ease-out ${
                value
                  ? 'bg-emerald-500 shadow-md ring-2 ring-emerald-400/50'
                  : isLight
                    ? 'bg-slate-200 hover:bg-slate-300'
                    : 'bg-zinc-800 hover:bg-zinc-700/80'
              }`}
              role="switch"
              aria-checked={Boolean(value)}
            >
              <motion.span
                animate={{ x: value ? 32 : 2 }}
                transition={{ type: 'spring', stiffness: 450, damping: 24 }}
                className="pointer-events-none mt-0.5 inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0"
              />
            </motion.button>
            <motion.span
              animate={{ 
                color: isLight 
                  ? (value ? '#064e3b' : '#475569') 
                  : (value ? 'rgb(167,243,208)' : 'rgb(212,212,216)') 
              }}
              transition={{ duration: 0.2 }}
              className="text-sm font-semibold cursor-pointer select-none"
              onClick={() => {
                playToggleSound(!value);
                onChange(!value);
              }}
            >
              {value ? 'Yes, regularly compost organic scraps' : 'No organic composting'}
            </motion.span>
          </div>
        )}

      </div>
    </motion.div>
  );
};
