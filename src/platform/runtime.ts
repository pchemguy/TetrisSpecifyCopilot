import { readBrowserRuntimeInfo } from './browser/runtime.js';
import {
  getDesktopApi,
  hasCompleteDesktopApi,
  hasDesktopApi,
  hasRuntimeInfoMethod,
  isElectronShell,
} from './desktop/runtime.js';

export { getDesktopApi, hasCompleteDesktopApi, hasDesktopApi, isElectronShell } from './desktop/runtime.js';

export type RuntimeMode = 'browser' | 'desktop';

export type DesktopPlatform = 'win32' | 'darwin' | 'linux';

export type RuntimePlatform = DesktopPlatform | 'web';

export type DesktopPersistenceErrorCode =
  | 'desktop_bridge_unavailable'
  | 'desktop_data_unreadable'
  | 'desktop_data_invalid'
  | 'desktop_persistence_disabled'
  | 'desktop_write_permission_denied'
  | 'desktop_write_locked'
  | 'desktop_write_no_space'
  | 'desktop_write_failed';

export interface DesktopPersistenceError {
  code: DesktopPersistenceErrorCode;
  message: string;
}

export type DesktopDatabaseLoadResult =
  | {
    status: 'ok';
    bytes: Uint8Array | null;
  }
  | {
    status: 'error';
    error: DesktopPersistenceError;
  };

export type DesktopDatabaseSaveResult =
  | {
    status: 'ok';
  }
  | {
    status: 'error';
    error: DesktopPersistenceError;
  };

export interface DesktopRuntimeInfo {
  runtime: 'desktop';
  platform: DesktopPlatform;
  appVersion: string;
}

export interface BrowserRuntimeInfo {
  runtime: 'browser';
  platform: 'web';
  appVersion: null;
}

export type RuntimeInfo = DesktopRuntimeInfo | BrowserRuntimeInfo;

export interface DesktopApi {
  getRuntimeInfo: () => Promise<DesktopRuntimeInfo>;
  readDatabaseBytes: () => Promise<DesktopDatabaseLoadResult>;
  writeDatabaseBytes: (bytes: Uint8Array) => Promise<DesktopDatabaseSaveResult>;
}

export function isDesktopPersistenceErrorCode(value: unknown): value is DesktopPersistenceErrorCode {
  return value === 'desktop_bridge_unavailable'
    || value === 'desktop_data_unreadable'
    || value === 'desktop_data_invalid'
    || value === 'desktop_persistence_disabled'
    || value === 'desktop_write_permission_denied'
    || value === 'desktop_write_locked'
    || value === 'desktop_write_no_space'
    || value === 'desktop_write_failed';
}

export function getRuntimeMode(): RuntimeMode {
  return hasDesktopApi() || isElectronShell() ? 'desktop' : 'browser';
}

export function isDesktopRuntime(): boolean {
  return getRuntimeMode() === 'desktop';
}

export async function readRuntimeInfo(): Promise<RuntimeInfo> {
  const desktopApi = getDesktopApi();

  if (!hasRuntimeInfoMethod(desktopApi)) {
    return readBrowserRuntimeInfo();
  }

  return desktopApi.getRuntimeInfo();
}