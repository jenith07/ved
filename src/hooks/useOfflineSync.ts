/**
 * Offline Sync Manager
 * Handles connectivity detection and sync queue management
 */
import { database } from '@/src/database';
import { useAppStore } from '@/src/store/useAppStore';
import { Q } from '@nozbe/watermelondb';
import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useCallback, useEffect, useState } from 'react';

// Sync status types
type SyncStatus = 'idle' | 'syncing' | 'error' | 'offline';

interface SyncQueueItem {
    id: string;
    tableName: string;
    recordId: string;
    action: 'create' | 'update' | 'delete';
    data: string;
    attempts: number;
    lastAttemptAt: number | null;
    error: string | null;
}

/**
 * Hook to monitor network connectivity
 */
export function useNetworkStatus() {
    const { setIsOnline, isOnline } = useAppStore();
    const [connectionType, setConnectionType] = useState<string | null>(null);

    useEffect(() => {
        // Subscribe to network state updates
        const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
            const online = state.isConnected && state.isInternetReachable !== false;
            setIsOnline(online ?? false);
            setConnectionType(state.type);
        });

        // Get initial state
        NetInfo.fetch().then((state: NetInfoState) => {
            const online = state.isConnected && state.isInternetReachable !== false;
            setIsOnline(online ?? false);
            setConnectionType(state.type);
        });

        return () => unsubscribe();
    }, [setIsOnline]);

    return { isOnline, connectionType };
}

/**
 * Hook for managing the sync queue
 */
export function useSyncQueue() {
    const [pendingCount, setPendingCount] = useState(0);
    const [syncStatus, setSyncStatus] = useState<SyncStatus>('idle');
    const [lastSyncAt, setLastSyncAt] = useState<number | null>(null);
    const { setPendingSyncCount, isOnline } = useAppStore();

    // Load pending count
    const refreshPendingCount = useCallback(async () => {
        try {
            // Count records with pending sync status across tables
            const tables = ['patients', 'calculations', 'patient_photos'];
            let total = 0;

            for (const table of tables) {
                const collection = database.get(table);
                const count = await collection
                    .query(Q.where('sync_status', 'pending'))
                    .fetchCount();
                total += count;
            }

            setPendingCount(total);
            setPendingSyncCount(total);
        } catch (err) {
            console.error('Failed to count pending sync items:', err);
        }
    }, [setPendingSyncCount]);

    // Initial load
    useEffect(() => {
        refreshPendingCount();
    }, [refreshPendingCount]);

    // Attempt sync when online
    const attemptSync = useCallback(async () => {
        if (!isOnline || syncStatus === 'syncing') {
            return;
        }

        setSyncStatus('syncing');

        try {
            // In a real app, this would sync with a remote server
            // For now, we'll just mark items as synced
            const tables = ['patients', 'calculations', 'patient_photos'];

            await database.write(async () => {
                for (const table of tables) {
                    const collection = database.get(table);
                    const pendingRecords = await collection
                        .query(Q.where('sync_status', 'pending'))
                        .fetch();

                    for (const record of pendingRecords) {
                        await record.update((r: any) => {
                            r.syncStatus = 'synced';
                        });
                    }
                }
            });

            setLastSyncAt(Date.now());
            setSyncStatus('idle');
            await refreshPendingCount();
        } catch (err) {
            console.error('Sync failed:', err);
            setSyncStatus('error');
        }
    }, [isOnline, syncStatus, refreshPendingCount]);

    // Auto-sync when coming online
    useEffect(() => {
        if (isOnline && pendingCount > 0) {
            attemptSync();
        }
    }, [isOnline, pendingCount, attemptSync]);

    return {
        pendingCount,
        syncStatus,
        lastSyncAt,
        refreshPendingCount,
        attemptSync,
    };
}

/**
 * Hook for conflict resolution
 */
export function useConflictResolution() {
    const [conflicts, setConflicts] = useState<any[]>([]);

    const resolveConflict = useCallback(async (
        recordId: string,
        resolution: 'local' | 'remote'
    ) => {
        // In a real app, this would handle merge conflicts
        // For MVP, we'll just use the selected version
        console.log(`Resolving conflict for ${recordId} with ${resolution} version`);

        // Remove from conflicts list
        setConflicts((prev) => prev.filter((c) => c.id !== recordId));
    }, []);

    return { conflicts, resolveConflict };
}

/**
 * Background sync manager
 * Call this in the app root to enable background sync
 */
export function useBackgroundSync(intervalMs: number = 30000) {
    const { isOnline } = useAppStore();
    const { attemptSync, pendingCount } = useSyncQueue();

    useEffect(() => {
        if (!isOnline || pendingCount === 0) return;

        // Sync immediately when coming online
        attemptSync();

        // Set up periodic sync
        const interval = setInterval(() => {
            if (isOnline && pendingCount > 0) {
                attemptSync();
            }
        }, intervalMs);

        return () => clearInterval(interval);
    }, [isOnline, pendingCount, attemptSync, intervalMs]);
}

export default {
    useNetworkStatus,
    useSyncQueue,
    useConflictResolution,
    useBackgroundSync,
};
