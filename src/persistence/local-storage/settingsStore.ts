import {
  DEFAULT_USER_SETTINGS,
  LOCAL_STORAGE_KEYS,
  type UserSettingsDocument,
} from '../../types/persistence';

function hasLocalStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function isSettingsDocument(value: unknown): value is UserSettingsDocument {
  if (!value || typeof value !== 'object') {
    return false;
  }

  const candidate = value as Partial<UserSettingsDocument>;

  return (
    candidate.version === 1
    && candidate.control_profile === 'classic-desktop'
    && typeof candidate.show_ghost_piece === 'boolean'
    && typeof candidate.auto_pause_on_blur === 'boolean'
    && typeof candidate.reduce_motion === 'boolean'
  );
}

export function readSettings(): UserSettingsDocument {
  if (!hasLocalStorage()) {
    return DEFAULT_USER_SETTINGS;
  }

  try {
    const storedValue = window.localStorage.getItem(LOCAL_STORAGE_KEYS.settings);

    if (!storedValue) {
      return DEFAULT_USER_SETTINGS;
    }

    const parsed = JSON.parse(storedValue) as unknown;
    return isSettingsDocument(parsed) ? parsed : DEFAULT_USER_SETTINGS;
  } catch {
    return DEFAULT_USER_SETTINGS;
  }
}

export function writeSettings(settings: UserSettingsDocument): void {
  if (!hasLocalStorage()) {
    return;
  }

  window.localStorage.setItem(LOCAL_STORAGE_KEYS.settings, JSON.stringify(settings));
}

export function mergeSettings(
  partialSettings: Partial<UserSettingsDocument>,
): UserSettingsDocument {
  return {
    ...readSettings(),
    ...partialSettings,
    version: 1,
    control_profile: 'classic-desktop',
  };
}

export function resetSettings(): UserSettingsDocument {
  writeSettings(DEFAULT_USER_SETTINGS);
  return DEFAULT_USER_SETTINGS;
}