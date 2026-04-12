# Quickstart: Comprehensive Project Documentation

## Goal

Produce four professional Markdown documents for players, contributors, reviewers, and
maintainers while keeping all content aligned with current implementation behavior.

## Prerequisites

- Node.js 22 LTS or newer
- npm 10 or newer
- Bash shell
- Windows users require Git Bash (for example, Git for Windows) or WSL; PowerShell is not supported.

## Deliverables

Create these files under `docs/`:

- `docs/user-guide.md`
- `docs/developer-guide.md`
- `docs/reviewer-guide.md`
- `docs/persistence-reference.md`

## Authoring Workflow

1. Validate baseline setup:

```bash
npm install
```

2. Confirm app can run:

```bash
npm run dev
```

3. Confirm quality baseline:

```bash
npm run lint
npm run test
```

4. Confirm E2E command set used in docs:

```bash
npx playwright install chromium
npx playwright test tests/e2e/core-gameplay.spec.ts --project=chromium --reporter=line
npx playwright test tests/e2e/hud-and-strategy.spec.ts --project=chromium --reporter=line
npx playwright test tests/e2e/session-persistence.spec.ts --project=chromium --reporter=line
```

5. Confirm build path referenced in reviewer guide:

```bash
npm run build
```

## Document-Specific Minimum Content

- User Guide: setup, launch, controls, scoring table, persistence behavior, troubleshooting.
- Developer Guide: scripts reference, architecture overview, directory map, Mermaid data flow, testing strategy, quality rules.
- Reviewer Guide: numbered validation checklist, expected outcomes, offline verification steps.
- Persistence Reference: localStorage keys, SQLite table summaries, seed-data invariant, persistence failure behavior.

## Acceptance Checklist

- all four documents exist under `docs/`
- all command snippets are Bash and have been run successfully
- scoring values and control names match implementation exactly
- internal Markdown links resolve
- reviewer checklist is executable end-to-end in <= 30 minutes on a prepared machine
