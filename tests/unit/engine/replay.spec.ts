import { describe, expect, it } from 'vitest';
import { createInitialGameState } from '../../../src/engine/core/gameState';
import { ReplayRecorder } from '../../../src/engine/replay/replayRecorder';
import type { EngineCommandName, GameState } from '../../../src/types/game';

function createReplayState(tickCount: number): GameState {
  return {
    ...createInitialGameState('replay-seed', 1200),
    sessionId: 'session-replay-spec',
    seed: 'replay-seed',
    currentTick: tickCount,
  };
}

function recordReplay(commands: readonly EngineCommandName[], tickCount = 64) {
  const recorder = new ReplayRecorder('session-replay-spec', 'replay-seed', 0, 'test-engine');

  commands.forEach((command, index) => {
    recorder.record(command, index * 4);
  });

  return recorder.finalize(createReplayState(tickCount), '2026-04-11T00:00:00.000Z');
}

describe('ReplayRecorder determinism', () => {
  it('produces the same replay envelope for the same command stream and tick count', () => {
    const commands: EngineCommandName[] = [
      'move_left',
      'rotate_cw',
      'soft_drop_start',
      'soft_drop_stop',
      'hard_drop',
    ];

    const firstReplay = recordReplay(commands, 96);
    const secondReplay = recordReplay(commands, 96);

    expect(secondReplay).toEqual(firstReplay);
    expect(secondReplay.replay.checksum).toBe(firstReplay.replay.checksum);
  });

  it('changes the replay checksum when the command stream diverges', () => {
    const baselineReplay = recordReplay(['move_left', 'rotate_cw', 'hard_drop'], 72);
    const changedReplay = recordReplay(['move_left', 'rotate_ccw', 'hard_drop'], 72);

    expect(changedReplay.events).not.toEqual(baselineReplay.events);
    expect(changedReplay.replay.checksum).not.toBe(baselineReplay.replay.checksum);
  });
});