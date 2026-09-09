import type { 
  CalculatorState, 
  CalculationResult, 
  CategoryKey, 
  CategoryResult,
  ActionRecommendation,
  WhatIfOverrides
} from '../types/calculator';
import { EMISSION_FACTORS, BENCHMARKS } from '../data/emissionFactors';
import { DEFAULT_CALCULATOR_STATE } from '../data/presets';

/**
 * Pure calculation engine for ECOLYSE — India Calibrated.
 * Calculates transparent, verifiable metric tonnes CO2e per year using CEA & IPCC coefficients.
 */

export function inrBillToKwh(billInr: number): number {
  return Math.round(billInr / (EMISSION_FACTORS.appliances?.averageDiscomTariffInrPerKwh || 7.25));
}

export function kwhToInrBill(kwh: number): number {
  return Math.round(kwh * (EMISSION_FACTORS.appliances?.averageDiscomTariffInrPerKwh || 7.25));
}

export function calculateFootprint(state: CalculatorState): CalculationResult {
  const safeState = state || DEFAULT_CALCULATOR_STATE;
  const occupants = Math.max(1, Number(safeState.home?.occupants) || 1);

  // ----------------------------------------------------
  // 1. HOME & ENERGY (Divided among household members)
  // ----------------------------------------------------
  // Monthly electricity Units (kWh) on Indian CEA grid
  const monthlyUnits = Math.max(0, Number(safeState.home?.electricityKwhPerMonth) || 
    (safeState.home?.monthlyBillInr ? inrBillToKwh(safeState.home.monthlyBillInr) : 250));
  const annualElectricityUnits = monthlyUnits * 12;
  const cleanRatio = Math.min(1, Math.max(0, (Number(safeState.home?.cleanEnergyPercent) || 0) / 100));
  const dirtyRatio = 1 - cleanRatio;
  
  const ceaGridIntensity = EMISSION_FACTORS.electricity.standardGridAverage.value; // ~0.716 kg/kWh
  const cleanIntensity = EMISSION_FACTORS.electricity.cleanRenewable.value; // ~0.025 kg/kWh

  // Base electricity emissions
  const electricityEmissionsTotal = 
    ((annualElectricityUnits * dirtyRatio * ceaGridIntensity) + 
     (annualElectricityUnits * cleanRatio * cleanIntensity)) / 1000; // to tonnes

  // Cooking Fuel (LPG cylinder, PNG, Induction, Chulha)
  const cookingFuel = safeState.home?.cookingFuelType || 'lpg_cylinder';
  const cookingBase = EMISSION_FACTORS.cookingAndHeating[cookingFuel]?.value || 0.28;

  // Air Conditioning efficiency & summer thermal cooling load
  const acDailyHours = Math.max(0, Number(safeState.home?.acUsageHoursPerDay) || 0);
  const acMultiplier = EMISSION_FACTORS.appliances.acStarRatingMultiplier[safeState.home?.acStarRating || 'inverter_3star'] || 1.0;
  // Estimated summer cooling load (120 days): Inverter 3-Star baseline is ~1.15 kW
  const acSeasonalKwh = acDailyHours * 1.15 * acMultiplier * 120;
  const acEmissionsAttributed = (acSeasonalKwh * dirtyRatio * ceaGridIntensity) / 1000;

  // Water Heating footprint (storage geyser, instant, solar, gas)
  const waterHeatingTonnes = EMISSION_FACTORS.appliances.waterHeating[safeState.home?.waterHeatingType || 'electric_storage_geyser'] || 0.12;

  // Housing envelope thermal gain multiplier
  const envelopeMultiplier = safeState.home?.homeType === 'apartment_flat' ? 0.85 :
                             safeState.home?.homeType === 'builder_floor' ? 0.95 :
                             safeState.home?.homeType === 'row_house_villa' ? 1.05 : 1.15;

  const totalHouseholdEmissions = (electricityEmissionsTotal + cookingBase + waterHeatingTonnes) * envelopeMultiplier;
  const homeTonnes = Math.max(0.15, Number((totalHouseholdEmissions / occupants).toFixed(2)));

  // ----------------------------------------------------
  // 2. TRANSPORTATION (Daily/Weekly Commute)
  // ----------------------------------------------------
  const annualCommuteKm = (Number(safeState.transport?.weeklyCommuteKm) || 0) * 50;
  const modeKey = safeState.transport?.primaryMode || 'motorcycle_petrol';
  let transportFactor = EMISSION_FACTORS.transport[modeKey]?.value ?? 0.045;

  // Mileage scaling for fuel vehicles
  const vehicleMileage = Math.max(5, Number(safeState.transport?.vehicleMileageKmpl) || 45);
  if (modeKey === 'motorcycle_petrol') {
    const mileageRatio = 50 / Math.max(20, vehicleMileage);
    transportFactor *= mileageRatio;
  } else if (modeKey === 'petrol_car' || modeKey === 'diesel_car') {
    const mileageRatio = 16 / Math.max(8, vehicleMileage);
    transportFactor *= mileageRatio;
  } else if (modeKey === 'cng_car') {
    const mileageRatio = 24 / Math.max(12, vehicleMileage);
    transportFactor *= mileageRatio;
  } else if (modeKey === 'hybrid_car') {
    const mileageRatio = 25 / Math.max(15, vehicleMileage);
    transportFactor *= mileageRatio;
  }

  // Carpooling / Pillion sharing discount
  const carpoolDiscount = safeState.transport?.carpoolFrequency === 'always' ? 0.5 :
                          safeState.transport?.carpoolFrequency === 'sometimes' ? 0.75 : 1.0;

  const transportTonnes = Math.max(0, Number(((annualCommuteKm * transportFactor * carpoolDiscount) / 1000).toFixed(2)));

  // ----------------------------------------------------
  // 3. TRAVEL (Flights & Indian Railways)
  // ----------------------------------------------------
  const cabinMultiplier = EMISSION_FACTORS.aviation.cabinClassMultiplier[safeState.travel?.flightCabinClass || 'economy'] || 1.0;

  const shortHaulKm = (Number(safeState.travel?.shortHaulFlightsPerYear) || 0) * EMISSION_FACTORS.aviation.shortHaul.averageDistanceKm;
  const mediumHaulKm = (Number(safeState.travel?.mediumHaulFlightsPerYear) || 0) * EMISSION_FACTORS.aviation.mediumHaul.averageDistanceKm;
  const longHaulKm = (Number(safeState.travel?.longHaulFlightsPerYear) || 0) * EMISSION_FACTORS.aviation.longHaul.averageDistanceKm;

  const shortHaulTonnes = (shortHaulKm * EMISSION_FACTORS.aviation.shortHaul.emissionFactorKgPerKm * cabinMultiplier) / 1000;
  const mediumHaulTonnes = (mediumHaulKm * EMISSION_FACTORS.aviation.mediumHaul.emissionFactorKgPerKm * cabinMultiplier) / 1000;
  const longHaulTonnes = (longHaulKm * EMISSION_FACTORS.aviation.longHaul.emissionFactorKgPerKm * cabinMultiplier) / 1000;

  // Indian Railways (average 650 km per intercity journey)
  const railTonnes = ((Number(safeState.travel?.indianRailwaysTripsPerYear) || 0) * 650 * EMISSION_FACTORS.transport.train_metro.value) / 1000;
  // Outstation road trips
  const roadTripTonnes = ((Number(safeState.travel?.annualRoadTripKm) || 0) * EMISSION_FACTORS.transport.petrol_car.value) / 1000;

  const travelTonnes = Math.max(0, Number((shortHaulTonnes + mediumHaulTonnes + longHaulTonnes + railTonnes + roadTripTonnes).toFixed(2)));

  // ----------------------------------------------------
  // 4. FOOD & DIET
  // ----------------------------------------------------
  const baseDiet = EMISSION_FACTORS.diet[safeState.food?.dietType || 'pure_vegetarian']?.value || 1.15;
  const wasteMultiplier = safeState.food?.foodWasteLevel === 'high' ? 1.20 :
                          safeState.food?.foodWasteLevel === 'low' ? 0.90 : 1.0;
  // Mandi / Local seasonal sabzi sourcing discount (up to 12% reduction)
  const localSeasonalDiscount = 1 - (((Number(safeState.food?.localSeasonalShare) || 50) / 100) * 0.12);
  const dairyAddon = safeState.food?.dairyConsumption === 'high' ? 0.18 :
                     safeState.food?.dairyConsumption === 'low' ? -0.10 : 0.0;
  // Dining out / Delivery packaging and commercial kitchen factor
  const diningAddon = safeState.food?.diningOutDeliveryFrequency === 'daily' ? 0.16 :
                      safeState.food?.diningOutDeliveryFrequency === 'weekly' ? 0.07 : 0.02;

  const foodTonnes = Math.max(0.35, Number(((baseDiet * wasteMultiplier * localSeasonalDiscount) + dairyAddon + diningAddon).toFixed(2)));

  // ----------------------------------------------------
  // 5. SHOPPING & CONSUMPTION
  // ----------------------------------------------------
  const apparelEmissions = EMISSION_FACTORS.consumption.apparel[safeState.shopping?.clothingFrequency || 'seasonally'] || 0.15;
  const refreshYears = Math.max(1, Number(safeState.shopping?.electronicsRefreshYears) || 3);
  const electronicsEmissions = EMISSION_FACTORS.consumption.electronics.annualTonnesPerDeviceRefresh / refreshYears;
  
  // Second-hand / Refurbished discount
  const secondHandDiscount = 1 - (((Number(safeState.shopping?.secondHandSharePercent) || 0) / 100) * 0.40);
  
  const deliveryEmissions = safeState.shopping?.onlineDeliveryFrequency === 'daily' ? 0.18 :
                            safeState.shopping?.onlineDeliveryFrequency === 'weekly' ? 0.06 : 0.02;

  const shoppingTonnes = Math.max(0.08, Number((((apparelEmissions + electronicsEmissions) * secondHandDiscount) + deliveryEmissions).toFixed(2)));

  // ----------------------------------------------------
  // 6. WASTE & RECYCLING
  // ----------------------------------------------------
  let wasteBaseline = EMISSION_FACTORS.consumption.waste.baselineLandfillTonnes;
  // Doorstep scrap collection (Kabadiwala)
  if (safeState.waste?.kabadiwalaRecycling === 'regular') {
    wasteBaseline -= EMISSION_FACTORS.consumption.waste.kabadiwalaReductionCredit;
  } else if (safeState.waste?.kabadiwalaRecycling === 'occasional') {
    wasteBaseline -= (EMISSION_FACTORS.consumption.waste.kabadiwalaReductionCredit * 0.5);
  }

  if (safeState.waste?.compostsOrganicWaste) {
    wasteBaseline -= EMISSION_FACTORS.consumption.waste.compostingReductionCredit;
  }

  if (safeState.waste?.avoidsSingleUsePlastic === 'always') {
    wasteBaseline -= 0.04;
  }

  const wasteTonnes = Math.max(0.04, Number(wasteBaseline.toFixed(2)));

  // ----------------------------------------------------
  // 7. LIFESTYLE & OTHER
  // ----------------------------------------------------
  const petTonnes = EMISSION_FACTORS.consumption.pet[safeState.lifestyle?.petOwnership || 'none'] || 0;
  const digitalTonnes = EMISSION_FACTORS.consumption.digital[safeState.lifestyle?.digitalFootprintTier || 'moderate'] || 0.10;
  const ecoHabitsCredit = safeState.lifestyle?.apparelEcoConscious ? -0.05 : 0;

  const lifestyleTonnes = Math.max(0.04, Number((petTonnes + digitalTonnes + ecoHabitsCredit).toFixed(2)));

  // ----------------------------------------------------
  // AGGREGATION & CATEGORIES
  // ----------------------------------------------------
  const rawTotal = (Number(homeTonnes) || 0) + 
                   (Number(transportTonnes) || 0) + 
                   (Number(travelTonnes) || 0) + 
                   (Number(foodTonnes) || 0) + 
                   (Number(shoppingTonnes) || 0) + 
                   (Number(wasteTonnes) || 0) + 
                   (Number(lifestyleTonnes) || 0);
  const totalTonnes = Math.max(0.1, Number(rawTotal.toFixed(2)));

  const categories: Record<CategoryKey, CategoryResult> = {
    home: {
      category: 'home',
      label: 'Home & Electricity',
      icon: 'Home',
      tonnes: homeTonnes,
      percentage: Math.round((homeTonnes / totalTonnes) * 100) || 0,
      score: calculateCategoryScore(homeTonnes, 0.9),
      color: '#10b981', // Emerald
      contributors: [
        { name: 'Grid Electricity', tonnes: Number((electricityEmissionsTotal / occupants).toFixed(2)), description: `${monthlyUnits} Units/mo on CEA Indian Grid (${state.home.cleanEnergyPercent ?? 0}% solar)` },
        { name: 'Cooking & Water Heating', tonnes: Number(((cookingBase + waterHeatingTonnes) / occupants).toFixed(2)), description: `${(state.home.cookingFuelType || 'lpg_cylinder').replace(/_/g, ' ').toUpperCase()} + ${(state.home.waterHeatingType || 'electric_storage_geyser').replace(/_/g, ' ')}` },
        { name: 'Air Conditioning Load', tonnes: Number((acEmissionsAttributed / occupants).toFixed(2)), description: `${state.home.acUsageHoursPerDay ?? 0} hrs/day summer (${(state.home.acStarRating || 'inverter_3star').replace(/_/g, ' ')})` }
      ]
    },
    transport: {
      category: 'transport',
      label: 'Daily Commute',
      icon: 'Car',
      tonnes: transportTonnes,
      percentage: Math.round((transportTonnes / totalTonnes) * 100) || 0,
      score: calculateCategoryScore(transportTonnes, 0.6),
      color: '#34d399', // Mint
      contributors: [
        { name: 'Weekly Commuting', tonnes: transportTonnes, description: `${state.transport.weeklyCommuteKm ?? 0} km/week via ${(state.transport.primaryMode || 'transit').replace(/_/g, ' ')} (${state.transport.vehicleMileageKmpl ?? 50} km/l)` },
        { name: 'Sharing / Carpool', tonnes: 0, description: `Sharing factor: ${state.transport.carpoolFrequency || 'never'}` }
      ]
    },
    travel: {
      category: 'travel',
      label: 'Intercity Travel & Flights',
      icon: 'Plane',
      tonnes: travelTonnes,
      percentage: Math.round((travelTonnes / totalTonnes) * 100) || 0,
      score: calculateCategoryScore(travelTonnes, 0.5),
      color: '#06b6d4', // Cyan
      contributors: [
        { name: 'Domestic Flights', tonnes: Number((shortHaulTonnes + mediumHaulTonnes).toFixed(2)), description: `${(state.travel.shortHaulFlightsPerYear ?? 0) + (state.travel.mediumHaulFlightsPerYear ?? 0)} domestic round-trips (${state.travel.flightCabinClass || 'economy'} class)` },
        { name: 'International Trips', tonnes: Number(longHaulTonnes.toFixed(2)), description: `${state.travel.longHaulFlightsPerYear ?? 0} international trip(s) (${state.travel.flightCabinClass || 'economy'} class)` },
        { name: 'Indian Railways & Road', tonnes: Number((railTonnes + roadTripTonnes).toFixed(2)), description: `${state.travel.indianRailwaysTripsPerYear ?? 0} train journeys & ${state.travel.annualRoadTripKm ?? 0} km road trips` }
      ]
    },
    food: {
      category: 'food',
      label: 'Food & Diet',
      icon: 'Utensils',
      tonnes: foodTonnes,
      percentage: Math.round((foodTonnes / totalTonnes) * 100) || 0,
      score: calculateCategoryScore(foodTonnes, 1.1),
      color: '#f59e0b', // Amber
      contributors: [
        { name: 'Dietary Base', tonnes: baseDiet, description: `${(state.food.dietType || 'pure_vegetarian').replace(/_/g, ' ')} pattern` },
        { name: 'Local Mandi Sourcing', tonnes: Number((-(baseDiet * (1 - localSeasonalDiscount))).toFixed(2)), description: `${state.food.localSeasonalShare ?? 50}% local produce` },
        { name: 'Dairy & Dining Out', tonnes: Number((dairyAddon + diningAddon).toFixed(2)), description: `Dairy: ${state.food.dairyConsumption || 'moderate'}, Delivery: ${state.food.diningOutDeliveryFrequency || 'rarely'}` }
      ]
    },
    shopping: {
      category: 'shopping',
      label: 'Shopping & Goods',
      icon: 'ShoppingBag',
      tonnes: shoppingTonnes,
      percentage: Math.round((shoppingTonnes / totalTonnes) * 100) || 0,
      score: calculateCategoryScore(shoppingTonnes, 0.4),
      color: '#8b5cf6', // Purple
      contributors: [
        { name: 'Apparel Purchases', tonnes: apparelEmissions, description: `Buying habit: ${state.shopping.clothingFrequency || 'seasonally'}` },
        { name: 'Electronics Refresh', tonnes: Number(electronicsEmissions.toFixed(2)), description: `Devices updated every ${state.shopping.electronicsRefreshYears ?? 3} year(s)` },
        { name: 'Delivery Logistics', tonnes: Number(deliveryEmissions.toFixed(2)), description: `Quick-commerce/deliveries: ${state.shopping.onlineDeliveryFrequency || 'weekly'}` }
      ]
    },
    waste: {
      category: 'waste',
      label: 'Waste & Circularity',
      icon: 'Recycle',
      tonnes: wasteTonnes,
      percentage: Math.round((wasteTonnes / totalTonnes) * 100) || 0,
      score: calculateCategoryScore(wasteTonnes, 0.15),
      color: '#14b8a6', // Teal
      contributors: [
        { name: 'Doorstep Kabadiwala & Recycling', tonnes: wasteTonnes, description: `Scrap dealer: ${state.waste.kabadiwalaRecycling || 'regular'}, Composting: ${state.waste.compostsOrganicWaste ? 'Active' : 'None'}` }
      ]
    },
    lifestyle: {
      category: 'lifestyle',
      label: 'Digital & Lifestyle',
      icon: 'Leaf',
      tonnes: lifestyleTonnes,
      percentage: Math.round((lifestyleTonnes / totalTonnes) * 100) || 0,
      score: calculateCategoryScore(lifestyleTonnes, 0.2),
      color: '#65a30d', // Lime
      contributors: [
        { name: 'Mobile Data & Cloud', tonnes: digitalTonnes, description: `Streaming tier: ${state.lifestyle.digitalFootprintTier || 'moderate'}` },
        { name: 'Pet Care', tonnes: petTonnes, description: `Companion: ${(state.lifestyle.petOwnership || 'none').replace(/_/g, ' ')}` }
      ]
    }
  };

  const categoryList = Object.values(categories).sort((a, b) => b.tonnes - a.tonnes);

  // ----------------------------------------------------
  // BENCHMARKS & OVERALL IMPACT SCORE
  // ----------------------------------------------------
  const vsIndia = Math.round(((totalTonnes - BENCHMARKS.indiaAverage) / BENCHMARKS.indiaAverage) * 100);
  const vsGlobal = Math.round(((totalTonnes - BENCHMARKS.globalAverage) / BENCHMARKS.globalAverage) * 100);
  const benchmarkComparison = {
    indiaAverage: BENCHMARKS.indiaAverage,     // 1.9 tonnes
    parisTarget2030: BENCHMARKS.parisTarget2030, // 2.1 tonnes
    globalAverage: BENCHMARKS.globalAverage,   // 4.8 tonnes
    usAverage: BENCHMARKS.usAverage,           // 14.9 tonnes
    vsIndiaPercentage: isNaN(vsIndia) ? 0 : vsIndia,
    vsGlobalPercentage: isNaN(vsGlobal) ? 0 : vsGlobal
  };

  // 0 - 100 Impact Score in Indian Context
  let impactScore = 100;
  if (totalTonnes <= 1.9) {
    impactScore = Math.min(100, Math.round(90 + (1.9 - totalTonnes) * 8)); // 90-100 (Below Indian Avg)
  } else if (totalTonnes <= 3.5) {
    impactScore = Math.round(90 - ((totalTonnes - 1.9) / (3.5 - 1.9)) * 30); // 60-90
  } else if (totalTonnes <= 7.0) {
    impactScore = Math.round(60 - ((totalTonnes - 3.5) / (7.0 - 3.5)) * 30); // 30-60
  } else {
    impactScore = Math.max(8, Math.round(30 - ((totalTonnes - 7.0) / 10) * 20));
  }
  if (isNaN(impactScore)) impactScore = 75;

  // Identify biggest impact
  const biggest = categoryList[0] || {
    category: 'home' as CategoryKey,
    label: 'Home & Electricity',
    icon: 'Home',
    tonnes: totalTonnes,
    percentage: 100,
  };
  const biggestImpact = {
    category: biggest.category,
    label: biggest.label,
    icon: biggest.icon,
    tonnes: biggest.tonnes,
    percentage: biggest.percentage,
    insight: getBiggestImpactInsight(biggest.category, biggest.tonnes)
  };

  // Generate tailored India recommendations
  const recommendations = generateIndiaRecommendations(state, categories);

  return {
    totalTonnes,
    categories,
    categoryList,
    benchmarkComparison,
    impactScore,
    biggestImpact,
    recommendations
  };
}

