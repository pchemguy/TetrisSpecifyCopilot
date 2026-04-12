import type { PropsWithChildren } from 'react';
import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import App from '../../../src/app/App';
import { createInitialGameState } from '../../../src/engine/core/gameState';
import { renderWithProviders } from '../../setup/renderWithProviders';

const mockedUseGameSession = vi.fn();
const usePersistenceMock = vi.fn();

vi.mock('../../../src/app/state/useGameSession', () => ({
  useGameSession: (...args: unknown[]) => mockedUseGameSession(...args),
}));

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
      last_overlay: 'game_over',
      has_seeded_demo_data: false,
      last_selected_panel: 'stats',
    },
    bestScore: 2400,
    startupBestScore: 2400,
    showStartupBestScore: true,
    storageMode: 'portable_adjacent',
    latestGameOverSubmission: {
      bestScore: 2400,
      hasCompletedGame: true,
      isNewBest: true,
      showCongratulations: true,
      showBestScore: true,
    },
    health: 'ready',
    warnings: [],
    isHydrated: true,
    refresh: vi.fn(),
    recordCompletedSession: vi.fn(),
    updateOverlayState: vi.fn(),
    ...overrides,
  };
}

describe('desktop game-over score integration', () => {
  it('shows congratulations and the updated best score when a strict new record is saved', () => {
    usePersistenceMock.mockReturnValue(createPersistenceState());

    mockedUseGameSession.mockReturnValue({
      state: {
        ...createInitialGameState('game-over-new-best', 2400),
        status: 'game_over',
        metrics: {
          ...createInitialGameState('game-over-new-best', 2400).metrics,
          score: 2400,
          bestScore: 2400,
        },
      },
      dispatchCommand: vi.fn(),
      lastInputLatencyMs: null,
    });

    renderWithProviders(<App />);

    expect(screen.getByText(/congratulations/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Best score panel')).toHaveTextContent('2400');
  });

  it('does not show congratulations when the saved best score did not improve', () => {
    usePersistenceMock.mockReturnValue(createPersistenceState({
      latestGameOverSubmission: {
        bestScore: 2400,
        hasCompletedGame: true,
        isNewBest: false,
        showCongratulations: false,
        showBestScore: true,
      },
    }));

    mockedUseGameSession.mockReturnValue({
      state: {
        ...createInitialGameState('game-over-no-best', 2400),
        status: 'game_over',
        metrics: {
          ...createInitialGameState('game-over-no-best', 2400).metrics,
          score: 1800,
          bestScore: 2400,
        },
      },
      dispatchCommand: vi.fn(),
      lastInputLatencyMs: null,
    });

    renderWithProviders(<App />);

    expect(screen.queryByText(/congratulations/i)).not.toBeInTheDocument();
  });
});