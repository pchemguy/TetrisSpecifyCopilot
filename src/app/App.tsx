import GameCanvas from '../canvas/GameCanvas';
import HudLayout from '../components/hud/HudLayout';
import { createInitialGameState } from '../engine/core/gameState';
import { getTetrominoDefinition } from '../engine/rules/tetrominoes';
import type { BoardTile } from '../types/game';
import { usePersistence } from './providers/PersistenceProvider';

function createPreviewState() {
  const baseState = createInitialGameState('app-shell-preview');
  const board = baseState.board.map((row) => [...row]) as BoardTile[][];

  const placeTile = (row: number, column: number, tetrominoId: 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L') => {
    board[row][column] = {
      tetrominoId,
      colorToken: getTetrominoDefinition(tetrominoId).colorToken,
    };
  };

  placeTile(21, 3, 'J');
  placeTile(21, 4, 'J');
  placeTile(21, 5, 'L');
  placeTile(21, 6, 'L');
  placeTile(20, 4, 'S');
  placeTile(20, 5, 'S');
  placeTile(20, 6, 'Z');
  placeTile(19, 5, 'O');

  return {
    ...baseState,
    status: 'active' as const,
    board,
    activePiece: {
      tetrominoId: 'T' as const,
      rotationIndex: 0 as const,
      x: 3,
      y: 5,
      spawnTick: 0,
    },
    metrics: {
      ...baseState.metrics,
      score: 4820,
      level: 4,
      linesCleared: 28,
    },
  };
}

const previewState = createPreviewState();

export default function App() {
  const { bestScore, health, isHydrated, settings, uiState, warnings } = usePersistence();
  const readinessItems = [
    `Persistence ${health}`,
    `Ghost ${settings.show_ghost_piece ? 'on' : 'off'}`,
    `Panel ${uiState.last_selected_panel}`,
  ];

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">Classic Browser Tetris</p>
        <h1>Build the playfield before the first piece drops.</h1>
        <p className="hero-copy">
          The project shell is ready for the game loop, canvas renderer, and local-first
          persistence layers that follow in the next setup tasks.
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
        score={previewState.metrics.score}
        bestScore={bestScore}
        level={previewState.metrics.level}
        linesCleared={previewState.metrics.linesCleared}
        status={isHydrated ? health : 'bootstrapping'}
        aside={
          <div className="hud-status-card">
            <p className="section-label">Persistence</p>
            <strong>{bestScore} best-score preview</strong>
            <p>
              {warnings.length > 0
                ? warnings[0].message
                : 'Seed data and provider wiring are available for later gameplay tasks.'}
            </p>
          </div>
        }
      >
        <article className="surface-card playfield-card">
          <header>
            <p className="section-label">Playfield Surface</p>
            <h2>Canvas renderer baseline</h2>
          </header>
          <GameCanvas board={previewState.board} activePiece={previewState.activePiece} />
          <p className="card-copy">
            The shared board renderer now draws a real canvas grid and staged preview stack,
            ready for gameplay loop integration and overlay work.
          </p>
        </article>
      </HudLayout>
    </main>
  );
}