/**
 * Calculation Engine
 * Core dosing calculation logic with safety checks
 */
import type { SafetyLevel, Species } from '@/src/types';

// Species-specific metabolism factors for allometric scaling
const ALLOMETRIC_FACTORS: Record<string, { k: number; exponent: number }> = {
    canine: { k: 1.0, exponent: 0.75 },
    feline: { k: 1.0, exponent: 0.75 },
    avian: { k: 10.0, exponent: 0.75 },
    reptile: { k: 5.0, exponent: 0.75 },
    equine: { k: 1.0, exponent: 0.75 },
    bovine: { k: 1.0, exponent: 0.75 },
    exotic: { k: 3.0, exponent: 0.75 },
};

// Temperature adjustment for reptiles (ectotherms)
const REPTILE_TEMP_FACTORS: Record<string, number> = {
    cold: 0.5,    // <20°C - half metabolism
    cool: 0.75,   // 20-25°C
    optimal: 1.0, // 25-30°C
    warm: 1.25,   // 30-35°C
    hot: 1.5,     // >35°C - increased metabolism
};

// MDR1-affected breeds
const MDR1_BREEDS = [
    'collie', 'rough collie', 'smooth collie', 'border collie',
    'australian shepherd', 'aussie',
    'shetland sheepdog', 'sheltie',
    'old english sheepdog',
    'english shepherd',
    'german shepherd',
    'longhaired whippet',
    'silken windhound',
    'mcnab',
    'miniature australian shepherd',
    'mixed collie',
];

// Breeds with known drug sensitivities
const BREED_WARNINGS: Record<string, string[]> = {
    boxer: ['acepromazine'], // Sensitivity to acepromazine
    greyhound: ['thiopental', 'propofol'], // Slow drug metabolism
    cavalier: ['furosemide'], // MVD-related monitoring
};

export interface CalculationInput {
    species: Species;
    weight: number;
    weightUnit: 'kg' | 'lbs';
    bcs?: number;
    drugId: string;
    drugName: string;
    doseLow: number;
    doseHigh: number;
    doseUnit: string;
    route: string;
    concentration?: number;
    concentrationUnit?: string;
    isHighRisk: boolean;
    mdr1Sensitive: boolean;
    maxDose?: number;
    breed?: string;
    temperature?: number; // For reptiles, in Celsius
    useHighDose?: boolean;
}

export interface CalculationResult {
    dose: number;
    doseUnit: string;
    doseRange: { low: number; high: number };
    volume?: number;
    volumeUnit?: string;
    safetyLevel: SafetyLevel;
    warnings: string[];
    notes: string[];
    adjustments: string[];
    isValid: boolean;
}

/**
 * Convert weight to kg if needed
 */
function normalizeWeight(weight: number, unit: 'kg' | 'lbs'): number {
    if (unit === 'lbs') {
        return weight / 2.20462;
    }
    return weight;
}

/**
 * Calculate BCS weight adjustment
 * Adjusts weight based on body condition score
 */
function adjustWeightForBCS(weight: number, bcs?: number): { adjustedWeight: number; adjustment: string | null } {
    if (!bcs || bcs === 5) {
        return { adjustedWeight: weight, adjustment: null };
    }

    // BCS 1-3: underweight, use actual weight
    // BCS 4-5: ideal, use actual weight
    // BCS 6-7: overweight, reduce by 10-20%
    // BCS 8-9: obese, reduce by 20-30%

    let factor = 1.0;
    let adjustment = null;

    if (bcs >= 8) {
        factor = 0.75; // Use 75% of weight for obese
        adjustment = 'Weight adjusted by -25% for obesity (BCS 8-9)';
    } else if (bcs >= 6) {
        factor = 0.9; // Use 90% of weight for overweight
        adjustment = 'Weight adjusted by -10% for overweight (BCS 6-7)';
    }

    return { adjustedWeight: weight * factor, adjustment };
}

