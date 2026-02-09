/**
 * Drug Seed Data
 * Initial veterinary drug database
 * Sourced from common veterinary medications
 */
import type { Database } from '@nozbe/watermelondb';

interface DrugSeed {
    // Existing fields
    genericName: string;
    brandNames: string[];
    category: string;
    drugClass?: string;
    description?: string;
    isControlled: boolean;
    isHighRisk: boolean;
    mdr1Sensitive: boolean;
    pregnancyRisk?: string;

    // NEW FIELDS
    isEmergency?: boolean;
    reversalAgent?: string;
    antidote?: boolean;
    speciesSpecific?: boolean;
    requiresDilution?: boolean;
    refrigerate?: boolean;
    maxDoseCritical?: boolean;
    withdrawalTime?: boolean;
    compounded?: boolean;
    perivascularNecrosis?: boolean;
    felineToxic?: boolean;
    reptileToxicity?: boolean;
    cardiacMonitor?: boolean;
    histamineRelease?: boolean;
    cartilageRisk?: boolean;
    timing?: string;
    monitoring?: string[];
    toxicity?: any;
    interactions?: any[];
    contraindications?: any[];

    dosages: Array<{
        species: string;
        indication: string;
        route: string;
        doseLow: number;
        doseHigh: number;
        doseUnit: string;
        frequency: string;
        duration?: string;
        maxDose?: number;
        safetyLevel: string;
        notes?: string;
        // NEW dosage fields
        cr?: boolean;
        loadingDose?: number;
        loadingDoseUnit?: string;
        compounded?: boolean;
    }>;
    formulations: Array<{
        form: string;
        concentration: number;
        concentrationUnit: string;
        packageSize?: string;
        notes?: string;
        // NEW formulation fields
        isDiluted?: boolean;
        dilutionInstructions?: string;
    }>;
}

