# Desktop Interfaces Contract: Desktop App Packaging

## 1. Renderer Boundary Contract

Renderer code must remain Electron-agnostic.

- Renderer modules access desktop-only behavior exclusively through `window.desktopApi`.
- Renderer code does not import `electron`, `node:fs`, or other Electron-owned modules.
- Browser mode must continue working when `window.desktopApi` is absent.

## 2. `window.desktopApi` Contract

The preload bridge exposes a minimal typed surface:

```ts
interface DesktopApi {
  getRuntimeInfo(): Promise<{
    runtime: 'desktop';
    platform: 'win32' | 'darwin' | 'linux';
    appVersion: string;
  }>;
  readDatabaseBytes(): Promise<Uint8Array | null>;
  writeDatabaseBytes(bytes: Uint8Array): Promise<void>;
}

declare global {
  interface Window {
    desktopApi?: DesktopApi;
  }
}
```

Rules:

- `readDatabaseBytes()` returns `null` on first run when no database file exists.
- `writeDatabaseBytes(bytes)` performs an atomic temp-file write plus rename in the Electron main process.
- Failures reject with plain-language errors that the renderer can map to non-blocking persistence warnings.
- No method leaks raw filesystem paths or Electron objects into the renderer.
- If the desktop bridge is partially available or incomplete, the renderer treats that as desktop persistence unavailable for the current run and does not fall back to browser persistence.

## 3. Runtime Selection Contract

- Browser mode: `window.desktopApi` is absent; persistence falls back to the existing browser adapters.
- Desktop mode: `window.desktopApi` is present; renderer uses desktop persistence adapters and a file-backed SQLite store.
- Desktop bridge failure mode: if `window.desktopApi` is unavailable or incomplete in desktop mode, the renderer continues launching with desktop persistence disabled for that run, surfaces a persistence warning, and does not read or mutate browser persistence stores.
- Both modes render the same gameplay shell, HUD, overlays, and warnings for supported flows.

## 4. Persistence Contract

Desktop persistence responsibilities for the first release:

- retain best score across relaunch
- use a `sql.js` database file under Electron `userData`
- treat missing file as first run
- treat invalid best-score data as recoverable: continue launch, warn the user, and fall back to `0`
- use atomic temp-file-plus-rename replacement for committed writes
- clean up or ignore stale temp save files on the next launch before loading the last committed database file
- preserve the last committed database file when write failures occur because of permission, locked-file, or disk-space errors
- prefer the last committed database file after an interrupted save; if no committed file is readable, warn and fall back to `0`

Out of scope for retained desktop persistence in the first release:

- settings retention
- UI-state retention
- session history retention
- score-history retention
- replay metadata retention

## 5. Packaging Contract

- `npm run dev:web` starts pure browser development with no Electron shell.
- `npm run dev` starts desktop-shell development against the Vite renderer.
- `npm run build` produces the production renderer and Electron outputs needed for packaging.
- `npm run dist:win` produces the first reviewable portable Windows artifact.
- If a packaged runtime asset needed only for persistence is unavailable, the app warns and continues with non-persistent defaults when gameplay can still initialize.
- If a packaged runtime asset needed for core renderer or gameplay initialization is unavailable, the app shows a blocking startup error with recovery guidance instead of presenting a misleading playable state.

## 6. Validation Contract

- Browser regression tests remain valid and continue to run against the web renderer.
- Desktop validation must prove Electron launch, offline local play, best-score retention across relaunch, recoverable fallback for invalid persisted best-score data, bridge-unavailable fallback behavior, atomic-save recovery, and write-failure warning behavior.
- The desktop packaging workflow must succeed from Bash on Windows without requiring manual IDE steps.