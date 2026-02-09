/**
 * Database Models Index
 * Export all WatermelonDB models
 */
import Calculation from './Calculation';
import Dosage from './Dosage';
import Drug from './Drug';
import DrugFormulation from './DrugFormulation';
import Patient from './Patient';
import Toxin from './Toxin';
import WeightRecord from './WeightRecord';

export {
    Calculation, Dosage, Drug, DrugFormulation, Patient, Toxin, WeightRecord
};

// Model classes array for database initialization
// @ts-ignore - WatermelonDB models type compatibility
export const modelClasses = [
    Patient,
    WeightRecord,
    Drug,
    Dosage,
    DrugFormulation,
    Calculation,
    Toxin,
] as any;
