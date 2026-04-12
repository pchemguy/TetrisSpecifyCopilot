# Persistence Reference: Classic Browser Tetris

## Overview

This guide documents browser persistence details for maintainers.

## Shell Prerequisite

Windows users require Git Bash (for example, Git for Windows) or WSL; PowerShell is not supported.

## Related Docs

- [User Guide](./user-guide.md)
- [Developer Guide](./developer-guide.md)
- [Reviewer Guide](./reviewer-guide.md)

## Source-of-Truth Baseline

Validated from [specs/002-project-docs/research.md](../specs/002-project-docs/research.md):

- Persistence references must reflect runtime behavior, not aspirational design.
- Seeded demo data is inserted for reviewer visibility only.
- Seeded demo data must not replace or corrupt player best score state.

## Terminology and Consistency Rules

- Canonical terms: tetromino, ghost piece, hold, hard drop, soft drop, pause/resume, best score.
- Cross-link targets: [User Guide](./user-guide.md), [Developer Guide](./developer-guide.md), [Reviewer Guide](./reviewer-guide.md).
- Persistence wording must remain aligned with player and reviewer descriptions of best-score behavior.

## SQLite Tables and Purpose

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

## localStorage Keys and Document Schemas

| Key | Purpose | Document/value schema |
| --- | --- | --- |
| `tetris.settings.v1` | User settings | JSON object: `{ version: 1, control_profile: "classic-desktop", show_ghost_piece: boolean, auto_pause_on_blur: boolean, reduce_motion: boolean }` |
| `tetris.ui.v1` | UI state and seeded-data flag | JSON object: `{ version: 1, last_overlay: "none" | "paused" | "game_over" | "help", has_seeded_demo_data: boolean, last_selected_panel: "stats" | "controls" | "history" }` |
| `tetris.best-score.v1` | Player best score | Stringified non-negative integer; invalid or missing values are treated as `0` |

Read and write behavior:

- Missing or malformed settings/UI JSON falls back to defaults.
- Missing or invalid best-score value falls back to `0`.
- No localStorage availability (blocked/unsupported) falls back to in-memory defaults for the current run.

## IndexedDB and SQLite Lifecycle

SQLite storage is hydrated from IndexedDB using fixed identifiers:

- IndexedDB database: `classic-browser-tetris`
- Object store: `sqlite`
- File key: `main`

Lifecycle sequence:

1. Open IndexedDB and create object store `sqlite` on first upgrade.
2. Read key `main`; if present, hydrate SQLite from that binary blob.
3. Ensure schema exists (`CREATE TABLE IF NOT EXISTS ...`) and update schema version metadata.
4. Seed demo rows if SQLite tables are empty.
5. Persist SQLite back to IndexedDB after hydration and after completed-session writes.

## Schema Migration Strategy

- Schema version is tracked in `app_meta` row `key = 'schema_version'`.
- `SCHEMA_VERSION` is currently `1`.
- Migration behavior is idempotent: schema setup always runs with `CREATE TABLE IF NOT EXISTS` and `CREATE INDEX IF NOT EXISTS`.
- Version metadata is upserted with `ON CONFLICT(key) DO UPDATE`.
- All schema work runs inside a transaction (`BEGIN`/`COMMIT`) and rolls back on failure.

## Seed Data Invariants and Player-Data Protection

Seeded data is reviewer-focused fixture data, not player progress:

- localStorage seeding writes defaults only when `tetris.settings.v1` or `tetris.ui.v1` is missing.
- SQLite seed rows are inserted only when target tables are empty (`sessions`, `scores`, `replays`).
- Seeded session/replay identifiers are deterministic demo IDs (`demo-*`) to keep demo content distinguishable.

Best-score protection invariant:

- Seed logic never writes a positive best score into `tetris.best-score.v1`.
- Player best score is updated only by `commitBestScore`, which stores `max(existingBest, currentFinalScore)`.
- Result: seeded demo data cannot overwrite or lower a real player best score.

## Persistence Failure and Recovery Guidance

If IndexedDB is unavailable:

- Persistence health transitions to `warning` with code `sqlite_unavailable`.
- Gameplay continues, but SQLite session/score/replay history is unavailable until storage is restored.

If a completed-session write fails:

- Persistence health transitions to `warning` with code `replay_write_failed`.
- Gameplay continues, but that session's SQLite record set may be incomplete.

If localStorage is blocked or malformed:

- Settings/UI/best-score readers fall back to defaults.
- Best score may not retain across reloads.
- Fallback messaging to users should be explicit: gameplay remains available, but persistence is disabled and progress is not retained.

Recovery steps for maintainers:

1. Reproduce in a browser profile with storage enabled.
2. Reload and verify persistence health returns to `ready`.
3. Complete one short game and confirm new `sessions`, `scores`, and `replays` rows persist after reload.

## Seed/Persistence Verification Checklist

Use this quick pass after persistence changes:

1. Start from an empty browser profile and confirm demo rows are inserted only once for `sessions`, `scores`, and `replays`.
2. Set a player best score above demo score and confirm subsequent launches do not lower it.
3. Temporarily block IndexedDB and verify the app still runs with a visible persistence warning.
4. Restore storage, reload, and verify new completed sessions are persisted again.

## SC-006 Maintainer Verification Pass

Verification target: every SQLite table and localStorage key in implementation appears in this document with no omissions.

Source-of-truth files checked:

- `src/persistence/sqlite/schema.ts`
- `src/persistence/sqlite/database.ts`
- `src/types/persistence.ts`
- `src/persistence/local-storage/settingsStore.ts`
- `src/persistence/local-storage/uiStateStore.ts`
- `src/persistence/local-storage/bestScoreStore.ts`

Verification result:

- SQLite tables found in code: `app_meta`, `sessions`, `scores`, `replays`, `replay_events`.
- localStorage keys found in code: `tetris.settings.v1`, `tetris.ui.v1`, `tetris.best-score.v1`.
- IndexedDB identifiers found in code: database `classic-browser-tetris`, store `sqlite`, key `main`.
- Status: pass, no omissions detected.
