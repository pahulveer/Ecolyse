import React, { useState, useEffect } from 'react';
import { 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Presentation, 
  Globe2, 
  TrendingDown, 
  Flame, 
  BookOpen, 
  Sliders, 
  Sparkles,
  Zap,
  ShieldCheck,
  Factory,
  Car,
  Plane,
  Utensils,
  ShoppingBag,
  Recycle,
  Activity,
  Scale,
  Train
} from 'lucide-react';
import { useCalculator } from '../../context/CalculatorContext';
import { PRESET_PROFILES } from '../../data/presets';
import { CLIMATE_DATASETS } from '../../data/climateDatasets';
import { BENCHMARKS } from '../../data/emissionFactors';

export const PresentationMode: React.FC = () => {
  const { 
    isPresentationMode, 
    setIsPresentationMode, 
    calculationResult, 
    loadPreset 
  } = useCalculator();

  const [slideIndex, setSlideIndex] = useState(0);
  const [activePresetId, setActivePresetId] = useState<string>('demo_profile');

  const slides = [
    // ──────────────────────────────────────────────────────────
    // SLIDE 1: PLATFORM OVERVIEW & VISION
    // ──────────────────────────────────────────────────────────
    {
      id: 'intro',
      title: 'ECOLYSE',
      subtitle: 'Consumption-Based Life Cycle Assessment (LCA) & Climate Action Simulator',
      tag: 'PROJECT OVERVIEW',
      content: (
        <div className="text-center space-y-6 max-w-4xl mx-auto py-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-mono text-xs">
            <Globe2 className="w-4 h-4 text-emerald-400" />
            <span>ENVIRONMENTAL STUDIES ACADEMIC CAPSTONE</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-tight">
            Understand your impact. <br />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
              Change your footprint.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-zinc-300 leading-relaxed max-w-2xl mx-auto">
            Bridging individual consumer agency with systemic climate science through real-time Life Cycle Assessment (LCA) modeling, interactive data visualizations, and dynamic decarbonization simulations.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-4 text-left">
            <div className="p-4 rounded-2xl bg-[#08120e] border border-emerald-950/80">
              <div className="text-emerald-400 font-mono text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>7 LCA DIMENSIONS</span>
              </div>
              <div className="text-xs text-zinc-400 mt-1">Full Scope 1, 2, & 3 personal lifecycle boundaries</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#08120e] border border-emerald-950/80">
              <div className="text-teal-400 font-mono text-xs font-bold flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>CEA & IPCC DATA</span>
              </div>
              <div className="text-xs text-zinc-400 mt-1">India national grid factor (716g/kWh) & IPCC AR6</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#08120e] border border-emerald-950/80">
              <div className="text-amber-400 font-mono text-xs font-bold flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5" />
                <span>WHAT-IF ENGINE</span>
              </div>
              <div className="text-xs text-zinc-400 mt-1">Instantaneous behavioral & technology simulations</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#08120e] border border-emerald-950/80">
              <div className="text-cyan-400 font-mono text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>LOCAL PRIVACY</span>
              </div>
              <div className="text-xs text-zinc-400 mt-1">Zero server tracking; 100% in-browser calculation</div>
            </div>
          </div>
        </div>
      )
    },

    // ──────────────────────────────────────────────────────────
    // SLIDE 2: ATMOSPHERIC TRAJECTORY & KEELING CURVE
    // ──────────────────────────────────────────────────────────
    {
      id: 'keeling',
      title: 'Atmospheric CO₂ & Planetary Limits',
      subtitle: 'Tracking historical greenhouse gas accumulation from pre-industrial baseline to modern tipping points',
      tag: 'CLIMATE DYNAMICS',
      content: (
        <div className="max-w-4xl mx-auto py-2 space-y-6 text-left">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { year: '1750', ppm: '280.0', label: 'Pre-Industrial Baseline', sub: 'Holocene climate stability equilibrium', color: 'text-zinc-300', bg: 'border-zinc-800' },
              { year: '1958', ppm: '315.7', label: 'Keeling Inception', sub: 'First systematic Mauna Loa measurements', color: 'text-emerald-300', bg: 'border-emerald-900/60' },
              { year: '2015', ppm: '400.8', label: 'Paris Climate Accord', sub: 'Passed permanent 400 ppm threshold', color: 'text-amber-400', bg: 'border-amber-900/60' },
              { year: '2024', ppm: '426.9', label: 'Modern Peak Record', sub: '+52.5% above pre-industrial levels', color: 'text-rose-400', bg: 'border-rose-900/60' },
            ].map((pt) => (
              <div key={pt.year} className={`p-4 rounded-2xl bg-[#08120e] border ${pt.bg} space-y-1.5`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-zinc-400">{pt.year}</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-zinc-300">PPM CO₂</span>
                </div>
                <div className={`text-3xl font-black font-mono ${pt.color}`}>{pt.ppm}</div>
                <div className="text-xs font-bold text-white">{pt.label}</div>
                <div className="text-[11px] text-zinc-400 leading-tight">{pt.sub}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-[#08130f] border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                <Flame className="w-4 h-4 text-emerald-400" />
                <span>1.5°C Carbon Budget</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Global carbon budget remaining for a 50% chance of capping warming at 1.5°C is ~<strong>250 Gt CO₂e</strong>. At current 40+ Gt/yr emission rates, this budget exhausts in <strong>under 6 years</strong>.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#08130f] border border-teal-500/30 space-y-2">
              <div className="flex items-center gap-2 text-teal-400 font-mono text-xs font-bold">
                <Activity className="w-4 h-4 text-teal-400" />
                <span>Radiative Forcing</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Current atmospheric radiative forcing is +2.72 W/m², trapping thermal energy equivalent to <strong>5 Hiroshima detonations per second</strong> into Earth's planetary systems.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#08130f] border border-amber-500/30 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
                <Zap className="w-4 h-4 text-amber-400" />
                <span>Non-CO₂ Super Pollutants</span>
              </div>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Methane (CH₄, GWP 27.9) and Nitrous Oxide (N₂O, GWP 273) from enteric fermentation and chemical fertilizers account for ~<strong>30% of gross positive warming</strong>.
              </p>
            </div>
          </div>
        </div>
      )
    },

    // ──────────────────────────────────────────────────────────
    // SLIDE 3: GLOBAL SECTOR BREAKDOWN (IPCC AR6)
    // ──────────────────────────────────────────────────────────
    {
      id: 'sectors',
      title: 'Global Greenhouse Gas Emissions by Sector',
      subtitle: 'Decomposing 59 Gt CO₂e annual global emissions across productive systems (IPCC AR6 WG3)',
      tag: 'GLOBAL MACRO SECTORS',
      content: (
        <div className="max-w-4xl mx-auto py-2 space-y-5 text-left">
          <div className="space-y-2.5">
            {CLIMATE_DATASETS.globalSectors.map((sec) => (
              <div key={sec.sector} className="p-3.5 rounded-xl bg-[#08120e] border border-emerald-950/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sec.color }} />
                    <span className="text-white text-sm">{sec.sector}</span>
                    <span className="text-zinc-400 font-mono font-normal">({sec.gigatonnesCO2e} Gt CO₂e/yr)</span>
                  </div>
                  <span className="font-mono text-emerald-400 text-sm font-black">{sec.percentage}%</span>
                </div>
                
                {/* Visual percentage progress bar */}
                <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${sec.percentage}%`, backgroundColor: sec.color }} 
                  />
                </div>
                <div className="text-[11px] text-zinc-400">{sec.description}</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-4">
            <div className="text-xs text-zinc-300 leading-relaxed">
              <strong className="text-emerald-400 font-semibold">Demand-Side Consumption Connection: </strong>
              Over <strong>65% of global end-use emissions</strong> map directly to household consumption choices — primarily residential conditioning, mobility modes, and agricultural food chain selection.
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] font-mono uppercase text-zinc-500">Gross Total</div>
              <div className="text-xl font-mono font-black text-white">~59 Gt CO₂e</div>
            </div>
          </div>
        </div>
      )
    },

    // ──────────────────────────────────────────────────────────
    // SLIDE 4: GLOBAL PER-CAPITA EQUITY & PARIS BENCHMARKS
    // ──────────────────────────────────────────────────────────
    {
      id: 'benchmarks',
      title: 'Global Per-Capita Equity & The Paris Ceiling',
      subtitle: 'Comparing national per-capita footprints against the 2030 Paris Climate Budget (2.1 t)',
      tag: 'PER-CAPITA BENCHMARKS',
      content: (
        <div className="max-w-4xl mx-auto py-2 space-y-6 text-left">
          <div className="space-y-3">
            {[
              { country: 'United States', tonnes: BENCHMARKS.usAverage, multiple: '7.1x Paris Target', color: '#ef4444', note: 'High suburban sprawl, SUV adoption, and heating energy' },
              { country: 'China', tonnes: BENCHMARKS.chinaAverage, multiple: '4.2x Paris Target', color: '#f97316', note: 'Heavy industrial manufacturing base and coal power expansion' },
              { country: 'European Union', tonnes: BENCHMARKS.euAverage, multiple: '3.4x Paris Target', color: '#f59e0b', note: 'Advanced grid decarbonization with moderate transport footprint' },
              { country: 'World Average', tonnes: BENCHMARKS.globalAverage, multiple: '2.3x Paris Target', color: '#06b6d4', note: 'Global weighted mean per human per calendar year' },
              { country: 'Paris 2030 Ceiling', tonnes: BENCHMARKS.parisTarget2030, multiple: '1.0x Target Limit', color: '#10b981', note: 'Maximum sustainable per-capita boundary for 1.5°C stabilization' },
              { country: 'India National Average', tonnes: BENCHMARKS.indiaAverage, multiple: '0.9x Paris Target', color: '#34d399', note: 'Low agrarian baseline; 1.9 t nationally, but higher in urban metros' },
            ].map((item) => (
              <div key={item.country} className="p-3 rounded-xl bg-[#08120e] border border-emerald-950/80 space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{item.country}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-400">{item.multiple}</span>
                  </div>
                  <div className="font-mono font-black text-sm" style={{ color: item.color }}>
                    {item.tonnes} t CO₂e
                  </div>
                </div>

                <div className="w-full h-2 rounded-full bg-zinc-900 overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(100, (item.tonnes / 16) * 100)}%`, backgroundColor: item.color }} 
                  />
                </div>
                <div className="text-[10px] text-zinc-500">{item.note}</div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#07130e] border border-teal-500/30 text-xs text-zinc-300 leading-relaxed">
            <strong className="text-teal-300 font-semibold">The "Dual India" Reality: </strong>
            While India's statistical national average is 1.9 t CO₂e (well within the Paris 2030 budget), affluent urban consumers in Bengaluru, Delhi, and Mumbai frequently generate <strong>4.5 to 12.0+ tonnes</strong> due to AC usage, private cars, and frequent domestic aviation.
          </div>
        </div>
      )
    },

    // ──────────────────────────────────────────────────────────
    // SLIDE 5: TRANSPORTATION EMISSIONS INTENSITY
    // ──────────────────────────────────────────────────────────
    {
      id: 'transport',
      title: 'Passenger Transit Carbon Intensity',
      subtitle: 'Lifecycle emissions per passenger-kilometer across transportation modes (UK DEFRA & DMRC)',
      tag: 'TRANSPORTATION BENCHMARKS',
      content: (
        <div className="max-w-4xl mx-auto py-2 space-y-5 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-2xl bg-[#140a0a] border border-rose-900/60 space-y-2">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs">
                <Plane className="w-4 h-4" />
                <span>Domestic Flight (with RFI)</span>
              </div>
              <div className="text-3xl font-black font-mono text-rose-400">246 g</div>
              <div className="text-[11px] text-zinc-400">CO₂e per passenger-km. High altitude radiative forcing multiplies warming impact by 1.9x.</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#160f08] border border-amber-900/60 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
                <Car className="w-4 h-4" />
                <span>Solo Petrol Car</span>
              </div>
              <div className="text-3xl font-black font-mono text-amber-400">170 g</div>
              <div className="text-[11px] text-zinc-400">CO₂e per passenger-km. Inefficient urban idling and low occupancy amplify commute impact.</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#08130f] border border-emerald-500/40 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <Train className="w-4 h-4 text-emerald-400" />
                <span>Electrified Rail / Metro</span>
              </div>
              <div className="text-3xl font-black font-mono text-emerald-300">35 g</div>
              <div className="text-[11px] text-zinc-400">CO₂e per passenger-km. High passenger density & regenerative braking offer ~80% abatement.</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Modality Intensity Spectrum (g CO₂e / p-km)</div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { mode: 'Short Flight', val: '246g', sub: 'Baseline', color: 'text-rose-400' },
                { mode: 'Petrol Car', val: '170g', sub: '-31%', color: 'text-amber-400' },
                { mode: 'Public Bus', val: '89g', sub: '-64%', color: 'text-cyan-400' },
                { mode: 'Electric Car', val: '45g', sub: '-82%', color: 'text-emerald-400' },
                { mode: 'Rail / Metro', val: '35g', sub: '-86%', color: 'text-teal-300' }
              ].map((m) => (
                <div key={m.mode} className="p-3 rounded-xl bg-[#08120e] border border-emerald-950/80 text-center">
                  <div className="text-xs text-zinc-300 font-medium">{m.mode}</div>
                  <div className={`text-xl font-mono font-black ${m.color}`}>{m.val}</div>
                  <div className="text-[10px] font-mono text-zinc-500">{m.sub}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-zinc-300">
            <strong>Case Study:</strong> A 1,400 km Delhi–Mumbai intercity trip generates <strong>~344 kg CO₂e</strong> by air vs. only <strong>~49 kg CO₂e</strong> on the electrified Indian Railways network — an immediate <strong>86% reduction</strong>.
          </div>
        </div>
      )
    },

    // ──────────────────────────────────────────────────────────
    // SLIDE 6: FOOD & AGROECOLOGICAL FOOTPRINT
    // ──────────────────────────────────────────────────────────
    {
      id: 'food',
      title: 'Dietary Carbon Intensity & Land-Use Impact',
      subtitle: 'Supply-chain lifecycle emissions per kilogram of food produced (Poore & Nemecek, Science)',
      tag: 'FOOD & AGROECOLOGY',
      content: (
        <div className="max-w-4xl mx-auto py-2 space-y-5 text-left">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { item: 'Beef Herd', val: '99.5 kg', note: 'Enteric methane + feed deforestation', color: 'text-rose-500', bar: '100%' },
              { item: 'Lamb / Mutton', val: '39.7 kg', note: 'Ruminant digestion and pasture land', color: 'text-orange-400', bar: '40%' },
              { item: 'Dairy Cheese', val: '23.9 kg', note: 'Concentrated milk fat processing', color: 'text-amber-400', bar: '24%' },
              { item: 'Poultry / Chicken', val: '9.9 kg', note: 'Efficient feed conversion ratio', color: 'text-yellow-300', bar: '10%' },
              { item: 'Paddy Rice', val: '4.5 kg', note: 'Anaerobic paddy water methane', color: 'text-emerald-400', bar: '4.5%' },
              { item: 'Tofu / Soy Protein', val: '3.2 kg', note: 'Direct human protein conversion', color: 'text-teal-300', bar: '3.2%' },
              { item: 'Pulses & Lentils (Dal)', val: '0.8 kg', note: 'Nitrogen-fixing legumes enrich soil', color: 'text-emerald-300', bar: '0.8%' },
              { item: 'Root Vegetables', val: '0.4 kg', note: 'Lowest cradle-to-plate lifecycle intensity', color: 'text-cyan-300', bar: '0.4%' },
            ].map((f) => (
              <div key={f.item} className="p-3.5 rounded-xl bg-[#08120e] border border-emerald-950/80 space-y-1">
                <div className="text-xs font-bold text-white truncate">{f.item}</div>
                <div className={`text-xl font-black font-mono ${f.color}`}>{f.val}</div>
                <div className="text-[10px] text-zinc-500 leading-tight">{f.note}</div>
                <div className="w-full h-1 rounded-full bg-zinc-900 overflow-hidden mt-1">
                  <div className="h-full bg-emerald-400 rounded-full" style={{ width: f.bar }} />
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-2xl bg-[#07130e] border border-emerald-500/30 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-zinc-300">
            <div>
              <strong className="text-emerald-400">The 124x Multiplier:</strong> Producing 1 kg of beef creates <strong>124 times</strong> more greenhouse gas emissions than 1 kg of lentils or beans, and consumes 20x more land surface.
            </div>
            <div>
              <strong className="text-teal-400">Dietary Abatement:</strong> Transitioning from heavy red meat to a lacto-vegetarian or plant-forward Indian diet abates <strong>0.8 to 1.6 tonnes CO₂e/person</strong> every year.
            </div>
          </div>
        </div>
      )
    },

    // ──────────────────────────────────────────────────────────
    // SLIDE 7: POWER GRID & ENERGY SYSTEM INTENSITY
    // ──────────────────────────────────────────────────────────
    {
      id: 'power',
      title: 'Electricity Generation Lifecycle Emissions',
      subtitle: 'Lifecycle emissions per kilowatt-hour generated across energy sources (IPCC AR6 Annex III)',
      tag: 'POWER SECTOR INTENSITY',
      content: (
        <div className="max-w-4xl mx-auto py-2 space-y-5 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#140a0a] border border-rose-950/60 space-y-3">
              <div className="text-xs font-mono uppercase text-rose-400 font-bold">Fossil Generation Baselines</div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline border-b border-rose-950/40 pb-1.5">
                  <span className="text-xs text-zinc-300">Sub-critical Thermal Coal</span>
                  <span className="font-mono font-bold text-rose-400 text-sm">820 g CO₂e/kWh</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-rose-950/40 pb-1.5">
                  <span className="text-xs text-zinc-300">India National Grid Average (CEA v19)</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">716 g CO₂e/kWh</span>
                </div>
                <div className="flex justify-between items-baseline pb-0.5">
                  <span className="text-xs text-zinc-300">Natural Gas Combined Cycle</span>
                  <span className="font-mono font-bold text-yellow-400 text-sm">490 g CO₂e/kWh</span>
                </div>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-[#08130f] border border-emerald-950/80 space-y-3">
              <div className="text-xs font-mono uppercase text-emerald-400 font-bold">Zero-Carbon & Renewable Baselines</div>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline border-b border-emerald-950/40 pb-1.5">
                  <span className="text-xs text-zinc-300">Rooftop Solar Photovoltaic (PV)</span>
                  <span className="font-mono font-bold text-emerald-300 text-sm">41 g CO₂e/kWh</span>
                </div>
                <div className="flex justify-between items-baseline border-b border-emerald-950/40 pb-1.5">
                  <span className="text-xs text-zinc-300">Reservoir Hydroelectric</span>
                  <span className="font-mono font-bold text-teal-300 text-sm">24 g CO₂e/kWh</span>
                </div>
                <div className="flex justify-between items-baseline pb-0.5">
                  <span className="text-xs text-zinc-300">Onshore Wind Turbine Systems</span>
                  <span className="font-mono font-bold text-emerald-400 text-sm">11 g CO₂e/kWh</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#07130e] border border-emerald-500/30 flex items-center justify-between gap-4">
            <div className="text-xs text-zinc-300 leading-relaxed">
              <strong className="text-emerald-400 font-semibold">PM Surya Ghar Yojana Impact: </strong>
              Installing a standard 3 kW residential rooftop solar array generates ~300 Units/month of clean electricity, offsetting ~3,600 kWh of thermal coal power and eliminating <strong>~2.5 metric tonnes of CO₂e</strong> annually.
            </div>
            <div className="text-right shrink-0">
              <div className="text-[10px] font-mono uppercase text-zinc-500">Grid vs Solar</div>
              <div className="text-2xl font-mono font-black text-emerald-400">-94%</div>
            </div>
          </div>
        </div>
      )
    },

    // ──────────────────────────────────────────────────────────
    // SLIDE 8: HOW ECOLYSE WORKS — 7 LCA DIMENSIONS
    // ──────────────────────────────────────────────────────────
    {
      id: 'architecture',
      title: 'How Ecolyse Works: 7-Dimensional LCA Scope',
      subtitle: 'Cradle-to-grave accounting framework calibrated to local Indian urban datasets',
      tag: 'ENGINEERING & METHODOLOGY',
      content: (
        <div className="max-w-4xl mx-auto py-2 space-y-4 text-left">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: Zap, title: '1. Home Energy', desc: 'Electricity Units (CEA factor 0.716), BEE 5-star AC inverter multipliers, PNG/LPG cooking gas', scope: 'Scope 1 & 2' },
              { icon: Car, title: '2. Daily Commute', desc: 'Powertrain matrix (petrol, EV, CNG, bus, metro), fuel efficiency curves, carpool occupancy', scope: 'Scope 1 & 3' },
              { icon: Plane, title: '3. Intercity Travel', desc: 'Haul distance tiers (<1000km, 1500km, 6000km), Radiative Forcing Index (1.9x), Indian Railways', scope: 'Scope 3' },
              { icon: Utensils, title: '4. Food & Nutrition', desc: 'Poore & Nemecek supply chain LCA across diets, dairy frequency, seasonal produce, food waste', scope: 'Scope 3' },
              { icon: ShoppingBag, title: '5. Goods & Clothing', desc: 'Fast fashion lifecycle (Textile Ministry), device hardware refresh cycles, second-hand share', scope: 'Scope 3' },
              { icon: Recycle, title: '6. Waste Circularity', desc: 'Baseline landfill methane (0.28t) offset by doorstep Kabadiwala recycling credit (-0.14t)', scope: 'Scope 3' },
            ].map((d) => {
              const Icon = d.icon;
              return (
                <div key={d.title} className="p-3.5 rounded-xl bg-[#08120e] border border-emerald-950/80 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                      <Icon className="w-3.5 h-3.5" />
                      <span className="text-white">{d.title}</span>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-900/60">
                      {d.scope}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">{d.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="p-3.5 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex items-center justify-between gap-4 text-xs text-zinc-300">
            <div>
              <strong>Pure Functional Engine:</strong> Zero network latency, sub-millisecond calculation execution, deterministic test coverage, and transparent data models.
            </div>
            <div className="font-mono text-emerald-400 font-bold text-xs shrink-0">
              TypeScript • React 19 • Tailwind CSS
            </div>
          </div>
        </div>
      )
    },

    // ──────────────────────────────────────────────────────────
    // SLIDE 9: LIVE ASSESSMENT BASELINE & PERSONA PROFILES
    // ──────────────────────────────────────────────────────────
    {
      id: 'persona',
      title: 'Live Assessment Baseline Profile',
      subtitle: 'Dynamic footprint results computed from active session data or calibrated persona',
      tag: 'LIVE TELEMETRY',
      content: (
        <div className="max-w-4xl mx-auto py-2 space-y-5 text-left">
          {/* Interactive Persona Switcher */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono text-zinc-400 uppercase tracking-wider">
              Switch Representative Demo Persona:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PRESET_PROFILES.map((preset) => {
                const isSelected = activePresetId === preset.id;
                return (
                  <button
                    key={preset.id}
                    onClick={() => {
                      setActivePresetId(preset.id);
                      loadPreset(preset.id);
                    }}
                    className={`p-2.5 rounded-xl text-left transition-all border text-xs ${
                      isSelected 
                        ? 'bg-emerald-950/80 border-emerald-400 text-white shadow-md shadow-emerald-950' 
                        : 'bg-[#08120e] border-emerald-950 hover:border-emerald-800 text-zinc-300'
                    }`}
                  >
                    <div className="font-bold text-[11px] truncate">{preset.name}</div>
                    <div className="text-[10px] font-mono text-emerald-400 mt-0.5">~{preset.expectedTonnes} t CO₂e</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Metric Display & Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#0c1e16] to-[#050b08] border border-emerald-500/40 text-center shadow-xl space-y-2">
              <div className="text-xs font-mono uppercase text-emerald-400 tracking-wider">
                Total Calculated Emissions
              </div>
              <div className="text-6xl font-black font-mono text-white tracking-tight">
                {calculationResult.totalTonnes}
              </div>
              <div className="text-xs font-bold text-emerald-300 font-mono">
                tonnes CO₂e / year
              </div>
              <div className="text-[11px] text-zinc-400 pt-2 border-t border-emerald-950/80">
                Impact Score: <span className="font-bold text-white">{calculationResult.impactScore} / 100</span>
              </div>
            </div>

            <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {calculationResult.categoryList.map((cat) => (
                <div key={cat.category} className="p-3 rounded-xl bg-[#08120e] border border-emerald-950/80 space-y-0.5">
                  <div className="text-[11px] font-medium text-zinc-400 truncate">{cat.label}</div>
                  <div className="text-lg font-black font-mono text-emerald-300">{cat.tonnes} t</div>
                  <div className="text-[10px] font-mono text-zinc-500">{cat.percentage}% of total</div>
                </div>
              ))}
              <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 flex flex-col justify-center">
                <div className="text-[10px] text-zinc-400 font-mono">Primary Driver</div>
                <div className="font-bold text-emerald-300 text-xs truncate mt-0.5">{calculationResult.biggestImpact.label}</div>
                <div className="text-[10px] text-zinc-400">{calculationResult.biggestImpact.percentage}% share</div>
              </div>
            </div>
          </div>
        </div>
      )
    },

    // ──────────────────────────────────────────────────────────
    // SLIDE 10: ACTIONABLE DECARBONIZATION ROADMAP
    // ──────────────────────────────────────────────────────────
    {
      id: 'actions',
      title: 'High-Leverage Decarbonization Roadmap',
      subtitle: 'Actionable opportunities ranked by emission abatement and implementation friction',
      tag: 'ABATEMENT ROADMAP',
      content: (
        <div className="max-w-4xl mx-auto py-2 space-y-3 text-left">
          {calculationResult.recommendations.slice(0, 4).map((rec, i) => (
            <div key={rec.id} className="p-4 rounded-2xl bg-[#08120e] border border-emerald-950/80 flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-emerald-400">0{i + 1}</span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300">
                    {rec.badge}
                  </span>
                  <span className="text-xs text-zinc-400">Difficulty: {rec.difficulty} • Cost: {rec.cost}</span>
                </div>
                <h4 className="text-sm font-bold text-white">{rec.title}</h4>
                <p className="text-xs text-zinc-400 leading-relaxed max-w-2xl">{rec.explanation}</p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-[10px] font-mono uppercase text-zinc-500">Savings</div>
                <div className="text-lg font-black font-mono text-emerald-400">
                  -{rec.potentialReductionTonnes} t
                </div>
              </div>
            </div>
          ))}

          <div className="p-3.5 rounded-xl bg-[#08130f] border border-teal-500/30 flex items-center justify-between text-xs text-zinc-300">
            <div>
              <strong className="text-teal-300">Cumulative Abatement Potential: </strong>
              Implementing the top 4 recommendations achieves an estimated <strong>35% to 60% gross reduction</strong> in household emissions.
            </div>
          </div>
        </div>
      )
    },

    // ──────────────────────────────────────────────────────────
    // SLIDE 11: SYNTHESIS & ACADEMIC TAKEAWAYS
    // ──────────────────────────────────────────────────────────
    {
      id: 'conclusion',
      title: 'Individual Agency & Systemic Decarbonization',
      subtitle: 'Key conclusions and environmental studies takeaways',
      tag: 'SYNTHESIS & TAKEAWAYS',
      content: (
        <div className="max-w-4xl mx-auto py-2 space-y-5 text-center">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="p-5 rounded-2xl bg-[#08120e] border border-emerald-950/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
                <TrendingDown className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-emerald-400 text-sm">1. Demand-Side Action Drives Velocity</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Consumer adoption of rooftop solar, electric 2-wheelers, and plant-forward nutrition creates production scale, lowers technology costs, and creates political consensus for ambitious targets.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#08120e] border border-emerald-950/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400">
                <Factory className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-teal-400 text-sm">2. Systemic Policy Enables Parity</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Individuals cannot unilaterally build high-speed rail lines, modernize the electrical transmission grid, or enact building codes. Systemic policy provides the structural baseline for net zero.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#08120e] border border-emerald-950/80 space-y-2">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Scale className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-cyan-300 text-sm">3. Transparent Telemetry Empowers Citizens</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">
                Platforms like Ecolyse remove the ambiguity from sustainability by replacing abstract guilt with verified scientific metrics and clear, ranked interventions.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs text-zinc-300 max-w-2xl mx-auto">
            <strong>Open Science References:</strong> Central Electricity Authority (CEA) India, IPCC AR6 WG3, Poore & Nemecek (Science 2018), UK DESNZ / DEFRA, DMRC Sustainability Audits.
          </div>
        </div>
      )
    }
  ];

  const currentSlide = slides[slideIndex];

  // Keyboard navigation for presentation mode
  useEffect(() => {
    if (!isPresentationMode) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        setSlideIndex(prev => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft') {
        setSlideIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        setIsPresentationMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPresentationMode, slides.length, setIsPresentationMode]);

  if (!isPresentationMode) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#040806] text-white flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-300 presentation-deck">
      
      {/* Top Slide Header Bar */}
      <div className="flex items-center justify-between border-b border-emerald-950/80 pb-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Presentation className="w-4 h-4" />
          </div>
          <div>
            <div className="font-mono text-[10px] text-emerald-400 uppercase tracking-widest">
              ECOLYSE PRESENTATION • {currentSlide.tag}
            </div>
            <div className="text-xs text-zinc-400 font-sans">
              Slide {slideIndex + 1} of {slides.length}
            </div>
          </div>
        </div>

        <button
          onClick={() => setIsPresentationMode(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-xs font-mono text-zinc-300 border border-zinc-700/60 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          <span>Exit Deck (Esc)</span>
        </button>
      </div>

      {/* Main Slide Content Stage with responsive scroll container */}
      <div className="my-auto py-4 overflow-y-auto max-h-[calc(100vh-140px)] pr-1">
        <div className="text-center mb-3">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {currentSlide.title}
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl mx-auto">
            {currentSlide.subtitle}
          </p>
        </div>

        {currentSlide.content}
      </div>

      {/* Bottom Controls Bar */}
      <div className="flex items-center justify-between border-t border-emerald-950/80 pt-3 text-xs">
        <div className="hidden sm:flex items-center gap-1.5 font-mono text-zinc-500">
          <span>Use</span>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[10px] text-zinc-300">←</kbd>
          <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-[10px] text-zinc-300">→</kbd>
          <span>or Spacebar</span>
        </div>

        {/* Slide navigation pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-xs sm:max-w-md py-1">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setSlideIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === slideIndex ? 'w-7 bg-emerald-400' : 'w-2 bg-zinc-800 hover:bg-zinc-700'
              }`}
              title={`Slide ${i + 1}: ${s.title}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSlideIndex(prev => Math.max(0, prev - 1))}
            disabled={slideIndex === 0}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 text-xs font-medium"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Prev</span>
          </button>

          <button
            onClick={() => setSlideIndex(prev => Math.min(slides.length - 1, prev + 1))}
            disabled={slideIndex === slides.length - 1}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-carbon-950 disabled:opacity-40 text-xs font-bold"
          >
            <span>Next</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};

