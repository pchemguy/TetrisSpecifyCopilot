import { useEffect, useRef } from 'react';
import type { ActivePiece, BoardMatrix } from '../types/game';
import { getBoardCanvasSize, renderBoard } from './renderer/boardRenderer';

export interface GameCanvasProps {
  board: BoardMatrix;
  activePiece: ActivePiece | null;
  title?: string;
}

export function GameCanvas({ board, activePiece, title = 'Classic Browser Tetris board' }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const size = getBoardCanvasSize();

  useEffect(() => {
    const context = canvasRef.current?.getContext('2d');

    if (!context) {
      return;
    }

    renderBoard(context, { board, activePiece, showGrid: true });
  }, [activePiece, board]);

  return (
    <div className="game-canvas-shell">
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