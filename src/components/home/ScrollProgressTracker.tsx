import React, { useState, useEffect } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowUp, Compass } from 'lucide-react';
import { playSelectSound } from '../../utils/soundEffects';
import { springPop, springSmooth } from '../common/MotionPrimitives';
import { useTheme } from '../../context/ThemeContext';

const STRATUMS = [
  { threshold: 0.18, code: '01', title: 'PLANETARY SURFACE', sub: 'Earth Telemetry HUD' },
  { threshold: 0.45, code: '02', title: 'CLIMATE FLUX', sub: 'IPCC & Keeling Dynamics' },
  { threshold: 0.72, code: '03', title: 'LCA BOUNDARIES', sub: 'Scope 1-3 Spectrum' },
  { threshold: 1.00, code: '04', title: 'SYSTEM FRAMEWORK', sub: 'Calibrated Science Engine' },
];

export const ScrollProgressTracker: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 32,
    restDelta: 0.001,
  });

  const [percent, setPercent] = useState(0);
  const [showWidget, setShowWidget] = useState(false);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  useEffect(() => {
    let prevVal = 0;
    let prevShow = false;
    return scrollYProgress.on('change', (latest: number) => {
      const rounded = Math.round(latest * 100);
      const shouldShow = latest > 0.05;
      if (rounded !== prevVal) {
        prevVal = rounded;
        setPercent(rounded);
      }
      if (shouldShow !== prevShow) {
        prevShow = shouldShow;
        setShowWidget(shouldShow);
      }
    });
  }, [scrollYProgress]);

  const currentStratum = STRATUMS.find(s => percent / 100 <= s.threshold) || STRATUMS[STRATUMS.length - 1];

  const scrollToTop = () => {
    playSelectSound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* ── Top Fixed Laser Beam Progress Line ── */}
      <div className="fixed top-0 left-0 right-0 z-50 h-[3px] pointer-events-none">
        <motion.div
          className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 origin-left relative"
          style={{ scaleX }}
        >
          {/* Glowing Comet Head at front of progress bar */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full blur-[2px] shadow-[0_0_12px_#34d399]" />
        </motion.div>
      </div>

      {/* ── Floating Biosphere Telemetry Widget (Bottom-Right) ── */}
      <AnimatePresence>
        {showWidget && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={springSmooth}
            className="fixed bottom-6 right-6 z-40 flex items-center gap-3 select-none"
          >
            {/* Stratum Info Pill */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className={`hidden sm:flex items-center gap-3 px-3.5 py-2 rounded-2xl border backdrop-blur-xl shadow-xl transition-colors ${
                isLight
                  ? 'bg-white/95 border-slate-200 text-slate-800'
                  : 'bg-[#09130e]/90 border-emerald-500/30 text-zinc-200'
              }`}
            >
              <div className="relative w-8 h-8 flex items-center justify-center">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke={isLight ? '#e2e8f0' : 'rgba(16, 185, 129, 0.15)'}
                    strokeWidth="2.5"
                  />
                  <motion.circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke={isLight ? '#059669' : '#34d399'}
                    strokeWidth="2.5"
                    strokeDasharray={94.2}
                    strokeDashoffset={94.2 - (percent / 100) * 94.2}
                    strokeLinecap="round"
                    transition={{ ease: 'easeOut', duration: 0.2 }}
                  />
                </svg>
                <span className="absolute text-[10px] font-mono font-bold">
                  {percent}%
                </span>
              </div>

              <div className="text-left font-sans">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[10px] font-mono font-bold ${isLight ? 'text-emerald-700' : 'text-emerald-400'}`}>
                    STRATUM {currentStratum.code}
                  </span>
                  <span className="text-[10px] text-zinc-500">•</span>
                  <span className="text-xs font-bold tracking-tight">
                    {currentStratum.title}
                  </span>
                </div>
                <div className="text-[10px] text-zinc-400 font-mono leading-none mt-0.5">
                  {currentStratum.sub}
                </div>
              </div>
            </motion.div>

            {/* Quick Scroll To Top Button */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.12, y: -2 }}
              whileTap={{ scale: 0.9 }}
              transition={springPop}
              title="Return to Earth Surface (Top)"
              aria-label="Scroll to top"
              className={`p-3 rounded-2xl border shadow-xl flex items-center justify-center transition-all ${
                isLight
                  ? 'bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 border-slate-200'
                  : 'bg-[#09130e]/95 hover:bg-emerald-950/60 text-emerald-400 border-emerald-500/40 shadow-emerald-950/50'
              }`}
            >
              <ArrowUp className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
