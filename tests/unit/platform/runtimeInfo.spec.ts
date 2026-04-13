import path from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDesktopRuntimeInfo, normalizeDesktopPlatform } from '../../../src/platform/runtimeInfo';

vi.mock('electron', () => ({
  app: {
    isPackaged: false,
    getAppPath: () => 'B:/GH/TetrisSpecifyCopilot',
    getPath: () => 'B:/GH/TetrisSpecifyCopilot/.tmp/user-data',
    whenReady: vi.fn(async () => undefined),
    on: vi.fn(),
    quit: vi.fn(),
    getVersion: () => '0.1.0',
  },
  BrowserWindow: vi.fn(),
  ipcMain: {
    handle: vi.fn(),
  },
}));

describe('runtime info helpers', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('normalizes supported desktop platforms without hardcoding Windows-only behavior', () => {
    expect(normalizeDesktopPlatform('win32')).toBe('win32');
    expect(normalizeDesktopPlatform('darwin')).toBe('darwin');
    expect(normalizeDesktopPlatform('linux')).toBe('linux');
    expect(normalizeDesktopPlatform('freebsd')).toBe('linux');
  });

  it('creates desktop runtime metadata with the supplied platform and version', () => {
    expect(createDesktopRuntimeInfo('darwin', '1.2.3')).toEqual({
      runtime: 'desktop',
      platform: 'darwin',
      appVersion: '1.2.3',
    });
  });

  it('builds the desktop database paths under the supplied userData directory', async () => {
    const { getDesktopDatabasePaths } = await import('../../../electron/main');
    const userDataDirectory = 'B:/tmp/tetris-user-data';

    expect(getDesktopDatabasePaths(userDataDirectory)).toEqual({
      directory: userDataDirectory,
      databasePath: path.join(userDataDirectory, 'desktop-state.sqlite'),
      tempPath: path.join(userDataDirectory, 'desktop-state.sqlite.tmp'),
    });
  });
});