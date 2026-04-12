# Desktop Persistence Contract: Windows Desktop Portable Packaging

## 1. Boundary Rule

The React frontend MUST NOT access SQLite or the file system directly. All database and storage-path operations are owned by the Tauri native layer and exposed through explicit commands.

## 2. Startup Command Contract

Command name:

- `load_best_score_state`

Request payload:

- none

Response payload:

| Field | Type | Meaning |
| --- | --- | --- |
| `bestScore` | `number` | Current persisted best score value |
| `hasCompletedGame` | `boolean` | Whether a completed game has established a visible record |
| `showBestScore` | `boolean` | Whether UI should display the best score on startup |
| `storageMode` | `'portable_adjacent' \| 'localappdata_fallback'` | Chosen storage location mode |
| `notice` | `null \| { code: 'storage_fallback' \| 'database_reset', message: string }` | Event-scoped startup notice emitted only when a fallback or reset occurs in the current startup |

Behavior rules:

- If the database file is missing, the command creates it automatically and returns a valid initialized state.
- If the executable directory is not writable, the command resolves storage under `%LOCALAPPDATA%/<AppName>/` and returns a fallback notice for that startup event only.
- If the database is corrupt/unreadable, the command backup-renames it to `.corrupt.<high-resolution-timestamp>`, recreates a fresh database, and returns a reset notice for that startup event only.
- If `hasCompletedGame` is `false`, `showBestScore` must be `false` even though `bestScore` is initialized to `0`.
- The native layer does not persist notice-acknowledgement state; notices are derived only from the current fallback or recovery event.

## 3. Game Over Submission Contract

Command name:

- `submit_game_over_score`

Request payload:

| Field | Type | Meaning |
| --- | --- | --- |
| `finalScore` | `number` | Final deterministic score for the completed run |
| `completedReason` | `'game_over'` | Explicit boundary marker; no other reason is accepted |

Response payload:

| Field | Type | Meaning |
| --- | --- | --- |
| `bestScore` | `number` | Best score after evaluation |
| `hasCompletedGame` | `boolean` | Always `true` after a valid game-over submission |
| `isNewBest` | `boolean` | Whether the stored best score was updated |
| `showCongratulations` | `boolean` | Whether UI should show the new-record message |
| `showBestScore` | `boolean` | Whether UI should display best score after submission |

Behavior rules:

- The command is called only when gameplay reaches game-over.
- If `finalScore` is strictly greater than the stored best score, the native layer persists the new value and returns `isNewBest = true`.
- If `finalScore` is equal to or lower than the stored best score, the native layer does not update the database and returns `isNewBest = false`.
- `showCongratulations` must exactly mirror `isNewBest`.

## 4. Frontend Integration Rules

- Startup hydration occurs once during application bootstrap before best-score UI is finalized.
- The frontend application layer may cache the latest native response, but the database remains the source of truth across launches.
- The gameplay engine receives the current best score as input but does not call Tauri commands itself.
- Restarting or quitting mid-run must not invoke `submit_game_over_score`.

## 5. Error Contract

- Recoverable startup path issues produce a one-time notice in the startup response rather than a frontend crash.
- Unrecoverable native failures are surfaced as explicit command errors to the application layer, which maps them to non-blocking warning UI where possible.
- No frontend fallback to browser persistence is allowed for this feature.

## 6. Verification Contract

Minimum proof required before completion:

1. Startup command test covers first run, missing database recreation, fallback path selection, and corrupt database recovery.
2. Game-over submission test covers strict-greater, equal, and lower score outcomes.
3. Frontend integration test proves hidden-until-first-record startup behavior and congratulations visibility behavior.
4. Windows portable build smoke test proves restart persistence without a separate server process.
