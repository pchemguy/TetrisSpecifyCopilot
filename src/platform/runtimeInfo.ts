import type { DesktopPlatform, DesktopRuntimeInfo } from './runtime.js';

export function normalizeDesktopPlatform(platform: string): DesktopPlatform {
  switch (platform) {
    case 'win32':
    case 'darwin':
    case 'linux':
      return platform;
    default:
      return 'linux';
  }
}

export function createDesktopRuntimeInfo(
  platform: string,
  appVersion: string,
): DesktopRuntimeInfo {
  return {
    runtime: 'desktop',
    platform: normalizeDesktopPlatform(platform),
    appVersion,
  };
}