import { useEffect, useRef } from 'react';
import type { ActivePiece, BoardMatrix } from '../types/game';
import { createPerformanceSnapshot, isInputLatencyWithinBudget } from '../engine/core/performance';
import { getBoardCanvasSize, renderBoard } from './renderer/boardRenderer';

export interface GameCanvasProps {
  board: BoardMatrix;
  activePiece: ActivePiece | null;
  ghostPiece?: ActivePiece | null;
  inputLatencyMs?: number | null;
  title?: string;
}

export function GameCanvas({
  board,
  activePiece,
  ghostPiece = null,
  inputLatencyMs = null,
  title = 'Classic Browser Tetris board',
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const size = getBoardCanvasSize();
  const performanceSnapshot = createPerformanceSnapshot(inputLatencyMs);
  const withinBudget = isInputLatencyWithinBudget(performanceSnapshot);

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');

    if (!context) {
      return;
    }

    renderBoard(context, { board, activePiece, ghostPiece, showGrid: true });
  }, [activePiece, board, ghostPiece]);

  return (
    <div className="game-canvas-shell">
      <div className={`game-canvas-metric ${withinBudget ? 'within-budget' : 'out-of-budget'}`}>
        {inputLatencyMs === null ? 'Latency pending' : `Input latency ${Math.round(inputLatencyMs)} ms`}
      </div>
      <canvas
        ref={canvasRef}
        aria-label={title}
        className="game-canvas"
        width={size.width}
        height={size.height}
      />
    </div>
  );
}

export default GameCanvas;