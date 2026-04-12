import type { PropsWithChildren } from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeAll, describe, expect, it, vi } from 'vitest';
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
    latestGameOverSubmission: null,
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

describe('App HUD synchronization', () => {
  it('renders next and held piece panels with descriptive labels', () => {
    renderWithProviders(<App />);

    expect(screen.getByText(/Next piece/i)).toBeInTheDocument();
    expect(screen.getByText(/Held piece/i)).toBeInTheDocument();
    expect(screen.getByText(/Controls/i)).toBeInTheDocument();
  });

  it('updates the hold panel after a hold input', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await user.keyboard('c');

    expect(screen.getByText(/Held piece/i)).toBeInTheDocument();
    expect(screen.getByText(/T stored|T held|Hold: T/i)).toBeInTheDocument();
  });

  it('keeps the score, level, and lines panels synchronized during active play', async () => {
    const user = userEvent.setup();
    renderWithProviders(<App />);

    await user.keyboard('{Space}');

    expect(screen.getByText(/Score\s*[1-9]\d*/i)).toBeInTheDocument();
    expect(screen.getByText(/Level\s*1/i)).toBeInTheDocument();
    expect(screen.getByText(/Lines\s*0|Lines\s*[1-9]\d*/i)).toBeInTheDocument();
  });
});