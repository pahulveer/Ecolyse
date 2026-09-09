/**
 * Transparent scientific emission factors for ECOLYSE — India Calibrated.
 * Citations include Central Electricity Authority (CEA), MoEFCC, BEE, UK DEFRA, and Poore & Nemecek.
 */

export interface FactorMetadata {
  value: number;
  unit: string;
  source: string;
  citation: string;
  notes?: string;
}

export const EMISSION_FACTORS = {
  // Electricity grid factors (kg CO2e per kWh / Unit)
  electricity: {
    // Central Electricity Authority (CEA) CO2 Baseline Database for the Indian Power Sector v19 (2023)
    standardGridAverage: {
      value: 0.716, // India's weighted average grid emission factor ~716g CO2e/kWh due to ~72% coal base load
      unit: 'kg CO2e / kWh (Unit)',
      source: 'Central Electricity Authority (CEA) India v19 (2023)',
      citation: 'Weighted average grid emission factor for Indian National Grid (716g CO2e/kWh)',
    },
    cleanRenewable: {
      value: 0.025,
      unit: 'kg CO2e / kWh',
      source: 'IPCC AR6 Annex III',
      citation: 'Lifecycle embodied footprint of rooftop solar PV / wind generation (25g CO2e/kWh)',
    },
  },

  // Cooking & Heating fuels in India
  cookingAndHeating: {
    lpg_cylinder: {
      value: 0.28, // ~1 cylinder per month = 12 cylinders/yr = ~0.28 tonnes CO2e/year
      unit: 'tonnes CO2e / home / yr',
      source: 'Petroleum Planning & Analysis Cell (PPAC) / IPCC',
      citation: 'Combustion of 14.2 kg liquefied petroleum gas (LPG) domestic cylinders',
    },
    piped_gas_png: {
      value: 0.22,
      unit: 'tonnes CO2e / home / yr',
      source: 'IGL / MGL City Gas Distribution LCAs',
      citation: 'Piped Natural Gas (PNG) methane distribution and combustion',
    },
    electric_induction: {
      value: 0.18,
      unit: 'tonnes CO2e / home / yr',
      source: 'Bureau of Energy Efficiency (BEE)',
      citation: 'High thermal efficiency (85%+) electromagnetic induction cooktops',
    },
    biomass_chulha: {
      value: 0.55,
      unit: 'tonnes CO2e / home / yr',
      source: 'Council on Energy, Environment and Water (CEEW)',
      citation: 'Incomplete combustion of traditional firewood/dung with black carbon aerosol forcing',
    },
  },

  // Transportation in India (kg CO2e per km)
  transport: {
    motorcycle_petrol: {
      value: 0.045, // ~50-55 km/l 100-150cc bike/scooter
      unit: 'kg CO2e / km',
      source: 'ARAI (Automotive Research Association of India) & TERI',
      citation: 'Typical 100-125cc commuter motorcycle/scooter with average 50 km/l',
    },
    electric_scooter: {
      value: 0.014, // ~30 Wh/km on Indian grid
      unit: 'kg CO2e / km',
      source: 'NITI Aayog / TERI Electric Mobility Report',
      citation: 'High efficiency EV 2-wheeler charged on Indian grid (~14g CO2e/km)',
    },
    petrol_car: {
      value: 0.145, // ~15-18 km/l for hatchback/sedan
      unit: 'kg CO2e / km',
      source: 'BEE Fuel Economy Norms / ARAI',
      citation: 'Average Indian passenger car (14-16 km/l) with well-to-tank fuel factor',
    },
    diesel_car: {
      value: 0.155, // Diesel SUV / car
      unit: 'kg CO2e / km',
      source: 'ARAI / MoRTH emission inventories',
      citation: 'Diesel passenger car/SUV with upstream supply chain',
    },
    cng_car: {
      value: 0.105, // Factory CNG hatchback/sedan (~25 km/kg)
      unit: 'kg CO2e / km',
      source: 'TERI CNG Urban Vehicle LCA',
      citation: 'Compressed natural gas vehicle (lower carbon-to-hydrogen ratio)',
    },
    hybrid_car: {
      value: 0.088, // Strong hybrid (Grand Vitara, Hyryder, City e:HEV) ~25-28 km/l
      unit: 'kg CO2e / km',
      source: 'BEE Fuel Economy Benchmark & ARAI',
      citation: 'Strong hybrid electric vehicle with regenerative braking (40-50% EV drive cycle in city traffic)',
    },
    electric_car: {
      value: 0.075, // Grid-charged EV car in India (~110-130 Wh/km * 0.716 kg/kWh)
      unit: 'kg CO2e / km',
      source: 'CEEW Electric Mobility Assessment',
      citation: 'Electric car charged on Indian thermal-dominant grid',
    },
    auto_rickshaw: {
      value: 0.042, // CNG auto per passenger (shared occupancy)
      unit: 'kg CO2e / passenger-km',
      source: 'CSE (Centre for Science and Environment)',
      citation: 'Three-wheeler CNG auto-rickshaw with average 2 passengers',
    },
    train_metro: {
      value: 0.018, // Delhi Metro / Indian Railways electrified routes
      unit: 'kg CO2e / passenger-km',
      source: 'DMRC Sustainability Report & Indian Railways Net Zero Mission',
      citation: 'Electrified urban metro and suburban passenger rail with high occupancy',
    },
    bus: {
      value: 0.038, // DTC / BEST / BMTC city buses with high occupancy (~40-50 passengers)
      unit: 'kg CO2e / passenger-km',
      source: 'ASRTU (Association of State Road Transport Undertakings)',
      citation: 'Municipal transit bus with peak urban occupancy factor',
    },
    bicycle: {
      value: 0.003,
      unit: 'kg CO2e / km',
      source: 'European Cyclists Federation & TERI',
      citation: 'Embodied manufacturing lifecycle',
    },
    walk: {
      value: 0.000,
      unit: 'kg CO2e / km',
      source: 'Direct zero emission',
      citation: 'Active zero-carbon walking',
    },
  },

  // Aviation in India (kg CO2e per passenger-km with Radiative Forcing Index)
  aviation: {
    shortHaul: {
      averageDistanceKm: 600, // e.g. Delhi-Jaipur, Mumbai-Goa, Bengaluru-Chennai
      emissionFactorKgPerKm: 0.220,
      source: 'DGCA India / DEFRA Aviation Factors',
      citation: 'Domestic flight under 800 km including 1.9x high-altitude Radiative Forcing Index',
    },
    mediumHaul: {
      averageDistanceKm: 1800, // e.g. Delhi-Bengaluru, Mumbai-Kolkata
      emissionFactorKgPerKm: 0.175,
      source: 'DGCA Domestic Aviation Environmental Report',
      citation: 'Trunk route domestic flight across Indian sub-continent',
    },
    longHaul: {
      averageDistanceKm: 6500, // e.g. India to Europe / SE Asia / US connecting
      emissionFactorKgPerKm: 0.150,
      source: 'ICAO Carbon Emissions Calculator',
      citation: 'Intercontinental international flights with high-altitude forcing',
    },
    cabinClassMultiplier: {
      economy: 1.0,
      premium: 1.5,
      business: 2.8,
    },
  },

  // Dietary patterns in India (Annual tonnes CO2e per person)
  diet: {
    pure_vegetarian: {
      value: 1.15,
      unit: 'tonnes CO2e / yr',
      source: 'EAT-Lancet Indian Diet Study / ICMR-NIN',
      citation: 'Traditional Indian lacto-vegetarian diet (dal, roti, rice, sabzi, curd/paneer)',
    },
    jain_vegetarian: {
      value: 1.05,
      unit: 'tonnes CO2e / yr',
      source: 'ICMR Dietary Guidelines',
      citation: 'Plant-based with dairy, excludes root vegetables and tubers',
    },
    eggetarian: {
      value: 1.25,
      unit: 'tonnes CO2e / yr',
      source: 'Poore & Nemecek / ICMR',
      citation: 'Lacto-vegetarian diet supplemented with poultry eggs',
    },
    non_veg_regular: {
      value: 1.65,
      unit: 'tonnes CO2e / yr',
      source: 'Scarborough et al. & ICMR',
      citation: 'Non-vegetarian 2-3 times/week (predominantly chicken, eggs, and mutton/fish)',
    },
    non_veg_daily: {
      value: 2.20,
      unit: 'tonnes CO2e / yr',
      source: 'Nature Food LCA',
      citation: 'Non-vegetarian consumed daily including mutton/buff meat with ruminant enteric methane',
    },
    vegan: {
      value: 0.78,
      unit: 'tonnes CO2e / yr',
      source: 'Poore & Nemecek (2018)',
      citation: '100% plant-based diet excluding dairy, ghee, and curd',
    },
  },

  // Consumption & Waste in India
  consumption: {
    apparel: {
      frequently: 0.40,
      monthly: 0.22,
      seasonally: 0.12,
      rarely: 0.05,
      source: 'Textile Ministry / Fashion Revolution India',
      citation: 'Cotton and blended fabric manufacturing lifecycle',
    },
    electronics: {
      annualTonnesPerDeviceRefresh: 0.14,
      source: 'CPCB E-Waste Inventory',
      citation: 'Smartphones and laptops embodied wafer and hardware lifecycle',
    },
    waste: {
      baselineLandfillTonnes: 0.28,
      kabadiwalaReductionCredit: 0.14, // Informal sector recycling efficiency in India is world-leading!
      compostingReductionCredit: 0.08,
      source: 'NEERI / CPCB Solid Waste Assessment',
      citation: 'Avoided methane via doorstep scrap collection (Kabadiwala) and segregation',
    },
    digital: {
      low: 0.05,
      moderate: 0.12,
      heavy: 0.22,
      source: 'TRAI / IEA Data Centre Review',
      citation: 'Cellular 4G/5G streaming and cloud server data intensity',
    },
    pet: {
      none: 0.0,
      small_pet: 0.10,
      large_dog: 0.45,
      source: 'TERI Companion Animal Nutrition Study',
      citation: 'Pet food dietary protein lifecycle in Indian urban context',
    }
  },

  // Practical Appliance & Utility Calibration in India
  appliances: {
    acStarRatingMultiplier: {
      inverter_5star: 0.75, // BEE 5-star inverter saves ~25-30% power vs standard
      inverter_3star: 1.00, // Standard modern inverter benchmark (1.2 kW draw)
      non_inverter_standard: 1.35, // Older reciprocating/rotary compressor without inverter modulation
    },
    waterHeating: {
      solar_water_heater: 0.01, // Near zero operational emissions
      gas_geyser: 0.08, // PNG/LPG instantaneous geyser
      instant_electric: 0.12, // 3 kW instant geyser
      electric_storage_geyser: 0.18, // 15-25L storage geyser with standby thermal loss
    },
    // Weighted average domestic DISCOM tariff across Indian urban metros (BSES, BESCOM, MSEDCL, TNEB, Tata Power)
    averageDiscomTariffInrPerKwh: 7.25,
  }
};

export const BENCHMARKS = {
  parisTarget2030: 2.1, // Sustainable per capita ceiling to limit warming to 1.5°C
  indiaAverage: 1.9,    // Official India National Average per capita: ~1.9 t CO2e/year (MoEFCC / OWID)
  globalAverage: 4.8,   // World average: ~4.8 t CO2e/year
  chinaAverage: 8.9,    // China average: ~8.9 t CO2e/year
  euAverage: 7.2,       // EU average: ~7.2 t CO2e/year
  usAverage: 14.9,      // US average: ~14.9 t CO2e/year
};

