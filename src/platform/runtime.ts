export type RuntimeMode = 'browser' | 'desktop';

export type DesktopPlatform = 'win32' | 'darwin' | 'linux';

export type RuntimePlatform = DesktopPlatform | 'web';

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
  readDatabaseBytes: () => Promise<Uint8Array | null>;
  writeDatabaseBytes: (bytes: Uint8Array) => Promise<void>;
}

type WindowWithDesktopApi = {
  desktopApi?: Partial<DesktopApi>;
};

type NavigatorLike = {
  userAgent?: string;
};

function hasRuntimeInfoMethod(
  api: Partial<DesktopApi> | undefined,
): api is Partial<DesktopApi> & Pick<DesktopApi, 'getRuntimeInfo'> {
  return hasMethod(api, 'getRuntimeInfo');
}

function hasMethod<K extends keyof DesktopApi>(
  api: Partial<DesktopApi> | undefined,
  method: K,
): api is Partial<DesktopApi> & Required<Pick<DesktopApi, K>> {
  return typeof api?.[method] === 'function';
}

export function getDesktopApi(): Partial<DesktopApi> | undefined {
  const runtimeWindow = (globalThis as typeof globalThis & { window?: WindowWithDesktopApi }).window;
  return runtimeWindow?.desktopApi;
}

export function hasDesktopApi(): boolean {
  return typeof getDesktopApi() !== 'undefined';
}

export function isElectronShell(): boolean {
  const runtimeNavigator = (globalThis as typeof globalThis & { navigator?: NavigatorLike }).navigator;
  return typeof runtimeNavigator?.userAgent === 'string' && runtimeNavigator.userAgent.includes('Electron');
}

export function hasCompleteDesktopApi(
  api: Partial<DesktopApi> | undefined = getDesktopApi(),
): api is DesktopApi {
  return hasMethod(api, 'getRuntimeInfo')
    && hasMethod(api, 'readDatabaseBytes')
    && hasMethod(api, 'writeDatabaseBytes');
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
    return {
      runtime: 'browser',
      platform: 'web',
      appVersion: null,
    };
  }

  return desktopApi.getRuntimeInfo();
}