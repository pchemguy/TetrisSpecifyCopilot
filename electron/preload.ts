import { contextBridge, ipcRenderer } from 'electron';
import type { DesktopRuntimeInfo } from '../src/platform/runtime.js';

export interface RuntimeInfoBridge {
	getRuntimeInfo: () => Promise<DesktopRuntimeInfo>;
}

export function createRuntimeInfoBridge() {
	return {
		getRuntimeInfo: () => ipcRenderer.invoke('runtime:get-info') as Promise<DesktopRuntimeInfo>,
	} satisfies RuntimeInfoBridge;
}

export function exposeDesktopApi(bridge: RuntimeInfoBridge = createRuntimeInfoBridge()): void {
	contextBridge.exposeInMainWorld('desktopApi', bridge);
}

exposeDesktopApi();