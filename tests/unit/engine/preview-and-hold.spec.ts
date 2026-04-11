import { describe, expect, it } from 'vitest';
import { GameEngine } from '../../../src/engine/core/gameEngine';
import { createInitialGameState } from '../../../src/engine/core/gameState';
import { getGhostProjection } from '../../../src/engine/rules/ghostPiece';
import { selectHeldTetromino, selectNextTetromino } from '../../../src/engine/core/selectors';
import type { ActivePiece, BoardTile, GameState } from '../../../src/types/game';

function createMutableBoard() {
  return createInitialGameState('preview-hold-spec').board.map((row) => [...row]) as (BoardTile | null)[][];
}

function createActivePiece(overrides: Partial<ActivePiece> = {}): ActivePiece {
  return {
    tetrominoId: 'T',
    rotationIndex: 0,
    x: 4,
    y: 4,
    spawnTick: 0,
    ...overrides,
  };
}

function createState(overrides: Partial<GameState> = {}): GameState {
  const baseState = createInitialGameState('preview-hold-spec');

  return {
    ...baseState,
    status: 'active',
    activePiece: createActivePiece(),
    ...overrides,
  };
}

function enqueue(engine: GameEngine, type: 'hold' | 'hard_drop', issuedAtMs = 0) {
  engine.enqueue({
    type,
    issuedAtMs,
    source: 'keyboard',
  });
}

describe('preview and hold rules', () => {
  it('projects a ghost piece to the lowest valid landing row', () => {
    const board = createMutableBoard();

    for (let column = 0; column < 10; column += 1) {
      board[21][column] = {
        tetrominoId: 'J',
        colorToken: 'blue',
      };
    }

    board[21][4] = null;
    board[21][5] = null;

    const ghostPiece = getGhostProjection(board, createActivePiece({ tetrominoId: 'O', x: 3, y: 4 }));

    expect(ghostPiece).not.toBeNull();
    expect(ghostPiece?.y).toBe(20);
  });

  it('exposes the immediate next piece through the selector', () => {
    const state = createState({
      nextQueue: ['L', 'I', 'S', 'O'],
    });

    expect(selectNextTetromino(state)).toBe('L');
  });

  it('stores the active piece in an empty hold slot and spawns the next queue piece', () => {
    const engine = new GameEngine({ seed: 'hold-store-spec' });
    engine.replaceState(
      createState({
        activePiece: createActivePiece({ tetrominoId: 'T' }),
        nextQueue: ['L', 'I', 'S', 'O'],
      }),
    );

    enqueue(engine, 'hold');
    const update = engine.advanceBy(0);

    expect(selectHeldTetromino(update.state)).toBe('T');
    expect(update.state.activePiece?.tetrominoId).toBe('L');
    expect(update.state.hold.canHold).toBe(false);
  });

  it('allows hold only once per active-piece turn', () => {
    const engine = new GameEngine({ seed: 'hold-once-spec' });
    engine.replaceState(
      createState({
        activePiece: createActivePiece({ tetrominoId: 'T' }),
        nextQueue: ['L', 'I', 'S', 'O'],
      }),
    );

    enqueue(engine, 'hold');
    let update = engine.advanceBy(0);

    expect(update.state.activePiece?.tetrominoId).toBe('L');
    expect(selectHeldTetromino(update.state)).toBe('T');

    enqueue(engine, 'hold', update.state.elapsedMs);
    update = engine.advanceBy(0);

    expect(update.state.activePiece?.tetrominoId).toBe('L');
    expect(selectHeldTetromino(update.state)).toBe('T');
  });

  it('swaps with the held piece after the current piece locks and hold becomes available again', () => {
    const engine = new GameEngine({ seed: 'hold-swap-spec' });
    engine.replaceState(
      createState({
        activePiece: createActivePiece({ tetrominoId: 'T', x: 3, y: 20 }),
        nextQueue: ['L', 'I', 'S', 'O'],
      }),
    );

    enqueue(engine, 'hold');
    let update = engine.advanceBy(0);

    expect(update.state.activePiece?.tetrominoId).toBe('L');
    expect(selectHeldTetromino(update.state)).toBe('T');

    enqueue(engine, 'hard_drop', update.state.elapsedMs);
    update = engine.advanceBy(16);

    expect(update.state.hold.canHold).toBe(true);

    enqueue(engine, 'hold', update.state.elapsedMs);
    update = engine.advanceBy(0);

    expect(update.state.activePiece?.tetrominoId).toBe('T');
    expect(selectHeldTetromino(update.state)).toBe('I');
  });

  it('rejects hold once lock commit has already occurred for the active piece', () => {
    const engine = new GameEngine({ seed: 'hold-lock-rejection-spec' });
    engine.replaceState(
      createState({
        activePiece: createActivePiece({ tetrominoId: 'O', x: 3, y: 20 }),
        nextQueue: ['L', 'I', 'S', 'O'],
        lock: {
          startedAtMs: 0,
          remainingMs: 0,
          resetCount: 0,
          isResting: true,
        },
      }),
    );

    enqueue(engine, 'hold');
    const update = engine.advanceBy(16);

    expect(selectHeldTetromino(update.state)).toBeNull();
    expect(update.state.activePiece?.tetrominoId).toBe('L');
  });
});