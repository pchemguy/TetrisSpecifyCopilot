import {
  getDesktopApi,
  getRuntimeMode,
  hasCompleteDesktopApi,
  type DesktopPersistenceErrorCode,
} from '../../platform/runtime';
import type { SQLitePersistenceAdapter } from './browserAdapter';

type CodedPersistenceError = Error & {
  code: DesktopPersistenceErrorCode;
};

function createPersistenceError(code: DesktopPersistenceErrorCode, message: string): CodedPersistenceError {
  const error = new Error(message) as CodedPersistenceError;
  error.code = code;
  return error;
}

function getRequiredDesktopApi() {
  if (getRuntimeMode() !== 'desktop') {
    throw createPersistenceError(
      'desktop_bridge_unavailable',
      'Desktop persistence was requested outside the desktop runtime.',
    );
  }

  const desktopApi = getDesktopApi();

  if (!hasCompleteDesktopApi(desktopApi)) {
    throw createPersistenceError(
      'desktop_bridge_unavailable',
      'Desktop persistence bridge is unavailable for this run.',
    );
  }

  return desktopApi;
}

export function createDesktopPersistenceAdapter(): SQLitePersistenceAdapter {
  return {
    readDatabaseBytes: async () => {
      const desktopApi = getRequiredDesktopApi();
      const result = await desktopApi.readDatabaseBytes();

      if (result.status === 'error') {
        throw createPersistenceError(result.error.code, result.error.message);
      }

      return result.bytes;
    },
    writeDatabaseBytes: async (bytes) => {
      const desktopApi = getRequiredDesktopApi();
      const result = await desktopApi.writeDatabaseBytes(bytes);

      if (result.status === 'error') {
        throw createPersistenceError(result.error.code, result.error.message);
      }
    },
  };
}