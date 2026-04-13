import { contextBridge, ipcRenderer } from 'electron';
import type {
	DesktopDatabaseLoadResult,
	DesktopDatabaseSaveResult,
	DesktopRuntimeInfo,
} from '../src/platform/runtime.js';

export interface RuntimeInfoBridge {
	getRuntimeInfo: () => Promise<DesktopRuntimeInfo>;
	readDatabaseBytes: () => Promise<DesktopDatabaseLoadResult>;
	writeDatabaseBytes: (bytes: Uint8Array) => Promise<DesktopDatabaseSaveResult>;
}

export function createRuntimeInfoBridge() {
	return {
		getRuntimeInfo: () => ipcRenderer.invoke('runtime:get-info') as Promise<DesktopRuntimeInfo>,
		readDatabaseBytes: () => ipcRenderer.invoke('db:load') as Promise<DesktopDatabaseLoadResult>,
		writeDatabaseBytes: (bytes: Uint8Array) => ipcRenderer.invoke('db:save', bytes) as Promise<DesktopDatabaseSaveResult>,
	} satisfies RuntimeInfoBridge;
}

export function exposeDesktopApi(bridge: RuntimeInfoBridge = createRuntimeInfoBridge()): void {
	contextBridge.exposeInMainWorld('desktopApi', bridge);
}

exposeDesktopApi();