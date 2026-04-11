import { describe, expect, it } from 'vitest';
import { GameEngine } from '../../../src/engine/core/gameEngine';
import { createInitialGameState } from '../../../src/engine/core/gameState';
import type { ActivePiece, GameState } from '../../../src/types/game';

function createActivePiece(overrides: Partial<ActivePiece> = {}): ActivePiece {
  return {
    tetrominoId: 'O',
    rotationIndex: 0,
    x: 3,
    y: 20,
    spawnTick: 0,
    ...overrides,
  };
}

function createState(overrides: Partial<GameState> = {}): GameState {
  const baseState = createInitialGameState('session-controls-spec', 1500);

  return {
    ...baseState,
    status: 'active',
    activePiece: createActivePiece(),
    ...overrides,
  };
}

function enqueue(engine: GameEngine, type: 'pause_toggle' | 'restart' | 'hard_drop', issuedAtMs = 0) {
  engine.enqueue({
    type,
    issuedAtMs,
    source: 'keyboard',
  });
}

describe('session controls', () => {
  it('toggles between active and paused states', () => {
    const engine = new GameEngine({ seed: 'session-toggle-spec', bestScore: 1500 });

    enqueue(engine, 'pause_toggle');
    let update = engine.advanceBy(0);
    expect(update.state.status).toBe('paused');

    enqueue(engine, 'pause_toggle', update.state.elapsedMs);
    update = engine.advanceBy(0);
    expect(update.state.status).toBe('active');
  });

  it('restarts from paused and preserves the stored best score', () => {
    const engine = new GameEngine({ seed: 'session-restart-spec', bestScore: 1500 });
    engine.replaceState(
      createState({
        status: 'paused',
        metrics: {
          score: 840,
          level: 3,
          linesCleared: 14,
          bestScore: 1500,
        },
      }),
    );

    enqueue(engine, 'restart');
    const update = engine.advanceBy(0);

    expect(update.state.status).toBe('active');
    expect(update.state.metrics.score).toBe(0);
    expect(update.state.metrics.bestScore).toBe(1500);
  });

  it('freezes the remaining lock delay while paused before lock commit', () => {
    const engine = new GameEngine({ seed: 'pause-lock-spec' });
    engine.replaceState(
      createState({
        lock: {
          startedAtMs: 0,
          remainingMs: 240,
          resetCount: 0,
          isResting: true,
        },
      }),
    );

    enqueue(engine, 'pause_toggle');
    let update = engine.advanceBy(120);
    expect(update.state.status).toBe('paused');
    expect(update.state.lock.remainingMs).toBe(240);

    enqueue(engine, 'pause_toggle', update.state.elapsedMs);
    update = engine.advanceBy(120);

    expect(update.state.status).toBe('active');
    expect(update.state.lock.remainingMs).toBe(120);
  });

  it('preserves the final game-over state until restart', () => {
    const engine = new GameEngine({ seed: 'game-over-restart-spec', bestScore: 1200 });
    engine.replaceState(
      createState({
        status: 'game_over',
        activePiece: null,
        metrics: {
          score: 1800,
          level: 4,
          linesCleared: 18,
          bestScore: 1200,
        },
      }),
    );

    enqueue(engine, 'restart');
    const update = engine.advanceBy(0);

    expect(update.state.status).toBe('active');
    expect(update.state.metrics.score).toBe(0);
    expect(update.state.metrics.bestScore).toBe(1200);
  });
});