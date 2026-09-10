import React, { useEffect, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, AlertCircle, Check, Sparkles } from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import { CALCULATOR_STEPS } from '../../data/questions';
import { StepNavigation } from './StepNavigation';
import { QuestionRenderer } from './QuestionRenderer';
import { playNextSound, playBackSound, playResetSound } from '../../utils/soundEffects';
import { springPop, springSmooth } from '../common/MotionPrimitives';

// Direction-aware step transition variants
const stepVariants = {
  enterForward: { opacity: 0, x: 60, scale: 0.97, filter: 'blur(3px)' },
  enterBack:    { opacity: 0, x: -60, scale: 0.97, filter: 'blur(3px)' },
  center:  { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)', transition: { ...springSmooth, opacity: { duration: 0.25 } } },
  exitForward:  { opacity: 0, x: -50, scale: 0.97, filter: 'blur(2px)', transition: { duration: 0.18, ease: [0.4,0,1,1] as any } },
  exitBack:     { opacity: 0, x: 50, scale: 0.97, filter: 'blur(2px)', transition: { duration: 0.18, ease: [0.4,0,1,1] as any } },
};

const cardReveal = {
  initial: { opacity: 0, y: 18, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1, transition: springSmooth },
};

export const CalculatorWizard: React.FC = () => {
  const {
    currentStepIndex,
    setCurrentStepIndex,
    goToNextStep,
    goToPreviousStep,
    state,
    updateField,
    resetCalculator,
    calculationResult,
    isCalculating,
  } = useCalculator();

  const [confirmingReset, setConfirmingReset] = useState<boolean>(false);
  const [resetFeedback, setResetFeedback] = useState<boolean>(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const prevStepIndex = useRef(currentStepIndex);

  // Track step direction
  useEffect(() => {
    if (currentStepIndex > prevStepIndex.current) setDirection('forward');
    else if (currentStepIndex < prevStepIndex.current) setDirection('back');
    prevStepIndex.current = currentStepIndex;
  }, [currentStepIndex]);

  const currentStep = CALCULATOR_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === CALCULATOR_STEPS.length - 1;

  const handleResetClick = () => {
    if (confirmingReset) {
      resetCalculator();
      setConfirmingReset(false);
      setResetFeedback(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(() => setResetFeedback(false), 2500);
    } else {
      setConfirmingReset(true);
      setTimeout(() => setConfirmingReset(false), 4000);
    }
  };

  const handleNext = () => {
    setDirection('forward');
    goToNextStep();
  };

  const handlePrev = () => {
    setDirection('back');
    goToPreviousStep();
  };

  // Keyboard shortcut listener (Enter = Next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (['TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === 'Enter') {
        e.preventDefault();
        playNextSound();
        handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentStepIndex, isLastStep]);

  // Ensure screen is pinned to top when calculation begins
  useEffect(() => {
    if (isCalculating) {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }, [isCalculating]);

  if (isCalculating) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={springSmooth}
        className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4"
      >
        <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0.1, 0.4] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 rounded-full border-4 border-emerald-500/40"
          />
          <div className="w-16 h-16 rounded-full border-4 border-emerald-400 border-t-transparent animate-spin" />
          <Sparkles className="w-6 h-6 text-emerald-300 absolute" />
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSmooth, delay: 0.15 }}
          className="text-2xl sm:text-3xl font-extrabold text-white mb-2"
        >
          Calculating your environmental impact...
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springSmooth, delay: 0.28 }}
          className="text-sm text-zinc-400 max-w-md"
        >
          Synthesizing your consumption profiles against IPCC lifecycle inventories, aviation radiative forcing indices, and local grid carbon intensities.
        </motion.p>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="mt-6 flex items-center gap-2 text-xs font-mono text-emerald-400"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>Scope 1, Scope 2, Scope 3 Calibrated</span>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Reset Notification Toast */}
      <AnimatePresence>
        {resetFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={springSmooth}
            className="mb-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-medium flex items-center gap-2"
          >
            <Check className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Assessment inputs have been reset to baseline defaults.</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Step Navigation Progress Header */}
      <StepNavigation
        currentStepIndex={currentStepIndex}
        onSelectStep={(step) => {
          setDirection(step > currentStepIndex ? 'forward' : 'back');
          setCurrentStepIndex(step);
        }}
      />

      {/* Animated Step Content */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStepIndex}
          custom={direction}
          initial={direction === 'forward' ? stepVariants.enterForward : stepVariants.enterBack}
          animate={stepVariants.center}
          exit={direction === 'forward' ? stepVariants.exitForward : stepVariants.exitBack}
        >
          {/* Category Card Header */}
          <motion.div
            variants={cardReveal}
            initial="initial"
            animate="animate"
            className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0a140f]/90 border border-emerald-500/30 rounded-2xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden group"
          >
            {/* Continuous 60fps kinetic traveling light beam */}
            <motion.div
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none"
            />

            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span>Section {currentStepIndex + 1} of 7</span>
                <span>•</span>
                <span>{currentStep.shortLabel}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {currentStep.title}
              </h2>
              <p className="text-sm text-zinc-400 mt-1 max-w-xl">
                {currentStep.tagline}
              </p>
            </div>

            {/* Running impact readout — right side with kinetic spring counter */}
            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/35 self-start sm:self-center shrink-0 shadow-lg">
              <div className="text-right">
                <div className="flex items-center gap-1.5 justify-end text-[10px] text-zinc-400 uppercase font-mono font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Real-Time Baseline</span>
                </div>
                <motion.div 
                  key={calculationResult.totalTonnes}
                  initial={{ scale: 0.85, opacity: 0.8 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={springPop}
                  className="text-lg font-bold font-mono text-emerald-300"
                >
                  {calculationResult.totalTonnes}{' '}
                  <span className="text-xs font-normal text-zinc-400">t CO₂e</span>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Render Questions for Current Step — staggered */}
          <motion.div
            className="space-y-6"
            initial="initial"
            animate="animate"
            variants={{
              initial: {},
              animate: { transition: { staggerChildren: 0.09, delayChildren: 0.06 } },
            }}
          >
            {currentStep.questions.map((question) => (
              <motion.div
                key={question.id}
                variants={{
                  initial: { opacity: 0, y: 24, scale: 0.97 },
                  animate: { opacity: 1, y: 0, scale: 1, transition: springSmooth },
                }}
              >
                <QuestionRenderer
                  question={question}
                  value={state[currentStep.category][question.field as keyof typeof state[typeof currentStep.category]]}
                  onChange={(newValue) => updateField(currentStep.category, question.field as any, newValue)}
                />
              </motion.div>
            ))}
          </motion.div>

          {/* Wizard Footer Controls */}
          <div className="mt-10 pt-6 border-t border-emerald-950/80 flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* Navigation & Reset Buttons */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto">
              <AnimatePresence>
                {currentStepIndex > 0 && (
                  <motion.button
                    initial={{ opacity: 0, x: -14 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -14 }}
                    transition={springSmooth}
                    type="button"
                    onClick={() => {
                      playBackSound();
                      handlePrev();
                    }}
                    whileHover={{ scale: 1.03, x: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold text-zinc-300 bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-700/50 transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous Step</span>
                  </motion.button>
                )}
              </AnimatePresence>

              <motion.button
                type="button"
                onClick={() => {
                  playResetSound();
                  handleResetClick();
                }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.95 }}
                transition={springPop}
                className={`flex items-center gap-1.5 px-3.5 py-3 rounded-xl text-xs font-medium transition-all duration-200 border ${
                  confirmingReset
                    ? 'bg-rose-950/60 border-rose-500 text-rose-300 shadow-sm animate-pulse'
                    : 'text-zinc-400 hover:text-zinc-200 bg-zinc-900/50 hover:bg-zinc-800/80 border-zinc-800/80 hover:border-zinc-700'
                }`}
                title={confirmingReset ? 'Click again to confirm reset' : 'Reset all inputs to baseline defaults'}
              >
                {confirmingReset ? (
                  <>
                    <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
                    <span className="font-semibold text-rose-300">Confirm Reset?</span>
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset Values</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Keyboard Hint */}
            <span className="hidden sm:inline-block text-[11px] font-mono text-zinc-400">
              Press <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 text-[10px]">Enter ↵</kbd> to proceed
            </span>

            {/* Next / Complete Button */}
            <motion.button
              type="button"
              onClick={() => {
                playNextSound();
                handleNext();
              }}
              whileHover={{
                scale: 1.04,
                y: -2,
                boxShadow: '0 14px 36px -6px rgba(52,211,153,0.5)',
              }}
              whileTap={{ scale: 0.95 }}
              transition={springPop}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-bold text-sm text-carbon-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <span>{isLastStep ? 'Complete & View Footprint' : 'Next Category'}</span>
              {isLastStep ? <CheckCircle2 className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
            </motion.button>

          </div>

        </motion.div>
      </AnimatePresence>

    </div>
  );
};
