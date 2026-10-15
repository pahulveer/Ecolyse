import React from 'react';
import {
  ArrowRight,
  Sparkles,
  Activity,
  Globe2,
  Target,
  Leaf,
  CheckCircle2,
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useCalculator } from '../../context/CalculatorContext';
import { Hero } from '../hero/Hero';
import { CALCULATOR_STEPS } from '../../data/questions';
import { springPop, springSmooth } from '../common/MotionPrimitives';
import { ScrollAtmosphereCanvas } from './ScrollAtmosphereCanvas';
import { ScrollProgressTracker } from './ScrollProgressTracker';
import { ClimateFluxVisualizer } from './ClimateFluxVisualizer';
import { EnergyPipelineFlow } from './EnergyPipelineFlow';
import { InstantImpactSimulator } from './InstantImpactSimulator';
import { useTheme } from '../../context/ThemeContext';

// ──────────────────────────────────────────────────────────
// Scroll-aware section reveal wrapper
// ──────────────────────────────────────────────────────────
const SectionReveal: React.FC<{
  children: React.ReactNode;
  delay?: number;
  className?: string;
}> = ({ children, delay = 0, className }) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-100px' }}
    transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94], delay }}
    className={className}
  >
    {children}
  </motion.div>
);

// ──────────────────────────────────────────────────────────
// Section label pill
// ──────────────────────────────────────────────────────────
const SectionLabel: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  return (
    <div className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-mono uppercase tracking-wider shadow-xs ${
      isLight 
        ? 'bg-emerald-100/80 border-emerald-300 text-emerald-800 font-semibold' 
        : 'bg-emerald-950/60 border-emerald-500/20 text-emerald-400'
    }`}>
      {icon}
      <span>{text}</span>
    </div>
  );
};

// ──────────────────────────────────────────────────────────
// Stat card (for climate context section)
// ──────────────────────────────────────────────────────────
const StatCard: React.FC<{
  value: string;
  label: string;
  description: string;
  color: 'emerald' | 'teal' | 'amber';
  icon: React.ReactNode;
  delay?: number;
}> = ({ value, label, description, color, icon, delay = 0 }) => {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const colorMap = {
    emerald: { 
      icon: isLight ? 'text-emerald-700 bg-emerald-100 border-emerald-300' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', 
      val: isLight ? 'text-emerald-700' : 'text-emerald-300' 
    },
    teal: { 
      icon: isLight ? 'text-teal-700 bg-teal-100 border-teal-300' : 'text-teal-400 bg-teal-500/10 border-teal-500/20', 
      val: isLight ? 'text-teal-700' : 'text-teal-300' 
    },
    amber: { 
      icon: isLight ? 'text-amber-700 bg-amber-100 border-amber-300' : 'text-amber-400 bg-amber-500/10 border-amber-500/20', 
      val: isLight ? 'text-amber-700' : 'text-amber-300' 
    },
  };
  const c = colorMap[color];

  return (
    <SectionReveal delay={delay}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        transition={springSmooth}
        className={`p-7 rounded-3xl border transition-all duration-300 shadow-lg space-y-4 h-full relative overflow-hidden group ${
          isLight
            ? 'bg-white border-slate-200 hover:border-emerald-400 hover:shadow-xl'
            : 'bg-[#09130e]/90 border-white/5 hover:border-emerald-500/30'
        }`}
      >
        {/* GPU-composited CSS shimmer beam across top */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400/80 to-transparent pointer-events-none animate-shimmer"
          style={{ animationDelay: `${delay}s` }}
        />

        <div className="flex items-center justify-between">
          <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center ${c.icon}`}>
            {icon}
          </div>
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span>TELEMETRY</span>
          </span>
        </div>

        <div>
          <div className={`font-mono text-3xl sm:text-4xl font-black tracking-tight ${c.val}`}>{value}</div>
          <div className={`text-sm font-bold mt-1 ${isLight ? 'text-slate-900' : 'text-white'}`}>{label}</div>
        </div>
        <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>{description}</p>
      </motion.div>
    </SectionReveal>
  );
};

