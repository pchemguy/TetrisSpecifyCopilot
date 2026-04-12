# Documentation Interfaces Contract: Comprehensive Project Documentation

## 1. Audience Interface Contract

The documentation set exposes four audience-specific entry points:

| Audience | Document | Primary Outcome |
| -------- | -------- | --------------- |
| Player | `docs/user-guide.md` | Install, launch, play, and troubleshoot the game quickly |
| Contributor | `docs/developer-guide.md` | Understand architecture, run toolchain, and contribute safely |
| Reviewer | `docs/reviewer-guide.md` | Execute full validation workflow in one linear pass |
| Maintainer | `docs/persistence-reference.md` | Modify persistence confidently without data integrity regressions |

Contract rules:

- each audience document must be self-contained for its primary journey
- each document must link to related documents only where cross-audience context is needed
- all docs must use consistent terminology and control names

## 2. Command Interface Contract

All shell examples are Bash syntax only.

Mandatory prerequisite statement for command-bearing docs:

> Windows users require Git Bash (for example, Git for Windows) or WSL; PowerShell is not supported.

Required command coverage:

- setup: `npm install`
- local run: `npm run dev`
- quality checks: `npm run lint`, `npm run test`
- e2e checks: Playwright commands for core gameplay, HUD/strategy, and session persistence specs
- build validation: `npm run build`

Command rules:

- every listed command must run successfully in a clean repository state
- expected outcomes must be described in plain language near the command
- no hidden prerequisites beyond those documented

## 3. Content Consistency Contract

Required canonical terms:

- tetromino
- ghost piece
- hold
- hard drop
- soft drop
- pause/resume
- best score

Scoring contract (must match runtime):

- single: `100 × level`
- double: `300 × level`
- triple: `500 × level`
- tetris: `800 × level`
- soft drop: `+1` per row
- hard drop: `+2` per row
- no combo bonuses

## 4. Structure Contract

File placement is fixed:

- `docs/user-guide.md`
- `docs/developer-guide.md`
- `docs/reviewer-guide.md`
- `docs/persistence-reference.md`

Planning artifacts remain in `specs/002-project-docs/`.

## 5. Verification Contract

Minimum verification pass before completion:

1. Read-through for section completeness against the current approved specification, including `FR-001` through `FR-027` and `NFR-001` through `NFR-005`.
2. Command run-through for all command blocks, including the Playwright browser installation remedy path when browser binaries are missing.
3. Terminology and scoring consistency sweep across all four docs.
4. Broken-link sweep for internal Markdown links.
5. Reviewer checklist dry run duration check (target <= 30 minutes), including verification that the checklist remains within the 12-step cap and that failed-command exception handling is documented.

## 6. Failure Handling Contract

If a command fails during doc verification:

- document must be updated or command removed before acceptance
- affected sections are marked draft until revalidated
- reviewer guide must not claim successful validation for failing command paths

If implementation and docs conflict:

- implementation is treated as source of truth
- documentation must be corrected before merge
