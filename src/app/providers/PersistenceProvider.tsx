import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import {
  type PersistenceHealth,
  type PersistenceWarning,
  type UIStateDocument,
  type UserSettingsDocument,
} from '../../types/persistence';
import { initializeSQLiteDatabase, type SQLiteDatabaseHandle } from '../../persistence/sqlite/database';
import { readSettings } from '../../persistence/local-storage/settingsStore';
import { readUIState } from '../../persistence/local-storage/uiStateStore';
import { seedDatabase, seedLocalPersistence } from '../../persistence/seed/seedDatabase';

export interface PersistenceContextValue {
  databaseHandle: SQLiteDatabaseHandle | null;
  settings: UserSettingsDocument;
  uiState: UIStateDocument;
  bestScore: number;
  health: PersistenceHealth;
  warnings: readonly PersistenceWarning[];
  isHydrated: boolean;
  refresh: () => Promise<void>;
}

const PersistenceContext = createContext<PersistenceContextValue | null>(null);

function readBestScore(handle: SQLiteDatabaseHandle): number {
  const result = handle.database.exec('SELECT MAX(final_score) FROM scores');
  return Number(result[0]?.values[0]?.[0] ?? 0);
}

export function PersistenceProvider({ children }: PropsWithChildren) {
  const [databaseHandle, setDatabaseHandle] = useState<SQLiteDatabaseHandle | null>(null);
  const [settings, setSettings] = useState<UserSettingsDocument>(() => readSettings());
  const [uiState, setUiState] = useState<UIStateDocument>(() => readUIState());
  const [bestScore, setBestScore] = useState(0);
  const [health, setHealth] = useState<PersistenceHealth>('hydrating');
  const [warnings, setWarnings] = useState<PersistenceWarning[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  async function initializePersistence() {
    const nextWarnings: PersistenceWarning[] = [];

    try {
      seedLocalPersistence();
      const nextSettings = readSettings();
      const nextUIState = readUIState();

      const handle = await initializeSQLiteDatabase();
      seedDatabase(handle.database);
      await handle.persist();

      setSettings(nextSettings);
      setUiState(nextUIState);
      setDatabaseHandle(handle);
      setBestScore(readBestScore(handle));
      setHealth('ready');
    } catch (error) {
      nextWarnings.push({
        code: 'sqlite_unavailable',
        message: error instanceof Error ? error.message : 'SQLite persistence is unavailable.',
        recoverable: true,
      });
      setDatabaseHandle(null);
      setBestScore(0);
      setHealth('warning');
    }

    setWarnings(nextWarnings);
    setIsHydrated(true);
  }

  async function hydratePersistence() {
    setHealth('hydrating');
    setWarnings([]);
    await initializePersistence();
  }

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      void initializePersistence();
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, []);

  const value: PersistenceContextValue = {
    databaseHandle,
    settings,
    uiState,
    bestScore,
    health,
    warnings,
    isHydrated,
    refresh: hydratePersistence,
  };

  return <PersistenceContext.Provider value={value}>{children}</PersistenceContext.Provider>;
}

export function usePersistence() {
  const context = useContext(PersistenceContext);

  if (!context) {
    throw new Error('usePersistence must be used within a PersistenceProvider.');
  }

  return context;
}