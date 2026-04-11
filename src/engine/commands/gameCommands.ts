import type { EngineCommand } from '../../types/game';
import type { GameState } from '../../types/game';
import { canPlacePiece, getHardDropDistance, isPieceResting, translatePiece } from '../rules/collision';
import { applyHoldPiece } from '../rules/holdPiece';
import { getKickOffsets, getKickTableIdForTetromino, getNextRotationIndex, type RotationDirection } from '../rules/rotation';

const COMMAND_PRIORITY: Record<EngineCommand['type'], number> = {
  hard_drop: 0,
  pause_toggle: 1,
  hold: 2,
  move_left: 3,
  move_right: 3,
  rotate_cw: 3,
  rotate_ccw: 3,
  soft_drop_start: 3,
  soft_drop_stop: 3,
  restart: 4,
};

function withSuccessfulAction(state: GameState, nextActivePiece: GameState['activePiece']): GameState {
  if (!nextActivePiece) {
    return state;
  }

  const wasResting = state.activePiece ? isPieceResting(state.board, state.activePiece) : false;
  const isResting = isPieceResting(state.board, nextActivePiece);

  if (!wasResting) {
    return {
      ...state,
      activePiece: nextActivePiece,
      lock: isResting
        ? {
          ...state.lock,
          startedAtMs: state.elapsedMs,
          remainingMs: state.config.lockDelayMs,
          isResting: true,
        }
        : {
          startedAtMs: null,
          remainingMs: null,
          resetCount: state.lock.resetCount,
          isResting: false,
        },
    };
  }

  if (state.lock.resetCount >= state.config.maxLockResets) {
    return {
      ...state,
      activePiece: nextActivePiece,
      lock: {
        ...state.lock,
        isResting,
      },
    };
  }

  return {
    ...state,
    activePiece: nextActivePiece,
    lock: {
      ...state.lock,
      startedAtMs: state.elapsedMs,
      remainingMs: state.config.lockDelayMs,
      resetCount: state.lock.resetCount + 1,
      isResting,
    },
  };
}

function moveHorizontally(state: GameState, offsetX: number): GameState {
  if (!state.activePiece) {
    return state;
  }

  const movedPiece = translatePiece(state.activePiece, offsetX, 0);

  if (!canPlacePiece(state.board, movedPiece)) {
    return state;
  }

  return withSuccessfulAction(state, movedPiece);
}

function rotatePiece(state: GameState, direction: RotationDirection): GameState {
  if (!state.activePiece) {
    return state;
  }

  const nextRotationIndex = getNextRotationIndex(state.activePiece.rotationIndex, direction);
  const kickTableId = getKickTableIdForTetromino(state.activePiece.tetrominoId);
  const kickOffsets = getKickOffsets(kickTableId, state.activePiece.rotationIndex, nextRotationIndex);

  for (const offset of kickOffsets) {
    const rotatedPiece = {
      ...state.activePiece,
      rotationIndex: nextRotationIndex,
      x: state.activePiece.x + offset.x,
      y: state.activePiece.y - offset.y,
    };

    if (!canPlacePiece(state.board, rotatedPiece)) {
      continue;
    }

    return withSuccessfulAction(state, rotatedPiece);
  }

  return state;
}

function startSoftDrop(state: GameState): GameState {
  if (!state.activePiece) {
    return {
      ...state,
      softDropActive: true,
    };
  }

  const movedPiece = translatePiece(state.activePiece, 0, 1);

  if (!canPlacePiece(state.board, movedPiece)) {
    return {
      ...state,
      softDropActive: true,
    };
  }

  return {
    ...withSuccessfulAction(state, movedPiece),
    softDropActive: true,
    metrics: {
      ...state.metrics,
      score: state.metrics.score + 1,
    },
  };
}

function hardDrop(state: GameState): GameState {
  if (!state.activePiece) {
    return state;
  }

  const hardDropDistance = getHardDropDistance(state.board, state.activePiece);
  const droppedPiece = translatePiece(state.activePiece, 0, hardDropDistance);

  return {
    ...state,
    activePiece: droppedPiece,
    softDropActive: false,
    metrics: {
      ...state.metrics,
      score: state.metrics.score + hardDropDistance * 2,
    },
    lock: {
      ...state.lock,
      startedAtMs: state.elapsedMs,
      remainingMs: 0,
      isResting: true,
    },
  };
}

export function sortCommandsForProcessing(commands: readonly EngineCommand[]) {
  return [...commands].sort((left, right) => {
    if (left.issuedAtMs !== right.issuedAtMs) {
      return left.issuedAtMs - right.issuedAtMs;
    }

    return COMMAND_PRIORITY[left.type] - COMMAND_PRIORITY[right.type];
  });
}

export function applyGameCommand(state: GameState, command: EngineCommand): GameState {
  switch (command.type) {
    case 'move_left':
      return moveHorizontally(state, -1);
    case 'move_right':
      return moveHorizontally(state, 1);
    case 'rotate_cw':
      return rotatePiece(state, 'cw');
    case 'rotate_ccw':
      return rotatePiece(state, 'ccw');
    case 'soft_drop_start':
      return startSoftDrop(state);
    case 'soft_drop_stop':
      return {
        ...state,
        softDropActive: false,
      };
    case 'hard_drop':
      return hardDrop(state);
    case 'hold':
      return applyHoldPiece(state);
    default:
      return state;
  }
}