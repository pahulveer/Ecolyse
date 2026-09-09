export type CategoryKey = 
  | 'home' 
  | 'transport' 
  | 'travel' 
  | 'food' 
  | 'shopping' 
  | 'waste' 
  | 'lifestyle';

export interface HomeEnergyAnswers {
  homeType: 'apartment_flat' | 'independent_house' | 'builder_floor' | 'row_house_villa';
  occupants: number;
  homeSizeSqFt: number; // e.g. 650 (1BHK), 1100 (2BHK), 1600 (3BHK), 2500 (Bungalow)
  electricityKwhPerMonth: number; // monthly Units (kWh) from electricity bill (BESCOM, BSES, TNEB, MSEDCL, etc.)
  monthlyBillInr?: number; // Optional monthly electricity bill in INR (₹)
  cleanEnergyPercent: number; // Rooftop Solar (PM Surya Ghar) or green power %
  cookingFuelType: 'lpg_cylinder' | 'piped_gas_png' | 'electric_induction' | 'biomass_chulha';
  acUsageHoursPerDay: number; // AC usage during summer / year-round
  acStarRating?: 'inverter_5star' | 'inverter_3star' | 'non_inverter_standard'; // BEE efficiency
  waterHeatingType?: 'solar_water_heater' | 'electric_storage_geyser' | 'instant_electric' | 'gas_geyser';
}

export interface TransportationAnswers {
  primaryMode: 
    | 'motorcycle_petrol' 
    | 'electric_scooter' 
    | 'petrol_car' 
    | 'diesel_car' 
    | 'cng_car' 
    | 'hybrid_car'
    | 'electric_car' 
    | 'auto_rickshaw' 
    | 'train_metro' 
    | 'bus' 
    | 'bicycle' 
    | 'walk';
  weeklyCommuteKm: number;
  vehicleMileageKmpl: number; // km/l (e.g. 55 km/l bike, 16 km/l petrol car, 24 cng/hybrid)
  carpoolFrequency: 'never' | 'sometimes' | 'always';
}

export interface TravelAnswers {
  shortHaulFlightsPerYear: number; // Domestic flights < 800 km (e.g. Mumbai-Goa, Delhi-Jaipur)
  mediumHaulFlightsPerYear: number; // Trunk domestic flights (Delhi-Bengaluru, Mumbai-Kolkata)
  longHaulFlightsPerYear: number; // International trips (> 6 hours)
  flightCabinClass: 'economy' | 'premium' | 'business';
  indianRailwaysTripsPerYear: number; // Express / Vande Bharat / Rajdhani trips
  annualRoadTripKm: number; // Outstation road trips (Shimla, Goa, Lonavala, etc.)
}

export interface FoodDietAnswers {
  dietType: 
    | 'pure_vegetarian' 
    | 'jain_vegetarian' 
    | 'eggetarian' 
    | 'non_veg_regular' 
    | 'non_veg_daily' 
    | 'vegan';
  foodWasteLevel: 'low' | 'average' | 'high';
  localSeasonalShare: number; // 0 to 100% (buying from local mandi / seasonal sabzi)
  dairyConsumption: 'low' | 'moderate' | 'high'; // Chai, paneer, dahi, ghee
  diningOutDeliveryFrequency?: 'rarely' | 'weekly' | 'daily'; // Zomato/Swiggy/Restaurant frequency
}

export interface ShoppingAnswers {
  clothingFrequency: 'rarely' | 'seasonally' | 'monthly' | 'frequently';
  electronicsRefreshYears: number; // Phone / laptop replacement cycle
  secondHandSharePercent: number; // Refurbished electronics, pre-owned goods
  onlineDeliveryFrequency: 'rarely' | 'weekly' | 'daily'; // Blinkit, Zepto, Amazon, Flipkart
}

export interface WasteAnswers {
  kabadiwalaRecycling: 'regular' | 'occasional' | 'none'; // Doorstep scrap dealer for paper, cardboard, plastic, bottles
  compostsOrganicWaste: boolean; // Home wet-waste composting
  avoidsSingleUsePlastic: 'always' | 'often' | 'rarely'; // Cloth bag, stainless steel water bottle
}

export interface LifestyleAnswers {
  petOwnership: 'none' | 'small_pet' | 'large_dog';
  digitalFootprintTier: 'low' | 'moderate' | 'heavy'; // 4G/5G mobile data and streaming
  apparelEcoConscious: boolean; // Khadi, handloom, sustainable materials
}

export interface CalculatorState {
  home: HomeEnergyAnswers;
  transport: TransportationAnswers;
  travel: TravelAnswers;
  food: FoodDietAnswers;
  shopping: ShoppingAnswers;
  waste: WasteAnswers;
  lifestyle: LifestyleAnswers;
}

export interface CategoryContributor {
  name: string;
  tonnes: number;
  description: string;
}

export interface CategoryResult {
  category: CategoryKey;
  label: string;
  icon: string;
  tonnes: number;
  percentage: number;
  score: number; // 0 - 100 category efficiency
  contributors: CategoryContributor[];
  color: string;
}

export interface ActionRecommendation {
  id: string;
  category: CategoryKey;
  title: string;
  potentialReductionTonnes: number;
  difficulty: 'Easy' | 'Moderate' | 'Challenging';
  cost: 'Free' | '₹' | '₹₹' | '₹₹₹';
  timeframe: 'Immediate' | '1-2 weeks' | '1-3 months' | 'Long-term';
  explanation: string;
  badge: 'HIGH IMPACT' | 'QUICK WIN' | 'COST SAVER' | 'CLEAN TECH';
  committed?: boolean;
}

export interface CalculationResult {
  totalTonnes: number;
  categories: Record<CategoryKey, CategoryResult>;
  categoryList: CategoryResult[];
  benchmarkComparison: {
    indiaAverage: number; // 1.9 tonnes CO2e (National Average)
    parisTarget2030: number; // 2.1 tonnes
    globalAverage: number; // 4.8 tonnes
    usAverage: number; // 14.9 tonnes
    vsIndiaPercentage: number;
    vsGlobalPercentage: number;
  };
  impactScore: number; // 0 - 100 overall score
  biggestImpact: {
    category: CategoryKey;
    label: string;
    icon: string;
    tonnes: number;
    percentage: number;
    insight: string;
  };
  recommendations: ActionRecommendation[];
}

export interface WhatIfOverrides {
  reduceCarTravelPercent: number; // 0 to 60%
  cleanElectricityPercent: number; // Rooftop solar %
  dietShiftPlantShare: number; // Shift towards pure veg / vegan
  reduceFlightsCount: number; // Switch to Vande Bharat / Rajdhani
  eliminateFoodWaste: boolean;
  buySecondHandPercent: number; // Refurbished electronics
}
