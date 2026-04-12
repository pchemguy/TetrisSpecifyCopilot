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
