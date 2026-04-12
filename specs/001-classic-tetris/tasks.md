---

description: "Task list for Classic Browser Tetris implementation"
---

# Tasks: Classic Browser Tetris

**Input**: Design documents from `/specs/001-classic-tetris/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/client-interfaces.md

**Tests**: Test tasks are REQUIRED whenever behavior changes. Each user story includes the tasks needed to prove the story independently at the unit, integration, contract, or end-to-end level.

**Organization**: Tasks are grouped by user story so each story can be implemented, tested, and validated independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel when they touch different files and have no unmet dependencies
- **[Story]**: Which user story this task belongs to (`US1`, `US2`, `US3`)
- Every task includes exact file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the client-only TypeScript/React application and project tooling.

- [x] T001 Create the client application scaffold and scripts in `package.json`, `tsconfig.json`, `vite.config.ts`, `vitest.config.ts`, `playwright.config.ts`, and `index.html`
- [x] T002 Create the application entrypoint and base shell in `src/main.tsx`, `src/app/App.tsx`, and `src/styles/app.css`
- [x] T003 [P] Configure linting and editor rules in `eslint.config.js`, `.editorconfig`, and `package.json`
- [x] T004 [P] Configure shared test setup files in `tests/setup/vitest.setup.ts`, `tests/setup/renderWithProviders.tsx`, and `tests/e2e/fixtures.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Implement the core architecture every user story depends on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [x] T005 Define shared gameplay and persistence types in `src/types/game.ts`, `src/types/persistence.ts`, and `src/types/replay.ts`
- [x] T006 [P] Implement tetromino definitions, SRS kick data, and 7-bag randomization in `src/engine/rules/tetrominoes.ts`, `src/engine/rules/rotation.ts`, and `src/engine/rules/randomizer.ts`
- [x] T007 [P] Implement the deterministic tick loop, immutable game state, and command queue in `src/engine/core/gameState.ts`, `src/engine/core/gameEngine.ts`, and `src/engine/commands/commandQueue.ts`
- [x] T008 [P] Implement browser SQLite bootstrap and schema management in `src/persistence/sqlite/database.ts` and `src/persistence/sqlite/schema.ts`
- [x] T009 [P] Implement localStorage adapters for settings and transient UI state in `src/persistence/local-storage/settingsStore.ts` and `src/persistence/local-storage/uiStateStore.ts`
- [x] T010 Implement seeded demo-data hydration and persistence providers in `src/persistence/seed/demoData.ts`, `src/persistence/seed/seedDatabase.ts`, and `src/app/providers/PersistenceProvider.tsx`
- [x] T011 Build the shared canvas renderer baseline and HUD shell layout in `src/canvas/GameCanvas.tsx`, `src/canvas/renderer/boardRenderer.ts`, and `src/components/hud/HudLayout.tsx`

**Checkpoint**: Foundation complete. User stories can now be implemented and validated independently.

---

## Phase 3: User Story 1 - Play a Complete Tetris Run (Priority: P1) 🎯 MVP

**Goal**: Deliver the full playable loop: spawn, move, rotate, drop, lock, clear lines, score, level up, speed up, and end the game when the board tops out.

**Independent Test**: Start a fresh game, place at least 20 tetrominoes with keyboard controls, clear lines, observe score and speed changes, and continue until game over.

### Tests for User Story 1 ⚠️

> **NOTE**: Write these tests first and confirm they fail before implementation.

- [x] T012 [P] [US1] Add engine rule tests for movement, collision, rotation, 500-millisecond lock delay, lock-reset limits, same-tick hard-drop/pause/hold precedence, and line clearing in `tests/unit/engine/game-engine.spec.ts`
- [x] T013 [P] [US1] Add scoring-table and gravity-progression tests in `tests/unit/engine/scoring-leveling.spec.ts`
- [x] T014 [P] [US1] Add app integration coverage for keyboard-driven core gameplay in `tests/integration/app/core-gameplay.spec.tsx`
- [x] T015 [P] [US1] Add browser end-to-end coverage for a playable run to game over in `tests/e2e/core-gameplay.spec.ts`

### Implementation for User Story 1

- [x] T016 [US1] Implement spawn, gravity, 500-millisecond lock delay, lock-reset limits, deterministic hard-drop/pause/hold precedence at lock time, and top-out handling in `src/engine/core/gameState.ts` and `src/engine/core/gameEngine.ts`
- [x] T017 [US1] Implement left/right movement, rotation, soft drop, and hard drop commands in `src/engine/commands/gameCommands.ts` and `src/engine/rules/collision.ts`
- [x] T018 [US1] Implement the explicit line-clear scoring table, drop bonuses, level thresholds, and 15%-per-level gravity curve in `src/engine/rules/scoring.ts` and `src/engine/rules/leveling.ts`
- [x] T019 [US1] Wire the deterministic engine loop into the React shell in `src/app/state/useGameSession.ts`, `src/app/App.tsx`, and `src/canvas/GameCanvas.tsx`
- [x] T020 [US1] Render the board, active piece, locked stack, and game-over overlay in `src/canvas/renderer/boardRenderer.ts`, `src/canvas/renderer/pieceRenderer.ts`, and `src/components/overlays/GameOverOverlay.tsx`
- [x] T021 [US1] Implement desktop keyboard input capture and focus-safe gameplay controls in `src/components/controls/KeyboardInputHandler.tsx` and `src/app/App.tsx`
- [x] T022 [US1] Instrument and verify core gameplay input latency in `src/engine/core/performance.ts` and `src/canvas/GameCanvas.tsx`

