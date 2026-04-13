import type { DesktopApi } from '../platform/runtime';

declare global {
  interface Window {
    desktopApi?: Partial<DesktopApi>;
  }
}

export {};