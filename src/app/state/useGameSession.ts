import { useEffect, useState } from 'react';
import { GameEngine } from '../../engine/core/gameEngine';
import { PerformanceTracker } from '../../engine/core/performance';
import type { EngineCommandName, GameState } from '../../types/game';

export interface UseGameSessionResult {
  state: GameState;
  dispatchCommand: (type: EngineCommandName) => void;
  lastInputLatencyMs: number | null;
}

export function useGameSession(bestScore: number): UseGameSessionResult {
  const [engine] = useState(() => new GameEngine({ seed: 'browser-session', bestScore }));
  const [performanceTracker] = useState(() => new PerformanceTracker());
  const [state, setState] = useState<GameState>(() => engine.getState());
  const [lastInputLatencyMs, setLastInputLatencyMs] = useState<number | null>(null);

  useEffect(() => {
    const nextState = engine.getState();

    if (bestScore <= nextState.metrics.bestScore) {
      return;
    }

    const replacedState = engine.replaceState({
      ...nextState,
      metrics: {
        ...nextState.metrics,
        bestScore,
      },
    });

    const timerId = window.setTimeout(() => {
      setState(replacedState);
    }, 0);

    return () => {
      window.clearTimeout(timerId);
    };
  }, [bestScore, engine]);

  useEffect(() => {
    let animationFrameId = 0;
    let previousTimestamp = performance.now();

    const tick = (timestamp: number) => {
      const elapsedMs = Math.min(timestamp - previousTimestamp, 250);
      previousTimestamp = timestamp;

      const update = engine.advanceBy(elapsedMs);

      if (update.processedCommands.length > 0 || update.simulatedTicks > 0) {
        setState(update.state);
        setLastInputLatencyMs(performanceTracker.consumeLatency());
      }

      animationFrameId = window.requestAnimationFrame(tick);
    };

    animationFrameId = window.requestAnimationFrame(tick);

    return () => {
      window.cancelAnimationFrame(animationFrameId);
    };
  }, [engine, performanceTracker]);

  const dispatchCommand = (type: EngineCommandName) => {
    performanceTracker.markInput();
    engine.enqueue({
      type,
      issuedAtMs: engine.getState().elapsedMs,
      source: 'keyboard',
    });

    const update = engine.advanceBy(0);
    setState(update.state);
    setLastInputLatencyMs(performanceTracker.consumeLatency());
  };

  return {
    state,
    dispatchCommand,
    lastInputLatencyMs,
  };
}