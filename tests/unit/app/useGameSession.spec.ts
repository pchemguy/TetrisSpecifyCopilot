import { Fragment, createElement } from 'react';
import { act, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useGameSession, type CompletedSessionArtifacts } from '../../../src/app/state/useGameSession';
import { createInitialGameState } from '../../../src/engine/core/gameState';

const mockedFinalize = vi.fn(() => ({
  version: 1,
  sessionId: 'session-1',
  seed: 'unit-test-seed',
  startedAt: '2026-04-12T00:00:00.000Z',
  endedAt: '2026-04-12T00:01:00.000Z',
  commands: [],
  snapshots: [],
}));

let currentState = createInitialGameState('unit-test-seed', 1200);
let queuedUpdate = {
  state: currentState,
  processedCommands: [] as Array<{ type: string }> ,
  simulatedTicks: 0,
};

vi.mock('../../../src/engine/core/gameEngine', () => ({
  GameEngine: class {
    getState() {
      return currentState;
    }

    replaceState(nextState: typeof currentState) {
      currentState = nextState;
      return currentState;
    }

    enqueue(command: { type: string }) {
      if (command.type === 'hard_drop') {
        currentState = {
          ...currentState,
          status: 'game_over',
          metrics: {
            ...currentState.metrics,
            score: 2400,
          },
        };
      }

      if (command.type === 'restart') {
        currentState = createInitialGameState('unit-test-seed-restart', 1200);
      }

      queuedUpdate = {
        state: currentState,
        processedCommands: [command],
        simulatedTicks: 0,
      };
    }

    advanceBy() {
      const update = queuedUpdate;
      queuedUpdate = {
        state: currentState,
        processedCommands: [],
        simulatedTicks: 0,
      };
      return update;
    }
  },
}));

vi.mock('../../../src/engine/core/performance', () => ({
  PerformanceTracker: class {
    markInput() {}
    consumeLatency() {
      return 0;
    }
  },
}));

vi.mock('../../../src/engine/replay/replayRecorder', () => ({
  ReplayRecorder: class {
    record() {}
    finalize() {
      return mockedFinalize();
    }
  },
}));

function HookProbe({ onCompletedSession }: { onCompletedSession: (artifacts: CompletedSessionArtifacts) => void }) {
  const { dispatchCommand } = useGameSession(1200, { onCompletedSession });

  return createElement(
    Fragment,
    null,
    createElement('button', { type: 'button', onClick: () => dispatchCommand('hard_drop') }, 'finish'),
    createElement('button', { type: 'button', onClick: () => dispatchCommand('restart') }, 'restart'),
  );
}

describe('useGameSession score submission boundary', () => {
  beforeEach(() => {
    currentState = createInitialGameState('unit-test-seed', 1200);
    queuedUpdate = {
      state: currentState,
      processedCommands: [],
      simulatedTicks: 0,
    };
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation(() => 0);
    vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    mockedFinalize.mockClear();
  });

  it('emits an explicit game_over score submission payload when the session reaches game over', async () => {
    const onCompletedSession = vi.fn();

    render(createElement(HookProbe, { onCompletedSession }));

    await act(async () => {
      screen.getByRole('button', { name: 'finish' }).click();
    });

    expect(onCompletedSession).toHaveBeenCalledTimes(1);
    expect(onCompletedSession.mock.calls[0][0].submission).toEqual({
      finalScore: 2400,
      completedReason: 'game_over',
    });
  });

  it('does not emit a score submission payload when the player restarts before game over', async () => {
    const onCompletedSession = vi.fn();

    render(createElement(HookProbe, { onCompletedSession }));

    await act(async () => {
      screen.getByRole('button', { name: 'restart' }).click();
    });

    expect(onCompletedSession).not.toHaveBeenCalled();
  });
});