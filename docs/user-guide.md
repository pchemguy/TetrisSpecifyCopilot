# User Guide: Classic Browser Tetris

## Overview

This guide helps players install, run, and play Classic Browser Tetris.

## Shell Prerequisite

Windows users require Git Bash (for example, Git for Windows) or WSL; PowerShell is not supported.

## Related Docs

- [Developer Guide](./developer-guide.md)
- [Reviewer Guide](./reviewer-guide.md)
- [Persistence Reference](./persistence-reference.md)

## Source-of-Truth Baseline

Validated from [specs/002-project-docs/research.md](../specs/002-project-docs/research.md):

- Controls: desktop keyboard mapping is authoritative and must match runtime behavior.
- Scoring: line clears use classic values (single 100x level, double 300x level, triple 500x level, tetris 800x level), plus soft drop +1/row and hard drop +2/row.
- Seed data: first-run seeded demo records are for review visibility and must never overwrite player best score behavior.

## Terminology and Consistency Rules

- Canonical terms: tetromino, ghost piece, hold, hard drop, soft drop, pause/resume, best score.
- Cross-link targets: [Developer Guide](./developer-guide.md), [Reviewer Guide](./reviewer-guide.md), [Persistence Reference](./persistence-reference.md).
- Use canonical terms consistently and avoid alternate naming for the same in-game concept.
