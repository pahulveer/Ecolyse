import React, { useState } from 'react';
import { 
  FileText, 
  BookOpen, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Database,
  Filter,
  Calculator
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { METHODOLOGY_DATA } from '../../data/methodology';
import { useTheme } from '../../context/ThemeContext';
import { springSmooth, springPop } from '../common/MotionPrimitives';

const EMISSION_TABLE_DATA = [
  { sector: 'Electricity', activity: 'Average Grid Mix', factor: '0.385', unit: 'kg CO₂e / kWh', source: 'IEA / EPA eGRID 2023' },
  { sector: 'Electricity', activity: 'Renewable Wind/Solar', factor: '0.025', unit: 'kg CO₂e / kWh', source: 'IPCC AR6 Annex III' },
  { sector: 'Transport', activity: 'Petrol Passenger Car', factor: '0.170', unit: 'kg CO₂e / km', source: 'UK DEFRA 2023 WTT' },
  { sector: 'Transport', activity: 'Electric Car (EV)', factor: '0.045', unit: 'kg CO₂e / km', source: 'Transport & Environment' },
  { sector: 'Transport', activity: 'Electric Passenger Rail', factor: '0.035', unit: 'kg CO₂e / p-km', source: 'European Env. Agency' },
  { sector: 'Aviation', activity: 'Short-Haul Flight', factor: '0.245', unit: 'kg CO₂e / km', source: 'DEFRA Flight (with 1.9x RFI)' },
  { sector: 'Food & Diet', activity: 'High Meat Diet', factor: '2.80', unit: 't CO₂e / person / yr', source: 'Scarborough et al. (Nature 2023)' },
  { sector: 'Food & Diet', activity: '100% Vegan Diet', factor: '0.85', unit: 't CO₂e / person / yr', source: 'Poore & Nemecek (Science 2018)' },
];

export const MethodologyPage: React.FC = () => {
  const { theme } = useTheme();
  const isLight = theme === 'light';
  const [selectedSector, setSelectedSector] = useState<string>('All');

  const filteredData = selectedSector === 'All' 
    ? EMISSION_TABLE_DATA 
    : EMISSION_TABLE_DATA.filter(item => item.sector === selectedSector);

  const sectors = ['All', 'Electricity', 'Transport', 'Aviation', 'Food & Diet'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 text-left">
      
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={springSmooth}
        className={`space-y-2 border-b pb-6 ${
          isLight ? 'border-slate-200' : 'border-emerald-950/70'
        }`}
      >
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 uppercase tracking-wider font-semibold">
          <FileText className="w-3.5 h-3.5" />
          <span>Scientific Accounting & Open Methodology</span>
        </div>
        <h2 className={`text-3xl sm:text-4xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Data, Assumptions & Calculation Formulas
        </h2>
        <p className={`text-sm max-w-2xl leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
          Full audit trail of calculation formulas, life cycle assessment (LCA) boundaries, emission factors, and peer-reviewed citations.
        </p>
      </motion.div>

      {/* Interactive Calculation Engine Mathematical Formula Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-5 transition-colors relative overflow-hidden group ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#09140f] border-emerald-500/30'
        }`}
      >
        {/* Continuous 60fps kinetic traveling light beam */}
        <motion.div
          animate={{ x: ['-100%', '200%'] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: 'linear' }}
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent pointer-events-none"
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 uppercase tracking-wider font-semibold">
            <Calculator className="w-4 h-4" />
            <span>Core Calculation Engine Architecture</span>
          </div>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span>MASS-BALANCE AUDITED</span>
          </span>
        </div>

        <h3 className={`text-xl sm:text-2xl font-black tracking-tight ${isLight ? 'text-slate-900' : 'text-white'}`}>
          Mass-Balance Emission Formulation
        </h3>
        <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
          Every category in Ecolyse uses empirical Activity Data multiplied by verified Life-Cycle Emission Factors (cradle-to-grave or cradle-to-retail):
        </p>

        <div className={`p-5 rounded-2xl border font-mono text-xs sm:text-sm overflow-x-auto flex flex-col gap-3 relative ${
          isLight ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-[#050a07] border-emerald-950/80 text-emerald-400'
        }`}>
          <div className="font-bold text-base text-emerald-500 flex items-center justify-between">
            <span>E_total = ∑ [ Activity_i × EF_i × (1 + GridLoss) ] × (1 - MitigationCredit)</span>
          </div>
          <div className={`text-xs space-y-1 ${isLight ? 'text-slate-600' : 'text-zinc-400'}`}>
            <div>• <strong>Activity_i:</strong> Consumed units (kWh grid electricity, liters petrol, passenger-km, food kg)</div>
            <div>• <strong>EF_i:</strong> GHG conversion factor in kg CO₂e / unit (IPCC AR6 / CEA 2023 / DEFRA)</div>
            <div>• <strong>GridLoss:</strong> India state transmission & distribution loss factor (~18–22%)</div>
          </div>
        </div>
      </motion.div>

      {/* Abstract Card */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-4 transition-colors ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#09140f] border-emerald-500/30'
        }`}
      >
        <h3 className={`text-xl font-bold flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
          <Database className="w-5 h-5 text-emerald-500" />
          <span>Accounting Principles & System Boundary</span>
        </h3>
        <p className={`text-xs sm:text-sm leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
          {METHODOLOGY_DATA.overview.abstract}
        </p>
        <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
          isLight ? 'bg-emerald-50/70 border-emerald-200 text-slate-700' : 'bg-[#050a07] border-emerald-950/80 text-zinc-400'
        }`}>
          <strong className="text-emerald-500">LCA System Boundary: </strong>
          {METHODOLOGY_DATA.overview.boundaries}
        </div>
      </motion.div>

      {/* Interactive Emission Factor Lookup Table with Category Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 transition-colors ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#08120e] border-emerald-950/80'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
          <div>
            <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
              Emission Factor Catalog
            </h3>
            <p className={`text-xs mt-0.5 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
              Underlying conversion coefficients applied in the calculation engine.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-500 font-bold px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 self-start sm:self-auto">
            CO₂e Standardized
          </span>
        </div>

        {/* Sector Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {sectors.map(sector => (
            <motion.button
              key={sector}
              onClick={() => setSelectedSector(sector)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.95 }}
              transition={springPop}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedSector === sector
                  ? 'bg-emerald-500 text-carbon-950 shadow-md shadow-emerald-500/20'
                  : isLight
                    ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    : 'bg-[#050a07] text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {sector}
            </motion.button>
          ))}
        </div>

        {/* Responsive Table with Hover Physics */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className={`border-b font-mono text-[11px] uppercase ${
                isLight ? 'border-slate-200 text-slate-500' : 'border-emerald-950/80 text-emerald-400'
              }`}>
                <th className="py-3 px-3">Sector</th>
                <th className="py-3 px-3">Activity / Fuel</th>
                <th className="py-3 px-3">Factor Value</th>
                <th className="py-3 px-3">Unit</th>
                <th className="py-3 px-3">Primary Source</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${isLight ? 'divide-slate-200 text-slate-700' : 'divide-emerald-950/50 text-zinc-300'}`}>
              {filteredData.map((row, idx) => (
                <motion.tr 
                  key={idx}
                  whileHover={{ backgroundColor: isLight ? 'rgba(236,253,245,0.7)' : 'rgba(6,78,59,0.2)' }}
                  transition={{ duration: 0.15 }}
                >
                  <td className={`py-3 px-3 font-semibold ${isLight ? 'text-slate-900' : 'text-white'}`}>
                    {row.sector}
                  </td>
                  <td className="py-3 px-3">{row.activity}</td>
                  <td className="py-3 px-3 font-mono font-bold text-emerald-500 text-sm">
                    {row.factor}
                  </td>
                  <td className={`py-3 px-3 font-mono ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    {row.unit}
                  </td>
                  <td className={`py-3 px-3 ${isLight ? 'text-slate-500' : 'text-zinc-400'}`}>
                    {row.source}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Assumptions & Regional Variance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -3 }}
          className={`p-6 rounded-3xl border space-y-3 transition-colors ${
            isLight ? 'bg-white border-slate-200 shadow-lg' : 'bg-[#070d0a] border-emerald-950/80 shadow-xl'
          }`}
        >
          <h4 className={`font-bold text-base flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Key Mathematical Assumptions</span>
          </h4>
          <ul className={`space-y-2 text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
            <li>• Household space cooling and fixed appliance baselines are shared equally among registered occupants.</li>
            <li>• Aviation includes a standard 1.9x Radiative Forcing Index (RFI) for high-altitude NOx and cirrus contrails.</li>
            <li>• Electric vehicle charging is calculated using regional marginal grid carbon intensity.</li>
            <li>• Circular goods credit reflects 45-80% virgin material manufacturing displacement.</li>
          </ul>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          whileHover={{ y: -3 }}
          className={`p-6 rounded-3xl border space-y-3 transition-colors ${
            isLight ? 'bg-white border-slate-200 shadow-lg' : 'bg-[#070d0a] border-emerald-950/80 shadow-xl'
          }`}
        >
          <h4 className={`font-bold text-base flex items-center gap-2 ${isLight ? 'text-slate-900' : 'text-white'}`}>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Scope & Modeling Constraints</span>
          </h4>
          <ul className={`space-y-2 text-xs leading-relaxed ${isLight ? 'text-slate-600' : 'text-zinc-300'}`}>
            <li>• Results are high-fidelity educational approximations, not certified financial greenhouse gas audits.</li>
            <li>• National grid carbon intensities fluctuate hourly based on solar, wind, and demand dispatch.</li>
            <li>• Municipal waste recycling effectiveness varies widely based on local urban infrastructure.</li>
            <li>• Agricultural emissions vary based on soil management practices and regional cold chain logistics.</li>
          </ul>
        </motion.div>

      </div>

      {/* Full Academic Bibliography / Citations */}
      <motion.div 
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className={`p-6 sm:p-8 rounded-3xl border shadow-xl space-y-6 transition-colors ${
          isLight ? 'bg-white border-slate-200' : 'bg-[#09140f] border-emerald-500/30'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-emerald-500 uppercase tracking-wider mb-1 font-semibold">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Academic Bibliography</span>
          </div>
          <h3 className={`text-xl font-bold ${isLight ? 'text-slate-900' : 'text-white'}`}>
            Peer-Reviewed Literature & Official Agency Reports
          </h3>
        </div>

        <div className="space-y-4">
          {METHODOLOGY_DATA.citations.map(cit => (
            <motion.div 
              key={cit.id} 
              whileHover={{ scale: 1.01 }}
              transition={springPop}
              className={`p-4 rounded-2xl border space-y-1.5 text-xs transition-colors ${
                isLight ? 'bg-slate-50 border-slate-200' : 'bg-[#050a07] border-emerald-950/70'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <span className={`font-bold ${isLight ? 'text-slate-900' : 'text-zinc-100'}`}>
                  {cit.author} ({cit.year})
                </span>
                <span className="text-[10px] font-mono text-emerald-500 uppercase px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 font-bold self-start sm:self-auto">
                  Applied: {cit.appliedIn}
                </span>
              </div>
              <p className={`italic ${isLight ? 'text-slate-700' : 'text-zinc-300'}`}>
                {cit.title}. <em>{cit.publication}</em>
              </p>
              <a 
                href={cit.doiOrUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-teal-500 hover:text-teal-400 font-mono transition-colors pt-1"
              >
                <span>{cit.doiOrUrl}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </motion.div>
          ))}
        </div>
      </motion.div>

    </div>
  );
};
