import type { CalculatorState } from '../types/calculator';

export interface PresetProfile {
  id: string;
  name: string;
  tagline: string;
  icon: string;
  expectedTonnes: number;
  data: CalculatorState;
}

export const PRESET_PROFILES: PresetProfile[] = [
  {
    id: 'demo_profile',
    name: 'Indian Middle-Class Family',
    tagline: '4-person household with petrol 2-wheeler, apartment living, LPG cooking, and lacto-veg diet',
    icon: 'Sparkles',
    expectedTonnes: 2.4,
    data: {
      home: {
        homeType: 'apartment_flat',
        occupants: 4,
        homeSizeSqFt: 1100,
        electricityKwhPerMonth: 280, // Units/mo
        cleanEnergyPercent: 10,
        cookingFuelType: 'lpg_cylinder',
        acUsageHoursPerDay: 5,
        acStarRating: 'inverter_3star',
        waterHeatingType: 'electric_storage_geyser'
      },
      transport: {
        primaryMode: 'motorcycle_petrol',
        weeklyCommuteKm: 140,
        vehicleMileageKmpl: 50,
        carpoolFrequency: 'sometimes'
      },
      travel: {
        shortHaulFlightsPerYear: 1,
        mediumHaulFlightsPerYear: 1,
        longHaulFlightsPerYear: 0,
        flightCabinClass: 'economy',
        indianRailwaysTripsPerYear: 4,
        annualRoadTripKm: 600
      },
      food: {
        dietType: 'pure_vegetarian',
        foodWasteLevel: 'average',
        localSeasonalShare: 40,
        dairyConsumption: 'moderate',
        diningOutDeliveryFrequency: 'weekly'
      },
      shopping: {
        clothingFrequency: 'seasonally',
        electronicsRefreshYears: 3,
        secondHandSharePercent: 20,
        onlineDeliveryFrequency: 'weekly'
      },
      waste: {
        kabadiwalaRecycling: 'regular',
        compostsOrganicWaste: false,
        avoidsSingleUsePlastic: 'often'
      },
      lifestyle: {
        petOwnership: 'none',
        digitalFootprintTier: 'moderate',
        apparelEcoConscious: false
      }
    }
  },
  {
    id: 'metro_techie',
    name: 'Metro EV Commuter (Bengaluru/Delhi)',
    tagline: 'Tech worker using Electric Scooter + Metro rail, apartment living, eggetarian diet',
    icon: 'Building2',
    expectedTonnes: 1.8,
    data: {
      home: {
        homeType: 'apartment_flat',
        occupants: 2,
        homeSizeSqFt: 850,
        electricityKwhPerMonth: 190,
        cleanEnergyPercent: 40,
        cookingFuelType: 'piped_gas_png',
        acUsageHoursPerDay: 4,
        acStarRating: 'inverter_5star',
        waterHeatingType: 'instant_electric'
      },
      transport: {
        primaryMode: 'electric_scooter',
        weeklyCommuteKm: 100,
        vehicleMileageKmpl: 55,
        carpoolFrequency: 'never'
      },
      travel: {
        shortHaulFlightsPerYear: 1,
        mediumHaulFlightsPerYear: 0,
        longHaulFlightsPerYear: 0,
        flightCabinClass: 'economy',
        indianRailwaysTripsPerYear: 6,
        annualRoadTripKm: 300
      },
      food: {
        dietType: 'eggetarian',
        foodWasteLevel: 'low',
        localSeasonalShare: 50,
        dairyConsumption: 'low',
        diningOutDeliveryFrequency: 'rarely'
      },
      shopping: {
        clothingFrequency: 'seasonally',
        electronicsRefreshYears: 4,
        secondHandSharePercent: 40,
        onlineDeliveryFrequency: 'weekly'
      },
      waste: {
        kabadiwalaRecycling: 'regular',
        compostsOrganicWaste: true,
        avoidsSingleUsePlastic: 'always'
      },
      lifestyle: {
        petOwnership: 'none',
        digitalFootprintTier: 'moderate',
        apparelEcoConscious: true
      }
    }
  },
  {
    id: 'low_carbon_pioneer',
    name: 'Sustainable Lifestyle (Sub-2.0t)',
    tagline: 'Rooftop solar, cycling, public transit, zero food waste, and pure plant diet',
    icon: 'Leaf',
    expectedTonnes: 1.2,
    data: {
      home: {
        homeType: 'apartment_flat',
        occupants: 4,
        homeSizeSqFt: 900,
        electricityKwhPerMonth: 120,
        cleanEnergyPercent: 80,
        cookingFuelType: 'electric_induction',
        acUsageHoursPerDay: 0,
        acStarRating: 'inverter_5star',
        waterHeatingType: 'solar_water_heater'
      },
      transport: {
        primaryMode: 'train_metro',
        weeklyCommuteKm: 70,
        vehicleMileageKmpl: 60,
        carpoolFrequency: 'always'
      },
      travel: {
        shortHaulFlightsPerYear: 0,
        mediumHaulFlightsPerYear: 0,
        longHaulFlightsPerYear: 0,
        flightCabinClass: 'economy',
        indianRailwaysTripsPerYear: 8,
        annualRoadTripKm: 100
      },
      food: {
        dietType: 'vegan',
        foodWasteLevel: 'low',
        localSeasonalShare: 75,
        dairyConsumption: 'low',
        diningOutDeliveryFrequency: 'rarely'
      },
      shopping: {
        clothingFrequency: 'rarely',
        electronicsRefreshYears: 5,
        secondHandSharePercent: 60,
        onlineDeliveryFrequency: 'rarely'
      },
      waste: {
        kabadiwalaRecycling: 'regular',
        compostsOrganicWaste: true,
        avoidsSingleUsePlastic: 'always'
      },
      lifestyle: {
        petOwnership: 'none',
        digitalFootprintTier: 'low',
        apparelEcoConscious: true
      }
    }
  },
  {
    id: 'urban_high_emitter',
    name: 'High-Impact Urban Executive',
    tagline: 'Independent kothi, multiple ACs, petrol SUV, frequent domestic & overseas flights',
    icon: 'PlaneTakeoff',
    expectedTonnes: 9.8,
    data: {
      home: {
        homeType: 'independent_house',
        occupants: 3,
        homeSizeSqFt: 2600,
        electricityKwhPerMonth: 750,
        cleanEnergyPercent: 0,
        cookingFuelType: 'lpg_cylinder',
        acUsageHoursPerDay: 12,
        acStarRating: 'non_inverter_standard',
        waterHeatingType: 'electric_storage_geyser'
      },
      transport: {
        primaryMode: 'petrol_car',
        weeklyCommuteKm: 240,
        vehicleMileageKmpl: 12,
        carpoolFrequency: 'never'
      },
      travel: {
        shortHaulFlightsPerYear: 4,
        mediumHaulFlightsPerYear: 3,
        longHaulFlightsPerYear: 2,
        flightCabinClass: 'business',
        indianRailwaysTripsPerYear: 1,
        annualRoadTripKm: 1500
      },
      food: {
        dietType: 'non_veg_daily',
        foodWasteLevel: 'high',
        localSeasonalShare: 15,
        dairyConsumption: 'high',
        diningOutDeliveryFrequency: 'daily'
      },
      shopping: {
        clothingFrequency: 'frequently',
        electronicsRefreshYears: 1,
        secondHandSharePercent: 5,
        onlineDeliveryFrequency: 'daily'
      },
      waste: {
        kabadiwalaRecycling: 'none',
        compostsOrganicWaste: false,
        avoidsSingleUsePlastic: 'rarely'
      },
      lifestyle: {
        petOwnership: 'large_dog',
        digitalFootprintTier: 'heavy',
        apparelEcoConscious: false
      }
    }
  }
];

export const DEFAULT_CALCULATOR_STATE: CalculatorState = PRESET_PROFILES[0].data;
