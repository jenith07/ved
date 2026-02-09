/**
 * Database Hooks
 * React hooks for database operations
 */
import { Q } from '@nozbe/watermelondb';
import { useCallback, useEffect, useState } from 'react';
import { database, getCalculations, getDosages, getDrugs, getPatients, getToxins } from './index';
import type Dosage from './models/Dosage';
import type Drug from './models/Drug';
import type Patient from './models/Patient';
import type Toxin from './models/Toxin';

/**
 * Search drugs by name (generic or brand)
 */
export function useDrugSearch(query: string, category?: string) {
    const [drugs, setDrugs] = useState<Drug[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!query || query.length < 2) {
            setDrugs([]);
            return;
        }

        setLoading(true);
        setError(null);

        const searchDrugs = async () => {
            try {
                const drugsCollection = getDrugs();
                let queryConditions: Q.Clause[] = [
                    Q.or(
                        Q.where('generic_name', Q.like(`%${Q.sanitizeLikeString(query)}%`)),
                        Q.where('brand_names', Q.like(`%${Q.sanitizeLikeString(query)}%`))
                    ),
                ];

                if (category) {
                    queryConditions.push(Q.where('category', category));
                }

                const results = await drugsCollection.query(...queryConditions).fetch();
                setDrugs(results as Drug[]);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(searchDrugs, 300);
        return () => clearTimeout(debounce);
    }, [query, category]);

    return { drugs, loading, error };
}

/**
 * Get all drugs with optional filtering
 */
export function useDrugs(options?: { category?: string; highRiskOnly?: boolean }) {
    const [drugs, setDrugs] = useState<Drug[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const loadDrugs = async () => {
            try {
                const drugsCollection = getDrugs();
                let queryConditions: Q.Clause[] = [];

                if (options?.category) {
                    queryConditions.push(Q.where('category', options.category));
                }
                if (options?.highRiskOnly) {
                    queryConditions.push(Q.where('is_high_risk', true));
                }

                const results = await drugsCollection
                    .query(...queryConditions)
                    .fetch();
                setDrugs(results as Drug[]);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        loadDrugs();
    }, [options?.category, options?.highRiskOnly]);

    return { drugs, loading, error };
}

/**
 * Get dosages for a specific drug and species
 */
export function useDosages(drugId: string, species?: string) {
    const [dosages, setDosages] = useState<Dosage[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!drugId) {
            setDosages([]);
            setLoading(false);
            return;
        }

        const loadDosages = async () => {
            try {
                const dosagesCollection = getDosages();
                let queryConditions: Q.Clause[] = [Q.where('drug_id', drugId)];

                if (species) {
                    queryConditions.push(Q.where('species', species));
                }

                const results = await dosagesCollection.query(...queryConditions).fetch();
                setDosages(results as Dosage[]);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        loadDosages();
    }, [drugId, species]);

    return { dosages, loading, error };
}

/**
 * Get drug categories for filtering
 */
export function useDrugCategories() {
    const [categories, setCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCategories = async () => {
            try {
                const drugsCollection = getDrugs();
                const allDrugs = await drugsCollection.query().fetch();
                const uniqueCategories = [...new Set(allDrugs.map((d: any) => d.category))];
                setCategories(uniqueCategories.sort());
            } catch (err) {
                console.error('Failed to load categories:', err);
            } finally {
                setLoading(false);
            }
        };

        loadCategories();
    }, []);

    return { categories, loading };
}

/**
 * Search patients
 */
