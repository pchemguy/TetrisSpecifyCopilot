# Reviewer Guide: Classic Browser Tetris

## Overview

This guide provides a linear checklist to validate the implementation.

## Shell Prerequisite

Windows users require Git Bash (for example, Git for Windows) or WSL; PowerShell is not supported.

## Related Docs

- [User Guide](./user-guide.md)
- [Developer Guide](./developer-guide.md)
- [Persistence Reference](./persistence-reference.md)

## Validated Command Baseline

Validated from [specs/002-project-docs/quickstart.md](../specs/002-project-docs/quickstart.md):

- Use Bash commands only.
- Validate install (`npm install`) and app start (`npm run dev`).
- Validate quality baseline (`npm run lint`, `npm run test`).
- Include Playwright remediation (`npx playwright install chromium`) before E2E if binaries are missing.
- Validate E2E with the three scoped Playwright commands from quickstart.
- Validate final build with `npm run build`.

## Terminology and Consistency Rules

- Canonical terms: tetromino, ghost piece, hold, hard drop, soft drop, pause/resume, best score.
- Cross-link targets: [User Guide](./user-guide.md), [Developer Guide](./developer-guide.md), [Persistence Reference](./persistence-reference.md).
- Reviewer wording must stay aligned with command names and outcomes documented in developer guidance.

## Reviewer Checklist

1. Verify prerequisites are met.
2. Install project dependencies.
3. Start the application locally.
4. Run gameplay smoke checks.
5. Verify persistence behavior after reload.
6. Run lint and unit/integration tests.
7. Run scoped E2E tests.
8. Run build validation.
9. Verify offline behavior after initial load.
10. Record results and sign off or open corrections.

Checklist constraints:

- Top-level steps must remain at or below 12.
- Each step should stay concise and map to one or more commands or observable outcomes.
- Reviewers should be able to execute the full flow in under 30 minutes on a prepared machine.

## Validation Commands and Expected Outcomes

### Install and Start

```bash
npm install
npm run dev
```

Expected outcome: dependencies install successfully and Vite prints a local URL.

### Quality Baseline

```bash
npm run lint
npm run test
```

Expected outcome: both commands exit with code 0.

### End-to-End Validation

```bash
npx playwright test tests/e2e/core-gameplay.spec.ts --project=chromium --reporter=line
npx playwright test tests/e2e/hud-and-strategy.spec.ts --project=chromium --reporter=line
npx playwright test tests/e2e/session-persistence.spec.ts --project=chromium --reporter=line
```

Expected outcome: all three specs pass with no unexpected failures.

### Build Validation

```bash
npm run build
```

Expected outcome: production build completes without errors.

## Verified Command Outcomes (Current Baseline)

The latest command-validation pass produced these results:

- `npm run lint`: completed without reported lint failures.
- `npm run test`: `12` test files passed and `39` tests passed.
- `npx playwright install chromium`: completed successfully.
- `core-gameplay.spec.ts`: `1 passed`.
- `hud-and-strategy.spec.ts`: `1 passed`.
- `session-persistence.spec.ts`: `2 passed`.
- `npm run build`: completed successfully and produced `dist/` build artifacts.

## Playwright Browser Remedy

If Playwright cannot launch Chromium because browser binaries are missing, run:

```bash
npx playwright install chromium
```

Then re-run the E2E commands listed in this guide.

## Offline Verification

1. Launch the app while online and wait for first render.
2. Open browser DevTools and set network to offline.
3. Perform gameplay smoke actions and verify behavior continues.
4. Reload and verify local persistence behavior remains understandable from the docs.

## Failed-Command Exception Workflow

1. Capture the exact failing command and output.
2. Mark the affected review step as not verified.
3. Open or update a correction issue linked to the failing command.
4. Re-run only the corrected validation step, then resume the remaining checklist.
5. Do not sign off until all required steps are verified.
