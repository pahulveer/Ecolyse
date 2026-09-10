import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Share2, 
  RotateCcw, 
  Sparkles, 
  BarChart3, 
  FileText,
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
import { useState } from 'react';
import { springPop, springSmooth } from '../common/MotionPrimitives';

// Immediate hero section wrapper (never trapped by scroll intersection)
const HeroSection: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: 'spring', stiffness: 220, damping: 24, delay }}
    className={className}
  >
    {children}
  </motion.div>
);

// Scroll-reveal section wrapper for lower sections with zero negative margin
const RevealSection: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 28 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '0px' }}
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

  if (!calculationResult || !calculationResult.categoryList) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center text-zinc-400">
        <p className="text-sm">Preparing your carbon footprint calculations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Top Action Bar */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springSmooth}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-emerald-950/60"
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/60 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Edit Answers</span>
          </motion.button>

          <motion.button
            onClick={resetCalculator}
            whileHover={{ scale: 1.04, rotate: -15 }}
            whileTap={{ scale: 0.9 }}
            transition={springPop}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </motion.button>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-emerald-400 px-3 py-1.5 rounded-xl bg-emerald-950/40 border border-emerald-500/25">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-semibold uppercase tracking-wider">CALCULATED · SCOPE 1-3 AUDITED</span>
          </div>

          <motion.button
            onClick={() => setShareModalOpen(true)}
            whileHover={{ scale: 1.04, y: -2, boxShadow: '0 12px 32px -6px rgba(52,211,153,0.45)' }}
            whileTap={{ scale: 0.94 }}
            transition={springPop}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-carbon-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share & Export Result</span>
          </motion.button>
        </div>
      </motion.div>

      {/* 1. Footprint Big Counter & Benchmarks — immediate hero reveal */}
      <HeroSection delay={0}>
        <FootprintCounter result={calculationResult} />
      </HeroSection>

      {/* 2. Biggest Impact Spotlight */}
      <HeroSection delay={0.06}>
        <BiggestImpactCard biggestImpact={calculationResult.biggestImpact} />
      </HeroSection>

      {/* 3. Interactive Category Breakdown Donut & Inspector */}
      <HeroSection delay={0.12}>
        <BreakdownChart result={calculationResult} />
      </HeroSection>

      {/* 4. Action Plan / Top 5 Recommendations */}
      <RevealSection>
        <ActionPlanList recommendations={calculationResult.recommendations} />
      </RevealSection>

      {/* 5. What-If Behavioral Simulator */}
      <RevealSection>
        <WhatIfSimulator />
      </RevealSection>

      {/* 6. Ecological Health & Future Landscape Trajectory */}
      <RevealSection>
        <FutureLandscape currentTonnes={calculationResult.totalTonnes} />
      </RevealSection>

      {/* 7. Personal Impact Score Profile */}
      <RevealSection>
        <ImpactScoreGauge result={calculationResult} />
      </RevealSection>

      {/* Bottom Cross-Navigation Links */}
      <RevealSection>
        <motion.div
          whileHover={{ scale: 1.005 }}
          transition={springSmooth}
          className="p-6 rounded-3xl bg-[#09120e] border border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div>
            <h4 className="font-bold text-white text-base">
              Deepen Your Environmental Understanding
            </h4>
            <p className="text-xs text-zinc-400 mt-0.5">
              Explore peer-reviewed sector emissions and learn the physics behind personal Scope 1-3 boundaries.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <motion.button
              onClick={() => {
                setView('climate_data');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={springPop}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-emerald-300 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/40 transition-colors"
            >
              <BarChart3 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Climate Data Lab</span>
            </motion.button>

            <motion.button
              onClick={() => {
                setView('methodology');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              transition={springPop}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/60 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-teal-400" />
              <span>Methodology</span>
            </motion.button>
          </div>
        </motion.div>
      </RevealSection>

      {/* Share Modal Dialog */}
      <ShareResultModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        result={calculationResult}
      />

    </div>
  );
};