export const LandingPage: React.FC = () => {
  const { setView, setCurrentStepIndex } = useCalculator();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="relative">
      {/* ── 1. Real-time Scroll Atmosphere Particle Canvas ── */}
      <ScrollAtmosphereCanvas />

      {/* ── 2. Top-Edge Laser Progress Tracker & Telemetry Widget ── */}
      <ScrollProgressTracker />

      {/* ── 3. Interactive 3D Earth Hero with Multi-Plane Parallax ── */}
      <Hero />

      {/* Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-emerald-900/40 to-transparent" />

      {/* ── 4. Climate Context & Animated Keeling Motion Graphic ── */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        <SectionReveal className="text-center max-w-2xl mx-auto space-y-4">
          <SectionLabel icon={<Activity className="w-3.5 h-3.5" />} text="Global Climate Context" />
          <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Why every fraction of a tonne matters
          </h2>
          <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
            The climate crisis is a mass-balance physics problem. Cumulative emissions dictate planetary boundary transgressions and heat extremes.
          </p>
        </SectionReveal>

        {/* Dynamic Interactive SVG Motion Graphic: Keeling Trajectory */}
        <SectionReveal delay={0.05}>
          <ClimateFluxVisualizer />
        </SectionReveal>

        {/* 3 Core Climate Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4">
          <StatCard
            value="2.1 t"
            label="Paris 2030 Per-Capita Target"
            description="To limit heating to 1.5°C with 50% probability, the global per-capita annual footprint must converge to ~2.1 t CO₂e by 2030."
            color="emerald"
            icon={<Target className="w-5 h-5" />}
            delay={0}
          />
          <StatCard
            value="426.8 ppm"
            label="Atmospheric CO₂ Today"
            description="Measured at Mauna Loa. Today's atmospheric carbon is ~52% above the pre-industrial 280 ppm thermal baseline."
            color="teal"
            icon={<Globe2 className="w-5 h-5" />}
            delay={0.07}
          />
          <StatCard
            value="60–70%"
            label="Driven by Consumer Choices"
            description="IPCC WG III: over two-thirds of global emissions are tied directly to household mobility, food, and energy consumption decisions."
            color="amber"
            icon={<Leaf className="w-5 h-5" />}
            delay={0.14}
          />
        </div>
      </section>

      {/* ── 5. Assessment Dimensions with Staggered 3D Wave ── */}
      <section className={`py-24 border-y relative z-10 ${
        isLight ? 'bg-slate-100/70 border-slate-200' : 'bg-[#070d0a]/70 border-white/4'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionReveal className="text-center max-w-2xl mx-auto mb-14 space-y-4">
            <SectionLabel icon={<Sparkles className="w-3.5 h-3.5" />} text="Comprehensive LCA Scope" />
            <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Seven dimensions of personal impact
            </h2>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
              Unlike simplistic tools that merely multiply petrol litres, Ecolyse accounts for the full upstream and operational lifecycle of urban Indian living.
            </p>
          </SectionReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CALCULATOR_STEPS.map((step, idx) => (
              <SectionReveal key={step.category} delay={idx * 0.05}>
                <motion.button
                  onClick={() => {
                    setCurrentStepIndex(idx);
                    setView('calculator');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  whileHover={{ y: -6, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  transition={springPop}
                  className={`w-full h-full p-5 rounded-3xl border transition-all text-left group relative overflow-hidden shadow-sm hover:shadow-xl cursor-pointer ${
                    isLight
                      ? 'bg-white border-slate-200 hover:border-emerald-400'
                      : 'bg-[#09130e] border-white/5 hover:border-emerald-500/40'
                  }`}
                >
                  {/* Continuous 60fps kinetic traveling indicator beam */}
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 4, ease: 'linear', delay: idx * 0.3 }}
                    className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none"
                  />

                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono text-xs font-bold text-emerald-500">
                      0{idx + 1}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                      </span>
                      {step.shortLabel}
                    </span>
                  </div>

                  <h3 className={`text-sm font-bold font-heading group-hover:text-emerald-500 transition-colors mb-1.5 ${
                    isLight ? 'text-slate-900' : 'text-white'
                  }`}>
                    {step.title}
                  </h3>
                  <p className={`text-xs line-clamp-2 leading-relaxed ${
                    isLight ? 'text-slate-500' : 'text-zinc-400'
                  }`}>
                    {step.tagline}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold group-hover:translate-x-1.5 transition-transform">
                      <span>Explore dimension</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-mono text-zinc-500 font-semibold">
                      Scope 1-3
                    </span>
                  </div>
                </motion.button>
              </SectionReveal>
            ))}
          </div>

          {/* Real-time Interactive Sandbox Motion Graphic */}
          <SectionReveal delay={0.1} className="mt-14">
            <InstantImpactSimulator />
          </SectionReveal>
        </div>
      </section>

      {/* ── 6. How It Works — Kinetic Energy Pipeline Motion Graphic ── */}
      <section className="py-24 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        <SectionReveal className="text-center max-w-2xl mx-auto space-y-4">
          <SectionLabel icon={<CheckCircle2 className="w-3.5 h-3.5" />} text="System Architecture" />
          <h2 className={`text-3xl sm:text-4xl font-black font-heading tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            How Ecolyse works
          </h2>
          <p className={`text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
            A verified 3-stage computational pipeline turning daily choices into peer-reviewed carbon intelligence.
          </p>
        </SectionReveal>

        {/* Live Traveling Energy Pipeline Component */}
        <EnergyPipelineFlow />
      </section>

      {/* ── 7. CTA Banner with Ambient Breathing Glow ── */}
      <section className="pb-28 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionReveal>
          <motion.div 
            whileHover={{ scale: 1.01 }}
            transition={springSmooth}
            className={`relative overflow-hidden rounded-3xl border px-8 sm:px-12 py-14 text-center shadow-2xl ${
              isLight
                ? 'bg-gradient-to-b from-white to-emerald-50/50 border-emerald-500/30'
                : 'bg-[#09140e] border-emerald-500/30'
            }`}
          >
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10 pointer-events-none" />
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <p className="text-xs font-mono text-emerald-500 uppercase tracking-[0.2em] font-semibold">
                Ready to begin?
              </p>
              <h2 className={`text-3xl sm:text-4xl font-black font-heading tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
                Take the 3-minute assessment
              </h2>
              <p className={`text-sm max-w-lg mx-auto leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                Quantify your personal emissions and discover where you can make the biggest impact — for students, researchers, and climate advocates.
              </p>

              <motion.button
                onClick={() => { setView('calculator'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                whileHover={{ scale: 1.05, y: -3, boxShadow: '0 22px 50px -10px rgba(52,211,153,0.48)' }}
                whileTap={{ scale: 0.96 }}
                transition={springPop}
                className="mt-3 inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-xl shadow-emerald-600/30 cursor-pointer"
              >
                <span>Start Free Calculator</span>
                <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        </SectionReveal>
      </section>
    </div>
  );
};

