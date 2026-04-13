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

## Contributor Smoke Checklist

- [ ] Run `npm run dev:web` and confirm the browser shell shows `Runtime browser/web`.
- [ ] Run `npm run dev` and confirm the Electron shell shows `Runtime desktop/win32 v0.1.0` on the current Windows review machine.
- [ ] Run `npm run build` and confirm both `dist/` and `dist-electron/` are produced.
- [ ] Run `npm run dist:win` and confirm `release/win-unpacked/Tetris Specify Copilot.exe` launches.
- [ ] Re-run the browser regression slice before closing a change that touched shared renderer code.

## Current Scope

- Browser mode remains the fast path for renderer-only changes.
- Desktop mode is the validation path for Electron shell, preload bridge, and file-backed persistence work.
- The first desktop release targets a portable Windows artifact.

## Windows-First Limits And Future Extension Points

- Current limit: this guide validates Windows-first workflows only; it does not define packaging or support steps for macOS or Linux reviewers yet.
- Current limit: desktop restart persistence is intentionally scoped to best score only in the first release.
- Extension point: the renderer, persistence adapters, and runtime detection are already split so later platform targets can reuse the shared browser and desktop boundaries.

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
- If the browser workflow fails after desktop changes, re-run `npm run dev:web` and the browser Playwright slice before changing Electron code; shared-renderer regressions should be isolated there first.

## Desktop Smoke Flow

1. Run `npm run dev` and confirm the Electron window opens the game board.
2. Confirm the readiness strip shows `Runtime desktop/win32 v0.1.0`.
3. Run `npm run build` and then `npm run dist:win`.
4. Launch `release/win-unpacked/Tetris Specify Copilot.exe` and confirm the board becomes visible.
5. Use the packaged shell for startup-budget and offline-play validation.
6. If the packaged shell fails after a desktop-only change, fall back to `npm run build` and `npm run build:electron` separately before editing shared renderer code.

## Browser Continuity Flow

1. Run `npm run dev:web` and open the Vite URL in a browser.
2. Confirm the readiness strip shows `Runtime browser/web`.
3. Run the browser regression slices with `npx playwright test tests/e2e/core-gameplay.spec.ts tests/e2e/session-persistence.spec.ts --project=chromium --reporter=line`.
4. Treat any failure that requires Electron-specific globals in this flow as a browser-regression bug, not a desktop-only issue.

## Final Command Set

- Browser development: `npm run dev:web`
- Desktop development: `npm run dev`
- Shared build: `npm run build`
- Desktop package: `npm run dist:win`
- Browser regression slice: `npx playwright test tests/e2e/core-gameplay.spec.ts tests/e2e/session-persistence.spec.ts --project=chromium --reporter=line`

## Follow-On Documentation

Later tasks will expand this guide with:

- best-score restart persistence validation
- rollback checkpoints for runtime and packaging work
