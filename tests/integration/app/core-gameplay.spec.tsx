import type { PropsWithChildren } from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import App from '../../../src/app/App';
import { renderWithProviders } from '../../setup/renderWithProviders';

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
    bestScore: 1200,
    startupBestScore: 1200,
    showStartupBestScore: true,
    storageMode: 'portable_adjacent',
    health: 'ready',
    warnings: [],
    isHydrated: true,
    refresh: vi.fn(),
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

afterEach(() => {
  vi.clearAllMocks();
});

describe('App core gameplay integration', () => {
  it('starts a fresh playable session with zeroed run metrics and the best score visible', () => {
    renderWithProviders(<App />);

    expect(screen.getByLabelText('Classic Browser Tetris board')).toBeInTheDocument();
    expect(screen.getByText(/Score\s*0/i)).toBeInTheDocument();
    expect(screen.getByText(/Level\s*1/i)).toBeInTheDocument();
    expect(screen.getByText(/Lines\s*0/i)).toBeInTheDocument();
    expect(screen.getByText(/Best\s*1200/i)).toBeInTheDocument();
  });

  it('shows a paused state when the player presses the pause key and resumes on the next press', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await user.keyboard('p');
    expect(screen.getByText(/paused/i)).toBeInTheDocument();

    await user.keyboard('p');
    expect(screen.queryByText(/paused/i)).not.toBeInTheDocument();
  });

  it('resets the current run score while preserving the best score when the player restarts', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await user.keyboard('{Space}');
    expect(screen.getByText(/Score\s*[1-9]\d*/i)).toBeInTheDocument();

    await user.keyboard('r');
    expect(screen.getByText(/Score\s*0/i)).toBeInTheDocument();
    expect(screen.getByText(/Best\s*1200/i)).toBeInTheDocument();
  });
});