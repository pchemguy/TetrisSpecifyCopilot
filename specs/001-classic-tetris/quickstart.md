# Quickstart: Classic Browser Tetris

## Prerequisites

- Node.js 22 LTS or newer
- npm 10 or newer
- A modern desktop browser with WebAssembly and IndexedDB enabled

## Install

```bash
npm install
```

## Start the Application

```bash
npm run dev
```

Open the local development URL shown by Vite in a desktop browser.

## Default Controls

- `ArrowLeft` / `ArrowRight`: move
- `ArrowDown`: soft drop
- `ArrowUp` or `X`: rotate clockwise
- `Z`: rotate counter-clockwise
- `Space`: hard drop
- `C` or left shift: hold
- `P` or `Escape`: pause/resume
- `R`: restart

## Seeded Demo Data

On first launch in an empty browser profile, the app seeds:

- default localStorage settings and UI state
- demo rows in the browser SQLite database for scores, sessions, and replay metadata

This allows reviewers to verify persistence, best-score display, and history-driven UI immediately without playing a full session first.

## Validation Commands

```bash
npm run lint
npm run test
npm run test:e2e
```

## Reset Local Data

During development, clear the browser's localStorage and IndexedDB for the app origin to simulate a first-run experience.

## Expected Development Outcome

- the game starts without any network service dependency
- a new playable session is immediately available
- seeded historical data is visible where the UI exposes best score or history panels
- gameplay remains responsive for extended local sessions
