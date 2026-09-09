import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Activity, Flame, ShieldAlert, Sparkles, TrendingUp, Compass } from 'lucide-react';
import { springPop, springSmooth } from '../common/MotionPrimitives';
import { useTheme } from '../../context/ThemeContext';

interface Milestone {
  year: string;
  ppm: number;
  label: string;
  sub: string;
  x: number;
  y: number;
  status: 'safe' | 'target' | 'critical';
}

const MILESTONES: Milestone[] = [
  { year: '1850', ppm: 280, label: 'Pre-Industrial Baseline', sub: 'Holocene thermal equilibrium', x: 40, y: 155, status: 'safe' },
  { year: '1960', ppm: 316, label: 'Keeling Observatory Begins', sub: 'Mauna Loa direct measurement', x: 190, y: 142, status: 'safe' },
  { year: '1990', ppm: 354, label: 'IPCC First Assessment', sub: 'Exceeding 350 ppm safe limit', x: 360, y: 124, status: 'target' },
  { year: '2015', ppm: 401, label: 'Paris Accord Adopted', sub: 'Crossed permanent 400 ppm boundary', x: 540, y: 88, status: 'critical' },
  { year: '2026', ppm: 426.8, label: 'Present Atmosphere', sub: 'Current global reading (+52% anomaly)', x: 720, y: 45, status: 'critical' },
];

