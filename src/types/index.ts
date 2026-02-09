import { z } from 'zod';

// Species types supported by the application
export const SpeciesEnum = z.enum([
    'canine',
    'feline',
    'equine',
    'bovine',
    'avian',
    'reptile',
    'exotic'
]);
export type Species = z.infer<typeof SpeciesEnum>;

// Sex types
export const SexEnum = z.enum(['male', 'female', 'unknown']);
export type Sex = z.infer<typeof SexEnum>;

// Drug route of administration
export const RouteEnum = z.enum([
    'oral',
    'intravenous',
    'intramuscular',
    'subcutaneous',
    'topical',
    'ophthalmic',
    'otic',
    'intranasal',
    'rectal',
    'transdermal'
]);
export type Route = z.infer<typeof RouteEnum>;

// Drug categories
export const DrugCategoryEnum = z.enum([
    'antibiotic',
    'antifungal',
    'antiviral',
    'analgesic',
    'antiinflammatory',
    'sedative',
    'anesthetic',
    'antiemetic',
    'antiparasitic',
    'cardiovascular',
    'gastrointestinal',
    'endocrine',
    'immunosuppressive',
    'antidote',
    'other'
]);
export type DrugCategory = z.infer<typeof DrugCategoryEnum>;

// Safety level for calculations
export const SafetyLevelEnum = z.enum(['safe', 'caution', 'danger', 'critical']);
export type SafetyLevel = z.infer<typeof SafetyLevelEnum>;

// Weight record within patient history
export const WeightRecordSchema = z.object({
    weight: z.number().positive(),
    unit: z.enum(['kg', 'lbs']),
    date: z.string().datetime(),
    bcs: z.number().min(1).max(9).optional()
});
export type WeightRecord = z.infer<typeof WeightRecordSchema>;

// Patient schema
export const PatientSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    ownerName: z.string().min(1),
    ownerPhone: z.string().optional(),
    species: SpeciesEnum,
    breed: z.string(),
    dateOfBirth: z.string().datetime().optional(),
    sex: SexEnum,
    neutered: z.boolean(),
    microchipNumber: z.string().optional(),
    weightHistory: z.array(WeightRecordSchema),
    allergies: z.array(z.string()),
    conditions: z.array(z.string()),
    currentMedications: z.array(z.string()),
    photos: z.array(z.string()), // file paths
    notes: z.string().optional(),
    isDeleted: z.boolean().default(false),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
});
export type Patient = z.infer<typeof PatientSchema>;

// Drug dosage per species
export const DosageSchema = z.object({
    species: SpeciesEnum,
    minDose: z.number().positive(),
    maxDose: z.number().positive(),
    unit: z.enum(['mg/kg', 'mg/m2', 'mcg/kg', 'IU/kg']),
    frequency: z.string(), // e.g., "q12h", "q24h", "BID", "TID"
    route: RouteEnum,
    indication: z.string().optional(),
    duration: z.string().optional(),
    notes: z.string().optional()
});
export type Dosage = z.infer<typeof DosageSchema>;

// Drug schema
export const DrugSchema = z.object({
    id: z.string().uuid(),
    genericName: z.string(),
    brandNames: z.array(z.string()),
    category: DrugCategoryEnum,
    description: z.string().optional(),
    dosages: z.array(DosageSchema),
    contraindications: z.array(z.string()),
    sideEffects: z.array(z.string()),
    interactions: z.array(z.string()), // IDs of interacting drugs
    monitoringParameters: z.array(z.string()).optional(),
    withdrawalTimes: z.record(z.string(), z.string()).optional(), // species -> withdrawal time
    isHighRisk: z.boolean().default(false),
    mdr1Sensitive: z.boolean().default(false), // For breeds with MDR1 mutation
    concentrations: z.array(z.object({
        strength: z.string(),
        volume: z.string().optional()
    })).optional()
});
export type Drug = z.infer<typeof DrugSchema>;

// Calculation result
export const CalculationResultSchema = z.object({
    id: z.string().uuid(),
    patientId: z.string().uuid().optional(),
    patientName: z.string().optional(),
    species: SpeciesEnum,
    weight: z.number().positive(),
    weightUnit: z.enum(['kg', 'lbs']),
    bcs: z.number().min(1).max(9).optional(),
    drugId: z.string().uuid(),
    drugName: z.string(),
    indication: z.string().optional(),
    route: RouteEnum,
    dosePerKg: z.number().positive(),
    totalDose: z.number().positive(),
    doseUnit: z.string(),
    volume: z.number().positive().optional(),
    volumeUnit: z.string().optional(),
    concentration: z.string().optional(),
    frequency: z.string(),
    safetyLevel: SafetyLevelEnum,
    warnings: z.array(z.string()),
    interactions: z.array(z.string()),
    calculatedAt: z.string().datetime(),
    acknowledgedWarnings: z.boolean().default(false),
    calculatedBy: z.string().optional() // For audit trail
});
export type CalculationResult = z.infer<typeof CalculationResultSchema>;

// Toxicity calculation input
export const ToxicityInputSchema = z.object({
    toxinName: z.string(),
    amountIngested: z.number().positive(),
    amountUnit: z.string(),
    patientWeight: z.number().positive(),
    weightUnit: z.enum(['kg', 'lbs']),
    species: SpeciesEnum,
    timeSinceIngestion: z.number().nonnegative().optional(), // minutes
});
export type ToxicityInput = z.infer<typeof ToxicityInputSchema>;

// Toxicity result
export const ToxicityResultSchema = z.object({
    toxinName: z.string(),
    doseReceived: z.number(),
    doseUnit: z.string(),
    toxicDoseThreshold: z.number(),
    percentageOfToxicDose: z.number(),
    severity: SafetyLevelEnum,
    symptoms: z.array(z.string()),
    decontaminationProtocol: z.array(z.string()),
    antidote: z.string().optional(),
    antidoteDose: z.string().optional(),
    monitoring: z.array(z.string()),
    seekEmergencyCare: z.boolean()
});
export type ToxicityResult = z.infer<typeof ToxicityResultSchema>;

// Sync status for offline operations
export const SyncStatusEnum = z.enum(['pending', 'syncing', 'synced', 'failed']);
export type SyncStatus = z.infer<typeof SyncStatusEnum>;

// Pending sync item
export const PendingSyncSchema = z.object({
    id: z.string().uuid(),
    entityType: z.enum(['patient', 'calculation', 'photo']),
    entityId: z.string().uuid(),
    operation: z.enum(['create', 'update', 'delete']),
    data: z.any(),
    createdAt: z.string().datetime(),
    retryCount: z.number().default(0),
    lastError: z.string().optional()
});
export type PendingSync = z.infer<typeof PendingSyncSchema>;

// App settings
export const AppSettingsSchema = z.object({
    defaultWeightUnit: z.enum(['kg', 'lbs']).default('kg'),
    defaultSpecies: SpeciesEnum.optional(),
    darkMode: z.boolean().default(false),
    hapticFeedback: z.boolean().default(true),
    highContrastMode: z.boolean().default(false),
    autoSaveCalculations: z.boolean().default(true),
    showSafetyWarnings: z.boolean().default(true),
    requireConfirmationForHighRisk: z.boolean().default(true)
});
export type AppSettings = z.infer<typeof AppSettingsSchema>;
