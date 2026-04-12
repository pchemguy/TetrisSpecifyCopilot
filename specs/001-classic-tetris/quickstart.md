# Quickstart: Classic Browser Tetris

## Prerequisites

- Node.js 22 LTS or newer
- npm 10 or newer
- A modern desktop browser with WebAssembly and IndexedDB enabled

## Install

```bash
npm install
npx playwright install chromium
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
npx playwright test tests/e2e/core-gameplay.spec.ts --project=chromium --reporter=line
npx playwright test tests/e2e/hud-and-strategy.spec.ts --project=chromium --reporter=line
npx playwright test tests/e2e/session-persistence.spec.ts --project=chromium --reporter=line
```

## Reviewer Flow

1. Start the app with `npm run dev` and open the local Vite URL in Chromium.
2. Confirm the playfield canvas, next queue, hold slot, controls legend, and best-score panel render immediately.
3. Press `Space`, `C`, `P`, and `R` to verify drop, hold, pause, and restart behavior.
4. Reload the page and confirm the best-score panel still renders persisted local state.
5. Repeat the browser checks with DevTools network throttling disabled and the page set offline after the first load to confirm no runtime network dependency.

## Reset Local Data

During development, clear the browser's localStorage and IndexedDB for the app origin to simulate a first-run experience.

## Runtime Notes

- The app is expected to run fully client-side after the initial asset load.
- Seeded demo rows are for reviewer visibility only and must not replace the player's best score.
- If SQLite hydration fails, gameplay should still remain available with a non-blocking persistence warning.

## Expected Development Outcome

- the game starts without any network service dependency
- a new playable session is immediately available
- seeded historical data is visible where the UI exposes best score or history panels
- gameplay remains responsive for extended local sessions
