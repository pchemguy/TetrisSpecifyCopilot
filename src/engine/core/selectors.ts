import type { GameState, TetrominoId } from '../../types/game';
import { getGhostProjection } from '../rules/ghostPiece';

export function selectNextTetromino(state: GameState): TetrominoId | null {
  return state.nextQueue[0] ?? null;
}

export function selectPreviewQueue(state: GameState): readonly TetrominoId[] {
  return state.nextQueue;
}

export function selectHeldTetromino(state: GameState): TetrominoId | null {
  return state.hold.tetrominoId;
}

export function selectGhostPiece(state: GameState) {
  return getGhostProjection(state.board, state.activePiece);
}