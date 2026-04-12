import initSqlJs, { type Database, type SqlJsStatic } from 'sql.js';
import wasmUrl from 'sql.js/dist/sql-wasm.wasm?url';
import { ensureSchema, SCHEMA_VERSION } from './schema';

const DATABASE_NAME = 'classic-browser-tetris';
const DATABASE_VERSION = 1;
const STORE_NAME = 'sqlite';
const DATABASE_FILE_KEY = 'main';

let sqlJsPromise: Promise<SqlJsStatic> | null = null;

function getIndexedDb(): IDBFactory {
  if (!globalThis.indexedDB) {
    throw new Error('IndexedDB is not available in this browser environment.');
  }

  return globalThis.indexedDB;
}

function openDatabaseStore(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = getIndexedDb().open(DATABASE_NAME, DATABASE_VERSION);

    request.onerror = () => {
      reject(request.error ?? new Error('Failed to open IndexedDB for SQLite persistence.'));
    };

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(STORE_NAME)) {
        database.createObjectStore(STORE_NAME);
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
}

async function runReadRequest<T>(
  operation: (store: IDBObjectStore) => IDBRequest<T>,
  errorMessage: string,
): Promise<T> {
  const database = await openDatabaseStore();

  return new Promise((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readonly');
    const request = operation(transaction.objectStore(STORE_NAME));

    request.onerror = () => {
      reject(request.error ?? new Error(errorMessage));
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    transaction.oncomplete = () => {
      database.close();
    };

    transaction.onabort = () => {
      database.close();
      reject(transaction.error ?? new Error(errorMessage));
    };
  });
}

async function runWriteTransaction(
  operation: (store: IDBObjectStore) => void,
  errorMessage: string,
): Promise<void> {
  const database = await openDatabaseStore();

  await new Promise<void>((resolve, reject) => {
    const transaction = database.transaction(STORE_NAME, 'readwrite');
    operation(transaction.objectStore(STORE_NAME));

    transaction.onerror = () => {
      reject(transaction.error ?? new Error(errorMessage));
    };

    transaction.onabort = () => {
      reject(transaction.error ?? new Error(errorMessage));
    };

    transaction.oncomplete = () => {
      resolve();
    };
  });

  database.close();
}

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

async function readPersistedDatabase(): Promise<Uint8Array | null> {
  const result = await runReadRequest(
    (store) => store.get(DATABASE_FILE_KEY),
    'Failed to read SQLite database from IndexedDB.',
  );

  if (!result) {
    return null;
  }

  return new Uint8Array(result as ArrayBuffer);
}

async function writePersistedDatabase(binary: Uint8Array): Promise<void> {
  await runWriteTransaction(
    (store) => {
      store.put(binary, DATABASE_FILE_KEY);
    },
    'Failed to write SQLite database to IndexedDB.',
  );
}

export function loadSqlJs(): Promise<SqlJsStatic> {
  if (!sqlJsPromise) {
    sqlJsPromise = initSqlJs({
      locateFile: () => {
        if (typeof window === 'undefined') {
          return `${process.cwd().replace(/\\/g, '/')}/node_modules/sql.js/dist/sql-wasm.wasm`;
        }

        return wasmUrl;
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

export async function initializeSQLiteDatabase(): Promise<SQLiteDatabaseHandle> {
  const sqlJs = await loadSqlJs();
  const persistedBinary = await readPersistedDatabase();
  const { database, schemaVersion } = createHydratedDatabase(sqlJs, persistedBinary);

  return {
    database,
    sqlJs,
    schemaVersion,
    persist: async () => {
      const binary = database.export();
      await writePersistedDatabase(binary);
    },
  };
}

export async function resetSQLiteDatabase(): Promise<void> {
  await runWriteTransaction(
    (store) => {
      store.delete(DATABASE_FILE_KEY);
    },
    'Failed to reset persisted SQLite database.',
  );
}

export const SQLITE_PERSISTENCE_INFO = {
  databaseName: DATABASE_NAME,
  storeName: STORE_NAME,
  fileKey: DATABASE_FILE_KEY,
  schemaVersion: SCHEMA_VERSION,
} as const;