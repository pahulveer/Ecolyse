import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Share2, 
  RotateCcw, 
  BarChart3, 
  FileText
} from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import { FootprintCounter } from './FootprintCounter';
import { BiggestImpactCard } from './BiggestImpactCard';
import { BreakdownChart } from './BreakdownChart';
import { ActionPlanList } from './ActionPlanList';
import { WhatIfSimulator } from './WhatIfSimulator';
import { FutureLandscape } from './FutureLandscape';
import { ImpactScoreGauge } from './ImpactScoreGauge';
import { ShareResultModal } from './ShareResultModal';
import { DEFAULT_CALCULATOR_STATE } from '../../data/presets';
import { calculateFootprint } from '../../utils/calculationEngine';
import { springPop, springSmooth } from '../common/MotionPrimitives';

// Immediate hero section wrapper
const HeroSection: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 220, damping: 24, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

// Section reveal wrapper
const RevealSection: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 200, damping: 26, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

export const ResultsDashboard: React.FC = () => {
  const { 
    calculationResult, 
    setView, 
    setCurrentStepIndex, 
    resetCalculator 
  } = useCalculator();

  const [shareModalOpen, setShareModalOpen] = useState(false);

  // Guarantee user lands at the top of results to immediately see their footprint score
  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, []);

  const safeResult = React.useMemo(() => {
    if (calculationResult && calculationResult.categoryList && calculationResult.categoryList.length > 0) {
      return calculationResult;
    }
    return calculateFootprint(DEFAULT_CALCULATOR_STATE);
  }, [calculationResult]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springSmooth}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-emerald-950/60"
      >
        <div className="flex items-center gap-3">
          <motion.button
            onClick={() => {
              setCurrentStepIndex(0);
              setView('calculator');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            whileHover={{ scale: 1.04, x: -2 }}
            whileTap={{ scale: 0.94 }}
            transition={springPop}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900/80 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-700/60 transition-colors cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Edit Responses</span>
          </motion.button>

          <motion.button
            onClick={resetCalculator}
            whileHover={{ scale: 1.04, rotate: -15 }}
            whileTap={{ scale: 0.9 }}
            transition={springPop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Assessment</span>
          </motion.button>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/25">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold uppercase tracking-wider">LCA SCOPES 1-3 AUDITED</span>
          </div>

          <motion.button
            onClick={() => setShareModalOpen(true)}
            whileHover={{ scale: 1.04, y: -2, boxShadow: '0 12px 32px -6px rgba(16,185,129,0.35)' }}
            whileTap={{ scale: 0.94 }}
            transition={springPop}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share & Export Result</span>
          </motion.button>
        </div>
      </motion.div>

      {/* 1. Footprint Big Counter & Benchmarks */}
      <HeroSection delay={0}>
        <FootprintCounter result={safeResult} />
      </HeroSection>

      {/* 2. Biggest Impact Spotlight */}
      <HeroSection delay={0.06}>
        <BiggestImpactCard biggestImpact={safeResult.biggestImpact} />
      </HeroSection>

      {/* 3. Interactive Category Breakdown Donut & Inspector */}
      <HeroSection delay={0.12}>
        <BreakdownChart result={safeResult} />
      </HeroSection>

      {/* 4. Action Plan / Top 5 Recommendations */}
      <RevealSection>
        <ActionPlanList recommendations={safeResult.recommendations} />
      </RevealSection>

      {/* 5. What-If Behavioral Simulator */}
      <RevealSection>
        <WhatIfSimulator />
      </RevealSection>

      {/* 6. Ecological Health & Future Landscape Trajectory */}
      <RevealSection>
        <FutureLandscape currentTonnes={safeResult.totalTonnes} />
      </RevealSection>

      {/* 7. Personal Impact Score Profile */}
      <RevealSection>
        <ImpactScoreGauge result={safeResult} />
      </RevealSection>

      {/* Bottom Cross-Navigation Links */}
      <RevealSection>
        <motion.div
          whileHover={{ scale: 1.005 }}
          transition={springSmooth}
          className="p-6 sm:p-8 rounded-3xl bg-slate-50 dark:bg-[#09120e] border border-slate-200 dark:border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm transition-colors"
        >
          <div>
            <h4 className="font-bold font-heading text-slate-900 dark:text-white text-base sm:text-lg">
              Deepen Your Climate Intelligence
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-1 max-w-lg">
              Explore peer-reviewed sector emissions in the Data Lab or inspect emission factors in our comprehensive Methodology.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <motion.button
              onClick={() => {
                setView('climate_data');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={springPop}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-100/80 hover:bg-emerald-200/80 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-800/60 transition-colors cursor-pointer shadow-xs"
            >
              <BarChart3 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Climate Data Lab</span>
            </motion.button>

            <motion.button
              onClick={() => {
                setView('methodology');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.96 }}
              transition={springPop}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white bg-white hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-700/60 transition-colors cursor-pointer shadow-xs"
            >
              <FileText className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Methodology</span>
            </motion.button>
          </div>
        </motion.div>
      </RevealSection>

      {/* Share Modal Dialog */}
      <ShareResultModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        result={safeResult}
      />

    </div>
  );
};
