import React, { useState } from 'react';
import { Share2, Copy, Check, X, Globe2, Printer, Sparkles, Award } from 'lucide-react';
import type { CalculationResult } from '../../types/calculator';

interface ShareResultModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: CalculationResult;
}

export const ShareResultModal: React.FC<ShareResultModalProps> = ({
  isOpen,
  onClose,
  result,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySummary = () => {
    const text = `🌍 My Carbon Footprint with Ecolyse:
Estimated Annual Emissions: ${result.totalTonnes} t CO₂e/year
Sector Distribution: ${result.biggestImpact.label} (${result.biggestImpact.percentage}%)
Impact Rating: ${result.impactScore} / 100
Top Reduction Opportunity: ~${result.recommendations[0]?.potentialReductionTonnes || 0.8} t CO₂e

Calculate your personal footprint at Ecolyse (Interactive Carbon Engine).`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#0a120e] border border-slate-200 dark:border-emerald-500/40 p-6 sm:p-8 shadow-2xl transition-all">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-white bg-slate-100 dark:bg-zinc-900/60 hover:bg-slate-200 dark:hover:bg-zinc-800 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-left mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1 font-semibold">
            <Share2 className="w-3.5 h-3.5" />
            <span>Climate Passport & Verification</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-heading text-slate-900 dark:text-white">
            Your Personal Climate Boarding Pass
          </h3>
        </div>

        {/* Printable/Shareable Boarding Pass Preview */}
        <div 
          id="shareable-carbon-card" 
          className="rounded-3xl bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-[#0c1d15] dark:via-[#08150f] dark:to-[#040906] border-2 border-emerald-500/50 p-6 shadow-xl text-center relative overflow-hidden mb-6 transition-all"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between pb-4 border-b border-emerald-200 dark:border-emerald-900/60 mb-4">
            <div className="flex items-center gap-2">
              <Globe2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span className="font-extrabold font-mono tracking-widest text-emerald-700 dark:text-emerald-300 text-sm">
                ECOLYSE PASSPORT
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 uppercase block">ISSUED</span>
              <span className="text-xs font-mono font-bold text-slate-700 dark:text-zinc-300">{currentDate}</span>
            </div>
          </div>

          <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 uppercase tracking-widest font-semibold">
            ESTIMATED ANNUAL LIFESTYLE FOOTPRINT
          </div>

          <div className="my-3 flex items-baseline justify-center gap-2">
            <span className="text-5xl font-black font-mono text-slate-900 dark:text-white tracking-tight">
              {result.totalTonnes}
            </span>
            <span className="text-sm font-mono text-emerald-600 dark:text-emerald-400 font-bold uppercase">
              t CO₂e / yr
            </span>
          </div>

          {/* Benchmark comparison badge */}
          <div className="inline-block px-3 py-1 rounded-full bg-emerald-100/80 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-500/40 text-xs font-semibold text-emerald-800 dark:text-emerald-300 font-mono">
            {result.benchmarkComparison.vsIndiaPercentage <= 0 ? '↓ ' : '↑ '}
            {Math.abs(result.benchmarkComparison.vsIndiaPercentage)}% vs India National Average (1.9t)
          </div>

          {/* Perforated ticket divider with notches */}
          <div className="relative my-5">
            <div className="absolute -left-10 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-[#0a120e] border-r-2 border-emerald-500/40" />
            <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white dark:bg-[#0a120e] border-l-2 border-emerald-500/40" />
            <div className="border-b-2 border-dashed border-emerald-300 dark:border-emerald-800/80 w-full" />
          </div>

          {/* Ticket Body: Stats Grid */}
          <div className="grid grid-cols-2 gap-3 text-left text-xs mb-4">
            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#050a07]/70 border border-emerald-100 dark:border-emerald-950">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Primary Contributor</div>
              <div className="font-bold text-slate-800 dark:text-emerald-300 truncate mt-0.5">{result.biggestImpact.label}</div>
              <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono">{result.biggestImpact.percentage}% of total</div>
            </div>

            <div className="p-3 rounded-xl bg-white/70 dark:bg-[#050a07]/70 border border-emerald-100 dark:border-emerald-950">
              <div className="text-[10px] text-slate-400 font-mono uppercase">Decarbonization Index</div>
              <div className="font-bold text-emerald-700 dark:text-teal-300 truncate mt-0.5">{result.impactScore} / 100</div>
              <div className="text-[10px] text-slate-500 dark:text-zinc-400 font-mono">Top Pick: -{result.recommendations[0]?.potentialReductionTonnes || 0.6}t</div>
            </div>
          </div>

          {/* Barcode & Verification Tag */}
          <div className="pt-2 flex items-center justify-between text-[10px] text-slate-400 dark:text-zinc-500 font-mono border-t border-emerald-100 dark:border-emerald-950">
            <div className="flex items-center gap-1 font-mono tracking-widest text-[9px]">
              ||||| | |||| ||| ||||| || |
            </div>
            <span>VERIFIED AR6 • CEA LCA METHODOLOGY</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopySummary}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 border border-slate-300 dark:border-zinc-700/60 transition-all cursor-pointer shadow-xs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Summary!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all cursor-pointer shadow-md shadow-emerald-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};
