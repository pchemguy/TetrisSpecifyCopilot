export const DESKTOP_PERSISTENCE_COMMANDS = {
  loadBestScoreState: 'load_best_score_state',
  submitGameOverScore: 'submit_game_over_score',
} as const;

export type DesktopPersistenceCommandName =
  typeof DESKTOP_PERSISTENCE_COMMANDS[keyof typeof DESKTOP_PERSISTENCE_COMMANDS];

export type DesktopStorageMode = 'portable_adjacent' | 'localappdata_fallback';

export type DesktopNoticeCode = 'storage_fallback' | 'database_reset';

export interface DesktopStartupNotice {
  code: DesktopNoticeCode;
  message: string;
}

export interface LoadBestScoreStateResponse {
  bestScore: number;
  hasCompletedGame: boolean;
  showBestScore: boolean;
  storageMode: DesktopStorageMode;
  notice: DesktopStartupNotice | null;
}

export interface SubmitGameOverScoreRequest {
  finalScore: number;
  completedReason: 'game_over';
}

export interface SubmitGameOverScoreResponse {
  bestScore: number;
  hasCompletedGame: boolean;
  isNewBest: boolean;
  showCongratulations: boolean;
  showBestScore: boolean;
}