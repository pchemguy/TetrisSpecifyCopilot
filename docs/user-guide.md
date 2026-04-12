# User Guide: Classic Browser Tetris

## Overview

This guide helps players install, run, and play Classic Browser Tetris.

## Shell Prerequisite

Windows users require Git Bash (for example, Git for Windows) or WSL; PowerShell is not supported.

## Related Docs

- [Developer Guide](./developer-guide.md)
- [Reviewer Guide](./reviewer-guide.md)
- [Persistence Reference](./persistence-reference.md)

## Source-of-Truth Baseline

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

## Desktop Browser Support

- Supported: latest desktop Chromium, Firefox, and Safari releases with WebAssembly and IndexedDB enabled
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
