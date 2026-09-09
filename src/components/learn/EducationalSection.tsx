import React, { useState } from 'react';
import { 
  BookOpen, 
  Layers, 
  HelpCircle, 
  ShieldCheck, 
  Zap, 
  Flame, 
  Factory, 
  Scale, 
  Compass, 
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { METHODOLOGY_DATA } from '../../data/methodology';
import { useCalculator } from '../../context/CalculatorContext';
import { useTheme } from '../../context/ThemeContext';
import { springSmooth, springPop } from '../common/MotionPrimitives';

export const EducationalSection: React.FC = () => {
  const { setView } = useCalculator();
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [activeScopeIndex, setActiveScopeIndex] = useState<number>(0);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Section Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springSmooth}
        className={`text-left space-y-2 border-b pb-6 ${
          isLight ? 'border-slate-200' : 'border-emerald-950/70'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 uppercase tracking-wider font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Curriculum & Climate Literacy</span>
        </div>
        <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Understanding Your Carbon Footprint
        </h2>
        <p className={`text-sm max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
          The atmospheric physics, accounting frameworks, and systemic realities behind individual emissions calculation.
        </p>
      </motion.div>

      {/* Module 1: What is a Carbon Footprint? (CO2 vs CO2e) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
          transition={springSmooth}
          className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-4 transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#08120e] border-emerald-500/30'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold font-mono text-base border border-emerald-500/30">
            CO₂
          </div>
          <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            What is a Carbon Footprint?
          </h3>
          <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
            A carbon footprint measures the total volume of greenhouse gas emissions caused directly and indirectly by an individual, organization, event, or product. It is expressed in metric tonnes of <strong>Carbon Dioxide Equivalent (t CO₂e)</strong> per year.
          </p>
          <div className={`p-4 rounded-2xl border text-xs font-mono leading-relaxed ${
            isLight ? 'bg-emerald-50/70 border-emerald-200 text-emerald-800' : 'bg-[#050a07] border-emerald-950/80 text-emerald-400'
          }`}>
            💡 1 metric tonne of CO₂ occupies a sphere ~9.8 meters (32 ft) in diameter at standard sea level atmospheric pressure.
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -5 }}
          transition={{ ...springSmooth, delay: 0.08 }}
          className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-4 transition-colors ${
            isLight ? 'bg-white border-slate-200' : 'bg-[#08120e] border-emerald-500/30'
          }`}
        >
          <div className="w-11 h-11 rounded-2xl bg-teal-500/20 text-teal-500 flex items-center justify-center font-bold font-mono text-base border border-teal-500/30">
            GWP
          </div>
          <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Why Does CO₂e Matter? (Global Warming Potential)
          </h3>
          <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
            Carbon dioxide is not the only greenhouse gas. Agriculture emits potent <strong>Methane (CH₄)</strong> and <strong>Nitrous Oxide (N₂O)</strong>. Refrigerants emit <strong>F-gases</strong>.
            CO₂e standardizes these varied gases into a single comparable metric based on their 100-year heat-trapping capacity.
          </p>
          <div className={`p-4 rounded-2xl border text-xs font-mono leading-relaxed ${
            isLight ? 'bg-teal-50/70 border-teal-200 text-teal-800' : 'bg-[#050a07] border-emerald-950/80 text-teal-300'
          }`}>
            ⚖️ 1 kg Methane (CH₄) = 28 kg CO₂e • 1 kg Nitrous Oxide (N₂O) = 273 kg CO₂e
          </div>
        </motion.div>

      </div>

      {/* Module 2: The 4 Major Greenhouse Gases with Animated Comparative Bars */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 transition-colors ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#09140f] border-emerald-950/80'
        }`}
      >
        <div className="flex items-center justify-between">
          <h3 className={`text-xl font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <Flame className="w-5 h-5 text-amber-500" />
            <span>The Four Primary Greenhouse Gases</span>
          </h3>
          <span className="text-xs font-mono text-emerald-500 font-semibold">
            IPCC AR6 GWP100 Metric
          </span>
        </div>
        <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
          Gases trap outgoing thermal infrared radiation with vastly different atmospheric residence times and forcing intensities.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {METHODOLOGY_DATA.greenhouseGases.map((gas, idx) => (
            <motion.div 
              key={gas.formula} 
              whileHover={{ y: -4, scale: 1.02 }}
              transition={springPop}
              className={`p-4 rounded-2xl border space-y-2.5 transition-all ${
                isLight ? 'bg-slate-50 border-slate-200 hover:border-emerald-400 shadow-sm' : 'bg-[#050a07] border-emerald-950/70 hover:border-emerald-500/40'
              }`}
            >
              <div className="flex items-baseline justify-between">
                <span className="font-mono font-black text-emerald-500 text-sm">{gas.formula}</span>
                <span className={`text-[11px] font-mono px-2 py-0.5 rounded-full font-bold ${
                  isLight ? 'bg-emerald-100 text-emerald-800' : 'bg-emerald-500/10 text-emerald-400'
                }`}>
                  GWP: {gas.gwp100}
                </span>
              </div>
              <h4 className={`font-bold text-xs ${isLight ? 'text-slate-900' : 'text-white'}`}>{gas.gas}</h4>
              <p className={`text-[11px] leading-relaxed line-clamp-3 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                {gas.primarySources}
              </p>
              <div className={`text-[10px] pt-2 border-t font-mono ${
                isLight ? 'border-slate-200 text-slate-500' : 'border-emerald-950/60 text-zinc-500'
              }`}>
                Atm. Lifetime: {gas.atmosphericLifetime}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Module 3: Interactive Animated Scope 1, Scope 2, Scope 3 Architecture Diagram */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 transition-colors relative overflow-hidden group ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#08120e] border-emerald-500/30'
        }`}
      >
        {/* Continuous 60fps traveling light beam */}
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none"
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 uppercase tracking-wider mb-1 font-semibold">
              <Layers className="w-3.5 h-3.5" />
              <span>Interactive Accounting Framework</span>
            </div>
            <h3 className={`text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Personal Scope 1, Scope 2, and Scope 3 Architecture
            </h3>
            <p className={`text-xs sm:text-sm mt-1 max-w-2xl ${isLight ? 'text-slate-500' : 'text-zinc-300'}`}>
              Click any scope tier below to explore how personal decisions interface with municipal and global supply chains.
            </p>
          </div>
        </div>

        {/* 60FPS Kinetic Traveling Scope Energy Pipeline */}
        <div className="w-full h-8 relative hidden md:block overflow-hidden rounded-xl bg-emerald-950/20 border border-emerald-500/20">
          <svg className="w-full h-full" viewBox="0 0 800 32" preserveAspectRatio="none">
            <line x1="10" y1="16" x2="790" y2="16" stroke="rgba(52, 211, 153, 0.25)" strokeWidth="2" strokeDasharray="6 6" />
            {[0, 1, 2, 3, 4].map(i => (
              <motion.circle
                key={i}
                r="3.5"
                fill="#34d399"
                animate={{ cx: [10, 790] }}
                transition={{
                  repeat: Infinity,
                  duration: 3.5,
                  delay: i * 0.7,
                  ease: 'linear'
                }}
                cy="16"
              />
            ))}
          </svg>
          <div className="absolute inset-0 flex items-center justify-around text-[10px] font-mono text-emerald-400 font-bold pointer-events-none">
            <span>SCOPE 1: DIRECT COMBUSTION</span>
            <span>➔</span>
            <span>SCOPE 2: PURCHASED ELECTRICITY</span>
            <span>➔</span>
            <span>SCOPE 3: SUPPLY CHAIN & EMBODIED</span>
          </div>
        </div>

        {/* Animated Scope Selection Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {METHODOLOGY_DATA.personalScopes.map((scope, idx) => {
            const isSelected = activeScopeIndex === idx;
            return (
              <motion.button
                key={scope.scope}
                onClick={() => setActiveScopeIndex(idx)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                transition={springPop}
                className={`p-5 rounded-2xl border text-left space-y-3 transition-all relative overflow-hidden ${
                  isSelected
                    ? isLight
                      ? 'bg-emerald-50 border-emerald-500 shadow-md ring-2 ring-emerald-500/20'
                      : 'bg-emerald-950/40 border-emerald-400 shadow-lg shadow-emerald-500/10 ring-2 ring-emerald-400/20'
                    : isLight
                      ? 'bg-slate-50 border-slate-200 hover:border-slate-300'
                      : 'bg-[#050a07] border-white/5 hover:border-white/10'
                }`}
              >
                {/* Active Scope Traveling Beam */}
                {isSelected && (
                  <motion.div
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                    className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none"
                  />
                )}

                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-500">
                    0{idx + 1}
                  </span>
                  <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full font-bold flex items-center gap-1.5 ${
                    isSelected 
                      ? 'bg-emerald-500 text-carbon-950'
                      : 'bg-emerald-500/10 text-emerald-400'
                  }`}>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-carbon-950 animate-ping" />}
                    {scope.scope}
                  </span>
                </div>

                <h4 className={`font-bold text-base ${isLight ? 'text-slate-900' : 'text-white'}`}>
                  {scope.label}
                </h4>

                <p className={`text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                  {scope.description}
                </p>

                <div className={`pt-3 border-t space-y-1 ${
                  isLight ? 'border-slate-200' : 'border-emerald-950/60'
                }`}>
                  <span className="text-[10px] font-mono uppercase text-zinc-500 font-bold">Everyday Activities:</span>
                  {scope.examples.map(ex => (
                    <div key={ex} className={`text-[11px] flex items-start gap-1.5 ${
                      isLight ? 'text-slate-700' : 'text-zinc-300'
                    }`}>
                      <span className="text-emerald-500 mt-0.5">•</span>
                      <span>{ex}</span>
                    </div>
                  ))}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Dynamic Visual Scope Focus Readout */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between text-xs font-mono ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-700' : 'bg-[#050a07] border-emerald-950/60 text-zinc-400'
        }`}>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold text-emerald-500">Active Focus:</span>
            <span>{METHODOLOGY_DATA.personalScopes[activeScopeIndex].scope} ({METHODOLOGY_DATA.personalScopes[activeScopeIndex].label})</span>
          </div>
          <span className="text-[11px] text-zinc-500 hidden sm:inline">GHG Protocol Corporate & Personal Standard</span>
        </div>
      </motion.div>

      {/* Module 4: Individual Agency vs Systemic Change */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`p-6 sm:p-8 rounded-3xl border shadow-2xl space-y-6 transition-colors ${
          isLight 
            ? 'bg-gradient-to-br from-white to-emerald-50/50 border-slate-200' 
            : 'bg-gradient-to-br from-[#0c1812] to-[#060c09] border-emerald-500/30'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-500 flex items-center justify-center border border-amber-500/30">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className={`text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Individual Agency vs. Systemic Decarbonization
            </h3>
            <p className={`text-xs ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              Why individual choices and structural policy are mutually reinforcing, not mutually exclusive.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm leading-relaxed">
          <motion.div 
            whileHover={{ y: -3 }}
            className={`p-5 rounded-2xl border space-y-2.5 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#050a07] border-emerald-950/80'
            }`}
          >
            <h4 className="font-bold text-emerald-500 text-sm flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>The Power of Individual Choices</span>
            </h4>
            <p className={isLight ? 'text-slate-600' : 'text-zinc-300'}>
              {METHODOLOGY_DATA.systemicVsIndividual.individualRole}
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ y: -3 }}
            className={`p-5 rounded-2xl border space-y-2.5 ${
              isLight ? 'bg-white border-slate-200 shadow-sm' : 'bg-[#050a07] border-emerald-950/80'
            }`}
          >
            <h4 className="font-bold text-teal-500 text-sm flex items-center gap-2">
              <Zap className="w-4 h-4" />
              <span>The Requirement for Systemic Policy</span>
            </h4>
            <p className={isLight ? 'text-slate-600' : 'text-zinc-300'}>
              {METHODOLOGY_DATA.systemicVsIndividual.systemicRole}
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Footer Call to Action */}
      <div className="text-center pt-4">
        <motion.button
          onClick={() => {
            setView('calculator');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
          transition={springPop}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-xl shadow-emerald-600/30"
        >
          <span>Calculate Your Own Carbon Footprint</span>
          <ArrowRight className="w-4 h-4" />
        </motion.button>
      </div>

    </div>
  );
};
