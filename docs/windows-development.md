# Windows Development Workflow

## Purpose

This guide defines the supported Windows contributor path for the desktop-packaging feature.

## Supported Environment

- Windows 11
- Git Bash available on `PATH`
- Node.js 22 LTS or newer
- npm 10 or newer

## Shell Rule

If Bash is available, use Bash for repository commands. Do not mix Bash and PowerShell steps in the same workflow.

## Current Workflows

This guide will track the validated commands for both supported runtime paths.

- Browser workflow: `npm run dev:web`
- Desktop workflow: `npm run dev`
- Production validation: `npm run build`
- Packaging workflow: `npm run dist:win`

## Current Scope

- Browser mode remains the fast path for renderer-only changes.
- Desktop mode is the validation path for Electron shell, preload bridge, and file-backed persistence work.
- The first desktop release targets a portable Windows artifact.

## Validated Command Baseline

- `npm run dev:web`: starts the browser-only Vite renderer on `127.0.0.1:4173`
- `npm run dev`: starts the Vite renderer, Electron TypeScript watch build, and Electron shell together
- `npm run build`: produces both `dist/` and `dist-electron/`
- `npm run dist:win`: produces the Windows packaging output under `release/`
- Browser continuity validation also expects the app shell to show `Runtime browser/web` when launched through `npm run dev:web`.

## Packaged Launch Validation

- Validated packaged-shell executable path: `release/win-unpacked/Tetris Specify Copilot.exe`
- Validated runtime/build identification shown in the app shell: `Runtime desktop/win32 v0.1.0`
- Validated startup measurement to visible game board: `979 ms`

## Troubleshooting Notes

- Browser tests and browser-only validation should use `npm run dev:web`; the desktop default `npm run dev` is no longer the correct web-server command for Playwright browser flows.
- If Electron launches without the Vite renderer in development, confirm `127.0.0.1:4173` is free and re-run `npm run dev`.
- Environment-specific cache warnings can appear during Electron launch on locked-down Windows setups; treat them separately from renderer boot failures unless they block the app window from opening.

## Desktop Smoke Flow

1. Run `npm run dev` and confirm the Electron window opens the game board.
2. Confirm the readiness strip shows `Runtime desktop/win32 v0.1.0`.
3. Run `npm run build` and then `npm run dist:win`.
4. Launch `release/win-unpacked/Tetris Specify Copilot.exe` and confirm the board becomes visible.
5. Use the packaged shell for startup-budget and offline-play validation.

## Browser Continuity Flow

1. Run `npm run dev:web` and open the Vite URL in a browser.
2. Confirm the readiness strip shows `Runtime browser/web`.
3. Run the browser regression slices with `npx playwright test tests/e2e/core-gameplay.spec.ts tests/e2e/session-persistence.spec.ts --project=chromium --reporter=line`.
4. Treat any failure that requires Electron-specific globals in this flow as a browser-regression bug, not a desktop-only issue.

## Follow-On Documentation

Later tasks will expand this guide with:

- best-score restart persistence validation
- rollback checkpoints for runtime and packaging work
