import type { PropsWithChildren } from 'react';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from '../../../src/app/App';
import { renderWithProviders } from '../../setup/renderWithProviders';

const usePersistenceMock = vi.fn();

vi.mock('../../../src/app/providers/PersistenceProvider', () => ({
  PersistenceProvider: ({ children }: PropsWithChildren) => children,
  usePersistence: () => usePersistenceMock(),
}));

function createPersistenceState(overrides: Record<string, unknown> = {}) {
  return {
    databaseHandle: null,
    settings: {
      version: 1,
      control_profile: 'classic-desktop',
      show_ghost_piece: true,
      auto_pause_on_blur: true,
      reduce_motion: false,
    },
    uiState: {
      version: 1,
      last_overlay: 'none',
      has_seeded_demo_data: false,
      last_selected_panel: 'stats',
    },
    bestScore: 0,
    startupBestScore: 0,
    showStartupBestScore: false,
    storageMode: 'portable_adjacent',
    startupNotice: null,
    latestGameOverSubmission: null,
    health: 'ready',
    warnings: [],
    isHydrated: true,
    refresh: vi.fn(),
    recordCompletedSession: vi.fn(),
    updateOverlayState: vi.fn(),
    ...overrides,
  };
}

describe('desktop startup notices', () => {
  it('shows the fallback-path notice when desktop storage had to move to LocalAppData', () => {
    usePersistenceMock.mockReturnValue(createPersistenceState({
      storageMode: 'localappdata_fallback',
      startupNotice: {
        code: 'storage_fallback',
        message: 'Desktop storage moved to LocalAppData because the app folder was not writable.',
      },
    }));

    renderWithProviders(<App />);

    expect(screen.getByText(/LocalAppData/i)).toBeInTheDocument();
  });

  it('shows the database-reset notice when startup recovers from a corrupt database', () => {
    usePersistenceMock.mockReturnValue(createPersistenceState({
      startupNotice: {
        code: 'database_reset',
        message: 'Desktop persistence was reset after recovering from a corrupt database.',
      },
    }));

    renderWithProviders(<App />);

    expect(screen.getByText(/corrupt database/i)).toBeInTheDocument();
  });
});