import { getTetrominoDefinition } from '../../engine/rules/tetrominoes';
import type { TetrominoId } from '../../types/game';

export interface HoldPanelProps {
  tetrominoId: TetrominoId | null;
  canHold: boolean;
}

export function HoldPanel({ tetrominoId, canHold }: HoldPanelProps) {
  const tone = tetrominoId ? getTetrominoDefinition(tetrominoId).colorToken : null;

  return (
    <section className="hud-panel hud-piece-panel" aria-label="Held piece panel">
      <p className="section-label">Held piece</p>
      <strong>{tetrominoId ?? 'Empty'}</strong>
      <p className={`tetromino-badge ${tone ? `tetromino-${tone}` : ''}`}>
        {tetrominoId ? `Hold: ${tetrominoId}` : 'Hold slot empty'}
      </p>
      <p>{canHold ? 'Hold ready' : 'Hold spent this turn'}</p>
    </section>
  );
}

export default HoldPanel;