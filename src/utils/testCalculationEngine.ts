import { calculateFootprint, calculateSimulatedFootprint } from './calculationEngine';
import { PRESET_PROFILES } from '../data/presets';
import type { CalculatorState, WhatIfOverrides } from '../types/calculator';

console.log('🧪 RUNNING ECOLYSE CALCULATION VERIFICATION SUITE\n');

let allPassed = true;

// Test 1: Verify all preset profiles compute valid outputs
console.log('--- Test 1: Preset Profiles Execution ---');
for (const preset of PRESET_PROFILES) {
  const res = calculateFootprint(preset.data);
  const valid = !isNaN(res.totalTonnes) && res.totalTonnes > 0 && res.categoryList.length === 7;
  console.log(`[${valid ? 'PASS' : 'FAIL'}] Preset "${preset.name}": ${res.totalTonnes} t CO2e (Expected ~${preset.expectedTonnes} t)`);
  if (!valid) allPassed = false;
}

// Test 2: Edge Case Safety (0 occupants, 0 distance, extreme values)
console.log('\n--- Test 2: Extreme Edge Cases ---');
const edgeState: CalculatorState = JSON.parse(JSON.stringify(PRESET_PROFILES[0].data));
edgeState.home.occupants = 0; // should be clamped to 1
edgeState.transport.weeklyCommuteKm = 0;
edgeState.travel.shortHaulFlightsPerYear = 0;
edgeState.travel.mediumHaulFlightsPerYear = 0;
edgeState.travel.longHaulFlightsPerYear = 0;
edgeState.home.cleanEnergyPercent = 100;

const edgeRes = calculateFootprint(edgeState);
const edgeValid = !isNaN(edgeRes.totalTonnes) && isFinite(edgeRes.totalTonnes) && edgeRes.totalTonnes > 0;
console.log(`[${edgeValid ? 'PASS' : 'FAIL'}] Edge case with 0 occupants & zero commute: ${edgeRes.totalTonnes} t CO2e`);
if (!edgeValid) allPassed = false;

// Test 3: What-If Simulator Real-time Response
console.log('\n--- Test 3: What-If Simulator Math ---');
const baseProfile = PRESET_PROFILES[0].data;
const baseRes = calculateFootprint(baseProfile);

const overrides: WhatIfOverrides = {
  reduceCarTravelPercent: 30,
  cleanElectricityPercent: 100,
  dietShiftPlantShare: 50,
  reduceFlightsCount: 1,
  eliminateFoodWaste: true,
  buySecondHandPercent: 50
};

const simRes = calculateSimulatedFootprint(baseProfile, overrides);
const simValid = simRes.simulatedTotal < baseRes.totalTonnes && simRes.reductionTonnes > 0;
console.log(`[${simValid ? 'PASS' : 'FAIL'}] Baseline: ${baseRes.totalTonnes} t -> Simulated: ${simRes.simulatedTotal} t (-${simRes.reductionTonnes} t / -${simRes.reductionPercentage}%)`);
if (!simValid) allPassed = false;

// Test 4: Recommendations Generation
console.log('\n--- Test 4: Dynamic Recommendations Generation ---');
const recs = baseRes.recommendations;
const recsValid = recs.length > 0 && recs.length <= 5 && recs.every(r => r.potentialReductionTonnes > 0 && r.title);
console.log(`[${recsValid ? 'PASS' : 'FAIL'}] Generated ${recs.length} prioritized recommendations:`);
recs.forEach((r, idx) => {
  console.log(`   ${idx + 1}. ${r.title} (Savings: -${r.potentialReductionTonnes} t, Difficulty: ${r.difficulty})`);
});
if (!recsValid) allPassed = false;

console.log(`\n========================================`);
if (allPassed) {
  console.log('✅ ALL CALCULATION ENGINE TESTS PASSED');
} else {
  throw new Error('❌ SOME TESTS FAILED');
}
