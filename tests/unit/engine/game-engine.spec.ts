import { describe, expect, it } from 'vitest';
import { GameEngine } from '../../../src/engine/core/gameEngine';
import { ENGINE_TICK_MS, createInitialGameState } from '../../../src/engine/core/gameState';
import { getTetrominoDefinition } from '../../../src/engine/rules/tetrominoes';
import type { ActivePiece, BoardTile, EngineCommand, GameState, TetrominoId } from '../../../src/types/game';

function createTile(tetrominoId: TetrominoId): BoardTile {
  return {
    tetrominoId,
    colorToken: getTetrominoDefinition(tetrominoId).colorToken,
  };
}

function createMutableBoard() {
  return createInitialGameState('test-seed').board.map((row) => [...row]) as (BoardTile | null)[][];
}

function createActivePiece(overrides: Partial<ActivePiece> = {}): ActivePiece {
  return {
    tetrominoId: 'T',
    rotationIndex: 0,
    x: 4,
    y: 6,
    spawnTick: 0,
    ...overrides,
  };
}

function createState(overrides: Partial<GameState> = {}): GameState {
  const baseState = createInitialGameState('test-seed');

  return {
    ...baseState,
    status: 'active',
    activePiece: createActivePiece(),
    ...overrides,
  };
}

function enqueue(engine: GameEngine, type: EngineCommand['type'], issuedAtMs = 0) {
  engine.enqueue({
    type,
    issuedAtMs,
    source: 'keyboard',
  });
}

function countOccupiedCells(state: GameState): number {
  return state.board.reduce(
    (total, row) => total + row.filter((cell) => cell !== null).length,
    0,
  );
}

describe('GameEngine gameplay rules', () => {
  it('moves the active piece horizontally when the destination is valid and rejects blocked movement', () => {
    const blockedBoard = createMutableBoard();
    blockedBoard[6][6] = createTile('J');

    const engine = new GameEngine({ seed: 'movement-spec' });
    engine.replaceState(
      createState({
        board: blockedBoard,
        activePiece: createActivePiece({ tetrominoId: 'O', x: 3, y: 6 }),
      }),
    );

    enqueue(engine, 'move_right');
    let update = engine.advanceBy(ENGINE_TICK_MS);

    expect(update.state.activePiece?.x).toBe(3);

    engine.replaceState(
      createState({
        board: createMutableBoard(),
        activePiece: createActivePiece({ tetrominoId: 'O', x: 1, y: 6 }),
      }),
    );

    enqueue(engine, 'move_left', update.state.elapsedMs);
    update = engine.advanceBy(ENGINE_TICK_MS);

    expect(update.state.activePiece?.x).toBe(0);
  });

  it('applies SRS rotation kicks near the floor and rejects rotations that remain blocked', () => {
    const engine = new GameEngine({ seed: 'rotation-spec' });
    engine.replaceState(
      createState({
        board: createMutableBoard(),
        activePiece: createActivePiece({ tetrominoId: 'T', y: 20 }),
      }),
    );

    enqueue(engine, 'rotate_cw');
    let update = engine.advanceBy(ENGINE_TICK_MS);

    expect(update.state.activePiece?.rotationIndex).toBe(1);
    expect(update.state.activePiece?.y).toBeLessThanOrEqual(20);

    const blockedBoard = createMutableBoard();
    blockedBoard[19][4] = createTile('L');
    blockedBoard[19][5] = createTile('L');
    blockedBoard[20][4] = createTile('L');
    blockedBoard[20][5] = createTile('L');

    engine.replaceState(
      createState({
        board: blockedBoard,
        activePiece: createActivePiece({ tetrominoId: 'T', x: 4, y: 18 }),
      }),
    );

    enqueue(engine, 'rotate_cw', update.state.elapsedMs);
    update = engine.advanceBy(ENGINE_TICK_MS);

    expect(update.state.activePiece?.rotationIndex).toBe(0);
  });

  it('waits 500 milliseconds before locking a resting piece', () => {
    const engine = new GameEngine({ seed: 'lock-delay-spec' });
    engine.replaceState(
      createState({
        board: createMutableBoard(),
        activePiece: createActivePiece({ tetrominoId: 'O', x: 3, y: 20 }),
      }),
    );

    let update = engine.advanceBy(484);

    expect(countOccupiedCells(update.state)).toBe(0);
    expect(update.state.activePiece?.tetrominoId).toBe('O');

    update = engine.advanceBy(32);

    expect(countOccupiedCells(update.state)).toBeGreaterThan(0);
  });

  it('limits lock-delay resets to 15 successful moves or rotations for a single piece', () => {
    const engine = new GameEngine({ seed: 'lock-reset-spec' });
    engine.replaceState(
      createState({
        board: createMutableBoard(),
        activePiece: createActivePiece({ tetrominoId: 'O', x: 4, y: 20 }),
        lock: {
          startedAtMs: 0,
          remainingMs: 250,
          resetCount: 14,
          isResting: true,
        },
      }),
    );

    enqueue(engine, 'move_left');
    let update = engine.advanceBy(ENGINE_TICK_MS);

    expect(update.state.activePiece?.x).toBe(3);
    expect(update.state.lock.resetCount).toBe(15);
    expect(update.state.lock.remainingMs).toBe(500);

    enqueue(engine, 'move_right', update.state.elapsedMs);
    update = engine.advanceBy(ENGINE_TICK_MS);

    expect(update.state.lock.resetCount).toBe(15);

    update = engine.advanceBy(500);

    expect(countOccupiedCells(update.state)).toBeGreaterThan(0);
  });

  it('prioritizes hard drop over pause and hold when commands share the lock boundary tick', () => {
    const engine = new GameEngine({ seed: 'precedence-spec' });
    engine.replaceState(
      createState({
        board: createMutableBoard(),
        activePiece: createActivePiece({ tetrominoId: 'O', x: 3, y: 20 }),
        hold: {
          tetrominoId: 'I',
          canHold: true,
        },
        lock: {
          startedAtMs: 0,
          remainingMs: 1,
          resetCount: 0,
          isResting: true,
        },
      }),
    );

    enqueue(engine, 'hard_drop');
    enqueue(engine, 'pause_toggle');
    enqueue(engine, 'hold');
    const update = engine.advanceBy(ENGINE_TICK_MS);

    expect(update.state.status).toBe('active');
    expect(update.state.hold.tetrominoId).toBe('I');
    expect(countOccupiedCells(update.state)).toBeGreaterThan(0);
  });

  it('clears completed lines and collapses the stack after piece lock', () => {
    const board = createMutableBoard();

    for (let column = 0; column < 10; column += 1) {
      if (column === 4 || column === 5) {
        continue;
      }

      board[21][column] = createTile('J');
    }

    const engine = new GameEngine({ seed: 'line-clear-spec' });
    engine.replaceState(
      createState({
        board,
        activePiece: createActivePiece({ tetrominoId: 'O', x: 3, y: 20 }),
      }),
    );

    const update = engine.advanceBy(500);

    expect(update.state.board[21][4]).not.toBeNull();
    expect(update.state.board[21][5]).not.toBeNull();
    expect(update.state.board[21].filter((cell) => cell !== null)).toHaveLength(2);
    expect(update.state.metrics.linesCleared).toBe(1);
  });
});