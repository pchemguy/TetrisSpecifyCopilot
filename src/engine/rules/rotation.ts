import type { GridPosition, KickTableId, RotationIndex, TetrominoId } from '../../types/game';

export type RotationDirection = 'cw' | 'ccw';

type KickKey = `${RotationIndex}->${RotationIndex}`;

type KickTable = Partial<Record<KickKey, readonly GridPosition[]>>;

const JLSTZ_KICKS: KickTable = {
  '0->1': [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: -2 },
    { x: -1, y: -2 },
  ],
  '1->0': [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
  ],
  '1->2': [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: -1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
  ],
  '2->1': [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: -1, y: 1 },
    { x: 0, y: -2 },
    { x: -1, y: -2 },
  ],
  '2->3': [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: -2 },
    { x: 1, y: -2 },
  ],
  '3->2': [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: 0, y: 2 },
    { x: -1, y: 2 },
  ],
  '3->0': [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: -1, y: -1 },
    { x: 0, y: 2 },
    { x: -1, y: 2 },
  ],
  '0->3': [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
    { x: 0, y: -2 },
    { x: 1, y: -2 },
  ],
};

const I_KICKS: KickTable = {
  '0->1': [
    { x: 0, y: 0 },
    { x: -2, y: 0 },
    { x: 1, y: 0 },
    { x: -2, y: -1 },
    { x: 1, y: 2 },
  ],
  '1->0': [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: -1, y: 0 },
    { x: 2, y: 1 },
    { x: -1, y: -2 },
  ],
  '1->2': [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 2, y: 0 },
    { x: -1, y: 2 },
    { x: 2, y: -1 },
  ],
  '2->1': [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: -2, y: 0 },
    { x: 1, y: -2 },
    { x: -2, y: 1 },
  ],
  '2->3': [
    { x: 0, y: 0 },
    { x: 2, y: 0 },
    { x: -1, y: 0 },
    { x: 2, y: 1 },
    { x: -1, y: -2 },
  ],
  '3->2': [
    { x: 0, y: 0 },
    { x: -2, y: 0 },
    { x: 1, y: 0 },
    { x: -2, y: -1 },
    { x: 1, y: 2 },
  ],
  '3->0': [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: -2, y: 0 },
    { x: 1, y: -2 },
    { x: -2, y: 1 },
  ],
  '0->3': [
    { x: 0, y: 0 },
    { x: -1, y: 0 },
    { x: 2, y: 0 },
    { x: -1, y: 2 },
    { x: 2, y: -1 },
  ],
};

const O_KICKS: KickTable = {
  '0->1': [{ x: 0, y: 0 }],
  '1->0': [{ x: 0, y: 0 }],
  '1->2': [{ x: 0, y: 0 }],
  '2->1': [{ x: 0, y: 0 }],
  '2->3': [{ x: 0, y: 0 }],
  '3->2': [{ x: 0, y: 0 }],
  '3->0': [{ x: 0, y: 0 }],
  '0->3': [{ x: 0, y: 0 }],
};

const KICK_TABLES: Record<KickTableId, KickTable> = {
  jlstz: JLSTZ_KICKS,
  i: I_KICKS,
  o: O_KICKS,
};

export function getNextRotationIndex(
  current: RotationIndex,
  direction: RotationDirection,
): RotationIndex {
  if (direction === 'cw') {
    return ((current + 1) % 4) as RotationIndex;
  }

  return ((current + 3) % 4) as RotationIndex;
}

export function getKickOffsets(
  kickTableId: KickTableId,
  from: RotationIndex,
  to: RotationIndex,
): readonly GridPosition[] {
  const offsets = KICK_TABLES[kickTableId][`${from}->${to}`];

  if (!offsets) {
    throw new Error(`Missing kick offsets for ${kickTableId} ${from}->${to}.`);
  }

  return offsets;
}

export function getKickTableIdForTetromino(tetrominoId: TetrominoId): KickTableId {
  if (tetrominoId === 'I') {
    return 'i';
  }

  if (tetrominoId === 'O') {
    return 'o';
  }

  return 'jlstz';
}