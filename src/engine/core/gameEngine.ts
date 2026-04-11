import type { EngineCommand, GameState } from '../../types/game';
import { CommandQueue, type QueuedCommand } from '../commands/commandQueue';
import { ENGINE_TICK_MS, advanceClock, createInitialGameState, reduceCommandEffects } from './gameState';

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

  advanceBy(elapsedMs: number): EngineUpdate {
    this.accumulatorMs += elapsedMs;

    const processedCommands = this.queue.drainUpTo(this.state.elapsedMs + elapsedMs);
    let nextState = reduceCommandEffects(this.state, processedCommands);

    let simulatedTicks = 0;

    while (this.accumulatorMs >= this.tickMs) {
      this.accumulatorMs -= this.tickMs;
      simulatedTicks += 1;
      nextState = advanceClock(nextState, this.tickMs);
    }

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