# Persistence Reference: Classic Browser Tetris

## Overview

This guide describes the current persistence model across browser and desktop runtimes.

## Related Docs

- [User Guide](./user-guide.md)
- [Developer Guide](./developer-guide.md)
- [Reviewer Guide](./reviewer-guide.md)
- [Desktop Architecture](./desktop-architecture.md)

## Runtime Split

Persistence is runtime-specific in the first desktop release:

- browser mode keeps browser-local storage and IndexedDB-backed SQLite bytes
- desktop mode keeps SQLite bytes in a local file under the Electron app data directory
- browser and desktop persistence do not import, merge, or overwrite each other

## Browser Persistence

### localStorage Keys

| Key | Purpose | Shape |
| --- | --- | --- |
| `tetris.settings.v1` | user settings | `{ version: 1, control_profile, show_ghost_piece, auto_pause_on_blur, reduce_motion }` |
| `tetris.ui.v1` | UI state | `{ version: 1, last_overlay, has_seeded_demo_data, last_selected_panel }` |
| `tetris.best-score.v1` | browser best score | stringified non-negative integer |

### Browser SQLite Storage

IndexedDB identifiers:

- database: `classic-browser-tetris`
- object store: `sqlite`
- key: `main`

The browser adapter is only available in browser mode. It reads and writes SQLite database bytes through IndexedDB.

## Desktop Persistence

### Desktop SQLite File

Desktop mode stores SQLite bytes in the Electron app data directory using:

- committed file: `desktop-state.sqlite`
- temp file: `desktop-state.sqlite.tmp`

Desktop saves use temp-file-plus-rename replacement. On the next launch, stale temp files are removed before the committed file is read.

### Desktop Persistence Scope

- the first desktop release only guarantees restart persistence for best score
- best score is stored in `app_meta.best_score`
- desktop mode uses default settings and default UI state for the current run instead of reading browser localStorage

## Shared SQLite Schema

The shared schema is still present in both runtimes.

| Table | Purpose |
| --- | --- |
| `app_meta` | schema version and desktop best-score metadata |
| `sessions` | session lifecycle summary |
| `scores` | score history with personal-best marker |
| `replays` | replay metadata |
| `replay_events` | replay command stream |

Indexes:

- `idx_scores_session_id`
- `idx_replays_session_id`
- `idx_replay_events_replay_id`
- `idx_replay_events_tick`

Schema invariants:

- `schema_version` is stored in `app_meta`
- `best_score` is seeded in `app_meta` with default value `0`
- schema creation is idempotent and transactional

## Seed Data Rules

Seeded demo rows exist for review visibility only.

- browser localStorage defaults are written only when keys are missing
- SQLite demo rows are inserted only when target tables are empty
- seeded demo data must never overwrite a player best score

## Hydration Lifecycle

### Browser Mode

1. Read settings, UI state, and best score from browser storage.
2. Read SQLite bytes from IndexedDB.
3. Ensure schema exists.
4. Seed demo rows if SQLite tables are empty.
5. Persist SQLite bytes back to IndexedDB.

### Desktop Mode

1. Use default settings and default UI state for the current run.
2. Request desktop SQLite bytes through the preload bridge.
3. Remove stale temp save artifacts before reading the committed file.
4. Ensure schema exists and read `app_meta.best_score`.
5. Persist SQLite bytes back through the desktop bridge after completed-session writes.

## Warning Codes And Recovery Meaning

| Code | Meaning |
| --- | --- |
| `sqlite_unavailable` | browser SQLite persistence could not initialize |
| `desktop_bridge_unavailable` | desktop bridge is missing or incomplete for this run |
| `desktop_data_unreadable` | desktop committed database could not be read |
| `desktop_data_invalid` | desktop bytes were present but could not hydrate into a valid database |
| `desktop_persistence_disabled` | desktop persistence could not initialize for the current run |
| `desktop_write_permission_denied` | desktop save failed because the app cannot write to the data folder |
| `desktop_write_locked` | desktop save failed because the file is locked |
| `desktop_write_no_space` | desktop save failed because the machine is out of disk space |
| `desktop_write_failed` | desktop save failed for another reason |
| `replay_write_failed` | browser completed-session write failed |

## Recovery Rules

- Browser mode treats the absence of `window.desktopApi` as normal and stays on browser storage.
- Desktop mode with an unavailable or incomplete bridge warns and does not fall back to browser persistence.
- Desktop invalid or unreadable bytes fall back to the default best score with a warning.
- Desktop write failures leave the last committed file intact and keep gameplay available.

## Maintainer Verification Checklist

1. In browser mode, clear storage and confirm demo rows seed only once.
2. In browser mode, reload and confirm browser best score persists.
3. In desktop mode, achieve a best score, relaunch, and confirm the best score persists.
4. In desktop mode, corrupt or remove `desktop-state.sqlite` and confirm the warning path is visible while gameplay still loads.
5. In desktop mode, simulate a stale temp file and confirm the last committed file is preferred.
