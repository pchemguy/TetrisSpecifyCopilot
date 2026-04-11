import { DEFAULT_GAMEPLAY_CONFIG, TETROMINO_IDS, type BoardMatrix, type EngineCommand, type GameMetrics, type GameState, type HoldState, type LockState, type SessionStatus } from '../../types/game';
import { createSeededRandomSource, SevenBagRandomizer } from '../rules/randomizer';

export const ENGINE_TICK_MS = 16;

function createEmptyBoard(): BoardMatrix {
  return Array.from(
    { length: DEFAULT_GAMEPLAY_CONFIG.board.visibleRows + DEFAULT_GAMEPLAY_CONFIG.board.hiddenRows },
    () => Array.from({ length: DEFAULT_GAMEPLAY_CONFIG.board.columns }, () => null),
  );
}

function createInitialMetrics(bestScore = 0): GameMetrics {
  return {
    score: 0,
    level: 1,
    linesCleared: 0,
    bestScore,
  };
}

function createInitialHoldState(): HoldState {
  return {
    tetrominoId: null,
    canHold: true,
  };
}

function createInitialLockState(): LockState {
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

export function createInitialGameState(seed = 'default-seed', bestScore = 0): GameState {
  const bag = new SevenBagRandomizer(createSeededRandomSource(seed));

  return {
    sessionId: createSessionId(seed),
    seed,
    status: 'idle',
    board: createEmptyBoard(),
    activePiece: null,
    nextQueue: bag.preview(TETROMINO_IDS.length),
    hold: createInitialHoldState(),
    metrics: createInitialMetrics(bestScore),
    lock: createInitialLockState(),
    currentTick: 0,
    elapsedMs: 0,
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

export function withQueuedPreview(state: GameState, seed: string = state.seed): GameState {
  const randomizer = new SevenBagRandomizer(createSeededRandomSource(seed), [...state.nextQueue]);
  return {
    ...state,
    nextQueue: randomizer.preview(TETROMINO_IDS.length),
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

export function reduceCommandEffects(state: GameState, commands: readonly EngineCommand[]): GameState {
  return commands.reduce((nextState, command) => {
    switch (command.type) {
      case 'pause_toggle':
        if (nextState.status === 'game_over') {
          return nextState;
        }

        return updateStatus(nextState, nextState.status === 'paused' ? 'active' : 'paused');
      case 'restart':
        return createInitialGameState(nextState.seed, nextState.metrics.bestScore);
      default:
        return nextState;
    }
  }, state);
}