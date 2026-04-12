# Data Model: Windows Desktop Portable Packaging

## Overview

This feature introduces a minimal native desktop persistence model centered on a single local player's best score. The frontend reads and submits score state through Tauri commands; the native runtime owns the database file, schema initialization, corruption recovery, and storage-location selection.

## Entities

### Best Score State

- Purpose: Represents the only persistent gameplay record required by this feature.
- Storage: SQLite table `best_score_state` with exactly one logical row.
- Fields:
  - `id`: integer primary key constrained to `1`
  - `best_score`: non-negative integer
  - `has_completed_game`: boolean flag indicating whether a completed game has established a visible record
  - `updated_at`: UTC timestamp of the last successful strict-greater update
- Validation:
  - `best_score` must be `>= 0`
  - `has_completed_game = false` implies startup UI hides best score even though `best_score` is initialized to `0`
  - only one row may exist
- State transitions:
  - first run: row created with `best_score = 0`, `has_completed_game = false`
  - new record: `best_score` updated to final score, `has_completed_game = true`
  - equal/lower result: no row update

### Storage Resolution State

- Purpose: Captures where the native runtime chose to place the SQLite database for the current machine/run.
- Fields:
  - `mode`: enum (`portable_adjacent`, `localappdata_fallback`)
  - `database_path`: absolute Windows path string
  - `notice_code`: enum or null (`storage_fallback`, `database_reset`)
- Validation:
  - `portable_adjacent` is used only when the executable directory is writable
  - `localappdata_fallback` must resolve under `%LOCALAPPDATA%/<AppName>/`
  - `notice_code` is emitted at most once per relevant startup event
  - `notice_code` is event-scoped only and is not persisted as acknowledgement state across launches

### Startup Hydration Result

- Purpose: Data returned from the native layer to the frontend during app startup.
- Fields:
  - `bestScore`: integer
  - `showBestScore`: boolean
  - `hasCompletedGame`: boolean
  - `storageMode`: enum (`portable_adjacent`, `localappdata_fallback`)
  - `notice`: optional user-facing notice payload
- Validation:
  - `showBestScore` must equal `hasCompletedGame`
  - if the database was missing, result must still be valid after auto-creation
  - if corruption recovery occurred, `notice` must describe reset behavior

### Game Over Submission

- Purpose: Input sent from the frontend application layer to native persistence when a run reaches game-over.
- Fields:
  - `finalScore`: non-negative integer
  - `completedReason`: fixed enum value `game_over`
- Validation:
  - command is not valid for quit/restart-mid-run flows
  - `finalScore` must be derived from deterministic gameplay state, not from persisted state

### Game Over Persistence Result

- Purpose: Result returned after comparing a final score to the stored best score.
- Fields:
  - `bestScore`: integer after evaluation
  - `isNewBest`: boolean
  - `showCongratulations`: boolean
  - `showBestScore`: boolean
- Validation:
  - `isNewBest = true` only when `finalScore > previous_best_score`
  - `showCongratulations` mirrors `isNewBest`
  - equal or lower scores leave `bestScore` unchanged

## Schema Notes

- Database file contains only the tables and metadata needed for this feature.
- Migration approach may use SQLite user version or an explicit migration table, but the first release only needs a single initial schema.
- Corrupt-database recovery is handled outside normal schema migration by backup-renaming the unreadable file with a high-resolution timestamp suffix and recreating a fresh database.

## Relationships

- `Storage Resolution State` determines the database path used to load or create `Best Score State`.
- `Startup Hydration Result` is derived from `Best Score State` plus `Storage Resolution State`.
- `Game Over Submission` updates `Best Score State` and produces `Game Over Persistence Result`.
