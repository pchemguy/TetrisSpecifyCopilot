import { getRuntimeMode } from '../../platform/runtime';

export interface SQLitePersistenceAdapter {
  readDatabaseBytes: () => Promise<Uint8Array | null>;
  writeDatabaseBytes: (bytes: Uint8Array) => Promise<void>;
}

const DATABASE_NAME = 'classic-browser-tetris';
const DATABASE_VERSION = 1;
const STORE_NAME = 'sqlite';
const DATABASE_FILE_KEY = 'main';

function assertBrowserRuntime(): void {
  if (getRuntimeMode() !== 'browser') {
    throw new Error('Browser persistence adapter is only available in browser mode.');
  }
}

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

export function createBrowserPersistenceAdapter(): SQLitePersistenceAdapter {
  return {
    readDatabaseBytes: async () => {
      assertBrowserRuntime();

      const result = await runReadRequest(
        (store) => store.get(DATABASE_FILE_KEY),
        'Failed to read SQLite database from IndexedDB.',
      );

      if (!result) {
        return null;
      }

      return new Uint8Array(result as ArrayBuffer);
    },
    writeDatabaseBytes: async (bytes) => {
      assertBrowserRuntime();

      await runWriteTransaction(
        (store) => {
          store.put(bytes, DATABASE_FILE_KEY);
        },
        'Failed to write SQLite database to IndexedDB.',
      );
    },
  };
}

export const BROWSER_SQLITE_STORAGE = {
  databaseName: DATABASE_NAME,
  databaseVersion: DATABASE_VERSION,
  storeName: STORE_NAME,
  fileKey: DATABASE_FILE_KEY,
} as const;