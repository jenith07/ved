/**
 * Patient Model
 * Represents a patient (animal) in the system
 */
import { Model } from '@nozbe/watermelondb';
import { children, date, field, lazy, readonly, text } from '@nozbe/watermelondb/decorators';
import type { Associations } from '@nozbe/watermelondb/Model';

export default class Patient extends Model {
    static table = 'patients';

    static associations: Associations = {
        weight_records: { type: 'has_many', foreignKey: 'patient_id' },
        calculations: { type: 'has_many', foreignKey: 'patient_id' },
        patient_conditions: { type: 'has_many', foreignKey: 'patient_id' },
        patient_allergies: { type: 'has_many', foreignKey: 'patient_id' },
        patient_photos: { type: 'has_many', foreignKey: 'patient_id' },
    };

    // @ts-ignore - WatermelonDB decorator
    @text('name') name!: string;
    // @ts-ignore - WatermelonDB decorator
    @text('owner_name') ownerName!: string;
    // @ts-ignore - WatermelonDB decorator
    @text('owner_phone') ownerPhone?: string;
    // @ts-ignore - WatermelonDB decorator
    @text('owner_email') ownerEmail?: string;
    // @ts-ignore - WatermelonDB decorator
    @text('species') species!: string;
    // @ts-ignore - WatermelonDB decorator
    @text('breed') breed?: string;
    // @ts-ignore - WatermelonDB decorator
    @text('sex') sex?: string;
    // @ts-ignore - WatermelonDB decorator
    @field('date_of_birth') dateOfBirth?: number;
    // @ts-ignore - WatermelonDB decorator
    @text('microchip_id') microchipId?: string;
    // @ts-ignore - WatermelonDB decorator
    @text('notes') notes?: string;
    // @ts-ignore - WatermelonDB decorator
    @text('profile_photo_uri') profilePhotoUri?: string;
    // @ts-ignore - WatermelonDB decorator
    @field('is_deleted') isDeleted!: boolean;
    // @ts-ignore - WatermelonDB decorator
    @readonly @date('created_at') createdAt!: Date;
    // @ts-ignore - WatermelonDB decorator
    @readonly @date('updated_at') updatedAt!: Date;
    // @ts-ignore - WatermelonDB decorator
    @text('local_sync_status') localSyncStatus!: string;

    // @ts-ignore - WatermelonDB decorator
    @children('weight_records') weightRecords!: any;
    // @ts-ignore - WatermelonDB decorator  
    @children('calculations') calculations!: any;
    // @ts-ignore - WatermelonDB decorator
    @children('patient_conditions') conditions!: any;
    // @ts-ignore - WatermelonDB decorator
    @children('patient_allergies') allergies!: any;
    // @ts-ignore - WatermelonDB decorator
    @children('patient_photos') photos!: any;

    // Computed properties
    // @ts-ignore - WatermelonDB decorator
    @lazy
    latestWeight = this.weightRecords.extend(
        (Q: any) => Q.sortBy('recorded_at', 'desc').take(1)
    );

    get age(): string | null {
        if (!this.dateOfBirth) return null;
        const now = Date.now();
        const ageMs = now - this.dateOfBirth;
        const years = Math.floor(ageMs / (365.25 * 24 * 60 * 60 * 1000));
        const months = Math.floor((ageMs % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));

        if (years > 0) {
            return months > 0 ? `${years}y ${months}m` : `${years}y`;
        }
        return `${months}m`;
    }
}
