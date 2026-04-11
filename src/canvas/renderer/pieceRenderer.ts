import { getTetrominoDefinition } from '../../engine/rules/tetrominoes';
import type { ActivePiece, BoardTile, ColorToken } from '../../types/game';

const PIECE_COLORS: Record<ColorToken, string> = {
  cyan: '#46d5ff',
  yellow: '#f5d34d',
  violet: '#9d6dff',
  green: '#51d37d',
  red: '#f86b71',
  blue: '#4f8cff',
  orange: '#ff9b4a',
};

export function drawTileCell(
  context: CanvasRenderingContext2D,
  column: number,
  row: number,
  cellSize: number,
  tile: BoardTile,
): void {
  const x = column * cellSize;
  const y = row * cellSize;

  context.fillStyle = PIECE_COLORS[tile.colorToken];
  context.fillRect(x + 1, y + 1, cellSize - 2, cellSize - 2);

  context.fillStyle = 'rgba(255, 255, 255, 0.2)';
  context.fillRect(x + 3, y + 3, cellSize - 8, 5);

  context.strokeStyle = 'rgba(7, 10, 14, 0.42)';
  context.lineWidth = 1;
  context.strokeRect(x + 1.5, y + 1.5, cellSize - 3, cellSize - 3);
}

export function drawActivePiece(
  context: CanvasRenderingContext2D,
  activePiece: ActivePiece,
  cellSize: number,
  hiddenRows: number,
  visibleRows: number,
  columns: number,
): void {
  const definition = getTetrominoDefinition(activePiece.tetrominoId);
  const matrix = definition.rotationStates[activePiece.rotationIndex];

  matrix.forEach((row, rowOffset) => {
    row.forEach((cell, columnOffset) => {
      if (cell !== 1) {
        return;
      }

      const boardColumn = activePiece.x + columnOffset;
      const boardRow = activePiece.y + rowOffset - hiddenRows;

      if (boardColumn < 0 || boardColumn >= columns || boardRow < 0 || boardRow >= visibleRows) {
        return;
      }

      drawTileCell(context, boardColumn, boardRow, cellSize, {
        tetrominoId: definition.id,
        colorToken: definition.colorToken,
      });
    });
  });
}