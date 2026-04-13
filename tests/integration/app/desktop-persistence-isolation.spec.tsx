import { fireEvent, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  PersistenceProvider,
  usePersistence,
  type CompletedSessionPayload,
} from '../../../src/app/providers/PersistenceProvider';
import { renderWithProviders } from '../../setup/renderWithProviders';

const databaseMocks = vi.hoisted(() => ({
  initializeSQLiteDatabase: vi.fn(),
  readPersistedBestScore: vi.fn(),
  writePersistedBestScore: vi.fn(),
}));

const bestScoreStoreMocks = vi.hoisted(() => ({
  readBestScore: vi.fn(),
  commitBestScore: vi.fn(),
}));

const settingsStoreMocks = vi.hoisted(() => ({
  readSettings: vi.fn(),
}));

const uiStateStoreMocks = vi.hoisted(() => ({
  readUIState: vi.fn(),
  writeUIState: vi.fn(),
  mergeUIState: vi.fn(),
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
    readPersistedBestScore: databaseMocks.readPersistedBestScore,
    writePersistedBestScore: databaseMocks.writePersistedBestScore,
  };
});

vi.mock('../../../src/persistence/local-storage/bestScoreStore', async () => {
  const actual = await vi.importActual<typeof import('../../../src/persistence/local-storage/bestScoreStore')>(
    '../../../src/persistence/local-storage/bestScoreStore',
  );

  return {
    ...actual,
    readBestScore: bestScoreStoreMocks.readBestScore,
    commitBestScore: bestScoreStoreMocks.commitBestScore,
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
    writeUIState: uiStateStoreMocks.writeUIState,
    mergeUIState: uiStateStoreMocks.mergeUIState,
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

const completedSessionPayload: CompletedSessionPayload = {
  session: {
    session_id: 'desktop-session-1',
    started_at: '2026-04-13T00:00:00.000Z',
    ended_at: '2026-04-13T00:01:00.000Z',
    status: 'game_over',
    seed: 'desktop-seed',
    score: 3200,
    level: 6,
    lines_cleared: 12,
    duration_ms: 60000,
    best_score_at_end: 3200,
  },
  score: {
    score_id: 'desktop-score-1',
    session_id: 'desktop-session-1',
    final_score: 3200,
    level_reached: 6,
    lines_cleared: 12,
    achieved_at: '2026-04-13T00:01:00.000Z',
    is_personal_best: true,
  },
  replay: {
    replay: {
      replay_id: 'desktop-replay-1',
      session_id: 'desktop-session-1',
      engine_version: 'engine-1',
      seed: 'desktop-seed',
      tick_count: 42,
      checksum: 'checksum-1',
      created_at: '2026-04-13T00:01:00.000Z',
    },
    events: [],
  },
};

function IsolationProbe() {
  const { bestScore, updateOverlayState, recordCompletedSession } = usePersistence();

  return (
    <div>
      <span>best score {bestScore}</span>
      <button type="button" onClick={() => updateOverlayState('paused')}>
        pause overlay
      </button>
      <button type="button" onClick={() => void recordCompletedSession(completedSessionPayload)}>
        complete session
      </button>
    </div>
  );
}

afterEach(() => {
  databaseMocks.initializeSQLiteDatabase.mockReset();
  databaseMocks.readPersistedBestScore.mockReset();
  databaseMocks.writePersistedBestScore.mockReset();
  bestScoreStoreMocks.readBestScore.mockReset();
  bestScoreStoreMocks.commitBestScore.mockReset();
  settingsStoreMocks.readSettings.mockReset();
  uiStateStoreMocks.readUIState.mockReset();
  uiStateStoreMocks.writeUIState.mockReset();
  uiStateStoreMocks.mergeUIState.mockReset();
  seedDatabaseMocks.seedLocalPersistence.mockReset();
  window.localStorage.clear();
  delete window.desktopApi;
});

describe('desktop persistence isolation', () => {
  it('does not import browser local persistence while hydrating desktop best score', async () => {
    settingsStoreMocks.readSettings.mockReturnValue({
      version: 1,
      control_profile: 'classic-desktop',
      show_ghost_piece: false,
      auto_pause_on_blur: false,
      reduce_motion: true,
    });
    uiStateStoreMocks.readUIState.mockReturnValue({
      version: 1,
      last_overlay: 'help',
      has_seeded_demo_data: true,
      last_selected_panel: 'history',
    });
    bestScoreStoreMocks.readBestScore.mockReturnValue(9999);

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
        export: vi.fn(() => new Uint8Array([1, 2, 3])),
      },
      sqlJs: {},
      schemaVersion: 1,
      persist: vi.fn(async () => undefined),
    });
    databaseMocks.readPersistedBestScore.mockReturnValue(2400);

    renderWithProviders(
      <PersistenceProvider>
        <IsolationProbe />
      </PersistenceProvider>,
    );

    expect(await screen.findByText(/best score 2400/i)).toBeInTheDocument();
    expect(settingsStoreMocks.readSettings).not.toHaveBeenCalled();
    expect(uiStateStoreMocks.readUIState).not.toHaveBeenCalled();
    expect(bestScoreStoreMocks.readBestScore).not.toHaveBeenCalled();
    expect(seedDatabaseMocks.seedLocalPersistence).not.toHaveBeenCalled();
  });

  it('does not overwrite browser persistence when desktop mode updates best score or overlay state', async () => {
    const persist = vi.fn(async () => undefined);

    window.localStorage.setItem('tetris.best-score.v1', '7777');
    window.desktopApi = {
      getRuntimeInfo: vi.fn(async () => ({
        runtime: 'desktop' as const,
        platform: 'win32' as const,
        appVersion: '0.1.0',
      })),
      readDatabaseBytes: vi.fn(async () => ({
        status: 'ok' as const,
        bytes: new Uint8Array([4, 2, 0]),
      })),
      writeDatabaseBytes: vi.fn(async () => ({
        status: 'ok' as const,
      })),
    };

    databaseMocks.initializeSQLiteDatabase.mockResolvedValue({
      database: {
        exec: vi.fn(() => []),
        run: vi.fn(),
        export: vi.fn(() => new Uint8Array([4, 2, 0])),
      },
      sqlJs: {},
      schemaVersion: 1,
      persist,
    });
    databaseMocks.readPersistedBestScore.mockReturnValue(1200);
    databaseMocks.writePersistedBestScore.mockReturnValue(3200);

    renderWithProviders(
      <PersistenceProvider>
        <IsolationProbe />
      </PersistenceProvider>,
    );

    await screen.findByText(/best score 1200/i);

    fireEvent.click(screen.getByRole('button', { name: /pause overlay/i }));
    fireEvent.click(screen.getByRole('button', { name: /complete session/i }));

    await waitFor(() => {
      expect(screen.getByText(/best score 3200/i)).toBeInTheDocument();
    });

    expect(bestScoreStoreMocks.commitBestScore).not.toHaveBeenCalled();
    expect(uiStateStoreMocks.writeUIState).not.toHaveBeenCalled();
    expect(uiStateStoreMocks.mergeUIState).not.toHaveBeenCalled();
    expect(window.localStorage.getItem('tetris.best-score.v1')).toBe('7777');
    expect(databaseMocks.writePersistedBestScore).toHaveBeenCalled();
    expect(persist).toHaveBeenCalled();
  });
});