/**
 * Apply allometric scaling for exotic species
 */
function applyAllometricScaling(
    baseDose: number,
    weight: number,
    species: Species,
    referenceWeight: number = 10 // Standard dog weight for reference
): { scaledDose: number; note: string | null } {
    const factor = ALLOMETRIC_FACTORS[species];

    if (!factor || species === 'canine' || species === 'feline') {
        return { scaledDose: baseDose, note: null };
    }

    // Allometric formula: Dose = BaseDose × (weight/referenceWeight)^exponent × k
    const scaledDose = baseDose * Math.pow(weight / referenceWeight, factor.exponent) * factor.k;

    return {
        scaledDose,
        note: `Allometric scaling applied for ${species} (factor: ${factor.k})`,
    };
}

/**
 * Apply temperature adjustment for reptiles
 */
function applyTemperatureAdjustment(
    dose: number,
    temperature?: number
): { adjustedDose: number; note: string | null } {
    if (!temperature) {
        return { adjustedDose: dose, note: null };
    }

    let tempCategory: string;
    if (temperature < 20) tempCategory = 'cold';
    else if (temperature < 25) tempCategory = 'cool';
    else if (temperature < 30) tempCategory = 'optimal';
    else if (temperature < 35) tempCategory = 'warm';
    else tempCategory = 'hot';

    const factor = REPTILE_TEMP_FACTORS[tempCategory];

    return {
        adjustedDose: dose * factor,
        note: `Temperature adjustment: ${tempCategory} (${temperature}°C, factor: ${factor})`,
    };
}

/**
 * Check for MDR1 sensitivity
 */
function checkMDR1(breed?: string, drugMdr1Sensitive?: boolean): string | null {
    if (!breed || !drugMdr1Sensitive) return null;

    const lowerBreed = breed.toLowerCase();
    const isMDR1Breed = MDR1_BREEDS.some(b => lowerBreed.includes(b));

    if (isMDR1Breed) {
        return `⚠️ MDR1 MUTATION WARNING: ${breed} may carry MDR1 mutation. Consider genetic testing. Reduce dose by 25-50% or use alternative drug.`;
    }

    return null;
}

/**
 * Check for breed-specific warnings
 */
function checkBreedWarnings(breed?: string, drugName?: string): string | null {
    if (!breed || !drugName) return null;

    const lowerBreed = breed.toLowerCase();
    const lowerDrug = drugName.toLowerCase();

    for (const [breedKey, drugs] of Object.entries(BREED_WARNINGS)) {
        if (lowerBreed.includes(breedKey)) {
            if (drugs.some(d => lowerDrug.includes(d))) {
                return `⚠️ BREED WARNING: ${breed} may have sensitivity to ${drugName}`;
            }
        }
    }

    return null;
}

/**
 * Calculate volume based on concentration
 */
function calculateVolume(
    dose: number,
    concentration?: number,
    concentrationUnit?: string
): { volume: number; unit: string } | null {
    if (!concentration || !concentrationUnit) return null;

    // Handle mg/ml
    if (concentrationUnit === 'mg/ml') {
        return { volume: dose / concentration, unit: 'ml' };
    }

    // Handle mg/tablet - round to nearest half tablet
    if (concentrationUnit === 'mg/tablet') {
        const tablets = dose / concentration;
        return { volume: Math.round(tablets * 2) / 2, unit: 'tablets' };
    }

    return null;
}

/**
 * Determine safety level based on dose and drug properties
 */
function determineSafetyLevel(
    calculatedDose: number,
    doseLow: number,
    doseHigh: number,
    maxDose?: number,
    isHighRisk?: boolean,
    hasWarnings?: boolean
): SafetyLevel {
    // Check if exceeds max dose
    if (maxDose && calculatedDose > maxDose) {
        return 'danger';
    }

    // Check if outside therapeutic range
    if (calculatedDose > doseHigh * 1.5) {
        return 'danger';
    }

    if (calculatedDose > doseHigh * 1.1) {
        return 'caution';
    }

    // High risk drugs always at least caution
    if (isHighRisk) {
        return hasWarnings ? 'danger' : 'caution';
    }

    // Normal therapeutic range
    return hasWarnings ? 'caution' : 'safe';
}

