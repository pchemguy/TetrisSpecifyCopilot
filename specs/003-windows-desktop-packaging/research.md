# Research: Windows Desktop Portable Packaging

## Decision 1: Use native Rust-owned SQLite through `rusqlite` rather than guest-side SQL access

- Decision: Implement SQLite access inside `src-tauri` using `rusqlite` with bundled SQLite and expose only explicit Tauri commands to the React frontend.
- Rationale: The feature requires database ownership, file-system ownership, and path resolution to live on the native side. `rusqlite` keeps the design minimal for a one-record database, avoids external SQLite installation, and aligns with a portable Windows artifact.
- Alternatives considered: `sql.js` was rejected because it is browser-managed and persists through IndexedDB/WASM rather than native on-disk SQLite. `@tauri-apps/plugin-sql` guest bindings were rejected because their primary usage model exposes SQL loading/execution to the frontend and defaults to an AppConfig-relative connection path, which conflicts with explicit native ownership and executable-adjacent placement. `sqlx` was rejected because its async/runtime complexity is unnecessary for a single-table local best-score feature.

## Decision 2: Resolve database path in the native layer, preferring executable-adjacent storage with Windows fallback

- Decision: Determine database placement in Rust at startup by first trying a database file next to the executable when writable, and otherwise falling back to `%LOCALAPPDATA%/<AppName>/` with a one-time notice.
- Rationale: The specification prefers portable app-adjacent storage, but Windows writable-path reality means the executable directory may not always be writable. Native-side path resolution is also the right technical boundary because Tauri's JavaScript path API does not provide a supported Windows `executableDir()` helper, while the native runtime can derive the executable parent directly and check writability safely.
- Alternatives considered: Always storing the database in app data was rejected because it weakens the portable-local expectation. Failing startup when the executable directory is read-only was rejected because it makes normal Windows installation locations too fragile. Letting the frontend resolve the path was rejected because file-system ownership belongs to the native layer.

## Decision 3: Use a minimal single-row best-score schema with explicit first-record visibility state

- Decision: Store one `best_score_state` row in SQLite with the fields needed to preserve the current record and whether a completed game has ever established a visible record.
- Rationale: The feature scope is intentionally narrow: one local player, one numeric best score, no history. A single-row table is easier to migrate, recover, and validate than session/history tables, and it cleanly supports the rule "initialize to 0, but do not display until first completed game."
- Alternatives considered: Reusing the existing browser session/score/replay schema was rejected because it adds out-of-scope history tracking. Storing the value in a plain file was rejected because the feature explicitly requires a database. Keeping only a numeric value without a first-record visibility flag was rejected because it cannot distinguish hidden-initialized-zero from a legitimate established score of zero.

## Decision 4: Trigger persistence only at startup and game-over through explicit Tauri commands

- Decision: Use a startup hydration command (`load_best_score_state`) and a game-over submission command (`submit_game_over_score`) as the only frontend/native persistence boundaries.
- Rationale: This preserves deterministic gameplay logic by keeping persistence side effects out of engine ticks and out of mid-run transitions. It also matches the user-facing rules: startup display depends on persisted state, and best-score comparison is evaluated only when game-over occurs.
- Alternatives considered: Direct persistence calls from engine state transitions were rejected because they entangle gameplay logic with I/O. Per-score-change writes were rejected because they add unnecessary churn and increase failure surface. Treating restart/quit as completion was rejected by clarified requirements.

## Decision 5: Use portable Windows folder distribution as the required release baseline

- Decision: Plan the feature around a Tauri portable folder artifact (`.exe` plus required runtime files) as the mandatory Windows release baseline, while treating single-executable packaging as optional.
- Rationale: This satisfies the portable-local requirement without forcing packaging constraints that may conflict with Tauri's preferred Windows bundle layout. It also keeps the plan focused on runtime behavior and maintainable architecture instead of over-optimizing for one specific bundling shape.
- Alternatives considered: Requiring a single executable was rejected because it is a preference, not an acceptance condition. Installer-only delivery was rejected because it weakens the portable-local requirement. Supporting both portable and installer paths equally in this feature was rejected because it broadens validation scope without adding direct user value.

```bash
npm run tauri build
```

## Acceptance Walkthrough

1. Start with no database file present and confirm startup auto-creates storage while keeping best score hidden.
2. Finish a game without beating the saved best score and confirm no congratulations message appears.
3. Finish a game with a strictly greater score and confirm the congratulations message appears and the new best score is persisted.
4. Close and relaunch the desktop app and confirm the saved best score is shown at startup.
5. Delete the database file, relaunch, and confirm automatic recreation.
6. Simulate a corrupt database file, relaunch, and confirm backup rename plus one-time reset warning.
7. Validate the app runs locally from the Windows portable folder artifact with no separate server process.

## Acceptance Checklist

- best-score persistence is native SQLite, not browser `sql.js`
- database path is resolved on the native side, not in the frontend
- best score is loaded only through explicit startup command boundaries
- best score is updated only through explicit game-over submission boundaries
- quit/restart-mid-run never updates best score
- startup fallback and corruption recovery notices are visible exactly when required
- portable folder artifact is sufficient for Windows acceptance even if single-file bundling is not used