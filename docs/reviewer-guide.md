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
