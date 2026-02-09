/**
 * WeightRecord Model
 * Tracks patient weight history over time
 */
import { Model } from '@nozbe/watermelondb';
import { date, field, readonly, relation, text } from '@nozbe/watermelondb/decorators';
import type { Associations } from '@nozbe/watermelondb/Model';

export default class WeightRecord extends Model {
    static table = 'weight_records';

    static associations: Associations = {
        patients: { type: 'belongs_to', key: 'patient_id' },
    };

    // @ts-ignore - WatermelonDB decorator
    @text('patient_id') patientId!: string;
    // @ts-ignore - WatermelonDB decorator
    @field('weight') weight!: number; // Always stored in kg
    // @ts-ignore - WatermelonDB decorator
    @text('unit') unit!: string;
    // @ts-ignore - WatermelonDB decorator
    @field('bcs') bcs?: number;
    // @ts-ignore - WatermelonDB decorator
    @field('recorded_at') recordedAt!: number;
    // @ts-ignore - WatermelonDB decorator
    @text('notes') notes?: string;
    // @ts-ignore - WatermelonDB decorator
    @readonly @date('created_at') createdAt!: Date;

    // @ts-ignore - WatermelonDB decorator
    @relation('patients', 'patient_id') patient!: any;

    // Convert weight to lbs
    get weightInLbs(): number {
        return this.weight * 2.20462;
    }

    // Get formatted weight with unit
    getFormattedWeight(preferredUnit: 'kg' | 'lbs' = 'kg'): string {
        if (preferredUnit === 'lbs') {
            return `${this.weightInLbs.toFixed(2)} lbs`;
        }
        return `${this.weight.toFixed(2)} kg`;
    }
}
