import { getTetrominoDefinition } from '../rules/tetrominoes';
import { DEFAULT_GAMEPLAY_CONFIG, type ActivePiece, type BoardMatrix, type BoardTile, type EngineCommand, type GameMetrics, type GameState, type HoldState, type LockState, type SessionStatus, type TetrominoId } from '../../types/game';
import { createSeededRandomSource, SevenBagRandomizer } from '../rules/randomizer';
import { calculateLevel } from '../rules/leveling';
import { applyScoring } from '../rules/scoring';
import { getPieceCells, isPieceResting } from '../rules/collision';

export const ENGINE_TICK_MS = 16;

export function createEmptyBoard(): BoardMatrix {
  return Array.from(
    { length: DEFAULT_GAMEPLAY_CONFIG.board.visibleRows + DEFAULT_GAMEPLAY_CONFIG.board.hiddenRows },
    () => Array.from({ length: DEFAULT_GAMEPLAY_CONFIG.board.columns }, () => null),
  );
}

export function createInitialMetrics(bestScore = 0): GameMetrics {
  return {
    score: 0,
    level: 1,
    linesCleared: 0,
    bestScore,
  };
}

export function createInitialHoldState(): HoldState {
  return {
    tetrominoId: null,
    canHold: true,
  };
}

export function createInitialLockState(): LockState {
  return {
    startedAtMs: null,
    remainingMs: null,
    resetCount: 0,
    isResting: false,
  };
}

function createSessionId(seed: string): string {
  return `session-${seed}`;
}

export function createSpawnPiece(tetrominoId: TetrominoId, spawnTick: number): ActivePiece {
  return {
    tetrominoId,
    rotationIndex: 0,
    x: 3,
    y: 0,
    spawnTick,
  };
}

function createInitialQueue(seed: string) {
  const bag = new SevenBagRandomizer(createSeededRandomSource(seed));
  const activeTetrominoId = bag.next();

  return {
    activePiece: createSpawnPiece(activeTetrominoId, 0),
    nextQueue: bag.preview(7),
  };
}

export function createInitialGameState(seed = 'default-seed', bestScore = 0): GameState {
  const { activePiece, nextQueue } = createInitialQueue(seed);

  return {
    sessionId: createSessionId(seed),
    seed,
    status: 'active',
    board: createEmptyBoard(),
    activePiece,
    nextQueue,
    hold: createInitialHoldState(),
    metrics: createInitialMetrics(bestScore),
    lock: createInitialLockState(),
    currentTick: 0,
    elapsedMs: 0,
    gravityTimerMs: 0,
    softDropActive: false,
    config: DEFAULT_GAMEPLAY_CONFIG,
  };
}

export function cloneBoard(board: BoardMatrix): BoardMatrix {
  return board.map((row) => [...row]);
}

export function updateStatus(state: GameState, status: SessionStatus): GameState {
  return {
    ...state,
    status,
  };
}

export function advanceClock(state: GameState, elapsedMs: number, tickCount = 1): GameState {
  return {
    ...state,
    elapsedMs: state.elapsedMs + elapsedMs,
    currentTick: state.currentTick + tickCount,
  };
}

export function deriveGravityInterval(level: number): number {
  const scaled = DEFAULT_GAMEPLAY_CONFIG.gravity.baseIntervalMs
    * DEFAULT_GAMEPLAY_CONFIG.gravity.levelMultiplier ** (level - 1);

  return Math.max(
    DEFAULT_GAMEPLAY_CONFIG.gravity.minimumIntervalMs,
    Math.round(scaled),
  );
}

export function refillPreviewQueue(state: GameState, queue: readonly TetrominoId[]): readonly TetrominoId[] {
  const nextQueue = [...queue];

  while (nextQueue.length < 7) {
    const randomizer = new SevenBagRandomizer(
      createSeededRandomSource(`${state.seed}:${state.currentTick}:${state.metrics.linesCleared}:${nextQueue.length}`),
    );

    nextQueue.push(...randomizer.preview(7));
  }

  return nextQueue.slice(0, 7);
}

export function mergeActivePiece(board: BoardMatrix, activePiece: ActivePiece): BoardMatrix {
  const mergedBoard = board.map((row) => [...row]) as (BoardTile | null)[][];
  const definition = getTetrominoDefinition(activePiece.tetrominoId);

  getPieceCells(activePiece).forEach((cell) => {
    mergedBoard[cell.y][cell.x] = {
      tetrominoId: definition.id,
      colorToken: definition.colorToken,
    };
  });

  return mergedBoard;
}

export function clearCompletedLines(board: BoardMatrix) {
  const incompleteRows = board.filter((row) => row.some((cell) => cell === null));
  const linesCleared = board.length - incompleteRows.length;

  if (linesCleared === 0) {
    return {
      board,
      linesCleared,
    };
  }

  const clearedBoard = [
    ...Array.from({ length: linesCleared }, () => Array.from({ length: board[0].length }, () => null)),
    ...incompleteRows.map((row) => [...row]),
  ] as BoardMatrix;

  return {
    board: clearedBoard,
    linesCleared,
  };
}

export function commitLockedPiece(
  state: GameState,
  options: { softDropRows?: number; hardDropRows?: number } = {},
): GameState {
  if (!state.activePiece) {
    return state;
  }

  const mergedBoard = mergeActivePiece(state.board, state.activePiece);
  const { board, linesCleared } = clearCompletedLines(mergedBoard);
  const totalLinesCleared = state.metrics.linesCleared + linesCleared;
  const metrics = applyScoring(state.metrics, {
    level: state.metrics.level,
    linesCleared,
    totalLinesCleared,
    linesPerLevel: state.config.linesPerLevel,
    softDropRows: options.softDropRows ?? 0,
    hardDropRows: options.hardDropRows ?? 0,
  });

  return {
    ...state,
    board,
    activePiece: null,
    metrics: {
      ...metrics,
      level: calculateLevel(totalLinesCleared, state.config.linesPerLevel),
    },
    hold: {
      ...state.hold,
      canHold: true,
    },
    lock: createInitialLockState(),
    gravityTimerMs: 0,
    softDropActive: false,
  };
}

export function syncLockState(state: GameState): GameState {
  if (!state.activePiece) {
    return {
      ...state,
      lock: createInitialLockState(),
    };
  }

  if (!isPieceResting(state.board, state.activePiece)) {
    return {
      ...state,
      lock: createInitialLockState(),
    };
  }

  return {
    ...state,
    lock: {
      ...state.lock,
      startedAtMs: state.lock.startedAtMs ?? state.elapsedMs,
      remainingMs: state.lock.remainingMs ?? state.config.lockDelayMs,
      isResting: true,
    },
  };
}

export function reduceCommandEffects(state: GameState, commands: readonly EngineCommand[]): GameState {
  return commands.reduce((nextState, command) => {
    switch (command.type) {
      case 'pause_toggle':
        if (nextState.status === 'game_over') {
          return nextState;
        }

        return {
          ...updateStatus(nextState, nextState.status === 'paused' ? 'active' : 'paused'),
          softDropActive: false,
        };
      case 'restart':
        return createInitialGameState(nextState.seed, nextState.metrics.bestScore);
      default:
        return nextState;
    }
  }, state);
}