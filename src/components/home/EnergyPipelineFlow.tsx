import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Cpu, Sliders, ArrowRight } from 'lucide-react';
import { springPop, springSmooth } from '../common/MotionPrimitives';
import { useTheme } from '../../context/ThemeContext';

interface Step {
  n: string;
  title: string;
  body: string;
  badge: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const STEPS: Step[] = [
  {
    n: '01',
    title: 'Guided Lifestyle Assessment',
    body: 'Walk through 7 intuitive categories with visual cards, sliders, and smart defaults. No utility bill required.',
    badge: 'Scope 1-3 Inputs',
    icon: ShieldCheck,
    color: '#10b981'
  },
  {
    n: '02',
    title: 'Scientific LCA Calculation',
    body: 'Calibrated via IPCC AR6, UK DEFRA, and India CEA grid emission factors to compute accurate annual CO₂e tonnes.',
    badge: 'Physics Engine',
    icon: Cpu,
    color: '#06b6d4'
  },
  {
    n: '03',
    title: 'Dynamic Decarbonization',
    body: 'Explore prioritized abatement recommendations and simulate real-time behavioral and solar technology pivots.',
    badge: 'Real-time Simulator',
    icon: Sliders,
    color: '#f59e0b'
  }
];

export const EnergyPipelineFlow: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="relative w-full max-w-5xl mx-auto">
      {/* ── Animated SVG Kinetic Pipeline Line (Desktop) ── */}
      <div className="hidden md:block absolute top-7 left-12 right-12 h-16 pointer-events-none z-0">
        <svg className="w-full h-full" viewBox="0 0 800 60" preserveAspectRatio="none">
          <defs>
            {/* Gradient for track */}
            <linearGradient id="pipelineTrack" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={isLight ? '#cbd5e1' : '#064e3b'} stopOpacity="0.4" />
              <stop offset="50%" stopColor={isLight ? '#94a3b8' : '#047857'} stopOpacity="0.6" />
              <stop offset="100%" stopColor={isLight ? '#cbd5e1' : '#064e3b'} stopOpacity="0.4" />
            </linearGradient>

            {/* Glowing beam gradient */}
            <linearGradient id="flowBeam" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            {/* Glow filter */}
            <filter id="laserGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Base Pipe Line */}
          <line
            x1="20"
            y1="30"
            x2="780"
            y2="30"
            stroke="url(#pipelineTrack)"
            strokeWidth="3"
            strokeDasharray="6 6"
          />

          {/* Flowing animated kinetic energy stream */}
          <motion.line
            x1="20"
            y1="30"
            x2="780"
            y2="30"
            stroke="url(#flowBeam)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#laserGlow)"
            strokeDasharray="60 220"
            animate={{ strokeDashoffset: [-280, 280] }}
            transition={{ repeat: Infinity, duration: 2.8, ease: 'linear' }}
          />

          {/* Continuous 60fps flowing photon laser particles */}
          {[0, 1, 2, 3].map(i => (
            <motion.circle
              key={i}
              r="4.5"
              fill="#ffffff"
              filter="url(#laserGlow)"
              animate={{ cx: [20, 780] }}
              transition={{
                repeat: Infinity,
                duration: 3.2,
                delay: i * 0.8,
                ease: 'linear'
              }}
              cy="30"
            />
          ))}
        </svg>
      </div>

      {/* ── Steps Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
        {STEPS.map((step, idx) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ ...springSmooth, delay: idx * 0.15 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className={`p-6 sm:p-7 rounded-3xl border transition-all duration-300 relative group overflow-hidden ${
                isLight
                  ? 'bg-white border-slate-200 shadow-md hover:border-emerald-400 hover:shadow-xl'
                  : 'bg-[#09130e]/90 border-emerald-500/20 shadow-xl hover:border-emerald-400/60'
              }`}
            >
              {/* Continuous 60fps kinetic traveling indicator beam across top */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 4, ease: 'linear', delay: idx * 0.4 }}
                className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none"
              />

              {/* Corner Glow on hover */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity" />

              {/* Step Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="relative">
                  {/* Outer pulsating radar ring on hover */}
                  <div
                    className="absolute -inset-1 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity blur-sm"
                    style={{ backgroundColor: `${step.color}44` }}
                  />
                  <div
                    className="relative w-12 h-12 rounded-2xl flex items-center justify-center font-mono font-bold text-base shadow-md transition-transform duration-300 group-hover:scale-110"
                    style={{
                      backgroundColor: `${step.color}18`,
                      color: step.color,
                      border: `1px solid ${step.color}44`
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border border-emerald-500/20 text-emerald-400 bg-emerald-500/10">
                    {step.badge}
                  </span>
                  <span className="font-mono text-xs font-bold text-zinc-500">
                    {step.n}
                  </span>
                </div>
              </div>

              {/* Title & Body */}
              <h4 className={`text-lg font-bold tracking-tight mb-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {step.title}
              </h4>
              <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                {step.body}
              </p>

              {/* Mini Interactive Indicator */}
              <div className="mt-5 pt-4 border-t border-emerald-950/40 flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-500">Execution Phase</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Explore Phase</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
