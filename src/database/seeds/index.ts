/**
 * Database Seeds Index
 * Export all seed functions
 */
import type { Database } from '@nozbe/watermelondb';
import { seedDrugs } from './drugSeeds';
import { seedToxins } from './toxinSeeds';

/**
 * Seed all initial data
 */
export async function seedAllData(database: Database): Promise<void> {
    console.log('Starting database seeding...');

    await seedDrugs(database);
    await seedToxins(database);

    console.log('All seeding complete!');
}

export { seedDrugs, seedToxins };
