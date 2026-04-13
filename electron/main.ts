import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { app, BrowserWindow, ipcMain } from 'electron';
import { createDesktopRuntimeInfo } from '../src/platform/runtimeInfo.js';
import type {
  DesktopDatabaseLoadResult,
  DesktopDatabaseSaveResult,
  DesktopPersistenceError,
  DesktopPersistenceErrorCode,
  DesktopRuntimeInfo,
} from '../src/platform/runtime.js';

const DEFAULT_WINDOW_WIDTH = 1280;
const DEFAULT_WINDOW_HEIGHT = 900;
const DESKTOP_DATABASE_FILE = 'desktop-state.sqlite';
const DESKTOP_DATABASE_TEMP_FILE = 'desktop-state.sqlite.tmp';

export interface DesktopFileStore {
  mkdir: (directoryPath: string, options: { recursive: true }) => Promise<void | string | undefined>;
  readFile: (filePath: string) => Promise<Buffer>;
  writeFile: (filePath: string, data: Uint8Array | Buffer) => Promise<void>;
  rename: (sourcePath: string, destinationPath: string) => Promise<void>;
  rm: (filePath: string, options: { force: true }) => Promise<void>;
}

export interface DesktopDatabasePaths {
  directory: string;
  databasePath: string;
  tempPath: string;
}

type CodedDesktopError = Error & {
  code: DesktopPersistenceErrorCode;
};

function createDesktopFileStore(): DesktopFileStore {
  return {
    mkdir: fs.mkdir,
    readFile: fs.readFile,
    writeFile: fs.writeFile,
    rename: fs.rename,
    rm: fs.rm,
  };
}

export function getDesktopDatabasePaths(userDataPath: string): DesktopDatabasePaths {
  return {
    directory: userDataPath,
    databasePath: path.join(userDataPath, DESKTOP_DATABASE_FILE),
    tempPath: path.join(userDataPath, DESKTOP_DATABASE_TEMP_FILE),
  };
}

function createDesktopPersistenceFailure(
  code: DesktopPersistenceErrorCode,
  message: string,
): CodedDesktopError {
  const error = new Error(message) as CodedDesktopError;
  error.code = code;
  return error;
}

function isCodedDesktopError(error: unknown): error is CodedDesktopError {
  return error instanceof Error && typeof (error as Partial<CodedDesktopError>).code === 'string';
}

function getDesktopPersistenceFailure(
  error: NodeJS.ErrnoException,
  action: 'read' | 'write',
): CodedDesktopError {
  switch (error.code) {
    case 'EACCES':
    case 'EPERM':
      return createDesktopPersistenceFailure(
        action === 'write' ? 'desktop_write_permission_denied' : 'desktop_persistence_disabled',
        action === 'write'
          ? 'Desktop persistence could not save because the application cannot write to its local data folder.'
          : 'Desktop persistence is unavailable because the application cannot read its local data folder.',
      );
    case 'EBUSY':
      return createDesktopPersistenceFailure(
        action === 'write' ? 'desktop_write_locked' : 'desktop_data_unreadable',
        action === 'write'
          ? 'Desktop persistence could not save because the data file is locked by another process.'
          : 'Desktop persistence could not load because the data file is locked or unreadable.',
      );
    case 'ENOSPC':
      return createDesktopPersistenceFailure(
        'desktop_write_no_space',
        'Desktop persistence could not save because the machine is out of disk space.',
      );
    default:
      return createDesktopPersistenceFailure(
        action === 'write' ? 'desktop_write_failed' : 'desktop_data_unreadable',
        action === 'write'
          ? 'Desktop persistence could not save the local database.'
          : 'Desktop persistence could not load the local database.',
      );
  }
}

function serializeDesktopPersistenceFailure(error: unknown): DesktopPersistenceError {
  if (isCodedDesktopError(error)) {
    return {
      code: error.code,
      message: error.message,
    };
  }

  return {
    code: 'desktop_persistence_disabled',
    message: error instanceof Error
      ? error.message
      : 'Desktop persistence is unavailable for this run.',
  };
}

