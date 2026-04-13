import { getDesktopApi, hasCompleteDesktopApi } from '../../platform/runtime';
import type { SQLitePersistenceAdapter } from './browserAdapter';

function getRequiredDesktopApi() {
  const desktopApi = getDesktopApi();

  if (!hasCompleteDesktopApi(desktopApi)) {
    throw new Error('Desktop persistence bridge is unavailable for this run.');
  }

  return desktopApi;
}

export function createDesktopPersistenceAdapter(): SQLitePersistenceAdapter {
  return {
    readDatabaseBytes: async () => {
      const desktopApi = getRequiredDesktopApi();
      return desktopApi.readDatabaseBytes();
    },
    writeDatabaseBytes: async (bytes) => {
      const desktopApi = getRequiredDesktopApi();
      await desktopApi.writeDatabaseBytes(bytes);
    },
  };
}