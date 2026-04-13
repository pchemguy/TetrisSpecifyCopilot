import type { BrowserRuntimeInfo } from '../runtime.js';

const BROWSER_RUNTIME_INFO: BrowserRuntimeInfo = {
  runtime: 'browser',
  platform: 'web',
  appVersion: null,
};

export function readBrowserRuntimeInfo(): BrowserRuntimeInfo {
  return BROWSER_RUNTIME_INFO;
}