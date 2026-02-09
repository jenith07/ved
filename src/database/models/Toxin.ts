/**
 * Toxin Model
 * Common toxins database for emergency reference
 */
import { Model } from '@nozbe/watermelondb';
import { date, json, readonly, text } from '@nozbe/watermelondb/decorators';

const sanitizeArray = (raw: any): string[] => {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') {
        try {
            return JSON.parse(raw);
        } catch {
            return raw.split(',').map((s: string) => s.trim());
        }
    }
    return [];
};

export default class Toxin extends Model {
    static table = 'toxins';

    // @ts-ignore - WatermelonDB decorator
    @text('name') name!: string;
    // @ts-ignore - WatermelonDB decorator
    @text('category') category!: string;
    // @ts-ignore - WatermelonDB decorator
    @text('toxic_component') toxicComponent!: string;
    // @ts-ignore - WatermelonDB decorator
    @json('species_affected', sanitizeArray) speciesAffected!: string[];
    // @ts-ignore - WatermelonDB decorator
    @text('toxic_dose') toxicDose?: string;
    // @ts-ignore - WatermelonDB decorator
    @json('symptoms', sanitizeArray) symptoms!: string[];
    // @ts-ignore - WatermelonDB decorator
    @text('onset_time') onsetTime?: string;
    // @ts-ignore - WatermelonDB decorator
    @text('treatment') treatment!: string;
    // @ts-ignore - WatermelonDB decorator
    @text('antidote') antidote?: string;
    // @ts-ignore - WatermelonDB decorator
    @text('prognosis') prognosis?: string;
    // @ts-ignore - WatermelonDB decorator
    @readonly @date('created_at') createdAt!: Date;

    // Check if toxin affects a specific species
    affectsSpecies(species: string): boolean {
        return this.speciesAffected.includes('all') ||
            this.speciesAffected.includes(species.toLowerCase());
    }

    // Get severity based on prognosis
    get severity(): 'low' | 'medium' | 'high' | 'critical' {
        const prog = (this.prognosis || '').toLowerCase();
        if (prog.includes('fatal') || prog.includes('death')) return 'critical';
        if (prog.includes('poor') || prog.includes('guarded')) return 'high';
        if (prog.includes('fair')) return 'medium';
        return 'low';
    }
}