export function usePatientSearch(query: string, species?: string) {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const searchPatients = async () => {
            try {
                setLoading(true);
                const patientsCollection = getPatients();
                let queryConditions: Q.Clause[] = [Q.where('is_deleted', false)];

                if (query && query.length >= 2) {
                    queryConditions.push(
                        Q.or(
                            Q.where('name', Q.like(`%${Q.sanitizeLikeString(query)}%`)),
                            Q.where('owner_name', Q.like(`%${Q.sanitizeLikeString(query)}%`))
                        )
                    );
                }

                if (species) {
                    queryConditions.push(Q.where('species', species));
                }

                const results = await patientsCollection
                    .query(...queryConditions)
                    .fetch();
                setPatients(results as Patient[]);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(searchPatients, 300);
        return () => clearTimeout(debounce);
    }, [query, species]);

    return { patients, loading, error };
}

/**
 * Get a single patient by ID
 */
export function usePatient(patientId: string) {
    const [patient, setPatient] = useState<Patient | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        if (!patientId) {
            setPatient(null);
            setLoading(false);
            return;
        }

        const loadPatient = async () => {
            try {
                const patientsCollection = getPatients();
                const result = await patientsCollection.find(patientId);
                setPatient(result as Patient);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        loadPatient();
    }, [patientId]);

    return { patient, loading, error };
}

/**
 * Search toxins
 */
export function useToxinSearch(query: string, category?: string) {
    const [toxins, setToxins] = useState<Toxin[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const searchToxins = async () => {
            try {
                setLoading(true);
                const toxinsCollection = getToxins();
                let queryConditions: Q.Clause[] = [];

                if (query && query.length >= 2) {
                    queryConditions.push(
                        Q.where('name', Q.like(`%${Q.sanitizeLikeString(query)}%`))
                    );
                }

                if (category) {
                    queryConditions.push(Q.where('category', category));
                }

                const results = await toxinsCollection.query(...queryConditions).fetch();
                setToxins(results as Toxin[]);
            } catch (err) {
                setError(err as Error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(searchToxins, 300);
        return () => clearTimeout(debounce);
    }, [query, category]);

    return { toxins, loading, error };
}

/**
 * Get recent calculations
 */
export function useRecentCalculations(limit: number = 10) {
    const [calculations, setCalculations] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadCalculations = async () => {
            try {
                const calculationsCollection = getCalculations();
                const results = await calculationsCollection
                    .query(Q.sortBy('created_at', Q.desc), Q.take(limit))
                    .fetch();
                setCalculations(results);
            } catch (err) {
                console.error('Failed to load calculations:', err);
            } finally {
                setLoading(false);
            }
        };

        loadCalculations();
    }, [limit]);

    return { calculations, loading };
}

/**
 * Save a calculation to history
 */
export function useSaveCalculation() {
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    const saveCalculation = useCallback(async (data: {
        patientId?: string;
        drugId: string;
        species: string;
        weight: number;
        weightUnit: string;
        bcs?: number;
        route: string;
        indication: string;
        doseRate: number;
        calculatedDose: number;
        doseUnit: string;
        frequency: string;
        volume?: number;
        safetyLevel: string;
        warnings?: string[];
        notes?: string;
    }) => {
        setSaving(true);
        setError(null);

        try {
            const calculationsCollection = getCalculations();

            await database.write(async () => {
                await calculationsCollection.create((record: any) => {
                    record.patientId = data.patientId || null;
                    record.drugId = data.drugId;
                    record.species = data.species;
                    record.weight = data.weight;
                    record.weightUnit = data.weightUnit;
                    record.bcs = data.bcs || null;
                    record.route = data.route;
                    record.indication = data.indication;
                    record.doseRate = data.doseRate;
                    record.calculatedDose = data.calculatedDose;
                    record.doseUnit = data.doseUnit;
                    record.frequency = data.frequency;
                    record.volume = data.volume || null;
                    record.safetyLevel = data.safetyLevel;
                    record._raw.warnings = data.warnings ? JSON.stringify(data.warnings) : null;
                    record.notes = data.notes || null;
                    record.syncStatus = 'pending';
                });
            });

            return true;
        } catch (err) {
            setError(err as Error);
            return false;
        } finally {
            setSaving(false);
        }
    }, []);

    return { saveCalculation, saving, error };
}
