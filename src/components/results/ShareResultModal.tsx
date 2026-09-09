import React, { useState } from 'react';
import { Share2, Download, Copy, Check, X, Globe2, Sparkles, Printer } from 'lucide-react';
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
Largest Sector: ${result.biggestImpact.label} (${result.biggestImpact.percentage}%)
Impact Score: ${result.impactScore} / 100
Committed Reductions: ~${result.recommendations[0]?.potentialReductionTonnes || 0.8} t CO₂e

Calculate your footprint at Ecolyse (Environmental Studies Project).`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0a120e] border border-emerald-500/40 p-6 sm:p-8 shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900/60 hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-left mb-6">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 uppercase tracking-wider mb-1">
            <Share2 className="w-3.5 h-3.5" />
            <span>Share & Export</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-white">
            Your Climate Impact Card
          </h3>
        </div>

        {/* Printable/Shareable Card Preview */}
        <div id="shareable-carbon-card" className="rounded-2xl bg-gradient-to-br from-[#0c1d15] via-[#08150f] to-[#040906] border-2 border-emerald-500/50 p-6 shadow-xl text-center relative overflow-hidden mb-6">
          
          <div className="flex items-center justify-between pb-4 border-b border-emerald-900/40 mb-4">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-emerald-400" />
              <span className="font-extrabold font-mono tracking-wider text-emerald-300 text-xs">
                ECOLYSE
              </span>
            </div>
            <span className="text-[10px] font-mono text-zinc-400">
              CONSUMPTION LCA
            </span>
          </div>

          <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-widest">
            MY ESTIMATED FOOTPRINT
          </div>

          <div className="my-2 flex items-baseline justify-center gap-1.5">
            <span className="text-5xl font-black font-mono text-white">
              {result.totalTonnes}
            </span>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase">
              t CO₂e / yr
            </span>
          </div>

          <p className="text-xs text-zinc-300 font-medium">
            {result.benchmarkComparison.vsIndiaPercentage <= 0 ? '↓ ' : '↑ '}
            {Math.abs(result.benchmarkComparison.vsIndiaPercentage)}% vs India national average
          </p>

          <div className="mt-5 pt-4 border-t border-emerald-950/80 grid grid-cols-2 gap-2 text-left text-xs">
            <div className="p-2 rounded-lg bg-[#050a07]/60">
              <div className="text-[10px] text-zinc-400 font-mono">Primary Driver</div>
              <div className="font-bold text-emerald-300 truncate">{result.biggestImpact.label}</div>
            </div>

            <div className="p-2 rounded-lg bg-[#050a07]/60">
              <div className="text-[10px] text-zinc-400 font-mono">Top Opportunity</div>
              <div className="font-bold text-teal-300 truncate">
                -{result.recommendations[0]?.potentialReductionTonnes || 0.6} t CO₂e
              </div>
            </div>
          </div>

          <div className="mt-4 text-[9px] text-zinc-400 font-mono">
            ecolyse • understand your impact. change your footprint.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleCopySummary}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/60 transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Summary!' : 'Copy Summary'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold bg-emerald-400 hover:bg-emerald-300 text-carbon-950 transition-colors shadow-md shadow-emerald-500/20"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>

      </div>
    </div>
  );
};
