import { contextBridge, ipcRenderer } from 'electron';
import type { DesktopRuntimeInfo } from '../src/platform/runtime.js';

export interface RuntimeInfoBridge {
	getRuntimeInfo: () => Promise<DesktopRuntimeInfo>;
	readDatabaseBytes: () => Promise<Uint8Array | null>;
	writeDatabaseBytes: (bytes: Uint8Array) => Promise<void>;
}

export function createRuntimeInfoBridge() {
	return {
		getRuntimeInfo: () => ipcRenderer.invoke('runtime:get-info') as Promise<DesktopRuntimeInfo>,
		readDatabaseBytes: () => ipcRenderer.invoke('db:load') as Promise<Uint8Array | null>,
		writeDatabaseBytes: (bytes: Uint8Array) => ipcRenderer.invoke('db:save', bytes) as Promise<void>,
	} satisfies RuntimeInfoBridge;
}

export function exposeDesktopApi(bridge: RuntimeInfoBridge = createRuntimeInfoBridge()): void {
	contextBridge.exposeInMainWorld('desktopApi', bridge);
}

exposeDesktopApi();