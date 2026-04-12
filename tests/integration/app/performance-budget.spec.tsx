import type { PropsWithChildren } from 'react';
import { screen } from '@testing-library/react';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import App from '../../../src/app/App';
import { createInitialGameState } from '../../../src/engine/core/gameState';
import { renderWithProviders } from '../../setup/renderWithProviders';

const mockedUseGameSession = vi.fn();

vi.mock('../../../src/app/state/useGameSession', () => ({
  useGameSession: (...args: unknown[]) => mockedUseGameSession(...args),
}));

vi.mock('../../../src/app/providers/PersistenceProvider', () => ({
  PersistenceProvider: ({ children }: PropsWithChildren) => children,
  usePersistence: () => ({
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
      has_seeded_demo_data: true,
      last_selected_panel: 'stats',
    },
    bestScore: 900,
    health: 'ready',
    warnings: [],
    isHydrated: true,
    recordCompletedSession: vi.fn(),
    updateOverlayState: vi.fn(),
  }),
}));

beforeAll(() => {
  Object.defineProperty(HTMLCanvasElement.prototype, 'getContext', {
    configurable: true,
    value: vi.fn(() => ({
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      strokeRect: vi.fn(),
      save: vi.fn(),
      restore: vi.fn(),
    })),
  });
});

function renderPerformanceBudget(latencyMs: number | null) {
  mockedUseGameSession.mockReturnValue({
    state: createInitialGameState('performance-spec', 900),
    dispatchCommand: vi.fn(),
    lastInputLatencyMs: latencyMs,
  });

  renderWithProviders(<App />);
}

describe('performance budget indicator', () => {
  it('shows healthy status when the last input latency stays within the budget', () => {
    renderPerformanceBudget(48);

    expect(screen.getByText(/Input latency 48 ms/i)).toBeInTheDocument();
    expect(screen.getByText(/Performance budget:\s*healthy/i)).toBeInTheDocument();
  });

  it('shows attention-needed status when the last input latency exceeds the budget', () => {
    renderPerformanceBudget(140);

    expect(screen.getByText(/Input latency 140 ms/i)).toBeInTheDocument();
    expect(screen.getByText(/Performance budget:\s*attention needed/i)).toBeInTheDocument();
  });
});