async function removeStaleTempFile(
  fileStore: DesktopFileStore,
  paths: DesktopDatabasePaths,
): Promise<void> {
  try {
    await fileStore.rm(paths.tempPath, { force: true });
  } catch (error) {
    const filesystemError = error as NodeJS.ErrnoException;

    if (filesystemError.code !== 'ENOENT') {
      throw error;
    }
  }
}

export async function loadDesktopDatabaseBytes(
  fileStore: DesktopFileStore,
  userDataPath: string,
): Promise<Uint8Array | null> {
  const paths = getDesktopDatabasePaths(userDataPath);

  try {
    await fileStore.mkdir(paths.directory, { recursive: true });
    await removeStaleTempFile(fileStore, paths);
    const bytes = await fileStore.readFile(paths.databasePath);
    return new Uint8Array(bytes);
  } catch (error) {
    const filesystemError = error as NodeJS.ErrnoException;

    if (filesystemError.code === 'ENOENT') {
      return null;
    }

    throw getDesktopPersistenceFailure(filesystemError, 'read');
  }
}

export async function saveDesktopDatabaseBytes(
  fileStore: DesktopFileStore,
  userDataPath: string,
  bytes: Uint8Array,
): Promise<void> {
  const paths = getDesktopDatabasePaths(userDataPath);

  try {
    await fileStore.mkdir(paths.directory, { recursive: true });
    await removeStaleTempFile(fileStore, paths);
    await fileStore.writeFile(paths.tempPath, Buffer.from(bytes));
    await fileStore.rename(paths.tempPath, paths.databasePath);
  } catch (error) {
    await removeStaleTempFile(fileStore, paths);
    throw getDesktopPersistenceFailure(error as NodeJS.ErrnoException, 'write');
  }
}

function getUserDataPath(): string {
  return process.env.TETRIS_USER_DATA_DIR ?? app.getPath('userData');
}

function getCurrentDirectory(): string {
  return path.dirname(fileURLToPath(import.meta.url));
}

export function getPreloadPath(): string {
  return path.join(getCurrentDirectory(), 'preload.js');
}

export function getRendererEntry(): { type: 'url' | 'file'; value: string } {
  const devServerUrl = process.env.VITE_DEV_SERVER_URL;

  if (devServerUrl) {
    return {
      type: 'url',
      value: devServerUrl,
    };
  }

  const applicationRoot = app.isPackaged
    ? app.getAppPath()
    : path.resolve(getCurrentDirectory(), '..', '..');

  return {
    type: 'file',
    value: path.join(applicationRoot, 'dist', 'index.html'),
  };
}

export function createRuntimeInfo(): DesktopRuntimeInfo {
  return createDesktopRuntimeInfo(process.platform, app.getVersion());
}

export async function createMainWindow(): Promise<BrowserWindow> {
  const window = new BrowserWindow({
    width: DEFAULT_WINDOW_WIDTH,
    height: DEFAULT_WINDOW_HEIGHT,
    minWidth: 960,
    minHeight: 720,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      preload: getPreloadPath(),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: false,
    },
  });

  window.once('ready-to-show', () => {
    window.show();
  });

  const rendererEntry = getRendererEntry();

  if (rendererEntry.type === 'url') {
    await window.loadURL(rendererEntry.value);
  } else {
    await window.loadFile(rendererEntry.value);
  }

  return window;
}

async function bootstrap(): Promise<void> {
  await app.whenReady();

  ipcMain.handle('runtime:get-info', () => createRuntimeInfo());
  ipcMain.handle('db:load', async (): Promise<DesktopDatabaseLoadResult> => {
    try {
      return {
        status: 'ok',
        bytes: await loadDesktopDatabaseBytes(createDesktopFileStore(), getUserDataPath()),
      };
    } catch (error) {
      return {
        status: 'error',
        error: serializeDesktopPersistenceFailure(error),
      };
    }
  });
  ipcMain.handle('db:save', async (_event, bytes: Uint8Array): Promise<DesktopDatabaseSaveResult> => {
    try {
      await saveDesktopDatabaseBytes(createDesktopFileStore(), getUserDataPath(), bytes);

      return {
        status: 'ok',
      };
    } catch (error) {
      return {
        status: 'error',
        error: serializeDesktopPersistenceFailure(error),
      };
    }
  });
  await createMainWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      void createMainWindow();
    }
  });
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

if (!process.env.VITEST) {
  void bootstrap();
}