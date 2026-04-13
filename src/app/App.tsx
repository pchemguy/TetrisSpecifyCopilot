import { useEffect, useState } from 'react';
import GameCanvas from '../canvas/GameCanvas';
import KeyboardInputHandler from '../components/controls/KeyboardInputHandler';
import BestScorePanel from '../components/hud/BestScorePanel';
import HudLayout from '../components/hud/HudLayout';
import GameOverOverlay from '../components/overlays/GameOverOverlay';
import PauseOverlay from '../components/overlays/PauseOverlay';
import PersistenceWarning from '../components/overlays/PersistenceWarning';
import { selectGhostPiece, selectHeldTetromino, selectNextTetromino } from '../engine/core/selectors';
import { summarizeSessionPerformance } from '../engine/core/performance';
import { readRuntimeInfo, type RuntimeInfo } from '../platform/runtime';
import { useGameSession } from './state/useGameSession';
import { usePersistence } from './providers/PersistenceProvider';

function formatRuntimeLabel(runtimeInfo: RuntimeInfo): string {
  if (runtimeInfo.runtime === 'desktop') {
    return `Runtime desktop/${runtimeInfo.platform} v${runtimeInfo.appVersion}`;
  }

  return 'Runtime browser/web';
}

export default function App() {
  const {
    bestScore,
    health,
    isHydrated,
    settings,
    uiState,
    warnings,
    recordCompletedSession,
    updateOverlayState,
  } = usePersistence();
  const { state, dispatchCommand, lastInputLatencyMs } = useGameSession(bestScore, {
    onCompletedSession: recordCompletedSession,
    onOverlayStateChange: updateOverlayState,
  });
  const liveBestScore = Math.max(bestScore, state.metrics.bestScore);
  const ghostPiece = settings.show_ghost_piece && state.status === 'active'
    ? selectGhostPiece(state)
    : null;
  const [runtimeLabel, setRuntimeLabel] = useState('Runtime browser/web');
  const performanceSummary = summarizeSessionPerformance(lastInputLatencyMs);

  useEffect(() => {
    let isActive = true;

    void readRuntimeInfo().then((runtimeInfo) => {
      if (isActive) {
        setRuntimeLabel(formatRuntimeLabel(runtimeInfo));
      }
    });

    return () => {
      isActive = false;
    };
  }, []);

  const readinessItems = [
    runtimeLabel,
    `Persistence ${health}`,
    `Ghost ${settings.show_ghost_piece ? 'on' : 'off'}`,
    `Panel ${uiState.last_selected_panel}`,
  ];

  return (
    <main className="app-shell">
      <KeyboardInputHandler onCommand={dispatchCommand} />

      <section className="hero-panel">
        <p className="eyebrow">Classic Browser Tetris</p>
        <h1>Guide the stack, not the placeholder shell.</h1>
        <p className="hero-copy">
          The deterministic engine, canvas renderer, and keyboard input path are now wired
          together in the live browser session.
        </p>
        <div className="readiness-strip" aria-label="Scaffold readiness highlights">
          {readinessItems.map((item) => (
            <span key={item} className="readiness-pill">
              {item}
            </span>
          ))}
        </div>
      </section>

      <HudLayout
        score={state.metrics.score}
        bestScore={liveBestScore}
        level={state.metrics.level}
        linesCleared={state.metrics.linesCleared}
        status={isHydrated ? health : 'bootstrapping'}
        nextTetromino={selectNextTetromino(state)}
        heldTetromino={selectHeldTetromino(state)}
        canHold={state.hold.canHold}
        aside={
          <>
            <BestScorePanel bestScore={liveBestScore} />
            <div className="hud-status-card hud-panel">
              <p className="section-label">Persistence</p>
              <strong>{health}</strong>
              <p>
                Selected panel: {uiState.last_selected_panel}. Last input latency:{' '}
                {Math.round(lastInputLatencyMs ?? 0)} ms. Performance budget:{' '}
                {performanceSummary.withinInputBudget ? 'healthy' : 'attention needed'}.
              </p>
            </div>
            {warnings[0] ? <PersistenceWarning warning={warnings[0]} /> : null}
          </>
        }
      >
        <article className="surface-card playfield-card">
          <header>
            <p className="section-label">Playfield Surface</p>
            <h2>Live session canvas</h2>
          </header>
          <div className="playfield-stage">
            <GameCanvas
              board={state.board}
              activePiece={state.activePiece}
              ghostPiece={ghostPiece}
              inputLatencyMs={lastInputLatencyMs}
            />
            {state.status === 'paused' ? <PauseOverlay /> : null}
            {state.status === 'game_over' ? (
              <GameOverOverlay score={state.metrics.score} onRestart={() => dispatchCommand('restart')} />
            ) : null}
          </div>
          <p className="card-copy">
            Plan the next queue, use hold once per turn, and watch the ghost projection to
            read the landing column before you commit.
          </p>
        </article>
      </HudLayout>
    </main>
  );
}