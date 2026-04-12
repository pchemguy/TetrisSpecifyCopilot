# Data Model: Classic Browser Tetris

## Overview

The application has two persistence layers:

- localStorage for lightweight user settings and transient shell state
- SQLite WASM for structured historical game data and replay records

The in-memory deterministic engine state remains the source of truth during active play.
Persistence snapshots are derived from engine state transitions.

## Entities

### Tetromino Definition

- Purpose: Defines a playable piece type and its rotation states.
- Fields:
  - `id`: string enum (`I`, `O`, `T`, `S`, `Z`, `J`, `L`)
  - `colorToken`: string
  - `rotationStates`: array of 4 matrix definitions
  - `kickTableId`: string enum
- Validation:
  - exactly seven definitions must exist
  - each tetromino must expose valid occupied cells for every supported rotation state
- Relationships:
  - referenced by Active Piece, Next Queue entries, Hold Slot, and Replay Events

### Active Piece

- Purpose: Represents the current falling piece in memory.
- Fields:
  - `tetrominoId`: tetromino enum
  - `rotationIndex`: integer 0-3
  - `x`: integer board column
  - `y`: integer board row
  - `spawnTick`: integer
- Validation:
  - occupied cells must remain within board bounds or valid spawn region
  - collision checks must pass before position changes are committed
- State transitions:
  - `spawned -> moving -> locking -> locked`

### Game Session

- Purpose: Represents one playable run and its summary data.
- Fields:
  - `session_id`: UUID/text primary key
  - `started_at`: ISO timestamp
  - `ended_at`: ISO timestamp nullable
  - `status`: enum (`active`, `paused`, `game_over`, `abandoned`)
  - `seed`: text
  - `score`: integer
  - `level`: integer
  - `lines_cleared`: integer
  - `duration_ms`: integer
  - `best_score_at_end`: integer nullable
- Validation:
  - `score >= 0`
  - `level >= 1`
  - `lines_cleared >= 0`
  - `ended_at` required when status is `game_over` or `abandoned`
- Relationships:
  - one Game Session has one or more Replay Events
  - one Game Session may have one Score Record summary row
- State transitions:
  - `active <-> paused`
  - `active -> game_over`
  - `active -> abandoned`

### Score Record

- Purpose: Stores a normalized score history entry for leader/history queries.
- Fields:
  - `score_id`: UUID/text primary key
  - `session_id`: foreign key to Game Session
  - `final_score`: integer
  - `level_reached`: integer
  - `lines_cleared`: integer
  - `achieved_at`: ISO timestamp
  - `is_personal_best`: boolean
- Validation:
  - `final_score >= 0`
  - `session_id` must reference a completed or abandoned session
- Relationships:
  - many Score Records over time, each tied to exactly one Game Session

### Replay Record

- Purpose: Tracks replay metadata for deterministic reconstruction.
- Fields:
  - `replay_id`: UUID/text primary key
  - `session_id`: foreign key to Game Session
  - `engine_version`: text
  - `seed`: text
  - `tick_count`: integer
  - `checksum`: text
  - `created_at`: ISO timestamp
- Validation:
  - `tick_count >= 0`
  - `checksum` must be reproducible from the recorded event stream
- Relationships:
  - one Replay Record has many Replay Events

### Replay Event

- Purpose: Stores the ordered command stream for a replayable session.
- Fields:
  - `event_id`: UUID/text primary key
  - `replay_id`: foreign key to Replay Record
  - `tick`: integer
  - `command`: enum (`move_left`, `move_right`, `rotate_cw`, `rotate_ccw`, `soft_drop_start`, `soft_drop_stop`, `hard_drop`, `hold`, `pause_toggle`, `restart`)
  - `payload_json`: text nullable
- Validation:
  - `(replay_id, tick, event_id)` ordering must be stable
  - event commands must match supported input contract names
- Relationships:
  - many Replay Events belong to one Replay Record

### User Settings

- Purpose: Stores user-configurable or persistent shell preferences in localStorage.
- Fields:
  - `version`: integer
  - `control_profile`: string
  - `show_ghost_piece`: boolean
  - `auto_pause_on_blur`: boolean
  - `reduce_motion`: boolean
- Validation:
  - unknown versions trigger migration or reset to defaults
  - absent values fall back to shipped defaults

### UI State Snapshot

- Purpose: Stores transient shell state in localStorage for consistent reload behavior.
- Fields:
  - `version`: integer
  - `last_overlay`: enum (`none`, `paused`, `game_over`, `help`)
  - `has_seeded_demo_data`: boolean
  - `last_selected_panel`: enum (`stats`, `controls`, `history`)
- Validation:
  - values are optional and may be dropped on incompatible version change

## Relationships Summary

- Game Session 1 -> 1 Replay Record
- Replay Record 1 -> many Replay Events
- Game Session 1 -> 0..1 Score Record
- Tetromino Definition is referenced by Active Piece and Replay reconstruction logic
- User Settings and UI State Snapshot are localStorage documents, not SQLite tables

## SQLite Tables

- `sessions`
- `scores`
- `replays`
- `replay_events`

## Derived Views / Queries

- Best score: `MAX(scores.final_score)`
- Recent sessions: latest completed rows from `sessions`
- Replay availability: join `sessions` and `replays` by `session_id`

## Migration Notes

- Use a schema version pragma/table to support future migrations.
- Seed demo rows only when the database is empty.
- Keep localStorage document versions independent from SQLite schema versioning.
