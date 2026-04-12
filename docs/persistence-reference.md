# Persistence Reference: Classic Browser Tetris

## Overview

This guide documents browser persistence details for maintainers.

## Shell Prerequisite

Windows users require Git Bash (for example, Git for Windows) or WSL; PowerShell is not supported.

## Related Docs

- [User Guide](./user-guide.md)
- [Developer Guide](./developer-guide.md)
- [Reviewer Guide](./reviewer-guide.md)

## Source-of-Truth Baseline

Validated from [specs/002-project-docs/research.md](../specs/002-project-docs/research.md):

- Persistence references must reflect runtime behavior, not aspirational design.
- Seeded demo data is inserted for reviewer visibility only.
- Seeded demo data must not replace or corrupt player best score state.

## Terminology and Consistency Rules

- Canonical terms: tetromino, ghost piece, hold, hard drop, soft drop, pause/resume, best score.
- Cross-link targets: [User Guide](./user-guide.md), [Developer Guide](./developer-guide.md), [Reviewer Guide](./reviewer-guide.md).
- Persistence wording must remain aligned with player and reviewer descriptions of best-score behavior.
