/**
 * App Store
 * Global app state management with AsyncStorage for persistence
 */
import type { AppSettings, Species } from '@/src/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

// Default settings
const defaultSettings: AppSettings = {
    defaultWeightUnit: 'kg',
    defaultSpecies: undefined,
    darkMode: false,
    hapticFeedback: true,
    highContrastMode: false,
    autoSaveCalculations: true,
    showSafetyWarnings: true,
    requireConfirmationForHighRisk: true,
};

// Helper to get sync value (with fallback for SSR/initial load)
const getStoredValue = (key: string): string | null => {
    // For initial load, return null - actual value loaded async
    return null;
};

// Helper to set value
const setStoredValue = async (key: string, value: string): Promise<void> => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.error(`Failed to store ${key}:`, error);
    }
};

// Load settings async
const loadSettings = async (): Promise<AppSettings> => {
    try {
        const stored = await AsyncStorage.getItem('settings');
        if (stored) {
            return { ...defaultSettings, ...JSON.parse(stored) };
        }
    } catch (error) {
        console.error('Failed to load settings:', error);
    }
    return defaultSettings;
};

interface AppState {
    // Settings
    settings: AppSettings;
    updateSettings: (updates: Partial<AppSettings>) => void;
    resetSettings: () => void;
    loadInitialState: () => Promise<void>;

    // App state
    isOnline: boolean;
    setIsOnline: (online: boolean) => void;

    pendingSyncCount: number;
    setPendingSyncCount: (count: number) => void;

    // Recent items
    recentPatientIds: string[];
    addRecentPatient: (patientId: string) => void;

    recentDrugIds: string[];
    addRecentDrug: (drugId: string) => void;

    // Favorites
    favoriteDrugIds: string[];
    toggleFavoriteDrug: (drugId: string) => void;

    // Calculator state (persisted last used values)
    lastUsedSpecies: Species | null;
    setLastUsedSpecies: (species: Species) => void;

    lastUsedWeight: number | null;
    lastUsedWeightUnit: 'kg' | 'lbs';
    setLastUsedWeight: (weight: number, unit: 'kg' | 'lbs') => void;
}

export const useAppStore = create<AppState>((set, get) => ({
    // Settings
    settings: defaultSettings,

    loadInitialState: async () => {
        try {
            const [
                settingsStr,
                recentPatientsStr,
                recentDrugsStr,
                favoriteDrugsStr,
                lastSpecies,
                lastWeightStr,
                lastWeightUnit,
            ] = await Promise.all([
                AsyncStorage.getItem('settings'),
                AsyncStorage.getItem('recentPatients'),
                AsyncStorage.getItem('recentDrugs'),
                AsyncStorage.getItem('favoriteDrugs'),
                AsyncStorage.getItem('lastSpecies'),
                AsyncStorage.getItem('lastWeight'),
                AsyncStorage.getItem('lastWeightUnit'),
            ]);

            set({
                settings: settingsStr ? { ...defaultSettings, ...JSON.parse(settingsStr) } : defaultSettings,
                recentPatientIds: recentPatientsStr ? JSON.parse(recentPatientsStr) : [],
                recentDrugIds: recentDrugsStr ? JSON.parse(recentDrugsStr) : [],
                favoriteDrugIds: favoriteDrugsStr ? JSON.parse(favoriteDrugsStr) : [],
                lastUsedSpecies: lastSpecies as Species | null,
                lastUsedWeight: lastWeightStr ? parseFloat(lastWeightStr) : null,
                lastUsedWeightUnit: (lastWeightUnit as 'kg' | 'lbs') || 'kg',
            });
        } catch (error) {
            console.error('Failed to load initial state:', error);
        }
    },

    updateSettings: (updates) => {
        const newSettings = { ...get().settings, ...updates };
        set({ settings: newSettings });
        setStoredValue('settings', JSON.stringify(newSettings));
    },

    resetSettings: () => {
        set({ settings: defaultSettings });
        setStoredValue('settings', JSON.stringify(defaultSettings));
    },

    // App state
    isOnline: true,
    setIsOnline: (online) => set({ isOnline: online }),

    pendingSyncCount: 0,
    setPendingSyncCount: (count) => set({ pendingSyncCount: count }),

    // Recent items (keep last 10)
    recentPatientIds: [],
    addRecentPatient: (patientId) => {
        const current = get().recentPatientIds.filter((id) => id !== patientId);
        const updated = [patientId, ...current].slice(0, 10);
        set({ recentPatientIds: updated });
        setStoredValue('recentPatients', JSON.stringify(updated));
    },

    recentDrugIds: [],
    addRecentDrug: (drugId) => {
        const current = get().recentDrugIds.filter((id) => id !== drugId);
        const updated = [drugId, ...current].slice(0, 10);
        set({ recentDrugIds: updated });
        setStoredValue('recentDrugs', JSON.stringify(updated));
    },

    // Favorites
    favoriteDrugIds: [],
    toggleFavoriteDrug: (drugId) => {
        const current = get().favoriteDrugIds;
        const updated = current.includes(drugId)
            ? current.filter((id) => id !== drugId)
            : [...current, drugId];
        set({ favoriteDrugIds: updated });
        setStoredValue('favoriteDrugs', JSON.stringify(updated));
    },

    // Calculator state
    lastUsedSpecies: null,
    setLastUsedSpecies: (species) => {
        set({ lastUsedSpecies: species });
        setStoredValue('lastSpecies', species);
    },

    lastUsedWeight: null,
    lastUsedWeightUnit: 'kg',
    setLastUsedWeight: (weight, unit) => {
        set({ lastUsedWeight: weight, lastUsedWeightUnit: unit });
        setStoredValue('lastWeight', weight.toString());
        setStoredValue('lastWeightUnit', unit);
    },
}));

export default useAppStore;