**Checkpoint**: User Story 1 is fully playable and testable as an MVP.

---

## Phase 4: User Story 2 - Track Progress and Make Decisions (Priority: P2)

**Goal**: Add strategic game information and planning features: ghost piece, next preview, hold slot, and a live HUD for score, level, and cleared lines.

**Independent Test**: Play a run that uses hold, confirms next preview changes, shows ghost landing, and demonstrates HUD updates during line clears and level progression.

### Tests for User Story 2 ⚠️

- [x] T023 [P] [US2] Add rule tests for ghost projection, next queue behavior, hold-slot restrictions, and hold rejection after lock commit in `tests/unit/engine/preview-and-hold.spec.ts`
- [x] T024 [P] [US2] Add integration tests for HUD synchronization and preview panels in `tests/integration/app/hud-panels.spec.tsx`
- [x] T025 [P] [US2] Add browser end-to-end coverage for hold, preview, and speed-up behavior in `tests/e2e/hud-and-strategy.spec.ts`

### Implementation for User Story 2

- [x] T026 [US2] Implement ghost-piece projection and next-piece queue selectors in `src/engine/rules/ghostPiece.ts` and `src/engine/core/selectors.ts`
- [x] T027 [US2] Implement hold-slot state and once-per-turn hold enforcement in `src/engine/rules/holdPiece.ts` and `src/engine/core/gameEngine.ts`
- [x] T028 [US2] Render score, level, lines, next piece, and held piece panels in `src/components/hud/ScorePanel.tsx`, `src/components/hud/PreviewPanel.tsx`, `src/components/hud/HoldPanel.tsx`, and `src/components/hud/HudLayout.tsx`
- [x] T029 [US2] Render ghost-piece visuals and gameplay-side styling in `src/canvas/renderer/pieceRenderer.ts` and `src/styles/game.css`
- [x] T030 [US2] Add the controls legend and descriptive gameplay labels in `src/components/controls/ControlLegend.tsx` and `src/app/App.tsx`
- [x] T031 [US2] Validate desktop layout consistency and HUD readability in `src/styles/layout.css` and `src/components/hud/HudLayout.tsx`

**Checkpoint**: User Stories 1 and 2 work together, and the game exposes the full strategic desktop HUD.

---

## Phase 5: User Story 3 - Pause, Resume, Restart, and Return (Priority: P3)

**Goal**: Add session controls, local persistence, best-score retention, seeded demo data, and structured local history via SQLite WASM.

**Independent Test**: Pause and resume an active game, restart from paused and game-over states, record a new best score, reload the page, and confirm that persisted settings and best-score data return correctly.

### Tests for User Story 3 ⚠️

- [x] T032 [P] [US3] Add unit tests for pause/resume, restart, best-score state behavior, and pause freezing the remaining lock delay before lock commit in `tests/unit/engine/session-controls.spec.ts` and `tests/unit/persistence/best-score-store.spec.ts`
- [x] T033 [P] [US3] Add contract tests for localStorage keys and SQLite schema/read-write behavior in `tests/contract/local-storage.contract.spec.ts` and `tests/contract/sqlite.contract.spec.ts`
- [x] T034 [P] [US3] Add integration coverage for persistence hydration and seeded demo state in `tests/integration/app/persistence-hydration.spec.tsx`
- [x] T035 [P] [US3] Add browser end-to-end coverage for pause/resume, restart, reload, persisted best score, and locally stored session/score/replay records in `tests/e2e/session-persistence.spec.ts`

### Implementation for User Story 3

- [x] T036 [US3] Implement pause, resume, restart, lock-delay freeze/resume handling, and overlay transitions in `src/engine/commands/sessionCommands.ts`, `src/components/overlays/PauseOverlay.tsx`, and `src/app/state/useGameSession.ts`
- [x] T037 [US3] Implement best-score storage plus settings and UI-state persistence in `src/persistence/local-storage/bestScoreStore.ts`, `src/persistence/local-storage/settingsStore.ts`, and `src/persistence/local-storage/uiStateStore.ts`
- [x] T038 [US3] Implement SQLite repositories for sessions, scores, and replays in `src/persistence/sqlite/sessionRepository.ts`, `src/persistence/sqlite/scoreRepository.ts`, and `src/persistence/sqlite/replayRepository.ts`
- [x] T039 [US3] Implement deterministic replay recording and demo-data seeding orchestration for local-only storage without a replay browser UI in `src/engine/replay/replayRecorder.ts`, `src/persistence/seed/seedDatabase.ts`, and `src/app/providers/PersistenceProvider.tsx`
- [x] T040 [US3] Surface best-score display, persistence status, and non-blocking storage warnings in `src/components/hud/BestScorePanel.tsx`, `src/components/overlays/PersistenceWarning.tsx`, and `src/app/App.tsx`
- [x] T041 [US3] Verify long-session pause/reload behavior, offline-capable local persistence, and local-only performance in `src/engine/core/performance.ts` and `tests/e2e/session-persistence.spec.ts`

