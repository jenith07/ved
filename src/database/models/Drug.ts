/**
 * Drug Model
 * Represents a medication in the drug database
 */
import { Model } from '@nozbe/watermelondb';
import { children, date, field, json, readonly, text } from '@nozbe/watermelondb/decorators';
import type { Associations } from '@nozbe/watermelondb/Model';

const sanitizeBrandNames = (raw: any): string[] => {
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

export default class Drug extends Model {
    static table = 'drugs';

    static associations: Associations = {
        dosages: { type: 'has_many', foreignKey: 'drug_id' },
        drug_formulations: { type: 'has_many', foreignKey: 'drug_id' },
        drug_interactions: { type: 'has_many', foreignKey: 'drug_id_1' },
    };

    // @ts-ignore - WatermelonDB decorator
    @text('generic_name') genericName!: string;
    // @ts-ignore - WatermelonDB decorator
    @json('brand_names', sanitizeBrandNames) brandNames!: string[];
    // @ts-ignore - WatermelonDB decorator
    @text('category') category!: string;
    // @ts-ignore - WatermelonDB decorator
    @text('drug_class') drugClass?: string;
    // @ts-ignore - WatermelonDB decorator
    @text('description') description?: string;
    // @ts-ignore - WatermelonDB decorator
    @text('mechanism_of_action') mechanismOfAction?: string;
    // @ts-ignore - WatermelonDB decorator
    @field('is_controlled') isControlled!: boolean;
    // @ts-ignore - WatermelonDB decorator
    @field('is_high_risk') isHighRisk!: boolean;
    // @ts-ignore - WatermelonDB decorator
    @field('mdr1_sensitive') mdr1Sensitive!: boolean;
    // @ts-ignore - WatermelonDB decorator
    @text('pregnancy_risk') pregnancyRisk?: string;

    // NEW FIELDS for expansion
    // @ts-ignore - WatermelonDB decorator
    @field('is_emergency') isEmergency?: boolean;
    // @ts-ignore - WatermelonDB decorator
    @text('reversal_agent') reversalAgent?: string;
    // @ts-ignore - WatermelonDB decorator
    @field('antidote') antidote?: boolean;
    // @ts-ignore - WatermelonDB decorator
    @field('species_specific') speciesSpecific?: boolean;
    // @ts-ignore - WatermelonDB decorator
    @field('requires_dilution') requiresDilution?: boolean;
    // @ts-ignore - WatermelonDB decorator
    @field('refrigerate') refrigerate?: boolean;
    // @ts-ignore - WatermelonDB decorator
    @field('max_dose_critical') maxDoseCritical?: boolean;
    // @ts-ignore - WatermelonDB decorator
    @field('withdrawal_time') withdrawalTime?: boolean;
    // @ts-ignore - WatermelonDB decorator
    @field('compounded') compounded?: boolean;
    // @ts-ignore - WatermelonDB decorator
    @field('perivascular_necrosis') perivascularNecrosis?: boolean;
    // @ts-ignore - WatermelonDB decorator
    @field('feline_toxic') felineToxic?: boolean;
    // @ts-ignore - WatermelonDB decorator
    @field('reptile_toxicity') reptileToxicity?: boolean;
    // @ts-ignore - WatermelonDB decorator
    @field('cardiac_monitor') cardiacMonitor?: boolean;
    // @ts-ignore - WatermelonDB decorator
    @field('histamine_release') histamineRelease?: boolean;
    // @ts-ignore - WatermelonDB decorator
    @field('cartilage_risk') cartilageRisk?: boolean;
    // @ts-ignore - WatermelonDB decorator
    @text('timing') timing?: string;
    // @ts-ignore - WatermelonDB decorator
    @json('monitoring', sanitizeBrandNames) monitoring?: string[]; // reusing sanitizeBrandNames as it handles string[]
    // @ts-ignore - WatermelonDB decorator
    @json('toxicity', (raw: any) => raw) toxicity?: any;
    // @ts-ignore - WatermelonDB decorator
    @json('interactions', (raw: any) => raw) interactions?: any[];
    // @ts-ignore - WatermelonDB decorator
    @json('contraindications', (raw: any) => raw) contraindications?: any[];
    // @ts-ignore - WatermelonDB decorator
    @readonly @date('created_at') createdAt!: Date;
    // @ts-ignore - WatermelonDB decorator
    @readonly @date('updated_at') updatedAt!: Date;

    // @ts-ignore - WatermelonDB decorator
    @children('dosages') dosages!: any;
    // @ts-ignore - WatermelonDB decorator
    @children('drug_formulations') formulations!: any;

    // Search helper - matches generic name or any brand name
    matchesSearch(query: string): boolean {
        const lowerQuery = query.toLowerCase();
        if (this.genericName.toLowerCase().includes(lowerQuery)) return true;
        return this.brandNames.some((name: string) =>
            name.toLowerCase().includes(lowerQuery)
        );
    }

    // Get display name (generic + primary brand)
    get displayName(): string {
        if (this.brandNames.length > 0) {
            return `${this.genericName} (${this.brandNames[0]})`;
        }
        return this.genericName;
    }
}
