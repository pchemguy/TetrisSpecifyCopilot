import type { DesktopApi } from '../runtime.js';

type WindowWithDesktopApi = {
  desktopApi?: Partial<DesktopApi>;
};

type NavigatorLike = {
  userAgent?: string;
};

function hasMethod<K extends keyof DesktopApi>(
  api: Partial<DesktopApi> | undefined,
  method: K,
): api is Partial<DesktopApi> & Required<Pick<DesktopApi, K>> {
  return typeof api?.[method] === 'function';
}

export function hasRuntimeInfoMethod(
  api: Partial<DesktopApi> | undefined,
): api is Partial<DesktopApi> & Pick<DesktopApi, 'getRuntimeInfo'> {
  return hasMethod(api, 'getRuntimeInfo');
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