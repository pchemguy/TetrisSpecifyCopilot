import { afterEach, describe, expect, it, vi } from 'vitest';
import { getRuntimeMode, hasCompleteDesktopApi, readRuntimeInfo } from '../../../src/platform/runtime';

afterEach(() => {
  delete window.desktopApi;
  vi.unstubAllGlobals();
});

describe('runtime selection', () => {
  it('treats an absent desktop bridge as the normal browser path', async () => {
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0' });

    expect(getRuntimeMode()).toBe('browser');
    await expect(readRuntimeInfo()).resolves.toEqual({
      runtime: 'browser',
      platform: 'web',
      appVersion: null,
    });
  });

  it('keeps desktop mode when Electron is present even if the bridge is incomplete', () => {
    vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 Electron/37.0.0' });
    window.desktopApi = {
      getRuntimeInfo: vi.fn(async () => ({
        runtime: 'desktop' as const,
        platform: 'win32' as const,
        appVersion: '0.1.0',
      })),
    };

    expect(getRuntimeMode()).toBe('desktop');
    expect(hasCompleteDesktopApi(window.desktopApi)).toBe(false);
  });

  it('recognizes a complete desktop bridge when all persistence methods are present', () => {
    window.desktopApi = {
      getRuntimeInfo: vi.fn(async () => ({
        runtime: 'desktop' as const,
        platform: 'win32' as const,
        appVersion: '0.1.0',
      })),
      readDatabaseBytes: vi.fn(async () => ({
        status: 'ok' as const,
        bytes: null,
      })),
      writeDatabaseBytes: vi.fn(async () => ({
        status: 'ok' as const,
      })),
    };

    expect(hasCompleteDesktopApi(window.desktopApi)).toBe(true);
  });
});