function calculateCategoryScore(tonnes: number, target: number): number {
  const safeTonnes = Number(tonnes) || 0;
  const safeTarget = target || 1;
  if (safeTonnes <= safeTarget) {
    return Math.min(100, Math.round(85 + (safeTarget - safeTonnes) * 12));
  }
  const diffRatio = (safeTonnes - safeTarget) / safeTarget;
  return Math.max(15, Math.round(85 - diffRatio * 40));
}

function getBiggestImpactInsight(category: CategoryKey, tonnes: number): string {
  switch (category) {
    case 'home':
      return `Grid electricity and air conditioning account for ${tonnes} t CO₂e. Because ~70% of India's grid is coal-powered (~716g CO₂e/kWh), rooftop solar (PM Surya Ghar) or 5-star inverter appliances provide exceptional abatement leverage.`;
    case 'travel':
      return `Flights generate ${tonnes} t CO₂e. Just one domestic trunk flight (e.g. Delhi-Bengaluru return) generates ~0.35 t CO₂e. Opting for electrified Indian Railways / Vande Bharat for journeys under 800 km slashes emissions by over 80%.`;
    case 'transport':
      return `Daily commuting produces ${tonnes} t CO₂e. Transitioning from a petrol car to an EV scooter, Metro rail, or carpooling offers rapid emissions and fuel expenditure cuts.`;
    case 'food':
      return `Dietary patterns generate ${tonnes} t CO₂e. Minimizing food waste and prioritizing traditional seasonal dal-sabzi-roti patterns maintain low emissions.`;
    case 'shopping':
      return `Apparel and frequent quick-commerce deliveries contribute ${tonnes} t CO₂e from industrial manufacturing and hyper-local transit.`;
    case 'waste':
      return `Municipal waste contributes ${tonnes} t CO₂e. Maximizing dry waste segregation for the local Kabadiwala and composting wet kitchen waste avoids anaerobic landfill methane.`;
    default:
      return `This sector represents your highest personal decarbonization potential.`;
  }
}

