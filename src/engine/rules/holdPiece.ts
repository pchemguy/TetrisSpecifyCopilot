import { createInitialLockState, createSpawnPiece, refillPreviewQueue } from '../core/gameState';
import type { GameState } from '../../types/game';
import { canPlacePiece } from './collision';

export function applyHoldPiece(state: GameState): GameState {
  if (!state.activePiece || !state.hold.canHold) {
    return state;
  }

  if (state.lock.isResting && state.lock.remainingMs === 0) {
    return state;
  }

  const heldTetrominoId = state.hold.tetrominoId;
  const nextTetrominoId = heldTetrominoId ?? state.nextQueue[0];

  if (!nextTetrominoId) {
    return state;
  }

  const nextQueue = heldTetrominoId
    ? state.nextQueue
    : refillPreviewQueue(state, state.nextQueue.slice(1));
  const nextActivePiece = createSpawnPiece(nextTetrominoId, state.currentTick);

  if (!canPlacePiece(state.board, nextActivePiece)) {
    return {
      ...state,
      status: 'game_over',
      activePiece: null,
      hold: {
        tetrominoId: state.activePiece.tetrominoId,
        canHold: false,
      },
      lock: createInitialLockState(),
      softDropActive: false,
    };
  }

  return {
    ...state,
    activePiece: nextActivePiece,
    nextQueue,
    hold: {
      tetrominoId: state.activePiece.tetrominoId,
      canHold: false,
    },
    lock: createInitialLockState(),
    gravityTimerMs: 0,
    softDropActive: false,
  };
}