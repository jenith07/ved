/**
 * Database Provider
 * Initializes database and seeds data on app start
 */
import { database } from '@/src/database';
import { seedAllData } from '@/src/database/seeds';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface DatabaseContextType {
    isReady: boolean;
    isSeeding: boolean;
    error: Error | null;
}

const DatabaseContext = createContext<DatabaseContextType>({
    isReady: false,
    isSeeding: false,
    error: null,
});

export function useDatabaseStatus() {
    return useContext(DatabaseContext);
}

interface DatabaseProviderProps {
    children: ReactNode;
}

export function DatabaseProvider({ children }: DatabaseProviderProps) {
    const [isReady, setIsReady] = useState(false);
    const [isSeeding, setIsSeeding] = useState(false);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        const initDatabase = async () => {
            try {
                console.log('Initializing database...');

                // Check if we need to seed
                const drugsCollection = database.get('drugs');
                const drugCount = await drugsCollection.query().fetchCount();

                if (drugCount === 0) {
                    console.log('Database empty, seeding initial data...');
                    setIsSeeding(true);
                    await seedAllData(database);
                    setIsSeeding(false);
                }

                setIsReady(true);
                console.log('Database ready!');
            } catch (err) {
                console.error('Database initialization failed:', err);
                setError(err as Error);
            }
        };

        initDatabase();
    }, []);

    return (
        <DatabaseContext.Provider value={{ isReady, isSeeding, error }}>
            {children}
        </DatabaseContext.Provider>
    );
}

export default DatabaseProvider;
