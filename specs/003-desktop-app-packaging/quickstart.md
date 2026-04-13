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
- the packaging output contains a Windows desktop app that launches without a dev server
- validated unpacked launch path: `release/win-unpacked/Tetris Specify Copilot.exe`

## Startup Budget Evidence

- Measured launch-to-board time from `release/win-unpacked/Tetris Specify Copilot.exe`: `979 ms`
- Observed runtime/build label in the desktop shell: `Runtime desktop/win32 v0.1.0`
- Result: passes the 5-second packaged desktop startup budget

## Desktop Persistence Budget Evidence

- Measured desktop best-score fallback hydration time with a corrupt `desktop-state.sqlite`: `30 ms`
- Measured desktop best-score save latency after game over: `14 ms`
- Result: both desktop persistence timings pass the 250 ms budget

## Validation Commands

```bash
npm run lint
npm run test
npm run build:electron
npx playwright test tests/e2e/core-gameplay.spec.ts --project=chromium --reporter=line
npx playwright test tests/e2e/session-persistence.spec.ts --project=chromium --reporter=line
npx playwright test tests/e2e/desktop-shell.spec.ts --reporter=line
npm run dist:win
```

## Shared Guardrails And Rollback

Use these checkpoints while the desktop path is still being assembled:

1. Validate the shared renderer separately with `npm run dev:web` or `npm run build` before diagnosing Electron-specific failures.
2. Validate Electron compilation separately with `npm run build:electron` before investigating packaging or preload behavior.
3. Treat browser persistence as the rollback baseline until the desktop bridge and file-backed persistence flow are fully wired.
4. Keep renderer-facing desktop behavior behind `window.desktopApi`; do not patch around shell failures by adding direct Electron imports under `src/`.
5. If a desktop packaging step fails, confirm `dist/` and `dist-electron/` were both produced as expected before retrying `npm run dist:win`.

## Desktop Reviewer Flow

1. Run `npm run dev` and confirm the Electron window opens the game shell without requiring a separate browser launch.
2. Start a short game, achieve a non-zero best score, close the desktop app fully, relaunch it, and confirm the best score remains visible.
3. Disable networking and relaunch the desktop app to confirm supported local gameplay remains available offline.
4. Corrupt or remove the desktop database file in the app data directory, relaunch, and confirm the app warns the user while falling back to a default best score instead of blocking startup.
5. Simulate a stale temp save file or interrupted desktop save and confirm the next launch prefers the last committed database file, removes or ignores stale temp artifacts, and warns only if fallback defaults are required.
6. Validate a desktop persistence failure path such as locked-file, permission, or disk-space denial and confirm gameplay can still continue while the last committed best score remains intact.
7. Run the browser regression commands to confirm `npm run dev:web` and the existing renderer path still behave correctly.

## Runtime Notes

- The first reviewable Windows release is a portable app only.
- Desktop and browser persistence are intentionally separate in the first release.
- Best score is the only persistence category required across desktop restarts in the first release.
- Electron main and preload are thin adapters; shared persistence logic remains in `src/persistence`.
- Desktop mode treats an unavailable or incomplete bridge as a persistence warning path and does not fall back to browser storage.
- Atomic desktop saves use temp-file replacement; stale temp save artifacts are removed or ignored on the next launch before committed data is loaded.
- Persistence-only asset failures and write failures warn and keep gameplay available when core gameplay can still initialize; core startup asset failures produce a blocking startup error with recovery guidance.