export const ClimateFluxVisualizer: React.FC = () => {
  const [activeMilestone, setActiveMilestone] = useState<Milestone>(MILESTONES[4]);
  const { theme } = useTheme();
  const isLight = theme === 'light';

  // Smooth SVG cubic bezier curve through milestones
  const pathData = `M 40 155 C 120 152, 160 145, 190 142 C 270 138, 320 132, 360 124 C 440 112, 500 98, 540 88 C 610 74, 670 54, 720 45`;
  const areaData = `${pathData} L 720 180 L 40 180 Z`;

  return (
    <div className={`p-6 sm:p-8 rounded-3xl border transition-all duration-300 relative overflow-hidden shadow-2xl ${
      isLight
        ? 'bg-white border-slate-200'
        : 'bg-[#08130f]/90 border-emerald-500/30'
    }`}>
      {/* Background radial atmosphere glow */}
      <div className="absolute -top-20 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-emerald-950/40">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5 animate-pulse" />
            <span>Atmospheric Keeling Dynamics</span>
          </div>
          <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
            CO₂ Concentration Trajectory (1850 – 2026)
          </h3>
        </div>

        {/* Live Ticker Readout */}
        <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${
          isLight ? 'bg-emerald-50 border-emerald-200' : 'bg-[#040d08] border-emerald-500/40'
        }`}>
          <Flame className="w-4 h-4 text-amber-400" />
          <div className="text-right">
            <div className="text-[10px] uppercase font-mono text-zinc-400">Current Atmosphere</div>
            <div className={`text-base sm:text-lg font-black font-mono leading-none ${isLight ? 'text-emerald-800' : 'text-emerald-300'}`}>
              426.8 <span className="text-xs font-normal text-zinc-400">ppm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Kinetic SVG Canvas */}
      <div className="relative w-full h-56 sm:h-64 my-2">
        <svg
          viewBox="0 0 760 190"
          className="w-full h-full overflow-visible"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Area gradient under curve */}
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={isLight ? '#10b981' : '#34d399'} stopOpacity={isLight ? 0.25 : 0.28} />
              <stop offset="100%" stopColor={isLight ? '#10b981' : '#34d399'} stopOpacity="0" />
            </linearGradient>

            {/* Glowing stroke gradient along timeline */}
            <linearGradient id="strokeGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="60%" stopColor="#2dd4bf" />
              <stop offset="85%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>

            {/* Pulsing beacon glow filter */}
            <filter id="beaconGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Grid lines */}
          {[60, 100, 140, 175].map(y => (
            <line
              key={y}
              x1="30"
              y1={y}
              x2="730"
              y2={y}
              stroke={isLight ? '#e2e8f0' : 'rgba(16, 185, 129, 0.08)'}
              strokeDasharray="4 4"
              strokeWidth="1"
            />
          ))}

          {/* Safe 350 ppm Target Reference Line */}
          <line
            x1="30"
            y1="126"
            x2="730"
            y2="126"
            stroke="rgba(245, 158, 11, 0.45)"
            strokeDasharray="6 3"
            strokeWidth="1.5"
          />
          <text
            x="36"
            y="121"
            fill="#d97706"
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
          >
            PARIS 350 PPM SAFE CEILING (1.5°C)
          </text>

          {/* Shaded Area Under Curve */}
          <motion.path
            d={areaData}
            fill="url(#areaGradient)"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
          />

          {/* Animated Glowing Main Curve */}
          <motion.path
            d={pathData}
            fill="none"
            stroke="url(#strokeGradient)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#beaconGlow)"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.8, ease: [0.25, 1, 0.5, 1] }}
          />

          {/* Continuous 60FPS Kinetic Scanning Laser Comet */}
          <motion.circle
            r="5"
            fill="#ffffff"
            filter="url(#beaconGlow)"
            animate={{
              cx: [40, 190, 360, 540, 720, 540, 360, 190, 40],
              cy: [155, 142, 124, 88, 45, 88, 124, 142, 155],
              scale: [0.8, 1.1, 1.3, 1.5, 1.8, 1.5, 1.3, 1.1, 0.8],
              opacity: [0.5, 0.8, 0.95, 1, 1, 1, 0.95, 0.8, 0.5]
            }}
            transition={{
              repeat: Infinity,
              duration: 10,
              ease: 'easeInOut'
            }}
          />
          <motion.circle
            r="12"
            fill="none"
            stroke="#34d399"
            strokeWidth="1.5"
            animate={{
              cx: [40, 190, 360, 540, 720, 540, 360, 190, 40],
              cy: [155, 142, 124, 88, 45, 88, 124, 142, 155],
              scale: [1, 2, 1],
              opacity: [0.8, 0, 0.8]
            }}
            transition={{
              repeat: Infinity,
              duration: 10,
              ease: 'easeInOut'
            }}
          />

          {/* Milestones Points with Interactive Radar Rings */}
          {MILESTONES.map((m, idx) => {
            const isActive = activeMilestone.year === m.year;
            return (
              <g
                key={m.year}
                className="cursor-pointer"
                onClick={() => setActiveMilestone(m)}
                onMouseEnter={() => setActiveMilestone(m)}
              >
                {/* Outer animated ping ring */}
                {isActive && (
                  <motion.circle
                    cx={m.x}
                    cy={m.y}
                    r="12"
                    fill="none"
                    stroke={m.status === 'critical' ? '#f43f5e' : '#10b981'}
                    strokeWidth="1.5"
                    animate={{ scale: [1, 1.8, 1], opacity: [0.8, 0, 0.8] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
                  />
                )}

                {/* Node Center */}
                <circle
                  cx={m.x}
                  cy={m.y}
                  r={isActive ? 6 : 4}
                  fill={m.status === 'critical' ? '#ef4444' : m.status === 'target' ? '#f59e0b' : '#10b981'}
                  stroke={isLight ? '#ffffff' : '#040d08'}
                  strokeWidth="2"
                  className="transition-all duration-200"
                />

                {/* Year Label */}
                <text
                  x={m.x}
                  y="188"
                  textAnchor="middle"
                  fill={isActive ? (isLight ? '#059669' : '#34d399') : (isLight ? '#64748b' : '#71717a')}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight={isActive ? 'bold' : 'normal'}
                >
                  {m.year}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Interactive Milestone Focus Inspector (changes on scroll or hover) */}
      <motion.div
        key={activeMilestone.year}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springSmooth}
        className={`mt-4 p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isLight
            ? 'bg-slate-50 border-slate-200'
            : 'bg-[#050c08] border-emerald-500/20'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm ${
            activeMilestone.status === 'critical'
              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
              : activeMilestone.status === 'target'
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {activeMilestone.year}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-sm font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                {activeMilestone.label}
              </span>
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                {activeMilestone.ppm} ppm
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {activeMilestone.sub}
            </p>
          </div>
        </div>

        <div className="text-left sm:text-right font-mono text-xs">
          <div className="text-zinc-500 text-[10px] uppercase">Atmospheric Delta</div>
          <span className={`font-bold ${
            activeMilestone.ppm > 350
              ? 'text-rose-400'
              : 'text-emerald-400'
          }`}>
            {activeMilestone.ppm > 280 ? `+${(activeMilestone.ppm - 280).toFixed(1)} ppm from baseline` : 'Pre-industrial equilibrium'}
          </span>
        </div>
      </motion.div>
    </div>
  );
};
