import { beforeEach, describe, expect, it } from 'vitest';
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
    expect(readSettings().show_ghost_piece).toBe(true);
    expect(readUIState().last_selected_panel).toBe('stats');
  });

  it('writes normalized settings and UI state documents', () => {
    const settings = mergeSettings({ show_ghost_piece: false });
    const uiState = mergeUIState({ last_selected_panel: 'controls' });

    expect(settings.control_profile).toBe('classic-desktop');
    expect(uiState.last_selected_panel).toBe('controls');
  });
});