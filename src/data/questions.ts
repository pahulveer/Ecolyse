import type { CategoryKey } from '../types/calculator';

export interface QuestionOption {
  value: string | number | boolean;
  label: string;
  description?: string;
  icon?: string;
  badge?: string;
}

export interface QuestionDefinition {
  id: string;
  category: CategoryKey;
  field: string;
  title: string;
  subtitle: string;
  scienceTooltip: {
    heading: string;
    explanation: string;
    source: string;
  };
  type: 'cards' | 'slider' | 'number' | 'toggle' | 'select';
  options?: QuestionOption[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  defaultValue?: any;
}

export interface StepDefinition {
  category: CategoryKey;
  stepNumber: number;
  title: string;
  shortLabel: string;
  tagline: string;
  icon: string;
  questions: QuestionDefinition[];
}

export const CALCULATOR_STEPS: StepDefinition[] = [
  {
    category: 'home',
    stepNumber: 1,
    title: 'Home & Electricity',
    shortLabel: 'Electricity',
    tagline: 'Measure monthly electricity Units (kWh), cooling appliances, and cooking fuel on the Indian grid.',
    icon: 'Home',
    questions: [
      {
        id: 'home_type',
        category: 'home',
        field: 'homeType',
        title: 'What type of residence do you live in?',
        subtitle: 'Housing architecture influences thermal heat gain and electricity requirements.',
        type: 'cards',
        scienceTooltip: {
          heading: 'Building Envelope in Indian Climates',
          explanation: 'Apartments in multi-story societies share lateral party walls and ceiling slabs, cutting air-conditioning heat loads by 20-25% compared to standalone houses with exposed roofs.',
          source: 'Bureau of Energy Efficiency (BEE) Eco-Niwas Samhita'
        },
        options: [
          { value: 'apartment_flat', label: 'Apartment / Society Flat', description: 'Gated community flat (1BHK, 2BHK, 3BHK) with shared walls', icon: 'Building' },
          { value: 'builder_floor', label: 'Builder Floor', description: 'Independent floor in an urban residential layout', icon: 'Building2' },
          { value: 'independent_house', label: 'Independent House / Kothi', description: 'Standalone house or bungalow with exposed roof slab', icon: 'Home' },
          { value: 'row_house_villa', label: 'Row House / Villa', description: 'Attached duplex or gated community villa', icon: 'Sparkles' }
        ]
      },
      {
        id: 'home_occupants',
        category: 'home',
        field: 'occupants',
        title: 'How many family members live in your household?',
        subtitle: 'Fixed base electricity and cooking fuels are divided equally among residents.',
        type: 'number',
        min: 1,
        max: 12,
        unit: 'family members',
        scienceTooltip: {
          heading: 'Per-Capita Household Apportionment',
          explanation: 'Shared appliances like refrigerators, televisions, and kitchen fuel enjoy economies of scale in joint/multi-generational Indian families, reducing per-capita emissions.',
          source: 'NSSO Household Energy Consumption Survey'
        }
      },
      {
        id: 'home_electricity',
        category: 'home',
        field: 'electricityKwhPerMonth',
        title: 'Average monthly electricity consumption',
        subtitle: 'Check your state DISCOM electricity bill (e.g. BESCOM, BSES, TNEB, MSEDCL, Tata Power).',
        type: 'slider',
        min: 50,
        max: 1200,
        step: 25,
        unit: 'Units (kWh) / mo',
        scienceTooltip: {
          heading: 'CEA Indian Grid Carbon Intensity',
          explanation: "India's national electricity grid has a high carbon intensity of ~716g CO₂e per Unit (kWh) because ~72% of base-load generation relies on domestic thermal coal.",
          source: 'Central Electricity Authority (CEA) CO2 Baseline Database v19 (2023)'
        }
      },
      {
        id: 'home_clean_energy',
        category: 'home',
        field: 'cleanEnergyPercent',
        title: 'Share of electricity from Rooftop Solar (PM Surya Ghar)',
        subtitle: 'Include grid-tied rooftop solar PV or certified green energy DISCOM tariffs.',
        type: 'slider',
        min: 0,
        max: 100,
        step: 10,
        unit: '% Solar',
        scienceTooltip: {
          heading: 'PM Surya Ghar Muft Bijli Yojana Impact',
          explanation: 'A 2 to 3 kW grid-interactive rooftop solar array produces ~250-350 Units monthly, displacing thermal coal generation with virtually zero operational emissions (~25g lifecycle CO₂e/kWh).',
          source: 'Ministry of New and Renewable Energy (MNRE)'
        }
      },
      {
        id: 'home_cooking',
        category: 'home',
        field: 'cookingFuelType',
        title: 'Primary household cooking fuel',
        subtitle: 'Kitchen fuel is the primary direct fossil combustion source in Indian homes.',
        type: 'cards',
        scienceTooltip: {
          heading: 'Cooking Energy Lifecycles',
          explanation: 'Induction cooktops have 84-90% thermal efficiency compared to 40-55% for gas stoves. PNG generates ~20% fewer greenhouse emissions per meal than bottled LPG.',
          source: 'Petroleum Conservation Research Association (PCRA)'
        },
        options: [
          { value: 'lpg_cylinder', label: 'Domestic LPG Cylinder', description: 'Standard 14.2 kg subsidized/commercial LPG cylinder', icon: 'Flame', badge: 'Standard' },
          { value: 'piped_gas_png', label: 'Piped Natural Gas (PNG)', description: 'Direct metered city gas pipeline (IGL, MGL, Adani)', icon: 'Droplets' },
          { value: 'electric_induction', label: 'Electric Induction', description: 'High-efficiency electromagnetic induction cooktop', icon: 'Zap', badge: 'Energy Saver' },
          { value: 'biomass_chulha', label: 'Biomass / Firewood Chulha', description: 'Traditional biomass stove (rural/semi-urban)', icon: 'Wind' }
        ]
      },
      {
        id: 'home_ac',
        category: 'home',
        field: 'acUsageHoursPerDay',
        title: 'Average summer air-conditioning (AC) usage per day',
        subtitle: 'Number of hours AC runs across all bedrooms in peak summer months (April to July).',
        type: 'slider',
        min: 0,
        max: 18,
        step: 1,
        unit: 'hours / day',
        scienceTooltip: {
          heading: 'Air Conditioner Peak Power Load',
          explanation: 'A 1.5 Ton BEE 3-Star inverter AC draws ~1.2 kW of electricity. Running it for 8 hours daily during summer consumes ~300-360 Units monthly, generating ~250 kg CO₂e on thermal coal.',
          source: 'Bureau of Energy Efficiency (BEE) Standards & Labeling'
        }
      },
      {
        id: 'home_ac_efficiency',
        category: 'home',
        field: 'acStarRating',
        title: 'BEE Energy Star Rating of your Air Conditioner',
        subtitle: 'Inverter compressors modulate cooling speed, preventing continuous peak compressor draw.',
        type: 'cards',
        scienceTooltip: {
          heading: 'Inverter vs Fixed Speed Efficiency',
          explanation: 'BEE 5-Star inverter ACs have an Indian Seasonal Energy Efficiency Ratio (ISEER) > 4.5, cutting seasonal electrical consumption by 30-35% compared to older non-inverter units.',
          source: 'BEE Energy Star Schedule 2024'
        },
        options: [
          { value: 'inverter_5star', label: 'BEE 5-Star Inverter AC', description: 'Variable speed BLDC compressor (Highest efficiency, ~0.85 kW)', icon: 'Zap', badge: '30% Energy Cut' },
          { value: 'inverter_3star', label: 'BEE 3-Star Inverter AC', description: 'Standard modern inverter split AC (~1.15 kW)', icon: 'Sparkles', badge: 'Standard' },
          { value: 'non_inverter_standard', label: 'Older Non-Inverter / Window AC', description: 'Fixed-speed reciprocating/rotary compressor (~1.55 kW)', icon: 'Wind' }
        ]
      },
      {
        id: 'home_water_heating',
        category: 'home',
        field: 'waterHeatingType',
        title: 'Bathroom water heating & geyser system',
        subtitle: 'Water heating is one of the highest wattage residential electrical loads (2,000 to 3,000 W).',
        type: 'cards',
        scienceTooltip: {
          heading: 'Geyser Power Consumption in Indian Climates',
          explanation: 'A 25L electric storage geyser running for 45 minutes daily consumes ~70-90 Units monthly during winter/monsoon months. Rooftop solar water heaters completely replace this with zero emissions.',
          source: 'MNRE Solar Thermal & CEEW Domestic Energy Assessment'
        },
        options: [
          { value: 'solar_water_heater', label: 'Solar Water Heater (ETC/FPC)', description: 'Rooftop solar collector with insulated tank (Zero operational power)', icon: 'Sparkles', badge: 'Zero Carbon' },
          { value: 'electric_storage_geyser', label: 'Electric Storage Geyser (15-25L)', description: 'Standard 2000W storage tank with standby thermal loss', icon: 'Droplets' },
          { value: 'instant_electric', label: 'Instant Electric Geyser (3kW)', description: 'Fast on-demand tankless electric water heater', icon: 'Zap' },
          { value: 'gas_geyser', label: 'LPG / PNG Gas Geyser', description: 'Continuous flow fossil gas water heater', icon: 'Flame' }
        ]
      }
    ]
  },
  {
    category: 'transport',
    stepNumber: 2,
    title: 'Daily Commuting',
    shortLabel: 'Commute',
    tagline: 'Track weekly city commuting, two-wheelers, auto-rickshaws, metro, and fuel mileage.',
    icon: 'Car',
    questions: [
      {
        id: 'transport_mode',
        category: 'transport',
        field: 'primaryMode',
        title: 'What is your primary mode of daily travel?',
        subtitle: 'Select your most frequent commute method for college, work, or daily errands.',
        type: 'cards',
        scienceTooltip: {
          heading: 'Modal Carbon Intensities in Indian Cities',
          explanation: 'Metro transit emits only ~18g CO₂e per passenger-km. A 100cc motorcycle emits ~45g/km. In contrast, single-occupancy petrol cars in city bumper-to-bumper traffic emit ~145-180g/km.',
          source: 'TERI & Delhi Metro Rail Corporation (DMRC) Sustainability Studies'
        },
        options: [
          { value: 'motorcycle_petrol', label: 'Motorcycle / Scooter', description: '100-150cc petrol 2-wheeler (~50 km/l)', icon: 'Bike', badge: 'Most Common' },
          { value: 'electric_scooter', label: 'Electric 2-Wheeler (EV)', description: 'Ather, Ola, TVS iQube, Chetak (~30 Wh/km)', icon: 'BatteryCharging', badge: 'Low Carbon' },
          { value: 'train_metro', label: 'Metro Rail / Suburban Train', description: 'Delhi Metro, Mumbai Local, Namma Metro', icon: 'Train', badge: 'Eco Transit' },
          { value: 'bus', label: 'City / State Transit Bus', description: 'DTC, BEST, BMTC, KSRTC public bus', icon: 'Bus' },
          { value: 'auto_rickshaw', label: 'Auto-Rickshaw / E-Rickshaw', description: 'CNG 3-wheeler or battery electric rickshaw', icon: 'Cpu' },
          { value: 'hybrid_car', label: 'Strong Hybrid Car', description: 'Grand Vitara, Hyryder, City e:HEV (~26 km/l with EV assist)', icon: 'Sparkles', badge: '40% Less Fuel' },
          { value: 'electric_car', label: 'Electric Car (EV)', description: 'Tata Nexon EV, Tiago EV, MG ZS EV (~120 Wh/km)', icon: 'BatteryCharging', badge: 'Zero Tailpipe' },
          { value: 'cng_car', label: 'CNG Car / Cab', description: 'Factory CNG vehicle or Uber/Ola CNG cab', icon: 'Gauge' },
          { value: 'petrol_car', label: 'Petrol Car', description: 'Hatchback, sedan, or compact SUV', icon: 'Fuel' },
          { value: 'diesel_car', label: 'Diesel Car / SUV', description: 'Mid/Full-size diesel vehicle', icon: 'Car' },
          { value: 'bicycle', label: 'Bicycle', description: 'Non-motorized active cycling', icon: 'Bike', badge: 'Zero Tailpipe' },
          { value: 'walk', label: 'Walking', description: 'Pedestrian active transit', icon: 'Footprints', badge: 'Zero Tailpipe' }
        ]
      },
      {
        id: 'transport_distance',
        category: 'transport',
        field: 'weeklyCommuteKm',
        title: 'Total weekly commuting distance',
        subtitle: 'Include round-trip college/work trips, coaching, grocery runs, and weekend travel.',
        type: 'slider',
        min: 10,
        max: 600,
        step: 10,
        unit: 'km / week',
        scienceTooltip: {
          heading: 'Vehicle Kilometers Traveled (VKT)',
          explanation: 'Urban commuting distance in Indian metropolitan areas averages 120-180 km/week. Shifting 30% of this distance to metro or bus provides dramatic emissions and congestion relief.',
          source: 'Ministry of Road Transport and Highways (MoRTH)'
        }
      },
      {
        id: 'transport_mileage',
        category: 'transport',
        field: 'vehicleMileageKmpl',
        title: 'Vehicle fuel efficiency / mileage (if driving)',
        subtitle: 'Average real-world kilometers per liter (km/l) or equivalent.',
        type: 'slider',
        min: 8,
        max: 65,
        step: 1,
        unit: 'km / l',
        scienceTooltip: {
          heading: 'Fuel Mileage Scaling',
          explanation: 'A 50 km/l motorcycle burns 0.02 liters of petrol per km. A 12 km/l petrol SUV in city traffic burns over 4 times as much fuel per kilometer.',
          source: 'ARAI Fuel Economy Test Benchmarks'
        }
      },
      {
        id: 'transport_carpool',
        category: 'transport',
        field: 'carpoolFrequency',
        title: 'Do you carpool, share rides, or ride with a pillion passenger?',
        subtitle: 'Splitting trips with colleagues, friends, or family.',
        type: 'cards',
        scienceTooltip: {
          heading: 'Occupancy Efficiency',
          explanation: 'Pillion riding on a motorcycle or carpooling with 3 colleagues cuts personal transport emissions by 50% to 75% per passenger-km.',
          source: 'Centre for Science and Environment (CSE)'
        },
        options: [
          { value: 'never', label: 'Solo Commute', description: 'Ride or drive alone on most journeys', icon: 'User' },
          { value: 'sometimes', label: 'Occasional Sharing', description: 'Pillion / carpool 1-2 days per week', icon: 'Users' },
          { value: 'always', label: 'Regular Carpool / Shared Cab', description: 'Daily shared ride with family or colleagues', icon: 'Users2', badge: '50% Cut' }
        ]
      }
    ]
  },
  {
    category: 'travel',
    stepNumber: 3,
    title: 'Intercity Travel & Flights',
    shortLabel: 'Travel',
    tagline: 'Calculate emissions from domestic flights, Indian Railways, and outstation trips.',
    icon: 'Plane',
    questions: [
      {
        id: 'travel_short_flights',
        category: 'travel',
        field: 'shortHaulFlightsPerYear',
        title: 'Short domestic flights per year (< 800 km / under 1.5 hours)',
        subtitle: 'e.g. Mumbai to Goa, Delhi to Jaipur/Lucknow, Bengaluru to Chennai/Hyderabad.',
        type: 'slider',
        min: 0,
        max: 12,
        step: 1,
        unit: 'trips / yr',
        scienceTooltip: {
          heading: 'Short-Haul Takeoff Penalty',
          explanation: 'Short-haul flights spend a large fraction of flight time in fuel-intensive takeoff and climb (~220g CO₂e/km), making them over 10x more carbon-intensive than Vande Bharat trains.',
          source: 'DGCA Environmental Studies & DEFRA'
        }
      },
      {
        id: 'travel_medium_flights',
        category: 'travel',
        field: 'mediumHaulFlightsPerYear',
        title: 'Trunk domestic flights per year (800 to 2,200 km)',
        subtitle: 'e.g. Delhi to Bengaluru/Mumbai/Kolkata, Mumbai to Chennai.',
        type: 'slider',
        min: 0,
        max: 10,
        step: 1,
        unit: 'trips / yr',
        scienceTooltip: {
          heading: 'Trunk Route Aviation Footprint',
          explanation: 'A round-trip flight from Delhi to Bengaluru emits ~0.35 tonnes CO₂e per passenger—equivalent to running a 1.5 Ton AC for 250 hours on standard grid electricity.',
          source: 'ICAO Carbon Emissions Calculator'
        }
      },
      {
        id: 'travel_long_flights',
        category: 'travel',
        field: 'longHaulFlightsPerYear',
        title: 'International round trips per year (> 6 hours)',
        subtitle: 'e.g. Return flights to Europe, United States, Middle East, Australia, or East Asia.',
        type: 'slider',
        min: 0,
        max: 6,
        step: 1,
        unit: 'round trips / yr',
        scienceTooltip: {
          heading: 'Intercontinental Radiative Forcing',
          explanation: 'Cruising at 35,000+ feet triggers non-CO₂ warming (contrails and ozone synthesis). A single round-trip to the US generates ~2.5 tonnes CO₂e—surpassing the annual Indian average!',
          source: 'Lee et al. (Atmospheric Environment)'
        }
      },
      {
        id: 'travel_cabin_class',
        category: 'travel',
        field: 'flightCabinClass',
        title: 'Usual flight seating & cabin class',
        subtitle: 'Cabin class dictates floor space allocation and baggage allowance on the aircraft.',
        type: 'cards',
        scienceTooltip: {
          heading: 'ICAO Seating Footprint Allocation',
          explanation: 'Business class lie-flat seating occupies 2.5x to 3x more physical deck space and weight than standard economy seating, multiplying the passenger carbon factor proportionally.',
          source: 'ICAO Carbon Emissions Methodology & DEFRA'
        },
        options: [
          { value: 'economy', label: 'Economy Class', description: 'Standard seating footprint (1.0x baseline factor)', icon: 'Armchair', badge: 'Lowest Carbon' },
          { value: 'premium', label: 'Premium Economy', description: 'Extra legroom / wider seats (1.5x space footprint)', icon: 'Layers' },
          { value: 'business', label: 'Business / First Class', description: 'Lie-flat bed, lounge, priority luggage (2.8x footprint)', icon: 'Crown', badge: 'High Impact' }
        ]
      },
      {
        id: 'travel_rail_trips',
        category: 'travel',
        field: 'indianRailwaysTripsPerYear',
        title: 'Long-distance Indian Railways journeys per year',
        subtitle: 'Vande Bharat, Rajdhani, Shatabdi, or Express trains (Sleeper/3AC/2AC).',
        type: 'slider',
        min: 0,
        max: 24,
        step: 1,
        unit: 'train journeys / yr',
        scienceTooltip: {
          heading: 'Electrified Indian Railways Network',
          explanation: 'Indian Railways is over 94% electrified and committed to net-zero by 2030. Rail produces ~18g CO₂e per passenger-km, making it the most sustainable intercity transit in the country.',
          source: 'Indian Railways Mission 100% Electrification'
        }
      },
      {
        id: 'travel_road_trips',
        category: 'travel',
        field: 'annualRoadTripKm',
        title: 'Annual outstation personal road trip distance',
        subtitle: 'Highway trips for vacations, weddings, or family visits (e.g. to Shimla, Goa, Rishikesh).',
        type: 'slider',
        min: 0,
        max: 4000,
        step: 200,
        unit: 'km / yr',
        scienceTooltip: {
          heading: 'Highway Long-Distance Cruising',
          explanation: 'Long highway road trips in a car generate ~145g CO₂e/km. Sharing seats with 4 family members drops individual intensity to ~36g CO₂e/p-km.',
          source: 'MoRTH National Highway Emission Estimates'
        }
      }
    ]
  },
  {
    category: 'food',
    stepNumber: 4,
    title: 'Food & Nutrition',
    shortLabel: 'Food',
    tagline: 'Explore the carbon footprint of Indian dietary diversity, sabzi mandi sourcing, and food waste.',
    icon: 'Utensils',
    questions: [
      {
        id: 'food_diet_type',
        category: 'food',
        field: 'dietType',
        title: 'Which best reflects your regular dietary pattern?',
        subtitle: 'Different diets produce different greenhouse gas footprints across agriculture and livestock.',
        type: 'cards',
        scienceTooltip: {
          heading: 'Indian Diets & Carbon Intensity',
          explanation: 'Traditional Indian plant-rich diets (dal, rajma, chana, roti, seasonal sabzi) have amongst the lowest carbon intensities in the world, generating ~1.1 t CO₂e/yr vs ~2.8 t for western meat diets.',
          source: 'EAT-Lancet Commission & Indian Council of Medical Research (ICMR)'
        },
        options: [
          { value: 'pure_vegetarian', label: 'Pure Vegetarian (Lacto-Veg)', description: 'Traditional dal, roti, rice, sabzi, paneer, curd, milk (No meat, fish, or eggs)', icon: 'Salad', badge: 'Low Carbon' },
          { value: 'jain_vegetarian', label: 'Jain Vegetarian', description: 'Vegetarian excluding root vegetables (onion, garlic, potato)', icon: 'Leaf', badge: 'Low Carbon' },
          { value: 'eggetarian', label: 'Eggetarian', description: 'Vegetarian diet supplemented with poultry eggs', icon: 'Sprout' },
          { value: 'non_veg_regular', label: 'Non-Vegetarian (Poultry & Seafood)', description: 'Chicken, fish, or eggs 1 to 3 times per week (Low/no red meat)', icon: 'Drumstick', badge: 'Moderate' },
          { value: 'non_veg_daily', label: 'Non-Vegetarian (Red Meat Inclusive)', description: 'Mutton, buff, or red meat consumed regularly in meals', icon: 'Beef', badge: 'High Methane' },
          { value: 'vegan', label: '100% Vegan (Plant-Based)', description: 'Strictly plant-based; no dairy, milk, ghee, paneer, or curd', icon: 'Leaf', badge: 'Lowest CO₂e' }
        ]
      },
      {
        id: 'food_local_mandi',
        category: 'food',
        field: 'localSeasonalShare',
        title: 'Share of fresh produce bought from local Sabzi Mandi',
        subtitle: 'Buying seasonal local vegetables vs packaged/imported supermarket foods.',
        type: 'slider',
        min: 0,
        max: 100,
        step: 10,
        unit: '% Local Mandi',
        scienceTooltip: {
          heading: 'Cold-Chain & Food Miles in India',
          explanation: 'Locally grown seasonal vegetables from the neighborhood mandi have short regional supply chains, eliminating long cold-storage refrigeration and air freight.',
          source: 'ICAR Post-Harvest Engineering Studies'
        }
      },
      {
        id: 'food_dairy',
        category: 'food',
        field: 'dairyConsumption',
        title: 'Daily dairy consumption (Chai, Curd, Ghee, Paneer)',
        subtitle: 'India is the world’s largest milk producer; ruminant cattle generate enteric methane.',
        type: 'cards',
        scienceTooltip: {
          heading: 'Bovine Enteric Fermentation & Dairy Emissions',
          explanation: 'Milk and ghee production involve enteric fermentation in cattle and buffaloes, releasing methane (CH₄). Dairy is a notable contributor to food emissions in Indian vegetarian households.',
          source: 'National Dairy Development Board (NDDB) & ICAR'
        },
        options: [
          { value: 'low', label: 'Light Dairy', description: '1 cup of milk/tea per day, minimal ghee/paneer', icon: 'Check' },
          { value: 'moderate', label: 'Average Household', description: 'Daily chai, curd with lunch, occasional paneer', icon: 'Smile' },
          { value: 'high', label: 'Heavy Dairy', description: 'Multiple cups of milk chai, generous ghee, daily paneer/sweets', icon: 'AlertTriangle' }
        ]
      },
      {
        id: 'food_dining_delivery',
        category: 'food',
        field: 'diningOutDeliveryFrequency',
        title: 'How often do you order food delivery or dine out?',
        subtitle: 'Zomato, Swiggy orders and commercial restaurant meals.',
        type: 'cards',
        scienceTooltip: {
          heading: 'Commercial Kitchen & Single-Use Food Packaging',
          explanation: 'Commercial restaurant preparation consumes significant liquefied petroleum gas and high-energy refrigeration. Takeaway delivery introduces plastic containers, bags, and delivery bike trips.',
          source: 'CSE Packaging Waste Assessment'
        },
        options: [
          { value: 'rarely', label: 'Home Cooked (< 2 times / mo)', description: 'Freshly cooked home meals on most days', icon: 'ShieldCheck', badge: 'Lowest Carbon' },
          { value: 'weekly', label: '1 to 2 times / week', description: 'Weekend dining out or occasional delivery', icon: 'Calendar' },
          { value: 'daily', label: 'Frequent / 3+ times / week', description: 'Regular Zomato/Swiggy orders and dining out', icon: 'Zap' }
        ]
      },
      {
        id: 'food_waste',
        category: 'food',
        field: 'foodWasteLevel',
        title: 'How much uneaten food is discarded in your kitchen?',
        subtitle: 'Leftover rotis, expired produce, and plate waste.',
        type: 'cards',
        scienceTooltip: {
          heading: 'Embedded Agricultural Inputs in Wasted Food',
          explanation: 'Throwing away food wastes all the pumped groundwater, fertilizer, and electricity used during farming, and generates landfill methane if not composted.',
          source: 'UNEP Food Waste Index'
        },
        options: [
          { value: 'low', label: 'Zero / Very Low Waste', description: 'Careful cooking portions, leftovers reheated, < 5% discarded', icon: 'CheckCircle2', badge: '-10% Footprint' },
          { value: 'average', label: 'Moderate Waste', description: 'Standard household waste (occasional spoiled veggies/food)', icon: 'HelpCircle' },
          { value: 'high', label: 'Frequent Discards', description: 'Significant food waste from overcooking or dining out', icon: 'AlertTriangle' }
        ]
      }
    ]
  },
  {
    category: 'shopping',
    stepNumber: 5,
    title: 'Shopping & Consumption',
    shortLabel: 'Shopping',
    tagline: 'Measure apparel manufacturing, electronics upgrades, and quick-commerce delivery habits.',
    icon: 'ShoppingBag',
    questions: [
      {
        id: 'shopping_clothing',
        category: 'shopping',
        field: 'clothingFrequency',
        title: 'How often do you purchase new clothes or footwear?',
        subtitle: 'Festival sales (Diwali/Eid), seasonal shopping, or frequent online orders.',
        type: 'cards',
        scienceTooltip: {
          heading: 'Textile Manufacturing Carbon',
          explanation: 'India is a major textile hub. Synthetic polyester requires petroleum cracking, while cotton requires substantial water and agricultural energy.',
          source: 'Ministry of Textiles & CITI LCA Reports'
        },
        options: [
          { value: 'rarely', label: 'Rarely / As Needed', description: 'Buy high quality durable items once or twice a year', icon: 'ShieldCheck', badge: 'Sustainable' },
          { value: 'seasonally', label: 'Festival / Seasonal', description: 'Buy new apparel during major festivals 2-4 times a year', icon: 'Calendar' },
          { value: 'monthly', label: 'Monthly Shopping', description: 'Regular retail shopping and online fashion purchases', icon: 'ShoppingBag' },
          { value: 'frequently', label: 'Frequent / Fast Fashion', description: 'Multiple monthly orders from fast-fashion apps', icon: 'Zap' }
        ]
      },
      {
        id: 'shopping_electronics',
        category: 'shopping',
        field: 'electronicsRefreshYears',
        title: 'How many years do you keep your smartphone or laptop?',
        subtitle: 'Silicon wafer fabrication and mining generate the bulk of device carbon.',
        type: 'slider',
        min: 1,
        max: 6,
        step: 1,
        unit: 'years',
        scienceTooltip: {
          heading: 'Embodied Silicon Carbon',
          explanation: 'Over 75% of a smartphone’s lifetime carbon emissions occur during chip fabrication and assembly before you ever turn it on. Keeping devices for 3+ years delays this lifecycle footprint.',
          source: 'CPCB E-Waste Guidelines & Electronics LCA'
        }
      },
      {
        id: 'shopping_deliveries',
        category: 'shopping',
        field: 'onlineDeliveryFrequency',
        title: 'How often do you order quick-commerce & parcel deliveries?',
        subtitle: 'Blinkit, Zepto, Swiggy Instamart, Amazon, Flipkart orders.',
        type: 'cards',
        scienceTooltip: {
          heading: 'Hyper-Local Last-Mile Delivery',
          explanation: 'Rapid 10-minute quick commerce creates repeated two-wheeler road trips and extensive plastic packaging wraps compared to bulk weekly grocery shopping.',
          source: 'NITI Aayog Urban Freight Logistics Roadmap'
        },
        options: [
          { value: 'rarely', label: 'Rarely (< 2 orders / mo)', description: 'Primarily shop at neighborhood kirana stores and local markets', icon: 'ShieldCheck' },
          { value: 'weekly', label: 'Weekly (1-3 orders / wk)', description: 'Regular online parcels and occasional grocery delivery', icon: 'Calendar' },
          { value: 'daily', label: 'Daily / Heavy', description: 'Frequent instant delivery apps and online shopping deliveries', icon: 'Zap' }
        ]
      }
    ]
  },
  {
    category: 'waste',
    stepNumber: 6,
    title: 'Waste & Recycling',
    shortLabel: 'Waste',
    tagline: 'Account for doorstep Kabadiwala scrap recycling, composting, and plastic reduction.',
    icon: 'Recycle',
    questions: [
      {
        id: 'waste_kabadiwala',
        category: 'waste',
        field: 'kabadiwalaRecycling',
        title: 'Do you sell or give recyclable scrap to the local Kabadiwala?',
        subtitle: 'Old newspapers (raddi), cardboard boxes, plastic containers, and glass bottles.',
        type: 'cards',
        scienceTooltip: {
          heading: "India's Informal Circular Economy",
          explanation: "India's informal scrap collectors (Kabadiwalas) achieve over 80% recovery rates for paper and metal—higher than many Western municipal systems. This directly prevents landfill methane and incinerator soot.",
          source: 'Chintan Environmental Research & CPCB Waste Management Rules'
        },
        options: [
          { value: 'regular', label: 'Regular (Every Month)', description: 'Sort and hand over all raddi, boxes, and plastic bottles to scrap dealers', icon: 'CheckCheck', badge: 'High Circularity' },
          { value: 'occasional', label: 'Occasional', description: 'Sell newspaper scrap once or twice a year', icon: 'Check' },
          { value: 'none', label: 'Rare / None', description: 'Discard everything into municipal mixed trash bins', icon: 'Trash2' }
        ]
      },
      {
        id: 'waste_composting',
        category: 'waste',
        field: 'compostsOrganicWaste',
        title: 'Do you compost kitchen wet waste or garden trimmings?',
        subtitle: 'Terrace pot composter, community composting bin, or garden pit.',
        type: 'toggle',
        scienceTooltip: {
          heading: 'Methane Prevention from Decomposing Wet Waste',
          explanation: 'When organic vegetable peels decay in open dumpsites (Ghazipur, Deonar), anaerobic bacteria release methane (CH₄). Aerobic home composting prevents methane release entirely.',
          source: 'Swachh Bharat Mission Urban Guidelines & NEERI'
        }
      },
      {
        id: 'waste_plastics',
        category: 'waste',
        field: 'avoidsSingleUsePlastic',
        title: 'Do you carry cloth bags and avoid single-use plastic covers?',
        subtitle: 'Bringing a cloth jhola to the sabzi mandi, reusable steel bottle, refusing plastic cutlery.',
        type: 'cards',
        scienceTooltip: {
          heading: 'Single-Use Plastic Ban & Petrochemicals',
          explanation: 'Virgin thin plastic bags are manufactured from petroleum naphtha. Reusable cotton jholas eliminate petrochemical demand and protect municipal stormwater drains.',
          source: 'MoEFCC Plastic Waste Management Rules'
        },
        options: [
          { value: 'always', label: 'Always Carry Jhola / Steel Bottle', description: 'Strictly avoid plastic carry bags and single-use bottles', icon: 'ShieldCheck' },
          { value: 'often', label: 'Moderate Effort', description: 'Carry bags for planned grocery shopping', icon: 'Smile' },
          { value: 'rarely', label: 'Routinely Accept Plastics', description: 'Rely on disposable plastic covers and packaging', icon: 'Package' }
        ]
      }
    ]
  },
  {
    category: 'lifestyle',
    stepNumber: 7,
    title: 'Digital & Lifestyle',
    shortLabel: 'Lifestyle',
    tagline: 'Assess mobile 4G/5G streaming bandwidth, pets, and sustainable lifestyle practices.',
    icon: 'Leaf',
    questions: [
      {
        id: 'lifestyle_digital',
        category: 'lifestyle',
        field: 'digitalFootprintTier',
        title: 'Daily mobile data & video streaming usage',
        subtitle: 'Hours spent streaming YouTube, OTT platforms, reels, and video calls.',
        type: 'cards',
        scienceTooltip: {
          heading: 'Data Center & Telecom Tower Energy',
          explanation: 'India has one of the highest per-capita mobile data consumptions in the world (~24 GB/mo). Telecom cellular towers and cloud data centers draw continuous power, largely from the national grid.',
          source: 'TRAI Indian Telecom Services Performance Indicators'
        },
        options: [
          { value: 'low', label: 'Light (< 2 hrs/day)', description: 'Text messaging, news browsing, and audio calls', icon: 'Laptop' },
          { value: 'moderate', label: 'Moderate (2-5 hrs/day)', description: 'Regular YouTube streaming, social media reels, and OTT', icon: 'Tv' },
          { value: 'heavy', label: 'Heavy (6+ hrs/day)', description: 'Continuous HD video streaming, online gaming, and cloud sync', icon: 'Server' }
        ]
      },
      {
        id: 'lifestyle_pets',
        category: 'lifestyle',
        field: 'petOwnership',
        title: 'Do you care for companion pets?',
        subtitle: 'Commercial meat-based pet food has an agricultural carbon footprint.',
        type: 'cards',
        scienceTooltip: {
          heading: 'Pet Nutrition Impact',
          explanation: 'Large dogs fed commercial processed meat foods consume notable animal protein. Indie dogs or cats have much lower dietary footprints.',
          source: 'PLOS ONE Companion Animal Dietary LCA'
        },
        options: [
          { value: 'none', label: 'No Pets', description: 'Zero pet care footprint', icon: 'Slash' },
          { value: 'small_pet', label: 'Cat / Small Indie Pet', description: 'Cat, indie dog, bird, or fish (~0.10 t CO₂e/yr)', icon: 'Cat' },
          { value: 'large_dog', label: 'Medium / Large Breed Dog', description: 'Golden Retriever, German Shepherd, Lab (~0.45 t CO₂e/yr)', icon: 'Dog' }
        ]
      }
    ]
  }
];
