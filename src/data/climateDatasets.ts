export interface SectorEmissionItem {
  sector: string;
  percentage: number;
  gigatonnesCO2e: number;
  color: string;
  description: string;
}

export interface TransportIntensityItem {
  mode: string;
  intensityGramsPerKm: number;
  category: 'Aviation' | 'Road' | 'Transit' | 'Active';
  color: string;
  relativeScale: string;
}

export interface FoodIntensityItem {
  food: string;
  kgCO2ePerKg: number;
  category: 'Meat & Dairy' | 'Plant Protein' | 'Produce & Grains';
  color: string;
}

export interface KeelingPoint {
  year: number;
  ppm: number;
  milestone?: string;
}

export interface EnergySourceItem {
  source: string;
  gCO2ePerKwh: number;
  type: 'Fossil' | 'Renewable' | 'Nuclear';
  color: string;
}

export const CLIMATE_DATASETS = {
  // IPCC AR6 Global Emissions by Economic Sector (Total ~59 Gt CO2e in 2019)
  globalSectors: [
    { sector: 'Energy Systems', percentage: 34, gigatonnesCO2e: 20.0, color: '#f59e0b', description: 'Electricity and heat generation, petroleum refining, and coal mining' },
    { sector: 'Industry', percentage: 24, gigatonnesCO2e: 14.1, color: '#ec4899', description: 'Steel, cement, chemical synthesis, and industrial manufacturing processes' },
    { sector: 'Agriculture & Land Use (AFOLU)', percentage: 22, gigatonnesCO2e: 13.0, color: '#10b981', description: 'Livestock enteric methane, deforestation, soil nitrous oxide, and fertilizers' },
    { sector: 'Transport', percentage: 15, gigatonnesCO2e: 8.7, color: '#06b6d4', description: 'Road freight, passenger cars, commercial aviation, and maritime shipping' },
    { sector: 'Buildings (Direct)', percentage: 6, gigatonnesCO2e: 3.5, color: '#8b5cf6', description: 'Direct fossil fuel space heating, hot water, and cooking combustion' }
  ] as SectorEmissionItem[],

  // Passenger Transport Intensity (grams CO2e per passenger-kilometer)
  transportIntensity: [
    { mode: 'Short-Haul Flight (with RFI)', intensityGramsPerKm: 246, category: 'Aviation', color: '#ef4444', relativeScale: 'Highest intensity' },
    { mode: 'Gasoline Car (1 Occupant)', intensityGramsPerKm: 170, category: 'Road', color: '#f97316', relativeScale: 'Standard vehicle' },
    { mode: 'Diesel Car (1 Occupant)', intensityGramsPerKm: 165, category: 'Road', color: '#fb923c', relativeScale: 'Standard vehicle' },
    { mode: 'Hybrid Car (1 Occupant)', intensityGramsPerKm: 108, category: 'Road', color: '#eab308', relativeScale: '36% reduction' },
    { mode: 'Municipal Bus', intensityGramsPerKm: 89, category: 'Transit', color: '#06b6d4', relativeScale: '48% reduction' },
    { mode: 'Electric Vehicle (Grid avg)', intensityGramsPerKm: 45, category: 'Road', color: '#10b981', relativeScale: '74% reduction' },
    { mode: 'Electric Intercity Rail', intensityGramsPerKm: 35, category: 'Transit', color: '#059669', relativeScale: '79% reduction' },
    { mode: 'Bicycle / Micro-mobility', intensityGramsPerKm: 5, category: 'Active', color: '#34d399', relativeScale: '97% reduction' },
    { mode: 'Walking', intensityGramsPerKm: 0, category: 'Active', color: '#6ee7b7', relativeScale: 'Zero emission' }
  ] as TransportIntensityItem[],

  // Food Carbon Intensity (kg CO2e per kg food product) - Poore & Nemecek (2018)
  foodIntensity: [
    { food: 'Beef (Beef Herd)', kgCO2ePerKg: 99.5, category: 'Meat & Dairy', color: '#dc2626' },
    { food: 'Lamb & Mutton', kgCO2ePerKg: 39.7, category: 'Meat & Dairy', color: '#ea580c' },
    { food: 'Cheese', kgCO2ePerKg: 23.9, category: 'Meat & Dairy', color: '#f59e0b' },
    { food: 'Pork', kgCO2ePerKg: 12.3, category: 'Meat & Dairy', color: '#fbbf24' },
    { food: 'Poultry Meat', kgCO2ePerKg: 9.9, category: 'Meat & Dairy', color: '#fde047' },
    { food: 'Eggs', kgCO2ePerKg: 4.7, category: 'Meat & Dairy', color: '#a3e635' },
    { food: 'Rice', kgCO2ePerKg: 4.5, category: 'Produce & Grains', color: '#34d399' },
    { food: 'Tofu / Soybeans', kgCO2ePerKg: 3.2, category: 'Plant Protein', color: '#10b981' },
    { food: 'Oat / Soy Milk', kgCO2ePerKg: 0.9, category: 'Plant Protein', color: '#059669' },
    { food: 'Beans & Pulses', kgCO2ePerKg: 0.8, category: 'Plant Protein', color: '#047857' },
    { food: 'Potatoes & Roots', kgCO2ePerKg: 0.5, category: 'Produce & Grains', color: '#065f46' },
    { food: 'Seasonal Vegetables', kgCO2ePerKg: 0.4, category: 'Produce & Grains', color: '#064e3b' }
  ] as FoodIntensityItem[],

  // Atmospheric CO2 Concentrations (Keeling Curve, Mauna Loa Observatory)
  keelingCurve: [
    { year: 1958, ppm: 315.7, milestone: 'First systematic measurements by Charles David Keeling' },
    { year: 1965, ppm: 320.0 },
    { year: 1975, ppm: 331.1 },
    { year: 1985, ppm: 346.0 },
    { year: 1990, ppm: 354.4, milestone: 'First IPCC Assessment Report (FAR)' },
    { year: 1997, ppm: 363.7, milestone: 'Kyoto Protocol adopted' },
    { year: 2005, ppm: 379.8 },
    { year: 2015, ppm: 400.8, milestone: 'Paris Climate Agreement (Passing 400 ppm)' },
    { year: 2020, ppm: 414.2 },
    { year: 2024, ppm: 426.9, milestone: 'Current global peak (approx 50% above pre-industrial 280 ppm)' }
  ] as KeelingPoint[],

  // Electricity Generation Lifecycle Emissions (g CO2e / kWh) - IPCC AR6 Annex III
  electricitySources: [
    { source: 'Coal (sub-critical)', gCO2ePerKwh: 820, type: 'Fossil', color: '#7f1d1d' },
    { source: 'Oil peaker', gCO2ePerKwh: 650, type: 'Fossil', color: '#991b1b' },
    { source: 'Natural Gas (Combined Cycle)', gCO2ePerKwh: 490, type: 'Fossil', color: '#b45309' },
    { source: 'Biomass Dedicated', gCO2ePerKwh: 230, type: 'Renewable', color: '#ca8a04' },
    { source: 'Solar Photovoltaic (Rooftop)', gCO2ePerKwh: 41, type: 'Renewable', color: '#10b981' },
    { source: 'Geothermal', gCO2ePerKwh: 38, type: 'Renewable', color: '#059669' },
    { source: 'Hydropower (Reservoir)', gCO2ePerKwh: 24, type: 'Renewable', color: '#0284c7' },
    { source: 'Nuclear Power', gCO2ePerKwh: 12, type: 'Nuclear', color: '#06b6d4' },
    { source: 'Offshore Wind', gCO2ePerKwh: 12, type: 'Renewable', color: '#2dd4bf' },
    { source: 'Onshore Wind Turbines', gCO2ePerKwh: 11, type: 'Renewable', color: '#34d399' }
  ] as EnergySourceItem[]
};
