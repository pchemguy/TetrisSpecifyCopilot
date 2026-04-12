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

| Table | Purpose | Key Fields |
| --- | --- | --- |
| `sessions` | Session lifecycle and summary metrics | `session_id`, `started_at`, `ended_at`, `status`, `seed`, `score`, `level`, `lines_cleared`, `duration_ms`, `best_score_at_end` |
| `scores` | Normalized score history | `score_id`, `session_id`, `final_score`, `level_reached`, `lines_cleared`, `achieved_at`, `is_personal_best` |
| `replays` | Replay metadata for deterministic reconstruction | `replay_id`, `session_id`, `engine_version`, `seed`, `tick_count`, `checksum`, `created_at` |
| `replay_events` | Ordered replay command stream | `event_id`, `replay_id`, `tick`, `command`, `payload_json` |

These tables are stored in browser-local SQLite and persisted via IndexedDB.
