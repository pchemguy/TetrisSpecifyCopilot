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

## Contributor Guidance

- Keep Electron main and preload thin.
- Add runtime-specific code at the platform and persistence boundaries before changing shared renderer modules.
- Extend this note as later tasks add validation guardrails, runtime evidence, and broader cross-platform extension points.
