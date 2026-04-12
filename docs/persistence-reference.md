# Persistence Reference: Classic Tetris Desktop

## Overview

This guide documents the current hybrid persistence model for maintainers. The desktop best score is native and file-backed, while settings, UI state, and structured gameplay history remain browser or webview local data.

## Shell Prerequisite

Windows users require Git Bash (for example, Git for Windows) or WSL; PowerShell is not supported.

## Related Docs

- [User Guide](./user-guide.md)
- [Developer Guide](./developer-guide.md)
- [Reviewer Guide](./reviewer-guide.md)
- [Packaging Guide](./packaging/packaging.md)

## Release-Gate Status

- Last full quickstart acceptance pass: 2026-04-12
- Status: pass

## Source-of-Truth Baseline

Validated from [specs/003-windows-desktop-packaging/contracts/desktop-persistence-contract.md](../specs/003-windows-desktop-packaging/contracts/desktop-persistence-contract.md) and runtime code:

- Persistence documentation must reflect shipped behavior, not transitional browser-only design.
- Seeded demo data is inserted for reviewer visibility only.
- Seeded demo data must never replace or corrupt the player's best score.
- The best-score panel stays hidden until at least one completed game exists.

## Terminology and Consistency Rules

- Canonical terms: tetromino, ghost piece, hold, hard drop, soft drop, pause/resume, best score.
- Cross-link targets: [User Guide](./user-guide.md), [Developer Guide](./developer-guide.md), [Reviewer Guide](./reviewer-guide.md), [Packaging Guide](./packaging/packaging.md).
- Persistence wording must remain aligned with player and reviewer descriptions of startup visibility, strict new-best behavior, and fallback notices.

## Persistence Surfaces

The application uses three persistence surfaces:

1. Native SQLite in `src-tauri/` for the desktop best score.
2. `localStorage` for user settings and UI state.
3. `sql.js` persisted through IndexedDB for sessions, scores, replays, and replay events.

## Native Desktop Best-Score Database

Database file name:

- `best-score.sqlite3`

Storage location policy:

- If the executable directory is writable, the database lives adjacent to the executable.
- If the executable directory is not writable, storage falls back to `%LOCALAPPDATA%/Classic Browser Tetris/`.

Native table schema:

| Table | Purpose | Columns (name: type) |
| --- | --- | --- |
| `best_score_state` | Single-row best-score state for the desktop runtime | `id: INTEGER (PK, must be 1)`, `best_score: INTEGER NOT NULL CHECK >= 0`, `has_completed_game: INTEGER NOT NULL`, `updated_at: TEXT` |

Single-row invariant:

- the table always contains exactly one logical record with `id = 1`
- first-run bootstrap inserts `(1, 0, 0, NULL)` if no row exists

Behavior rules:

- startup reads `best_score` and `has_completed_game`
- startup sets `showBestScore = has_completed_game`
- `submit_game_over_score` updates the stored best score only when `finalScore` is strictly greater than the current best score
- if the first completed game ends with score `0`, `has_completed_game` still becomes true even though `best_score` remains `0`

## Desktop Command Contracts

Startup command:

- command name: `load_best_score_state`
- response fields: `bestScore`, `hasCompletedGame`, `showBestScore`, `storageMode`, `notice`

Game-over submission command:

- command name: `submit_game_over_score`
- request fields: `finalScore`, `completedReason`
- response fields: `bestScore`, `hasCompletedGame`, `isNewBest`, `showCongratulations`, `showBestScore`

Constraints:

- only `completedReason = game_over` is accepted
- the gameplay engine does not call Tauri commands directly
- no frontend fallback to browser best-score persistence is allowed

## localStorage Keys and Document Schemas

| Key | Purpose | Document schema |
| --- | --- | --- |
| `tetris.settings.v1` | User settings | `{ version: 1, control_profile: "classic-desktop", show_ghost_piece: boolean, auto_pause_on_blur: boolean, reduce_motion: boolean }` |
| `tetris.ui.v1` | UI state and seeded-data flag | `{ version: 1, last_overlay: "none" | "paused" | "game_over" | "help", has_seeded_demo_data: boolean, last_selected_panel: "stats" | "controls" | "history" }` |

Read and write behavior:

- missing or malformed settings or UI JSON falls back to defaults
- no localStorage availability falls back to in-memory defaults for the current run
- localStorage no longer stores the player's best score

## IndexedDB and Structured History Lifecycle

Structured history storage is hydrated from IndexedDB using fixed identifiers:

- IndexedDB database: `classic-browser-tetris`
- object store: `sqlite`
- file key: `main`

Browser or webview SQLite tables:

