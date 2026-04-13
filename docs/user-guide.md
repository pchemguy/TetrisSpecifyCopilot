# User Guide: Classic Browser Tetris

## Overview

This guide helps players install, run, and play Classic Browser Tetris.

## Shell Prerequisite

Windows users require Git Bash (for example, Git for Windows) or WSL; PowerShell is not supported.

## Related Docs

- [Developer Guide](./developer-guide.md)
- [Reviewer Guide](./reviewer-guide.md)
- [Persistence Reference](./persistence-reference.md)

## Release-Gate Status

- Last full quickstart acceptance pass: 2026-04-1[Packaging Guide](packaging-overview.md)eline

Validated from [specs/002-project-docs/research.md](../specs/002-project-docs/research.md):

- Controls: desktop keyboard mapping is authoritative and must match runtime behavior.
- Scoring: line clears use classic values (single 100x level, double 300x level, triple 500x level, tetris 800x level), plus soft drop +1/row and hard drop +2/row.
- Seed data: first-run seeded demo records are for review visibility and must never overwrite player best score behavior.

## Terminology and Consistency Rules

- Canonical terms: tetromino, ghost piece, hold, hard drop, soft drop, pause/resume, best score.
- Cross-link targets: [Developer Guide](./developer-guide.md), [Reviewer Guide](./reviewer-guide.md), [Persistence Reference](./persistence-reference.md).
- Use canonical terms consistently and avoid alternate naming for the same in-game concept.

## Prerequisites

- Node.js 22 LTS or newer
- npm 10 or newer
- A modern desktop browser with WebAssembly and IndexedDB support

## Install

```bash
npm install
```

## Launch

```bash
npm run dev
```

Open the local URL shown by Vite in your desktop browser.

#[Packaging Guide](packaging-overview.md)atest desktop Chromium, Firefox, and Safari releases with WebAssembly and IndexedDB enabled
- Not supported: mobile browsers for this release

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

The game stores local data in your browser:

- `localStorage`: settings and UI state
- Browser SQLite database (persisted via IndexedDB): sessions, scores, and replay metadata

Best score remains available after page reload because it is loaded from local browser data.

## Seeded Demo Data

On first launch in an empty browser profile, the app seeds:

- default settings/UI state
- demo rows in browser SQLite tables for sessions, scores, and replay metadata

Seeded data exists to make review and verification easier. It must not overwrite a player's best score.

## Troubleshooting

### App Does Not Start

- Re-run `npm install` to confirm dependencies are present.
- Start again with `npm run dev` and open the URL shown by Vite.

### Controls Not Responding

- Click inside the game page so keyboard input focus is active.
- Confirm you are using the keys listed in the controls reference.

### Best Score Not Appearing

- Reload the page once to allow persisted state hydration.
- If browser storage was cleared, best score history resets until new sessions are played.

### IndexedDB or localStorage Is Blocked

- Some private browsing modes or strict browser settings can block local persistence.
- Gameplay still works, but progress and best score may not persist across reloads.
- If this happens, switch to a browser/profile that allows localStorage and IndexedDB, then relaunch.

## Player Onboarding Validation

Use this quick check to validate this guide against SC-001 and SC-004:

1. Run `npm install` and `npm run dev` using only this guide.
2. Open the local Vite URL and confirm the game loads in under five minutes from starting setup.
3. Press each documented control key once and confirm behavior matches the controls table.
4. Reload the page and confirm persisted best score behavior is explained and observable.

If any step fails, update this guide before release sign-off.
