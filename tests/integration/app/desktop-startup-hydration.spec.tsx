import type { PropsWithChildren } from 'react';
import { screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
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
    health: 'ready',
    warnings: [],
    isHydrated: true,
    refresh: vi.fn(),
    recordCompletedSession: vi.fn(),
    updateOverlayState: vi.fn(),
    ...overrides,
  };
}

afterEach(() => {
  vi.clearAllMocks();
});

describe('desktop startup hydration', () => {
  it('keeps the startup best-score panel hidden until a completed game record exists', () => {
    usePersistenceMock.mockReturnValue(createPersistenceState({
      bestScore: 0,
      startupBestScore: 0,
      showStartupBestScore: false,
    }));

    renderWithProviders(<App />);

    expect(screen.queryByLabelText('Best score panel')).not.toBeInTheDocument();
  });

  it('shows the hydrated startup best score once a completed game record exists', () => {
    usePersistenceMock.mockReturnValue(createPersistenceState({
      bestScore: 0,
      startupBestScore: 4800,
      showStartupBestScore: true,
    }));

    renderWithProviders(<App />);

    expect(screen.getByLabelText('Best score panel')).toHaveTextContent('4800');
  });
});