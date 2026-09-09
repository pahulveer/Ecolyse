import React, { useState } from 'react';
import { 
  BarChart3, 
  Globe2, 
  Car, 
  Utensils, 
  Zap, 
  TrendingUp, 
  Info, 
  ExternalLink,
  BookOpen,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CLIMATE_DATASETS } from '../../data/climateDatasets';
import { useTheme } from '../../context/ThemeContext';
import { springSmooth, springPop } from '../common/MotionPrimitives';

type ActiveTab = 'sectors' | 'transport' | 'food' | 'electricity' | 'keeling';

export const ClimateDataLab: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('sectors');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springSmooth}
        className={`text-left space-y-2 border-b pb-6 ${
          isLight ? 'border-slate-200' : 'border-emerald-950/70'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 uppercase tracking-wider font-semibold">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Scientific Data Lab</span>
        </div>
        <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Empirical Climate & Emissions Data
        </h2>
        <p className={`text-sm max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
          Interactive 60fps visualizations grounded directly in IPCC AR6 Working Group reports, peer-reviewed Life Cycle Assessments (LCA), and atmospheric observatory measurements.
        </p>

        {/* 60FPS Live Telemetry Stream Ticker */}
        <div className={`mt-4 p-3 rounded-2xl border flex items-center justify-between overflow-hidden relative ${
          isLight ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' : 'bg-[#040e08] border-emerald-500/30 text-emerald-300'
        }`}>
          <div className="flex items-center gap-2 text-xs font-mono shrink-0">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-bold uppercase tracking-wider">LIVE TELEMETRY STREAM:</span>
          </div>

          <motion.div
            animate={{ x: [40, -40] }}
            transition={{ repeat: Infinity, repeatType: 'reverse', duration: 12, ease: 'easeInOut' }}
            className="flex items-center gap-6 text-xs font-mono shrink-0 px-4"
          >
            <span>Atmospheric CO₂: <strong>426.85 ppm</strong></span>
            <span>•</span>
            <span>Global Flux: <strong>59.2 Gt CO₂e/yr</strong></span>
            <span>•</span>
            <span>Energy Sector: <strong>34.2%</strong></span>
            <span>•</span>
            <span>Paris Budget Remaining: <strong>~220 Gt</strong></span>
          </motion.div>
        </div>
      </motion.div>

      {/* Dataset Selection Tabs with kinetic layout pill */}
      <div className={`flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border transition-colors ${
        isLight ? 'bg-slate-100/90 border-slate-200' : 'bg-[#09130e] border-emerald-950/80'
      }`}>
        {[
          { id: 'sectors', label: 'Global Sectors (IPCC)', icon: Globe2 },
          { id: 'transport', label: 'Transport Intensity', icon: Car },
          { id: 'food', label: 'Food System LCA', icon: Utensils },
          { id: 'electricity', label: 'Electricity Generation', icon: Zap },
          { id: 'keeling', label: 'Atmospheric CO₂ (Keeling)', icon: TrendingUp }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <motion.button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as ActiveTab);
                setHoveredIndex(null);
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              transition={springPop}
              className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive 
                  ? 'bg-emerald-500 text-carbon-950 shadow-lg shadow-emerald-500/25' 
                  : isLight
                    ? 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                    : 'text-zinc-400 hover:text-white hover:bg-emerald-950/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Animated Tab Content Container */}
      <AnimatePresence mode="wait">
        
        {/* TAB 1: Global Greenhouse Gas Emissions by Sector */}
        {activeTab === 'sectors' && (
          <motion.div
            key="sectors"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl transition-colors relative overflow-hidden group ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#09140f]/90 border-emerald-500/30'
            }`}>
              {/* Continuous 60fps kinetic traveling light beam */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
                className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none"
              />

              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b ${
                isLight ? 'border-slate-200' : 'border-emerald-950/70'
              }`}>
                <div>
                  <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Global GHG Emissions by Economic Sector
                  </h3>
                  <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    Total annual global anthropogenic emissions: ~59 Gt CO₂e (Gigatonnes)
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-500 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  Source: IPCC AR6 WGIII (2022)
                </span>
              </div>

              {/* Kinetic Animated Stacked Bars */}
              <div className="space-y-5">
                {CLIMATE_DATASETS.globalSectors.map((item, idx) => (
                  <motion.div 
                    key={item.sector} 
                    className={`p-3.5 rounded-2xl border transition-all duration-200 ${
                      hoveredIndex === idx
                        ? isLight ? 'bg-emerald-50/70 border-emerald-300' : 'bg-emerald-950/30 border-emerald-500/40'
                        : isLight ? 'bg-slate-50 border-slate-100' : 'bg-[#050a07] border-white/5'
                    }`}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    whileHover={{ scale: 1.01 }}
                    transition={springPop}
                  >
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-zinc-100'}`}>
                        {item.sector}
                      </span>
                      <span className="font-mono font-extrabold text-emerald-500 text-sm">
                        {item.percentage}% <span className={`text-xs font-normal ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>({item.gigatonnesCO2e} Gt CO₂e)</span>
                      </span>
                    </div>

                    {/* Fluid 60fps Spring Bar with Continuous Kinetic Shimmer */}
                    <div className={`h-3.5 w-full rounded-full overflow-hidden relative ${
                      isLight ? 'bg-slate-200' : 'bg-emerald-950/50'
                    }`}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ type: 'spring', stiffness: 70, damping: 18, delay: idx * 0.05 }}
                        className="h-full rounded-full relative overflow-hidden"
                        style={{ backgroundColor: item.color }}
                      >
                        {/* 60fps traveling laser shimmer */}
                        <motion.div
                          animate={{ x: ['-100%', '250%'] }}
                          transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: idx * 0.18 }}
                          className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent pointer-events-none rounded-full"
                        />
                        <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40 rounded-full" />
                      </motion.div>
                    </div>

                    <p className={`text-[11px] mt-1.5 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
                      {item.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 2: Transport Intensity */}
        {activeTab === 'transport' && (
          <motion.div
            key="transport"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl transition-colors relative overflow-hidden group ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#09140f]/90 border-emerald-500/30'
            }`}>
              {/* Continuous 60fps kinetic traveling light beam */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
                className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none"
              />

              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b ${
                isLight ? 'border-slate-200' : 'border-emerald-950/70'
              }`}>
                <div>
                  <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Passenger Transport Carbon Intensity
                  </h3>
                  <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    Grams of CO₂e emitted per passenger-kilometer traveled (including radiative forcing for aviation)
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-500 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  UK DEFRA & European Env. Agency
                </span>
              </div>

              <div className="space-y-3.5">
                {CLIMATE_DATASETS.transportIntensity.map((item, idx) => {
                  const maxIntensity = 246;
                  const barWidth = Math.max(4, (item.intensityGramsPerKm / maxIntensity) * 100);

                  return (
                    <motion.div 
                      key={item.mode} 
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isLight ? 'bg-slate-50 border-slate-200 hover:border-emerald-400' : 'bg-[#050a07] border-white/5 hover:border-emerald-500/40'
                      }`}
                      whileHover={{ scale: 1.01, x: 3 }}
                      transition={springPop}
                    >
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
                          {item.mode}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                            {item.relativeScale}
                          </span>
                          <span className="font-mono font-black text-emerald-500 text-sm w-16 text-right">
                            {item.intensityGramsPerKm} g
                          </span>
                        </div>
                      </div>

                      <div className={`h-2.5 w-full rounded-full overflow-hidden ${
                        isLight ? 'bg-slate-200' : 'bg-emerald-950/40'
                      }`}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${barWidth}%` }}
                          transition={{ type: 'spring', stiffness: 80, damping: 18, delay: idx * 0.04 }}
                          className="h-full rounded-full relative overflow-hidden"
                          style={{ backgroundColor: item.color }}
                        >
                          {/* 60fps traveling laser shimmer */}
                          <motion.div
                            animate={{ x: ['-100%', '250%'] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: idx * 0.12 }}
                            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent pointer-events-none rounded-full"
                          />
                          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40 rounded-full" />
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 3: Food Carbon Intensity */}
        {activeTab === 'food' && (
          <motion.div
            key="food"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl transition-colors relative overflow-hidden group ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#09140f]/90 border-emerald-500/30'
            }`}>
              {/* Continuous 60fps kinetic traveling light beam */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
                className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none"
              />

              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b ${
                isLight ? 'border-slate-200' : 'border-emerald-950/70'
              }`}>
                <div>
                  <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Food Lifecycle Carbon Intensity
                  </h3>
                  <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    Kilograms of CO₂e emitted per kilogram of food product (cradle-to-retail meta-analysis)
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-500 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  Poore & Nemecek (Science 2018)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {CLIMATE_DATASETS.foodIntensity.map((item, idx) => {
                  const maxFood = 99.5;
                  const width = Math.max(3, (item.kgCO2ePerKg / maxFood) * 100);

                  return (
                    <motion.div 
                      key={item.food} 
                      className={`p-4 rounded-2xl border flex flex-col justify-between gap-2.5 transition-all ${
                        isLight ? 'bg-slate-50 border-slate-200 hover:border-emerald-400' : 'bg-[#050a07] border-white/5 hover:border-emerald-500/40'
                      }`}
                      whileHover={{ y: -3, scale: 1.015 }}
                      transition={springPop}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div>
                          <span className={`font-bold block ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>
                            {item.food}
                          </span>
                          <span className={`text-[10px] font-mono ${isLight ? 'text-slate-500' : 'text-zinc-500'}`}>
                            {item.category}
                          </span>
                        </div>
                        <span className="font-mono font-black text-emerald-500 text-sm">
                          {item.kgCO2ePerKg} <span className={`text-[10px] font-normal ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>kg CO₂e/kg</span>
                        </span>
                      </div>
                      <div className={`h-2.5 w-full rounded-full overflow-hidden ${
                        isLight ? 'bg-slate-200' : 'bg-emerald-950/50'
                      }`}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ type: 'spring', stiffness: 75, damping: 18, delay: idx * 0.035 }}
                          className="h-full rounded-full relative overflow-hidden"
                          style={{ backgroundColor: item.color }}
                        >
                          {/* 60fps traveling laser shimmer */}
                          <motion.div
                            animate={{ x: ['-100%', '250%'] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: idx * 0.1 }}
                            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent pointer-events-none rounded-full"
                          />
                          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40 rounded-full" />
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 4: Electricity Generation Lifecycle Intensity */}
        {activeTab === 'electricity' && (
          <motion.div
            key="electricity"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl transition-colors relative overflow-hidden group ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#09140f]/90 border-emerald-500/30'
            }`}>
              {/* Continuous 60fps kinetic traveling light beam */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
                className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none"
              />

              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b ${
                isLight ? 'border-slate-200' : 'border-emerald-950/70'
              }`}>
                <div>
                  <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Electricity Generation Lifecycle Carbon Intensity
                  </h3>
                  <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    Grams of CO₂e per kilowatt-hour generated (includes plant construction, fuel supply, and decommissioning)
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-500 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  IPCC AR6 Annex III LCA
                </span>
              </div>

              <div className="space-y-3">
                {CLIMATE_DATASETS.electricitySources.map((item, idx) => {
                  const max = 820;
                  const width = Math.max(2, (item.gCO2ePerKwh / max) * 100);

                  return (
                    <motion.div 
                      key={item.source} 
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isLight ? 'bg-slate-50 border-slate-200 hover:border-emerald-400' : 'bg-[#050a07] border-white/5 hover:border-emerald-500/40'
                      }`}
                      whileHover={{ scale: 1.01, x: 3 }}
                      transition={springPop}
                    >
                      <div className="flex items-center justify-between text-xs mb-2">
                        <span className={`font-bold ${isLight ? 'text-slate-800' : 'text-zinc-200'}`}>
                          {item.source}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded font-bold ${
                            isLight ? 'bg-slate-200 text-slate-700' : 'bg-zinc-900 text-zinc-300 border border-zinc-800'
                          }`}>
                            {item.type}
                          </span>
                          <span className="font-mono font-black text-emerald-500 text-sm w-16 text-right">
                            {item.gCO2ePerKwh} g
                          </span>
                        </div>
                      </div>

                      <div className={`h-2.5 w-full rounded-full overflow-hidden ${
                        isLight ? 'bg-slate-200' : 'bg-emerald-950/40'
                      }`}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ type: 'spring', stiffness: 80, damping: 18, delay: idx * 0.04 }}
                          className="h-full rounded-full relative overflow-hidden"
                          style={{ backgroundColor: item.color }}
                        >
                          {/* 60fps traveling laser shimmer */}
                          <motion.div
                            animate={{ x: ['-100%', '250%'] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: idx * 0.12 }}
                            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent pointer-events-none rounded-full"
                          />
                          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/40 rounded-full" />
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* TAB 5: Keeling Curve (Atmospheric CO2 Concentration) */}
        {activeTab === 'keeling' && (
          <motion.div
            key="keeling"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div className={`p-6 sm:p-8 rounded-3xl border shadow-2xl transition-colors relative overflow-hidden group ${
              isLight ? 'bg-white border-slate-200' : 'bg-[#09140f]/90 border-emerald-500/30'
            }`}>
              {/* Continuous 60fps kinetic traveling light beam */}
              <motion.div
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
                className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none"
              />

              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b ${
                isLight ? 'border-slate-200' : 'border-emerald-950/70'
              }`}>
                <div>
                  <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    Atmospheric CO₂ Concentrations (The Keeling Curve)
                  </h3>
                  <p className={`text-xs mt-1 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    Continuous measurements recorded at Mauna Loa Observatory, Hawaii (1958 to Present)
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-500 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  NOAA & Scripps Institution
                </span>
              </div>

              {/* Historical Timeline Bars with Kinetic Fill */}
              <div className="space-y-3.5">
                {CLIMATE_DATASETS.keelingCurve.map((pt, idx) => {
                  const minPpm = 300;
                  const maxPpm = 440;
                  const width = ((pt.ppm - minPpm) / (maxPpm - minPpm)) * 100;

                  return (
                    <motion.div 
                      key={pt.year} 
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isLight ? 'bg-slate-50 border-slate-200 hover:border-emerald-400' : 'bg-[#050a07] border-white/5 hover:border-emerald-500/40'
                      }`}
                      whileHover={{ scale: 1.01, x: 3 }}
                      transition={springPop}
                    >
                      <div className="flex items-center justify-between text-xs mb-2">
                        <div className="flex items-center gap-3">
                          <span className={`font-mono font-bold w-12 ${isLight ? 'text-slate-900' : 'text-zinc-200'}`}>
                            {pt.year}
                          </span>
                          {pt.milestone && (
                            <span className="text-[11px] text-emerald-500 font-semibold truncate max-w-sm">
                              • {pt.milestone}
                            </span>
                          )}
                        </div>
                        <span className="font-mono font-black text-emerald-500 text-sm">
                          {pt.ppm} ppm
                        </span>
                      </div>

                      <div className={`h-2.5 w-full rounded-full overflow-hidden ${
                        isLight ? 'bg-slate-200' : 'bg-emerald-950/40'
                      }`}>
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${width}%` }}
                          transition={{ type: 'spring', stiffness: 75, damping: 18, delay: idx * 0.04 }}
                          className="h-full rounded-full bg-gradient-to-r from-emerald-600 via-teal-500 to-amber-500 relative overflow-hidden"
                        >
                          {/* 60fps traveling laser shimmer */}
                          <motion.div
                            animate={{ x: ['-100%', '250%'] }}
                            transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut', delay: idx * 0.12 }}
                            className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent pointer-events-none rounded-full"
                          />
                          <div className="absolute right-0 top-0 bottom-0 w-2 bg-white/50 rounded-full" />
                        </motion.div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <div className={`mt-6 p-4 rounded-2xl border text-xs leading-relaxed ${
                isLight 
                  ? 'bg-emerald-50/80 border-emerald-200 text-slate-700' 
                  : 'bg-emerald-950/30 border-emerald-500/30 text-zinc-300'
              }`}>
                <strong className="text-emerald-500 font-bold">Contextual Baseline: </strong> 
                For over 800,000 years prior to the industrial revolution, atmospheric CO₂ never exceeded 300 ppm. Today it exceeds 426 ppm—a ~52% increase driven almost entirely by fossil combustion and land use disruption.
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
};
