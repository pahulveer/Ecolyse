import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, Info, BookOpen, X } from 'lucide-react';

interface TooltipExplainerProps {
  heading: string;
  explanation: string;
  source: string;
}

export const TooltipExplainer: React.FC<TooltipExplainerProps> = ({
  heading,
  explanation,
  source
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative inline-block" ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-1 rounded-md text-zinc-400 hover:text-emerald-400 hover:bg-emerald-950/40 transition-colors focus:outline-none focus:ring-1 focus:ring-emerald-500"
        title="Why we ask this & scientific calculation basis"
        aria-label="Scientific explanation"
      >
        <HelpCircle className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute left-0 sm:left-auto sm:right-0 mt-2 w-72 sm:w-80 p-4 rounded-xl bg-[#0c1410] border border-emerald-500/40 shadow-2xl shadow-black/80 z-50 text-xs text-left animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-start justify-between gap-2 border-b border-emerald-900/40 pb-2 mb-2.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono text-[11px] uppercase tracking-wider">
              <Info className="w-3.5 h-3.5 shrink-0" />
              <span>{heading}</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-500 hover:text-zinc-300 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-zinc-300 leading-relaxed mb-3">
            {explanation}
          </p>

          <div className="pt-2 border-t border-emerald-950/80 flex items-center gap-1.5 text-[10px] text-zinc-400 font-mono">
            <BookOpen className="w-3 h-3 text-emerald-500 shrink-0" />
            <span className="truncate">Ref: {source}</span>
          </div>
        </div>
      )}
    </div>
  );
};
