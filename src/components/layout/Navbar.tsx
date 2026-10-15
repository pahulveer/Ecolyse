import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import { 
  Globe2, 
  Moon, 
  Sun, 
  Presentation, 
  Menu, 
  X, 
  Calculator,
  FileText,
  BookOpen,
  BarChart3,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useCalculator, type AppView } from '../../context/CalculatorContext';
import { springPop, springSmooth } from '../common/MotionPrimitives';
import { useSoundState, playSelectSound } from '../../utils/soundEffects';

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { view, setView, setIsPresentationMode } = useCalculator();
  const { isMuted, toggleSound } = useSoundState();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; view: AppView; icon: React.ReactNode }[] = [
    { label: 'Calculator', view: 'calculator', icon: <Calculator className="w-4 h-4" /> },
    { label: 'Climate Data', view: 'climate_data', icon: <BarChart3 className="w-4 h-4" /> },
    { label: 'Learn', view: 'learn', icon: <BookOpen className="w-4 h-4" /> },
    { label: 'Methodology', view: 'methodology', icon: <FileText className="w-4 h-4" /> },
  ];

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-500 ease-out ${
        isScrolled 
          ? 'py-2 mt-2 mx-3 sm:mx-4 lg:mx-auto max-w-6xl rounded-2xl bg-white/90 dark:bg-[#070c09]/90 backdrop-blur-xl border border-emerald-600/15 dark:border-emerald-900/30 shadow-lg shadow-emerald-950/[0.04] dark:shadow-black/40' 
          : 'py-4 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <motion.button 
            onClick={() => { setView('home'); setMobileMenuOpen(false); }}
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            transition={springSmooth}
            className="flex items-center gap-3 text-left group focus:outline-none cursor-pointer"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:border-emerald-400/60 transition-all duration-300 shadow-sm">
              <motion.div
                whileHover={{ rotate: 20 }}
                transition={springPop}
              >
                <Globe2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </motion.div>
              <div className="absolute inset-0 rounded-xl bg-emerald-400/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-lg font-heading bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 dark:from-emerald-300 dark:via-emerald-100 dark:to-teal-200 bg-clip-text text-transparent">
                  ECOLYSE
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                  LCA v2.4
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-emerald-100/50 -mt-0.5 tracking-tight font-sans">
                Understand your impact. Change your footprint.
              </p>
            </div>
          </motion.button>

          {/* Desktop Navigation Links — Matching Website Eco Theme */}
          <LayoutGroup>
            <nav className="hidden md:flex items-center gap-1 bg-emerald-950/[0.04] dark:bg-[#0c1611]/90 border border-emerald-600/20 dark:border-emerald-500/20 rounded-full px-2.5 py-1.5 backdrop-blur-xl shadow-sm shadow-emerald-950/5 dark:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.5)]">
              {navLinks.map(link => {
                const isActive = view === link.view;
                return (
                  <motion.button
                    key={link.view}
                    onClick={() => {
                      playSelectSound();
                      setView(link.view);
                    }}
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    transition={springPop}
                    className={`group relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer ${
                      isActive 
                        ? 'text-white font-bold' 
                        : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white hover:bg-emerald-500/10 dark:hover:bg-white/5'
                    }`}
                  >
                    {/* Active pill background — slides between buttons with solid, high-contrast eco fill */}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active-pill"
                        className="absolute inset-0 rounded-full bg-emerald-600 dark:bg-emerald-600 shadow-md shadow-emerald-700/25 dark:shadow-emerald-950/80 border border-emerald-500/40"
                        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
                      />
                    )}
                    <span className={`relative z-10 flex items-center gap-1.5 transition-colors ${
                      isActive 
                        ? 'text-white' 
                        : 'text-slate-500 dark:text-zinc-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-300'
                    }`}>
                      {link.icon}
                    </span>
                    <span className="relative z-10">
                      {link.label}
                    </span>
                  </motion.button>
                );
              })}
            </nav>
          </LayoutGroup>

          {/* Right Action Tools */}
          <div className="hidden lg:flex items-center gap-2.5">

            <motion.button
              onClick={() => setIsPresentationMode(true)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.94 }}
              transition={springPop}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-emerald-950/90 dark:text-emerald-200/90 bg-emerald-50/70 hover:bg-emerald-100/80 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 border border-emerald-600/20 dark:border-emerald-800/40 transition-colors cursor-pointer"
              title="Enter full-screen classroom presentation deck"
            >
              <Presentation className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
              <span>Presentation</span>
            </motion.button>

            {/* Theme Toggle Button */}
            <motion.button
              onClick={() => {
                playSelectSound();
                toggleTheme();
              }}
              whileHover={{ scale: 1.12, rotate: 15 }}
              whileTap={{ scale: 0.9, rotate: -15 }}
              transition={springPop}
              className="p-2 rounded-xl text-emerald-800/80 hover:text-emerald-700 dark:text-emerald-200/80 dark:hover:text-emerald-300 bg-emerald-50/60 hover:bg-emerald-100/70 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/50 border border-emerald-600/15 dark:border-emerald-800/40 transition-colors cursor-pointer"
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === 'dark' ? (
                  <motion.div
                    key="sun"
                    initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 90, scale: 0.6 }}
                    transition={springSmooth}
                  >
                    <Sun className="w-4 h-4 text-amber-400" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ opacity: 0, rotate: 90, scale: 0.6 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: -90, scale: 0.6 }}
                    transition={springSmooth}
                  >
                    <Moon className="w-4 h-4 text-emerald-600" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Audio FX Sound Toggle */}
            <motion.button
              onClick={toggleSound}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.9 }}
              transition={springPop}
              className="p-2 rounded-xl text-emerald-800/80 hover:text-emerald-700 dark:text-emerald-200/80 dark:hover:text-emerald-300 bg-emerald-50/60 hover:bg-emerald-100/70 dark:bg-emerald-950/30 dark:hover:bg-emerald-900/50 border border-emerald-600/15 dark:border-emerald-800/40 transition-colors cursor-pointer"
              title={isMuted ? 'Unmute UI sound effects' : 'Mute UI sound effects'}
              aria-label="Toggle sound effects"
            >
              <AnimatePresence mode="wait" initial={false}>
                {isMuted ? (
                  <motion.div
                    key="muted"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={springSmooth}
                  >
                    <VolumeX className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="unmuted"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={springSmooth}
                  >
                    <Volume2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Primary Action Button */}
            <AnimatePresence mode="wait" initial={false}>
              {view !== 'calculator' ? (
                <motion.button
                  key="calc-btn"
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={springSmooth}
                  onClick={() => setView('calculator')}
                  whileHover={{ scale: 1.05, y: -2, boxShadow: '0 12px 28px -6px rgba(16,185,129,0.35)' }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white dark:text-carbon-950 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 dark:from-emerald-400 dark:to-emerald-300 dark:hover:from-emerald-300 dark:hover:to-emerald-200 transition-all shadow-md shadow-emerald-600/20 dark:shadow-emerald-500/20 cursor-pointer"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Calculate Footprint</span>
                </motion.button>
              ) : (
                <motion.button
                  key="results-btn"
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={springSmooth}
                  onClick={() => setView('results')}
                  whileHover={{ scale: 1.04, y: -1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-800 dark:text-emerald-300 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900/60 border border-emerald-300 dark:border-emerald-500/40 transition-colors cursor-pointer"
                >
                  <span>View Results →</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <motion.button
              onClick={toggleTheme}
              whileHover={{ scale: 1.1, rotate: 12 }}
              whileTap={{ scale: 0.9 }}
              transition={springPop}
              className="p-2 rounded-xl text-emerald-800/80 hover:text-emerald-700 dark:text-emerald-200/80 dark:hover:text-emerald-300 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-600" />}
            </motion.button>
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.92 }}
              className="p-2 rounded-xl text-emerald-950/80 dark:text-emerald-100/80 hover:text-emerald-600 dark:hover:text-emerald-300 hover:bg-emerald-500/10 cursor-pointer"
              aria-label="Open menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={springSmooth}
                  >
                    <X className="w-5 h-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={springSmooth}
                  >
                    <Menu className="w-5 h-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>

        </div>

        {/* Mobile Dropdown Menu — spring slide-down */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -8 }}
              animate={{ opacity: 1, height: 'auto', y: 0 }}
              exit={{ opacity: 0, height: 0, y: -8 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="md:hidden mt-3 pt-3 border-t border-emerald-600/15 dark:border-emerald-900/40 pb-4 space-y-2 overflow-hidden bg-white/95 dark:bg-[#070c09]/95 backdrop-blur-xl rounded-2xl p-4 shadow-xl border border-emerald-600/20 dark:border-emerald-950"
            >
              {navLinks.map((link, idx) => (
                <motion.button
                  key={link.view}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...springSmooth, delay: idx * 0.08 }}
                  onClick={() => {
                    setView(link.view);
                    setMobileMenuOpen(false);
                  }}
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
                    view === link.view
                      ? 'bg-emerald-600 text-white font-bold shadow-md shadow-emerald-700/20'
                      : 'text-slate-600 dark:text-zinc-400 hover:bg-emerald-500/10 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <span className={view === link.view ? 'text-white' : 'text-slate-400 dark:text-zinc-500'}>
                    {link.icon}
                  </span>
                  {link.label}
                </motion.button>
              ))}
              
              <div className="pt-2 border-t border-emerald-600/15 dark:border-emerald-900/40">
                <motion.button
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...springSmooth, delay: navLinks.length * 0.06 }}
                  onClick={() => {
                    setIsPresentationMode(true);
                    setMobileMenuOpen(false);
                  }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.96 }}
                  className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold bg-emerald-50 hover:bg-emerald-100/80 dark:bg-[#0c1611] text-emerald-900 dark:text-emerald-200 border border-emerald-600/20 dark:border-emerald-800/40 cursor-pointer"
                >
                  <Presentation className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
                  <span>Presentation Mode</span>
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
};
