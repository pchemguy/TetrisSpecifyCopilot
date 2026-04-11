import type { PropsWithChildren, ReactNode } from 'react';
import type { TetrominoId } from '../../types/game';
import ControlLegend from '../controls/ControlLegend';
import HoldPanel from './HoldPanel';
import PreviewPanel from './PreviewPanel';
import ScorePanel from './ScorePanel';

export interface HudLayoutProps extends PropsWithChildren {
  score: number;
  bestScore: number;
  level: number;
  linesCleared: number;
  status: string;
  nextTetromino: TetrominoId | null;
  heldTetromino: TetrominoId | null;
  canHold: boolean;
  aside?: ReactNode;
}

export function HudLayout({
  score,
  bestScore,
  level,
  linesCleared,
  status,
  nextTetromino,
  heldTetromino,
  canHold,
  children,
  aside,
}: HudLayoutProps) {
  return (
    <section className="hud-layout">
      <div className="hud-primary">{children}</div>
      <aside className="hud-aside">
        <ScorePanel
          score={score}
          bestScore={bestScore}
          level={level}
          linesCleared={linesCleared}
        />

        <div className="hud-secondary-grid">
          <PreviewPanel tetrominoId={nextTetromino} />
          <HoldPanel tetrominoId={heldTetromino} canHold={canHold} />
        </div>

        <div className="hud-status-card hud-panel">
          <p className="section-label">Session status</p>
          <strong>{status}</strong>
          <p>Canvas rendering and persistence hydration are now wired into the shared shell.</p>
        </div>

        <ControlLegend />

        {aside}
      </aside>
    </section>
  );
}

export default HudLayout;