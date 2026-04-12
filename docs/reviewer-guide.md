# Reviewer Guide: Classic Tetris Desktop

## Overview

This guide provides a linear checklist to validate the desktop implementation and its release-gate behavior.

## Shell Prerequisite

Windows users require Git Bash (for example, Git for Windows) or WSL; PowerShell is not supported.

## Related Docs

- [User Guide](./user-guide.md)
- [Developer Guide](./developer-guide.md)
- [Persistence Reference](./persistence-reference.md)
- [Packaging Guide](./packaging/packaging.md)

## Release-Gate Status

- Last full quickstart acceptance pass: 2026-04-12
- Status: pass

## Validated Command Baseline

Validated from [specs/003-windows-desktop-packaging/quickstart.md](../specs/003-windows-desktop-packaging/quickstart.md):

- Use Bash commands only.
- Validate install (`npm install`) and desktop start (`npm run tauri dev`) when reviewing from source.
- Validate quality baseline (`npm run lint`, `npm run test`, `cargo test --manifest-path src-tauri/Cargo.toml`).
- Include Playwright remediation (`npx playwright install chromium`) before E2E if binaries are missing.
- Validate browser regression with the three scoped Playwright commands from the repo instructions.
- Validate desktop packaging with `npm run tauri build`.
- Validate offline desktop-local behavior with `portable-desktop-offline.spec.ts`.

## Terminology and Consistency Rules

- Canonical terms: tetromino, ghost piece, hold, hard drop, soft drop, pause/resume, best score.
- Cross-link targets: [User Guide](./user-guide.md), [Developer Guide](./developer-guide.md), [Persistence Reference](./persistence-reference.md), [Packaging Guide](./packaging/packaging.md).
- Reviewer wording must stay aligned with command names and outcomes documented in developer guidance.

## Reviewer Checklist

1. Verify prerequisites are met.
2. Install project dependencies.
3. Start the application locally in the desktop runtime.
4. Verify startup keeps the best-score panel hidden until a completed game exists.
5. Verify strict new-best behavior and relaunch persistence.
6. Run lint, frontend tests, and native Rust tests.
7. Run scoped browser regression E2E tests.
8. Run desktop packaging validation.
9. Run offline desktop smoke validation.
10. Record results and sign off or open corrections.

Checklist constraints:

- Top-level steps must remain at or below 12.
- Each step should stay concise and map to one or more commands or observable outcomes.
- Reviewers should be able to execute the full flow in under 30 minutes on a prepared machine.

## Validation Commands and Expected Outcomes

### Install and Start

```bash
npm install
npm run tauri dev
```

Expected outcome: dependencies install successfully, the frontend dev server starts, and the Tauri window opens.

### Quality Baseline

```bash
npm run lint
npm run test
cargo test --manifest-path src-tauri/Cargo.toml
```

Expected outcome: all three commands exit with code 0.

### Browser Regression Validation

```bash
npx playwright test tests/e2e/core-gameplay.spec.ts --project=chromium --reporter=line
npx playwright test tests/e2e/hud-and-strategy.spec.ts --project=chromium --reporter=line
npx playwright test tests/e2e/session-persistence.spec.ts --project=chromium --reporter=line
```

Expected outcome: all three specs pass with no unexpected failures.

### Desktop Packaging Validation

```bash
npm run tauri build
npx playwright test tests/e2e/portable-desktop-offline.spec.ts --project=chromium --reporter=line
```

Expected outcome: the desktop bundle is produced successfully and the offline smoke spec passes.

## Verified Command Outcomes (Current Baseline)

The latest validated pass produced these results:

- `npm run lint`: completed without reported lint failures.
- `npm run test`: `15` test files passed and `44` tests passed.
- `cargo test --manifest-path src-tauri/Cargo.toml`: all native unit and contract suites passed.
- `core-gameplay.spec.ts`: `1 passed`.
- `hud-and-strategy.spec.ts`: `1 passed`.
- `session-persistence.spec.ts`: `2 passed`.
- `portable-desktop-offline.spec.ts`: `1 passed`.
- `npm run tauri build`: completed successfully and produced desktop release and bundle artifacts.

## Playwright Browser Remedy

If Playwright cannot launch Chromium because browser binaries are missing, run:

```bash
npx playwright install chromium
```

Then re-run the E2E commands listed in this guide.

## Manual Persistence Checks

Use these observations while the app is open:

1. Start with no desktop best-score record and confirm the best-score panel is hidden.
2. Finish one game and confirm the panel becomes eligible to appear on the next startup.
3. Finish a later game with a strictly greater score and confirm the congratulations message appears.
4. Finish a game with an equal or lower score and confirm the stored best score does not change.

## Offline Verification

1. Launch the app while online and wait for first render.
2. Disable browser networking after the initial asset load.
3. Perform gameplay smoke actions and verify behavior continues.
4. Confirm the app does not invent a visible best score before any completed game exists.

## Failed-Command Exception Workflow

1. Capture the exact failing command and output.
2. Mark the affected review step as not verified.
3. Open or update a correction issue linked to the failing command.
4. Re-run only the corrected validation step, then resume the remaining checklist.
5. Do not sign off until all required steps are verified.
