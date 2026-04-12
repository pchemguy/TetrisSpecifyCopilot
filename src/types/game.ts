export const BOARD_DIMENSIONS = {
  columns: 10,
  visibleRows: 20,
  hiddenRows: 2,
} as const;

export const TETROMINO_IDS = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'] as const;

export type TetrominoId = (typeof TETROMINO_IDS)[number];

export type RotationIndex = 0 | 1 | 2 | 3;

export type KickTableId = 'jlstz' | 'i' | 'o';

export type ColorToken =
  | 'cyan'
  | 'yellow'
  | 'violet'
  | 'green'
  | 'red'
  | 'blue'
  | 'orange';

export type BoardTile = {
  tetrominoId: TetrominoId;
  colorToken: ColorToken;
};

export type BoardMatrix = ReadonlyArray<ReadonlyArray<BoardTile | null>>;

export type MatrixCell = 0 | 1;

export type TetrominoMatrix = readonly [
  readonly [MatrixCell, MatrixCell, MatrixCell, MatrixCell],
  readonly [MatrixCell, MatrixCell, MatrixCell, MatrixCell],
  readonly [MatrixCell, MatrixCell, MatrixCell, MatrixCell],
  readonly [MatrixCell, MatrixCell, MatrixCell, MatrixCell],
];

export interface GridPosition {
  x: number;
  y: number;
}

export interface TetrominoDefinition {
  id: TetrominoId;
  colorToken: ColorToken;
  rotationStates: readonly [TetrominoMatrix, TetrominoMatrix, TetrominoMatrix, TetrominoMatrix];
  kickTableId: KickTableId;
}

export interface ActivePiece {
  tetrominoId: TetrominoId;
  rotationIndex: RotationIndex;
  x: number;
  y: number;
  spawnTick: number;
}

export interface HoldState {
  tetrominoId: TetrominoId | null;
  canHold: boolean;
}

export interface LockState {
  startedAtMs: number | null;
  remainingMs: number | null;
  resetCount: number;
  isResting: boolean;
}

export interface GameMetrics {
  score: number;
  level: number;
  linesCleared: number;
  bestScore: number;
}

export type SessionStatus = 'idle' | 'active' | 'paused' | 'game_over' | 'abandoned';

export type EngineCommandName =
  | 'move_left'
  | 'move_right'
  | 'rotate_cw'
  | 'rotate_ccw'
  | 'soft_drop_start'
  | 'soft_drop_stop'
  | 'hard_drop'
  | 'hold'
  | 'pause_toggle'
  | 'restart';

export type EngineCommand = {
  type: EngineCommandName;
  issuedAtMs: number;
  source: 'keyboard' | 'replay' | 'system';
};

export interface GravityProfile {
  baseIntervalMs: number;
  levelMultiplier: number;
  minimumIntervalMs: number;
}

export interface GameplayConfig {
  board: typeof BOARD_DIMENSIONS;
  lockDelayMs: number;
  maxLockResets: number;
  linesPerLevel: number;
  gravity: GravityProfile;
}

export interface GameState {
  sessionId: string;
  seed: string;
  status: SessionStatus;
  board: BoardMatrix;
  activePiece: ActivePiece | null;
  nextQueue: readonly TetrominoId[];
  hold: HoldState;
  metrics: GameMetrics;
  lock: LockState;
  currentTick: number;
  elapsedMs: number;
  gravityTimerMs: number;
  softDropActive: boolean;
  config: GameplayConfig;
}

export const DEFAULT_GAMEPLAY_CONFIG: GameplayConfig = {
  board: BOARD_DIMENSIONS,
  lockDelayMs: 500,
  maxLockResets: 15,
  linesPerLevel: 10,
  gravity: {
    baseIntervalMs: 1000,
    levelMultiplier: 0.85,
    minimumIntervalMs: 50,
  },
};