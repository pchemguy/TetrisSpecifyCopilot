import { contextBridge } from 'electron';

contextBridge.exposeInMainWorld('desktopApi', {});