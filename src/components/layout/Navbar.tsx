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
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'py-2.5 bg-[#070c09]/85 backdrop-blur-md border-b border-emerald-900/30 shadow-lg shadow-black/20' 
          : 'py-4 bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Brand Logo */}
          <motion.button 
            onClick={() => { setView('home'); setMobileMenuOpen(false); }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            transition={springPop}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:border-emerald-400/60 transition-all duration-300">
              <motion.div
                whileHover={{ rotate: 20 }}
                transition={springPop}
              >
                <Globe2 className="w-5 h-5 text-emerald-400" />
              </motion.div>
              <div className="absolute inset-0 rounded-xl bg-emerald-400/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-lg bg-gradient-to-r from-emerald-300 via-emerald-100 to-teal-200 bg-clip-text text-transparent">
                  ECOLYSE
                </span>
                <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  LCA v2.4
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/50 -mt-0.5 tracking-tight font-sans">
                Understand your impact. Change your footprint.
              </p>
            </div>
          </motion.button>

          {/* Desktop Navigation Links — with layoutId active indicator */}
          <LayoutGroup>
            <nav className="hidden md:flex items-center gap-1 bg-carbon-900/40 border border-emerald-950/60 rounded-full px-3 py-1.5 backdrop-blur-md">
              {navLinks.map(link => {
                const isActive = view === link.view;
                return (
                  <motion.button
                    key={link.view}
                    onClick={() => {
                      playSelectSound();
                      setView(link.view);
                    }}
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    transition={springPop}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                      isActive 
                        ? 'text-emerald-200' 
                        : 'text-zinc-400 hover:text-zinc-100'
                    }`}
                  >
                    {/* Active pill background — slides between buttons */}
                    {isActive && (
                      <motion.div
                        layoutId="navbar-active-pill"
                        className="absolute inset-0 rounded-full bg-emerald-500/15 border border-emerald-500/30 shadow-sm shadow-emerald-950"
                        transition={springSmooth}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-1.5">
                      {link.icon}
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
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-zinc-900/50 hover:bg-zinc-800/60 border border-zinc-700/40 transition-colors"
              title="Enter full-screen classroom presentation deck"
            >
              <Presentation className="w-3.5 h-3.5 text-teal-400" />
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
              className="p-2 rounded-lg text-zinc-400 hover:text-emerald-300 hover:bg-emerald-950/30 border border-zinc-800/60 transition-colors"
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
                    <Moon className="w-4 h-4 text-emerald-500" />
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
              className="p-2 rounded-lg text-zinc-400 hover:text-emerald-300 hover:bg-emerald-950/30 border border-zinc-800/60 transition-colors"
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
                    <VolumeX className="w-4 h-4 text-zinc-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="unmuted"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                    transition={springSmooth}
                  >
                    <Volume2 className="w-4 h-4 text-emerald-400" />
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
                  whileHover={{ scale: 1.06, y: -2, boxShadow: '0 10px 28px -6px rgba(52,211,153,0.5)' }}
                  whileTap={{ scale: 0.94 }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-carbon-950 bg-emerald-400 hover:bg-emerald-300 transition-colors shadow-md shadow-emerald-500/20"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  <span>Calculate My Footprint</span>
                </motion.button>
              ) : (
                <motion.button
                  key="results-btn"
                  initial={{ opacity: 0, scale: 0.88 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.88 }}
                  transition={springSmooth}
                  onClick={() => setView('results')}
                  whileHover={{ scale: 1.05, y: -1 }}
                  whileTap={{ scale: 0.94 }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 transition-colors"
                >
                  <span>View Results Dashboard →</span>
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
              className="p-2 rounded-lg text-zinc-400 hover:text-emerald-300"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-emerald-500" />}
            </motion.button>
            <motion.button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              whileTap={{ scale: 0.92 }}
              className="p-2 rounded-lg text-zinc-300 hover:text-white hover:bg-zinc-800/50"
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
              className="md:hidden mt-3 pt-3 border-t border-emerald-900/40 pb-4 space-y-2 overflow-hidden"
            >
              {navLinks.map((link, idx) => (
                <motion.button
                  key={link.view}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ ...springSmooth, delay: idx * 0.06 }}
                  onClick={() => {
                    setView(link.view);
                    setMobileMenuOpen(false);
                  }}
                  whileHover={{ x: 6 }}
                  whileTap={{ scale: 0.97 }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    view === link.view
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-white'
                  }`}
                >
                  {link.icon}
                  {link.label}
                </motion.button>
              ))}
              
              <div className="pt-2 border-t border-emerald-900/40">
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
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-medium bg-zinc-900 text-zinc-300 border border-zinc-700/50"
                >
                  <Presentation className="w-3.5 h-3.5 text-teal-400" />
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
