import { getTetrominoDefinition } from '../../engine/rules/tetrominoes';
import {
  BOARD_DIMENSIONS,
  type ActivePiece,
  type BoardMatrix,
  type BoardTile,
  type ColorToken,
} from '../../types/game';

export interface BoardRenderModel {
  board: BoardMatrix;
  activePiece: ActivePiece | null;
  showGrid?: boolean;
}

const CELL_SIZE = 24;

const PIECE_COLORS: Record<ColorToken, string> = {
  cyan: '#46d5ff',
  yellow: '#f5d34d',
  violet: '#9d6dff',
  green: '#51d37d',
  red: '#f86b71',
  blue: '#4f8cff',
  orange: '#ff9b4a',
};

function drawCell(
  context: CanvasRenderingContext2D,
  column: number,
  row: number,
  tile: BoardTile,
): void {
  const x = column * CELL_SIZE;
  const y = row * CELL_SIZE;

  context.fillStyle = PIECE_COLORS[tile.colorToken];
  context.fillRect(x + 1, y + 1, CELL_SIZE - 2, CELL_SIZE - 2);

  context.fillStyle = 'rgba(255, 255, 255, 0.2)';
  context.fillRect(x + 3, y + 3, CELL_SIZE - 8, 5);

  context.strokeStyle = 'rgba(7, 10, 14, 0.42)';
  context.lineWidth = 1;
  context.strokeRect(x + 1.5, y + 1.5, CELL_SIZE - 3, CELL_SIZE - 3);
}

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

function drawActivePiece(
  context: CanvasRenderingContext2D,
  activePiece: ActivePiece,
): void {
  const definition = getTetrominoDefinition(activePiece.tetrominoId);
  const matrix = definition.rotationStates[activePiece.rotationIndex];

  matrix.forEach((row, rowOffset) => {
    row.forEach((cell, columnOffset) => {
      if (cell !== 1) {
        return;
      }

      const boardColumn = activePiece.x + columnOffset;
      const boardRow = activePiece.y + rowOffset - BOARD_DIMENSIONS.hiddenRows;

      if (
        boardColumn < 0
        || boardColumn >= BOARD_DIMENSIONS.columns
        || boardRow < 0
        || boardRow >= BOARD_DIMENSIONS.visibleRows
      ) {
        return;
      }

      drawCell(context, boardColumn, boardRow, {
        tetrominoId: definition.id,
        colorToken: definition.colorToken,
      });
    });
  });
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

      drawCell(context, columnIndex, rowIndex, cell);
    });
  });

  if (model.activePiece) {
    drawActivePiece(context, model.activePiece);
  }

  if (model.showGrid ?? true) {
    drawGrid(context, width, height);
  }
}