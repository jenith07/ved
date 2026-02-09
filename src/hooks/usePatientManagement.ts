/**
 * Patient Management Hooks
 * CRUD operations for patients
 */
import { database, getPatients, getWeightRecords } from '@/src/database';
import type Patient from '@/src/database/models/Patient';
import type WeightRecord from '@/src/database/models/WeightRecord';
import { Q } from '@nozbe/watermelondb';
import { useCallback, useState } from 'react';

interface CreatePatientData {
    name: string;
    ownerName: string;
    ownerPhone?: string;
    ownerEmail?: string;
    species: string;
    breed?: string;
    sex?: string;
    dateOfBirth?: Date;
    microchipId?: string;
    notes?: string;
    weight?: number;
    weightUnit?: 'kg' | 'lbs';
    bcs?: number;
}

interface UpdatePatientData {
    name?: string;
    ownerName?: string;
    ownerPhone?: string;
    ownerEmail?: string;
    breed?: string;
    sex?: string;
    dateOfBirth?: Date;
    microchipId?: string;
    notes?: string;
    profilePhotoUri?: string;
}

/**
 * Create a new patient
 */
export function useCreatePatient() {
    const [creating, setCreating] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const createPatient = useCallback(async (data: CreatePatientData): Promise<Patient | null> => {
        setCreating(true);
        setError(null);

        try {
            const patientsCollection = getPatients();
            const weightRecordsCollection = getWeightRecords();

            let newPatient: Patient | null = null;

            await database.write(async () => {
                // Create patient
                newPatient = await patientsCollection.create((record: any) => {
                    record.name = data.name;
                    record.ownerName = data.ownerName;
                    record.ownerPhone = data.ownerPhone || null;
                    record.ownerEmail = data.ownerEmail || null;
                    record.species = data.species;
                    record.breed = data.breed || null;
                    record.sex = data.sex || null;
                    record.dateOfBirth = data.dateOfBirth?.getTime() || null;
                    record.microchipId = data.microchipId || null;
                    record.notes = data.notes || null;
                    record.isDeleted = false;
                    record.syncStatus = 'pending';
                }) as Patient;

                // Add initial weight record if provided
                if (data.weight && newPatient) {
                    const weightKg = data.weightUnit === 'lbs' ? data.weight / 2.20462 : data.weight;

                    await weightRecordsCollection.create((record: any) => {
                        record.patientId = newPatient!.id;
                        record.weight = weightKg;
                        record.unit = data.weightUnit || 'kg';
                        record.bcs = data.bcs || null;
                        record.recordedAt = Date.now();
                    });
                }
            });

            return newPatient;
        } catch (err) {
            setError(err as Error);
            return null;
        } finally {
            setCreating(false);
        }
    }, []);

    return { createPatient, creating, error };
}

/**
 * Update a patient
 */
export function useUpdatePatient() {
    const [updating, setUpdating] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const updatePatient = useCallback(async (
        patientId: string,
        data: UpdatePatientData
    ): Promise<boolean> => {
        setUpdating(true);
        setError(null);

        try {
            const patientsCollection = getPatients();
            const patient = await patientsCollection.find(patientId);

            await database.write(async () => {
                await patient.update((record: any) => {
                    if (data.name !== undefined) record.name = data.name;
                    if (data.ownerName !== undefined) record.ownerName = data.ownerName;
                    if (data.ownerPhone !== undefined) record.ownerPhone = data.ownerPhone;
                    if (data.ownerEmail !== undefined) record.ownerEmail = data.ownerEmail;
                    if (data.breed !== undefined) record.breed = data.breed;
                    if (data.sex !== undefined) record.sex = data.sex;
                    if (data.dateOfBirth !== undefined) record.dateOfBirth = data.dateOfBirth?.getTime();
                    if (data.microchipId !== undefined) record.microchipId = data.microchipId;
                    if (data.notes !== undefined) record.notes = data.notes;
                    if (data.profilePhotoUri !== undefined) record.profilePhotoUri = data.profilePhotoUri;
                    record.syncStatus = 'pending';
                });
            });

            return true;
        } catch (err) {
            setError(err as Error);
            return false;
        } finally {
            setUpdating(false);
        }
    }, []);

    return { updatePatient, updating, error };
}

/**
 * Soft delete a patient
 */
export function useDeletePatient() {
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const deletePatient = useCallback(async (patientId: string): Promise<boolean> => {
        setDeleting(true);
        setError(null);

        try {
            const patientsCollection = getPatients();
            const patient = await patientsCollection.find(patientId);

            await database.write(async () => {
                await patient.update((record: any) => {
                    record.isDeleted = true;
                    record.syncStatus = 'pending';
                });
            });

            return true;
        } catch (err) {
            setError(err as Error);
            return false;
        } finally {
            setDeleting(false);
        }
    }, []);

    return { deletePatient, deleting, error };
}

/**
 * Add weight record for a patient
 */
export function useAddWeightRecord() {
    const [adding, setAdding] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const addWeightRecord = useCallback(async (
        patientId: string,
        weight: number,
        unit: 'kg' | 'lbs',
        bcs?: number,
        notes?: string
    ): Promise<boolean> => {
        setAdding(true);
        setError(null);

        try {
            const weightRecordsCollection = getWeightRecords();
            const weightKg = unit === 'lbs' ? weight / 2.20462 : weight;

            await database.write(async () => {
                await weightRecordsCollection.create((record: any) => {
                    record.patientId = patientId;
                    record.weight = weightKg;
                    record.unit = unit;
                    record.bcs = bcs || null;
                    record.recordedAt = Date.now();
                    record.notes = notes || null;
                });
            });

            return true;
        } catch (err) {
            setError(err as Error);
            return false;
        } finally {
            setAdding(false);
        }
    }, []);

    return { addWeightRecord, adding, error };
}

/**
 * Get weight history for a patient
 */
export function useWeightHistory(patientId: string) {
    const [records, setRecords] = useState<WeightRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const loadHistory = useCallback(async () => {
        if (!patientId) {
            setRecords([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const weightRecordsCollection = getWeightRecords();

            const results = await weightRecordsCollection
                .query(
                    Q.where('patient_id', patientId),
                    Q.sortBy('recorded_at', Q.desc)
                )
                .fetch();

            setRecords(results as WeightRecord[]);
        } catch (err) {
            setError(err as Error);
        } finally {
            setLoading(false);
        }
    }, [patientId]);

    // Load on mount and when patientId changes
    useState(() => {
        loadHistory();
    });

    return { records, loading, error, refresh: loadHistory };
}
