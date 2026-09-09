import React from 'react';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import { CalculatorProvider, useCalculator } from './context/CalculatorContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/home/LandingPage';
import { CalculatorWizard } from './components/calculator/CalculatorWizard';
import { ResultsDashboard } from './components/results/ResultsDashboard';
import { ClimateDataLab } from './components/climateData/ClimateDataLab';
import { EducationalSection } from './components/learn/EducationalSection';
import { MethodologyPage } from './components/methodology/MethodologyPage';
import { PresentationMode } from './components/presentation/PresentationMode';

const cubicEase = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Page transitions:
 * - Home page uses a gentle fade-in ONLY (it's full-scroll, not a "panel")
 * - All other views use a clean upward slide — like a real page loading, not a popup
 * - Exit is a fast fade-down (feels like navigating away cleanly)
 */
const pageFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.45, ease: cubicEase } },
  exit:    { opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } },
};

const pageSlideUp: Variants = {
  initial: { opacity: 0, y: 22 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.38, ease: cubicEase },
  },
  exit: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

const AppContent: React.FC = () => {
  const { view } = useCalculator();
  const isHome = view === 'home';

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [view]);

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-300">
      <div>
        <Navbar />
        <main className="w-full overflow-x-hidden">
          <AnimatePresence mode="wait" initial={false}>
            {view === 'home' && (
              <motion.div key="home" variants={pageFade} initial="initial" animate="animate" exit="exit">
                <LandingPage />
              </motion.div>
            )}
            {view === 'calculator' && (
              <motion.div key="calculator" variants={pageSlideUp} initial="initial" animate="animate" exit="exit">
                <CalculatorWizard />
              </motion.div>
            )}
            {view === 'results' && (
              <motion.div key="results" variants={pageSlideUp} initial="initial" animate="animate" exit="exit">
                <ResultsDashboard />
              </motion.div>
            )}
            {view === 'climate_data' && (
              <motion.div key="climate_data" variants={pageSlideUp} initial="initial" animate="animate" exit="exit">
                <ClimateDataLab />
              </motion.div>
            )}
            {view === 'learn' && (
              <motion.div key="learn" variants={pageSlideUp} initial="initial" animate="animate" exit="exit">
                <EducationalSection />
              </motion.div>
            )}
            {view === 'methodology' && (
              <motion.div key="methodology" variants={pageSlideUp} initial="initial" animate="animate" exit="exit">
                <MethodologyPage />
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>
      <Footer />
      <PresentationMode />
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <CalculatorProvider>
        <AppContent />
      </CalculatorProvider>
    </ThemeProvider>
  );
}
