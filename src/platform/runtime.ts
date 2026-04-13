export type RuntimeMode = 'browser' | 'desktop';

export type DesktopPlatform = 'win32' | 'darwin' | 'linux';

export interface DesktopRuntimeInfo {
  runtime: 'desktop';
  platform: DesktopPlatform;
  appVersion: string;
}

export interface DesktopApi {
  getRuntimeInfo: () => Promise<DesktopRuntimeInfo>;
  readDatabaseBytes: () => Promise<Uint8Array | null>;
  writeDatabaseBytes: (bytes: Uint8Array) => Promise<void>;
}

function hasMethod<K extends keyof DesktopApi>(
  api: Partial<DesktopApi> | undefined,
  method: K,
): api is Partial<DesktopApi> & Required<Pick<DesktopApi, K>> {
  return typeof api?.[method] === 'function';
}

export function getDesktopApi(): Partial<DesktopApi> | undefined {
  if (typeof window === 'undefined') {
    return undefined;
  }

  return window.desktopApi;
}

export function hasDesktopApi(): boolean {
  return typeof getDesktopApi() !== 'undefined';
}

export function hasCompleteDesktopApi(
  api: Partial<DesktopApi> | undefined = getDesktopApi(),
): api is DesktopApi {
  return hasMethod(api, 'getRuntimeInfo')
    && hasMethod(api, 'readDatabaseBytes')
    && hasMethod(api, 'writeDatabaseBytes');
}

export function getRuntimeMode(): RuntimeMode {
  return hasDesktopApi() ? 'desktop' : 'browser';
}

export function isDesktopRuntime(): boolean {
  return getRuntimeMode() === 'desktop';
}