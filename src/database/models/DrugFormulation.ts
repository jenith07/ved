/**
 * Drug Formulation Model
 * Tracks different forms and concentrations of a drug
 */
import { Model } from '@nozbe/watermelondb';
import { field, relation, text } from '@nozbe/watermelondb/decorators';
import type { Associations } from '@nozbe/watermelondb/Model';

export default class DrugFormulation extends Model {
    static table = 'drug_formulations';

    static associations: Associations = {
        drugs: { type: 'belongs_to', key: 'drug_id' },
    };

    // @ts-ignore - WatermelonDB decorator
    @text('drug_id') drugId!: string;
    // @ts-ignore - WatermelonDB decorator
    @text('form') form!: string; // tablet, liquid, injectable, capsule, etc.
    // @ts-ignore - WatermelonDB decorator
    @field('concentration') concentration!: number;
    // @ts-ignore - WatermelonDB decorator
    @text('concentration_unit') concentrationUnit!: string;
    // @ts-ignore - WatermelonDB decorator
    @text('package_size') packageSize?: string;

    // NEW FIELDS for expansion
    // @ts-ignore - WatermelonDB decorator
    @field('is_diluted') isDiluted?: boolean;
    // @ts-ignore - WatermelonDB decorator
    @text('dilution_instructions') dilutionInstructions?: string;

    // @ts-ignore - WatermelonDB decorator
    @relation('drugs', 'drug_id') drug!: any;

    /**
     * Get display string for this formulation
     */
    get displayString(): string {
        return `${this.form} (${this.concentration} ${this.concentrationUnit})`;
    }

    /**
     * Calculate number of units needed for a dose
     */
    calculateUnits(doseAmount: number): { units: number; display: string } {
        const units = doseAmount / this.concentration;
        const rounded = Math.round(units * 4) / 4; // Round to nearest quarter

        let display: string;
        if (this.form.toLowerCase() === 'tablet') {
            if (rounded === 0.25) display = '1/4 tablet';
            else if (rounded === 0.5) display = '1/2 tablet';
            else if (rounded === 0.75) display = '3/4 tablet';
            else if (rounded === 1) display = '1 tablet';
            else display = `${rounded} tablets`;
        } else if (this.form.toLowerCase() === 'liquid') {
            display = `${rounded.toFixed(2)} ml`;
        } else {
            display = `${rounded} ${this.form.toLowerCase()}`;
        }

        return { units: rounded, display };
    }
}
