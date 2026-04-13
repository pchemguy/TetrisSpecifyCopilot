import { beforeEach, describe, expect, it, vi } from 'vitest';

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

describe('desktop file store', () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it('treats a missing committed file as first run while cleaning a stale temp file', async () => {
    const operationLog: string[] = [];
    const { loadDesktopDatabaseBytes } = await import('../../../electron/main');

    const bytes = await loadDesktopDatabaseBytes(
      {
        mkdir: vi.fn(async () => {
          operationLog.push('mkdir');
        }),
        readFile: vi.fn(async () => {
          operationLog.push('read');
          const error = new Error('missing') as NodeJS.ErrnoException;
          error.code = 'ENOENT';
          throw error;
        }),
        writeFile: vi.fn(async () => undefined),
        rename: vi.fn(async () => undefined),
        rm: vi.fn(async () => {
          operationLog.push('rm');
        }),
      },
      'B:/tmp/tetris-user-data',
    );

    expect(bytes).toBeNull();
    expect(operationLog).toEqual(['mkdir', 'rm', 'read']);
  });

  it('writes the temp file before atomically renaming it into place', async () => {
    const operationLog: string[] = [];
    const { saveDesktopDatabaseBytes } = await import('../../../electron/main');

    await saveDesktopDatabaseBytes(
      {
        mkdir: vi.fn(async () => {
          operationLog.push('mkdir');
        }),
        readFile: vi.fn(async () => Buffer.from([])),
        writeFile: vi.fn(async () => {
          operationLog.push('write');
        }),
        rename: vi.fn(async () => {
          operationLog.push('rename');
        }),
        rm: vi.fn(async () => {
          operationLog.push('rm');
        }),
      },
      'B:/tmp/tetris-user-data',
      new Uint8Array([1, 2, 3]),
    );

    expect(operationLog).toEqual(['mkdir', 'rm', 'write', 'rename']);
  });

  it('prefers the last committed file after an interrupted save leaves a stale temp file', async () => {
    const { loadDesktopDatabaseBytes } = await import('../../../electron/main');

    const bytes = await loadDesktopDatabaseBytes(
      {
        mkdir: vi.fn(async () => undefined),
        readFile: vi.fn(async () => Buffer.from([4, 2, 0, 0])),
        writeFile: vi.fn(async () => undefined),
        rename: vi.fn(async () => undefined),
        rm: vi.fn(async () => undefined),
      },
      'B:/tmp/tetris-user-data',
    );

    expect(Array.from(bytes ?? [])).toEqual([4, 2, 0, 0]);
  });
});