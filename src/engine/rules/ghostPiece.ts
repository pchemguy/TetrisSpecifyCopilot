import type { ActivePiece, BoardMatrix } from '../../types/game';
import { getHardDropDistance, translatePiece } from './collision';

export function getGhostProjection(
  board: BoardMatrix,
  activePiece: ActivePiece | null,
): ActivePiece | null {
  if (!activePiece) {
    return null;
  }

  const hardDropDistance = getHardDropDistance(board, activePiece);
  return translatePiece(activePiece, 0, hardDropDistance);
}