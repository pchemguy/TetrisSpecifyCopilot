import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import {
  getRuntimeMode,
  isDesktopPersistenceErrorCode,
  type DesktopPersistenceErrorCode,
} from '../../platform/runtime';
import {
  BROWSER_SQLITE_STORAGE,
  createBrowserPersistenceAdapter,
  type SQLitePersistenceAdapter,
} from '../runtime/browserAdapter';
import { createDesktopPersistenceAdapter } from '../runtime/desktopAdapter';
import { ensureSchema, SCHEMA_VERSION } from './schema';

const BEST_SCORE_META_KEY = 'best_score';

type CodedPersistenceError = Error & {
  code: DesktopPersistenceErrorCode;
};

let sqlJsPromise: Promise<SqlJsStatic> | null = null;

function createHydratedDatabase(sqlJs: SqlJsStatic, persistedBinary: Uint8Array | null): {
  database: Database;
  schemaVersion: number;
} {
  const database = persistedBinary ? new sqlJs.Database(persistedBinary) : new sqlJs.Database();
  const schemaVersion = ensureSchema(database);

  return {
    database,
    schemaVersion,
  };
}

function normalizeBestScore(value: unknown): number {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue) || numericValue < 0) {
    return 0;
  }

  return Math.floor(numericValue);
}

function createPersistenceError(
  code: DesktopPersistenceErrorCode,
  message: string,
): CodedPersistenceError {
  const error = new Error(message) as CodedPersistenceError;
  error.code = code;
  return error;
}

function normalizeDesktopPersistenceError(
  error: unknown,
  fallbackCode: DesktopPersistenceErrorCode,
  fallbackMessage: string,
): CodedPersistenceError {
  if (error instanceof Error && isDesktopPersistenceErrorCode((error as Partial<CodedPersistenceError>).code)) {
    return error as CodedPersistenceError;
  }

  return createPersistenceError(
    fallbackCode,
    error instanceof Error && error.message ? error.message : fallbackMessage,
  );
}

async function readPersistedDatabase(): Promise<Uint8Array | null> {
  return resolvePersistenceAdapter().readDatabaseBytes();
}

async function writePersistedDatabase(binary: Uint8Array): Promise<void> {
  await resolvePersistenceAdapter().writeDatabaseBytes(binary);
}

function resolvePersistenceAdapter(): SQLitePersistenceAdapter {
  return getRuntimeMode() === 'desktop'
    ? createDesktopPersistenceAdapter()
    : createBrowserPersistenceAdapter();
}

export function loadSqlJs(): Promise<SqlJsStatic> {
  if (!sqlJsPromise) {
    sqlJsPromise = initSqlJs({
      locateFile: () => {
        if (typeof window === 'undefined') {
          return `${process.cwd().replace(/\\/g, '/')}/node_modules/sql.js/dist/sql-wasm.wasm`;
        }

        return new URL(wasmUrl, window.location.href).toString();
      },
    });
  }

  return sqlJsPromise!;
}

export interface SQLiteDatabaseHandle {
  database: Database;
  sqlJs: SqlJsStatic;
  schemaVersion: number;
  persist: () => Promise<void>;
}

export async function createSqlDatabase(): Promise<Database> {
  const sqlJs = await loadSqlJs();
  return createHydratedDatabase(sqlJs, null).database;
}

export function readPersistedBestScore(database: Database): number {
  const result = database.exec(
    `SELECT value FROM app_meta WHERE key = '${BEST_SCORE_META_KEY}' LIMIT 1`,
  );

  if (result.length === 0 || result[0].values.length === 0) {
    return 0;
  }

  return normalizeBestScore(result[0].values[0][0]);
}

export function writePersistedBestScore(database: Database, score: number): number {
  const normalizedScore = normalizeBestScore(score);
  const nextBestScore = Math.max(readPersistedBestScore(database), normalizedScore);

  database.run(
    `
      INSERT INTO app_meta (key, value)
      VALUES (?, ?)
      ON CONFLICT(key) DO UPDATE SET value = excluded.value
    `,
    [BEST_SCORE_META_KEY, String(nextBestScore)],
  );

  return nextBestScore;
}

export async function initializeSQLiteDatabase(): Promise<SQLiteDatabaseHandle> {
  const runtimeMode = getRuntimeMode();

  try {
    const sqlJs = await loadSqlJs();
    const persistedBinary = await readPersistedDatabase();

    let hydratedDatabase: ReturnType<typeof createHydratedDatabase>;

    try {
      hydratedDatabase = createHydratedDatabase(sqlJs, persistedBinary);
    } catch (error) {
      if (runtimeMode === 'desktop') {
        throw normalizeDesktopPersistenceError(
          error,
          persistedBinary ? 'desktop_data_invalid' : 'desktop_persistence_disabled',
          persistedBinary
            ? 'Desktop best-score data was invalid, so the app started with the default best score.'
            : 'Desktop persistence is unavailable for this run.',
        );
      }

      throw error;
    }

    const { database, schemaVersion } = hydratedDatabase;

    return {
      database,
      sqlJs,
      schemaVersion,
      persist: async () => {
        const binary = database.export();

        try {
          await writePersistedDatabase(binary);
        } catch (error) {
          if (runtimeMode === 'desktop') {
            throw normalizeDesktopPersistenceError(
              error,
              'desktop_write_failed',
              'Desktop persistence could not save the local database.',
            );
          }

          throw error;
        }
      },
    };
  } catch (error) {
    if (runtimeMode === 'desktop') {
      throw normalizeDesktopPersistenceError(
        error,
        'desktop_persistence_disabled',
        'Desktop persistence is unavailable for this run.',
      );
    }

    throw error;
  }
}

export async function resetSQLiteDatabase(): Promise<void> {
  if (getRuntimeMode() === 'desktop') {
    throw new Error('Resetting SQLite persistence is only supported in browser mode.');
  }

  if (!globalThis.indexedDB) {
    throw new Error('IndexedDB is not available in this browser environment.');
  }

  const database = await new Promise<IDBDatabase>((resolve, reject) => {
    const request = globalThis.indexedDB.open(
      BROWSER_SQLITE_STORAGE.databaseName,
      BROWSER_SQLITE_STORAGE.databaseVersion,
    );

    request.onerror = () => {
      reject(request.error ?? new Error('Failed to open IndexedDB for SQLite reset.'));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(BROWSER_SQLITE_STORAGE.storeName, 'readwrite');
    transaction.objectStore(BROWSER_SQLITE_STORAGE.storeName).delete(BROWSER_SQLITE_STORAGE.fileKey);

    transaction.onerror = () => {
      reject(transaction.error ?? new Error('Failed to reset persisted SQLite database.'));
    };

    transaction.onabort = () => {
      reject(transaction.error ?? new Error('Failed to reset persisted SQLite database.'));
    };

    transaction.oncomplete = () => {
      resolve();
    };
  });

  database.close();
}

export const SQLITE_PERSISTENCE_INFO = {
  databaseName: BROWSER_SQLITE_STORAGE.databaseName,
  storeName: BROWSER_SQLITE_STORAGE.storeName,
  fileKey: BROWSER_SQLITE_STORAGE.fileKey,
  schemaVersion: SCHEMA_VERSION,
} as const;