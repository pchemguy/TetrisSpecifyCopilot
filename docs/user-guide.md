# User Guide: Classic Browser Tetris

## Overview

Classic Browser Tetris can be run in either browser mode or Windows desktop mode. This guide covers installation, controls, scoring, runtime choices, persistence behavior, and common recovery steps.

## Supported Environment

- Windows 11
- Git Bash on `PATH`
- Node.js 22 LTS or newer
- npm 10 or newer
- A modern desktop browser with WebAssembly and IndexedDB support for browser mode

PowerShell is not a supported workflow for this repository.

## Related Docs

- [Developer Guide](./developer-guide.md)
- [Reviewer Guide](./reviewer-guide.md)
- [Persistence Reference](./persistence-reference.md)

## Install

```bash
npm install
```

## Choose A Runtime

### Browser Mode

Use browser mode for renderer-only play and for the fastest local iteration.

```bash
npm run dev:web
```

Open the Vite URL in your desktop browser. The app should show `Runtime browser/web` in the readiness strip.

### Desktop Development Mode

Use desktop mode to run the Electron shell locally.

```bash
npm run dev
```

Expected outcome:

- an Electron window opens without a second manual browser step
- the readiness strip shows `Runtime desktop/win32 v0.1.0` on the current validated Windows machine
- gameplay remains available after networking is disabled post-load

### Portable Windows Package

Build a reviewable Windows desktop artifact locally:

```bash
npm run build
npm run dist:win
```

Expected outputs:

- `release/Tetris Specify Copilot-0.1.0-portable.exe`
- `release/win-unpacked/Tetris Specify Copilot.exe`

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
| `P` or `Escape` | Pause or resume |
| `R` | Restart after or during a run |

## Scoring

Line clear score is multiplied by the current level:

| Clear Type | Points |
| --- | --- |
| Single | `100 x level` |
| Double | `300 x level` |
| Triple | `500 x level` |
| Tetris | `800 x level` |

Additional scoring rules:

- Soft drop: `+1` per row
- Hard drop: `+2` per row
- Level increases every 10 cleared lines

## Persistence And Best Score

The project intentionally uses separate persistence for browser and desktop modes.

### Browser Mode Persistence

- `localStorage` stores settings, UI state, and best score
- IndexedDB stores the SQLite database bytes for sessions, scores, and replay metadata
- browser mode shows `Runtime browser/web`

### Desktop Mode Persistence

- desktop mode stores SQLite bytes under the local app data directory as `desktop-state.sqlite`
- desktop mode only guarantees restart persistence for best score in the first release
- browser data is not imported into desktop mode
- desktop mode shows `Runtime desktop/<platform> v<version>`

## Seeded Demo Data

On first run in a fresh profile, the app seeds demo session, score, and replay rows to make review and validation easier.

Seeded demo data must never overwrite a real player best score.

## Persistence Warnings

Desktop mode can continue running even when persistence cannot be trusted for the current run.

Examples:

- `Desktop persistence unavailable`: the preload bridge or local desktop persistence path is unavailable
- `Desktop best score reset`: stored desktop bytes were unreadable or invalid, so the app falls back to the default best score
- `Desktop save warning`: gameplay continues, but the latest best-score update may not survive restart

## Troubleshooting

### The App Does Not Start

- Re-run `npm install`.
- Use `npm run dev:web` for browser mode or `npm run dev` for desktop mode.
- If desktop mode fails, run `npm run build:electron` to isolate Electron compilation problems.

### The Wrong Runtime Opens

- `npm run dev:web` should open in a browser and show `Runtime browser/web`.
- `npm run dev` should open an Electron window and show `Runtime desktop/win32 v0.1.0` on the current Windows validation machine.

### Best Score Did Not Persist

- In browser mode, confirm localStorage and IndexedDB are allowed in the current browser profile.
- In desktop mode, relaunch once and read any persistence warning shown in the HUD.
- Desktop and browser best scores are separate by design in the first release.

### Desktop Save Warnings Appear

- A permission, lock, or disk-space issue may have prevented the last save.
- Gameplay can continue, but the most recent best-score update may not survive restart until the underlying issue is fixed.

## Quick User Verification

1. Run `npm install`.
2. Run `npm run dev:web` and confirm the browser shell loads.
3. Start a short run, score points, reload, and confirm the browser best score remains visible.
4. Run `npm run dev`, play until a non-zero best score is visible, close the app, relaunch, and confirm the desktop best score remains visible.
