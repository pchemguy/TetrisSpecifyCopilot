# Data Model: Desktop App Packaging

## Overview

The feature introduces a dual-runtime persistence model:

- browser mode keeps the current local-first behavior for development workflows
- desktop mode runs the same renderer inside Electron and persists a `sql.js` database to a file under `userData`

The renderer remains the owner of gameplay state, React UI state, and `sql.js` interactions.
Electron main and preload expose only the minimum file/runtime capabilities required to
support desktop launch and file-backed persistence.

## Entities

### Execution Mode

- Purpose: Identifies whether the shared renderer is running in browser mode or packaged desktop mode.
- Fields:
  - `runtime`: enum (`browser`, `desktop`)
  - `platform`: enum (`web`, `win32`, `darwin`, `linux`)
  - `desktopApiAvailable`: boolean
- Validation:
  - `runtime = desktop` requires `desktopApiAvailable = true`
  - `runtime = browser` requires the renderer to function without Electron globals
- Relationships:
  - selects the active persistence adapter
  - determines which developer workflow and validation path applies

### Desktop API Surface

- Purpose: Defines the preload-exposed capability set available to the renderer through `window.desktopApi`.
- Fields:
  - `runtime`: literal `desktop`
  - `appVersion`: string
  - `platform`: enum (`win32`, `darwin`, `linux`)
  - `readDatabaseBytes()`: async operation returning `Uint8Array | null`
  - `writeDatabaseBytes(bytes)`: async operation returning success/failure
- Validation:
  - no method exposes raw Electron objects to the renderer
  - read/write methods must reject with structured errors when file access fails
- Relationships:
  - implemented by Electron preload
  - consumed by desktop persistence adapters in `src/persistence`

### Desktop SQLite File

- Purpose: The durable on-disk SQLite blob used by desktop mode.
- Fields:
  - `fileName`: stable application-owned database file name
  - `directory`: Electron `userData` directory
  - `bytes`: exported `sql.js` binary payload
  - `schemaVersion`: integer from `app_meta`
  - `tempFileName`: sibling temporary file used during atomic save
- Validation:
  - database file lives only under the application `userData` directory
  - writes occur through temp-file replacement, not in-place mutation
  - missing file is treated as first run, not as an error
- Relationships:
  - hydrated by the desktop persistence adapter
  - contains the best-score record required for restart persistence in the first release

### Best Score Snapshot

- Purpose: The only persisted player outcome required across desktop restarts in the first release.
- Fields:
  - `value`: non-negative integer
  - `source`: enum (`browser_local_storage`, `desktop_sqlite`, `default_fallback`)
  - `lastUpdatedAt`: ISO timestamp nullable
  - `warningState`: enum (`none`, `missing_data`, `invalid_data`, `write_failed`)
- Validation:
  - `value >= 0`
  - invalid or unreadable persisted values normalize to `0`
  - warning state must be set when fallback behavior is used
- Relationships:
  - read during renderer hydration
  - updated after completed sessions
  - surfaced through existing HUD and persistence-warning UI patterns

### Persistence Adapter

- Purpose: Runtime-aware bridge that loads and saves persistence state without changing renderer consumers.
- Fields:
  - `mode`: enum (`browser`, `desktop`)
  - `loadBestScore()`: async or sync operation returning `Best Score Snapshot`
  - `saveBestScore(score)`: async or sync operation persisting the normalized score
  - `loadDatabase()`: operation returning hydrated `sql.js` database state for the active runtime
  - `persistDatabase()`: operation flushing database bytes to the active runtime backend
- Validation:
  - adapter selection is deterministic from `Execution Mode`
  - browser adapter never depends on `window.desktopApi`
  - desktop adapter never imports `electron` into renderer code
- Relationships:
  - used by `PersistenceProvider`
  - delegates to localStorage/IndexedDB in browser mode and preload-backed file IO in desktop mode

### Portable Release Artifact

- Purpose: The first reviewable Windows desktop package delivered for validation.
- Fields:
  - `platform`: literal `windows`
  - `distributionType`: literal `portable`
  - `appVersion`: string
  - `rendererBundlePath`: path to built Vite assets
  - `electronBundlePath`: path to compiled Electron main/preload output
- Validation:
  - artifact launches without a separately running dev server
  - artifact includes all files required for offline local play
- Relationships:
  - produced by the packaging workflow
  - consumed by reviewer validation and smoke tests

## Relationships Summary

- Execution Mode 1 -> 1 active Persistence Adapter
- Desktop API Surface 1 -> many renderer calls, but only from desktop mode
- Desktop SQLite File 1 -> 1 desktop Persistence Adapter instance per running app session
- Best Score Snapshot 1 -> 1 HUD display state during a session
- Portable Release Artifact 1 -> many validation runs across review machines

## Persistence Notes

- Browser mode keeps current localStorage and IndexedDB behavior for development and existing tests.
- Desktop mode uses the same `sql.js` engine but changes the durable storage target from IndexedDB to a userData file.
- The first desktop release only guarantees retained best score across restart; broader desktop persistence can be layered onto the same SQLite file later.

## State Transitions

- `browser runtime -> browser adapter selected -> browser persistence active`
- `desktop runtime -> desktop adapter selected -> preload bridge available -> userData database file hydrated`
- `missing/invalid best score -> warning emitted -> default best score applied -> gameplay continues`
- `completed session -> best score normalized -> persistence save requested -> atomic file replace on desktop`