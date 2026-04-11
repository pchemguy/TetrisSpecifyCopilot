import GameCanvas from '../canvas/GameCanvas';
import KeyboardInputHandler from '../components/controls/KeyboardInputHandler';
import HudLayout from '../components/hud/HudLayout';
import GameOverOverlay from '../components/overlays/GameOverOverlay';
import { useGameSession } from './state/useGameSession';
import { usePersistence } from './providers/PersistenceProvider';

export default function App() {
  const { bestScore, health, isHydrated, settings, uiState, warnings } = usePersistence();
  const { state, dispatchCommand, lastInputLatencyMs } = useGameSession(bestScore);
  const liveBestScore = Math.max(bestScore, state.metrics.bestScore);
  const readinessItems = [
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
        aside={
          <div className="hud-status-card">
            <p className="section-label">Persistence</p>
            <strong>{liveBestScore} best score</strong>
            <p>
              {warnings.length > 0
                ? warnings[0].message
                : `Selected panel: ${uiState.last_selected_panel}. Last input latency: ${Math.round(lastInputLatencyMs ?? 0)} ms.`}
            </p>
          </div>
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
              inputLatencyMs={lastInputLatencyMs}
            />
            {state.status === 'paused' ? (
              <div className="playfield-overlay" role="dialog" aria-label="Pause overlay">
                <p className="section-label">Session halted</p>
                <h3>Paused</h3>
                <p>Press P or Escape to resume.</p>
              </div>
            ) : null}
            {state.status === 'game_over' ? (
              <GameOverOverlay score={state.metrics.score} onRestart={() => dispatchCommand('restart')} />
            ) : null}
          </div>
          <p className="card-copy">
            Controls: Left/Right move, Up or X rotate, Down soft drop, Space hard drop, P
            pause, and R restart.
          </p>
        </article>
      </HudLayout>
    </main>
  );
}