| Table | Purpose | Columns (name: type) |
| --- | --- | --- |
| `app_meta` | Application metadata, including schema version tracking | `key: TEXT (PK)`, `value: TEXT NOT NULL` |
| `sessions` | Session lifecycle and summary metrics | `session_id: TEXT (PK)`, `started_at: TEXT NOT NULL`, `ended_at: TEXT`, `status: TEXT NOT NULL`, `seed: TEXT NOT NULL`, `score: INTEGER NOT NULL`, `level: INTEGER NOT NULL`, `lines_cleared: INTEGER NOT NULL`, `duration_ms: INTEGER NOT NULL`, `best_score_at_end: INTEGER` |
| `scores` | Session score history with personal-best marker | `score_id: TEXT (PK)`, `session_id: TEXT NOT NULL (FK -> sessions.session_id)`, `final_score: INTEGER NOT NULL`, `level_reached: INTEGER NOT NULL`, `lines_cleared: INTEGER NOT NULL`, `achieved_at: TEXT NOT NULL`, `is_personal_best: INTEGER NOT NULL` |
| `replays` | Replay metadata for deterministic reconstruction | `replay_id: TEXT (PK)`, `session_id: TEXT NOT NULL (FK -> sessions.session_id)`, `engine_version: TEXT NOT NULL`, `seed: TEXT NOT NULL`, `tick_count: INTEGER NOT NULL`, `checksum: TEXT NOT NULL`, `created_at: TEXT NOT NULL` |
| `replay_events` | Ordered replay command stream per replay | `event_id: TEXT (PK)`, `replay_id: TEXT NOT NULL (FK -> replays.replay_id)`, `tick: INTEGER NOT NULL`, `command: TEXT NOT NULL`, `payload_json: TEXT` |

Indexes:

- `idx_scores_session_id` on `scores(session_id)`
- `idx_replays_session_id` on `replays(session_id)`
- `idx_replay_events_replay_id` on `replay_events(replay_id)`
- `idx_replay_events_tick` on `replay_events(replay_id, tick)`

Lifecycle sequence:

1. Open IndexedDB and create object store `sqlite` on first upgrade.
2. Read key `main`; if present, hydrate `sql.js` from that binary blob.
3. Ensure schema exists and update schema version metadata.
4. Seed demo rows if the structured-history tables are empty.
5. Persist the `sql.js` binary back to IndexedDB after hydration and after completed-session writes.

## Schema Migration Strategy

- browser or webview SQLite schema version is tracked in `app_meta` row `key = 'schema_version'`
- `SCHEMA_VERSION` is currently `1`
- migration behavior is idempotent through `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS`
- version metadata is upserted with `ON CONFLICT(key) DO UPDATE`
- schema work runs inside a transaction and rolls back on failure

## Seed Data Invariants and Player-Data Protection

Seeded data is reviewer-focused fixture data, not player progress:

- localStorage seeding writes defaults only when `tetris.settings.v1` or `tetris.ui.v1` is missing
- structured-history seed rows are inserted only when target tables are empty (`sessions`, `scores`, `replays`)
- seeded session and replay identifiers are deterministic `demo-*` values so demo content remains distinguishable

Best-score protection invariant:

- seed logic never writes desktop best-score state
- no localStorage best-score key remains in the implementation
- structured-history seeds cannot overwrite or lower the native best score

## Failure and Recovery Guidance

If native desktop persistence is unavailable:

- persistence health transitions to `warning` with code `desktop_persistence_unavailable`
- gameplay continues, but startup best-score hydration and native best-score updates are unavailable until storage is restored

If browser or webview IndexedDB is unavailable:

- persistence health transitions to `warning` with code `sqlite_unavailable`
- gameplay continues, but structured history and replay storage are unavailable until storage is restored

If a completed-session write fails:

- persistence health transitions to `warning` with code `replay_write_failed`
- gameplay continues, but that session's structured history may be incomplete

If the native best-score database is corrupt:

- the corrupt file is renamed to `best-score.sqlite3.corrupt.<timestamp>`
- a fresh database is created
- startup emits a `database_reset` notice

If the executable directory is not writable:

- storage falls back to `%LOCALAPPDATA%/Classic Browser Tetris/`
- startup emits a `storage_fallback` notice

## Verification Checklist

Use this quick pass after persistence changes:

1. Start from an empty desktop storage location and confirm startup hides the best-score panel.
2. Finish one game with score `0` and confirm later startup is allowed to show the best-score panel.
3. Finish a later game with a strictly greater score and confirm the stored best score updates.
4. Finish a game with an equal or lower score and confirm the stored best score stays unchanged.
5. Start from empty structured-history storage and confirm demo rows are inserted only once for `sessions`, `scores`, and `replays`.
6. Temporarily block IndexedDB and verify the app still runs with an explicit warning.
7. Simulate a non-writable app directory and confirm LocalAppData fallback is reported.
8. Simulate a corrupt native best-score database and confirm backup rename plus reset notice.

## Maintainer Verification Pass

Verification target: every active persistence surface in implementation appears in this document with no stale browser-best-score references.

Source-of-truth files checked:

- `src/app/providers/PersistenceProvider.tsx`
- `src/types/persistence.ts`
- `src/types/desktopPersistence.ts`
- `src/persistence/local-storage/settingsStore.ts`
- `src/persistence/local-storage/uiStateStore.ts`
- `src/persistence/sqlite/schema.ts`
- `src/persistence/sqlite/database.ts`
- `src-tauri/src/runtime/storage_path.rs`
- `src-tauri/src/persistence/database.rs`
- `src-tauri/src/persistence/best_score_repository.rs`
- `src-tauri/src/commands/load_best_score_state.rs`
- `src-tauri/src/commands/submit_game_over_score.rs`

Verification result:

- native SQLite table found in code: `best_score_state`
- localStorage keys found in code: `tetris.settings.v1`, `tetris.ui.v1`
- IndexedDB identifiers found in code: database `classic-browser-tetris`, store `sqlite`, key `main`
- structured-history tables found in code: `app_meta`, `sessions`, `scores`, `replays`, `replay_events`
- stale browser best-score localStorage key removed from code and documentation
- status: pass, no omissions detected
