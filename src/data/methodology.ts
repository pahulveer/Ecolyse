export interface AcademicCitation {
  id: string;
  author: string;
  year: number;
  title: string;
  publication: string;
  doiOrUrl: string;
  appliedIn: string;
}

export const METHODOLOGY_DATA = {
  overview: {
    title: 'Scientific Methodology & Accounting Principles',
    abstract: 'ECOLYSE calculates consumption-based personal greenhouse gas emissions using the internationally recognized GHG Protocol Corporate and Community accounting framework. Emissions are expressed in metric tonnes of Carbon Dioxide Equivalent (t CO2e) per calendar year, accounting for all major Kyoto Protocol greenhouse gases.',
    boundaries: 'Our assessment applies a "cradle-to-grave" Life Cycle Assessment (LCA) boundary encompassing direct combustion (Scope 1), purchased grid electricity and space conditioning (Scope 2), and embedded upstream supply chain impacts of aviation, food, apparel, and durable consumer goods (Scope 3).'
  },

  greenhouseGases: [
    {
      gas: 'Carbon Dioxide (CO₂)',
      formula: 'CO₂',
      gwp100: 1,
      atmosphericLifetime: '300–1,000 years',
      primarySources: 'Fossil fuel combustion (coal, oil, gas), industrial calcination, deforestation',
      relevance: 'The benchmark reference gas with an index value of 1.0.'
    },
    {
      gas: 'Methane (CH₄)',
      formula: 'CH₄',
      gwp100: 27.9,
      atmosphericLifetime: '11.8 years',
      primarySources: 'Ruminant enteric fermentation (cattle, sheep), anaerobic landfill decay, fugitive natural gas leaks',
      relevance: 'Over 80x more potent than CO2 in its first 20 years; rapid target for immediate climate cooling.'
    },
    {
      gas: 'Nitrous Oxide (N₂O)',
      formula: 'N₂O',
      gwp100: 273,
      atmosphericLifetime: '109 years',
      primarySources: 'Synthetic nitrogen fertilizers, agricultural soil management, chemical manufacturing',
      relevance: 'Dominates agricultural soil emissions; severe ozone-depleting and long-lived warming vector.'
    },
    {
      gas: 'Fluorinated Gases (HFCs, PFCs, SF₆)',
      formula: 'F-Gases',
      gwp100: '1,400 – 23,500',
      atmosphericLifetime: 'Decades to Millennia',
      primarySources: 'Refrigeration refrigerants, heat pump working fluids, semiconductor plasma etching',
      relevance: 'Synthetic high-GWP chemicals requiring hermetic containment and low-GWP transitions.'
    }
  ],

  personalScopes: [
    {
      scope: 'Personal Scope 1',
      label: 'Direct Emissions',
      description: 'Greenhouse gases combusted directly by your own equipment.',
      examples: ['Tailpipe combustion in gasoline/diesel cars', 'Natural gas boiler or heating oil furnace', 'Propane or gas cooking stoves']
    },
    {
      scope: 'Personal Scope 2',
      label: 'Purchased Energy Emissions',
      description: 'Indirect emissions resulting from the generation of electricity and district heat you consume.',
      examples: ['Grid electricity powering home lighting, air conditioning, computers, and EV charging']
    },
    {
      scope: 'Personal Scope 3',
      label: 'Value Chain & Embedded Emissions',
      description: 'Upstream and downstream emissions embedded in everything you buy, consume, and discard.',
      examples: ['Aviation fuel and high-altitude radiative forcing', 'Livestock feed and agricultural land clearance', 'Textile dyeing and semiconductor wafer fabrication', 'Landfill decomposition of discarded organic waste']
    }
  ],

  systemicVsIndividual: {
    title: 'Individual Agency vs. Systemic Decarbonization',
    summary: 'A common misconception is that climate change is solely a matter of individual consumer choices, or conversely, that personal choices are entirely meaningless compared to corporate and government actions. In truth, both systems are deeply interconnected.',
    individualRole: 'Individual choices directly influence 60-70% of global end-use emissions through diet, transit, and household energy. Personal adoption of clean technologies (EVs, heat pumps, plant-forward diets) creates market tipping points, drives economies of scale, and fosters cultural norms.',
    systemicRole: 'However, individuals cannot single-handedly build high-speed intercity railways, decarbonize the national electricity grid, reform municipal zoning, or phase out industrial fossil subsidies. Policy mandates, carbon pricing, and infrastructure investments provide the enabling framework for individuals to thrive with low emissions.'
  },

  citations: [
    {
      id: 'ipcc_ar6_wg3',
      author: 'IPCC (Intergovernmental Panel on Climate Change)',
      year: 2022,
      title: 'Climate Change 2022: Mitigation of Climate Change. Contribution of Working Group III to the Sixth Assessment Report',
      publication: 'Cambridge University Press',
      doiOrUrl: 'https://doi.org/10.1017/9781009157926',
      appliedIn: 'Global sector breakdown, lifecycle electricity intensities, and 1.5°C carbon budgets'
    },
    {
      id: 'defra_2023',
      author: 'UK Department for Energy Security and Net Zero (DESNZ / DEFRA)',
      year: 2023,
      title: 'Greenhouse Gas Reporting: Conversion Factors 2023',
      publication: 'UK Government Statistical Release',
      doiOrUrl: 'https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023',
      appliedIn: 'Vehicle fuel emissions per km, aviation radiative forcing multipliers, and space heating factors'
    },
    {
      id: 'poore_nemecek_2018',
      author: 'Poore, J., & Nemecek, T.',
      year: 2018,
      title: 'Reducing food’s environmental impacts through producers and consumers',
      publication: 'Science, 360(6392), 987–992',
      doiOrUrl: 'https://doi.org/10.1126/science.aaq0216',
      appliedIn: 'Comprehensive food carbon intensities and dietary pattern lifecycle differences'
    },
    {
      id: 'epa_egrid_2023',
      author: 'US Environmental Protection Agency (EPA)',
      year: 2023,
      title: 'Emissions & Generation Resource Integrated Database (eGRID2022)',
      publication: 'EPA Technical Report',
      doiOrUrl: 'https://www.epa.gov/egrid',
      appliedIn: 'Baseline electric grid intensities and sub-regional generation fuel mixes'
    },
    {
      id: 'lee_aviation_2021',
      author: 'Lee, D. S., et al.',
      year: 2021,
      title: 'The contribution of global aviation to anthropogenic climate forcing for 2000 to 2018',
      publication: 'Atmospheric Environment, 244, 117834',
      doiOrUrl: 'https://doi.org/10.1016/j.atmosenv.2020.117834',
      appliedIn: 'Aviation Radiative Forcing Index (RFI) non-CO2 contrail and cirrus multipliers'
    }
  ] as AcademicCitation[]
};
