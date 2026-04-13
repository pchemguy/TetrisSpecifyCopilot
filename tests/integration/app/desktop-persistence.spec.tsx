import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PersistenceProvider, usePersistence } from '../../../src/app/providers/PersistenceProvider';
import { renderWithProviders } from '../../setup/renderWithProviders';

const databaseMocks = vi.hoisted(() => ({
  initializeSQLiteDatabase: vi.fn(),
  readPersistedBestScore: vi.fn(),
  writePersistedBestScore: vi.fn(),
}));

vi.mock('../../../src/persistence/sqlite/database', async () => {
  const actual = await vi.importActual<typeof import('../../../src/persistence/sqlite/database')>(
    '../../../src/persistence/sqlite/database',
  );

  return {
    ...actual,
    initializeSQLiteDatabase: databaseMocks.initializeSQLiteDatabase,
    readPersistedBestScore: databaseMocks.readPersistedBestScore,
    writePersistedBestScore: databaseMocks.writePersistedBestScore,
  };
});

function PersistenceProbe() {
  const { bestScore, health, isHydrated, warnings } = usePersistence();

  return (
    <div>
      <span>best score {bestScore}</span>
      <span>health {health}</span>
      <span>hydrated {String(isHydrated)}</span>
      <span>warnings {warnings.map((warning) => warning.message).join(' | ') || 'none'}</span>
    </div>
  );
}

afterEach(() => {
  databaseMocks.initializeSQLiteDatabase.mockReset();
  databaseMocks.readPersistedBestScore.mockReset();
  databaseMocks.writePersistedBestScore.mockReset();
  window.localStorage.clear();
  delete window.desktopApi;
});

describe('desktop persistence integration', () => {
  it('hydrates the desktop best score from the desktop SQLite runtime path', async () => {
    window.desktopApi = {
      getRuntimeInfo: vi.fn(async () => ({
        runtime: 'desktop' as const,
        platform: 'win32' as const,
        appVersion: '0.1.0',
      })),
      readDatabaseBytes: vi.fn(async () => ({
        status: 'ok' as const,
        bytes: new Uint8Array([1, 2, 3]),
      })),
      writeDatabaseBytes: vi.fn(async () => ({
        status: 'ok' as const,
      })),
    };

    databaseMocks.initializeSQLiteDatabase.mockResolvedValue({
      database: {
        exec: vi.fn(() => []),
        run: vi.fn(),
        export: vi.fn(() => new Uint8Array()),
      },
      sqlJs: {},
      schemaVersion: 1,
      persist: vi.fn(async () => undefined),
    });
    databaseMocks.readPersistedBestScore.mockReturnValue(4200);

    renderWithProviders(
      <PersistenceProvider>
        <PersistenceProbe />
      </PersistenceProvider>,
    );

    expect(await screen.findByText(/best score 4200/i)).toBeInTheDocument();
    expect(screen.getByText(/health ready/i)).toBeInTheDocument();
    expect(screen.getByText(/hydrated true/i)).toBeInTheDocument();
  });

  it('warns and avoids browser best-score fallback when the desktop bridge is incomplete', async () => {
    window.localStorage.setItem('tetris.best-score.v1', '9999');
    window.desktopApi = {
      getRuntimeInfo: vi.fn(async () => ({
        runtime: 'desktop' as const,
        platform: 'win32' as const,
        appVersion: '0.1.0',
      })),
    };

    databaseMocks.initializeSQLiteDatabase.mockRejectedValue(
      new Error('Desktop persistence bridge is unavailable for this run.'),
    );

    renderWithProviders(
      <PersistenceProvider>
        <PersistenceProbe />
      </PersistenceProvider>,
    );

    expect(await screen.findByText(/best score 0/i)).toBeInTheDocument();
    expect(screen.getByText(/health warning/i)).toBeInTheDocument();
    expect(screen.getByText(/Desktop persistence bridge is unavailable for this run\./i)).toBeInTheDocument();
  });
});