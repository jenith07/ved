/**
 * Database Initialization
 * Sets up WatermelonDB with SQLite adapter
 */
import { Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { modelClasses } from './models';
import schema from './schema';

// Create SQLite adapter
const adapter = new SQLiteAdapter({
    schema,
    // Enable migration (required for production apps)
    // migrations,
    // Enable JSI for better performance (requires native build)
    jsi: true,
    // Called when database corruption is detected
    onSetUpError: (error) => {
        console.error('Database setup error:', error);
    },
});

// Create database instance
export const database = new Database({
    adapter,
    modelClasses,
});

// Helper to get collections
export const getPatients = () => database.get('patients');
export const getWeightRecords = () => database.get('weight_records');
export const getDrugs = () => database.get('drugs');
export const getDosages = () => database.get('dosages');
export const getDrugFormulations = () => database.get('drug_formulations');
export const getCalculations = () => database.get('calculations');
export const getToxins = () => database.get('toxins');

// Reset database (for development/testing)
export const resetDatabase = async () => {
    await database.write(async () => {
        await database.unsafeResetDatabase();
    });
};

export default database;
