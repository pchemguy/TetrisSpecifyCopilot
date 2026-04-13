# Desktop Architecture: Windows-First Electron Packaging

## Purpose

This note records the baseline architecture for feature 003, which packages the existing React and Vite renderer as a desktop application without redefining the renderer as an Electron-specific product.

## Primary Decision

The desktop build uses Electron as a thin shell around the existing renderer.

- `electron/main.ts` owns window creation, packaged runtime boot, and desktop file access.
- `electron/preload.ts` exposes the minimum renderer bridge through `window.desktopApi`.
- The shared renderer under `src/` keeps ownership of gameplay, React UI, and `sql.js` persistence behavior.

## Boundary Rules

- Renderer code remains Electron-agnostic.
- Desktop-only behavior is accessed only through `window.desktopApi`.
- Electron-specific imports stay out of shared React, engine, and HUD modules.
- Browser mode remains a supported development path and must continue working without preload or Electron globals.
- Runtime-specific detection and bridge helpers are isolated under `src/platform/browser/` and `src/platform/desktop/`, with `src/platform/runtime.ts` acting as the shared boundary.
- Preload remains the only allowed renderer entry point for desktop-specific capabilities; shared renderer bugs must be validated against `npm run dev:web` before they are treated as shell failures.

## Persistence Direction

The feature keeps one renderer-owned persistence model and swaps only the durable storage backend by runtime.

- Browser mode keeps the existing local-first storage path.
- Desktop mode persists a `sql.js` database as bytes under the Electron `userData` directory.
- Desktop writes use a temp-file-plus-rename flow so the last committed database file remains the recovery point after interrupted saves.
- The first release guarantees restart persistence only for best score.

## Packaging Direction

- `npm run dev:web` remains the fast browser workflow.
- `npm run dev` will run the Electron shell against the same renderer.
- The first reviewable desktop output is a portable Windows artifact.
- The current `electron-builder` layout keeps renderer assets, Electron output, and metadata in a way that can absorb future non-Windows targets without moving the renderer or preload boundaries.

## Launch Lifecycle

The desktop shell now has two explicit launch paths:

1. Development launch: `npm run dev` starts Vite on `127.0.0.1:4173`, watches the Electron TypeScript build, and then starts Electron with `VITE_DEV_SERVER_URL` pointed at the renderer server.
2. File-based launch: compiled Electron output without `VITE_DEV_SERVER_URL` loads `dist/index.html` directly from disk, which is the same path used by packaged desktop validation.

The main process owns the window lifecycle and renderer selection:

- create a single `BrowserWindow` with `contextIsolation: true`, `nodeIntegration: false`, and preload-only desktop access
- prefer the Vite dev server when `VITE_DEV_SERVER_URL` is present
- otherwise load the built renderer from `dist/index.html`
- expose runtime metadata through the preload bridge so the renderer can display build identification in the live shell

## Validated Evidence

- Current packaged-shell runtime label: `Runtime desktop/win32 v0.1.0`
- Current browser-shell runtime label: `Runtime browser/web`
- Current packaged-shell startup measurement: `979 ms` from launch to visible game board using `release/win-unpacked/Tetris Specify Copilot.exe`
- Current desktop best-score fallback hydration measurement: `30 ms` from desktop persistence start to warning/default-score fallback using a corrupt `desktop-state.sqlite`
- Current desktop best-score save measurement: `14 ms` from desktop save start to completed local persistence after game over
- Current browser continuity validation: `npm run dev:web` plus browser Playwright coverage for `tests/e2e/core-gameplay.spec.ts` and `tests/e2e/session-persistence.spec.ts`
- Current build outputs observed during validation:
  - `dist/` renderer bundle
  - `dist-electron/` Electron main/preload bundle
  - `release/win-unpacked/Tetris Specify Copilot.exe` unpacked Windows app for launch validation

This measured startup time stays within the 5-second desktop launch budget with headroom.
The measured desktop best-score fallback and save paths both stay within the 250 ms persistence budget with headroom.

## Shared Guardrails

### Packaging

- Keep renderer output in `dist/` and Electron output in `dist-electron/` so packaging failures can be isolated quickly.
- Treat `npm run build` and `npm run build:electron` as separate checkpoints before wiring full desktop packaging flows.
- Keep the browser workflow runnable while desktop packaging work is in flight so renderer regressions can be diagnosed without the shell.

### Persistence

- Shared SQLite bootstrap code must consume runtime-selected byte loaders and savers instead of owning browser storage directly.
- Browser storage remains the default path unless a desktop bridge is present.
- Desktop persistence work must stay behind runtime adapters and preload bridge methods rather than leaking filesystem access into shared renderer code.

### Rollback

- If a desktop-shell change breaks startup, revalidate `npm run dev:web` and `npm run build` first to confirm the shared renderer still works.
- If Electron compilation fails, validate `npm run build:electron` independently before changing shared renderer code.
- If desktop persistence work regresses, keep the browser adapter as the safe baseline until the desktop bridge contract is complete.

## Contributor Guidance

- Keep Electron main and preload thin.
- Add runtime-specific code at the platform and persistence boundaries before changing shared renderer modules.
- Extend this note as later tasks add validation guardrails, runtime evidence, and broader cross-platform extension points.

## Current Limits And Extension Points

- Current release limit: Windows-first portable packaging only.
- Current persistence scope: best score only across desktop restarts.
- Extension point: platform normalization is shared through runtime helpers rather than baked directly into renderer code.
- Extension point: packaging remains centered on shared `dist/` and `dist-electron/` outputs, so future targets can be added without redefining the renderer model.