/**
 * Main calculation function
 */
export function calculateDose(input: CalculationInput): CalculationResult {
    const warnings: string[] = [];
    const notes: string[] = [];
    const adjustments: string[] = [];

    // Normalize weight to kg
    const weightKg = normalizeWeight(input.weight, input.weightUnit);

    // Adjust for BCS
    const { adjustedWeight, adjustment: bcsAdjustment } = adjustWeightForBCS(weightKg, input.bcs);
    if (bcsAdjustment) adjustments.push(bcsAdjustment);

    // Base dose calculation
    const doseRate = input.useHighDose ? input.doseHigh : input.doseLow;
    let calculatedDose = adjustedWeight * doseRate;

    // Apply allometric scaling for exotic species
    if (['avian', 'reptile', 'exotic'].includes(input.species)) {
        const { scaledDose, note } = applyAllometricScaling(calculatedDose, adjustedWeight, input.species);
        if (note) {
            calculatedDose = scaledDose;
            adjustments.push(note);
        }
    }

    // Apply temperature adjustment for reptiles
    if (input.species === 'reptile' && input.temperature) {
        const { adjustedDose, note } = applyTemperatureAdjustment(calculatedDose, input.temperature);
        if (note) {
            calculatedDose = adjustedDose;
            adjustments.push(note);
        }
    }

    // Check max dose
    if (input.maxDose && calculatedDose > input.maxDose) {
        warnings.push(`Dose capped at maximum: ${input.maxDose} ${input.doseUnit}`);
        calculatedDose = input.maxDose;
    }

    // MDR1 check
    const mdr1Warning = checkMDR1(input.breed, input.mdr1Sensitive);
    if (mdr1Warning) warnings.push(mdr1Warning);

    // Breed-specific warnings
    const breedWarning = checkBreedWarnings(input.breed, input.drugName);
    if (breedWarning) warnings.push(breedWarning);

    // High-risk drug warning
    if (input.isHighRisk) {
        warnings.push('⚠️ HIGH-RISK DRUG: Double-check dose and monitor patient closely');
    }

    // Calculate volume if concentration provided
    const volumeResult = calculateVolume(calculatedDose, input.concentration, input.concentrationUnit);

    // Determine safety level
    const safetyLevel = determineSafetyLevel(
        calculatedDose,
        input.doseLow * adjustedWeight,
        input.doseHigh * adjustedWeight,
        input.maxDose,
        input.isHighRisk,
        warnings.length > 0
    );

    // Calculate dose range
    const doseRange = {
        low: adjustedWeight * input.doseLow,
        high: adjustedWeight * input.doseHigh,
    };

    return {
        dose: Math.round(calculatedDose * 100) / 100,
        doseUnit: input.doseUnit.replace('/kg', ''),
        doseRange: {
            low: Math.round(doseRange.low * 100) / 100,
            high: Math.round(doseRange.high * 100) / 100,
        },
        volume: volumeResult?.volume ? Math.round(volumeResult.volume * 100) / 100 : undefined,
        volumeUnit: volumeResult?.unit,
        safetyLevel,
        warnings,
        notes,
        adjustments,
        isValid: safetyLevel !== 'danger' || warnings.length === 0,
    };
}

/**
 * Quick dose check without full calculation
 */
export function quickDoseCheck(
    weight: number,
    doseRate: number,
    maxDose?: number
): { dose: number; exceedsMax: boolean } {
    const dose = weight * doseRate;
    return {
        dose: Math.round(dose * 100) / 100,
        exceedsMax: maxDose ? dose > maxDose : false,
    };
}

export default calculateDose;
