import React from 'react';
import { Globe2, Heart, ExternalLink, ShieldCheck, BookOpen, FileCheck } from 'lucide-react';
import { useCalculator, type AppView } from '../../context/CalculatorContext';

export const Footer: React.FC = () => {
  const { setView } = useCalculator();

  return (
    <footer className="mt-24 border-t border-slate-200 dark:border-emerald-950/60 bg-slate-50 dark:bg-[#050907] text-slate-600 dark:text-zinc-400 text-xs py-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-200 dark:border-emerald-950/40">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shadow-sm">
                <Globe2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span className="font-extrabold text-base tracking-wider text-slate-900 dark:text-zinc-100 font-heading">
                ECOLYSE
              </span>
            </div>
            <p className="text-slate-600 dark:text-zinc-400 max-w-sm leading-relaxed text-xs">
              Understand your impact. Change your footprint. A transparent, scientifically grounded environmental assessment engine and behavioral simulator.
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] text-emerald-700 dark:text-emerald-400/80 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>Full local privacy — your lifestyle calculations stay in your browser.</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-zinc-200 uppercase tracking-wider text-[11px] mb-3 font-mono">
              Platform Modules
            </h4>
            <ul className="space-y-2">
              {[
                { label: 'Interactive Assessment', view: 'calculator' as AppView },
                { label: 'Results & What-If Simulator', view: 'results' as AppView },
                { label: 'Climate Data Visualizations', view: 'climate_data' as AppView },
                { label: 'Educational Guides', view: 'learn' as AppView },
                { label: 'Scientific Methodology', view: 'methodology' as AppView }
              ].map(item => (
                <li key={item.label}>
                  <button
                    onClick={() => {
                      setView(item.view);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors text-left cursor-pointer font-medium"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Academic Citations & Sources */}
          <div>
            <h4 className="font-semibold text-slate-900 dark:text-zinc-200 uppercase tracking-wider text-[11px] mb-3 font-mono">
              Primary Data Citations
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li>
                <a 
                  href="https://www.ipcc.ch/report/ar6/wg3/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors hover:underline underline-offset-2"
                >
                  <span>IPCC AR6 Working Group III (2022)</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors hover:underline underline-offset-2"
                >
                  <span>UK DESNZ / DEFRA Conversion Factors</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a 
                  href="https://ourworldindata.org/environmental-impacts-of-food" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors hover:underline underline-offset-2"
                >
                  <span>Poore & Nemecek Food LCA (Science)</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
              <li>
                <a 
                  href="https://www.epa.gov/egrid" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-emerald-600 dark:hover:text-emerald-300 transition-colors hover:underline underline-offset-2"
                >
                  <span>US EPA eGRID Power Sector Database</span>
                  <ExternalLink className="w-2.5 h-2.5 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar & Academic Disclosure */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-zinc-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500/80 animate-pulse" />
            <span>
              Academic Project for <strong className="text-slate-700 dark:text-zinc-300">Environmental Studies</strong>.
            </span>
          </div>

          <div className="text-center sm:text-right max-w-md">
            Educational tool for individual learning and presentation. Not affiliated with or endorsed by official government bodies.
          </div>
        </div>

      </div>
    </footer>
  );
};