function generateIndiaRecommendations(state: CalculatorState, categories: Record<CategoryKey, CategoryResult>): ActionRecommendation[] {
  const list: ActionRecommendation[] = [];

  // Home: PM Surya Ghar Rooftop Solar
  const homeClean = Number(state.home?.cleanEnergyPercent) || 0;
  const homeTonnes = Number(categories?.home?.contributors?.[0]?.tonnes) || Number(categories?.home?.tonnes) || 0;
  if (homeClean < 80) {
    const solarSavings = Number((homeTonnes * (1 - homeClean / 100) * 0.85).toFixed(2)) || 0;
    if (solarSavings > 0.2) {
      list.push({
        id: 'rec_rooftop_solar',
        category: 'home',
        title: 'Install Rooftop Solar via PM Surya Ghar Muft Bijli Yojana',
        potentialReductionTonnes: solarSavings,
        difficulty: 'Moderate',
        cost: '₹₹',
        timeframe: '1-3 months',
        explanation: 'A 2-3 kW grid-tied solar system produces ~250-350 Units of clean power monthly, eliminating coal-grid emissions and generating zero electricity bills with central subsidies.',
        badge: 'CLEAN TECH'
      });
    }
  }

  // Transport: EV Two-Wheeler / Electric Scooter
  const transportTonnes = Number(categories?.transport?.tonnes) || 0;
  if (state.transport?.primaryMode === 'motorcycle_petrol') {
    list.push({
      id: 'rec_ev_scooter',
      category: 'transport',
      title: 'Switch Commute to an Electric Scooter (Ather / Ola / TVS iQube)',
      potentialReductionTonnes: Number((transportTonnes * 0.68).toFixed(2)) || 0.4,
      difficulty: 'Easy',
      cost: '₹₹',
      timeframe: '1-2 weeks',
      explanation: 'An electric 2-wheeler consumes only ~30 Wh/km (running cost ~₹0.25/km vs ~₹2.20/km for petrol), cutting commute emissions by ~70% and saving over ₹20,000 in annual fuel.',
      badge: 'COST SAVER'
    });
  }

  // Transport: Metro & Public Transit
  if (state.transport?.primaryMode === 'petrol_car' || state.transport?.primaryMode === 'diesel_car') {
    list.push({
      id: 'rec_metro_transit',
      category: 'transport',
      title: 'Shift 3 Days of Car Commute to Metro Rail or City Bus',
      potentialReductionTonnes: Number((transportTonnes * 0.55).toFixed(2)) || 0.6,
      difficulty: 'Easy',
      cost: '₹',
      timeframe: 'Immediate',
      explanation: 'Electrified rapid transit (Delhi Metro, Mumbai Metro, Namma Metro) emits under 20g CO₂e per passenger-km compared to 150g+ for single-occupancy cars in urban traffic jams.',
      badge: 'HIGH IMPACT'
    });
  }

  // Travel: Choose Vande Bharat / Indian Railways
  if (Number(state.travel?.shortHaulFlightsPerYear) > 0) {
    const flightSavings = Number((EMISSION_FACTORS.aviation.shortHaul.averageDistanceKm * EMISSION_FACTORS.aviation.shortHaul.emissionFactorKgPerKm / 1000).toFixed(2));
    list.push({
      id: 'rec_vande_bharat',
      category: 'travel',
      title: 'Opt for Vande Bharat / Train on Trips under 700 km',
      potentialReductionTonnes: flightSavings,
      difficulty: 'Easy',
      cost: 'Free',
      timeframe: 'Immediate',
      explanation: 'With Indian Railways over 90% electrified, train travel on routes like Delhi-Varanasi or Mumbai-Ahmedabad generates 85% lower emissions than regional flights.',
      badge: 'HIGH IMPACT'
    });
  }

  // Home: 5-Star Inverter AC & BLDC Fans
  if (state.home.acUsageHoursPerDay > 4) {
    list.push({
      id: 'rec_bldc_ac',
      category: 'home',
      title: 'Set AC to 24°C & Upgrade to BEE 5-Star Inverter / BLDC Fans',
      potentialReductionTonnes: 0.35,
      difficulty: 'Easy',
      cost: 'Free',
      timeframe: 'Immediate',
      explanation: 'Bureau of Energy Efficiency (BEE) data shows raising AC thermostat from 18°C to 24°C saves 24-30% power. BLDC ceiling fans save 60% electricity (28W vs 75W).',
      badge: 'QUICK WIN'
    });
  }

  // Waste: Regular Doorstep Scrap (Kabadiwala)
  if (state.waste.kabadiwalaRecycling !== 'regular') {
    list.push({
      id: 'rec_kabadiwala',
      category: 'waste',
      title: 'Hand Over All Paper, Plastics & Metal to Local Kabadiwala',
      potentialReductionTonnes: 0.12,
      difficulty: 'Easy',
      cost: 'Free',
      timeframe: 'Immediate',
      explanation: "India's informal scrap network achieves 80%+ circular recycling rates for sorted dry waste. Diverting recyclables prevents plastic incineration and landfill methane.",
      badge: 'QUICK WIN'
    });
  }

  // Food: Plant-forward / Reduce Food Waste
  if (state.food.dietType === 'non_veg_daily' || state.food.dietType === 'non_veg_regular') {
    list.push({
      id: 'rec_plant_meals',
      category: 'food',
      title: 'Celebrate 2 Pure Vegetarian Days / Week (Traditional Dal & Sabzi)',
      potentialReductionTonnes: 0.38,
      difficulty: 'Easy',
      cost: '₹',
      timeframe: 'Immediate',
      explanation: 'India’s rich culinary repertoire of lentils, chickpeas, seasonal gourds, and millets offers complete protein nutrition with a fraction of livestock greenhouse gas intensity.',
      badge: 'COST SAVER'
    });
  }

  return list.sort((a, b) => b.potentialReductionTonnes - a.potentialReductionTonnes).slice(0, 5);
}

