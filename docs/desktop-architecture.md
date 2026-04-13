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
