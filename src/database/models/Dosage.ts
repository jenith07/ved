/**
 * Dosage Model
 * Represents dosing information for a drug-species combination
 */
import { Model } from '@nozbe/watermelondb';
import { date, field, readonly, relation, text } from '@nozbe/watermelondb/decorators';
import type { Associations } from '@nozbe/watermelondb/Model';

export default class Dosage extends Model {
    static table = 'dosages';

    static associations: Associations = {
        drugs: { type: 'belongs_to', key: 'drug_id' },
    };

    // @ts-ignore - WatermelonDB decorator
    @text('drug_id') drugId!: string;
    // @ts-ignore - WatermelonDB decorator
    @text('species') species!: string;
    // @ts-ignore - WatermelonDB decorator
    @text('indication') indication!: string;
    // @ts-ignore - WatermelonDB decorator
    @text('route') route!: string;
    // @ts-ignore - WatermelonDB decorator
    @field('dose_low') doseLow!: number;
    // @ts-ignore - WatermelonDB decorator
    @field('dose_high') doseHigh!: number;
    // @ts-ignore - WatermelonDB decorator
    @text('dose_unit') doseUnit!: string;
    // @ts-ignore - WatermelonDB decorator
    @text('frequency') frequency!: string;
    // @ts-ignore - WatermelonDB decorator
    @text('duration') duration?: string;
    // @ts-ignore - WatermelonDB decorator
    @field('max_dose') maxDose?: number;
    // @ts-ignore - WatermelonDB decorator
    @text('notes') notes?: string;
    // @ts-ignore - WatermelonDB decorator
    @text('safety_level') safetyLevel!: string;

    // NEW FIELDS for expansion
    // @ts-ignore - WatermelonDB decorator
    @field('cr') cr?: boolean;
    // @ts-ignore - WatermelonDB decorator
    @field('loading_dose') loadingDose?: number;
    // @ts-ignore - WatermelonDB decorator
    @text('loading_dose_unit') loadingDoseUnit?: string;
    // @ts-ignore - WatermelonDB decorator
    @field('compounded') compounded?: boolean;

    // @ts-ignore - WatermelonDB decorator
    @readonly @date('created_at') createdAt!: Date;

    // @ts-ignore - WatermelonDB decorator
    @relation('drugs', 'drug_id') drug!: any;

    // Calculate dose for a given weight
    calculateDose(weightKg: number, useHighDose: boolean = false): number {
        const rate = useHighDose ? this.doseHigh : this.doseLow;
        let dose = weightKg * rate;

        // Apply max dose cap if set
        if (this.maxDose && dose > this.maxDose) {
            dose = this.maxDose;
        }

        return dose;
    }

    // Get dose range string
    get doseRange(): string {
        if (this.doseLow === this.doseHigh) {
            return `${this.doseLow} ${this.doseUnit}`;
        }
        return `${this.doseLow}-${this.doseHigh} ${this.doseUnit}`;
    }

    // Get frequency display text
    get frequencyDisplay(): string {
        const frequencyMap: Record<string, string> = {
            SID: 'Once daily',
            BID: 'Twice daily',
            TID: 'Three times daily',
            QID: 'Four times daily',
            q4h: 'Every 4 hours',
            q6h: 'Every 6 hours',
            q8h: 'Every 8 hours',
            q12h: 'Every 12 hours',
            q24h: 'Every 24 hours',
            PRN: 'As needed',
        };
        return frequencyMap[this.frequency] || this.frequency;
    }
}
