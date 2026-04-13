import { beforeEach, describe, expect, it, vi } from 'vitest';

const exposeInMainWorld = vi.fn();
const invoke = vi.fn();

vi.mock('electron', () => ({
  contextBridge: {
    exposeInMainWorld,
  },
  ipcRenderer: {
    invoke,
  },
}));

describe('desktop preload contract', () => {
  beforeEach(() => {
    exposeInMainWorld.mockReset();
    invoke.mockReset();
  });

  it('requests desktop runtime info and version metadata through the bridge', async () => {
    invoke.mockResolvedValue({
      runtime: 'desktop',
      platform: 'win32',
      appVersion: '0.1.0',
    });

    const { createRuntimeInfoBridge } = await import('../../electron/preload');
    const bridge = createRuntimeInfoBridge();

    await expect(bridge.getRuntimeInfo()).resolves.toEqual({
      runtime: 'desktop',
      platform: 'win32',
      appVersion: '0.1.0',
    });
    expect(invoke).toHaveBeenCalledWith('runtime:get-info');
  });

  it('preserves platform and version metadata without narrowing the desktop contract to Windows only', async () => {
    invoke.mockResolvedValue({
      runtime: 'desktop',
      platform: 'darwin',
      appVersion: '1.2.3',
    });

    const { createRuntimeInfoBridge } = await import('../../electron/preload');
    const bridge = createRuntimeInfoBridge();

    await expect(bridge.getRuntimeInfo()).resolves.toEqual({
      runtime: 'desktop',
      platform: 'darwin',
      appVersion: '1.2.3',
    });
  });

  it('exposes the desktop API on window.desktopApi', async () => {
    const { exposeDesktopApi } = await import('../../electron/preload');
    const bridge = {
      getRuntimeInfo: vi.fn(),
      readDatabaseBytes: vi.fn(),
      writeDatabaseBytes: vi.fn(),
    };

    exposeDesktopApi(bridge);

    expect(exposeInMainWorld).toHaveBeenCalledWith('desktopApi', bridge);
  });
});