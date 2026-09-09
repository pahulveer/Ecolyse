import React from 'react';
import { ArrowRight, BarChart3 } from 'lucide-react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { useCalculator } from '../../context/CalculatorContext';
import { EarthCanvas } from './EarthCanvas';
import { HeroMetricCard } from './HeroMetricCard';
import { HeroBenchmarkCard } from './HeroBenchmarkCard';
import { springSmooth, springPop } from '../common/MotionPrimitives';
import { playSelectSound } from '../../utils/soundEffects';

// Headline stagger — each word slides up smoothly
const headlineContainer = {
  initial: {},
  animate: { transition: { staggerChildren: 0.08, delayChildren: 0.08 } },
};

const headlineWord = {
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0, transition: springSmooth },
};

export const Hero: React.FC = () => {
  const { setView } = useCalculator();
  const { scrollY } = useScroll();

  // Multi-plane 3D spring-damped scroll parallax
  const smoothScrollY = useSpring(scrollY, { stiffness: 120, damping: 28 });
  const leftCardY = useTransform(smoothScrollY, [0, 700], [0, -85]);
  const leftCardRotate = useTransform(smoothScrollY, [0, 700], [0, -3.5]);
  const rightCardY = useTransform(smoothScrollY, [0, 700], [0, -115]);
  const rightCardRotate = useTransform(smoothScrollY, [0, 700], [0, 3.5]);

  const globeScale = useTransform(smoothScrollY, [0, 700], [1, 0.9]);
  const globeY = useTransform(smoothScrollY, [0, 700], [0, 40]);
  const headerY = useTransform(smoothScrollY, [0, 450], [0, -35]);
  const headerOpacity = useTransform(smoothScrollY, [0, 450], [1, 0.4]);

  return (
    <section className="relative pt-8 pb-16 md:pt-12 md:pb-20 overflow-hidden bg-grid-pattern">
      {/* Ambient radial glow centered behind globe */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-emerald-500/8 via-teal-500/4 to-transparent rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Centered Header Block with Parallax Float ── */}
        <motion.div 
          style={{ y: headerY, opacity: headerOpacity }}
          className="text-center max-w-2xl mx-auto"
        >

          {/* Eyebrow */}
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springSmooth, delay: 0.05 }}
            className="text-xs font-mono text-emerald-400 uppercase tracking-[0.2em] mb-5"
          >
            India-Calibrated Carbon Assessment
          </motion.p>

          {/* Headline — word stagger */}
          <motion.h1
            variants={headlineContainer}
            initial="initial"
            animate="animate"
            className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05] mb-6"
          >
            {["What\u2019s", 'your'].map(w => (
              <motion.span key={w} variants={headlineWord} className="inline-block mr-[0.25em]">
                {w}
              </motion.span>
            ))}
            <motion.span
              variants={headlineWord}
              className="inline-block bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent"
            >
              carbon footprint?
            </motion.span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springSmooth, delay: 0.3 }}
            className="text-base sm:text-lg text-zinc-400 leading-relaxed mb-8 max-w-xl mx-auto"
          >
            A scientifically rigorous, 3-minute assessment of your lifestyle emissions — grounded in IPCC AR6 and India's CEA grid data.
          </motion.p>

          {/* CTAs — two focused actions only */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springSmooth, delay: 0.42 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <motion.button
              whileHover={{ scale: 1.04, y: -2, boxShadow: '0 18px 44px -8px rgba(52,211,153,0.42)' }}
              whileTap={{ scale: 0.96 }}
              transition={springPop}
              onClick={() => {
                playSelectSound();
                setView('calculator');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 px-7 py-3.5 rounded-xl font-bold text-sm text-carbon-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-lg shadow-emerald-500/20"
            >
              <span>Calculate My Footprint</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              transition={springPop}
              onClick={() => {
                playSelectSound();
                setView('climate_data');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl font-medium text-sm text-zinc-300 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-emerald-500/30 transition-colors"
            >
              <BarChart3 className="w-4 h-4 text-emerald-400" />
              <span>Explore Climate Data</span>
            </motion.button>
          </motion.div>
        </motion.div>

        {/* ── Globe Stage with Parallax Recede ── */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ y: globeY }}
          transition={{ ...springSmooth, delay: 0.2 }}
          className="relative mt-8 lg:mt-10 flex flex-col items-center justify-center min-h-[400px] sm:min-h-[450px]"
        >
          {/* 3D Earth */}
          <div className="relative z-10 w-full flex items-center justify-center">
            <EarthCanvas />
          </div>

          {/* Desktop HUD — left wing with Parallax Float */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ y: leftCardY, rotate: leftCardRotate }}
            transition={{ ...springSmooth, delay: 0.6 }}
            className="hidden lg:block absolute left-0 xl:left-4 top-1/2 -translate-y-1/2 z-20 pointer-events-auto"
          >
            <HeroBenchmarkCard />
          </motion.div>

          {/* Desktop HUD — right wing with Parallax Float */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            style={{ y: rightCardY, rotate: rightCardRotate }}
            transition={{ ...springSmooth, delay: 0.7 }}
            className="hidden lg:block absolute right-0 xl:right-4 top-1/2 -translate-y-1/2 z-20 pointer-events-auto"
          >
            <HeroMetricCard />
          </motion.div>

          {/* Mobile cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springSmooth, delay: 0.5 }}
            className="lg:hidden mt-8 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto z-20"
          >
            <HeroMetricCard />
            <HeroBenchmarkCard />
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-1.5"
          >
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Scroll</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-8 bg-gradient-to-b from-emerald-500/40 to-transparent"
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
