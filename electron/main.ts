import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { app, BrowserWindow, ipcMain } from 'electron';
import type { DesktopRuntimeInfo } from '../src/platform/runtime.js';

const DEFAULT_WINDOW_WIDTH = 1280;
const DEFAULT_WINDOW_HEIGHT = 900;

function toDesktopPlatform(platform: NodeJS.Platform): DesktopRuntimeInfo['platform'] {
  switch (platform) {
    case 'win32':
    case 'darwin':
    case 'linux':
      return platform;
    default:
      return 'linux';
  }
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
  return {
    runtime: 'desktop',
    platform: toDesktopPlatform(process.platform),
    appVersion: app.getVersion(),
  };
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

void bootstrap();