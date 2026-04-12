# User Guide: Classic Tetris Desktop

## Overview

This guide helps players and local testers run, play, and understand the Windows-first desktop version of Classic Tetris.

## Shell Prerequisite

Windows users require Git Bash (for example, Git for Windows) or WSL when running from source. PowerShell is not supported.

## Related Docs

- [Developer Guide](./developer-guide.md)
- [Reviewer Guide](./reviewer-guide.md)
- [Persistence Reference](./persistence-reference.md)
- [Packaging Guide](./packaging/packaging.md)

## Release-Gate Status

- Last full quickstart acceptance pass: 2026-04-12
- Status: pass

## Source-of-Truth Baseline

Validated from [specs/003-windows-desktop-packaging/quickstart.md](../specs/003-windows-desktop-packaging/quickstart.md):

- Controls: desktop keyboard mapping is authoritative and must match runtime behavior.
- Scoring: line clears use classic values (single `100 x level`, double `300 x level`, triple `500 x level`, tetris `800 x level`), plus soft drop `+1` per row and hard drop `+2` per row.
- Best score visibility: the best-score panel stays hidden until at least one completed game exists.
- New-record messaging: the congratulations message appears only when a final score is strictly greater than the stored best score.
- Seed data: reviewer-focused demo records must never overwrite the player's best score.

## Terminology and Consistency Rules

- Canonical terms: tetromino, ghost piece, hold, hard drop, soft drop, pause/resume, best score.
- Cross-link targets: [Developer Guide](./developer-guide.md), [Reviewer Guide](./reviewer-guide.md), [Persistence Reference](./persistence-reference.md), [Packaging Guide](./packaging/packaging.md).

## Prerequisites

For packaged desktop use:

- Windows 10 or Windows 11
- WebView2 runtime available on the machine

For running from source:

- Node.js 22 LTS or newer
- npm 10 or newer
- Rust stable toolchain

## Launch Options

### Packaged Desktop App

Launch `tetris-desktop.exe` from the packaged Windows bundle or release output.

### Desktop Runtime From Source

```bash
npm install
npm run tauri dev
```

### Frontend-Only Preview

```bash
npm install
npm run dev
```

Open the local URL shown by Vite in your desktop browser.

Use frontend-only preview for UI iteration only. It does not exercise native desktop best-score storage.

## Windows Support

- Supported: Windows 10 and Windows 11 with WebView2
- Not supported: mobile devices or non-Windows packaged releases for this feature

## Controls Reference

| Key | Action |
| --- | --- |
| `ArrowLeft` | Move left |
| `ArrowRight` | Move right |
| `ArrowDown` | Soft drop |
| `ArrowUp` or `X` | Rotate clockwise |
| `Z` | Rotate counter-clockwise |
| `Space` | Hard drop |
| `C` or `ShiftLeft` | Hold piece |
| `P` or `Escape` | Pause/resume |
| `R` | Restart |

## Scoring

Line clear score is multiplied by current level:

| Clear Type | Points |
| --- | --- |
| Single | `100 x level` |
| Double | `300 x level` |
| Triple | `500 x level` |
| Tetris (4 lines) | `800 x level` |

Additional points:

- Soft drop: `+1` per row
- Hard drop: `+2` per row
- Combo bonuses: none

Level increases each time total cleared lines crosses a 10-line threshold, which increases gravity speed.

## Persistence and Best Score

The desktop app stores data locally in three places:

- native SQLite file for the best score
- `localStorage` for settings and UI state
- local `sql.js` data persisted in browser or webview storage for sessions, scores, and replay metadata

Best-score behavior is intentional:

- the best-score panel stays hidden until at least one game reaches `game_over`
- a zero-score completed game still marks the panel as eligible to appear
- the congratulations message appears only when a final score is strictly greater than the stored best score
- quitting or restarting mid-run does not update the stored best score

## Desktop Storage Location

The desktop best-score database file is named `best-score.sqlite3`.

- If the app directory is writable, the file is stored next to the executable.
- If the app directory is not writable, storage falls back to `%LOCALAPPDATA%/Classic Browser Tetris/`.

## Seeded Demo Data

On first launch, the app seeds:

- default settings and UI state if they are missing
- demo rows for sessions, scores, and replay metadata when structured history storage is empty

Seeded data exists for review visibility. It never writes or lowers the player's desktop best score.

## Troubleshooting

### App Does Not Start

- For packaged use, confirm WebView2 is installed.
- For source use, re-run `npm install` and start again with `npm run tauri dev`.

### Controls Not Responding

- Click inside the game window so keyboard input focus is active.
- Confirm you are using the keys listed in the controls reference.

### Best Score Not Appearing

- This is expected on first launch before any completed game exists.
- Finish one game so the app records that a completed session exists.
- If a database-reset notice appears, the old best-score file was replaced during corruption recovery and the new best score starts from a clean state.

### Storage Fallback Notice Appears

- The app folder was not writable.
- The database was moved to `%LOCALAPPDATA%/Classic Browser Tetris/`.
- Gameplay continues normally and best-score persistence remains available.

### Frontend-Only Preview Behaves Differently

- `npm run dev` does not exercise native desktop best-score commands.
- Use `npm run tauri dev` when validating packaged-desktop behavior.

## Player Onboarding Validation

Use this quick check to validate this guide:

1. Launch the packaged app or run `npm run tauri dev` using only this guide.
2. Confirm the game window opens and documented controls behave as listed.
3. Finish one game and confirm the best-score panel becomes eligible to appear only after that completed session.
4. Finish a later game with a strictly higher score and confirm the congratulations message appears.
5. Relaunch the app and confirm the saved best score is shown at startup.

If any step fails, update this guide before release sign-off.
