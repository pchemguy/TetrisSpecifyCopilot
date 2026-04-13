# Quickstart: Desktop App Packaging

## Prerequisites

- Node.js 22 LTS or newer
- npm 10 or newer
- Windows 11 with Git Bash available on `PATH`
- Chromium installed for browser/E2E validation

## Install

```bash
npm install
npx playwright install chromium
```

## Run Browser Development Mode

Use this for renderer-only iteration and to preserve the current fast browser workflow.

```bash
npm run dev:web
```

Open the local Vite URL in a desktop browser.

## Run Desktop Development Mode

Use this for Electron-shell validation, preload bridge work, and file-backed desktop persistence.

```bash
npm run dev
```

Expected outcome:

- the Electron window opens without a separate manual browser step
- the renderer shows the same gameplay shell as browser mode
- the app remains playable with networking disabled

## Build And Package

Create production assets and the portable Windows desktop artifact.

```bash
npm run build
npm run dist:win
```

Expected outcome:

- `dist/` contains the production Vite renderer bundle
- `dist-electron/` contains compiled Electron main/preload outputs
- the packaging output contains a portable Windows desktop artifact that launches without a dev server

## Validation Commands

```bash
npm run lint
npm run test
npx playwright test tests/e2e/core-gameplay.spec.ts --project=chromium --reporter=line
npx playwright test tests/e2e/session-persistence.spec.ts --project=chromium --reporter=line
npx playwright test tests/e2e/desktop-shell.spec.ts --reporter=line
npm run dist:win
```

## Desktop Reviewer Flow

1. Run `npm run dev` and confirm the Electron window opens the game shell without requiring a separate browser launch.
2. Start a short game, achieve a non-zero best score, close the desktop app fully, relaunch it, and confirm the best score remains visible.
3. Disable networking and relaunch the desktop app to confirm supported local gameplay remains available offline.
4. Corrupt or remove the desktop database file in the app data directory, relaunch, and confirm the app warns the user while falling back to a default best score instead of blocking startup.
5. Run the browser regression commands to confirm `npm run dev:web` and the existing renderer path still behave correctly.

## Runtime Notes

- The first reviewable Windows release is a portable app only.
- Desktop and browser persistence are intentionally separate in the first release.
- Best score is the only persistence category required across desktop restarts in the first release.
- Electron main and preload are thin adapters; shared persistence logic remains in `src/persistence`.