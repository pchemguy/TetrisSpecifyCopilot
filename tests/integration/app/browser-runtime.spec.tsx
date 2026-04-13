import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PersistenceProvider, usePersistence } from '../../../src/app/providers/PersistenceProvider';
import { renderWithProviders } from '../../setup/renderWithProviders';

const databaseMocks = vi.hoisted(() => ({
  initializeSQLiteDatabase: vi.fn(),
}));

const bestScoreStoreMocks = vi.hoisted(() => ({
  readBestScore: vi.fn(),
}));

const settingsStoreMocks = vi.hoisted(() => ({
  readSettings: vi.fn(),
}));

const uiStateStoreMocks = vi.hoisted(() => ({
  readUIState: vi.fn(),
}));

const seedDatabaseMocks = vi.hoisted(() => ({
  seedLocalPersistence: vi.fn(),
}));

vi.mock('../../../src/persistence/sqlite/database', async () => {
  const actual = await vi.importActual<typeof import('../../../src/persistence/sqlite/database')>(
    '../../../src/persistence/sqlite/database',
  );

  return {
    ...actual,
    initializeSQLiteDatabase: databaseMocks.initializeSQLiteDatabase,
  };
});

vi.mock('../../../src/persistence/local-storage/bestScoreStore', async () => {
  const actual = await vi.importActual<typeof import('../../../src/persistence/local-storage/bestScoreStore')>(
    '../../../src/persistence/local-storage/bestScoreStore',
  );

  return {
    ...actual,
    readBestScore: bestScoreStoreMocks.readBestScore,
  };
});

vi.mock('../../../src/persistence/local-storage/settingsStore', async () => {
  const actual = await vi.importActual<typeof import('../../../src/persistence/local-storage/settingsStore')>(
    '../../../src/persistence/local-storage/settingsStore',
  );

  return {
    ...actual,
    readSettings: settingsStoreMocks.readSettings,
  };
});

vi.mock('../../../src/persistence/local-storage/uiStateStore', async () => {
  const actual = await vi.importActual<typeof import('../../../src/persistence/local-storage/uiStateStore')>(
    '../../../src/persistence/local-storage/uiStateStore',
  );

  return {
    ...actual,
    readUIState: uiStateStoreMocks.readUIState,
  };
});

vi.mock('../../../src/persistence/seed/seedDatabase', async () => {
  const actual = await vi.importActual<typeof import('../../../src/persistence/seed/seedDatabase')>(
    '../../../src/persistence/seed/seedDatabase',
  );

  return {
    ...actual,
    seedLocalPersistence: seedDatabaseMocks.seedLocalPersistence,
  };
});

function PersistenceProbe() {
  const { bestScore, health, isHydrated } = usePersistence();

  return (
    <div>
      <span>best score {bestScore}</span>
      <span>health {health}</span>
      <span>hydrated {String(isHydrated)}</span>
    </div>
  );
}

afterEach(() => {
  databaseMocks.initializeSQLiteDatabase.mockReset();
  bestScoreStoreMocks.readBestScore.mockReset();
  settingsStoreMocks.readSettings.mockReset();
  uiStateStoreMocks.readUIState.mockReset();
  seedDatabaseMocks.seedLocalPersistence.mockReset();
  delete window.desktopApi;
});

describe('browser runtime integration', () => {
  it('hydrates browser persistence when no desktop bridge is present', async () => {
    bestScoreStoreMocks.readBestScore.mockReturnValue(800);
    settingsStoreMocks.readSettings.mockReturnValue({
      version: 1,
      control_profile: 'classic-desktop',
      show_ghost_piece: true,
      auto_pause_on_blur: true,
      reduce_motion: false,
    });
    uiStateStoreMocks.readUIState.mockReturnValue({
      version: 1,
      last_overlay: 'none',
      has_seeded_demo_data: true,
      last_selected_panel: 'stats',
    });
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

    renderWithProviders(
      <PersistenceProvider>
        <PersistenceProbe />
      </PersistenceProvider>,
    );

    expect(await screen.findByText(/best score 800/i)).toBeInTheDocument();
    expect(await screen.findByText(/health ready/i)).toBeInTheDocument();
    expect(await screen.findByText(/hydrated true/i)).toBeInTheDocument();
    expect(seedDatabaseMocks.seedLocalPersistence).toHaveBeenCalledOnce();
    expect(settingsStoreMocks.readSettings).toHaveBeenCalled();
    expect(uiStateStoreMocks.readUIState).toHaveBeenCalled();
  });
});