export function calculateSimulatedFootprint(baseState: CalculatorState, overrides: WhatIfOverrides): {
  simulatedTotal: number;
  reductionTonnes: number;
  reductionPercentage: number;
} {
  const modifiedState: CalculatorState = JSON.parse(JSON.stringify(baseState));

  // 1. Commute reduction / Metro switch
  if (overrides.reduceCarTravelPercent > 0) {
    modifiedState.transport.weeklyCommuteKm = Math.max(0, modifiedState.transport.weeklyCommuteKm * (1 - overrides.reduceCarTravelPercent / 100));
  }

  // 2. Rooftop Solar / Clean power
  if (overrides.cleanElectricityPercent > 0) {
    modifiedState.home.cleanEnergyPercent = Math.max(modifiedState.home.cleanEnergyPercent, overrides.cleanElectricityPercent);
  }

  // 3. Plant-forward diet shift
  if (overrides.dietShiftPlantShare > 50) {
    modifiedState.food.dietType = 'pure_vegetarian';
  } else if (overrides.dietShiftPlantShare > 25) {
    modifiedState.food.dietType = 'eggetarian';
  }

  // 4. Reduce flights / Train switch
  if (overrides.reduceFlightsCount > 0) {
    let toReduce = overrides.reduceFlightsCount;
    const sh = Math.min(modifiedState.travel.shortHaulFlightsPerYear, toReduce);
    modifiedState.travel.shortHaulFlightsPerYear -= sh;
    toReduce -= sh;
    if (toReduce > 0) {
      const mh = Math.min(modifiedState.travel.mediumHaulFlightsPerYear, toReduce);
      modifiedState.travel.mediumHaulFlightsPerYear -= mh;
    }
  }

  // 5. Eliminate food waste & compost
  if (overrides.eliminateFoodWaste) {
    modifiedState.food.foodWasteLevel = 'low';
    modifiedState.waste.compostsOrganicWaste = true;
    modifiedState.waste.kabadiwalaRecycling = 'regular';
  }

  // 6. Refurbished electronics
  if (overrides.buySecondHandPercent > 0) {
    modifiedState.shopping.secondHandSharePercent = Math.max(modifiedState.shopping.secondHandSharePercent, overrides.buySecondHandPercent);
  }

  const baseResult = calculateFootprint(baseState);
  const simulatedResult = calculateFootprint(modifiedState);

  const reductionTonnes = Number(Math.max(0, baseResult.totalTonnes - simulatedResult.totalTonnes).toFixed(2));
  const reductionPercentage = Math.round((reductionTonnes / baseResult.totalTonnes) * 100) || 0;

  return {
    simulatedTotal: simulatedResult.totalTonnes,
    reductionTonnes,
    reductionPercentage
  };
}

