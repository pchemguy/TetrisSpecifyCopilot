# Developer Guide: Classic Browser Tetris

## Overview

This guide helps contributors set up, validate, and evolve the project.

## Shell Prerequisite

Windows users require Git Bash (for example, Git for Windows) or WSL; PowerShell is not supported.

## Related Docs

- [User Guide](./user-guide.md)
- [Reviewer Guide](./reviewer-guide.md)
- [Persistence Reference](./persistence-reference.md)

## Validated Command Baseline

Validated from [specs/002-project-docs/quickstart.md](../specs/002-project-docs/quickstart.md):

- `npm install`: install dependencies.
- `npm run dev`: run local app.
- `npm run lint` and `npm run test`: quality baseline.
- `npx playwright install chromium`: browser binary remediation and first-time setup.
- `npx playwright test tests/e2e/core-gameplay.spec.ts --project=chromium --reporter=line`
- `npx playwright test tests/e2e/hud-and-strategy.spec.ts --project=chromium --reporter=line`
- `npx playwright test tests/e2e/session-persistence.spec.ts --project=chromium --reporter=line`
- `npm run build`: production build validation.

## Terminology and Consistency Rules

- Canonical terms: tetromino, ghost piece, hold, hard drop, soft drop, pause/resume, best score.
- Cross-link targets: [User Guide](./user-guide.md), [Reviewer Guide](./reviewer-guide.md), [Persistence Reference](./persistence-reference.md).
- Keep command names, script names, and expected outcomes consistent with reviewer documentation.
