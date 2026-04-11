import {
  BOARD_DIMENSIONS,
  type ActivePiece,
  type BoardMatrix,
} from '../../types/game';
import { drawActivePiece, drawTileCell } from './pieceRenderer';

export interface BoardRenderModel {
  board: BoardMatrix;
  activePiece: ActivePiece | null;
  showGrid?: boolean;
}

const CELL_SIZE = 24;

function drawGrid(context: CanvasRenderingContext2D, width: number, height: number): void {
  context.strokeStyle = 'rgba(255, 255, 255, 0.08)';
  context.lineWidth = 1;

  for (let column = 0; column <= BOARD_DIMENSIONS.columns; column += 1) {
    const x = column * CELL_SIZE;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }

  for (let row = 0; row <= BOARD_DIMENSIONS.visibleRows; row += 1) {
    const y = row * CELL_SIZE;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }
}

export function getBoardCanvasSize() {
  return {
    width: BOARD_DIMENSIONS.columns * CELL_SIZE,
    height: BOARD_DIMENSIONS.visibleRows * CELL_SIZE,
    cellSize: CELL_SIZE,
  };
}

export function renderBoard(context: CanvasRenderingContext2D, model: BoardRenderModel): void {
  const { width, height } = getBoardCanvasSize();
  const visibleRows = model.board.slice(-BOARD_DIMENSIONS.visibleRows);

  context.clearRect(0, 0, width, height);
  context.fillStyle = '#081017';
  context.fillRect(0, 0, width, height);

  visibleRows.forEach((row, rowIndex) => {
    row.forEach((cell, columnIndex) => {
      if (!cell) {
        return;
      }

      drawTileCell(context, columnIndex, rowIndex, CELL_SIZE, cell);
    });
  });

  if (model.activePiece) {
    drawActivePiece(
      context,
      model.activePiece,
      CELL_SIZE,
      BOARD_DIMENSIONS.hiddenRows,
      BOARD_DIMENSIONS.visibleRows,
      BOARD_DIMENSIONS.columns,
    );
  }

  if (model.showGrid ?? true) {
    drawGrid(context, width, height);
  }
}