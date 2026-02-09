/**
 * Toxin Seed Data
 * Common toxins for emergency reference
 */
import type { Database } from '@nozbe/watermelondb';

interface ToxinSeed {
    name: string;
    category: string;
    toxicComponent: string;
    speciesAffected: string[];
    toxicDose?: string;
    symptoms: string[];
    onsetTime?: string;
    treatment: string;
    antidote?: string;
    prognosis?: string;
}

export const TOXIN_SEEDS: ToxinSeed[] = [
    // FOOD TOXINS
    {
        name: 'Chocolate',
        category: 'food',
        toxicComponent: 'Theobromine & Caffeine',
        speciesAffected: ['canine', 'feline'],
        toxicDose: 'Mild: 20mg/kg, Moderate: 40mg/kg, Severe: 60mg/kg theobromine',
        symptoms: ['Vomiting', 'Diarrhea', 'Hyperactivity', 'Tachycardia', 'Tremors', 'Seizures', 'Cardiac arrhythmia'],
        onsetTime: '6-12 hours',
        treatment: 'Decontamination if recent ingestion. IV fluids. Control seizures with diazepam. Monitor ECG for arrhythmias.',
        antidote: 'No specific antidote',
        prognosis: 'Good with early treatment. Poor if severe cardiac signs or seizures.',
    },
    {
        name: 'Xylitol',
        category: 'food',
        toxicComponent: 'Xylitol (sugar alcohol)',
        speciesAffected: ['canine'],
        toxicDose: 'Hypoglycemia: 0.1g/kg, Hepatotoxic: 0.5g/kg',
        symptoms: ['Vomiting', 'Weakness', 'Ataxia', 'Collapse', 'Seizures', 'Hepatic failure'],
        onsetTime: '10-60 minutes (hypoglycemia), 1-3 days (liver failure)',
        treatment: 'Induce vomiting if recent and asymptomatic. Dextrose IV for hypoglycemia. Hepatoprotectants.',
        antidote: 'Dextrose for hypoglycemia',
        prognosis: 'Good if hypoglycemia only. Guarded to poor with liver involvement.',
    },
    {
        name: 'Grapes/Raisins',
        category: 'food',
        toxicComponent: 'Unknown (tartaric acid suspected)',
        speciesAffected: ['canine', 'feline'],
        toxicDose: 'Variable - any amount may be toxic',
        symptoms: ['Vomiting', 'Diarrhea', 'Anorexia', 'Lethargy', 'Oliguria/Anuria', 'Acute renal failure'],
        onsetTime: '6-24 hours for GI signs, 24-72 hours for renal signs',
        treatment: 'Aggressive decontamination. IV fluid diuresis for 48-72 hours. Monitor renal values.',
        antidote: 'No specific antidote',
        prognosis: 'Good with early aggressive treatment. Poor once anuric.',
    },
    {
        name: 'Onions/Garlic',
        category: 'food',
        toxicComponent: 'N-propyl disulfide, thiosulfates',
        speciesAffected: ['canine', 'feline'],
        toxicDose: 'Onion: 15-30g/kg, Garlic: 5g/kg',
        symptoms: ['Vomiting', 'Diarrhea', 'Weakness', 'Pale gums', 'Tachypnea', 'Hemolytic anemia', 'Hemoglobinuria'],
        onsetTime: '1-5 days for anemia',
        treatment: 'Decontamination. Supportive care. Blood transfusion if severe anemia.',
        antidote: 'No specific antidote',
        prognosis: 'Good with mild exposure. Guarded with severe anemia.',
    },
    {
        name: 'Macadamia Nuts',
        category: 'food',
        toxicComponent: 'Unknown',
        speciesAffected: ['canine'],
        toxicDose: '2.2-62.4g/kg',
        symptoms: ['Weakness', 'Depression', 'Vomiting', 'Ataxia', 'Tremors', 'Hyperthermia', 'Hindlimb weakness'],
        onsetTime: '12 hours',
        treatment: 'Supportive care. Usually self-limiting within 24-48 hours.',
        prognosis: 'Excellent - self-limiting',
    },

    // RODENTICIDES
    {
        name: 'Anticoagulant Rodenticide',
        category: 'rodenticide',
        toxicComponent: 'Brodifacoum, Bromadiolone, Warfarin',
        speciesAffected: ['all'],
        toxicDose: 'Varies by generation. First-gen: 1-5mg/kg x5 days. Second-gen: 0.02-0.5mg/kg single dose',
        symptoms: ['Weakness', 'Pallor', 'Dyspnea', 'Bleeding', 'Bruising', 'Hemoptysis', 'Melena', 'Epistaxis'],
        onsetTime: '2-7 days',
        treatment: 'Vitamin K1 therapy. Whole blood transfusion if actively bleeding. Monitor PT/PTT.',
        antidote: 'Vitamin K1 (Phytonadione) 2.5-5mg/kg PO divided BID for 4-6 weeks',
        prognosis: 'Excellent with early treatment. Poor if severe hemorrhage before treatment.',
    },
    {
        name: 'Bromethalin',
        category: 'rodenticide',
        toxicComponent: 'Bromethalin',
        speciesAffected: ['all'],
        toxicDose: 'Dog: 2.5mg/kg, Cat: 0.45mg/kg',
        symptoms: ['Tremors', 'Seizures', 'Hindlimb paresis', 'CNS depression', 'Paralysis', 'Cerebral edema'],
        onsetTime: '2-24 hours (high dose), 1-5 days (low dose)',
        treatment: 'Aggressive decontamination. Activated charcoal x48-72 hours. Mannitol for cerebral edema.',
        antidote: 'No specific antidote',
        prognosis: 'Guarded to poor. No antidote available.',
    },
    {
        name: 'Cholecalciferol (Vitamin D3)',
        category: 'rodenticide',
        toxicComponent: 'Cholecalciferol',
        speciesAffected: ['all'],
        toxicDose: '0.5mg/kg',
        symptoms: ['Anorexia', 'Vomiting', 'Polydipsia', 'Polyuria', 'Depression', 'Cardiac arrhythmias', 'Renal failure'],
        onsetTime: '12-36 hours',
        treatment: 'Aggressive fluid therapy. Pamidronate or calcitonin to lower calcium. Monitor Ca, P, BUN.',
        antidote: 'Pamidronate 1.3-2mg/kg IV over 4 hours',
        prognosis: 'Guarded. Mineralization of tissues may be permanent.',
    },

    // MEDICATIONS
    {
        name: 'Ibuprofen',
        category: 'medication',
        toxicComponent: 'Ibuprofen (NSAID)',
        speciesAffected: ['canine', 'feline'],
        toxicDose: 'GI: 25mg/kg, Renal: 100mg/kg, CNS: 400mg/kg',
        symptoms: ['Vomiting', 'GI ulceration', 'Melena', 'Renal failure', 'Seizures', 'Coma'],
        onsetTime: '2-6 hours',
        treatment: 'Decontamination. GI protectants (omeprazole, sucralfate). IV fluids. Misoprostol for ulcers.',
        antidote: 'No specific antidote',
        prognosis: 'Good at low doses. Poor with renal failure or CNS signs.',
    },
    {
        name: 'Acetaminophen (Tylenol)',
        category: 'medication',
        toxicComponent: 'Acetaminophen',
        speciesAffected: ['canine', 'feline'],
        toxicDose: 'Cat: 10mg/kg, Dog: 100-200mg/kg',
        symptoms: ['Cats: Facial/paw edema, Cyanosis, Methemoglobinemia, Hemolysis', 'Dogs: Hepatotoxicity, Vomiting, Weakness'],
        onsetTime: '1-4 hours',
        treatment: 'N-acetylcysteine loading 140mg/kg, then 70mg/kg q4h x7 doses. Vitamin C for methemoglobinemia.',
        antidote: 'N-acetylcysteine (NAC)',
        prognosis: 'Variable. Cats: guarded. Dogs: fair with treatment.',
    },
    {
        name: 'Pseudoephedrine',
        category: 'medication',
        toxicComponent: 'Pseudoephedrine/Ephedrine',
        speciesAffected: ['canine', 'feline'],
        toxicDose: '5-6mg/kg',
        symptoms: ['Restlessness', 'Hyperactivity', 'Tachycardia', 'Hypertension', 'Hyperthermia', 'Seizures', 'Death'],
        onsetTime: '30 minutes - 4 hours',
        treatment: 'Decontamination. Acepromazine for agitation. Beta-blockers (esmolol) for tachycardia. Cool if hyperthermic.',
        antidote: 'Cyproheptadine 1.1mg/kg (dogs), 2-4mg total (cats)',
        prognosis: 'Fair to good with treatment. Poor with severe hyperthermia.',
    },
    {
        name: '5-Fluorouracil (Efudex)',
        category: 'medication',
        toxicComponent: '5-Fluorouracil',
        speciesAffected: ['canine', 'feline'],
        toxicDose: 'Any amount - extremely toxic',
        symptoms: ['Vomiting', 'Diarrhea', 'Seizures', 'Cardiac arrhythmias', 'Bone marrow suppression'],
        onsetTime: '30 minutes - hours',
        treatment: 'Aggressive decontamination. Uridine antidote if available. Supportive care.',
        antidote: 'Uridine triacetate (Vistogard) if available',
        prognosis: 'Poor to grave. Often fatal in dogs.',
    },

    // PLANTS
    {
        name: 'Lilies (Lilium/Hemerocallis)',
        category: 'plant',
        toxicComponent: 'Unknown nephrotoxin',
        speciesAffected: ['feline'],
        toxicDose: 'Any part of plant - pollen, leaves, petals, water from vase',
        symptoms: ['Vomiting', 'Anorexia', 'Depression', 'Polyuria then Anuria', 'Acute kidney injury'],
        onsetTime: '0-12 hours (GI), 24-72 hours (renal failure)',
        treatment: 'Aggressive IV fluid diuresis for minimum 48 hours. Monitor renal values. May need dialysis.',
        antidote: 'No specific antidote',
        prognosis: 'Good if treated within 18 hours. Poor once oliguric/anuric.',
    },
    {
        name: 'Sago Palm',
        category: 'plant',
        toxicComponent: 'Cycasin',
        speciesAffected: ['all'],
        toxicDose: '1-2 seeds can be lethal',
        symptoms: ['Vomiting', 'Diarrhea', 'Hepatic failure', 'Coagulopathy', 'Icterus', 'Seizures', 'Death'],
        onsetTime: '15 min - hours (GI), 24-48 hours (liver failure)',
        treatment: 'Aggressive decontamination. Hepatoprotectants (SAMe, milk thistle). IV fluids. Fresh frozen plasma.',
        antidote: 'No specific antidote',
        prognosis: 'Poor. 50-75% mortality even with treatment.',
    },
    {
        name: 'Oleander',
        category: 'plant',
        toxicComponent: 'Cardiac glycosides (oleandrin)',
        speciesAffected: ['all'],
        toxicDose: 'Highly toxic - small amount of leaves',
        symptoms: ['Vomiting', 'Diarrhea', 'Bradycardia', 'Heart block', 'Hyperkalemia', 'Cardiac arrest'],
        onsetTime: '1-6 hours',
        treatment: 'Decontamination. Atropine for bradycardia. Digibind if available. Correct hyperkalemia.',
        antidote: 'Digoxin immune Fab (Digibind)',
        prognosis: 'Guarded to poor depending on amount ingested and cardiac effects.',
    },

    // CHEMICALS/HOUSEHOLD
    {
        name: 'Ethylene Glycol (Antifreeze)',
        category: 'chemical',
        toxicComponent: 'Ethylene glycol',
        speciesAffected: ['all'],
        toxicDose: 'Dog: 4.4-6.6ml/kg, Cat: 1.4ml/kg',
        symptoms: ['Ataxia (looks drunk)', 'Vomiting', 'Polyuria', 'Renal failure', 'Calcium oxalate crystalluria', 'Death'],
        onsetTime: 'Stage 1: 30min-12h, Stage 2: 12-24h, Stage 3: 24-72h',
        treatment: 'Fomepizole (4-MP) or ethanol. Aggressive IV fluids. Treat acidosis.',
        antidote: 'Fomepizole (4-MP) 20mg/kg IV load, then 15mg/kg at 12h, 24h (dog)',
        prognosis: 'Good if treated within 8-12 hours (dogs) or 3 hours (cats). Poor once renal failure develops.',
    },
    {
        name: 'Permethrin',
        category: 'chemical',
        toxicComponent: 'Permethrin pyrethroid',
        speciesAffected: ['feline'],
        toxicDose: 'Any topical cat exposure to dog flea products',
        symptoms: ['Muscle tremors', 'Twitching', 'Hypersalivation', 'Seizures', 'Hyperthermia', 'Death'],
        onsetTime: '1-72 hours (usually within 24 hours)',
        treatment: 'Decontamination (bathing with dish soap). Methocarbamol or diazepam for tremors. IV lipid emulsion.',
        antidote: 'IV lipid emulsion (Intralipid)',
        prognosis: 'Good with appropriate treatment. May take 24-72 hours to resolve.',
    },
];

/**
 * Seed the database with toxin data
 */
export async function seedToxins(database: Database): Promise<void> {
    const toxinsCollection = database.get('toxins');

    // Check if toxins already exist
    const existingToxins = await toxinsCollection.query().fetchCount();
    if (existingToxins > 0) {
        console.log('Toxins already seeded, skipping...');
        return;
    }

    console.log(`Seeding ${TOXIN_SEEDS.length} toxins...`);

    await database.write(async () => {
        for (const toxinData of TOXIN_SEEDS) {
            await toxinsCollection.create((record: any) => {
                record.name = toxinData.name;
                record.category = toxinData.category;
                record.toxicComponent = toxinData.toxicComponent;
                record._raw.species_affected = JSON.stringify(toxinData.speciesAffected);
                record.toxicDose = toxinData.toxicDose || null;
                record._raw.symptoms = JSON.stringify(toxinData.symptoms);
                record.onsetTime = toxinData.onsetTime || null;
                record.treatment = toxinData.treatment;
                record.antidote = toxinData.antidote || null;
                record.prognosis = toxinData.prognosis || null;
            });
        }
    });

    console.log('Toxin seeding complete!');
}

export default seedToxins;
