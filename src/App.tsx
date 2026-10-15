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
import { ErrorBoundary } from './components/common/ErrorBoundary';

const cubicEase = [0.25, 0.46, 0.45, 0.94] as const;

/**
 * Clean, lightweight page transitions:
 * Fast, non-blocking animations that mount immediately without waiting for exit deadlocks.
 */
const pageFade: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: cubicEase } },
  exit:    { opacity: 0, transition: { duration: 0.12, ease: 'easeIn' } },
};

const pageSlideUp: Variants = {
  initial: { opacity: 0, y: 12 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, ease: cubicEase },
  },
  exit: {
    opacity: 0,
    y: -6,
    transition: { duration: 0.12, ease: 'easeIn' },
  },
};

const AppContent: React.FC = () => {
  const { view } = useCalculator();

  React.useEffect(() => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  }, [view]);

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-emerald-500/20 selection:text-emerald-300">
      <div>
        <Navbar />
        <main className="w-full overflow-x-hidden">
          <ErrorBoundary fallbackTitle="Ecolyse View Loading Error">
            <AnimatePresence initial={false}>
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
                  <ErrorBoundary fallbackTitle="Carbon Footprint Assessment Results">
                    <ResultsDashboard />
                  </ErrorBoundary>
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
          </ErrorBoundary>
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
