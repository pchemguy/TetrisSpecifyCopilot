import type { ActivePiece, BoardMatrix, GridPosition } from '../../types/game';
import { BOARD_DIMENSIONS } from '../../types/game';
import { getTetrominoDefinition } from './tetrominoes';

export function getPieceCells(activePiece: ActivePiece): GridPosition[] {
  const matrix = getTetrominoDefinition(activePiece.tetrominoId).rotationStates[activePiece.rotationIndex];
  const cells: GridPosition[] = [];

  matrix.forEach((row, rowOffset) => {
    row.forEach((cell, columnOffset) => {
      if (cell !== 1) {
        return;
      }

      cells.push({
        x: activePiece.x + columnOffset,
        y: activePiece.y + rowOffset,
      });
    });
  });

  return cells;
}

export function canPlacePiece(board: BoardMatrix, activePiece: ActivePiece): boolean {
  return getPieceCells(activePiece).every((cell) => {
    if (
      cell.x < 0
      || cell.x >= BOARD_DIMENSIONS.columns
      || cell.y < 0
      || cell.y >= BOARD_DIMENSIONS.visibleRows + BOARD_DIMENSIONS.hiddenRows
    ) {
      return false;
    }

    return board[cell.y][cell.x] === null;
  });
}

export function isPieceResting(board: BoardMatrix, activePiece: ActivePiece): boolean {
  return !canPlacePiece(board, translatePiece(activePiece, 0, 1));
}

export function translatePiece(activePiece: ActivePiece, offsetX: number, offsetY: number): ActivePiece {
  return {
    ...activePiece,
    x: activePiece.x + offsetX,
    y: activePiece.y + offsetY,
  };
}

export function getHardDropDistance(board: BoardMatrix, activePiece: ActivePiece): number {
  let distance = 0;

  while (canPlacePiece(board, translatePiece(activePiece, 0, distance + 1))) {
    distance += 1;
  }

  return distance;
}