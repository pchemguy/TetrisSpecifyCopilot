import type { PropsWithChildren } from 'react';
import { screen } from '@testing-library/react';
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
    health: 'ready',
    warnings: [],
    isHydrated: true,
    refresh: vi.fn(),
    recordCompletedSession: vi.fn(async () => undefined),
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
  delete window.desktopApi;
  vi.clearAllMocks();
});

describe('desktop runtime integration', () => {
  it('surfaces desktop runtime metadata when the preload bridge is available', async () => {
    window.desktopApi = {
      getRuntimeInfo: vi.fn(async () => ({
        runtime: 'desktop',
        platform: 'win32',
        appVersion: '0.1.0',
      })),
    };

    renderWithProviders(<App />);

    expect(await screen.findByText(/Runtime desktop\/win32 v0.1.0/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Classic Browser Tetris board')).toBeInTheDocument();
  });
});