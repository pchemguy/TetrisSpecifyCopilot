import type { EngineCommand, GameState } from '../../types/game';
import { CommandQueue, type QueuedCommand } from '../commands/commandQueue';
import { applyGameCommand, sortCommandsForProcessing } from '../commands/gameCommands';
import { canPlacePiece, translatePiece } from '../rules/collision';
import { ENGINE_TICK_MS, advanceClock, commitLockedPiece, createInitialGameState, createInitialLockState, createSpawnPiece, deriveGravityInterval, reduceCommandEffects, refillPreviewQueue, syncLockState } from './gameState';

const LOCK_RESET_COMMAND_TYPES = new Set<EngineCommand['type']>([
  'move_left',
  'move_right',
  'rotate_cw',
  'rotate_ccw',
]);

export interface EngineUpdate {
  state: GameState;
  processedCommands: readonly QueuedCommand[];
  simulatedTicks: number;
}

export interface GameEngineOptions {
  seed?: string;
  bestScore?: number;
  tickMs?: number;
}

export class GameEngine {
  private readonly tickMs: number;

  private readonly queue = new CommandQueue();

  private accumulatorMs = 0;

  private state: GameState;

  constructor(options: GameEngineOptions = {}) {
    this.tickMs = options.tickMs ?? ENGINE_TICK_MS;
    this.state = createInitialGameState(options.seed, options.bestScore ?? 0);
  }

  getState(): GameState {
    return this.state;
  }

  enqueue(command: EngineCommand): QueuedCommand {
    return this.queue.enqueue(command);
  }

  replaceState(nextState: GameState): GameState {
    this.state = nextState;
    return this.state;
  }

  reset(seed = this.state.seed, bestScore = this.state.metrics.bestScore): GameState {
    this.queue.clear();
    this.accumulatorMs = 0;
    this.state = createInitialGameState(seed, bestScore);
    return this.state;
  }

  private spawnNextPiece(state: GameState): GameState {
    const nextTetrominoId = state.nextQueue[0];

    if (!nextTetrominoId) {
      return state;
    }

    const activePiece = createSpawnPiece(nextTetrominoId, state.currentTick);
    const nextQueue = refillPreviewQueue(state, state.nextQueue.slice(1));

    if (!canPlacePiece(state.board, activePiece)) {
      return {
        ...state,
        status: 'game_over',
        activePiece: null,
        nextQueue,
        lock: createInitialLockState(),
        softDropActive: false,
      };
    }

    return syncLockState({
      ...state,
      activePiece,
      nextQueue,
      status: state.status === 'idle' ? 'active' : state.status,
      lock: createInitialLockState(),
      gravityTimerMs: 0,
    });
  }

  private ensureSpawnedState(state: GameState): GameState {
    if (!state.activePiece && state.status !== 'game_over') {
      return this.spawnNextPiece(state);
    }

    return state;
  }

  private processCommands(state: GameState, processedCommands: readonly QueuedCommand[]): GameState {
    const groupedCommands = new Map<number, QueuedCommand[]>();

    processedCommands.forEach((command) => {
      const existing = groupedCommands.get(command.issuedAtMs);

      if (existing) {
        existing.push(command);
        return;
      }

      groupedCommands.set(command.issuedAtMs, [command]);
    });

    let nextState = state;

    groupedCommands.forEach((commands) => {
      for (const command of sortCommandsForProcessing(commands)) {
        if (nextState.status === 'paused' && command.type !== 'pause_toggle' && command.type !== 'restart') {
          continue;
        }

        if (nextState.status === 'game_over' && command.type !== 'restart') {
          continue;
        }

        if (command.type === 'pause_toggle' || command.type === 'restart') {
          nextState = reduceCommandEffects(nextState, [command]);
          break;
        }

        if (nextState.status !== 'active') {
          continue;
        }

        nextState = applyGameCommand(nextState, command);

        if (command.type === 'hard_drop' || command.type === 'hold') {
          break;
        }
      }
    });

    return nextState;
  }

  private advanceSimulation(state: GameState, elapsedMs: number, skipLockCountdown = false): GameState {
    if (state.status !== 'active' || !state.activePiece) {
      return state;
    }

    let nextState = syncLockState(state);

    if (nextState.lock.isResting && nextState.lock.remainingMs !== null) {
      if (skipLockCountdown && nextState.lock.remainingMs === nextState.config.lockDelayMs) {
        return nextState;
      }

      const remainingMs = nextState.lock.remainingMs - elapsedMs;

      if (remainingMs <= 0) {
        return this.spawnNextPiece(commitLockedPiece(nextState));
      }

      return {
        ...nextState,
        lock: {
          ...nextState.lock,
          remainingMs,
        },
      };
    }

    const gravityInterval = nextState.softDropActive
      ? Math.min(deriveGravityInterval(nextState.metrics.level), 50)
      : deriveGravityInterval(nextState.metrics.level);
    let gravityBudgetMs = nextState.gravityTimerMs + elapsedMs;
    let softDropRows = 0;

    while (gravityBudgetMs >= gravityInterval && nextState.activePiece) {
      gravityBudgetMs -= gravityInterval;

      const movedPiece = translatePiece(nextState.activePiece, 0, 1);

      if (!canPlacePiece(nextState.board, movedPiece)) {
        break;
      }

      nextState = {
        ...nextState,
        activePiece: movedPiece,
      };

      if (nextState.softDropActive) {
        softDropRows += 1;
      }
    }

    nextState = {
      ...nextState,
      gravityTimerMs: gravityBudgetMs,
      metrics: nextState.softDropActive && softDropRows > 0
        ? {
          ...nextState.metrics,
          score: nextState.metrics.score + softDropRows,
        }
        : nextState.metrics,
    };

    return syncLockState(nextState);
  }

  private shouldSkipLockCountdown(processedCommands: readonly QueuedCommand[], state: GameState): boolean {
    return processedCommands.some((command) => LOCK_RESET_COMMAND_TYPES.has(command.type))
      && state.lock.isResting
      && state.lock.remainingMs === state.config.lockDelayMs;
  }

  advanceBy(elapsedMs: number): EngineUpdate {
    this.accumulatorMs += elapsedMs;

    const processedCommands = this.queue.drainUpTo(this.state.elapsedMs + elapsedMs);
    let nextState = this.ensureSpawnedState(this.state);

    nextState = this.processCommands(nextState, processedCommands);

    const skipLockCountdown = this.shouldSkipLockCountdown(processedCommands, nextState);

    nextState = this.ensureSpawnedState(nextState);

    nextState = this.advanceSimulation(nextState, elapsedMs, skipLockCountdown);

    const simulatedTicks = Math.floor(this.accumulatorMs / this.tickMs);

    if (simulatedTicks > 0) {
      this.accumulatorMs -= simulatedTicks * this.tickMs;
    }

    nextState = advanceClock(nextState, elapsedMs, simulatedTicks);

    this.state = nextState;

    return {
      state: this.state,
      processedCommands,
      simulatedTicks,
    };
  }

  peekQueue(): readonly QueuedCommand[] {
    return this.queue.peek();
  }
}