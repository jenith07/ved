/**
 * WatermelonDB Schema Definition
 * Defines all tables and columns for VetDose Pro
 */
import { appSchema, tableSchema } from '@nozbe/watermelondb';

export const schema = appSchema({
    version: 1,
    tables: [
        // Patients table
        tableSchema({
            name: 'patients',
            columns: [
                { name: 'name', type: 'string' },
                { name: 'owner_name', type: 'string' },
                { name: 'owner_phone', type: 'string', isOptional: true },
                { name: 'owner_email', type: 'string', isOptional: true },
                { name: 'species', type: 'string' }, // canine, feline, avian, exotic, equine, bovine, reptile
                { name: 'breed', type: 'string', isOptional: true },
                { name: 'sex', type: 'string', isOptional: true }, // male, female, male_neutered, female_spayed, unknown
                { name: 'date_of_birth', type: 'number', isOptional: true }, // timestamp
                { name: 'microchip_id', type: 'string', isOptional: true },
                { name: 'notes', type: 'string', isOptional: true },
                { name: 'profile_photo_uri', type: 'string', isOptional: true },
                { name: 'is_deleted', type: 'boolean' }, // soft delete
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
                { name: 'sync_status', type: 'string' }, // synced, pending, conflict
            ],
        }),

        // Weight records table
        tableSchema({
            name: 'weight_records',
            columns: [
                { name: 'patient_id', type: 'string', isIndexed: true },
                { name: 'weight', type: 'number' }, // in kg
                { name: 'unit', type: 'string' }, // kg or lbs (stored value always in kg)
                { name: 'bcs', type: 'number', isOptional: true }, // 1-9 scale
                { name: 'recorded_at', type: 'number' },
                { name: 'notes', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
            ],
        }),

        // Drugs table (pre-populated)
        tableSchema({
            name: 'drugs',
            columns: [
                { name: 'generic_name', type: 'string', isIndexed: true },
                { name: 'brand_names', type: 'string' }, // JSON array
                { name: 'category', type: 'string', isIndexed: true }, // antibiotic, nsaid, analgesic, etc.
                { name: 'drug_class', type: 'string', isOptional: true },
                { name: 'description', type: 'string', isOptional: true },
                { name: 'mechanism_of_action', type: 'string', isOptional: true },
                { name: 'is_controlled', type: 'boolean' },
                { name: 'is_high_risk', type: 'boolean' },
                { name: 'mdr1_sensitive', type: 'boolean' }, // for collies and related breeds
                { name: 'pregnancy_risk', type: 'string', isOptional: true },
                // NEW FIELDS for expansion
                { name: 'is_emergency', type: 'boolean', isOptional: true },
                { name: 'reversal_agent', type: 'string', isOptional: true }, // specific agent or 'true'
                { name: 'antidote', type: 'boolean', isOptional: true },
                { name: 'species_specific', type: 'boolean', isOptional: true },
                { name: 'requires_dilution', type: 'boolean', isOptional: true },
                { name: 'refrigerate', type: 'boolean', isOptional: true },
                { name: 'max_dose_critical', type: 'boolean', isOptional: true },
                { name: 'withdrawal_time', type: 'boolean', isOptional: true },
                { name: 'compounded', type: 'boolean', isOptional: true },
                { name: 'perivascular_necrosis', type: 'boolean', isOptional: true },
                { name: 'feline_toxic', type: 'boolean', isOptional: true },
                { name: 'reptile_toxicity', type: 'boolean', isOptional: true },
                { name: 'cardiac_monitor', type: 'boolean', isOptional: true },
                { name: 'histamine_release', type: 'boolean', isOptional: true },
                { name: 'cartilage_risk', type: 'boolean', isOptional: true },
                { name: 'timing', type: 'string', isOptional: true },
                { name: 'monitoring', type: 'string', isOptional: true }, // JSON array
                { name: 'toxicity', type: 'string', isOptional: true }, // JSON object
                { name: 'interactions', type: 'string', isOptional: true }, // JSON array of interactions specific to this drug record
                { name: 'contraindications', type: 'string', isOptional: true }, // JSON array
                { name: 'created_at', type: 'number' },
                { name: 'updated_at', type: 'number' },
            ],
        }),

        // Dosages table (linked to drugs)
        tableSchema({
            name: 'dosages',
            columns: [
                { name: 'drug_id', type: 'string', isIndexed: true },
                { name: 'species', type: 'string', isIndexed: true },
                { name: 'indication', type: 'string' },
                { name: 'route', type: 'string' }, // PO, IV, IM, SC, topical, etc.
                { name: 'dose_low', type: 'number' }, // mg/kg
                { name: 'dose_high', type: 'number' }, // mg/kg
                { name: 'dose_unit', type: 'string' }, // mg/kg, mcg/kg, units/kg
                { name: 'frequency', type: 'string' }, // SID, BID, TID, QID, q4h, etc.
                { name: 'duration', type: 'string', isOptional: true },
                { name: 'max_dose', type: 'number', isOptional: true },
                { name: 'notes', type: 'string', isOptional: true },
                { name: 'safety_level', type: 'string' }, // safe, caution, danger
                // NEW FIELDS for expansion
                { name: 'cr', type: 'boolean', isOptional: true }, // Constant Rate Infusion
                { name: 'loading_dose', type: 'number', isOptional: true },
                { name: 'loading_dose_unit', type: 'string', isOptional: true },
                { name: 'compounded', type: 'boolean', isOptional: true },
                { name: 'created_at', type: 'number' },
            ],
        }),

        // Drug concentrations/formulations
        tableSchema({
            name: 'drug_formulations',
            columns: [
                { name: 'drug_id', type: 'string', isIndexed: true },
                { name: 'form', type: 'string' }, // tablet, capsule, liquid, injectable, etc.
                { name: 'concentration', type: 'number' },
                { name: 'concentration_unit', type: 'string' }, // mg/ml, mg/tablet, etc.
                { name: 'volume', type: 'number', isOptional: true }, // bottle size
                { name: 'volume_unit', type: 'string', isOptional: true },
                { name: 'notes', type: 'string', isOptional: true },
                // NEW FIELDS for expansion
                { name: 'is_diluted', type: 'boolean', isOptional: true },
                { name: 'dilution_instructions', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
            ],
        }),

        // Drug interactions
        tableSchema({
            name: 'drug_interactions',
            columns: [
                { name: 'drug_id_1', type: 'string', isIndexed: true },
                { name: 'drug_id_2', type: 'string', isIndexed: true },
                { name: 'severity', type: 'string' }, // minor, moderate, major, contraindicated
                { name: 'description', type: 'string' },
                { name: 'mechanism', type: 'string', isOptional: true },
                { name: 'management', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
            ],
        }),

        // Calculation history
        tableSchema({
            name: 'calculations',
            columns: [
                { name: 'patient_id', type: 'string', isIndexed: true, isOptional: true },
                { name: 'drug_id', type: 'string', isIndexed: true },
                { name: 'species', type: 'string' },
                { name: 'weight', type: 'number' },
                { name: 'weight_unit', type: 'string' },
                { name: 'bcs', type: 'number', isOptional: true },
                { name: 'route', type: 'string' },
                { name: 'indication', type: 'string' },
                { name: 'dose_rate', type: 'number' },
                { name: 'calculated_dose', type: 'number' },
                { name: 'dose_unit', type: 'string' },
                { name: 'frequency', type: 'string' },
                { name: 'volume', type: 'number', isOptional: true },
                { name: 'safety_level', type: 'string' },
                { name: 'warnings', type: 'string', isOptional: true }, // JSON array
                { name: 'notes', type: 'string', isOptional: true },
                { name: 'calculated_by', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'sync_status', type: 'string' },
            ],
        }),

        // Patient medical conditions
        tableSchema({
            name: 'patient_conditions',
            columns: [
                { name: 'patient_id', type: 'string', isIndexed: true },
                { name: 'condition_name', type: 'string' },
                { name: 'diagnosed_at', type: 'number', isOptional: true },
                { name: 'status', type: 'string' }, // active, resolved, chronic
                { name: 'notes', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
            ],
        }),

        // Patient allergies
        tableSchema({
            name: 'patient_allergies',
            columns: [
                { name: 'patient_id', type: 'string', isIndexed: true },
                { name: 'allergen', type: 'string' },
                { name: 'reaction', type: 'string', isOptional: true },
                { name: 'severity', type: 'string' }, // mild, moderate, severe
                { name: 'notes', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
            ],
        }),

        // Patient photos
        tableSchema({
            name: 'patient_photos',
            columns: [
                { name: 'patient_id', type: 'string', isIndexed: true },
                { name: 'uri', type: 'string' },
                { name: 'thumbnail_uri', type: 'string', isOptional: true },
                { name: 'caption', type: 'string', isOptional: true },
                { name: 'taken_at', type: 'number' },
                { name: 'file_size', type: 'number', isOptional: true },
                { name: 'created_at', type: 'number' },
                { name: 'sync_status', type: 'string' },
            ],
        }),

        // Common toxins database
        tableSchema({
            name: 'toxins',
            columns: [
                { name: 'name', type: 'string', isIndexed: true },
                { name: 'category', type: 'string' }, // food, plant, medication, chemical, etc.
                { name: 'toxic_component', type: 'string' },
                { name: 'species_affected', type: 'string' }, // JSON array
                { name: 'toxic_dose', type: 'string', isOptional: true },
                { name: 'symptoms', type: 'string' }, // JSON array
                { name: 'onset_time', type: 'string', isOptional: true },
                { name: 'treatment', type: 'string' },
                { name: 'antidote', type: 'string', isOptional: true },
                { name: 'prognosis', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
            ],
        }),

        // Pending sync queue
        tableSchema({
            name: 'sync_queue',
            columns: [
                { name: 'table_name', type: 'string' },
                { name: 'record_id', type: 'string' },
                { name: 'action', type: 'string' }, // create, update, delete
                { name: 'data', type: 'string' }, // JSON payload
                { name: 'attempts', type: 'number' },
                { name: 'last_attempt_at', type: 'number', isOptional: true },
                { name: 'error', type: 'string', isOptional: true },
                { name: 'created_at', type: 'number' },
            ],
        }),
    ],
});

export default schema;
