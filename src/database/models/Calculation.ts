/**
 * Calculation Model
 * Stores calculation history for audit trail
 */
import { Model } from '@nozbe/watermelondb';
import { date, field, json, readonly, relation, text } from '@nozbe/watermelondb/decorators';
import type { Associations } from '@nozbe/watermelondb/Model';

const sanitizeWarnings = (raw: any): string[] => {
    if (Array.isArray(raw)) return raw;
    if (typeof raw === 'string') {
        try {
            return JSON.parse(raw);
        } catch {
            return [];
        }
    }
    return [];
};

export default class Calculation extends Model {
    static table = 'calculations';

    static associations: Associations = {
        patients: { type: 'belongs_to', key: 'patient_id' },
        drugs: { type: 'belongs_to', key: 'drug_id' },
    };

    // @ts-ignore - WatermelonDB decorator
    @text('patient_id') patientId?: string;
    // @ts-ignore - WatermelonDB decorator
    @text('drug_id') drugId!: string;
    // @ts-ignore - WatermelonDB decorator
    @text('species') species!: string;
    // @ts-ignore - WatermelonDB decorator
    @field('weight') weight!: number;
    // @ts-ignore - WatermelonDB decorator
    @text('weight_unit') weightUnit!: string;
    // @ts-ignore - WatermelonDB decorator
    @field('bcs') bcs?: number;
    // @ts-ignore - WatermelonDB decorator
    @text('route') route!: string;
    // @ts-ignore - WatermelonDB decorator
    @text('indication') indication!: string;
    // @ts-ignore - WatermelonDB decorator
    @field('dose_rate') doseRate!: number;
    // @ts-ignore - WatermelonDB decorator
    @field('calculated_dose') calculatedDose!: number;
    // @ts-ignore - WatermelonDB decorator
    @text('dose_unit') doseUnit!: string;
    // @ts-ignore - WatermelonDB decorator
    @text('frequency') frequency!: string;
    // @ts-ignore - WatermelonDB decorator
    @field('volume') volume?: number;
    // @ts-ignore - WatermelonDB decorator
    @text('safety_level') safetyLevel!: string;
    // @ts-ignore - WatermelonDB decorator
    @json('warnings', sanitizeWarnings) warnings?: string[];
    // @ts-ignore - WatermelonDB decorator
    @text('notes') notes?: string;
    // @ts-ignore - WatermelonDB decorator
    @text('calculated_by') calculatedBy?: string;
    // @ts-ignore - WatermelonDB decorator
    @readonly @date('created_at') createdAt!: Date;
    // @ts-ignore - WatermelonDB decorator
    @text('sync_status') localSyncStatus!: string;

    // @ts-ignore - WatermelonDB decorator
    @relation('patients', 'patient_id') patient!: any;
    // @ts-ignore - WatermelonDB decorator
    @relation('drugs', 'drug_id') drug!: any;

    // Get formatted result string
    get formattedResult(): string {
        const volume = this.volume ? ` (${this.volume.toFixed(2)} ml)` : '';
        return `${this.calculatedDose.toFixed(2)} ${this.doseUnit}${volume}`;
    }

    // Get safety color
    get safetyColor(): string {
        switch (this.safetyLevel) {
            case 'safe': return '#22C55E';
            case 'caution': return '#F59E0B';
            case 'danger': return '#EF4444';
            default: return '#6B7280';
        }
    }
}
