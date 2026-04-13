import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from 'react';
import { getRuntimeMode } from '../../platform/runtime';
import {
  type OverlayState,
  type PersistenceHealth,
  type PersistenceWarning,
  type ScoreRecord,
  type SessionRecord,
  type UIStateDocument,
  type UserSettingsDocument,
} from '../../types/persistence';
import type { ReplayEnvelope } from '../../types/replay';
import { commitBestScore, readBestScore } from '../../persistence/local-storage/bestScoreStore';
import { initializeSQLiteDatabase, type SQLiteDatabaseHandle } from '../../persistence/sqlite/database';
import { readSettings } from '../../persistence/local-storage/settingsStore';
import { mergeUIState, readUIState, writeUIState } from '../../persistence/local-storage/uiStateStore';
import { insertReplayEnvelope } from '../../persistence/sqlite/replayRepository';
import { insertScoreRecord } from '../../persistence/sqlite/scoreRepository';
import { insertSessionRecord } from '../../persistence/sqlite/sessionRepository';
import { seedDatabase, seedLocalPersistence } from '../../persistence/seed/seedDatabase';

export interface CompletedSessionPayload {
  session: SessionRecord;
  score: ScoreRecord;
  replay: ReplayEnvelope;
}

export interface PersistenceContextValue {
  databaseHandle: SQLiteDatabaseHandle | null;
  settings: UserSettingsDocument;
  uiState: UIStateDocument;
  bestScore: number;
  health: PersistenceHealth;
  warnings: readonly PersistenceWarning[];
  isHydrated: boolean;
  refresh: () => Promise<void>;
  recordCompletedSession: (payload: CompletedSessionPayload) => Promise<void>;
  updateOverlayState: (overlayState: OverlayState) => void;
}

const PersistenceContext = createContext<PersistenceContextValue | null>(null);

export function PersistenceProvider({ children }: PropsWithChildren) {
  const [databaseHandle, setDatabaseHandle] = useState<SQLiteDatabaseHandle | null>(null);
  const [settings, setSettings] = useState<UserSettingsDocument>(() => readSettings());
  const [uiState, setUiState] = useState<UIStateDocument>(() => readUIState());
  const [bestScore, setBestScore] = useState(() => readBestScore());
  const [health, setHealth] = useState<PersistenceHealth>('hydrating');
  const [warnings, setWarnings] = useState<PersistenceWarning[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  async function initializePersistence() {
    const nextWarnings: PersistenceWarning[] = [];
    const runtimeMode = getRuntimeMode();

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
      setBestScore(readBestScore());
      setHealth('ready');
    } catch (error) {
      nextWarnings.push({
        code: 'sqlite_unavailable',
        message: error instanceof Error
          ? error.message
          : runtimeMode === 'desktop'
            ? 'Desktop SQLite persistence is unavailable.'
            : 'SQLite persistence is unavailable.',
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

  async function recordCompletedSession(payload: CompletedSessionPayload): Promise<void> {
    const nextBestScore = commitBestScore(payload.score.final_score);
    setBestScore(nextBestScore);

    if (!databaseHandle) {
      return;
    }

    try {
      insertSessionRecord(databaseHandle.database, {
        ...payload.session,
        best_score_at_end: nextBestScore,
      });
      insertScoreRecord(databaseHandle.database, {
        ...payload.score,
        is_personal_best: payload.score.final_score >= nextBestScore,
      });
      insertReplayEnvelope(databaseHandle.database, payload.replay);
      await databaseHandle.persist();
    } catch (error) {
      setWarnings((currentWarnings) => ([
        ...currentWarnings,
        {
          code: 'replay_write_failed',
          message: error instanceof Error ? error.message : 'Failed to persist the completed session.',
          recoverable: true,
        },
      ]));
      setHealth('warning');
    }
  }

  function updateOverlayState(overlayState: OverlayState): void {
    const nextUIState = mergeUIState({ last_overlay: overlayState });
    writeUIState(nextUIState);
    setUiState(nextUIState);
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
    recordCompletedSession,
    updateOverlayState,
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