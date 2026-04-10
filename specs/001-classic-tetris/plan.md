# Implementation Plan: Classic Browser Tetris

**Branch**: `001-prepare-spec-branch` | **Date**: 2026-04-11 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-classic-tetris/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build a fully client-side classic Tetris web application using TypeScript and React for
the application shell and HTML5 Canvas for gameplay rendering. The game engine will be a
deterministic TypeScript core driven by a fixed-timestep loop and command queue. User
settings and transient shell state will persist in localStorage, while structured game
history data such as sessions, scores, and replay records will be stored in a SQLite
database running in the browser via WebAssembly and persisted locally through IndexedDB.

## Technical Context

**Language/Version**: TypeScript 5.x, React 19  
**Primary Dependencies**: React, Vite, HTML5 Canvas API, sql.js (SQLite WASM), Vitest, React Testing Library, Playwright  
**Storage**: localStorage for user settings and transient UI state; SQLite WASM database binary persisted in IndexedDB for sessions, scores, and replay records  
**Testing**: Vitest for engine and persistence logic, React Testing Library for UI integration, Playwright for end-to-end desktop gameplay validation  
**Target Platform**: Modern desktop browsers with WebAssembly and IndexedDB support (latest Chrome, Edge, Firefox, Safari desktop)  
**Project Type**: client-side single-page web application  
**Performance Goals**: visible response to 95% of gameplay inputs within 100 ms; maintain 60 FPS rendering target during active play on baseline desktop hardware; local first paint with seeded data in under 2 seconds on warm cache  
**Constraints**: no backend or network dependency; deterministic engine behavior for replayability; keyboard-first desktop controls; local-only persistence; offline-capable after initial asset load  
**Scale/Scope**: single-player local game, one active session at a time, local history for scores/sessions/replays, 10x20 visible board with side-panel HUD

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Code Quality Gate: Enforce `tsc --noEmit`, ESLint, and test suite pass in CI/local validation. Keep gameplay rules in pure TypeScript modules separated from React and Canvas orchestration so engine behavior remains reviewable and refactorable.
- Testing Gate: Add engine unit tests for piece generation, movement, rotation, locking, line clear, scoring, level progression, pause/resume, hold logic, and replay determinism. Add integration tests for React shell plus storage hydration. Add persistence contract tests for localStorage keys and SQLite schema access. Add Playwright coverage for desktop play, pause/restart, and persisted best score.
- UX Consistency Gate: Use a stable single-screen layout with canvas playfield, side information panels, keyboard legend, and clear paused/game-over overlays. Preserve consistent terminology across HUD, overlays, and seeded demo content. Ensure keyboard focus does not trap gameplay and paused/game-over states remain obvious.
- Performance Gate: Use a fixed-step deterministic update loop with `requestAnimationFrame` rendering, precomputed tetromino matrices, and asynchronous persistence flushes outside the hot input path. Verify input-to-render latency with browser performance markers and validate a 15-minute play soak locally.
- Decision Traceability Gate: Record the reasons for choosing Canvas over DOM rendering, SQLite WASM over plain IndexedDB/localStorage, and a pure client architecture over service-backed persistence. Document rejected simpler alternatives in `research.md` and retain those decisions in code comments only where behavior would otherwise be ambiguous.

## Project Structure

### Documentation (this feature)

```text
specs/001-classic-tetris/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── client-interfaces.md
└── tasks.md
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── App.tsx
│   ├── providers/
│   └── state/
├── components/
│   ├── hud/
│   ├── overlays/
│   └── controls/
├── canvas/
│   ├── GameCanvas.tsx
│   └── renderer/
├── engine/
│   ├── commands/
│   ├── core/
│   ├── rules/
│   └── replay/
├── persistence/
│   ├── local-storage/
│   ├── sqlite/
│   └── seed/
├── styles/
├── types/
└── main.tsx

public/
└── wasm/

tests/
├── contract/
├── e2e/
├── integration/
└── unit/
```

**Structure Decision**: Use a single-project SPA structure because the feature has no backend and benefits from keeping the deterministic engine, Canvas renderer, persistence adapters, and React shell in one deployable client bundle. The separation above keeps core rules isolated from UI code and persistence code while still allowing shared TypeScript types across the application.

## Complexity Tracking

No constitution violations are currently identified. Chosen complexity is justified by explicit product requirements for deterministic replay support and browser-resident SQLite persistence.
