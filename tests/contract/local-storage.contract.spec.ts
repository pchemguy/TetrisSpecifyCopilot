import { beforeEach, describe, expect, it } from 'vitest';
import { commitBestScore, readBestScore } from '../../src/persistence/local-storage/bestScoreStore';
import { mergeSettings, readSettings } from '../../src/persistence/local-storage/settingsStore';
import { mergeUIState, readUIState } from '../../src/persistence/local-storage/uiStateStore';
import { LOCAL_STORAGE_KEYS } from '../../src/types/persistence';

describe('localStorage contract', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('uses the required storage keys and falls back to shipped defaults', () => {
    expect(LOCAL_STORAGE_KEYS.settings).toBe('tetris.settings.v1');
    expect(LOCAL_STORAGE_KEYS.uiState).toBe('tetris.ui.v1');
    expect(LOCAL_STORAGE_KEYS.bestScore).toBe('tetris.best-score.v1');
    expect(readSettings().show_ghost_piece).toBe(true);
    expect(readUIState().last_selected_panel).toBe('stats');
    expect(readBestScore()).toBe(0);
  });

  it('writes normalized settings, UI state, and best score documents', () => {
    const settings = mergeSettings({ show_ghost_piece: false });
    const uiState = mergeUIState({ last_selected_panel: 'controls' });
    const bestScore = commitBestScore(4200);

    expect(settings.control_profile).toBe('classic-desktop');
    expect(uiState.last_selected_panel).toBe('controls');
    expect(bestScore).toBe(4200);
  });
});