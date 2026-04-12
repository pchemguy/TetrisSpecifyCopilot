# TetrisSpecifyCopilot Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-04-12

## Active Technologies

- TypeScript 5.x, React 19, Vite, HTML5 Canvas API, sql.js (SQLite WASM), Vitest, React Testing Library, Playwright (001-prepare-spec-branch)

## Project Structure

```text
public/
specs/
src/
tests/
```

## Commands

npm run lint && npm run test && npx playwright test tests/e2e/core-gameplay.spec.ts --project=chromium --reporter=line && npx playwright test tests/e2e/hud-and-strategy.spec.ts --project=chromium --reporter=line && npx playwright test tests/e2e/session-persistence.spec.ts --project=chromium --reporter=line

## Code Style

TypeScript 5.x, React 19: Follow standard conventions

## Recent Changes

- 001-prepare-spec-branch: Added TypeScript 5.x, React 19 + React, Vite, HTML5 Canvas API, sql.js (SQLite WASM), Vitest, React Testing Library, Playwright

<!-- MANUAL ADDITIONS START -->
- Install browser binaries before running end-to-end validation: `npx playwright install chromium`
- Validate as a local-only app: after the first asset load, repeat the final Playwright pass with browser networking disabled and expect gameplay plus persistence to keep working.
- Seeded demo rows are reviewer-only fixtures. They must never overwrite the player best score.
<!-- MANUAL ADDITIONS END -->
