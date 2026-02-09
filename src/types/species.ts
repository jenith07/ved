import { Species } from './index';

// Species configuration with display info and dosing factors
export interface SpeciesConfig {
    id: Species;
    name: string;
    icon: string; // lucide icon name
    color: string;
    description: string;
    avgWeightRange: {
        min: number;
        max: number;
        unit: 'kg' | 'lbs';
    };
    bcsScale: {
        min: number;
        max: number;
        ideal: number;
    };
    dosingMethod: 'standard' | 'allometric' | 'surfaceArea' | 'temperatureDependent';
    allometricExponent?: number; // For exotic species scaling (typically 0.75)
    metabolicFactor?: number; // Species-specific metabolic adjustment
}

export const SPECIES_CONFIG: Record<Species, SpeciesConfig> = {
    canine: {
        id: 'canine',
        name: 'Canine',
        icon: 'Dog',
        color: '#3B82F6',
        description: 'Dogs of all breeds and sizes',
        avgWeightRange: { min: 1, max: 90, unit: 'kg' },
        bcsScale: { min: 1, max: 9, ideal: 5 },
        dosingMethod: 'standard',
        metabolicFactor: 1.0
    },
    feline: {
        id: 'feline',
        name: 'Feline',
        icon: 'Cat',
        color: '#8B5CF6',
        description: 'Domestic and exotic cats',
        avgWeightRange: { min: 2, max: 10, unit: 'kg' },
        bcsScale: { min: 1, max: 9, ideal: 5 },
        dosingMethod: 'standard',
        metabolicFactor: 1.0
    },
    equine: {
        id: 'equine',
        name: 'Equine',
        icon: 'Footprints',
        color: '#F59E0B',
        description: 'Horses, ponies, and donkeys',
        avgWeightRange: { min: 150, max: 800, unit: 'kg' },
        bcsScale: { min: 1, max: 9, ideal: 5 },
        dosingMethod: 'standard',
        metabolicFactor: 0.9
    },
    bovine: {
        id: 'bovine',
        name: 'Bovine',
        icon: 'CircleDot',
        color: '#10B981',
        description: 'Cattle (dairy and beef)',
        avgWeightRange: { min: 200, max: 1000, unit: 'kg' },
        bcsScale: { min: 1, max: 9, ideal: 5 },
        dosingMethod: 'standard',
        metabolicFactor: 0.85
    },
    avian: {
        id: 'avian',
        name: 'Avian',
        icon: 'Bird',
        color: '#06B6D4',
        description: 'Birds (parrots, raptors, poultry)',
        avgWeightRange: { min: 0.02, max: 5, unit: 'kg' },
        bcsScale: { min: 1, max: 5, ideal: 3 },
        dosingMethod: 'surfaceArea',
        allometricExponent: 0.75,
        metabolicFactor: 1.5 // Higher metabolic rate
    },
    reptile: {
        id: 'reptile',
        name: 'Reptile',
        icon: 'Shell',
        color: '#84CC16',
        description: 'Snakes, lizards, turtles, tortoises',
        avgWeightRange: { min: 0.05, max: 50, unit: 'kg' },
        bcsScale: { min: 1, max: 5, ideal: 3 },
        dosingMethod: 'temperatureDependent',
        allometricExponent: 0.75,
        metabolicFactor: 0.5 // Lower metabolic rate (ectotherms)
    },
    exotic: {
        id: 'exotic',
        name: 'Exotic',
        icon: 'Rabbit',
        color: '#EC4899',
        description: 'Small mammals, rabbits, ferrets',
        avgWeightRange: { min: 0.01, max: 10, unit: 'kg' },
        bcsScale: { min: 1, max: 5, ideal: 3 },
        dosingMethod: 'allometric',
        allometricExponent: 0.75,
        metabolicFactor: 1.2
    }
};

// Breed-specific warnings (e.g., MDR1 mutation in collies)
export interface BreedWarning {
    breeds: string[];
    species: Species;
    warningType: 'mdr1' | 'brachycephalic' | 'cardiac' | 'hepatic' | 'renal';
    description: string;
    affectedDrugs: string[]; // Drug generic names
}

export const BREED_WARNINGS: BreedWarning[] = [
    {
        breeds: ['Collie', 'Border Collie', 'Australian Shepherd', 'Shetland Sheepdog', 'Old English Sheepdog', 'Longhaired Whippet', 'Silken Windhound'],
        species: 'canine',
        warningType: 'mdr1',
        description: 'MDR1 gene mutation - increased sensitivity to certain drugs',
        affectedDrugs: ['ivermectin', 'loperamide', 'acepromazine', 'butorphanol', 'vincristine', 'doxorubicin']
    },
    {
        breeds: ['English Bulldog', 'French Bulldog', 'Pug', 'Boston Terrier', 'Pekingese', 'Shih Tzu'],
        species: 'canine',
        warningType: 'brachycephalic',
        description: 'Brachycephalic breed - increased anesthetic risk',
        affectedDrugs: ['acepromazine', 'propofol', 'ketamine']
    },
    {
        breeds: ['Cavalier King Charles Spaniel', 'Doberman Pinscher', 'Boxer', 'Great Dane'],
        species: 'canine',
        warningType: 'cardiac',
        description: 'Breed predisposed to cardiac conditions - monitor closely',
        affectedDrugs: ['pimobendan', 'furosemide', 'atenolol']
    },
    {
        breeds: ['Persian', 'Himalayan', 'Exotic Shorthair'],
        species: 'feline',
        warningType: 'brachycephalic',
        description: 'Brachycephalic breed - increased anesthetic risk',
        affectedDrugs: ['acepromazine', 'propofol', 'ketamine']
    },
    {
        breeds: ['Maine Coon', 'Ragdoll', 'British Shorthair', 'Sphynx'],
        species: 'feline',
        warningType: 'cardiac',
        description: 'Breed predisposed to HCM - avoid certain drugs',
        affectedDrugs: ['ketamine', 'acepromazine']
    }
];