export interface ScientificFormulaDetails {
  equation: string;
  standard: string;
  lever: string;
  realWorldContext: string;
}

export function getCategoryScientificFormula(category: CategoryKey, state: CalculatorState): ScientificFormulaDetails {
  const occupants = Math.max(1, state.home.occupants || 1);
  const monthlyUnits = state.home.electricityKwhPerMonth || 
    (state.home.monthlyBillInr ? inrBillToKwh(state.home.monthlyBillInr) : 250);

  switch (category) {
    case 'home':
      return {
        equation: `[ (${monthlyUnits} kWh/mo × 12 × (1 - ${state.home.cleanEnergyPercent || 0}%) × 0.716 kg/kWh) + Cooking (${state.home.cookingFuelType || 'LPG'}) + Water Heating ] ÷ ${occupants} occupants`,
        standard: 'Central Electricity Authority (CEA) Baseline Database v19 (2023) & BEE India',
        lever: 'Adding 2 kW rooftop solar under PM Surya Ghar eliminates ~2.1 t CO₂e and ~₹18,000/yr in power bills.',
        realWorldContext: `At current DISCOM tariffs (~₹7.25/unit), ${monthlyUnits} Units equals approximately ₹${Math.round(monthlyUnits * 7.25)}/month.`
      };
    case 'transport':
      return {
        equation: `(${state.transport.weeklyCommuteKm || 0} km/wk × 50 wks × ${EMISSION_FACTORS.transport[state.transport.primaryMode]?.value || 0.045} kg/km × Carpool factor) ÷ 1,000`,
        standard: 'Automotive Research Association of India (ARAI) & TERI Urban Mobility LCA',
        lever: 'Switching 3 days of solo car commute to Metro rail (18g/km) or EV 2-wheeler (14g/km) cuts transport emissions by over 60%.',
        realWorldContext: `Your ${state.transport.weeklyCommuteKm || 0} km/week equals ~${(state.transport.weeklyCommuteKm || 0) * 50} km annually in city traffic.`
      };
    case 'travel': {
      const cabinMultiplier = EMISSION_FACTORS.aviation.cabinClassMultiplier[state.travel.flightCabinClass || 'economy'] || 1.0;
      return {
        equation: `[ Flights (${state.travel.shortHaulFlightsPerYear || 0} short + ${state.travel.mediumHaulFlightsPerYear || 0} trunk + ${state.travel.longHaulFlightsPerYear || 0} intl) × ICAO Factor × ${cabinMultiplier}x Cabin ] + [ Rail (${state.travel.indianRailwaysTripsPerYear || 0} trips × 18g/km) ]`,
        standard: 'ICAO Carbon Emissions Model & Lee et al. (Radiative Forcing Index 1.9x)',
        lever: 'Replacing 1 domestic trunk flight with Vande Bharat / Rajdhani train avoids ~350 kg CO₂e.',
        realWorldContext: `${state.travel.flightCabinClass === 'business' ? 'Business class assigns 2.8x higher emissions due to floor footprint.' : 'Economy seating provides optimal passenger density per passenger-km.'}`
      };
    }
    case 'food':
      return {
        equation: `[ Base Diet (${state.food.dietType || 'veg'}: ~${EMISSION_FACTORS.diet[state.food.dietType]?.value || 1.15} t) × Waste multiplier (${state.food.foodWasteLevel || 'avg'}) × Mandi discount ] + Dairy & Delivery Add-on`,
        standard: 'EAT-Lancet Commission / ICMR-NIN Indian Dietary Guidelines & Poore & Nemecek',
        lever: 'Traditional seasonal mandi sabzi-dal-roti diets have 60% lower carbon footprints than western livestock diets.',
        realWorldContext: `${state.food.localSeasonalShare || 50}% sabzi mandi sourcing reduces cold storage freight footprint.`
      };
    case 'shopping':
      return {
        equation: `[ Apparel (${state.shopping.clothingFrequency || 'seasonally'}) + Electronics (${state.shopping.electronicsRefreshYears || 3} yr refresh) ] × (1 - ${state.shopping.secondHandSharePercent || 0}% refurbished) + Quick Commerce Deliveries`,
        standard: 'CPCB E-Waste Rules & Textile Ministry Circular Economy Inventories',
        lever: 'Keeping smartphones for 3+ years avoids 75% of their lifetime manufacturing carbon.',
        realWorldContext: `${state.shopping.onlineDeliveryFrequency || 'weekly'} delivery frequencies incur repeated last-mile logistics packaging.`
      };
    case 'waste':
      return {
        equation: `Landfill Baseline (0.28 t) - Kabadiwala Scrap Credit (${state.waste.kabadiwalaRecycling === 'regular' ? '0.14' : '0.07'} t) - Home Composting Credit (${state.waste.compostsOrganicWaste ? '0.08' : '0.00'} t)`,
        standard: 'NEERI / CPCB Solid Waste Management Guidelines',
        lever: 'Doorstep Kabadiwala collectors achieve 80%+ circular recycling rates, preventing open dumpsite methane.',
        realWorldContext: `${state.waste.compostsOrganicWaste ? 'Active wet waste composting prevents anaerobic methane decay.' : 'Mixed waste sent to landfills releases methane gas as organics rot.'}`
      };
    case 'lifestyle':
      return {
        equation: `Digital 4G/5G Cellular & Streaming (${state.lifestyle.digitalFootprintTier || 'moderate'}) + Companion Pet (${state.lifestyle.petOwnership || 'none'}) + Eco Habits`,
        standard: 'TRAI Indian Telecom Performance Indicators & IEA Data Center Review',
        lever: 'Using home Wi-Fi instead of cellular 4G/5G for HD video streaming cuts network energy consumption by ~3x.',
        realWorldContext: 'Cellular radio transmission towers draw continuous grid and diesel power during peak usage.'
      };
    default:
      return {
        equation: 'IPCC AR6 & CEA National Baseline',
        standard: 'Scientific Peer-Reviewed LCA',
        lever: 'Every verified metric tonne reduced prevents ~3,000 km of car exhaust.',
        realWorldContext: 'Comprehensive Scope 1, 2, and 3 accounting.'
      };
  }
}

