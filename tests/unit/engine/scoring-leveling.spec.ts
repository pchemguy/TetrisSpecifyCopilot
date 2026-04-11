import { describe, expect, it } from 'vitest';
import { GameEngine } from '../../../src/engine/core/gameEngine';
import { createInitialGameState, deriveGravityInterval } from '../../../src/engine/core/gameState';
import { getTetrominoDefinition } from '../../../src/engine/rules/tetrominoes';
import type { ActivePiece, BoardTile, GameState, TetrominoId } from '../../../src/types/game';

function createTile(tetrominoId: TetrominoId): BoardTile {
  return {
    tetrominoId,
    colorToken: getTetrominoDefinition(tetrominoId).colorToken,
  };
}

function createMutableBoard() {
  return createInitialGameState('score-spec').board.map((row) => [...row]) as (BoardTile | null)[][];
}

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
  const baseState = createInitialGameState('score-spec');

  return {
    ...baseState,
    status: 'active',
    activePiece: createActivePiece(),
    ...overrides,
  };
}

function buildRowsWithSingleGap(rows: number[], gapColumn: number) {
  const board = createMutableBoard();

  rows.forEach((rowIndex) => {
    for (let column = 0; column < 10; column += 1) {
      if (column === gapColumn) {
        continue;
      }

      board[rowIndex][column] = createTile('J');
    }
  });

  return board;
}

function buildRowsWithDoubleGap(rows: number[], leftGap: number, rightGap: number) {
  const board = createMutableBoard();

  rows.forEach((rowIndex) => {
    for (let column = 0; column < 10; column += 1) {
      if (column === leftGap || column === rightGap) {
        continue;
      }

      board[rowIndex][column] = createTile('L');
    }
  });

  return board;
}

describe('scoring and leveling rules', () => {
  it('uses the 15 percent gravity curve with a 50 millisecond minimum', () => {
    expect(deriveGravityInterval(1)).toBe(1000);
    expect(deriveGravityInterval(2)).toBe(850);
    expect(deriveGravityInterval(4)).toBe(614);
    expect(deriveGravityInterval(25)).toBe(50);
  });

  it.each([
    {
      label: 'single line',
      board: buildRowsWithDoubleGap([21], 4, 5),
      activePiece: createActivePiece({ tetrominoId: 'O', x: 3, y: 20 }),
      expectedScore: 100,
      expectedLines: 1,
    },
    {
      label: 'double line',
      board: buildRowsWithDoubleGap([20, 21], 4, 5),
      activePiece: createActivePiece({ tetrominoId: 'O', x: 3, y: 20 }),
      expectedScore: 300,
      expectedLines: 2,
    },
    {
      label: 'triple line',
      board: buildRowsWithSingleGap([19, 20, 21], 4),
      activePiece: createActivePiece({ tetrominoId: 'I', rotationIndex: 1, x: 2, y: 18 }),
      expectedScore: 500,
      expectedLines: 3,
    },
    {
      label: 'tetris',
      board: buildRowsWithSingleGap([18, 19, 20, 21], 4),
      activePiece: createActivePiece({ tetrominoId: 'I', rotationIndex: 1, x: 2, y: 18 }),
      expectedScore: 800,
      expectedLines: 4,
    },
  ])('awards the correct score for $label clears', ({ board, activePiece, expectedScore, expectedLines }) => {
    const engine = new GameEngine({ seed: 'score-table-spec' });
    engine.replaceState(
      createState({
        board,
        activePiece,
      }),
    );

    const update = engine.advanceBy(500);

    expect(update.state.metrics.score).toBe(expectedScore);
    expect(update.state.metrics.linesCleared).toBe(expectedLines);
  });

  it('levels up after every 10 cleared lines and applies the next gravity tier', () => {
    const engine = new GameEngine({ seed: 'level-up-spec' });
    engine.replaceState(
      createState({
        board: buildRowsWithDoubleGap([21], 4, 5),
        activePiece: createActivePiece({ tetrominoId: 'O', x: 3, y: 20 }),
        metrics: {
          score: 900,
          level: 1,
          linesCleared: 9,
          bestScore: 1200,
        },
      }),
    );

    const update = engine.advanceBy(500);

    expect(update.state.metrics.score).toBe(1000);
    expect(update.state.metrics.linesCleared).toBe(10);
    expect(update.state.metrics.level).toBe(2);
    expect(deriveGravityInterval(update.state.metrics.level)).toBe(850);
  });
});