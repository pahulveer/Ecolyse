import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { 
  CalculatorState, 
  CalculationResult, 
  CategoryKey,
  WhatIfOverrides 
} from '../types/calculator';
import { DEFAULT_CALCULATOR_STATE, PRESET_PROFILES } from '../data/presets';
import { calculateFootprint } from '../utils/calculationEngine';

export type AppView = 'home' | 'calculator' | 'results' | 'climate_data' | 'learn' | 'methodology';

interface CalculatorContextType {
  // Navigation & View
  view: AppView;
  setView: (view: AppView) => void;
  currentStepIndex: number;
  setCurrentStepIndex: (step: number) => void;
  goToNextStep: () => void;
  goToPreviousStep: () => void;

  // Assessment State
  state: CalculatorState;
  updateField: (category: CategoryKey, field: string, value: any) => void;
  resetCalculator: () => void;
  loadPreset: (presetId: string) => void;

  // Calculation Results
  calculationResult: CalculationResult;
  isCalculating: boolean;
  completeAssessment: () => void;

  // Committed actions
  committedActionIds: string[];
  toggleCommitAction: (id: string) => void;
  totalCommittedSavings: number;

  // What-If Simulator Overrides
  whatIfOverrides: WhatIfOverrides;
  updateWhatIfOverride: <K extends keyof WhatIfOverrides>(field: K, value: WhatIfOverrides[K]) => void;
  resetWhatIfOverrides: () => void;

  // Presentation Mode
  isPresentationMode: boolean;
  setIsPresentationMode: (active: boolean) => void;
}

const STORAGE_KEY = 'ecolyse_india_assessment_v3';
const LEGACY_STORAGE_KEY = 'carbonzero_india_assessment_v3';
const COMMITTED_KEY = 'ecolyse_committed_actions_v3';
const LEGACY_COMMITTED_KEY = 'carbonzero_committed_actions_v3';

const DEFAULT_WHAT_IF_OVERRIDES: WhatIfOverrides = {
  reduceCarTravelPercent: 0,
  cleanElectricityPercent: 0,
  dietShiftPlantShare: 0,
  reduceFlightsCount: 0,
  eliminateFoodWaste: false,
  buySecondHandPercent: 0,
};

function safeMergeState(saved: any): CalculatorState {
  if (!saved || typeof saved !== 'object') return DEFAULT_CALCULATOR_STATE;
  return {
    home: { ...DEFAULT_CALCULATOR_STATE.home, ...(saved.home || {}) },
    transport: { ...DEFAULT_CALCULATOR_STATE.transport, ...(saved.transport || {}) },
    travel: { ...DEFAULT_CALCULATOR_STATE.travel, ...(saved.travel || {}) },
    food: { ...DEFAULT_CALCULATOR_STATE.food, ...(saved.food || {}) },
    shopping: { ...DEFAULT_CALCULATOR_STATE.shopping, ...(saved.shopping || {}) },
    waste: { ...DEFAULT_CALCULATOR_STATE.waste, ...(saved.waste || {}) },
    lifestyle: { ...DEFAULT_CALCULATOR_STATE.lifestyle, ...(saved.lifestyle || {}) },
  };
}

const CalculatorContext = createContext<CalculatorContextType | undefined>(undefined);

export const CalculatorProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [view, setView] = useState<AppView>('home');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);
  const [isPresentationMode, setIsPresentationMode] = useState<boolean>(false);

  // Initialize from LocalStorage or default with deep merge protection
  const [state, setState] = useState<CalculatorState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_STORAGE_KEY);
      if (saved) return safeMergeState(JSON.parse(saved));
    } catch {}
    return DEFAULT_CALCULATOR_STATE;
  });

  const [committedActionIds, setCommittedActionIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(COMMITTED_KEY) || localStorage.getItem(LEGACY_COMMITTED_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [whatIfOverrides, setWhatIfOverrides] = useState<WhatIfOverrides>(DEFAULT_WHAT_IF_OVERRIDES);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);

  useEffect(() => {
    try {
      localStorage.setItem(COMMITTED_KEY, JSON.stringify(committedActionIds));
    } catch {}
  }, [committedActionIds]);

  // Derived calculation result with bulletproof fallback
  const calculationResult = useMemo(() => {
    try {
      return calculateFootprint(state);
    } catch (err) {
      console.warn('Footprint calculation fallback triggered:', err);
      return calculateFootprint(DEFAULT_CALCULATOR_STATE);
    }
  }, [state]);

  const updateField = (category: CategoryKey, field: string, value: any) => {
    setState(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [field]: value
      }
    }));
  };

  const resetCalculator = () => {
    setState(DEFAULT_CALCULATOR_STATE);
    setCommittedActionIds([]);
    setWhatIfOverrides(DEFAULT_WHAT_IF_OVERRIDES);
    setCurrentStepIndex(0);
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(LEGACY_STORAGE_KEY);
      localStorage.removeItem(COMMITTED_KEY);
      localStorage.removeItem(LEGACY_COMMITTED_KEY);
    } catch {}
  };

  const loadPreset = (presetId: string) => {
    const preset = PRESET_PROFILES.find(p => p.id === presetId);
    if (preset) {
      setState(preset.data);
      setWhatIfOverrides(DEFAULT_WHAT_IF_OVERRIDES);
      setView('results');
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  };

  const goToNextStep = () => {
    if (currentStepIndex < 6) {
      setCurrentStepIndex(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      completeAssessment();
    }
  };

  const goToPreviousStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const completeAssessment = () => {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    setIsCalculating(false);
    setView('results');
  };

  const toggleCommitAction = (id: string) => {
    setCommittedActionIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const totalCommittedSavings = useMemo(() => {
    return (calculationResult?.recommendations || [])
      .filter(r => committedActionIds.includes(r.id))
      .reduce((sum, r) => sum + (Number(r.potentialReductionTonnes) || 0), 0);
  }, [calculationResult?.recommendations, committedActionIds]);

  const updateWhatIfOverride = <K extends keyof WhatIfOverrides>(
    field: K,
    value: WhatIfOverrides[K]
  ) => {
    setWhatIfOverrides(prev => ({ ...prev, [field]: value }));
  };

  const resetWhatIfOverrides = () => {
    setWhatIfOverrides(DEFAULT_WHAT_IF_OVERRIDES);
  };

  return (
    <CalculatorContext.Provider
      value={{
        view,
        setView,
        currentStepIndex,
        setCurrentStepIndex,
        goToNextStep,
        goToPreviousStep,
        state,
        updateField,
        resetCalculator,
        loadPreset,
        calculationResult,
        isCalculating,
        completeAssessment,
        committedActionIds,
        toggleCommitAction,
        totalCommittedSavings,
        whatIfOverrides,
        updateWhatIfOverride,
        resetWhatIfOverrides,
        isPresentationMode,
        setIsPresentationMode
      }}
    >
      {children}
    </CalculatorContext.Provider>
  );
};

export const useCalculator = (): CalculatorContextType => {
  const context = useContext(CalculatorContext);
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider');
  }
  return context;
};
