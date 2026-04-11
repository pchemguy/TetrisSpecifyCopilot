export const LOCAL_STORAGE_KEYS = {
  settings: 'tetris.settings.v1',
  uiState: 'tetris.ui.v1',
  bestScore: 'tetris.best-score.v1',
} as const;

export type IsoTimestamp = string;

export type ControlProfile = 'classic-desktop';

export type OverlayState = 'none' | 'paused' | 'game_over' | 'help';

export type SelectedPanel = 'stats' | 'controls' | 'history';

export interface UserSettingsDocument {
  version: 1;
  control_profile: ControlProfile;
  show_ghost_piece: boolean;
  auto_pause_on_blur: boolean;
  reduce_motion: boolean;
}

export interface UIStateDocument {
  version: 1;
  last_overlay: OverlayState;
  has_seeded_demo_data: boolean;
  last_selected_panel: SelectedPanel;
}

export type PersistenceHealth = 'idle' | 'hydrating' | 'ready' | 'warning' | 'error';

export interface PersistenceWarning {
  code:
    | 'sqlite_unavailable'
    | 'replay_write_failed'
    | 'storage_pruned'
    | 'malformed_local_storage';
  message: string;
  recoverable: boolean;
}

export type SessionRecordStatus = 'active' | 'paused' | 'game_over' | 'abandoned';

export interface SessionRecord {
  session_id: string;
  started_at: IsoTimestamp;
  ended_at: IsoTimestamp | null;
  status: SessionRecordStatus;
  seed: string;
  score: number;
  level: number;
  lines_cleared: number;
  duration_ms: number;
  best_score_at_end: number | null;
}

export interface ScoreRecord {
  score_id: string;
  session_id: string;
  final_score: number;
  level_reached: number;
  lines_cleared: number;
  achieved_at: IsoTimestamp;
  is_personal_best: boolean;
}

export interface SeededPersistenceState {
  sessionsInserted: number;
  scoresInserted: number;
  replaysInserted: number;
}

export interface PersistenceSnapshot {
  settings: UserSettingsDocument;
  uiState: UIStateDocument;
  bestScore: number;
  health: PersistenceHealth;
  warnings: readonly PersistenceWarning[];
}

export const DEFAULT_USER_SETTINGS: UserSettingsDocument = {
  version: 1,
  control_profile: 'classic-desktop',
  show_ghost_piece: true,
  auto_pause_on_blur: true,
  reduce_motion: false,
};

export const DEFAULT_UI_STATE: UIStateDocument = {
  version: 1,
  last_overlay: 'none',
  has_seeded_demo_data: false,
  last_selected_panel: 'stats',
};