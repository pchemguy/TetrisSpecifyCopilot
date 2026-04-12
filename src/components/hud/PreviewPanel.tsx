import { getTetrominoDefinition } from '../../engine/rules/tetrominoes';
import type { TetrominoId } from '../../types/game';

export interface PreviewPanelProps {
  tetrominoId: TetrominoId | null;
}

export function PreviewPanel({ tetrominoId }: PreviewPanelProps) {
  const tone = tetrominoId ? getTetrominoDefinition(tetrominoId).colorToken : null;

  return (
    <section className="hud-panel hud-piece-panel" aria-label="Next piece panel">
      <p className="section-label">Next piece</p>
      <strong>{tetrominoId ?? 'Empty'}</strong>
      <p className={`tetromino-badge ${tone ? `tetromino-${tone}` : ''}`}>
        {tetrominoId ? `Next: ${tetrominoId}` : 'Queue pending'}
      </p>
    </section>
  );
}

export default PreviewPanel;