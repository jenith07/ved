import type { SafetyLevel, Species } from '@/src/types';
import { calculateDose, type CalculationResult } from '@/src/utils/calculationEngine';
import { create } from 'zustand';

interface DrugInfo {
    id: string;
    name: string;
    category: string;
    isHighRisk: boolean;
    mdr1Sensitive: boolean;
}

interface DosageInfo {
    id: string;
    indication: string;
    route: string;
    doseLow: number;
    doseHigh: number;
    doseUnit: string;
    frequency: string;
    maxDose?: number;
    safetyLevel: SafetyLevel;
    notes?: string;
}

interface FormulationInfo {
    id: string;
    form: string;
    concentration: number;
    concentrationUnit: string;
}

interface CalculatorState {
    // Step tracking
    currentStep: number;
    setCurrentStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    resetCalculator: () => void;

    // Patient selection (optional)
    selectedPatientId: string | null;
    selectedPatientName: string | null;
    setSelectedPatient: (id: string | null, name: string | null) => void;

    // Species & Weight
    species: Species | null;
    setSpecies: (species: Species) => void;

    weight: number | null;
    weightUnit: 'kg' | 'lbs';
    setWeight: (weight: number, unit: 'kg' | 'lbs') => void;

    bcs: number | null;
    setBcs: (bcs: number | null) => void;

    breed: string | null;
    setBreed: (breed: string | null) => void;

    // For reptiles
    temperature: number | null;
    setTemperature: (temp: number | null) => void;

    // Drug selection
    selectedDrug: DrugInfo | null;
    setSelectedDrug: (drug: DrugInfo | null) => void;

    // Dosage selection
    availableDosages: DosageInfo[];
    setAvailableDosages: (dosages: DosageInfo[]) => void;
    selectedDosage: DosageInfo | null;
    setSelectedDosage: (dosage: DosageInfo | null) => void;

    // Formulation selection
    availableFormulations: FormulationInfo[];
    setAvailableFormulations: (formulations: FormulationInfo[]) => void;
    selectedFormulation: FormulationInfo | null;
    setSelectedFormulation: (formulation: FormulationInfo | null) => void;

    // Calculation options
    useHighDose: boolean;
    setUseHighDose: (use: boolean) => void;

    // Result
    result: CalculationResult | null;
    calculate: () => void;

    // Safety
    warnings: string[];
    safetyAcknowledged: boolean;
    acknowledgeSafety: () => void;

    // History tracking
    calculationHistory: Array<{
        timestamp: number;
        species: Species;
        weight: number;
        drugName: string;
        dose: number;
        doseUnit: string;
    }>;
    addToHistory: () => void;
}

const initialState = {
    currentStep: 0,
    selectedPatientId: null,
    selectedPatientName: null,
    species: null,
    weight: null,
    weightUnit: 'kg' as const,
    bcs: null,
    breed: null,
    temperature: null,
    selectedDrug: null,
    availableDosages: [],
    selectedDosage: null,
    availableFormulations: [],
    selectedFormulation: null,
    useHighDose: false,
    result: null,
    warnings: [],
    safetyAcknowledged: false,
};

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
    ...initialState,
    calculationHistory: [],

    setCurrentStep: (step) => set({ currentStep: step }),

    nextStep: () => set((state) => ({ currentStep: state.currentStep + 1 })),

    prevStep: () => set((state) => ({
        currentStep: Math.max(0, state.currentStep - 1)
    })),

    resetCalculator: () => set({
        ...initialState,
        calculationHistory: get().calculationHistory,
    }),

    setSelectedPatient: (id, name) => set({
        selectedPatientId: id,
        selectedPatientName: name
    }),

    setSpecies: (species) => set({
        species,
        // Reset drug selection when species changes
        selectedDrug: null,
        availableDosages: [],
        selectedDosage: null,
        result: null,
    }),

    setWeight: (weight, unit) => set({
        weight,
        weightUnit: unit,
        result: null,
    }),

    setBcs: (bcs) => set({ bcs, result: null }),

    setBreed: (breed) => set({ breed }),

    setTemperature: (temperature) => set({ temperature, result: null }),

    setSelectedDrug: (drug) => set({
        selectedDrug: drug,
        selectedDosage: null,
        selectedFormulation: null,
        result: null,
        warnings: [],
        safetyAcknowledged: false,
    }),

    setAvailableDosages: (dosages) => set({ availableDosages: dosages }),

    setSelectedDosage: (dosage) => set({
        selectedDosage: dosage,
        result: null,
    }),

    setAvailableFormulations: (formulations) => set({ availableFormulations: formulations }),

    setSelectedFormulation: (formulation) => set({
        selectedFormulation: formulation,
        result: null,
    }),

    setUseHighDose: (useHighDose) => set({ useHighDose, result: null }),

    calculate: () => {
        const state = get();

        if (!state.species || !state.weight || !state.selectedDrug || !state.selectedDosage) {
            return;
        }

        const result = calculateDose({
            species: state.species,
            weight: state.weight,
            weightUnit: state.weightUnit,
            bcs: state.bcs ?? undefined,
            breed: state.breed ?? undefined,
            temperature: state.temperature ?? undefined,
            drugId: state.selectedDrug.id,
            drugName: state.selectedDrug.name,
            doseLow: state.selectedDosage.doseLow,
            doseHigh: state.selectedDosage.doseHigh,
            doseUnit: state.selectedDosage.doseUnit,
            route: state.selectedDosage.route,
            maxDose: state.selectedDosage.maxDose,
            isHighRisk: state.selectedDrug.isHighRisk,
            mdr1Sensitive: state.selectedDrug.mdr1Sensitive,
            concentration: state.selectedFormulation?.concentration,
            concentrationUnit: state.selectedFormulation?.concentrationUnit,
            useHighDose: state.useHighDose,
        });

        set({
            result,
            warnings: result.warnings,
            safetyAcknowledged: result.warnings.length === 0,
        });
    },

    acknowledgeSafety: () => set({ safetyAcknowledged: true }),

    addToHistory: () => {
        const state = get();
        if (!state.result || !state.species || !state.weight || !state.selectedDrug) {
            return;
        }

        const entry = {
            timestamp: Date.now(),
            species: state.species,
            weight: state.weight,
            drugName: state.selectedDrug.name,
            dose: state.result.dose,
            doseUnit: state.result.doseUnit,
        };

        set((state) => ({
            calculationHistory: [entry, ...state.calculationHistory].slice(0, 50),
        }));
    },
}));

export default useCalculatorStore;
