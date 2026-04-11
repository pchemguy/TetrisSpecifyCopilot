import { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../../engine/core/gameEngine';
import { PerformanceTracker } from '../../engine/core/performance';
import { ReplayRecorder } from '../../engine/replay/replayRecorder';
import type { EngineCommandName, GameState } from '../../types/game';
import type { OverlayState, ScoreRecord, SessionRecord } from '../../types/persistence';
import type { ReplayEnvelope } from '../../types/replay';

export interface CompletedSessionArtifacts {
  session: SessionRecord;
  score: ScoreRecord;
  replay: ReplayEnvelope;
}

export interface UseGameSessionOptions {
  onCompletedSession?: (artifacts: CompletedSessionArtifacts) => Promise<void> | void;
  onOverlayStateChange?: (overlayState: OverlayState) => void;
}

export interface UseGameSessionResult {
  state: GameState;
  dispatchCommand: (type: EngineCommandName) => void;
  lastInputLatencyMs: number | null;
}

function createCompletedSessionArtifacts(
  state: GameState,
  startedAtMs: number,
  bestScore: number,
  replay: ReplayEnvelope,
): CompletedSessionArtifacts {
  const endedAt = new Date().toISOString();
  const durationMs = Math.max(0, Date.now() - startedAtMs);
  const scoreId = `score-${state.sessionId}`;

  return {
    session: {
      session_id: state.sessionId,
      started_at: new Date(startedAtMs).toISOString(),
      ended_at: endedAt,
      status: 'game_over',
      seed: state.seed,
      score: state.metrics.score,
      level: state.metrics.level,
      lines_cleared: state.metrics.linesCleared,
      duration_ms: durationMs,
      best_score_at_end: Math.max(bestScore, state.metrics.score),
    },
    score: {
      score_id: scoreId,
      session_id: state.sessionId,
      final_score: state.metrics.score,
      level_reached: state.metrics.level,
      lines_cleared: state.metrics.linesCleared,
      achieved_at: endedAt,
      is_personal_best: state.metrics.score >= bestScore,
    },
    replay,
  };
}

export function useGameSession(bestScore: number, options: UseGameSessionOptions = {}): UseGameSessionResult {
  const [engine] = useState(() => new GameEngine({ seed: 'browser-session', bestScore }));
  const [performanceTracker] = useState(() => new PerformanceTracker());
  const [state, setState] = useState<GameState>(() => engine.getState());
  const [lastInputLatencyMs, setLastInputLatencyMs] = useState<number | null>(null);
  const startedAtRef = useRef(0);
  const replayRecorderRef = useRef(new ReplayRecorder(engine.getState().sessionId, engine.getState().seed, 0));
  const completedSessionIdRef = useRef<string | null>(null);

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
    replayRecorderRef.current = new ReplayRecorder(state.sessionId, state.seed, Date.now());
    startedAtRef.current = Date.now();
    completedSessionIdRef.current = null;
  }, [state.sessionId, state.seed]);

  useEffect(() => {
    options.onOverlayStateChange?.(
      state.status === 'paused'
        ? 'paused'
        : state.status === 'game_over'
          ? 'game_over'
          : 'none',
    );
  }, [options, state.status]);

  useEffect(() => {
    if (state.status !== 'game_over' || completedSessionIdRef.current === state.sessionId) {
      return;
    }

    completedSessionIdRef.current = state.sessionId;
    const replay = replayRecorderRef.current.finalize(state, new Date().toISOString());
    void options.onCompletedSession?.(
      createCompletedSessionArtifacts(state, startedAtRef.current, bestScore, replay),
    );
  }, [bestScore, options, state]);

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
    replayRecorderRef.current.record(type, engine.getState().currentTick);
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