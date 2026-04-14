# Reviewer Guide: Classic Browser Tetris

## Overview

This guide provides a linear review flow for the current browser and Windows desktop deliverable.

## Supported Review Environment

- Windows 11
- Git Bash on `PATH`
- Node.js 22 LTS or newer
- npm 10 or newer

Use Bash commands only.

## Related Docs

- [User Guide](./user-guide.md)
- [Developer Guide](./developer-guide.md)
- [Windows Development Workflow](./windows-development.md)
- [Persistence Reference](./persistence-reference.md)

## Reviewer Checklist

1. Install dependencies and Playwright Chromium.
2. Validate browser mode with `npm run dev:web`.
3. Validate desktop development mode with `npm run dev`.
4. Validate browser continuity and persistence behavior.
5. Validate desktop restart persistence and warning behavior.
6. Run lint, tests, and build.
7. Run the browser and desktop Playwright slices.
8. Build the portable Windows artifact.
9. Record pass or failure with the exact failing command if any step breaks.

## Validation Commands

### Install And Browser Setup

```bash
npm install
npx playwright install chromium
```

### Browser Runtime Validation

```bash
npm run dev:web
```

Expected outcome:

- Vite serves `http://127.0.0.1:4173`
- the app shows `Runtime browser/web`
- gameplay is responsive in a desktop browser

### Desktop Runtime Validation

```bash
npm run dev
```

Expected outcome:

- the Electron shell launches without a separate browser step
- the app shows `Runtime desktop/win32 v0.1.0` on the current validated machine
- the game remains playable after networking is disabled post-load

### Quality Baseline

```bash
npm run lint
npm run test
npm run build
```

Expected outcome: all three commands exit successfully.

### Playwright Validation

```bash
npx playwright test tests/e2e/core-gameplay.spec.ts --project=chromium --reporter=line
npx playwright test tests/e2e/session-persistence.spec.ts --project=chromium --reporter=line
npx playwright test tests/e2e/desktop-shell.spec.ts --project=chromium --reporter=line
```

Expected outcome:

- browser gameplay regression passes
- browser reload and offline continuity pass
- desktop shell launch and offline continuity pass
- desktop best-score relaunch persistence passes

### Portable Packaging Validation

```bash
npm run dist:win
```

Expected outcome:

- `release/Tetris Specify Copilot-0.1.0-portable.exe` exists
- `release/win-unpacked/Tetris Specify Copilot.exe` exists

## Manual Runtime Checks

### Browser Continuity

1. Launch `npm run dev:web`.
2. Start a short game.
3. Reload and confirm best score remains visible.
4. Disable network after initial load and confirm gameplay still works.

### Desktop Persistence And Recovery

1. Launch `npm run dev`.
2. Reach a non-zero best score.
3. Close the Electron app fully.
4. Relaunch and confirm the best score is still visible.
5. If testing recovery behavior, corrupt or remove the desktop database file and confirm a persistence warning appears while gameplay still loads.

## If A Step Fails

1. Record the exact command and output.
2. Record whether the failure is browser-only, desktop-only, or shared.
3. Do not sign off until the failing step has been corrected and re-run.
