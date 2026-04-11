import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PersistenceProvider, usePersistence } from '../../../src/app/providers/PersistenceProvider';
import { renderWithProviders } from '../../setup/renderWithProviders';

vi.mock('../../../src/persistence/sqlite/database', () => ({
  initializeSQLiteDatabase: vi.fn(async () => ({
    database: {
      exec: vi.fn(() => []),
      run: vi.fn(),
      export: vi.fn(() => new Uint8Array()),
    },
    sqlJs: {},
    schemaVersion: 1,
    persist: vi.fn(async () => undefined),
  })),
}));

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

describe('persistence hydration', () => {
  it('hydrates the app shell without blocking play and surfaces seeded demo state non-blockingly', async () => {
    renderWithProviders(
      <PersistenceProvider>
        <PersistenceProbe />
      </PersistenceProvider>,
    );

    expect(await screen.findByText(/best score/i)).toBeInTheDocument();
    expect(screen.getByText(/health ready|health warning/i)).toBeInTheDocument();
    expect(screen.getByText(/hydrated true/i)).toBeInTheDocument();
  });
});