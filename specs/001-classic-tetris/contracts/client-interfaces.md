# Client Interfaces Contract: Classic Browser Tetris

## 1. Input Contract

The desktop keyboard mapping must normalize browser key events into engine commands.

| Browser Key | Engine Command | Notes |
| ----------- | -------------- | ----- |
| `ArrowLeft` | `move_left` | Repeatable while held |
| `ArrowRight` | `move_right` | Repeatable while held |
| `ArrowDown` | `soft_drop_start` / `soft_drop_stop` | Start on keydown, stop on keyup |
| `ArrowUp` or `KeyX` | `rotate_cw` | Primary clockwise rotation |
| `KeyZ` | `rotate_ccw` | Secondary rotation input |
| `Space` | `hard_drop` | Instant placement |
| `KeyC` or `ShiftLeft` | `hold` | Once per active piece |
| `KeyP` or `Escape` | `pause_toggle` | Disabled on game-over screen |
| `KeyR` | `restart` | Valid from active, paused, or game-over state |

## 2. Render Contract

The application shell must render these visible regions on desktop:

- primary gameplay canvas containing the 10x20 board, locked stack, active piece, and ghost piece
- right-side or adjacent HUD containing score, best score, level, lines cleared, next piece, and held piece
- persistent keyboard legend or discoverable controls panel
- paused overlay when the game is paused
- game-over overlay with final score and restart affordance

Rendering rules:

- the engine state is authoritative for gameplay positions and scoring
- Canvas draws gameplay cells and grid-aligned piece visuals
- React renders HUD labels, overlays, and non-frame-critical UI

## 3. localStorage Contract

Required keys:

- `tetris.settings.v1`
- `tetris.ui.v1`

`tetris.settings.v1` document:

```json
{
  "version": 1,
  "control_profile": "classic-desktop",
  "show_ghost_piece": true,
  "auto_pause_on_blur": true,
  "reduce_motion": false
}
```

`tetris.ui.v1` document:

```json
{
  "version": 1,
  "last_overlay": "none",
  "has_seeded_demo_data": false,
  "last_selected_panel": "stats"
}
```

## 4. SQLite Persistence Contract

SQLite database responsibilities:

- store session summaries
- store normalized score history
- store replay metadata and ordered replay events

Expected tables:

- `sessions(session_id, started_at, ended_at, status, seed, score, level, lines_cleared, duration_ms, best_score_at_end)`
- `scores(score_id, session_id, final_score, level_reached, lines_cleared, achieved_at, is_personal_best)`
- `replays(replay_id, session_id, engine_version, seed, tick_count, checksum, created_at)`
- `replay_events(event_id, replay_id, tick, command, payload_json)`

Persistence rules:

- local first-run seeding inserts demo rows when the database is empty
- best score display is derived from the `scores` table, with optional in-memory caching during a session
- database persistence occurs locally through browser storage with no network calls

## 5. Failure Handling Contract

- If SQLite hydration fails, the app must still allow a fresh local game session and surface a non-blocking persistence warning.
- If localStorage documents are missing or malformed, the app must recover with default values.
- If replay persistence fails after a completed session, the final game outcome must remain visible and the failure must not corrupt active gameplay state.