// Common veterinary drugs database
export const DRUG_SEEDS: DrugSeed[] = [
    // ANTIBIOTICS
    {
        genericName: 'Amoxicillin',
        brandNames: ['Amoxi-Tabs', 'Amoxi-Drops', 'Biomox'],
        category: 'Antibiotic',
        drugClass: 'Beta-lactam',
        description: 'Broad-spectrum antibiotic effective against gram-positive and some gram-negative bacteria',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'General infection', route: 'PO', doseLow: 10, doseHigh: 25, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe' },
            { species: 'canine', indication: 'UTI', route: 'PO', doseLow: 15, doseHigh: 25, doseUnit: 'mg/kg', frequency: 'BID', duration: '7-14 days', safetyLevel: 'safe' },
            { species: 'feline', indication: 'General infection', route: 'PO', doseLow: 10, doseHigh: 25, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 100, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 250, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 500, concentrationUnit: 'mg/tablet' },
            { form: 'Liquid', concentration: 50, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Amoxicillin-Clavulanate',
        brandNames: ['Clavamox', 'Synulox', 'Augmentin'],
        category: 'Antibiotic',
        drugClass: 'Beta-lactam + Beta-lactamase inhibitor',
        description: 'Broad-spectrum antibiotic with beta-lactamase inhibitor for resistant infections',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Skin infection', route: 'PO', doseLow: 12.5, doseHigh: 25, doseUnit: 'mg/kg', frequency: 'BID', duration: '5-7 days', safetyLevel: 'safe' },
            { species: 'canine', indication: 'UTI', route: 'PO', doseLow: 12.5, doseHigh: 25, doseUnit: 'mg/kg', frequency: 'BID', duration: '10-14 days', safetyLevel: 'safe' },
            { species: 'feline', indication: 'General infection', route: 'PO', doseLow: 12.5, doseHigh: 25, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 62.5, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 125, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 250, concentrationUnit: 'mg/tablet' },
            { form: 'Liquid', concentration: 62.5, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Metronidazole',
        brandNames: ['Flagyl', 'Metrozole'],
        category: 'Antibiotic',
        drugClass: 'Nitroimidazole',
        description: 'Antibiotic and antiprotozoal for anaerobic infections and GI disorders',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Giardia', route: 'PO', doseLow: 15, doseHigh: 25, doseUnit: 'mg/kg', frequency: 'BID', duration: '5-7 days', safetyLevel: 'safe' },
            { species: 'canine', indication: 'Anaerobic infection', route: 'PO', doseLow: 10, doseHigh: 15, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe' },
            { species: 'canine', indication: 'IBD', route: 'PO', doseLow: 10, doseHigh: 15, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe', notes: 'May cause neurological signs at high doses' },
            { species: 'feline', indication: 'Giardia', route: 'PO', doseLow: 10, doseHigh: 25, doseUnit: 'mg/kg', frequency: 'BID', duration: '5-7 days', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 250, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 500, concentrationUnit: 'mg/tablet' },
            { form: 'Liquid', concentration: 50, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Doxycycline',
        brandNames: ['Vibramycin', 'Doxirobe'],
        category: 'Antibiotic',
        drugClass: 'Tetracycline',
        description: 'Broad-spectrum antibiotic effective against tick-borne diseases and respiratory infections',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Tick-borne disease', route: 'PO', doseLow: 5, doseHigh: 10, doseUnit: 'mg/kg', frequency: 'BID', duration: '28 days', safetyLevel: 'safe', notes: 'Give with food to prevent esophageal irritation' },
            { species: 'canine', indication: 'Respiratory infection', route: 'PO', doseLow: 5, doseHigh: 10, doseUnit: 'mg/kg', frequency: 'BID', duration: '7-14 days', safetyLevel: 'safe' },
            { species: 'feline', indication: 'Respiratory infection', route: 'PO', doseLow: 5, doseHigh: 10, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'caution', notes: 'ALWAYS follow with water or food to prevent esophageal stricture' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 100, concentrationUnit: 'mg/tablet' },
            { form: 'Capsule', concentration: 50, concentrationUnit: 'mg/capsule' },
            { form: 'Liquid', concentration: 10, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Enrofloxacin',
        brandNames: ['Baytril', 'Enroflox'],
        category: 'Antibiotic',
        drugClass: 'Fluoroquinolone',
        description: 'Broad-spectrum antibiotic for serious infections',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Serious infection', route: 'PO', doseLow: 5, doseHigh: 20, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'caution', notes: 'Avoid in growing dogs - may cause cartilage damage' },
            { species: 'feline', indication: 'Serious infection', route: 'PO', doseLow: 5, doseHigh: 5, doseUnit: 'mg/kg', frequency: 'SID', maxDose: 25, safetyLevel: 'caution', notes: 'MAX 5mg/kg - retinal toxicity risk at higher doses' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 22.7, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 68, concentrationUnit: 'mg/tablet' },
            { form: 'Injectable', concentration: 22.7, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Cephalexin',
        brandNames: ['Keflex', 'Rilexine'],
        category: 'Antibiotic',
        drugClass: 'First-generation cephalosporin',
        description: 'Antibiotic effective against gram-positive bacteria, commonly used for skin infections',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Skin infection', route: 'PO', doseLow: 22, doseHigh: 30, doseUnit: 'mg/kg', frequency: 'BID', duration: '21-28 days', safetyLevel: 'safe' },
            { species: 'canine', indication: 'UTI', route: 'PO', doseLow: 22, doseHigh: 30, doseUnit: 'mg/kg', frequency: 'BID', duration: '14 days', safetyLevel: 'safe' },
            { species: 'feline', indication: 'Skin infection', route: 'PO', doseLow: 22, doseHigh: 30, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Capsule', concentration: 250, concentrationUnit: 'mg/capsule' },
            { form: 'Capsule', concentration: 500, concentrationUnit: 'mg/capsule' },
            { form: 'Liquid', concentration: 50, concentrationUnit: 'mg/ml' },
        ],
    },

    // NSAIDs
    {
        genericName: 'Carprofen',
        brandNames: ['Rimadyl', 'Novox', 'Vetprofen'],
        category: 'NSAID',
        drugClass: 'Propionic acid derivative',
        description: 'Non-steroidal anti-inflammatory for pain and inflammation',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Pain/Inflammation', route: 'PO', doseLow: 2, doseHigh: 4, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'caution', notes: 'Monitor liver enzymes with long-term use. Give with food.' },
            { species: 'canine', indication: 'Post-operative pain', route: 'SC', doseLow: 4, doseHigh: 4, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'caution' },
        ],
        formulations: [
            { form: 'Chewable', concentration: 25, concentrationUnit: 'mg/tablet' },
            { form: 'Chewable', concentration: 75, concentrationUnit: 'mg/tablet' },
            { form: 'Chewable', concentration: 100, concentrationUnit: 'mg/tablet' },
            { form: 'Injectable', concentration: 50, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Meloxicam',
        brandNames: ['Metacam', 'Loxicom', 'OroCAM'],
        category: 'NSAID',
        drugClass: 'Oxicam',
        description: 'COX-2 preferential NSAID for pain and inflammation',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Pain/Inflammation', route: 'PO', doseLow: 0.1, doseHigh: 0.2, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'caution', notes: 'Loading dose 0.2mg/kg, then 0.1mg/kg daily' },
            { species: 'feline', indication: 'Pain', route: 'PO', doseLow: 0.05, doseHigh: 0.1, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'danger', notes: 'CATS: Single dose only. Chronic use associated with renal failure.' },
        ],
        formulations: [
            { form: 'Liquid', concentration: 1.5, concentrationUnit: 'mg/ml' },
            { form: 'Liquid', concentration: 0.5, concentrationUnit: 'mg/ml' },
            { form: 'Injectable', concentration: 5, concentrationUnit: 'mg/ml' },
        ],
    },

    // ANALGESICS
    {
        genericName: 'Gabapentin',
        brandNames: ['Neurontin', 'Gralise'],
        category: 'Analgesic',
        drugClass: 'GABA analog',
        description: 'Neuropathic pain medication and anxiolytic',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Chronic pain', route: 'PO', doseLow: 5, doseHigh: 10, doseUnit: 'mg/kg', frequency: 'TID', safetyLevel: 'safe', notes: 'May cause sedation initially' },
            { species: 'canine', indication: 'Neuropathic pain', route: 'PO', doseLow: 10, doseHigh: 20, doseUnit: 'mg/kg', frequency: 'TID', safetyLevel: 'safe' },
            { species: 'feline', indication: 'Pain/Anxiety', route: 'PO', doseLow: 5, doseHigh: 10, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe', notes: 'Commonly used pre-vet visit for anxiety' },
        ],
        formulations: [
            { form: 'Capsule', concentration: 100, concentrationUnit: 'mg/capsule' },
            { form: 'Capsule', concentration: 300, concentrationUnit: 'mg/capsule' },
            { form: 'Liquid', concentration: 50, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Tramadol',
        brandNames: ['Ultram'],
        category: 'Analgesic',
        drugClass: 'Opioid-like',
        description: 'Centrally acting analgesic for moderate pain',
        isControlled: true,
        isHighRisk: false,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Moderate pain', route: 'PO', doseLow: 2, doseHigh: 5, doseUnit: 'mg/kg', frequency: 'TID', safetyLevel: 'caution', notes: 'Variable efficacy in dogs. Consider as part of multimodal therapy.' },
            { species: 'feline', indication: 'Moderate pain', route: 'PO', doseLow: 1, doseHigh: 2, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe', notes: 'More effective in cats than dogs' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 50, concentrationUnit: 'mg/tablet' },
        ],
    },

    // CORTICOSTEROIDS
    {
        genericName: 'Prednisone',
        brandNames: ['Deltasone'],
        category: 'Corticosteroid',
        drugClass: 'Glucocorticoid',
        description: 'Anti-inflammatory and immunosuppressive corticosteroid',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Anti-inflammatory', route: 'PO', doseLow: 0.5, doseHigh: 1, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'caution', notes: 'Taper dose when discontinuing. PU/PD/PP expected.' },
            { species: 'canine', indication: 'Immunosuppression', route: 'PO', doseLow: 2, doseHigh: 4, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'caution', notes: 'Taper to lowest effective dose' },
            { species: 'feline', indication: 'Anti-inflammatory', route: 'PO', doseLow: 1, doseHigh: 2, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'caution', notes: 'Prednisolone preferred in cats due to better absorption' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 5, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 10, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 20, concentrationUnit: 'mg/tablet' },
        ],
    },
    {
        genericName: 'Dexamethasone',
        brandNames: ['Azium', 'Dexasone'],
        category: 'Corticosteroid',
        drugClass: 'Glucocorticoid',
        description: 'Potent, long-acting corticosteroid',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Shock/Emergency', route: 'IV', doseLow: 2, doseHigh: 4, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'caution' },
            { species: 'canine', indication: 'Anti-inflammatory', route: 'IM', doseLow: 0.1, doseHigh: 0.2, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'caution' },
            { species: 'feline', indication: 'Anti-inflammatory', route: 'IM', doseLow: 0.1, doseHigh: 0.2, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'caution' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 2, concentrationUnit: 'mg/ml' },
            { form: 'Injectable', concentration: 4, concentrationUnit: 'mg/ml' },
        ],
    },

    // SEDATIVES/ANESTHETICS
    {
        genericName: 'Acepromazine',
        brandNames: ['PromAce', 'Atravet'],
        category: 'Sedative',
        drugClass: 'Phenothiazine',
        description: 'Tranquilizer and pre-anesthetic',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: true,
        dosages: [
            { species: 'canine', indication: 'Sedation', route: 'IM', doseLow: 0.02, doseHigh: 0.1, doseUnit: 'mg/kg', frequency: 'single dose', maxDose: 3, safetyLevel: 'caution', notes: 'MDR1 sensitive breeds require reduced dose. Avoid in boxers (hypotension).' },
            { species: 'feline', indication: 'Sedation', route: 'IM', doseLow: 0.05, doseHigh: 0.1, doseUnit: 'mg/kg', frequency: 'single dose', maxDose: 1, safetyLevel: 'caution' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 10, concentrationUnit: 'mg/ml' },
            { form: 'Tablet', concentration: 10, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 25, concentrationUnit: 'mg/tablet' },
        ],
    },
    {
        genericName: 'Butorphanol',
        brandNames: ['Torbugesic', 'Torbutrol'],
        category: 'Analgesic',
        drugClass: 'Opioid agonist-antagonist',
        description: 'Opioid analgesic and antitussive',
        isControlled: true,
        isHighRisk: false,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Pain', route: 'IV', doseLow: 0.1, doseHigh: 0.4, doseUnit: 'mg/kg', frequency: 'q2-4h', safetyLevel: 'safe' },
            { species: 'canine', indication: 'Cough', route: 'PO', doseLow: 0.5, doseHigh: 1, doseUnit: 'mg/kg', frequency: 'TID', safetyLevel: 'safe' },
            { species: 'feline', indication: 'Pain', route: 'SC', doseLow: 0.2, doseHigh: 0.4, doseUnit: 'mg/kg', frequency: 'q4-6h', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 10, concentrationUnit: 'mg/ml' },
            { form: 'Tablet', concentration: 1, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 5, concentrationUnit: 'mg/tablet' },
        ],
    },

    // ANTIPARASITICS
    {
        genericName: 'Ivermectin',
        brandNames: ['Heartgard', 'Ivomec'],
        category: 'Antiparasitic',
        drugClass: 'Avermectin',
        description: 'Antiparasitic for heartworm prevention and various parasites',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: true,
        dosages: [
            { species: 'canine', indication: 'Heartworm prevention', route: 'PO', doseLow: 0.006, doseHigh: 0.006, doseUnit: 'mg/kg', frequency: 'monthly', safetyLevel: 'safe', notes: 'Safe in MDR1 dogs at preventive dose' },
            { species: 'canine', indication: 'Demodicosis', route: 'PO', doseLow: 0.3, doseHigh: 0.6, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'danger', notes: 'CONTRAINDICATED in MDR1 breeds! Use with extreme caution.' },
            { species: 'feline', indication: 'Ear mites', route: 'SC', doseLow: 0.2, doseHigh: 0.4, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'caution' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 68, concentrationUnit: 'mcg/tablet' },
            { form: 'Tablet', concentration: 136, concentrationUnit: 'mcg/tablet' },
            { form: 'Injectable', concentration: 10, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Fenbendazole',
        brandNames: ['Panacur', 'Safe-Guard'],
        category: 'Antiparasitic',
        drugClass: 'Benzimidazole',
        description: 'Broad-spectrum anthelmintic for intestinal parasites',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Intestinal parasites', route: 'PO', doseLow: 50, doseHigh: 50, doseUnit: 'mg/kg', frequency: 'SID', duration: '3-5 days', safetyLevel: 'safe' },
            { species: 'canine', indication: 'Giardia', route: 'PO', doseLow: 50, doseHigh: 50, doseUnit: 'mg/kg', frequency: 'SID', duration: '3-5 days', safetyLevel: 'safe' },
            { species: 'feline', indication: 'Intestinal parasites', route: 'PO', doseLow: 50, doseHigh: 50, doseUnit: 'mg/kg', frequency: 'SID', duration: '3-5 days', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Granules', concentration: 222, concentrationUnit: 'mg/g' },
            { form: 'Liquid', concentration: 100, concentrationUnit: 'mg/ml' },
        ],
    },

    // ANTIEMETICS
    {
        genericName: 'Maropitant',
        brandNames: ['Cerenia'],
        category: 'Antiemetic',
        drugClass: 'NK1 receptor antagonist',
        description: 'Antiemetic for acute vomiting and motion sickness',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Acute vomiting', route: 'SC', doseLow: 1, doseHigh: 1, doseUnit: 'mg/kg', frequency: 'SID', duration: 'up to 5 days', safetyLevel: 'safe' },
            { species: 'canine', indication: 'Motion sickness', route: 'PO', doseLow: 8, doseHigh: 8, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe', notes: 'Give 2 hours before travel. Min 16mg, max 160mg.' },
            { species: 'feline', indication: 'Acute vomiting', route: 'SC', doseLow: 1, doseHigh: 1, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 16, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 24, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 60, concentrationUnit: 'mg/tablet' },
            { form: 'Injectable', concentration: 10, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Ondansetron',
        brandNames: ['Zofran'],
        category: 'Antiemetic',
        drugClass: '5-HT3 antagonist',
        description: 'Antiemetic for chemotherapy-induced or severe vomiting',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Severe nausea', route: 'IV', doseLow: 0.1, doseHigh: 0.2, doseUnit: 'mg/kg', frequency: 'TID', safetyLevel: 'safe' },
            { species: 'feline', indication: 'Severe nausea', route: 'IV', doseLow: 0.1, doseHigh: 0.2, doseUnit: 'mg/kg', frequency: 'TID', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 4, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 8, concentrationUnit: 'mg/tablet' },
            { form: 'Injectable', concentration: 2, concentrationUnit: 'mg/ml' },
        ],
    },

    // CARDIAC
    {
        genericName: 'Furosemide',
        brandNames: ['Lasix', 'Salix'],
        category: 'Diuretic',
        drugClass: 'Loop diuretic',
        description: 'Loop diuretic for congestive heart failure and edema',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'CHF', route: 'PO', doseLow: 1, doseHigh: 4, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'caution', notes: 'Monitor electrolytes and renal function' },
            { species: 'canine', indication: 'Pulmonary edema', route: 'IV', doseLow: 2, doseHigh: 4, doseUnit: 'mg/kg', frequency: 'q1-2h', safetyLevel: 'caution', notes: 'Emergency use' },
            { species: 'feline', indication: 'CHF', route: 'PO', doseLow: 1, doseHigh: 2, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'caution' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 12.5, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 50, concentrationUnit: 'mg/tablet' },
            { form: 'Injectable', concentration: 50, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Pimobendan',
        brandNames: ['Vetmedin'],
        category: 'Cardiac',
        drugClass: 'Inodilator',
        description: 'Positive inotrope and vasodilator for congestive heart failure',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'CHF - DCM/MMVD', route: 'PO', doseLow: 0.25, doseHigh: 0.3, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'caution', notes: 'Give 1 hour before food. Do not crush chewable tablets.' },
        ],
        formulations: [
            { form: 'Chewable', concentration: 1.25, concentrationUnit: 'mg/tablet' },
            { form: 'Chewable', concentration: 2.5, concentrationUnit: 'mg/tablet' },
            { form: 'Chewable', concentration: 5, concentrationUnit: 'mg/tablet' },
        ],
    },

    // ANTIEPILEPTIC
    {
        genericName: 'Phenobarbital',
        brandNames: ['Luminal', 'Solfoton'],
        category: 'Antiepileptic',
        drugClass: 'Barbiturate',
        description: 'First-line anticonvulsant for seizure management',
        isControlled: true,
        isHighRisk: true,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Seizures', route: 'PO', doseLow: 2.5, doseHigh: 5, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'caution', notes: 'Monitor serum levels and liver enzymes. Target serum level 15-40 mcg/ml.' },
            { species: 'canine', indication: 'Status epilepticus', route: 'IV', doseLow: 2, doseHigh: 4, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'caution', notes: 'May repeat in 30 min. Max total 24mg/kg.' },
            { species: 'feline', indication: 'Seizures', route: 'PO', doseLow: 1, doseHigh: 2, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'caution' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 15, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 30, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 60, concentrationUnit: 'mg/tablet' },
            { form: 'Injectable', concentration: 130, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Levetiracetam',
        brandNames: ['Keppra'],
        category: 'Antiepileptic',
        drugClass: 'SV2A ligand',
        description: 'Anticonvulsant with few drug interactions',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Seizures', route: 'PO', doseLow: 20, doseHigh: 30, doseUnit: 'mg/kg', frequency: 'TID', safetyLevel: 'safe', notes: 'Often used as add-on therapy. Can use extended-release BID.' },
            { species: 'canine', indication: 'Cluster seizures', route: 'IV', doseLow: 30, doseHigh: 60, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe' },
            { species: 'feline', indication: 'Seizures', route: 'PO', doseLow: 20, doseHigh: 30, doseUnit: 'mg/kg', frequency: 'TID', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 250, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 500, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 750, concentrationUnit: 'mg/tablet' },
            { form: 'Liquid', concentration: 100, concentrationUnit: 'mg/ml' },
        ],
    },

    // MODULE 1: EMERGENCY & CRITICAL CARE
    {
        genericName: 'Epinephrine',
        brandNames: ['Adrenalin'],
        category: 'Emergency',
        drugClass: 'Adrenergic agonist',
        description: 'Sympathomimetic agent for anaphylaxis and CPR',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        isEmergency: true,
        dosages: [
            { species: 'canine', indication: 'Anaphylaxis', route: 'IV/IM', doseLow: 0.01, doseHigh: 0.1, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'danger' },
            { species: 'canine', indication: 'CPR', route: 'IC', doseLow: 0.01, doseHigh: 0.01, doseUnit: 'mg/kg', frequency: 'q3-5min', safetyLevel: 'danger' },
            { species: 'feline', indication: 'Anaphylaxis', route: 'IV', doseLow: 0.01, doseHigh: 0.1, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'danger', notes: 'Use cautiously' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 1, concentrationUnit: 'mg/ml', notes: '1:1000 solution' },
            { form: 'Injectable', concentration: 0.1, concentrationUnit: 'mg/ml', notes: '1:10,000 solution' },
        ],
    },
    {
        genericName: 'Atropine',
        brandNames: ['Atropine Sulfate'],
        category: 'Emergency',
        drugClass: 'Anticholinergic',
        description: 'For bradycardia and organophosphate toxicity',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        isEmergency: true,
        dosages: [
            { species: 'canine', indication: 'Bradycardia', route: 'IV/IM', doseLow: 0.02, doseHigh: 0.04, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'caution' },
            { species: 'canine', indication: 'Organophosphate toxicity', route: 'IV/IM', doseLow: 0.2, doseHigh: 0.5, doseUnit: 'mg/kg', frequency: 'to effect', safetyLevel: 'danger' },
            { species: 'feline', indication: 'Bradycardia', route: 'IV/IM', doseLow: 0.02, doseHigh: 0.04, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'caution' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 0.54, concentrationUnit: 'mg/ml' }, // Standard SA concentration
            { form: 'Injectable', concentration: 15, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Naloxone',
        brandNames: ['Narcan'],
        category: 'Emergency',
        drugClass: 'Opioid antagonist',
        description: 'Opioid reversal agent',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        isEmergency: true,
        reversalAgent: 'Opioids',
        dosages: [
            { species: 'canine', indication: 'Opioid reversal', route: 'IV/IM/SC', doseLow: 0.01, doseHigh: 0.04, doseUnit: 'mg/kg', frequency: 'to effect', safetyLevel: 'safe' },
            { species: 'feline', indication: 'Opioid reversal', route: 'IV/IM/SC', doseLow: 0.01, doseHigh: 0.04, doseUnit: 'mg/kg', frequency: 'to effect', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 0.4, concentrationUnit: 'mg/ml' },
            { form: 'Injectable', concentration: 1, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Dopamine',
        brandNames: ['Intropin'],
        category: 'Emergency',
        drugClass: 'Catecholamine',
        description: 'For shock and hypotension',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        isEmergency: true,
        requiresDilution: true,
        dosages: [
            { species: 'canine', indication: 'Hypotension', route: 'IV', doseLow: 2, doseHigh: 20, doseUnit: 'mcg/kg/min', frequency: 'CRI', safetyLevel: 'danger', cr: true, notes: 'Start at 5 mcg/kg/min' },
            { species: 'feline', indication: 'Hypotension', route: 'IV', doseLow: 2, doseHigh: 10, doseUnit: 'mcg/kg/min', frequency: 'CRI', safetyLevel: 'danger', cr: true },
        ],
        formulations: [
            { form: 'Injectable', concentration: 40, concentrationUnit: 'mg/ml', isDiluted: false },
            { form: 'Injectable', concentration: 80, concentrationUnit: 'mg/ml', isDiluted: false },
        ],
    },
    {
        genericName: 'Dobutamine',
        brandNames: ['Dobutrex'],
        category: 'Emergency',
        drugClass: 'Beta-1 agonist',
        description: 'For cardiogenic shock',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        isEmergency: true,
        dosages: [
            { species: 'canine', indication: 'Cardiogenic shock', route: 'IV', doseLow: 2, doseHigh: 20, doseUnit: 'mcg/kg/min', frequency: 'CRI', safetyLevel: 'danger', cr: true },
            { species: 'feline', indication: 'Cardiogenic shock', route: 'IV', doseLow: 2, doseHigh: 10, doseUnit: 'mcg/kg/min', frequency: 'CRI', safetyLevel: 'danger', cr: true },
        ],
        formulations: [
            { form: 'Injectable', concentration: 12.5, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Lidocaine',
        brandNames: ['Xylocaine'],
        category: 'Emergency',
        drugClass: 'Antiarrhythmic / Local anesthetic',
        description: 'For ventricular arrhythmias and local anesthesia',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        isEmergency: true,
        felineToxic: true,
        dosages: [
            { species: 'canine', indication: 'Ventricular Arrhythmia', route: 'IV', doseLow: 2, doseHigh: 4, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'caution' },
            { species: 'canine', indication: 'Arrhythmia CRI', route: 'IV', doseLow: 25, doseHigh: 80, doseUnit: 'mcg/kg/min', frequency: 'CRI', safetyLevel: 'caution', cr: true },
            { species: 'canine', indication: 'Epidural', route: 'Epidural', doseLow: 1, doseHigh: 2, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'caution' },
            { species: 'feline', indication: 'Local block', route: 'Local', doseLow: 1, doseHigh: 2, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'danger', notes: 'AVOID IV use in cats - causes cardiac suppression/seizures. Use cautiously for local blocks.' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 20, concentrationUnit: 'mg/ml', notes: '2%' },
            { form: 'Injectable', concentration: 100, concentrationUnit: 'mg/ml', notes: '10%' },
        ],
    },
    {
        genericName: 'Sodium Bicarbonate',
        brandNames: ['Bicarb'],
        category: 'Emergency',
        drugClass: 'Alkalinizing agent',
        description: 'For metabolic acidosis and hyperkalemia',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        isEmergency: true,
        dosages: [
            { species: 'canine', indication: 'Metabolic acidosis', route: 'IV', doseLow: 1, doseHigh: 2, doseUnit: 'mEq/kg', frequency: 'single dose', safetyLevel: 'caution', notes: 'Give half dose slowly over 20 min. Or calculate: Base deficit x 0.3 x BW' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 1, concentrationUnit: 'mEq/ml', notes: '8.4% solution' },
        ],
    },
    {
        genericName: 'Calcium Gluconate',
        brandNames: [],
        category: 'Emergency',
        drugClass: 'Electrolyte',
        description: 'For hypocalcemia and hyperkalemia',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        isEmergency: true,
        cardiacMonitor: true,
        dosages: [
            { species: 'canine', indication: 'Hypocalcemia', route: 'IV', doseLow: 50, doseHigh: 150, doseUnit: 'mg/kg', frequency: 'slowly', safetyLevel: 'danger', notes: 'Give very slowly with ECG monitoring (bradycardia risk).' },
            { species: 'feline', indication: 'Hypocalcemia', route: 'IV', doseLow: 50, doseHigh: 100, doseUnit: 'mg/kg', frequency: 'slowly', safetyLevel: 'danger' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 100, concentrationUnit: 'mg/ml', notes: '10% solution' },
        ],
    },
    {
        genericName: 'Mannitol',
        brandNames: ['Osmitrol'],
        category: 'Emergency',
        drugClass: 'Osmotic diuretic',
        description: 'For cerebral edema and acute glaucoma',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        isEmergency: true,
        dosages: [
            { species: 'canine', indication: 'Cerebral edema', route: 'IV', doseLow: 0.5, doseHigh: 1.5, doseUnit: 'g/kg', frequency: 'over 20min', safetyLevel: 'caution', notes: 'Use with filter needle.' },
            { species: 'feline', indication: 'Cerebral edema', route: 'IV', doseLow: 0.5, doseHigh: 1, doseUnit: 'g/kg', frequency: 'over 20min', safetyLevel: 'caution' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 200, concentrationUnit: 'mg/ml', notes: '20%' },
            { form: 'Injectable', concentration: 250, concentrationUnit: 'mg/ml', notes: '25%' },
        ],
    },
    {
        genericName: 'Hydrogen Peroxide 3%',
        brandNames: [],
        category: 'Emergency',
        drugClass: 'Emetic',
        description: 'Induction of emesis in dogs',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        isEmergency: true,
        contraindications: [{ condition: 'Cats - Hemorrhagic gastritis', severity: 'absolute', species: ['feline'] }],
        dosages: [
            { species: 'canine', indication: 'Emesis', route: 'PO', doseLow: 1, doseHigh: 2, doseUnit: 'ml/kg', frequency: 'single dose', maxDose: 45, safetyLevel: 'caution', notes: 'May repeat once in 10 min. DO NOT USE IN CATS.' },
        ],
        formulations: [
            { form: 'Liquid', concentration: 1, concentrationUnit: 'ml/ml', notes: '3% Household grade' },
        ],
    },
    {
        genericName: 'Apomorphine',
        brandNames: ['Apokyn'],
        category: 'Emergency',
        drugClass: 'Emetic (Dopamine agonist)',
        description: 'Emetic of choice for dogs',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        isEmergency: true,
        dosages: [
            { species: 'canine', indication: 'Emesis', route: 'IV', doseLow: 0.03, doseHigh: 0.03, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe' },
            { species: 'canine', indication: 'Emesis', route: 'Conjunctival', doseLow: 0.25, doseHigh: 0.25, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe', notes: 'Rinse eye after vomiting occurs' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 6, concentrationUnit: 'mg/tablet' },
            { form: 'Injectable', concentration: 10, concentrationUnit: 'mg/ml' }, // Compounded often
        ],
    },
    {
        genericName: 'Yohimbine',
        brandNames: ['Yobine'],
        category: 'Emergency',
        drugClass: 'Alpha-2 antagonist',
        description: 'Reversal agent for xylazine',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        isEmergency: true,
        reversalAgent: 'Xylazine',
        dosages: [
            { species: 'canine', indication: 'Xylazine reversal', route: 'IV/IM', doseLow: 0.1, doseHigh: 0.2, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 2, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Flumazenil',
        brandNames: ['Romazicon'],
        category: 'Emergency',
        drugClass: 'Benzodiazepine antagonist',
        description: 'Reversal agent for benzodiazepines',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        isEmergency: true,
        reversalAgent: 'Benzodiazepines',
        dosages: [
            { species: 'canine', indication: 'Benzodiazepine reversal', route: 'IV', doseLow: 0.02, doseHigh: 0.1, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 0.1, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'N-acetylcysteine',
        brandNames: ['Mucomyst', 'Acetadote'],
        category: 'Emergency',
        drugClass: 'Antidote / Mucolytic',
        description: 'Antidote for acetaminophen toxicity',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        isEmergency: true,
        antidote: true,
        dosages: [
            { species: 'canine', indication: 'Acetaminophen toxicity', route: 'IV/PO', doseLow: 140, doseHigh: 140, doseUnit: 'mg/kg', frequency: 'loading', safetyLevel: 'safe', loadingDose: 140, loadingDoseUnit: 'mg/kg', notes: 'Then 70 mg/kg q6h for 7 treatments' },
            { species: 'feline', indication: 'Acetaminophen toxicity', route: 'IV/PO', doseLow: 140, doseHigh: 140, doseUnit: 'mg/kg', frequency: 'loading', safetyLevel: 'safe', loadingDose: 140, loadingDoseUnit: 'mg/kg', notes: 'Then 70 mg/kg q6h for 7 treatments' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 200, concentrationUnit: 'mg/ml', notes: '20% solution. Dilute to 5%.' },
        ],
    },
    {
        genericName: 'Vitamin K1',
        brandNames: ['Veta-K1', 'Mephyton'],
        category: 'Emergency',
        drugClass: 'Vitamin',
        description: 'Antidote for anticoagulant rodenticide toxicity',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        isEmergency: true,
        antidote: true,
        dosages: [
            { species: 'canine', indication: 'Rodenticide toxicity', route: 'PO', doseLow: 2.5, doseHigh: 5, doseUnit: 'mg/kg', frequency: 'loading', safetyLevel: 'safe', loadingDose: 5, loadingDoseUnit: 'mg/kg', notes: 'Maintenance 2.5 mg/kg divided BID for 21-30 days. Give with fatty food.' },
            { species: 'feline', indication: 'Rodenticide toxicity', route: 'PO', doseLow: 2.5, doseHigh: 5, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 25, concentrationUnit: 'mg/tablet' },
            { form: 'Injectable', concentration: 50, concentrationUnit: 'mg/ml', notes: 'Give PO or SQ. IV causes anaphylaxis.' },
        ],
    },

    // MODULE 2: ANESTHESIA & ANALGESIA
    {
        genericName: 'Propofol',
        brandNames: ['Propoflo', 'Rapinovet'],
        category: 'Anesthetic',
        drugClass: 'Hypnotic',
        description: 'Short-acting intravenous anesthetic agent',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        perivascularNecrosis: true,
        dosages: [
            { species: 'canine', indication: 'Induction', route: 'IV', doseLow: 2, doseHigh: 8, doseUnit: 'mg/kg', frequency: 'to effect', safetyLevel: 'caution', notes: 'Given slowly to effect. Apnea common.' },
            { species: 'feline', indication: 'Induction', route: 'IV', doseLow: 3, doseHigh: 8, doseUnit: 'mg/kg', frequency: 'to effect', safetyLevel: 'caution', notes: 'Heinz body anemia with repeated use in cats.' },
            { species: 'canine', indication: 'CRI Anesthesia', route: 'IV', doseLow: 0.1, doseHigh: 0.4, doseUnit: 'mg/kg/min', frequency: 'CRI', safetyLevel: 'caution', cr: true },
        ],
        formulations: [
            { form: 'Injectable', concentration: 10, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Ketamine',
        brandNames: ['Ketaset', 'Vetalar'],
        category: 'Anesthetic',
        drugClass: 'Dissociative',
        description: 'Dissociative anesthetic usually combined with benzodiazepine',
        isControlled: true,
        isHighRisk: true,
        mdr1Sensitive: false,
        contraindications: [{ condition: 'Elevated IOP / Glaucoma', severity: 'absolute' }, { condition: 'Seizure history', severity: 'relative' }],
        dosages: [
            { species: 'canine', indication: 'Induction (with diazepam)', route: 'IV', doseLow: 2, doseHigh: 5, doseUnit: 'mg/kg', frequency: 'to effect', safetyLevel: 'caution' },
            { species: 'feline', indication: 'Induction (with midazolam)', route: 'IV', doseLow: 5, doseHigh: 10, doseUnit: 'mg/kg', frequency: 'to effect', safetyLevel: 'caution' },
            { species: 'feline', indication: 'Chemical Restraint (with dexmed)', route: 'IM', doseLow: 5, doseHigh: 10, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 100, concentrationUnit: 'mg/ml' },
            { form: 'Injectable', concentration: 50, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Midazolam',
        brandNames: ['Versed'],
        category: 'Sedative',
        drugClass: 'Benzodiazepine',
        description: 'Pre-anesthetic sedative and muscle relaxant',
        isControlled: true,
        isHighRisk: false,
        mdr1Sensitive: false,
        reversalAgent: 'Flumazenil',
        dosages: [
            { species: 'canine', indication: 'Premedication', route: 'IV/IM', doseLow: 0.2, doseHigh: 0.4, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe' },
            { species: 'feline', indication: 'Premedication', route: 'IM', doseLow: 0.2, doseHigh: 0.4, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe', notes: 'Can cause excitement in healthy cats' },
            { species: 'canine', indication: 'Seizure control', route: 'IV', doseLow: 0.2, doseHigh: 0.5, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 1, concentrationUnit: 'mg/ml' },
            { form: 'Injectable', concentration: 5, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Dexmedetomidine',
        brandNames: ['Dexdomitor'],
        category: 'Sedative',
        drugClass: 'Alpha-2 agonist',
        description: 'Sedative, analgesic, and pre-anesthetic',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        reversalAgent: 'Atipamezole',
        dosages: [
            { species: 'canine', indication: 'Sedation', route: 'IV/IM', doseLow: 0.005, doseHigh: 0.02, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'caution', notes: '5-20 mcg/kg. Cardiovascular depression expected.' },
            { species: 'feline', indication: 'Sedation', route: 'IM', doseLow: 0.01, doseHigh: 0.04, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'caution', notes: '10-40 mcg/kg' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 0.5, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Atipamezole',
        brandNames: ['Antisedan'],
        category: 'Sedative',
        drugClass: 'Alpha-2 antagonist',
        description: 'Reversal agent for dexmedetomidine',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        reversalAgent: 'Dexmedetomidine',
        dosages: [
            { species: 'canine', indication: 'Reversal', route: 'IM', doseLow: 0.05, doseHigh: 0.2, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe', notes: 'Dose is same volume as Dexdomitor used (5x concentration)' },
            { species: 'feline', indication: 'Reversal', route: 'IM', doseLow: 0.05, doseHigh: 0.2, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 5, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Bupivacaine',
        brandNames: ['Marcaine', 'Sensorcaine'],
        category: 'Anesthetic',
        drugClass: 'Local anesthetic',
        description: 'Long-acting local anesthetic',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        maxDoseCritical: true,
        dosages: [
            { species: 'canine', indication: 'Local block', route: 'Infiltration', doseLow: 1, doseHigh: 2, doseUnit: 'mg/kg', frequency: 'single dose', maxDose: 2, safetyLevel: 'danger', notes: 'Never give IV (cardiotoxic).' },
            { species: 'feline', indication: 'Local block', route: 'Infiltration', doseLow: 1, doseHigh: 2, doseUnit: 'mg/kg', frequency: 'single dose', maxDose: 2, safetyLevel: 'danger', notes: 'Safer than lidocaine in cats, but still toxic IV.' },
            { species: 'canine', indication: 'Epidural', route: 'Epidural', doseLow: 0.3, doseHigh: 0.5, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'caution' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 2.5, concentrationUnit: 'mg/ml', notes: '0.25%' },
            { form: 'Injectable', concentration: 5, concentrationUnit: 'mg/ml', notes: '0.5%' },
        ],
    },
    {
        genericName: 'Hydromorphone',
        brandNames: ['Dilaudid'],
        category: 'Analgesic',
        drugClass: 'Opioid agonist',
        description: 'Potent opioid analgesic',
        isControlled: true,
        isHighRisk: true,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Pain / Premed', route: 'IV/IM/SC', doseLow: 0.05, doseHigh: 0.2, doseUnit: 'mg/kg', frequency: 'q4-6h', safetyLevel: 'caution', notes: 'Panting/nausea common' },
            { species: 'feline', indication: 'Pain / Premed', route: 'IM/SC', doseLow: 0.05, doseHigh: 0.1, doseUnit: 'mg/kg', frequency: 'q4-6h', safetyLevel: 'caution' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 2, concentrationUnit: 'mg/ml' },
            { form: 'Injectable', concentration: 10, concentrationUnit: 'mg/ml', notes: 'High potency' },
        ],
    },
    {
        genericName: 'Buprenorphine',
        brandNames: ['Buprenex', 'Simbadol'],
        category: 'Analgesic',
        drugClass: 'Opioid partial agonist',
        description: 'Analgesic for mild to moderate pain',
        isControlled: true,
        isHighRisk: false,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Pain', route: 'IV/IM', doseLow: 0.01, doseHigh: 0.03, doseUnit: 'mg/kg', frequency: 'q6-8h', safetyLevel: 'safe' },
            { species: 'feline', indication: 'Pain', route: 'IV/IM/OTM', doseLow: 0.01, doseHigh: 0.03, doseUnit: 'mg/kg', frequency: 'q6-8h', safetyLevel: 'safe', notes: 'Excellent oral transmucosal absorption in cats' },
            { species: 'feline', indication: 'Post-op Pain (Simbadol)', route: 'SC', doseLow: 0.24, doseHigh: 0.24, doseUnit: 'mg/kg', frequency: 'q24h', safetyLevel: 'safe', notes: 'Use Simbadol concentration 1.8mg/ml ONLY' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 0.3, concentrationUnit: 'mg/ml' },
            { form: 'Injectable', concentration: 1.8, concentrationUnit: 'mg/ml', notes: 'Simbadol' },
        ],
    },
    {
        genericName: 'Morphine',
        brandNames: ['Morphine Sulfate'],
        category: 'Analgesic',
        drugClass: 'Opioid agonist',
        description: 'Gold standard opioid analgesic',
        isControlled: true,
        isHighRisk: true,
        mdr1Sensitive: true,
        histamineRelease: true,
        dosages: [
            { species: 'canine', indication: 'Pain', route: 'IM/SC', doseLow: 0.5, doseHigh: 1, doseUnit: 'mg/kg', frequency: 'q4-6h', safetyLevel: 'caution', notes: 'IV use causes histamine release/hypotension' },
            { species: 'feline', indication: 'Pain', route: 'IM/SC', doseLow: 0.1, doseHigh: 0.3, doseUnit: 'mg/kg', frequency: 'q4-6h', safetyLevel: 'caution', notes: 'Cats may become dysphoric' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 10, concentrationUnit: 'mg/ml' },
            { form: 'Injectable', concentration: 15, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Fentanyl',
        brandNames: ['Sublimaze'],
        category: 'Analgesic',
        drugClass: 'Opioid agonist',
        description: 'Potent, short-acting opioid',
        isControlled: true,
        isHighRisk: true,
        mdr1Sensitive: true,
        dosages: [
            { species: 'canine', indication: 'Pain CRI', route: 'IV', doseLow: 2, doseHigh: 10, doseUnit: 'mcg/kg/h', frequency: 'CRI', safetyLevel: 'caution', cr: true, loadingDose: 2, loadingDoseUnit: 'mcg/kg' },
            { species: 'feline', indication: 'Pain CRI', route: 'IV', doseLow: 1, doseHigh: 4, doseUnit: 'mcg/kg/h', frequency: 'CRI', safetyLevel: 'caution', cr: true },
        ],
        formulations: [
            { form: 'Injectable', concentration: 50, concentrationUnit: 'mcg/ml' },
        ],
    },
    {
        genericName: 'Lidocaine-Bupivacaine',
        brandNames: ['Lidocaine/Marcaine Mix'],
        category: 'Anesthetic',
        drugClass: 'Local anesthetic combo',
        description: 'Mixture for rapid onset and long duration',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        compounded: true,
        dosages: [
            { species: 'canine', indication: 'Local block', route: 'Infiltration', doseLow: 1, doseHigh: 2, doseUnit: 'mg/kg', frequency: 'single dose', maxDose: 2, safetyLevel: 'caution', notes: 'Total dose calculated based on Bupivacaine limit' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 1, concentrationUnit: 'ml/ml', notes: 'Mix 1:1 ratio immediately before use' },
        ],
    },
    {
        genericName: 'Alfaxalone',
        brandNames: ['Alfaxan'],
        category: 'Anesthetic',
        drugClass: 'Neuroactive steroid',
        description: 'Induction agent with minimal cardiovascular effects',
        isControlled: true,
        isHighRisk: true,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Induction', route: 'IV', doseLow: 2, doseHigh: 3, doseUnit: 'mg/kg', frequency: 'to effect', safetyLevel: 'safe', notes: 'Give slowly' },
            { species: 'feline', indication: 'Induction', route: 'IV', doseLow: 2, doseHigh: 5, doseUnit: 'mg/kg', frequency: 'to effect', safetyLevel: 'safe' },
            { species: 'feline', indication: 'Sedation (IM)', route: 'IM', doseLow: 2, doseHigh: 5, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 10, concentrationUnit: 'mg/ml' },
        ],
    },

    // MODULE 3: ENDOCRINE & METABOLIC
    {
        genericName: 'Insulin (Regular)',
        brandNames: ['Humulin R', 'Novolin R'],
        category: 'Endocrine',
        drugClass: 'Insulin (Short-acting)',
        description: 'Short-acting insulin for DKA and emergency hyperglycemia',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        refrigerate: true,
        isEmergency: true,
        dosages: [
            { species: 'canine', indication: 'DKA', route: 'IV/IM', doseLow: 0.2, doseHigh: 0.2, doseUnit: 'U/kg', frequency: 'single dose', safetyLevel: 'danger', notes: 'Follow with CRI 0.05-0.1 U/kg/h' },
            { species: 'feline', indication: 'DKA', route: 'IM', doseLow: 0.2, doseHigh: 0.2, doseUnit: 'U/kg', frequency: 'single dose', safetyLevel: 'danger' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 100, concentrationUnit: 'U/ml', notes: 'U-100' },
        ],
    },
    {
        genericName: 'Insulin (NPH)',
        brandNames: ['Humulin N', 'Novolin N'],
        category: 'Endocrine',
        drugClass: 'Insulin (Intermediate)',
        description: 'Intermediate-acting insulin for maintenance',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        refrigerate: true,
        dosages: [
            { species: 'canine', indication: 'Diabetes Mellitus', route: 'SC', doseLow: 0.25, doseHigh: 0.5, doseUnit: 'U/kg', frequency: 'BID', safetyLevel: 'caution', notes: 'Start low' },
            { species: 'feline', indication: 'Diabetes Mellitus', route: 'SC', doseLow: 1, doseHigh: 1, doseUnit: 'U/cat', frequency: 'BID', safetyLevel: 'caution', notes: 'Not first choice for cats' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 100, concentrationUnit: 'U/ml', notes: 'U-100' },
        ],
    },
    {
        genericName: 'Insulin (Glargine)',
        brandNames: ['Lantus', 'Basaglar'],
        category: 'Endocrine',
        drugClass: 'Insulin (Long-acting)',
        description: 'Long-acting insulin, preferred for cats',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        refrigerate: true,
        dosages: [
            { species: 'feline', indication: 'Diabetes Mellitus', route: 'SC', doseLow: 0.25, doseHigh: 0.5, doseUnit: 'U/kg', frequency: 'BID', safetyLevel: 'safe', notes: 'Ideal start 0.25-0.5 U/kg or 1 U/cat' },
            { species: 'canine', indication: 'Diabetes Mellitus', route: 'SC', doseLow: 0.5, doseHigh: 0.5, doseUnit: 'U/kg', frequency: 'BID', safetyLevel: 'caution' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 100, concentrationUnit: 'U/ml', notes: 'U-100' },
        ],
    },
    {
        genericName: 'Insulin (Detemir)',
        brandNames: ['Levemir'],
        category: 'Endocrine',
        drugClass: 'Insulin (Long-acting)',
        description: 'Long-acting insulin',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        refrigerate: true,
        dosages: [
            { species: 'canine', indication: 'Diabetes Mellitus', route: 'SC', doseLow: 0.1, doseHigh: 0.2, doseUnit: 'U/kg', frequency: 'BID', safetyLevel: 'caution', notes: 'More potent in dogs than Glargine' },
            { species: 'feline', indication: 'Diabetes Mellitus', route: 'SC', doseLow: 0.5, doseHigh: 1, doseUnit: 'U/cat', frequency: 'BID', safetyLevel: 'caution' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 100, concentrationUnit: 'U/ml', notes: 'U-100' },
        ],
    },
    {
        genericName: 'Methimazole',
        brandNames: ['Felimazole', 'Tapazole'],
        category: 'Endocrine',
        drugClass: 'Antithyroid agent',
        description: 'Treatment for feline hyperthyroidism',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        monitoring: ['CBC', 'Liver Enzymes', 'T4', 'Renal Function'],
        dosages: [
            { species: 'feline', indication: 'Hyperthyroidism', route: 'PO', doseLow: 2.5, doseHigh: 5, doseUnit: 'mg/cat', frequency: 'BID', safetyLevel: 'caution', notes: 'Start 2.5mg BID or 5mg daily' },
            { species: 'feline', indication: 'Hyperthyroidism', route: 'Transdermal', doseLow: 2.5, doseHigh: 5, doseUnit: 'mg/cat', frequency: 'BID', safetyLevel: 'caution', compounded: true },
        ],
        formulations: [
            { form: 'Tablet', concentration: 2.5, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 5, concentrationUnit: 'mg/tablet' },
            { form: 'Liquid', concentration: 5, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Levothyroxine',
        brandNames: ['Thyro-Tabs', 'Soloxine'],
        category: 'Endocrine',
        drugClass: 'Thyroid hormone',
        description: 'Treatment for hypothyroidism',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        monitoring: ['T4'],
        dosages: [
            { species: 'canine', indication: 'Hypothyroidism', route: 'PO', doseLow: 0.02, doseHigh: 0.02, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe', notes: '0.1 mg per 10 lb is common rule of thumb' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 0.1, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 0.2, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 0.3, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 0.4, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 0.5, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 0.6, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 0.7, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 0.8, concentrationUnit: 'mg/tablet' },
        ],
    },
    {
        genericName: 'Prednisolone',
        brandNames: ['PrednisTab'],
        category: 'Corticosteroid',
        drugClass: 'Glucocorticoid',
        description: 'Bioactive corticosteroid, preferred for cats',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        dosages: [
            { species: 'feline', indication: 'Anti-inflammatory', route: 'PO', doseLow: 1, doseHigh: 2, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'caution' },
            { species: 'feline', indication: 'Immunosuppression', route: 'PO', doseLow: 2, doseHigh: 4, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'caution' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 5, concentrationUnit: 'mg/tablet' },
            { form: 'Liquid', concentration: 3, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Desmopressin',
        brandNames: ['DDAVP'],
        category: 'Endocrine',
        drugClass: 'Vasopressin analog',
        description: 'For Diabetes Insipidus and von Willebrand Disease',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Central Diabetes Insipidus', route: 'Conjunctival', doseLow: 1, doseHigh: 4, doseUnit: 'drops', frequency: 'BID', safetyLevel: 'safe' },
            { species: 'canine', indication: 'von Willebrand Disease', route: 'SC', doseLow: 1, doseHigh: 1, doseUnit: 'mcg/kg', frequency: '30 min pre-op', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 4, concentrationUnit: 'mcg/ml' },
            { form: 'Nasal Spray', concentration: 100, concentrationUnit: 'mcg/ml', notes: '0.1 mg/ml' },
        ],
    },

    // MODULE 4: EXOTIC SPECIES
    {
        genericName: 'Enrofloxacin (Exotic)',
        brandNames: ['Baytril'],
        category: 'Antibiotic',
        drugClass: 'Fluoroquinolone',
        description: 'Antibiotic for exotics',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        speciesSpecific: true,
        dosages: [
            { species: 'rabbit', indication: 'Infection', route: 'PO/SC', doseLow: 5, doseHigh: 15, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe' },
            { species: 'bird', indication: 'Infection', route: 'PO', doseLow: 15, doseHigh: 30, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe' },
            { species: 'reptile', indication: 'Infection', route: 'PO/IM/SC', doseLow: 5, doseHigh: 10, doseUnit: 'mg/kg', frequency: 'q24-48h', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 22.7, concentrationUnit: 'mg/tablet' },
            { form: 'Injectable', concentration: 22.7, concentrationUnit: 'mg/ml' },
            { form: 'Liquid', concentration: 10, concentrationUnit: 'mg/ml' }, // Diluted often
        ],
    },
    {
        genericName: 'Meloxicam (Exotic)',
        brandNames: ['Metacam'],
        category: 'NSAID',
        drugClass: 'NSAID',
        description: 'Analgesic for exotics',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        speciesSpecific: true,
        dosages: [
            { species: 'rabbit', indication: 'Pain', route: 'PO/SC', doseLow: 0.3, doseHigh: 0.6, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'safe', notes: 'Require higher doses than dogs/cats' },
            { species: 'bird', indication: 'Pain', route: 'PO/IM', doseLow: 0.5, doseHigh: 1, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe' },
            { species: 'reptile', indication: 'Pain', route: 'SC/IM', doseLow: 0.2, doseHigh: 0.5, doseUnit: 'mg/kg', frequency: 'qa24-48h', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Liquid', concentration: 1.5, concentrationUnit: 'mg/ml' },
            { form: 'Liquid', concentration: 0.5, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Midazolam (Exotic)',
        brandNames: ['Versed'],
        category: 'Sedative',
        drugClass: 'Benzodiazepine',
        description: 'Sedation for exotics',
        isControlled: true,
        isHighRisk: true,
        mdr1Sensitive: false,
        speciesSpecific: true,
        dosages: [
            { species: 'rabbit', indication: 'Sedation', route: 'IM', doseLow: 0.5, doseHigh: 2, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe' },
            { species: 'ferret', indication: 'Sedation', route: 'IM', doseLow: 0.5, doseHigh: 2, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 5, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Butorphanol (Exotic)',
        brandNames: ['Torbugesic'],
        category: 'Analgesic',
        drugClass: 'Opioid',
        description: 'Analgesia for exotics',
        isControlled: true,
        isHighRisk: false,
        mdr1Sensitive: false,
        speciesSpecific: true,
        dosages: [
            { species: 'rabbit', indication: 'Pain', route: 'SC/IM', doseLow: 0.5, doseHigh: 2, doseUnit: 'mg/kg', frequency: 'q4h', safetyLevel: 'safe' },
            { species: 'ferret', indication: 'Pain', route: 'SC/IM', doseLow: 0.5, doseHigh: 2, doseUnit: 'mg/kg', frequency: 'q4h', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 10, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Doxycycline (Bird)',
        brandNames: ['Vibramycin'],
        category: 'Antibiotic',
        drugClass: 'Tetracycline',
        description: 'Antibiotic for psittacosis',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        speciesSpecific: true,
        dosages: [
            { species: 'bird', indication: 'Infection', route: 'PO', doseLow: 25, doseHigh: 50, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Liquid', concentration: 10, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Ivermectin (Reptile)',
        brandNames: ['Ivomec'],
        category: 'Antiparasitic',
        drugClass: 'Avermectin',
        description: 'Parasite control for reptiles',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        speciesSpecific: true,
        reptileToxicity: true,
        dosages: [
            { species: 'reptile', indication: 'Mites', route: 'PO/SC/IM', doseLow: 0.2, doseHigh: 0.2, doseUnit: 'mg/kg', frequency: 'repeat in 14d', safetyLevel: 'caution', notes: 'TOXIC to chelonians (turtles/tortoises) and indigo snakes.' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 10, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Calcium Gluconate (Reptile)',
        brandNames: [],
        category: 'Emergency',
        drugClass: 'Electrolyte',
        description: 'For metabolic bone disease / egg binding',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        speciesSpecific: true,
        dosages: [
            { species: 'reptile', indication: 'Hypocalcemia', route: 'SC/IM', doseLow: 50, doseHigh: 100, doseUnit: 'mg/kg', frequency: 'q24h', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 100, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Fenbendazole (Exotic)',
        brandNames: ['Panacur'],
        category: 'Antiparasitic',
        drugClass: 'Benzimidazole',
        description: 'Antiparasitic for exotics',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        speciesSpecific: true,
        dosages: [
            { species: 'rabbit', indication: 'E. cuniculi', route: 'PO', doseLow: 20, doseHigh: 20, doseUnit: 'mg/kg', frequency: 'SID', duration: '28 days', safetyLevel: 'safe' },
            { species: 'reptile', indication: 'Parasites', route: 'PO', doseLow: 50, doseHigh: 100, doseUnit: 'mg/kg', frequency: 'repeat in 14d', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Liquid', concentration: 100, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Selamectin',
        brandNames: ['Revolution'],
        category: 'Antiparasitic',
        drugClass: 'Avermectin',
        description: 'Topical antiparasitic for small mammals',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        speciesSpecific: true,
        dosages: [
            { species: 'rabbit', indication: 'Mites', route: 'Topical', doseLow: 6, doseHigh: 18, doseUnit: 'mg/kg', frequency: 'monthly', safetyLevel: 'safe' },
            { species: 'guinea_pig', indication: 'Mites', route: 'Topical', doseLow: 6, doseHigh: 18, doseUnit: 'mg/kg', frequency: 'monthly', safetyLevel: 'safe' },
            { species: 'ferret', indication: 'Heartworm/Fleas', route: 'Topical', doseLow: 6, doseHigh: 18, doseUnit: 'mg/kg', frequency: 'monthly', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Topical', concentration: 60, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Oxytocin (Exotic)',
        brandNames: [],
        category: 'Reproductive',
        drugClass: 'Hormone',
        description: 'For egg binding (with calcium)',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        speciesSpecific: true,
        dosages: [
            { species: 'reptile', indication: 'Egg binding', route: 'IM', doseLow: 1, doseHigh: 10, doseUnit: 'IU/kg', frequency: 'single dose', safetyLevel: 'caution', notes: 'Must give Calcium first.' },
            { species: 'bird', indication: 'Egg binding', route: 'IM', doseLow: 1, doseHigh: 5, doseUnit: 'IU/kg', frequency: 'single dose', safetyLevel: 'caution' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 20, concentrationUnit: 'IU/ml' },
        ],
    },

    // MODULE 5: PRODUCTION ANIMALS
    {
        genericName: 'Florfenicol',
        brandNames: ['Nuflor'],
        category: 'Antibiotic',
        drugClass: 'Amphenicol',
        description: 'Antibiotic for respiratory disease in cattle',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        withdrawalTime: true,
        dosages: [
            { species: 'cattle', indication: 'BRD', route: 'SC', doseLow: 40, doseHigh: 40, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe', notes: 'Withdrawal: Meat 38 days' },
            { species: 'cattle', indication: 'BRD', route: 'IM', doseLow: 20, doseHigh: 20, doseUnit: 'mg/kg', frequency: 'q48h', safetyLevel: 'safe', notes: 'Withdrawal: Meat 28 days' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 300, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Tulathromycin',
        brandNames: ['Draxxin'],
        category: 'Antibiotic',
        drugClass: 'Macrolide',
        description: 'Long-acting antibiotic for BRD',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        withdrawalTime: true,
        dosages: [
            { species: 'cattle', indication: 'BRD', route: 'SC', doseLow: 2.5, doseHigh: 2.5, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe', notes: 'Withdrawal: Meat 18 days' },
            { species: 'swine', indication: 'Respiratory Disease', route: 'IM', doseLow: 2.5, doseHigh: 2.5, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe', notes: 'Withdrawal: Meat 5 days' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 100, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Flunixin Meglumine',
        brandNames: ['Banamine'],
        category: 'NSAID',
        drugClass: 'NSAID',
        description: 'Anti-inflammatory and analgesic',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        withdrawalTime: true,
        dosages: [
            { species: 'cattle', indication: 'Inflammation', route: 'IV/IM', doseLow: 1.1, doseHigh: 2.2, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'caution', notes: 'Withdrawal: Meat 4 days, Milk 36 hours' },
            { species: 'equine', indication: 'Colic', route: 'IV', doseLow: 1.1, doseHigh: 1.1, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 50, concentrationUnit: 'mg/ml' },
            { form: 'Paste', concentration: 1500, concentrationUnit: 'mg/syringe' },
        ],
    },
    {
        genericName: 'Oxytetracycline',
        brandNames: ['LA-200', 'Biomycin'],
        category: 'Antibiotic',
        drugClass: 'Tetracycline',
        description: 'Broad spectrum antibiotic',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        withdrawalTime: true,
        dosages: [
            { species: 'cattle', indication: 'Pneumonia', route: 'IM/SC', doseLow: 20, doseHigh: 20, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe', notes: 'Long acting. Withdrawal: Meat 28 days' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 200, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Ceftiofur Crystallic Free Acid',
        brandNames: ['Excede'],
        category: 'Antibiotic',
        drugClass: 'Cephalosporin (3rd gen)',
        description: 'Long-acting antibiotic',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        withdrawalTime: true,
        dosages: [
            { species: 'cattle', indication: 'BRD / Foot Rot', route: 'SC', doseLow: 6.6, doseHigh: 6.6, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe', notes: 'Base of ear injection. Withdrawal: Meat 13 days' },
            { species: 'swine', indication: 'Respiratory', route: 'IM', doseLow: 5, doseHigh: 5, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 100, concentrationUnit: 'mg/ml' }, // Sterile suspension
        ],
    },
    {
        genericName: 'Ivermectin (Production)',
        brandNames: ['Ivomec'],
        category: 'Antiparasitic',
        drugClass: 'Avermectin',
        description: 'Dewormer for cattle and swine',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        withdrawalTime: true,
        dosages: [
            { species: 'cattle', indication: 'Parasites', route: 'SC', doseLow: 0.2, doseHigh: 0.2, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe', notes: 'Withdrawal: Meat 35 days' },
            { species: 'swine', indication: 'Parasites', route: 'SC', doseLow: 0.3, doseHigh: 0.3, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 10, concentrationUnit: 'mg/ml', notes: '1%' },
            { form: 'Pour-on', concentration: 5, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Dexamethasone',
        brandNames: ['Azium'],
        category: 'Corticosteroid',
        drugClass: 'Glucocorticoid',
        description: 'Potent anti-inflammatory',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        withdrawalTime: true,
        dosages: [
            { species: 'cattle', indication: 'Ketosis', route: 'IM/IV', doseLow: 5, doseHigh: 20, doseUnit: 'mg/animal', frequency: 'single dose', safetyLevel: 'caution', notes: 'Can induce abortion in last trimester' },
            { species: 'equine', indication: 'Inflammation', route: 'IV/IM', doseLow: 0.05, doseHigh: 0.1, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'caution' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 2, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Phenylbutazone',
        brandNames: ['Bute'],
        category: 'NSAID',
        drugClass: 'NSAID',
        description: 'Musculoskeletal pain relief in horses',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        perivascularNecrosis: true,
        withdrawalTime: true,
        dosages: [
            { species: 'equine', indication: 'Musculoskeletal Pain', route: 'IV/PO', doseLow: 2.2, doseHigh: 4.4, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'caution', notes: 'Do not use in food producing animals (banned).' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 1000, concentrationUnit: 'mg/tablet', notes: '1 gram' },
            { form: 'Paste', concentration: 1, concentrationUnit: 'g/syringe' },
            { form: 'Injectable', concentration: 200, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Xylazine (Large Animal)',
        brandNames: ['Rompun'],
        category: 'Sedative',
        drugClass: 'Alpha-2 agonist',
        description: 'Sedative for large animals',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        withdrawalTime: true,
        dosages: [
            { species: 'cattle', indication: 'Sedation', route: 'IM', doseLow: 0.05, doseHigh: 0.1, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'danger', notes: 'Cattle are 10x more sensitive than horses.' },
            { species: 'equine', indication: 'Sedation', route: 'IV', doseLow: 0.5, doseHigh: 1.1, doseUnit: 'mg/kg', frequency: 'single dose', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 100, concentrationUnit: 'mg/ml' },
            { form: 'Injectable', concentration: 20, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Procaine Penicillin G',
        brandNames: ['Pen G'],
        category: 'Antibiotic',
        drugClass: 'Penicillin',
        description: 'Antibiotic for gram-positive infections',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        withdrawalTime: true,
        dosages: [
            { species: 'cattle', indication: 'Infection', route: 'IM', doseLow: 6600, doseHigh: 6600, doseUnit: 'U/kg', frequency: 'SID', safetyLevel: 'safe', notes: 'Withdrawal: Meat 10-14 days depending on brand' },
            { species: 'equine', indication: 'Infection', route: 'IM', doseLow: 22000, doseHigh: 22000, doseUnit: 'U/kg', frequency: 'BID', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Injectable', concentration: 300000, concentrationUnit: 'U/ml' },
        ],
    },

    // MODULE 6: ADDITIONAL SMALL ANIMAL DRUGS
    {
        genericName: 'Pimobendan',
        brandNames: ['Vetmedin'],
        category: 'Cardiac',
        drugClass: 'Inodilator',
        description: 'For CHF and DCM',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        timing: 'Give 1 hour before food',
        dosages: [
            { species: 'canine', indication: 'CHF', route: 'PO', doseLow: 0.25, doseHigh: 0.3, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe', notes: 'Target 0.5 mg/kg/day divided' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 1.25, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 2.5, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 5, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 10, concentrationUnit: 'mg/tablet' },
        ],
    },
    {
        genericName: 'Furosemide',
        brandNames: ['Lasix', 'Salix'],
        category: 'Cardiac',
        drugClass: 'Loop Diuretic',
        description: 'Diuretic for CHF and pulmonary edema',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        monitoring: ['Renal', 'Electrolytes'],
        dosages: [
            { species: 'canine', indication: 'CHF (Acute)', route: 'IV/IM', doseLow: 2, doseHigh: 4, doseUnit: 'mg/kg', frequency: 'q1-2h', safetyLevel: 'caution', notes: 'Titrate to effect' },
            { species: 'canine', indication: 'CHF (Maintenance)', route: 'PO', doseLow: 1, doseHigh: 4, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe' },
            { species: 'feline', indication: 'CHF (Acute)', route: 'IV/IM', doseLow: 1, doseHigh: 2, doseUnit: 'mg/kg', frequency: 'q1-2h', safetyLevel: 'caution' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 12.5, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 50, concentrationUnit: 'mg/tablet' },
            { form: 'Injectable', concentration: 50, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Spironolactone',
        brandNames: ['Aldactone'],
        category: 'Cardiac',
        drugClass: 'Aldosterone antagonist',
        description: 'Potassium-sparing diuretic',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'CHF', route: 'PO', doseLow: 1, doseHigh: 2, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 25, concentrationUnit: 'mg/tablet' },
        ],
    },
    {
        genericName: 'Benazepril',
        brandNames: ['Fortekor'],
        category: 'Cardiac',
        drugClass: 'ACE Inhibitor',
        description: 'For hypertension and proteinuria',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        monitoring: ['BP', 'Renal', 'Electrolytes'],
        dosages: [
            { species: 'canine', indication: 'Hypertension', route: 'PO', doseLow: 0.25, doseHigh: 0.5, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'safe' },
            { species: 'feline', indication: 'CKD Proteinuria', route: 'PO', doseLow: 0.5, doseHigh: 1, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 5, concentrationUnit: 'mg/tablet' },
        ],
    },
    {
        genericName: 'Amlodipine',
        brandNames: ['Norvasc'],
        category: 'Cardiac',
        drugClass: 'Calcium Channel Blocker',
        description: 'First line for feline hypertension',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        monitoring: ['BP'],
        dosages: [
            { species: 'feline', indication: 'Hypertension', route: 'PO', doseLow: 0.625, doseHigh: 1.25, doseUnit: 'mg/cat', frequency: 'SID', safetyLevel: 'safe' },
            { species: 'canine', indication: 'Hypertension', route: 'PO', doseLow: 0.1, doseHigh: 0.2, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 2.5, concentrationUnit: 'mg/tablet' },
        ],
    },
    {
        genericName: 'Maropitant',
        brandNames: ['Cerenia'],
        category: 'Gastrointestinal',
        drugClass: 'NK1 Receptor Antagonist',
        description: 'Antiemetic and visceral analgesic',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        refrigerate: true,
        dosages: [
            { species: 'canine', indication: 'Vomiting', route: 'SC', doseLow: 1, doseHigh: 1, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'safe' },
            { species: 'canine', indication: 'Vomiting', route: 'PO', doseLow: 2, doseHigh: 2, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'safe' },
            { species: 'feline', indication: 'Vomiting', route: 'SC/IV', doseLow: 1, doseHigh: 1, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'safe', notes: 'IV must be given slowly over 1-2 min' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 16, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 24, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 60, concentrationUnit: 'mg/tablet' },
            { form: 'Injectable', concentration: 10, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Ondansetron',
        brandNames: ['Zofran'],
        category: 'Gastrointestinal',
        drugClass: '5-HT3 antagonist',
        description: 'Antiemetic for severe nausea',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: true,
        dosages: [
            { species: 'canine', indication: 'Nausea', route: 'IV/PO', doseLow: 0.2, doseHigh: 0.5, doseUnit: 'mg/kg', frequency: 'TID', safetyLevel: 'safe' },
            { species: 'feline', indication: 'Nausea', route: 'IV/PO', doseLow: 0.2, doseHigh: 0.5, doseUnit: 'mg/kg', frequency: 'TID', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 4, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 8, concentrationUnit: 'mg/tablet' },
            { form: 'Injectable', concentration: 2, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Metoclopramide',
        brandNames: ['Reglan'],
        category: 'Gastrointestinal',
        drugClass: 'Prokinetic',
        description: 'Prokinetic and antiemetic',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        contraindications: [{ condition: 'GI Obstruction', severity: 'absolute' }],
        dosages: [
            { species: 'canine', indication: 'Motility', route: 'PO/SC', doseLow: 0.2, doseHigh: 0.5, doseUnit: 'mg/kg', frequency: 'TID', safetyLevel: 'safe' },
            { species: 'canine', indication: 'CRI', route: 'IV', doseLow: 1, doseHigh: 2, doseUnit: 'mg/kg/day', frequency: 'CRI', safetyLevel: 'safe', cr: true },
        ],
        formulations: [
            { form: 'Tablet', concentration: 5, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 10, concentrationUnit: 'mg/tablet' },
            { form: 'Injectable', concentration: 5, concentrationUnit: 'mg/ml' },
        ],
    },
    {
        genericName: 'Omeprazole',
        brandNames: ['Prilosec', 'Gastrogard'],
        category: 'Gastrointestinal',
        drugClass: 'Proton Pump Inhibitor',
        description: 'Antacid for ulcers',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Ulcers', route: 'PO', doseLow: 0.5, doseHigh: 1, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'safe' },
            { species: 'feline', indication: 'Ulcers', route: 'PO', doseLow: 0.5, doseHigh: 1, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 10, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 20, concentrationUnit: 'mg/tablet' },
        ],
    },
    {
        genericName: 'Sucralfate',
        brandNames: ['Carafate'],
        category: 'Gastrointestinal',
        drugClass: 'Protectant',
        description: 'Mucosal protectant for ulcers',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        timing: 'Give on empty stomach, 1 hr before/after food/meds',
        interactions: [{ drug: 'Fluoroquinolones', effect: 'Decreased absorption' }, { drug: 'Tetracyclines', effect: 'Decreased absorption' }],
        dosages: [
            { species: 'canine', indication: 'Ulcers', route: 'PO', doseLow: 0.5, doseHigh: 1, doseUnit: 'g/dog', frequency: 'TID', safetyLevel: 'safe', notes: 'Slurry with water' },
            { species: 'feline', indication: 'Ulcers', route: 'PO', doseLow: 0.25, doseHigh: 0.25, doseUnit: 'g/cat', frequency: 'TID', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 1000, concentrationUnit: 'mg/tablet', notes: '1 gram' },
        ],
    },
    {
        genericName: 'Mirtazapine',
        brandNames: ['Remeron', 'Mirataz'],
        category: 'Appetite Stimulant',
        drugClass: 'Tetracyclic antidepressant',
        description: 'Appetite stimulant and antiemetic',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        dosages: [
            { species: 'feline', indication: 'Anorexia', route: 'PO', doseLow: 1.88, doseHigh: 1.88, doseUnit: 'mg/cat', frequency: 'q48h', safetyLevel: 'safe' },
            { species: 'feline', indication: 'Anorexia', route: 'Transdermal', doseLow: 2, doseHigh: 2, doseUnit: 'mg/cat', frequency: 'SID', safetyLevel: 'safe' },
            { species: 'canine', indication: 'Anorexia', route: 'PO', doseLow: 0.6, doseHigh: 0.6, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 15, concentrationUnit: 'mg/tablet' },
            { form: 'Ointment', concentration: 20, concentrationUnit: 'mg/g', notes: 'Transdermal' },
        ],
    },
    {
        genericName: 'Capromorelin',
        brandNames: ['Entyce', 'Elura'],
        category: 'Appetite Stimulant',
        drugClass: 'Ghrelin agonist',
        description: 'FDA approved appetite stimulant',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Anorexia', route: 'PO', doseLow: 3, doseHigh: 3, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'safe' },
            { species: 'feline', indication: 'Anorexia / CKD', route: 'PO', doseLow: 2, doseHigh: 2, doseUnit: 'mg/kg', frequency: 'SID', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Liquid', concentration: 30, concentrationUnit: 'mg/ml', notes: 'Entyce' },
            { form: 'Liquid', concentration: 15, concentrationUnit: 'mg/ml', notes: 'Elura' },
        ],
    },
    {
        genericName: 'Trazodone',
        brandNames: ['Desyrel'],
        category: 'Behavior',
        drugClass: 'SARI',
        description: 'Anxiolytic for short term stress',
        isControlled: false,
        isHighRisk: true,
        mdr1Sensitive: false,
        interactions: [{ drug: 'MAOIs', effect: 'Serotonin Syndrome' }, { drug: 'Tramadol', effect: 'Serotonin Syndrome' }],
        dosages: [
            { species: 'canine', indication: 'Anxiety', route: 'PO', doseLow: 3, doseHigh: 10, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe' },
            { species: 'feline', indication: 'Anxiety', route: 'PO', doseLow: 50, doseHigh: 100, doseUnit: 'mg/cat', frequency: 'single dose', safetyLevel: 'caution' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 50, concentrationUnit: 'mg/tablet' },
            { form: 'Tablet', concentration: 100, concentrationUnit: 'mg/tablet' },
        ],
    },
    {
        genericName: 'Gabapentin',
        brandNames: ['Neurontin'],
        category: 'Analgesic',
        drugClass: 'Anticonvulsant / Analgesic',
        description: 'For neuropathic pain and anxiety',
        isControlled: true,
        isHighRisk: false,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Pain/Anxiety', route: 'PO', doseLow: 5, doseHigh: 20, doseUnit: 'mg/kg', frequency: 'TID', safetyLevel: 'safe' },
            { species: 'feline', indication: 'Anxiety (Vet visit)', route: 'PO', doseLow: 50, doseHigh: 100, doseUnit: 'mg/cat', frequency: 'single dose', safetyLevel: 'safe', notes: 'Give 2h before visit' },
            { species: 'feline', indication: 'Pain', route: 'PO', doseLow: 5, doseHigh: 10, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Capsule', concentration: 100, concentrationUnit: 'mg/capsule' },
            { form: 'Capsule', concentration: 300, concentrationUnit: 'mg/capsule' },
            { form: 'Liquid', concentration: 50, concentrationUnit: 'mg/ml', notes: 'Ensure Xylitol-free' },
        ],
    },
    {
        genericName: 'Diphenhydramine',
        brandNames: ['Benadryl'],
        category: 'Antihistamine',
        drugClass: 'H1 antagonist',
        description: 'For allergic reactions',
        isControlled: false,
        isHighRisk: false,
        mdr1Sensitive: false,
        dosages: [
            { species: 'canine', indication: 'Allergy', route: 'PO/IM', doseLow: 2, doseHigh: 2, doseUnit: 'mg/kg', frequency: 'TID', safetyLevel: 'safe' },
            { species: 'feline', indication: 'Allergy', route: 'PO/IM', doseLow: 1, doseHigh: 2, doseUnit: 'mg/kg', frequency: 'BID', safetyLevel: 'safe' },
        ],
        formulations: [
            { form: 'Tablet', concentration: 25, concentrationUnit: 'mg/tablet' },
            { form: 'Injectable', concentration: 50, concentrationUnit: 'mg/ml' },
        ],
    },
];

/**
 * Seed the database with initial drug data
 */
export async function seedDrugs(database: Database): Promise<void> {
    const drugsCollection = database.get('drugs');
    const dosagesCollection = database.get('dosages');
    const formulationsCollection = database.get('drug_formulations');

    // Check if drugs already exist
    const existingDrugs = await drugsCollection.query().fetchCount();
    if (existingDrugs > 0) {
        console.log('Drugs already seeded, skipping...');
        return;
    }

    console.log(`Seeding ${DRUG_SEEDS.length} drugs...`);

    await database.write(async () => {
        for (const drugData of DRUG_SEEDS) {
            // Create drug
            const drug = await drugsCollection.create((record: any) => {
                record.genericName = drugData.genericName;
                record._raw.brand_names = JSON.stringify(drugData.brandNames);
                record.category = drugData.category;
                record.drugClass = drugData.drugClass || null;
                record.description = drugData.description || null;
                record.isControlled = drugData.isControlled;
                record.isHighRisk = drugData.isHighRisk;
                record.mdr1Sensitive = drugData.mdr1Sensitive;
                record.pregnancyRisk = drugData.pregnancyRisk || null;

                // NEW FIELDS MAPPING
                record.isEmergency = drugData.isEmergency || false;
                record.reversalAgent = drugData.reversalAgent || null;
                record.antidote = drugData.antidote || false;
                record.speciesSpecific = drugData.speciesSpecific || false;
                record.requiresDilution = drugData.requiresDilution || false;
                record.refrigerate = drugData.refrigerate || false;
                record.maxDoseCritical = drugData.maxDoseCritical || false;
                record.withdrawalTime = drugData.withdrawalTime || false;
                record.compounded = drugData.compounded || false;
                record.perivascularNecrosis = drugData.perivascularNecrosis || false;
                record.felineToxic = drugData.felineToxic || false;
                record.reptileToxicity = drugData.reptileToxicity || false;
                record.cardiacMonitor = drugData.cardiacMonitor || false;
                record.histamineRelease = drugData.histamineRelease || false;
                record.cartilageRisk = drugData.cartilageRisk || false;
                record.timing = drugData.timing || null;

                // JSON fields
                if (drugData.monitoring) record._raw.monitoring = JSON.stringify(drugData.monitoring);
                if (drugData.toxicity) record._raw.toxicity = JSON.stringify(drugData.toxicity);
                if (drugData.interactions) record._raw.interactions = JSON.stringify(drugData.interactions);
                if (drugData.contraindications) record._raw.contraindications = JSON.stringify(drugData.contraindications);
            });

            // Create dosages
            for (const dosage of drugData.dosages) {
                await dosagesCollection.create((record: any) => {
                    record.drugId = drug.id;
                    record.species = dosage.species;
                    record.indication = dosage.indication;
                    record.route = dosage.route;
                    record.doseLow = dosage.doseLow;
                    record.doseHigh = dosage.doseHigh;
                    record.doseUnit = dosage.doseUnit;
                    record.frequency = dosage.frequency;
                    record.duration = dosage.duration || null;
                    record.maxDose = dosage.maxDose || null;
                    record.safetyLevel = dosage.safetyLevel;
                    record.notes = dosage.notes || null;
                    // NEW dosage fields
                    record.cr = dosage.cr || false;
                    record.loadingDose = dosage.loadingDose || null;
                    record.loadingDoseUnit = dosage.loadingDoseUnit || null;
                    record.compounded = dosage.compounded || false;
                });
            }

            // Create formulations
            for (const formulation of drugData.formulations) {
                await formulationsCollection.create((record: any) => {
                    record.drugId = drug.id;
                    record.form = formulation.form;
                    record.concentration = formulation.concentration;
                    record.concentrationUnit = formulation.concentrationUnit;
                    record.packageSize = formulation.packageSize || null;
                    record.notes = formulation.notes || null;
                    // NEW formulation fields
                    record.isDiluted = formulation.isDiluted || false;
                    record.dilutionInstructions = formulation.dilutionInstructions || null;
                });
            }
        }
    });

    console.log('Drug seeding complete!');
}

export default seedDrugs;