**Checkpoint**: All user stories are independently functional, persistent, and replayable on the client.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Finish cross-story quality work and final validation.

- [x] T042 [P] Update developer and reviewer guidance in `specs/001-classic-tetris/quickstart.md` and `.github/copilot-instructions.md`
- [x] T043 Refactor shared gameplay and persistence seams for maintainability in `src/engine/core/gameEngine.ts`, `src/app/state/useGameSession.ts`, and `src/persistence/sqlite/database.ts`
- [x] T044 [P] Add regression coverage for replay determinism and performance-budget enforcement in `tests/unit/engine/replay.spec.ts` and `tests/integration/app/performance-budget.spec.tsx`
- [ ] T045 [P] Run final desktop validation for quickstart, UX consistency, seeded data behavior, and no-network runtime operation in `tests/e2e/core-gameplay.spec.ts`, `tests/e2e/hud-and-strategy.spec.ts`, and `tests/e2e/session-persistence.spec.ts`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies. Start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion. Blocks all story work.
- **User Story 1 (Phase 3)**: Depends on Foundational completion.
- **User Story 2 (Phase 4)**: Depends on Foundational completion and integrates with User Story 1 engine outputs.
- **User Story 3 (Phase 5)**: Depends on Foundational completion and persists state produced by the earlier stories.
- **Polish (Phase 6)**: Depends on completion of the desired user stories.

### User Story Dependencies

- **US1**: No dependency on other stories after foundation. This is the MVP.
- **US2**: Depends on US1 gameplay state and renderer hooks, but remains independently testable once integrated.
- **US3**: Depends on US1 session state and benefits from US2 HUD panels for surfacing persisted history.

### Within Each User Story

- Write tests first and verify they fail before implementation.
- Implement engine or persistence rules before wiring UI components that depend on them.
- Wire rendering and UX after the underlying state model is stable.
- Complete performance and UX validation before closing the story.

### Parallel Opportunities

- T003 and T004 can run in parallel after T001.
- T006 through T009 can run in parallel after T005.
- Within each user story, unit, integration, and end-to-end tests marked `[P]` can be written in parallel.
- HUD component tasks in US2 can proceed in parallel with ghost/hold rule work once selectors exist.
- Persistence repository work and localStorage work in US3 can proceed in parallel after the foundational schema and types are in place.

---

## Parallel Example: User Story 1

```bash
# Write core gameplay tests in parallel:
Task: "Add engine rule tests in tests/unit/engine/game-engine.spec.ts"
Task: "Add scoring and level-progression tests in tests/unit/engine/scoring-leveling.spec.ts"
Task: "Add browser end-to-end coverage in tests/e2e/core-gameplay.spec.ts"

# Implement core gameplay building blocks in parallel where file ownership allows:
Task: "Implement movement and drop commands in src/engine/commands/gameCommands.ts"
Task: "Implement line clearing and leveling in src/engine/rules/scoring.ts and src/engine/rules/leveling.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Setup and Foundational phases.
2. Deliver User Story 1 as the first playable milestone.
3. Validate keyboard-first gameplay, line clearing, scoring, and game-over behavior.
4. Demo the MVP before layering on strategic HUD and persistence features.

### Incremental Delivery

1. Add US1 to establish the deterministic playable core.
2. Add US2 to deliver next/hold/ghost and the full desktop HUD.
3. Add US3 to deliver pause/resume, restart, best-score persistence, and structured history.
4. Finish with regression hardening and quickstart validation.

### Parallel Team Strategy

1. One developer owns engine foundations while another prepares persistence scaffolding after Setup.
2. After foundation, one developer can focus on US1 gameplay rules while another prepares HUD shells and non-blocking storage adapters.
3. Once US1 stabilizes, US2 and US3 can progress in parallel with shared checkpoints on selectors, persistence contracts, and overlays.

---

## Notes

- `[P]` tasks are intended for different files with no unmet dependencies.
- Every user story includes tests, UX validation, and performance-sensitive work where applicable.
- Record any new non-trivial tradeoff in `specs/001-classic-tetris/plan.md` before implementation diverges from the current research decisions.
- Keep the game fully client-side; do not add any backend or network requirement while implementing these tasks.
