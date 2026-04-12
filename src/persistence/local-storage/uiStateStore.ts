import {
  DEFAULT_UI_STATE,
  LOCAL_STORAGE_KEYS,
  type UIStateDocument,
} from '../../types/persistence';

function hasLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function isUIStateDocument(value: unknown): value is UIStateDocument {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<UIStateDocument>;

  return (
    candidate.version === 1
    && ['none', 'paused', 'game_over', 'help'].includes(candidate.last_overlay ?? '')
    && typeof candidate.has_seeded_demo_data === 'boolean'
    && ['stats', 'controls', 'history'].includes(candidate.last_selected_panel ?? '')
  );
}

export function readUIState(): UIStateDocument {
  if (!hasLocalStorage()) {
    return DEFAULT_UI_STATE;
  }

  try {
    const storedValue = window.localStorage.getItem(LOCAL_STORAGE_KEYS.uiState);

    if (!storedValue) {
      return DEFAULT_UI_STATE;
    }

    const parsed = JSON.parse(storedValue) as unknown;
    return isUIStateDocument(parsed) ? parsed : DEFAULT_UI_STATE;
  } catch {
    return DEFAULT_UI_STATE;
  }
}

export function writeUIState(uiState: UIStateDocument): void {
  if (!hasLocalStorage()) {
    return;
  }

  window.localStorage.setItem(LOCAL_STORAGE_KEYS.uiState, JSON.stringify(uiState));
}

export function mergeUIState(partialState: Partial<UIStateDocument>): UIStateDocument {
  return {
    ...readUIState(),
    ...partialState,
    version: 1,
  };
}

export function resetUIState(): UIStateDocument {
  writeUIState(DEFAULT_UI_STATE);
  return DEFAULT_UI_STATE;
}